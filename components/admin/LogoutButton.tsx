"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    if (pathname.startsWith("/kitchen")) {
      router.replace("/admin/login?next=/kitchen");
    } else {
      router.replace("/admin/login?next=/admin");
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex min-h-11 items-center justify-center bg-red-600 px-5 text-sm font-medium text-white transition hover:bg-red-700"
    >
      Logga ut
    </button>
  );
}