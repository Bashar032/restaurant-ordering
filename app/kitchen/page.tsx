import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import KitchenLogoutButton from "@/components/kitchen/KitchenLogoutButton";
import KitchenBoard from "@/components/kitchen/KitchenBoard";
import Link from "next/link";

export default async function KitchenPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/kitchen/login");
  }

  const { data: profile } = await supabase
    .from("staff_profiles")
    .select("full_name, role, active")
    .eq("id", user.id)
    .single();

  if (!profile?.active) {
    await supabase.auth.signOut();
    redirect("/kitchen/login");
  }

  return (
    <main className="min-h-screen bg-[#11100E] text-white">
      <header className="border-b border-white/10 bg-[#171512]">
        <div className="mx-auto flex min-h-24 max-w-[1700px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
              Daloona Kitchen
            </p>

            <p className="mt-1 font-serif text-2xl">
              {profile.full_name}
            </p>
          </div>
<div className="flex flex-wrap items-center gap-3">
  <Link
    href="/admin"
    className="border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition hover:border-[#B08A52] hover:text-white"
  >
    Bokningar
  </Link>

  <Link
    href="/kitchen"
    className="border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition hover:border-[#B08A52] hover:text-white"
  >
    Kök
  </Link>

  <Link
    href="/admin/orders"
    className="border border-white/15 px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white/70 transition hover:border-[#B08A52] hover:text-white"
  >
    Orders
  </Link>

  <KitchenLogoutButton />
</div>   
        </div>
      </header>

      <KitchenBoard />
    </main>
  );
}