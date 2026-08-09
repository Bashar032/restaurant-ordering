"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  note: string | null;
};

type AdminOrder = {
  order_id: string;
  order_number: string;
  table_number: string;
  status: string;
  customer_note: string | null;

  total_amount: number;

  created_at: string;
  preparing_at: string | null;
  ready_at: string | null;
  served_at: string | null;

  preparation_minutes: number | null;
  total_service_minutes: number | null;

  items: OrderItem[];
};

function getLocalToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

function changeDate(date: string, days: number) {
  const current = new Date(`${date}T12:00:00`);

  current.setDate(current.getDate() + days);

  const offset = current.getTimezoneOffset();

  return new Date(current.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

function formatSelectedDate(date: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

function formatTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(status: string) {
  switch (status) {
    case "new":
      return "Ny";

    case "preparing":
      return "Tillagas";

    case "ready":
      return "Klar";

    case "served":
      return "Serverad";

    case "cancelled":
      return "Avbokad";

    default:
      return status;
  }
}

function average(
  values: Array<number | null>,
) {
  const available = values.filter(
    (value): value is number =>
      typeof value === "number",
  );

  if (available.length === 0) {
    return null;
  }

  return Math.round(
    available.reduce(
      (sum, value) => sum + value,
      0,
    ) / available.length,
  );
}

export default function AdminOrdersBoard() {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const today = useMemo(
    () => getLocalToday(),
    [],
  );

  const [selectedDate, setSelectedDate] =
    useState(today);

  const [orders, setOrders] = useState<
    AdminOrder[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const loadOrders = useCallback(
    async (date: string) => {
      setLoading(true);
      setMessage("");

      const { data, error } =
        await supabase.rpc(
          "get_admin_order_history",
          {
            p_date: date,
          },
        );

      if (error) {
        setMessage(error.message);
        setOrders([]);
        setLoading(false);
        return;
      }

      setOrders(
        (data ?? []) as AdminOrder[],
      );

      setLoading(false);
    },
    [supabase],
  );

  useEffect(() => {
    void loadOrders(selectedDate);
  }, [loadOrders, selectedDate]);

  useEffect(() => {
    const channel = supabase
      .channel("admin-order-history")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_orders",
        },
        () => {
          void loadOrders(selectedDate);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_order_items",
        },
        () => {
          void loadOrders(selectedDate);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [
    loadOrders,
    selectedDate,
    supabase,
  ]);

  const completedOrders = orders.filter(
    (order) =>
      order.status !== "cancelled",
  );

  const totalRevenue =
    completedOrders.reduce(
      (sum, order) =>
        sum + order.total_amount,
      0,
    );

  const averageKitchenMinutes = average(
    completedOrders.map(
      (order) =>
        order.preparation_minutes,
    ),
  );

  const averageServiceMinutes = average(
    completedOrders.map(
      (order) =>
        order.total_service_minutes,
    ),
  );

  const totalItems =
    completedOrders.reduce(
      (sum, order) =>
        sum +
        order.items.reduce(
          (itemSum, item) =>
            itemSum + item.quantity,
          0,
        ),
      0,
    );

  function goPreviousDay() {
    setSelectedDate((current) =>
      changeDate(current, -1),
    );
  }

  function goNextDay() {
    setSelectedDate((current) =>
      changeDate(current, 1),
    );
  }

  function goToday() {
    setSelectedDate(today);
  }

  return (
    <section className="px-5 py-12 sm:px-8 lg:px-14 lg:py-16">
      <div className="mx-auto max-w-[1600px]">

        {/* RUBRIK */}

        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
            QR-beställningar
          </p>

          <h1 className="mt-4 font-serif text-[clamp(4rem,8vw,8rem)] leading-[0.85] tracking-[-0.04em]">
            Orders.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/50">
            Historik över beställningar,
            försäljning och kökets
            serveringstider.
          </p>
        </div>

        {/* DATUM */}

        <div className="mt-10 border border-white/10 bg-[#211E1A] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-5">

            <button
              type="button"
              onClick={goPreviousDay}
              className="border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#B08A52]"
            >
              ← Föregående dag
            </button>

            <div className="text-center">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#B08A52]">
                Vald dag
              </p>

              <p className="mt-2 font-serif text-2xl capitalize sm:text-3xl">
                {formatSelectedDate(
                  selectedDate,
                )}
              </p>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value,
                  )
                }
                className="mt-4 border border-white/15 bg-[#171512] px-4 py-2 text-sm text-white outline-none focus:border-[#B08A52]"
              />
            </div>

            <button
              type="button"
              onClick={goNextDay}
              disabled={
                selectedDate >= today
              }
              className="border border-white/15 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition hover:border-[#B08A52] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Nästa dag →
            </button>
          </div>

          {selectedDate !== today && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={goToday}
                className="text-xs font-bold uppercase tracking-[0.16em] text-[#D4B27C] underline underline-offset-4"
              >
                Gå till idag
              </button>
            </div>
          )}
        </div>

        {/* STATISTIK */}

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Orders"
            value={String(
              completedOrders.length,
            )}
          />

          <StatCard
            label="Produkter"
            value={String(totalItems)}
          />

          <StatCard
            label="Försäljning"
            value={`${totalRevenue.toLocaleString(
              "sv-SE",
            )} kr`}
          />

          <StatCard
            label="Snitt kökstid"
            value={
              averageKitchenMinutes ===
              null
                ? "—"
                : `${averageKitchenMinutes} min`
            }
          />

          <StatCard
            label="Snitt servicetid"
            value={
              averageServiceMinutes ===
              null
                ? "—"
                : `${averageServiceMinutes} min`
            }
          />
        </div>

        {message && (
          <div className="mt-8 border border-red-500/40 bg-red-950/40 p-5 text-red-200">
            {message}
          </div>
        )}

        {/* ORDERS */}

        {loading ? (
          <div className="mt-10 border border-white/10 px-6 py-20 text-center">
            <p className="font-serif text-4xl">
              Laddar orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="font-serif text-4xl">
              Inga orders
            </p>

            <p className="mt-3 text-white/45">
              Det finns inga registrerade
              QR-beställningar den här dagen.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.04] p-5">
      <p className="text-xs text-white/40">
        {label}
      </p>

      <p className="mt-2 font-serif text-3xl text-white">
        {value}
      </p>
    </div>
  );
}

function OrderCard({
  order,
}: {
  order: AdminOrder;
}) {
  const cancelled =
    order.status === "cancelled";

  return (
    <article
      className={`overflow-hidden border border-white/10 bg-[#211E1A] ${
        cancelled ? "opacity-60" : ""
      }`}
    >
      {/* ORDER HEADER */}

      <div className="grid gap-5 border-b border-white/10 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[#B08A52]">
            {order.order_number}
          </p>

          <h2 className="mt-2 font-serif text-4xl">
            {order.table_number.toUpperCase() ===
            "LOUNGE"
              ? "Lounge"
              : `Bord ${order.table_number}`}
          </h2>

          <p className="mt-2 text-sm text-white/40">
            Order mottagen{" "}
            {formatTime(
              order.created_at,
            )}
          </p>
        </div>

        <div className="sm:text-right">
          <span className="inline-block border border-[#B08A52]/40 px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#D4B27C]">
            {getStatusLabel(
              order.status,
            )}
          </span>

          <p className="mt-4 font-serif text-4xl text-[#D4B27C]">
            {order.total_amount.toLocaleString(
              "sv-SE",
            )}{" "}
            kr
          </p>
        </div>
      </div>

      <div className="grid gap-8 p-5 lg:grid-cols-[1.2fr_0.8fr] lg:p-7">

        {/* PRODUKTER */}

        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/40">
            Beställning
          </p>

          <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
            {order.items.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-5 py-4"
                >
                  <div>
                    <p className="font-serif text-xl">
                      {item.quantity} ×{" "}
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {item.unit_price} kr
                      / st
                    </p>

                    {item.note && (
                      <p className="mt-2 text-sm font-bold text-[#D4B27C]">
                        {item.note}
                      </p>
                    )}
                  </div>

                  <p className="font-serif text-xl text-[#D4B27C]">
                    {item.line_total} kr
                  </p>
                </div>
              ),
            )}
          </div>

          {order.customer_note && (
            <div className="mt-5 border-l-4 border-[#B08A52] bg-[#B08A52]/10 p-4">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[#D4B27C]">
                Kundens kommentar
              </p>

              <p className="mt-2 leading-6 text-white/75">
                {order.customer_note}
              </p>
            </div>
          )}
        </div>

        {/* TIDSLINJE */}

        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/40">
            Kök & servering
          </p>

          <div className="mt-4 border border-white/10">
            <TimelineRow
              label="Order mottagen"
              value={formatTime(
                order.created_at,
              )}
            />

            <TimelineRow
              label="Tillagning började"
              value={formatTime(
                order.preparing_at,
              )}
            />

            <TimelineRow
              label="Klar"
              value={formatTime(
                order.ready_at,
              )}
            />

            <TimelineRow
              label="Serverad"
              value={formatTime(
                order.served_at,
              )}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-[#171512] p-4">
              <p className="text-xs text-white/40">
                Kökstid
              </p>

              <p className="mt-2 font-serif text-3xl text-[#D4B27C]">
                {order.preparation_minutes ===
                null
                  ? "—"
                  : `${order.preparation_minutes} min`}
              </p>
            </div>

            <div className="bg-[#171512] p-4">
              <p className="text-xs text-white/40">
                Total servicetid
              </p>

              <p className="mt-2 font-serif text-3xl text-[#D4B27C]">
                {order.total_service_minutes ===
                null
                  ? "—"
                  : `${order.total_service_minutes} min`}
              </p>
            </div>
          </div>

          {order.status ===
            "cancelled" && (
            <div className="mt-4 border border-red-500/30 bg-red-950/30 p-4 text-sm text-red-200">
              Den här ordern är
              avbokad och räknas inte
              in i försäljningen.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function TimelineRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/10 px-4 py-4 last:border-b-0">
      <span className="text-sm text-white/45">
        {label}
      </span>

      <strong className="font-serif text-xl">
        {value}
      </strong>
    </div>
  );
}