"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function MfaSetupPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [factorId, setFactorId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function setupMfa() {
      setLoading(true);
      setMessage("");

      // Kontrollera att användaren är inloggad.
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (userError || !user) {
        router.replace("/admin/login");
        return;
      }

      // Kontrollera om MFA redan är aktivt.
      const {
        data: aalData,
        error: aalError,
      } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

      if (cancelled) return;

      if (aalError) {
        setMessage(
          "Kunde inte kontrollera tvåfaktorsinställningarna.",
        );
        setLoading(false);
        return;
      }

      if (aalData?.currentLevel === "aal2") {
        window.sessionStorage.setItem(
          "daloona-staff-tab-session",
          "active",
        );

        router.replace("/admin");
        router.refresh();
        return;
      }

      // Hämta befintliga MFA-faktorer.
      const {
        data: factors,
        error: factorsError,
      } =
        await supabase.auth.mfa.listFactors();

      if (cancelled) return;

      if (factorsError) {
        setMessage(
          "Kunde inte läsa befintliga tvåfaktorsinställningar.",
        );
        setLoading(false);
        return;
      }

      const verifiedFactor =
        factors?.totp?.find(
          (factor) =>
            factor.status === "verified",
        );

      // MFA finns redan färdig → gå till kodsidan.
      if (verifiedFactor) {
        router.replace("/admin/mfa");
        router.refresh();
        return;
      }

      // Försök städa bort gamla ofärdiga TOTP-faktorer.
      const unverifiedFactors =
        factors?.totp?.filter(
          (factor) =>
            factor.status !== "verified",
        ) ?? [];

      for (const factor of unverifiedFactors) {
        const { error: unenrollError } =
          await supabase.auth.mfa.unenroll({
            factorId: factor.id,
          });

        if (unenrollError) {
          console.warn(
            "Kunde inte ta bort gammal MFA-faktor:",
            unenrollError,
          );
        }
      }

      if (cancelled) return;

      // Skapa en helt ny faktor.
      // Vi skippar friendlyName för att undvika
      // konflikt med gamla ofärdiga faktorer.
      const {
        data: enrollData,
        error: enrollError,
      } =
        await supabase.auth.mfa.enroll({
          factorType: "totp",
        });

      if (cancelled) return;

      if (enrollError) {
        console.error(
          "MFA enroll error:",
          enrollError,
        );

        setMessage(
          enrollError.message ||
            "Kunde inte skapa tvåfaktorsautentisering.",
        );

        setLoading(false);
        return;
      }

      setFactorId(enrollData.id);
      setQrCode(enrollData.totp.qr_code);
      setSecret(enrollData.totp.secret);
      setLoading(false);
    }

    void setupMfa();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  async function verifySetup(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!factorId) {
      setMessage(
        "Tvåfaktorsinställningen är inte redo ännu.",
      );
      return;
    }

    if (code.trim().length !== 6) {
      setMessage(
        "Skriv den 6-siffriga koden.",
      );
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
      console.error(
        "MFA verify error:",
        error,
      );

      setMessage(
        "Koden kunde inte verifieras. Kontrollera koden i Authenticator-appen och försök igen.",
      );

      setVerifying(false);
      return;
    }

    // Kontrollera att sessionen verkligen blev AAL2.
    const {
      data: aalData,
      error: aalError,
    } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

    if (
      aalError ||
      aalData?.currentLevel !== "aal2"
    ) {
      setMessage(
        "Tvåfaktor verifierades inte korrekt. Försök igen.",
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
        <div className="text-center">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
            Daloona säkerhet
          </p>

          <p className="mt-4 font-serif text-3xl">
            Förbereder tvåfaktorsautentisering...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 py-12 text-white">
      <div className="w-full max-w-lg border border-white/10 bg-[#24211D] p-7 sm:p-10">

        <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
          Daloona säkerhet
        </p>

        <h1 className="mt-4 font-serif text-4xl">
          Aktivera tvåfaktor
        </h1>

        <p className="mt-4 leading-7 text-white/55">
          Skanna QR-koden med Google Authenticator,
          Microsoft Authenticator, Authy eller en annan
          TOTP-app.
        </p>

        {qrCode && (
          <div className="mt-8 rounded-sm bg-white p-5">
            <img
              src={qrCode}
              alt="QR-kod för tvåfaktorsautentisering"
              className="mx-auto h-auto max-w-[260px]"
            />
          </div>
        )}

        {secret && (
          <div className="mt-5 border border-white/10 bg-[#171512] p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-white/40">
              Kan du inte skanna QR-koden?
            </p>

            <p className="mt-2 break-all font-mono text-sm text-[#D4B27C]">
              {secret}
            </p>

            <p className="mt-3 text-xs leading-5 text-white/35">
              Spara inte denna nyckel på en offentlig plats och skicka den inte till någon.
            </p>
          </div>
        )}

        <form
          onSubmit={verifySetup}
          className="mt-7"
        >
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              6-siffrig kod
            </span>

            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
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
              className="mt-2 min-h-14 w-full border border-white/15 bg-[#171512] px-4 text-center font-mono text-2xl tracking-[0.35em] text-white outline-none focus:border-[#B08A52]"
            />
          </label>

          {message && (
            <div className="mt-5 border border-red-500/40 bg-red-950/40 p-4 text-sm leading-6 text-red-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={
              verifying ||
              !factorId
            }
            className="mt-6 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verifying
              ? "Verifierar..."
              : "Aktivera tvåfaktor"}
          </button>
        </form>
      </div>
    </main>
  );
}