"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SESSION_KEY = "daloona-staff-tab-session";

export default function StaffSessionGuard() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const supabase = createClient();

      // 1. Kontrollera att användaren fortfarande är inloggad.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError || !user) {
        window.sessionStorage.removeItem(SESSION_KEY);

        router.replace("/admin/login");
        router.refresh();
        return;
      }

      // 2. Kontrollera riktig MFA-nivå hos Supabase.
      const {
        data: aalData,
        error: aalError,
      } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (cancelled) {
        return;
      }

      if (aalError) {
        window.sessionStorage.removeItem(SESSION_KEY);

        await supabase.auth.signOut();

        router.replace("/admin/login");
        router.refresh();
        return;
      }

      // 3. Ingen verifierad 2FA i denna session.
      if (aalData?.currentLevel !== "aal2") {
        window.sessionStorage.removeItem(SESSION_KEY);

        // MFA finns på kontot men behöver verifieras.
        if (aalData?.nextLevel === "aal2") {
          router.replace("/admin/mfa");
          router.refresh();
          return;
        }

        // Ingen MFA registrerad ännu.
        router.replace("/admin/mfa/setup");
        router.refresh();
        return;
      }

      // 4. MFA är godkänd.
      // Kontrollera även att just denna flik är godkänd.
      const hasTabSession =
        window.sessionStorage.getItem(SESSION_KEY);

      if (hasTabSession !== "active") {
        // Fliken har stängts/ny flik har öppnats.
        // Tvinga fram ny fullständig inloggning.
        await supabase.auth.signOut();

        if (cancelled) {
          return;
        }

        router.replace("/admin/login");
        router.refresh();
      }
    }

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}

export function markStaffTabSession() {
  window.sessionStorage.setItem(
    SESSION_KEY,
    "active",
  );
}