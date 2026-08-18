import { NextRequest, NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

type StaffRole = "admin" | "kitchen";

type CreateStaffBody = {
  fullName?: string;
  email?: string;
  password?: string;
  role?: StaffRole;
};

type UpdateStaffBody = {
  id?: string;
  active?: boolean;
};

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const secretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !secretKey) {
    throw new Error(
      "Supabase server-inställningarna saknas.",
    );
  }

  return createAdminClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    },
  );
}

async function requireOwner() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: NextResponse.json(
        { error: "Du är inte inloggad." },
        { status: 401 },
      ),
    };
  }

  // Kräv verifierad 2FA.
  const {
    data: aalData,
    error: aalError,
  } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (
    aalError ||
    aalData?.currentLevel !== "aal2"
  ) {
    return {
      error: NextResponse.json(
        {
          error:
            "Tvåfaktorsautentisering krävs.",
        },
        { status: 403 },
      ),
    };
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("staff_profiles")
    .select("id, full_name, role, active")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !profile.active ||
    profile.role !== "owner"
  ) {
    return {
      error: NextResponse.json(
        {
          error:
            "Endast huvudägaren kan hantera personal.",
        },
        { status: 403 },
      ),
    };
  }

  return {
    user,
    profile,
  };
}

/* =========================================================
   GET – HÄMTA PERSONAL
========================================================= */

export async function GET() {
  try {
    const access = await requireOwner();

    if ("error" in access) {
      return access.error;
    }

    const admin = getAdminClient();

    const {
      data: profiles,
      error: profilesError,
    } = await admin
      .from("staff_profiles")
      .select(
        "id, full_name, role, active, created_at",
      )
      .order("created_at", {
        ascending: true,
      });

    if (profilesError) {
      console.error(
        "Kunde inte läsa staff_profiles:",
        profilesError,
      );

      return NextResponse.json(
        {
          error:
            "Personalen kunde inte hämtas.",
        },
        { status: 500 },
      );
    }

    const staff = await Promise.all(
      (profiles ?? []).map(
        async (profile) => {
          const {
            data: userData,
          } =
            await admin.auth.admin.getUserById(
              profile.id,
            );

          return {
            ...profile,
            email:
              userData.user?.email ?? "",
          };
        },
      ),
    );

    return NextResponse.json({
      staff,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/staff:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ett oväntat fel uppstod.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   POST – SKAPA PERSONAL
========================================================= */

export async function POST(
  request: NextRequest,
) {
  try {
    const access = await requireOwner();

    if ("error" in access) {
      return access.error;
    }

    const body =
      (await request.json()) as CreateStaffBody;

    const fullName =
      body.fullName?.trim() ?? "";

    const email =
      body.email
        ?.trim()
        .toLowerCase() ?? "";

    const password =
      body.password ?? "";

    const role = body.role;

    if (fullName.length < 2) {
      return NextResponse.json(
        {
          error:
            "Ange personalens namn.",
        },
        { status: 400 },
      );
    }

    if (
      !email ||
      !email.includes("@")
    ) {
      return NextResponse.json(
        {
          error:
            "Ange en giltig e-postadress.",
        },
        { status: 400 },
      );
    }

    if (password.length < 12) {
      return NextResponse.json(
        {
          error:
            "Det tillfälliga lösenordet måste vara minst 12 tecken.",
        },
        { status: 400 },
      );
    }

    if (
      role !== "admin" &&
      role !== "kitchen"
    ) {
      return NextResponse.json(
        {
          error: "Ogiltig roll.",
        },
        { status: 400 },
      );
    }

    const admin = getAdminClient();

    // Skapa Auth-användaren.
    const {
      data: created,
      error: createError,
    } =
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
        },
      });

    if (createError || !created.user) {
      console.error(
        "Kunde inte skapa Auth-användare:",
        createError,
      );

      const duplicate =
        createError?.message
          ?.toLowerCase()
          .includes("already") ||
        createError?.message
          ?.toLowerCase()
          .includes("registered");

      return NextResponse.json(
        {
          error: duplicate
            ? "Det finns redan ett konto med den e-postadressen."
            : "Personalkontot kunde inte skapas.",
        },
        {
          status: duplicate
            ? 409
            : 500,
        },
      );
    }

    const userId =
      created.user.id;

    // Skapa staff_profile.
    const {
      error: profileError,
    } = await admin
      .from("staff_profiles")
      .insert({
        id: userId,
        full_name: fullName,
        role,
        active: true,
      });

    if (profileError) {
      console.error(
        "Kunde inte skapa staff_profile:",
        profileError,
      );

      // Rollback så vi inte lämnar ett Auth-konto
      // utan staff_profile.
      await admin.auth.admin.deleteUser(
        userId,
      );

      return NextResponse.json(
        {
          error:
            "Personalprofilen kunde inte skapas.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        staff: {
          id: userId,
          full_name: fullName,
          email,
          role,
          active: true,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/admin/staff:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ett oväntat fel uppstod.",
      },
      { status: 500 },
    );
  }
}

/* =========================================================
   PATCH – AKTIVERA / STÄNG AV PERSONAL
========================================================= */

export async function PATCH(
  request: NextRequest,
) {
  try {
    const access = await requireOwner();

    if ("error" in access) {
      return access.error;
    }

    const body =
      (await request.json()) as UpdateStaffBody;

    if (
      !body.id ||
      typeof body.active !== "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "Ogiltiga uppgifter.",
        },
        { status: 400 },
      );
    }

    if (
      body.id === access.user.id
    ) {
      return NextResponse.json(
        {
          error:
            "Du kan inte stänga av ditt eget owner-konto.",
        },
        { status: 400 },
      );
    }

    const admin = getAdminClient();

    const {
      data: target,
      error: targetError,
    } = await admin
      .from("staff_profiles")
      .select("id, role")
      .eq("id", body.id)
      .single();

    if (
      targetError ||
      !target
    ) {
      return NextResponse.json(
        {
          error:
            "Personalen kunde inte hittas.",
        },
        { status: 404 },
      );
    }

    if (target.role === "owner") {
      return NextResponse.json(
        {
          error:
            "Owner-konton kan inte ändras här.",
        },
        { status: 403 },
      );
    }

    const { error } = await admin
      .from("staff_profiles")
      .update({
        active: body.active,
      })
      .eq("id", body.id);

    if (error) {
      console.error(
        "Kunde inte ändra personalstatus:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Personalkontot kunde inte uppdateras.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/staff:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Ett oväntat fel uppstod.",
      },
      { status: 500 },
    );
  }
}