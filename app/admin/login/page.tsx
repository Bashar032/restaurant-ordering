"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (signInError) {
      setMessage("Fel e-postadress eller lösenord.");
      setLoading(false);
      return;
    }

    // Kontrollera MFA-nivån efter lyckad lösenordsinloggning.
    const {
      data: aalData,
      error: aalError,
    } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (aalError) {
      setMessage(
        "Kunde inte kontrollera tvåfaktorsautentisering.",
      );
      setLoading(false);
      return;
    }

    // Redan verifierad med MFA i denna session.
    if (aalData?.currentLevel === "aal2") {
      window.sessionStorage.setItem(
        "daloona-staff-tab-session",
        "active",
      );

      router.replace("/admin");
      router.refresh();
      return;
    }

    // Kontrollera om användaren redan har en verifierad TOTP-faktor.
    const {
      data: factors,
      error: factorsError,
    } =
      await supabase.auth.mfa.listFactors();

    if (factorsError) {
      setMessage(
        "Kunde inte läsa inställningarna för tvåfaktor.",
      );
      setLoading(false);
      return;
    }

    const verifiedTotp =
      factors?.totp?.find(
        (factor) =>
          factor.status === "verified",
      );

    // MFA finns redan → be om 6-siffrig kod.
    if (verifiedTotp) {
      router.replace("/admin/mfa");
      router.refresh();
      return;
    }

    // Ingen MFA ännu → första setup.
    router.replace("/admin/mfa/setup");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 py-16 text-white">
      <div className="w-full max-w-md border border-white/10 bg-[#24211D] p-7 sm:p-10">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#B08A52]">
          Daloona personal
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Logga in
        </h1>

        <p className="mt-4 leading-7 text-white/55">
          Logga in med e-post och lösenord. Därefter krävs
          en säkerhetskod från din Authenticator-app.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              E-post
            </span>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              Lösenord
            </span>

            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
            />
          </label>

          {message && (
            <div
              role="alert"
              className="border border-[#C98C86] bg-[#5B2925]/50 px-4 py-3 text-sm text-[#FFD5D1]"
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Kontrollerar..."
              : "Fortsätt"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-7 inline-block border-b border-white/30 pb-1 text-sm text-white/60 transition hover:text-white"
        >
          ← Till startsidan
        </Link>
      </div>
    </main>
  );
}