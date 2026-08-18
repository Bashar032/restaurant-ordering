"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type StaffRole =
  | "owner"
  | "admin"
  | "kitchen";

type NotificationType =
  | "booking"
  | "event"
  | "order";

type AdminNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
};

type Props = {
  role: StaffRole;
};

const STORAGE_KEY =
  "daloona-admin-notifications";

function formatTime(date: string) {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(date));
}

function getTypeLabel(
  type: NotificationType,
) {
  switch (type) {
    case "booking":
      return "Bokning";

    case "event":
      return "Event";

    case "order":
      return "Order";
  }
}

export default function AdminNotifications({
  role,
}: Props) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [open, setOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<AdminNotification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [realtimeStatus, setRealtimeStatus] =
    useState<
      "CONNECTING" | "SUBSCRIBED" | "CHANNEL_ERROR" | "TIMED_OUT" | "CLOSED"
    >("CONNECTING");

  const wrapperRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /*
   * Läs sparade notiser från denna flik.
   */
  useEffect(() => {
    try {
      const stored =
        window.sessionStorage.getItem(
          STORAGE_KEY,
        );

      if (!stored) {
        return;
      }

      const parsed = JSON.parse(
        stored,
      ) as {
        notifications?: AdminNotification[];
        unreadCount?: number;
      };

      setNotifications(
        parsed.notifications ?? [],
      );

      setUnreadCount(
        parsed.unreadCount ?? 0,
      );
    } catch {
      // Ignorera trasig sessionStorage.
    }
  }, []);

  /*
   * Spara notiser.
   */
  useEffect(() => {
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          notifications,
          unreadCount,
        }),
      );
    } catch {
      // Ignorera storage-fel.
    }
  }, [
    notifications,
    unreadCount,
  ]);

  /*
   * Stäng dropdown om man klickar utanför.
   */
  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function addNotification(
    notification: AdminNotification,
  ) {
    console.log(
      "[Notifications] addNotification",
      notification,
    );
    setNotifications(
      (current) => [
        notification,
        ...current,
      ].slice(0, 20),
    );

    setUnreadCount(
      (current) => current + 1,
    );
  }

  /*
   * LIVE-NOTISER
   */
  useEffect(() => {
    const channel = supabase.channel(
      `daloona-notifications-${role}`,
    );

    /*
     * Alla roller som får använda köket
     * kan få ordernotiser.
     */
    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "table_orders",
      },
      (payload) => {
        console.log(
          "[Notifications] table_orders INSERT",
          payload,
        );

        const row =
          payload.new as Record<
            string,
            unknown
          >;

        const orderNumber =
          typeof row.order_number ===
          "string"
            ? row.order_number
            : "";

        addNotification({
          id: `order-${String(row.id ?? crypto.randomUUID())}`,
          type: "order",
          title: "Ny QR-order",
          message: orderNumber
            ? `Order ${orderNumber} har kommit in till köket.`
            : "En ny QR-order har kommit in till köket.",
          createdAt:
            typeof row.created_at ===
            "string"
              ? row.created_at
              : new Date().toISOString(),
        });
      },
    );

    /*
     * Kitchen ska inte få adminnotiser.
     */
    if (role !== "kitchen") {
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          console.log(
            "[Notifications] bookings INSERT",
            payload,
          );

          const row =
            payload.new as Record<
              string,
              unknown
            >;

          const customerName =
            typeof row.customer_name ===
            "string"
              ? row.customer_name
              : "Ny kund";

          const guests =
            typeof row.guests ===
            "number"
              ? row.guests
              : null;

          const bookingTime =
            typeof row.booking_time ===
            "string"
              ? row.booking_time.slice(
                  0,
                  5,
                )
              : "";

          addNotification({
            id: `booking-${String(row.id ?? crypto.randomUUID())}`,
            type: "booking",
            title: "Ny bokning",
            message: `${customerName}${
              guests
                ? ` · ${guests} personer`
                : ""
            }${
              bookingTime
                ? ` · ${bookingTime}`
                : ""
            }`,
            createdAt:
              typeof row.created_at ===
              "string"
                ? row.created_at
                : new Date().toISOString(),
          });
        },
      );

      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table:
            "private_event_requests",
        },
        (payload) => {
          console.log(
            "[Notifications] private_event_requests INSERT",
            payload,
          );

          const row =
            payload.new as Record<
              string,
              unknown
            >;

          const customerName =
            typeof row.customer_name ===
            "string"
              ? row.customer_name
              : "Ny kund";

          const guests =
            typeof row.guests ===
            "number"
              ? row.guests
              : null;

          addNotification({
            id: `event-${String(row.id ?? crypto.randomUUID())}`,
            type: "event",
            title:
              "Ny eventförfrågan",
            message: `${customerName}${
              guests
                ? ` · ${guests} personer`
                : ""
            }`,
            createdAt:
              typeof row.created_at ===
              "string"
                ? row.created_at
                : new Date().toISOString(),
          });
        },
      );
    }

    console.log(
      "[Notifications] subscribing",
      {
        role,
        channel:
          `daloona-notifications-${role}`,
      },
    );

    channel.subscribe((status) => {
      console.log(
        "[Notifications] channel status:",
        status,
      );

      if (
        status === "SUBSCRIBED" ||
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        setRealtimeStatus(status);
      }
    });

    return () => {
      console.log(
        "[Notifications] removing channel",
      );

      void supabase.removeChannel(
        channel,
      );
    };
  }, [
    role,
    supabase,
  ]);

  function toggleNotifications() {
    setOpen(
      (current) => !current,
    );

    if (!open) {
      setUnreadCount(0);
    }
  }

  function clearNotifications() {
    setNotifications([]);
    setUnreadCount(0);
  }

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <button
        type="button"
        onClick={
          toggleNotifications
        }
        aria-label="Notiser"
        className="relative flex min-h-11 min-w-11 items-center justify-center border border-white/15 px-3 text-white/70 transition hover:border-[#B08A52] hover:text-[#D4B27C]"
      >
        <span className="text-lg">
          🔔
        </span>

        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#B08A52] px-1 text-[0.65rem] font-bold text-[#191815]">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+12px)] z-[100] w-[min(92vw,420px)] overflow-hidden border border-white/10 bg-[#211E1A] shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 p-5">
            <div>
              <p className="text-[0.58rem] font-bold uppercase tracking-[0.22em] text-[#B08A52]">
                Live
              </p>

              <h2 className="mt-1 font-serif text-2xl text-white">
                Notiser
              </h2>

              <p
                className={`mt-2 text-[0.58rem] font-bold uppercase tracking-[0.16em] ${
                  realtimeStatus === "SUBSCRIBED"
                    ? "text-green-400"
                    : realtimeStatus === "CONNECTING"
                      ? "text-[#D4B27C]"
                      : "text-red-400"
                }`}
              >
                Realtime: {realtimeStatus}
              </p>
            </div>

            {notifications.length >
              0 && (
              <button
                type="button"
                onClick={
                  clearNotifications
                }
                className="text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white/35 transition hover:text-white"
              >
                Rensa
              </button>
            )}
          </div>

          {notifications.length ===
          0 ? (
            <div className="px-6 py-10 text-center">
              <p className="font-serif text-2xl text-white/70">
                Inga nya notiser
              </p>

              <p className="mt-2 text-sm text-white/35">
                Nya händelser visas
                här automatiskt.
              </p>
            </div>
          ) : (
            <div className="max-h-[460px] overflow-y-auto">
              {notifications.map(
                (notification) => (
                  <div
                    key={
                      notification.id
                    }
                    className="border-b border-white/10 p-5 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[0.55rem] font-bold uppercase tracking-[0.17em] text-[#B08A52]">
                          {getTypeLabel(
                            notification.type,
                          )}
                        </p>

                        <p className="mt-2 font-serif text-xl text-white">
                          {
                            notification.title
                          }
                        </p>

                        <p className="mt-2 text-sm leading-6 text-white/55">
                          {
                            notification.message
                          }
                        </p>
                      </div>

                      <span className="shrink-0 text-xs text-white/30">
                        {formatTime(
                          notification.createdAt,
                        )}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}