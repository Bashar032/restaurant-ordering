"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  image: string | null;
};

type CartItem = MenuItem & {
  quantity: number;
};

type TableInfo = {
  table_number: string;
  area: string;
  capacity: number;
};

type CustomerOrderStatus = {
  order_id: string;
  order_number: string;
  table_number: string;
  status:
    | "new"
    | "preparing"
    | "ready"
    | "served"
    | "cancelled";
  total_amount: number;
  created_at: string;
  preparing_at: string | null;
  ready_at: string | null;
  served_at: string | null;
};

export default function OrderPage() {
  const params = useParams<{ table: string }>();
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const tableNumber = useMemo(() => {
    const fromParams = params?.table;

    if (fromParams) {
      return decodeURIComponent(
        fromParams,
      ).trim();
    }

    if (
      typeof window !== "undefined"
    ) {
      const parts =
        window.location.pathname
          .split("/")
          .filter(Boolean);

      const fromUrl = parts[1];

      if (fromUrl) {
        return decodeURIComponent(
          fromUrl,
        ).trim();
      }
    }

    return "";
  }, [params]);

  const storageKey = useMemo(() => {
    if (!tableNumber) {
      return "";
    }

    return `daloona-active-order-${tableNumber.toLowerCase()}`;
  }, [tableNumber]);

  const [tableInfo, setTableInfo] =
    useState<TableInfo | null>(null);

  const [menuItems, setMenuItems] =
    useState<MenuItem[]>([]);

  const [cart, setCart] =
    useState<CartItem[]>([]);

  const [
    customerNote,
    setCustomerNote,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [
    orderNumber,
    setOrderNumber,
  ] = useState("");

const [activeOrderIds, setActiveOrderIds] =
  useState<string[]>([]);

const [orderStatuses, setOrderStatuses] =
  useState<CustomerOrderStatus[]>([]);

  const [
    orderStatusError,
    setOrderStatusError,
  ] = useState("");

  // =========================================
  // LADDA BORD + MENY
  // =========================================

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setError("");

      if (!tableNumber) {
        setError(
          "Kunde inte läsa bordnumret från QR-koden.",
        );
        setLoading(false);
        return;
      }

      try {
        const tableRequest =
          supabase.rpc(
            "get_order_table",
            {
              p_table_number:
                tableNumber,
            },
          );

        const menuRequest =
          supabase
            .from(
              "order_menu_items",
            )
            .select(
              `
                id,
                name,
                description,
                category,
                price,
                image
              `,
            )
            .eq("active", true)
            .order("sort_order", {
              ascending: true,
            });

        const timeout =
          new Promise<never>(
            (_, reject) => {
              window.setTimeout(
                () => {
                  reject(
                    new Error(
                      "Supabase svarade inte inom 10 sekunder.",
                    ),
                  );
                },
                10000,
              );
            },
          );

        const [
          {
            data: tableData,
            error: tableError,
          },
          {
            data: menuData,
            error: menuError,
          },
        ] = await Promise.race([
          Promise.all([
            tableRequest,
            menuRequest,
          ]),
          timeout,
        ]);

        if (tableError) {
          throw new Error(
            `Kunde inte läsa bordet: ${tableError.message}`,
          );
        }

        const table =
          Array.isArray(tableData)
            ? tableData[0]
            : null;

        if (!table) {
          throw new Error(
            `Bord ${tableNumber} kunde inte hittas.`,
          );
        }

        if (menuError) {
          throw new Error(
            `Kunde inte läsa menyn: ${menuError.message}`,
          );
        }

        setTableInfo(
          table as TableInfo,
        );

        setMenuItems(
          (menuData ??
            []) as MenuItem[],
        );
      } catch (loadError) {
        console.error(
          "QR-menyn kunde inte laddas:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Ett okänt fel uppstod när menyn skulle laddas.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadPage();
  }, [supabase, tableNumber]);

  // =========================================
  // ÅTERSTÄLL ALLA AKTIVA ORDERS VID REFRESH
  // =========================================

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const stored = window.sessionStorage.getItem(storageKey);

    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setActiveOrderIds(
          parsed.filter(
            (value): value is string => typeof value === "string",
          ),
        );
      } else if (typeof parsed === "string") {
        setActiveOrderIds([parsed]);
      }
    } catch {
      setActiveOrderIds([stored]);
    }
  }, [storageKey]);

  // =========================================
  // LIVE-STATUS FÖR KUNDENS ORDERS
  // =========================================

  useEffect(() => {
    if (activeOrderIds.length === 0 || !tableInfo) {
      return;
    }

    let cancelled = false;

    async function loadStatuses() {
      const { data, error: statusError } = await supabase.rpc(
        "get_customer_order_statuses",
        {
          p_order_ids: activeOrderIds,
          p_table_number: tableInfo!.table_number,
        },
      );

      if (cancelled) {
        return;
      }

      if (statusError) {
        console.error(
          "Kunde inte läsa orderstatus:",
          statusError,
        );
        setOrderStatusError(
          "Kunde inte uppdatera orderstatus.",
        );
        return;
      }

      setOrderStatusError("");
      setOrderStatuses((data ?? []) as CustomerOrderStatus[]);
    }

    void loadStatuses();

    const interval = window.setInterval(() => {
      void loadStatuses();
    }, 2500);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [activeOrderIds, supabase, tableInfo]);

  // =========================================
  // MENY
  // =========================================

  const groupedMenu =
    useMemo(() => {
      const groups =
        new Map<
          string,
          MenuItem[]
        >();

      for (const item of menuItems) {
        const existing =
          groups.get(
            item.category,
          ) ?? [];

        existing.push(item);

        groups.set(
          item.category,
          existing,
        );
      }

      return Array.from(
        groups.entries(),
      );
    }, [menuItems]);

  const totalItems =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    );

  const totalPrice =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0,
    );

  // =========================================
  // VARUKORG
  // =========================================

  function addToCart(
    item: MenuItem,
  ) {
    setSuccess("");
    setError("");

    setCart((current) => {
      const existing =
        current.find(
          (cartItem) =>
            cartItem.id === item.id,
        );

      if (existing) {
        return current.map(
          (cartItem) =>
            cartItem.id ===
            item.id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity +
                    1,
                }
              : cartItem,
        );
      }

      return [
        ...current,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  }

  function decreaseQuantity(
    itemId: string,
  ) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity:
                  item.quantity -
                  1,
              }
            : item,
        )
        .filter(
          (item) =>
            item.quantity > 0,
        ),
    );
  }

  function removeFromCart(
    itemId: string,
  ) {
    setCart((current) =>
      current.filter(
        (item) =>
          item.id !== itemId,
      ),
    );
  }

  // =========================================
  // SKICKA ORDER
  // =========================================

  async function submitOrder() {
    if (!tableInfo) {
      return;
    }

    if (cart.length === 0) {
      setError(
        "Lägg till minst en produkt innan du beställer.",
      );

      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    setOrderStatusError("");

    const items =
      cart.map((item) => ({
        menuItemId: item.id,
        quantity:
          item.quantity,
        note: "",
      }));

    const {
      data,
      error: orderError,
    } = await supabase.rpc(
      "create_table_order",
      {
        p_table_number:
          tableInfo.table_number,

        p_customer_note:
          customerNote.trim() ||
          null,

        p_items: items,
      },
    );

    if (orderError) {
      setError(
        orderError.message,
      );

      setSubmitting(false);
      return;
    }

    const result =
      Array.isArray(data)
        ? data[0]
        : null;

    if (!result) {
      setError(
        "Beställningen skapades inte korrekt.",
      );

      setSubmitting(false);
      return;
    }

    setOrderNumber(
      result.order_number,
    );

    const newOrderId = result.order_id as string;

    setActiveOrderIds((current) => {
      const updated = [
        newOrderId,
        ...current.filter((id) => id !== newOrderId),
      ];

      if (storageKey) {
        window.sessionStorage.setItem(
          storageKey,
          JSON.stringify(updated),
        );
      }

      return updated;
    });

    setOrderStatuses((current) => [
      {
        order_id: result.order_id,
        order_number: result.order_number,
        table_number: tableInfo.table_number,
        status: "new",
        total_amount: result.total_amount,
        created_at: new Date().toISOString(),
        preparing_at: null,
        ready_at: null,
        served_at: null,
      },
      ...current.filter(
        (order) => order.order_id !== result.order_id,
      ),
    ]);

    setSuccess(
      `Beställningen är skickad från bord ${tableInfo.table_number}.`,
    );

    setCart([]);
    setCustomerNote("");
    setSubmitting(false);
  }

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] px-6 text-white">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#B08A52]">
            Daloona
          </p>

          <p className="mt-5 font-serif text-3xl">
            Laddar menyn...
          </p>
        </div>
      </main>
    );
  }

  if (
    error &&
    !tableInfo
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171512] px-6 text-white">
        <div className="max-w-lg border border-red-500/30 bg-red-950/30 p-8 text-center">
          <p className="font-serif text-3xl">
            Något gick fel
          </p>

          <p className="mt-4 leading-7 text-red-200">
            {error}
          </p>
        </div>
      </main>
    );
  }

  // =========================================
  // SIDAN
  // =========================================

  return (
    <main className="min-h-screen bg-[#F3EEE3] text-[#191815]">

      {/* HEADER */}

      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#171512] text-white">
        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8">
          <Image
            src="/images/daloona-logo.png"
            alt="Daloona"
            width={180}
            height={100}
            priority
            className="h-auto w-24 object-contain"
          />

          <div className="text-right">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
              Beställning
            </p>

            <p className="mt-1 font-serif text-xl">
              {tableInfo?.table_number.toUpperCase() ===
              "LOUNGE"
                ? "Lounge"
                : `Bord ${tableInfo?.table_number}`}
            </p>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="bg-[#171512] px-5 pb-16 pt-10 text-white sm:px-8">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
            Daloona · Jönköping
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-[clamp(3.5rem,9vw,7rem)] leading-[0.9] tracking-[-0.045em]">
            Beställ från bordet.
          </h1>

          <p className="mt-6 max-w-xl leading-8 text-white/65">
            Välj mat och dryck nedan.
            Beställningen skickas
            direkt till restaurangen.
          </p>
        </div>
      </section>

      {/* ORDERSTATUS */}

      {orderStatuses.length > 0 && (
        <section className="border-b border-[#D8CDBD] bg-[#E8DFD0] px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-6">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#8A6638]">
                Dina beställningar
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Följ dina orders.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#676158]">
                Du kan göra fler beställningar från samma bord. Varje order visas separat och uppdateras automatiskt när köket ändrar status.
              </p>
            </div>

            <div className="space-y-4">
              {orderStatuses.map((order) => (
                <div
                  key={order.order_id}
                  className="border border-[#CDBFAE] bg-[#F3EEE3] p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#8A6638]">
                        {order.order_number}
                      </p>
                      <h3 className="mt-2 font-serif text-2xl sm:text-3xl">
                        {getCustomerStatusTitle(order.status)}
                      </h3>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-[#676158]">
                        {getCustomerStatusMessage(order.status)}
                      </p>
                    </div>
                    <p className="font-serif text-2xl text-[#8A6638]">
                      {order.total_amount} kr
                    </p>
                  </div>

                  {order.status !== "cancelled" && (
                    <div className="mt-6 grid grid-cols-4 gap-2">
                      <StatusStep label="Mottagen" active={statusReached(order.status, "new")} current={order.status === "new"} />
                      <StatusStep label="Tillagas" active={statusReached(order.status, "preparing")} current={order.status === "preparing"} />
                      <StatusStep label="Klar" active={statusReached(order.status, "ready")} current={order.status === "ready"} />
                      <StatusStep label="Serverad" active={statusReached(order.status, "served")} current={order.status === "served"} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {orderStatusError && (
              <p className="mt-4 text-xs text-red-700">
                {orderStatusError}
              </p>
            )}
          </div>
        </section>
      )}

      {/* CONTENT */}

      <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-12 sm:px-8 xl:grid-cols-[1fr_390px]">

        {/* MENY */}

        <div className="space-y-16">
          {groupedMenu.map(
            ([category, items]) => (
              <section key={category}>
                <div className="border-b border-[#CDBFAE] pb-5">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#A17D4B]">
                    Meny
                  </p>

                  <h2 className="mt-2 font-serif text-4xl sm:text-5xl">
                    {category}
                  </h2>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map(
                    (item) => (
                      <article
                        key={
                          item.id
                        }
                        className="overflow-hidden border border-[#D8CDBD] bg-white"
                      >
                        {item.image ? (
                          <div className="relative aspect-[4/3] overflow-hidden bg-[#E8DFD0]">
                            <Image
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-[#E8DFD0] p-6 text-center">
                            <span className="font-serif text-3xl text-[#8A6638]">
                              Daloona
                            </span>
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-5">
                            <h3 className="font-serif text-2xl leading-tight">
                              {
                                item.name
                              }
                            </h3>

                            <p className="shrink-0 font-serif text-xl text-[#8A6638]">
                              {
                                item.price
                              }{" "}
                              kr
                            </p>
                          </div>

                          {item.description && (
                            <p className="mt-3 min-h-14 text-sm leading-6 text-[#676158]">
                              {
                                item.description
                              }
                            </p>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                item,
                              )
                            }
                            className="mt-5 inline-flex min-h-12 w-full items-center justify-center bg-[#191815] px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#3F4935]"
                          >
                            Lägg till
                          </button>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>
            ),
          )}
        </div>

        {/* VARUKORG */}

        <aside className="xl:sticky xl:top-28 xl:h-fit">
          <div className="border border-[#D8CDBD] bg-[#171512] p-6 text-white sm:p-7">

            <p className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
              Din beställning
            </p>

            <div className="mt-3 flex items-end justify-between">
              <h2 className="font-serif text-3xl">
                Varukorg
              </h2>

              <p className="text-sm text-white/50">
                {totalItems} st
              </p>
            </div>

            {cart.length ===
            0 ? (
              <div className="mt-7 border border-dashed border-white/20 px-5 py-10 text-center">
                <p className="text-sm leading-6 text-white/50">
                  Din varukorg är
                  tom.
                </p>
              </div>
            ) : (
              <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
                {cart.map(
                  (item) => (
                    <div
                      key={item.id}
                      className="py-5"
                    >
                      <div className="flex justify-between gap-5">
                        <div>
                          <p className="font-serif text-xl">
                            {
                              item.name
                            }
                          </p>

                          <p className="mt-1 text-xs text-white/45">
                            {
                              item.price
                            }{" "}
                            kr / st
                          </p>
                        </div>

                        <p className="font-serif text-xl text-[#D4B27C]">
                          {item.price *
                            item.quantity}{" "}
                          kr
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-white/15">
                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.id,
                              )
                            }
                            className="h-10 w-10 text-lg transition hover:bg-white/10"
                          >
                            −
                          </button>

                          <span className="flex h-10 min-w-10 items-center justify-center border-x border-white/15 text-sm">
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              addToCart(
                                item,
                              )
                            }
                            className="h-10 w-10 text-lg transition hover:bg-white/10"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.id,
                            )
                          }
                          className="text-xs uppercase tracking-[0.12em] text-white/45 underline-offset-4 hover:text-white hover:underline"
                        >
                          Ta bort
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}

            <label className="mt-6 block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Kommentar till
                restaurangen
              </span>

              <textarea
                value={
                  customerNote
                }
                onChange={(event) =>
                  setCustomerNote(
                    event.target
                      .value,
                  )
                }
                placeholder="T.ex. ingen lök, allergi eller annan information..."
                maxLength={500}
                rows={4}
                className="mt-3 w-full resize-none border border-white/15 bg-white/[0.05] p-4 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-[#B08A52]"
              />
            </label>

            <div className="mt-6 flex items-end justify-between border-t border-white/15 pt-6">
              <p className="text-sm text-white/50">
                Totalt
              </p>

              <p className="font-serif text-4xl text-[#D4B27C]">
                {totalPrice} kr
              </p>
            </div>

            {error && (
              <div className="mt-5 border border-red-500/40 bg-red-950/40 p-4 text-sm leading-6 text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="mt-5 border border-[#75A87D]/40 bg-[#315C39]/30 p-4 text-sm leading-6 text-[#C7E5CC]">
                <p>
                  {success}
                </p>

                {orderNumber && (
                  <p className="mt-2 font-bold">
                    Ordernummer:{" "}
                    {
                      orderNumber
                    }
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={
                submitOrder
              }
              disabled={
                submitting ||
                cart.length === 0
              }
              className="mt-6 inline-flex min-h-14 w-full items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition hover:bg-[#C29B61] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting
                ? "Skickar beställningen..."
                : `Skicka beställning · ${totalPrice} kr`}
            </button>

            <p className="mt-4 text-center text-[0.7rem] leading-5 text-white/35">
              Betalning sker som vanligt
              i restaurangen.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

// =========================================
// STATUSHJÄLPARE
// =========================================

function getCustomerStatusTitle(
  status: CustomerOrderStatus["status"],
) {
  switch (status) {
    case "new":
      return "Beställningen är mottagen";

    case "preparing":
      return "Din mat tillagas";

    case "ready":
      return "Din beställning är klar";

    case "served":
      return "Beställningen är serverad";

    case "cancelled":
      return "Beställningen har avbrutits";

    default:
      return "Orderstatus";
  }
}

function getCustomerStatusMessage(
  status: CustomerOrderStatus["status"],
) {
  switch (status) {
    case "new":
      return "Köket har fått din beställning och kommer snart att börja tillaga den.";

    case "preparing":
      return "Köket arbetar med din beställning just nu.";

    case "ready":
      return "Din beställning är klar och väntar på att serveras.";

    case "served":
      return "Smaklig måltid och tack för att du beställde hos Daloona.";

    case "cancelled":
      return "Kontakta personalen om du har frågor om beställningen.";

    default:
      return "";
  }
}

function statusReached(
  current: CustomerOrderStatus["status"],
  target:
    | "new"
    | "preparing"
    | "ready"
    | "served",
) {
  if (
    current ===
    "cancelled"
  ) {
    return false;
  }

  const order = [
    "new",
    "preparing",
    "ready",
    "served",
  ];

  return (
    order.indexOf(current) >=
    order.indexOf(target)
  );
}

function StatusStep({
  label,
  active,
  current,
}: {
  label: string;
  active: boolean;
  current: boolean;
}) {
  return (
    <div>
      <div
        className={`h-2 transition-colors ${
          active
            ? "bg-[#3F6B45]"
            : "bg-black/10"
        }`}
      />

      <p
        className={`mt-2 text-[0.6rem] font-bold uppercase tracking-[0.12em] ${
          current
            ? "text-[#3F6B45]"
            : active
              ? "text-[#676158]"
              : "text-black/30"
        }`}
      >
        {label}
      </p>
    </div>
  );
}