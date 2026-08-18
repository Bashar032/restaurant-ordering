"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const eventTypes = [
  "Studentfest",
  "Födelsedag",
  "Företagsevent",
  "Privat fest",
  "Bröllop / förlovning",
  "Annat",
];

export default function PrivateEventsPage() {
  const supabase = useMemo(() => createClient(), []);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("18:00");
  const [guests, setGuests] = useState(50);
  const [eventType, setEventType] = useState("Studentfest");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    const { data, error: requestError } = await supabase.rpc(
      "create_private_event_request",
      {
        p_customer_name: customerName.trim(),
        p_phone: phone.trim(),
        p_email: email.trim().toLowerCase(),
        p_event_date: eventDate,
        p_start_time: startTime,
        p_guests: guests,
        p_event_type: eventType,
        p_message: message.trim() || null,
      },
    );

    if (requestError) {
      setError(requestError.message);
      setSubmitting(false);
      return;
    }

    setRequestId(String(data ?? ""));
    setSuccess(true);
    setSubmitting(false);
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] px-5 text-white">
        <div className="w-full max-w-2xl border border-white/10 bg-[#211E1A] p-8 text-center sm:p-12">
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
            Daloona Private Events
          </p>

          <h1 className="mt-5 font-serif text-5xl sm:text-6xl">
            Förfrågan är skickad.
          </h1>

          <p className="mx-auto mt-6 max-w-xl leading-8 text-white/60">
            Tack {customerName}. Daloona har fått din förfrågan för {guests} personer
            och återkommer efter att personalen har kontrollerat datum och upplägg.
          </p>

          {requestId && (
            <p className="mt-6 text-sm text-white/40">
              Referens:{" "}
              <strong className="text-[#D4B27C]">
                {requestId.slice(0, 8).toUpperCase()}
              </strong>
            </p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center border border-white/15 px-6 text-xs font-bold uppercase tracking-[0.18em] text-white/75 transition hover:border-[#B08A52] hover:text-white"
            >
              Till startsidan
            </Link>

            <Link
              href="/booking"
              className="inline-flex min-h-12 items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.18em] text-[#191815] transition hover:bg-[#C29B61]"
            >
              Vanlig bordsbokning
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex min-h-24 max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-14">
          <Link
            href="/"
            className="font-serif text-2xl"
          >
            Daloona
          </Link>

          <Link
            href="/booking"
            className="border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-[#B08A52] hover:text-white"
          >
            Boka bord
          </Link>
        </div>
      </header>

      <section className="px-5 py-14 sm:px-8 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
                Privata event
              </p>

              <h1 className="mt-5 font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.88] tracking-[-0.04em]">
                Boka hela Daloona.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg">
                Planerar ni studentfest, födelsedag, företagsevent eller ett
                större privat sällskap? Skicka en förfrågan så återkommer vi
                med tillgänglighet och upplägg.
              </p>

              <div className="mt-10 border-l-4 border-[#B08A52] bg-white/[0.04] p-6">
                <p className="font-serif text-2xl">
                  Detta är en förfrågan
                </p>

                <p className="mt-3 leading-7 text-white/50">
                  Eventet är inte bekräftat förrän Daloona har godkänt
                  förfrågan och kontaktat er.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border border-white/10 bg-[#211E1A] p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Namn
                  </span>

                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Telefon
                  </span>

                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    E-post
                  </span>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Datum
                  </span>

                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Starttid
                  </span>

                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(event) => setStartTime(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Antal personer
                  </span>

                  <input
                    type="number"
                    required
                    min={10}
                    max={300}
                    value={guests}
                    onChange={(event) => setGuests(Number(event.target.value))}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  />
                </label>

                <label>
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Typ av event
                  </span>

                  <select
                    value={eventType}
                    onChange={(event) => setEventType(event.target.value)}
                    className="mt-2 min-h-12 w-full border border-white/15 bg-[#171512] px-4 text-white outline-none focus:border-[#B08A52]"
                  >
                    {eventTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-[0.16em]">
                    Berätta om eventet
                  </span>

                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    rows={6}
                    maxLength={1500}
                    placeholder="Exempel: studentfest för cirka 50 personer, önskemål om mat, musik eller annan information..."
                    className="mt-2 w-full resize-none border border-white/15 bg-[#171512] p-4 text-white outline-none placeholder:text-white/25 focus:border-[#B08A52]"
                  />
                </label>
              </div>

              {error && (
                <div className="mt-6 border border-red-500/40 bg-red-950/40 p-4 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Skickar förfrågan..."
                  : "Skicka eventförfrågan"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}