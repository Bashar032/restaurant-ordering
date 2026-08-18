import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffRole = "owner" | "admin" | "kitchen";

type RequireStaffOptions = {
  roles: StaffRole[];
  loginPath?: string;
};

export async function requireStaff({
  roles,
  loginPath = "/admin/login",
}: RequireStaffOptions) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(loginPath);
  }

  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (aalData?.currentLevel !== "aal2") {
    redirect("/admin/mfa");
  }

  const { data: profile, error: profileError } =
    await supabase
      .from("staff_profiles")
      .select("id, full_name, role, active")
      .eq("id", user.id)
      .single();

  if (
    profileError ||
    !profile ||
    !profile.active
  ) {
    await supabase.auth.signOut();
    redirect(loginPath);
  }

  const role = profile.role as StaffRole;

  if (!roles.includes(role)) {
    if (role === "kitchen") {
      redirect("/kitchen");
    }

    redirect("/admin");
  }

  return {
    supabase,
    user,
    profile: {
      ...profile,
      role,
    },
  };
}