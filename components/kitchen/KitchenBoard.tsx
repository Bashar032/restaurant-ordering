"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type KitchenItem = {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  note: string | null;
};

type KitchenOrder = {
  order_id: string;
  order_number: string;
  table_number: string;
  status: "new" | "preparing" | "ready";
  customer_note: string | null;
  total_amount: number;
  created_at: string;
  items: KitchenItem[];
};

function formatTime(date: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function getElapsedMinutes(date: string) {
  return Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(date).getTime()) / 60_000,
    ),
  );
}

export default function KitchenBoard() {
  const supabase = useMemo(() => createClient(), []);

  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(async () => {
    const { data, error } = await supabase.rpc(
      "get_kitchen_orders",
    );

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setOrders((data ?? []) as KitchenOrder[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void loadOrders();

    const interval = window.setInterval(() => {
      void loadOrders();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [loadOrders]);

  useEffect(() => {
    const channel = supabase
      .channel("daloona-kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_orders",
        },
        () => {
          void loadOrders();
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
          void loadOrders();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [loadOrders, supabase]);

  async function updateStatus(
    orderId: string,
    status:
      | "preparing"
      | "ready"
      | "served",
  ) {
    setMessage("");

    const { error } = await supabase.rpc(
      "update_kitchen_order_status",
      {
        p_order_id: orderId,
        p_status: status,
      },
    );

    if (error) {
      setMessage(error.message);
      return;
    }

    await loadOrders();
  }

  const newOrders = orders.filter(
    (order) => order.status === "new",
  );

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing",
  );

  const readyOrders = orders.filter(
    (order) => order.status === "ready",
  );

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <p className="font-serif text-4xl">
          Laddar köket...
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1800px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
              Live orders
            </p>

            <h1 className="mt-3 font-serif text-5xl sm:text-6xl">
              Kök.
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-white/45">
                Nya
              </p>
              <p className="mt-1 font-serif text-3xl">
                {newOrders.length}
              </p>
            </div>

            <div className="border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-white/45">
                Tillagas
              </p>
              <p className="mt-1 font-serif text-3xl">
                {preparingOrders.length}
              </p>
            </div>

            <div className="border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs text-white/45">
                Klara
              </p>
              <p className="mt-1 font-serif text-3xl">
                {readyOrders.length}
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className="mt-6 border border-red-500/40 bg-red-950/40 p-4 text-red-200">
            {message}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mt-10 border border-dashed border-white/15 px-6 py-20 text-center">
            <p className="font-serif text-4xl">
              Inga aktiva orders
            </p>

            <p className="mt-3 text-white/45">
              Nya QR-beställningar kommer visas här.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 xl:grid-cols-3">
            <OrderColumn
              title="Nya"
              subtitle="Väntar på köket"
              orders={newOrders}
              actionLabel="Börja tillaga"
              onAction={(id) =>
                updateStatus(id, "preparing")
              }
            />

            <OrderColumn
              title="Tillagas"
              subtitle="Pågående"
              orders={preparingOrders}
              actionLabel="Markera klar"
              onAction={(id) =>
                updateStatus(id, "ready")
              }
            />

            <OrderColumn
              title="Klara"
              subtitle="Redo att serveras"
              orders={readyOrders}
              actionLabel="Serverad"
              onAction={(id) =>
                updateStatus(id, "served")
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

function OrderColumn({
  title,
  subtitle,
  orders,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  orders: KitchenOrder[];
  actionLabel: string;
  onAction: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-3xl">
            {title}
          </h2>

          <p className="mt-1 text-xs text-white/40">
            {subtitle}
          </p>
        </div>

        <span className="font-serif text-2xl text-[#D4B27C]">
          {orders.length}
        </span>
      </div>

      <div className="space-y-5">
        {orders.map((order) => (
          <KitchenOrderCard
            key={order.order_id}
            order={order}
            actionLabel={actionLabel}
            onAction={onAction}
          />
        ))}

        {orders.length === 0 && (
          <div className="border border-dashed border-white/10 px-5 py-10 text-center text-sm text-white/30">
            Inga orders
          </div>
        )}
      </div>
    </section>
  );
}

function KitchenOrderCard({
  order,
  actionLabel,
  onAction,
}: {
  order: KitchenOrder;
  actionLabel: string;
  onAction: (id: string) => void;
}) {
  const elapsed = getElapsedMinutes(
    order.created_at,
  );

  return (
    <article className="overflow-hidden border border-white/10 bg-[#211E1A]">
      <div className="flex items-center justify-between bg-[#2B2722] px-5 py-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#B08A52]">
            {order.order_number}
          </p>

          <h3 className="mt-1 font-serif text-3xl">
            {order.table_number.toUpperCase() ===
            "LOUNGE"
              ? "Lounge"
              : `Bord ${order.table_number}`}
          </h3>
        </div>

        <div className="text-right">
          <p className="font-serif text-2xl">
            {formatTime(order.created_at)}
          </p>

          <p
            className={`mt-1 text-xs ${
              elapsed >= 15
                ? "font-bold text-red-400"
                : elapsed >= 10
                  ? "text-[#E7C88F]"
                  : "text-white/40"
            }`}
          >
            {elapsed} min
          </p>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex gap-4">
                <span className="font-serif text-2xl text-[#D4B27C]">
                  {item.quantity}×
                </span>

                <div>
                  <p className="font-serif text-xl">
                    {item.name}
                  </p>

                  {item.note && (
                    <p className="mt-1 text-sm font-bold text-[#E7C88F]">
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.customer_note && (
          <div className="mt-5 border-l-4 border-[#B08A52] bg-[#B08A52]/10 p-4">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.17em] text-[#D4B27C]">
              Kommentar
            </p>

            <p className="mt-2 leading-6 text-white/80">
              {order.customer_note}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <p className="text-sm text-white/40">
            Totalt
          </p>

          <p className="font-serif text-2xl text-[#D4B27C]">
            {order.total_amount} kr
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onAction(order.order_id)
          }
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-5 text-xs font-bold uppercase tracking-[0.18em] text-[#191815] transition hover:bg-[#C29B61]"
        >
          {actionLabel}
        </button>
      </div>
    </article>
  );
}