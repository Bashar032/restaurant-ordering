"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminMfaPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFactor() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/admin/login");
        return;
      }

      const { data: aal } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (aal?.currentLevel === "aal2") {
        window.sessionStorage.setItem(
          "daloona-staff-tab-session",
          "active",
        );

        router.replace("/admin");
        return;
      }

      const { data, error } =
        await supabase.auth.mfa.listFactors();

      if (cancelled) return;

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      const verifiedFactor =
        data?.totp?.find(
          (factor) =>
            factor.status === "verified",
        );

      if (!verifiedFactor) {
        router.replace("/admin/mfa/setup");
        return;
      }

      setFactorId(verifiedFactor.id);
      setLoading(false);
    }

    void loadFactor();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function verifyCode(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!factorId) return;

    if (code.trim().length !== 6) {
      setMessage("Skriv den 6-siffriga koden.");
      return;
    }

    setVerifying(true);
    setMessage("");

    const { error } =
      await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      });

    if (error) {
      setMessage(
        "Fel kod. Kontrollera Authenticator-appen och försök igen.",
      );

      setVerifying(false);
      return;
    }

    window.sessionStorage.setItem(
      "daloona-staff-tab-session",
      "active",
    );

    router.replace("/admin");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 text-white">
        <p className="font-serif text-3xl">
          Kontrollerar säkerheten...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 py-12 text-white">
      <div className="w-full max-w-md border border-white/10 bg-[#24211D] p-7 sm:p-10">
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
          Daloona säkerhet
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Säkerhetskod
        </h1>

        <p className="mt-4 leading-7 text-white/55">
          Öppna din Authenticator-app och skriv den
          6-siffriga koden för Daloona.
        </p>

        <form
          onSubmit={verifyCode}
          className="mt-8"
        >
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) =>
              setCode(
                event.target.value.replace(
                  /\D/g,
                  "",
                ),
              )
            }
            placeholder="000000"
            autoFocus
            className="min-h-16 w-full border border-white/15 bg-[#171512] px-4 text-center font-mono text-3xl tracking-[0.4em] text-white outline-none focus:border-[#B08A52]"
          />

          {message && (
            <div className="mt-5 border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={verifying}
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:opacity-50"
          >
            {verifying
              ? "Verifierar..."
              : "Verifiera och logga in"}
          </button>
        </form>
      </div>
    </main>
  );
}