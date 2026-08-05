import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminFloorManager from "../../components/admin/AdminFloorManager";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("full_name, role, active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-24 max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-14">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#B08A52]">
              Daloona admin
            </p>
            <p className="mt-1 font-serif text-2xl">{profile.full_name}</p>
          </div>

          <LogoutButton />
        </div>
      </header>

      <AdminFloorManager />
    </main>
  );
}