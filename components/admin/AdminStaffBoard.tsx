"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

type StaffRole =
  | "owner"
  | "admin"
  | "kitchen";

type StaffMember = {
  id: string;
  full_name: string;
  email: string;
  role: StaffRole;
  active: boolean;
  created_at?: string;
};

function roleLabel(
  role: StaffRole,
) {
  switch (role) {
    case "owner":
      return "Huvudägare";
    case "admin":
      return "Chef";
    case "kitchen":
      return "Kök";
  }
}

export default function AdminStaffBoard() {
  const [staff, setStaff] =
    useState<StaffMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState<"admin" | "kitchen">(
      "admin",
    );

  const loadStaff =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/admin/staff",
            {
              method: "GET",
              cache: "no-store",
            },
          );

        const result =
          await response.json();

        if (!response.ok) {
          setMessage(
            result.error ??
              "Personalen kunde inte hämtas.",
          );

          setLoading(false);
          return;
        }

        setStaff(
          result.staff ?? [],
        );

        setLoading(false);
      } catch {
        setMessage(
          "Kunde inte ansluta till servern.",
        );

        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  async function createStaff(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setSuccessMessage("");

    if (password.length < 12) {
      setMessage(
        "Lösenordet måste vara minst 12 tecken.",
      );
      return;
    }

    setSubmitting(true);

    try {
      const response =
        await fetch(
          "/api/admin/staff",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              fullName,
              email,
              password,
              role,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Kontot kunde inte skapas.",
        );

        setSubmitting(false);
        return;
      }

      setSuccessMessage(
        `${fullName} har lagts till som ${
          role === "admin"
            ? "chef"
            : "kökspersonal"
        }.`,
      );

      setFullName("");
      setEmail("");
      setPassword("");
      setRole("admin");

      await loadStaff();
    } catch {
      setMessage(
        "Kunde inte ansluta till servern.",
      );
    }

    setSubmitting(false);
  }

  async function toggleActive(
    member: StaffMember,
  ) {
    if (
      member.role === "owner"
    ) {
      return;
    }

    const nextActive =
      !member.active;

    const confirmed =
      window.confirm(
        nextActive
          ? `Aktivera kontot för ${member.full_name}?`
          : `Stäng av kontot för ${member.full_name}?`,
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setSuccessMessage("");
    setUpdatingId(member.id);

    try {
      const response =
        await fetch(
          "/api/admin/staff",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: member.id,
              active: nextActive,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Kontot kunde inte uppdateras.",
        );

        setUpdatingId(null);
        return;
      }

      setSuccessMessage(
        nextActive
          ? `${member.full_name} är nu aktiv.`
          : `${member.full_name} är nu avstängd.`,
      );

      await loadStaff();
    } catch {
      setMessage(
        "Kunde inte ansluta till servern.",
      );
    }

    setUpdatingId(null);
  }

  return (
    <section className="px-5 py-12 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-12 xl:grid-cols-[0.75fr_1.25fr]">

          {/* SKAPA PERSONAL */}

          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
              Behörighet
            </p>

            <h1 className="mt-4 font-serif text-[clamp(4rem,7vw,7rem)] leading-[0.88]">
              Personal.
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-white/50">
              Lägg till chefer och
              kökspersonal. Varje person
              får ett eget konto och
              registrerar sin egen
              tvåfaktorsautentisering.
            </p>

            <form
              onSubmit={createStaff}
              className="mt-10 border border-white/10 bg-[#211E1A] p-6 sm:p-8"
            >
              <p className="font-serif text-3xl">
                Lägg till personal
              </p>

              <div className="mt-7 space-y-5">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Namn
                  </span>

                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(
                      event,
                    ) =>
                      setFullName(
                        event.target
                          .value,
                      )
                    }
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    E-post
                  </span>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(
                      event,
                    ) =>
                      setEmail(
                        event.target
                          .value,
                      )
                    }
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Tillfälligt lösenord
                  </span>

                  <input
                    type="password"
                    required
                    minLength={12}
                    autoComplete="new-password"
                    value={password}
                    onChange={(
                      event,
                    ) =>
                      setPassword(
                        event.target
                          .value,
                      )
                    }
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />

                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Minst 12 tecken.
                    Ge lösenordet till
                    personen på ett säkert
                    sätt.
                  </p>
                </label>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Roll
                  </span>

                  <select
                    value={role}
                    onChange={(
                      event,
                    ) =>
                      setRole(
                        event.target
                          .value as
                          | "admin"
                          | "kitchen",
                      )
                    }
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  >
                    <option value="admin">
                      Chef / Admin
                    </option>

                    <option value="kitchen">
                      Kökspersonal
                    </option>
                  </select>
                </label>
              </div>

              {message && (
                <div className="mt-6 border border-red-500/40 bg-red-950/40 p-4 text-sm leading-6 text-red-200">
                  {message}
                </div>
              )}

              {successMessage && (
                <div className="mt-6 border border-green-500/30 bg-green-950/30 p-4 text-sm leading-6 text-green-200">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Skapar konto..."
                  : "Lägg till personal"}
              </button>
            </form>
          </div>

          {/* PERSONAL-LISTA */}

          <div>
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
                  Daloona team
                </p>

                <h2 className="mt-3 font-serif text-4xl">
                  Konton
                </h2>
              </div>

              <div className="border border-white/10 px-5 py-3">
                <p className="text-xs text-white/40">
                  Aktiva
                </p>

                <p className="mt-1 font-serif text-2xl">
                  {
                    staff.filter(
                      (member) =>
                        member.active,
                    ).length
                  }
                </p>
              </div>
            </div>

            {loading ? (
              <div className="mt-8 border border-dashed border-white/15 p-12 text-center">
                <p className="font-serif text-3xl">
                  Hämtar personal...
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {staff.map(
                  (member) => (
                    <article
                      key={member.id}
                      className="border border-white/10 bg-[#211E1A] p-6"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-serif text-3xl">
                              {
                                member.full_name
                              }
                            </h3>

                            <span className="border border-[#B08A52]/40 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-[#D4B27C]">
                              {roleLabel(
                                member.role,
                              )}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-white/45">
                            {member.email ||
                              "Ingen e-post"}
                          </p>

                          <p
                            className={`mt-3 text-xs font-bold uppercase tracking-[0.16em] ${
                              member.active
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {member.active
                              ? "● Aktiv"
                              : "● Avstängd"}
                          </p>
                        </div>

                        {member.role ===
                        "owner" ? (
                          <div className="border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.15em] text-white/35">
                            Huvudkonto
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              updatingId ===
                              member.id
                            }
                            onClick={() =>
                              toggleActive(
                                member,
                              )
                            }
                            className={`min-h-12 border px-5 text-xs font-bold uppercase tracking-[0.15em] transition disabled:opacity-50 ${
                              member.active
                                ? "border-red-500/40 text-red-300 hover:bg-red-950/30"
                                : "border-green-500/40 text-green-300 hover:bg-green-950/30"
                            }`}
                          >
                            {updatingId ===
                            member.id
                              ? "Arbetar..."
                              : member.active
                                ? "Stäng av"
                                : "Aktivera"}
                          </button>
                        )}
                      </div>
                    </article>
                  ),
                )}

                {staff.length === 0 && (
                  <div className="border border-dashed border-white/15 p-12 text-center">
                    Ingen personal
                    hittades.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}