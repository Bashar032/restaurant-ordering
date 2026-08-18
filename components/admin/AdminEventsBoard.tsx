"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type EventRequest = {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  event_date: string;
  start_time: string;
  guests: number;
  event_type: string;
  message: string | null;
  status: "pending" | "approved" | "declined" | "cancelled";
  created_at: string;
};

function statusLabel(status: EventRequest["status"]) {
  switch (status) {
    case "pending":
      return "Väntar";
    case "approved":
      return "Godkänd";
    case "declined":
      return "Nekad";
    case "cancelled":
      return "Avbokad";
  }
}

export default function AdminEventsBoard() {
  const supabase = useMemo(() => createClient(), []);

  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    const { data, error } = await supabase.rpc(
      "get_private_event_requests",
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setRequests((data ?? []) as EventRequest[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadRequests();

    const interval = window.setInterval(() => {
      void loadRequests();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadRequests]);

  async function updateStatus(
    request: EventRequest,
    status: "approved" | "declined",
  ) {
    setMessage("");
    setUpdatingId(request.id);

    const { error } = await supabase.rpc(
      "update_private_event_status",
      {
        p_request_id: request.id,
        p_status: status,
      },
    );

    if (error) {
      setMessage(error.message);
      setUpdatingId(null);
      return;
    }

    try {
      const response = await fetch(
        "/api/private-event-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: request.email,
            customerName: request.customer_name,
            eventDate: request.event_date,
            startTime: request.start_time,
            guests: request.guests,
            eventType: request.event_type,
            status,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setMessage(
          result.error ??
            "Statusen ändrades, men mejlet kunde inte skickas.",
        );
      }
    } catch {
      setMessage(
        "Statusen ändrades, men mejlet kunde inte skickas.",
      );
    }

    await loadRequests();
    setUpdatingId(null);
  }

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <p className="font-serif text-4xl">
          Laddar event...
        </p>
      </section>
    );
  }

  const pending = requests.filter(
    (item) => item.status === "pending",
  );

  const handled = requests.filter(
    (item) => item.status !== "pending",
  );

  return (
    <section className="px-5 py-12 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
              Privata event
            </p>

            <h1 className="mt-4 font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.85]">
              Event.
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-white/50">
              Här hanterar ni förfrågningar om hela restaurangen
              och större sällskap.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.04] px-6 py-5">
            <p className="text-sm text-white/40">
              Väntar på svar
            </p>

            <p className="mt-1 font-serif text-4xl">
              {pending.length}
            </p>
          </div>
        </div>

        {message && (
          <div className="mt-8 border border-red-500/40 bg-red-950/40 p-5 text-red-200">
            {message}
          </div>
        )}

        {pending.length === 0 ? (
          <div className="mt-10 border border-dashed border-white/15 px-6 py-16 text-center">
            <p className="font-serif text-3xl">
              Inga nya eventförfrågningar
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 xl:grid-cols-2">
            {pending.map((request) => (
              <EventCard
                key={request.id}
                request={request}
                updating={updatingId === request.id}
                onApprove={() =>
                  updateStatus(request, "approved")
                }
                onDecline={() =>
                  updateStatus(request, "declined")
                }
              />
            ))}
          </div>
        )}

        {handled.length > 0 && (
          <div className="mt-16 border-t border-white/10 pt-10">
            <h2 className="font-serif text-3xl text-white/65">
              Hanterade förfrågningar
            </h2>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {handled.map((request) => (
                <EventCard
                  key={request.id}
                  request={request}
                  updating={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({
  request,
  updating,
  onApprove,
  onDecline,
}: {
  request: EventRequest;
  updating: boolean;
  onApprove?: () => void;
  onDecline?: () => void;
}) {
  return (
    <article className="border border-white/10 bg-[#211E1A]">
      <div className="flex flex-wrap items-start justify-between gap-5 border-b border-white/10 p-6">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#B08A52]">
            {request.event_type}
          </p>

          <h2 className="mt-2 font-serif text-3xl">
            {request.customer_name}
          </h2>

          <p className="mt-2 text-sm text-white/45">
            {request.guests} personer
          </p>
        </div>

        <span className="border border-[#B08A52]/40 px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#D4B27C]">
          {statusLabel(request.status)}
        </span>
      </div>

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Info
            label="Datum"
            value={request.event_date}
          />

          <Info
            label="Starttid"
            value={request.start_time.slice(0, 5)}
          />

          <Info
            label="Telefon"
            value={request.phone}
          />

          <Info
            label="E-post"
            value={request.email}
          />
        </div>

        {request.message && (
          <div className="mt-6 border-l-4 border-[#B08A52] bg-[#B08A52]/10 p-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#D4B27C]">
              Kundens meddelande
            </p>

            <p className="mt-2 leading-7 text-white/75">
              {request.message}
            </p>
          </div>
        )}

        {request.status === "pending" && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onApprove}
              disabled={updating}
              className="min-h-12 bg-[#315C39] px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#C7E5CC] transition hover:bg-[#3F7449] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? "Behandlar..."
                : "Godkänn"}
            </button>

            <button
              type="button"
              onClick={onDecline}
              disabled={updating}
              className="min-h-12 bg-[#5B2925] px-5 text-xs font-bold uppercase tracking-[0.16em] text-[#FFD5D1] transition hover:bg-[#74342E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating
                ? "Behandlar..."
                : "Neka"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-[#171512] p-4">
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/35">
        {label}
      </p>

      <p className="mt-2 break-words text-sm text-white/80">
        {value}
      </p>
    </div>
  );
}