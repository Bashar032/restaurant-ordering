"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AreaId = "indoor" | "terrace" | "lounge";
type TableStatus = "available" | "booked";

type RestaurantTable = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  minGuests: number;
  status: TableStatus;
  rotation?: number;
};

type Area = {
  id: AreaId;
  name: string;
  subtitle: string;
  tables: RestaurantTable[];
};

const indoorTables: RestaurantTable[] = [
  { id: "1", x: 16, y: 9, width: 5.2, height: 6.4, capacity: 2, minGuests: 1, status: "available" },
  { id: "2", x: 16, y: 23, width: 5.2, height: 6.4, capacity: 2, minGuests: 1, status: "available" },
  { id: "3", x: 32, y: 9, width: 5.2, height: 11, capacity: 6, minGuests: 5, status: "available" },
  { id: "4", x: 33, y: 36, width: 5.2, height: 7.5, capacity: 4, minGuests: 3, status: "available" },
  { id: "5", x: 47, y: 9, width: 5.2, height: 6.4, capacity: 2, minGuests: 1, status: "available" },
  { id: "6", x: 47, y: 23, width: 5.2, height: 6.4, capacity: 2, minGuests: 1, status: "available" },
  { id: "7", x: 47, y: 36, width: 5.2, height: 7.5, capacity: 4, minGuests: 3, status: "available" },
  { id: "8", x: 64, y: 9, width: 5.2, height: 8.5, capacity: 4, minGuests: 3, status: "available" },
  { id: "9", x: 64, y: 36, width: 5.2, height: 8.5, capacity: 4, minGuests: 3, status: "available" },
  { id: "10", x: 80, y: 9, width: 5.6, height: 11, capacity: 6, minGuests: 5, status: "available" },
  { id: "11", x: 80, y: 36, width: 5.2, height: 8.5, capacity: 4, minGuests: 3, status: "available" },
  { id: "12", x: 69, y: 69, width: 5.2, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "13", x: 82, y: 69, width: 5.2, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
];

const terraceTables: RestaurantTable[] = [
  { id: "105", x: 20, y: 13, width: 4.7, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "104", x: 35, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "103", x: 49, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "102", x: 62, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "101", x: 73, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "204", x: 35, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "203", x: 49, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "202", x: 62, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "201", x: 73, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "405", x: 20, y: 50, width: 4.7, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "404", x: 36, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "403", x: 50, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "402", x: 63, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "401", x: 74, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "502", x: 20, y: 68, width: 4.7, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "501", x: 33, y: 68, width: 4.7, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "504", x: 20, y: 80, width: 4.7, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
  { id: "503", x: 33, y: 80, width: 4.7, height: 6.8, capacity: 2, minGuests: 1, status: "available" },
{
  id: "Lounge",
  x: 58,
  y: 76,
  width: 16,
  height: 10,
  capacity: 7,
  minGuests: 3,
  status: "available",
},
];

const loungeTables: RestaurantTable[] = [
  { id: "309", x: 8, y: 7, width: 10.5, height: 5.5, capacity: 6, minGuests: 5, status: "available" },
  { id: "307", x: 30, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1, status: "available" },
  { id: "305", x: 42, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1, status: "available" },
  { id: "303", x: 53, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1, status: "available" },
  { id: "301", x: 65, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1, status: "available" },
  { id: "308", x: 30, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3, status: "available" },
  { id: "306", x: 42, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3, status: "available" },
  { id: "304", x: 53, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3, status: "available" },
  { id: "302", x: 65, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3, status: "available" },
  { id: "310", x: 7, y: 37, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "311", x: 24, y: 39, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "312", x: 7, y: 50, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "313", x: 24, y: 50, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "314", x: 7, y: 63, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "315", x: 7, y: 76, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
  { id: "316", x: 24, y: 76, width: 8, height: 5.8, capacity: 4, minGuests: 3, status: "available" },
];

const areas: Area[] = [
  { id: "indoor", name: "Inneservering", subtitle: "Plan 1", tables: indoorTables },
  { id: "terrace", name: "Uteservering", subtitle: "Ute", tables: terraceTables },
  { id: "lounge", name: "Shisha", subtitle: "Plan 2", tables: loungeTables },
];

type BookedTableRow = {
  table_number: string;
};

const bookingTimes = [
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
];

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

export default function BookingPage() {
  const supabase = useMemo(() => createClient(), []);

  const [activeAreaId, setActiveAreaId] = useState<AreaId>("indoor");
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [guestCount, setGuestCount] = useState(2);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [bookedTableNumbers, setBookedTableNumbers] = useState<Set<string>>(
    new Set(),
  );
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState("");

  const activeArea = useMemo(
    () => areas.find((area) => area.id === activeAreaId) ?? areas[0],
    [activeAreaId],
  );

  const selectedTable = useMemo(
    () =>
      activeArea.tables.find((table) => table.id === selectedTableId) ?? null,
    [activeArea, selectedTableId],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      setMessage("");
      setSuccess(false);
      setBookingReference("");

      if (!bookingDate || !bookingTime) {
        setBookedTableNumbers(new Set());
        return;
      }

      setAvailabilityLoading(true);

      const { data, error } = await supabase.rpc(
        "get_booked_table_numbers",
        {
          p_booking_date: bookingDate,
          p_booking_time: bookingTime,
        },
      );

      if (cancelled) return;

      if (error) {
        setMessage(
          `Kunde inte kontrollera tillgängligheten: ${error.message}`,
        );
        setSuccess(false);
        setBookedTableNumbers(new Set());
        setAvailabilityLoading(false);
        return;
      }

      const rows = (data ?? []) as BookedTableRow[];
      const nextBooked = new Set(rows.map((row) => row.table_number));

      setBookedTableNumbers(nextBooked);
      setAvailabilityLoading(false);

      if (selectedTableId && nextBooked.has(selectedTableId)) {
        setSelectedTableId(null);
        setMessage(
          `Bord ${selectedTableId} är redan bokat för den valda tiden. Välj ett annat grönt bord.`,
        );
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [bookingDate, bookingTime, selectedTableId, supabase]);

  const selectArea = (areaId: AreaId) => {
    setActiveAreaId(areaId);
    setSelectedTableId(null);
    setMessage("");
    setSuccess(false);
    setBookingReference("");
  };

  const selectTable = (table: RestaurantTable) => {
    if (!bookingDate || !bookingTime) {
      setMessage("Välj datum och tid innan du väljer bord.");
      setSuccess(false);
      return;
    }

    if (bookedTableNumbers.has(table.id)) {
      setMessage(`Bord ${table.id} är redan bokat för den valda tiden.`);
      setSuccess(false);
      return;
    }

    setSelectedTableId(table.id);
    setGuestCount(table.minGuests);
    setMessage("");
    setSuccess(false);
    setBookingReference("");
  };

  const validateForm = () => {
    if (!bookingDate) return "Välj ett datum.";
    if (!bookingTime) return "Välj en tid.";
    if (!selectedTable) return "Välj först ett grönt bord på kartan.";

    if (bookedTableNumbers.has(selectedTable.id)) {
      return `Bord ${selectedTable.id} är redan bokat för den valda tiden.`;
    }

    if (guestCount < selectedTable.minGuests) {
      return `Bord ${selectedTable.id} kräver minst ${selectedTable.minGuests} gäster. Välj ett mindre bord eller ändra antalet personer.`;
    }

    if (guestCount > selectedTable.capacity) {
      return `Bord ${selectedTable.id} har plats för högst ${selectedTable.capacity} gäster. Välj ett större bord.`;
    }

    if (customerName.trim().length < 2) {
      return "Skriv kundens fullständiga namn.";
    }

    if (customerPhone.trim().length < 6) {
      return "Skriv ett giltigt telefonnummer.";
    }

    if (!customerEmail.includes("@")) {
      return "Skriv en giltig e-postadress.";
    }

    return "";
  };

  const refreshAvailability = async () => {
    if (!bookingDate || !bookingTime) return;

    const { data } = await supabase.rpc("get_booked_table_numbers", {
      p_booking_date: bookingDate,
      p_booking_time: bookingTime,
    });

    const rows = (data ?? []) as BookedTableRow[];
    setBookedTableNumbers(
      new Set(rows.map((row) => row.table_number)),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errorMessage = validateForm();

    if (errorMessage) {
      setMessage(errorMessage);
      setSuccess(false);
      return;
    }

    if (!selectedTable) return;

    setSubmitting(true);
    setMessage("");
    setSuccess(false);
    setBookingReference("");

    const { data, error } = await supabase.rpc("create_public_booking", {
      p_table_number: selectedTable.id,
      p_customer_name: customerName.trim(),
      p_customer_email: customerEmail.trim().toLowerCase(),
      p_customer_phone: customerPhone.trim(),
      p_guests: guestCount,
      p_booking_date: bookingDate,
      p_booking_time: bookingTime,
    });

    if (error) {
      setMessage(error.message);
      setSuccess(false);
      setSubmitting(false);
      await refreshAvailability();
      return;
    }

    const reference = String(data ?? "");

    let emailWasSent = false;
    let emailErrorMessage = "";

    try {
      const emailResponse = await fetch("/api/booking-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail.trim().toLowerCase(),
          customerName: customerName.trim(),
          bookingReference: reference,
          tableNumber: selectedTable.id,
          guests: guestCount,
          bookingDate,
          bookingTime,
          areaName: activeArea.name,
        }),
      });

      const emailResult = (await emailResponse.json()) as {
        success?: boolean;
        error?: string;
      };

      emailWasSent = emailResponse.ok && emailResult.success === true;
      emailErrorMessage = emailResult.error ?? "";
    } catch (emailError) {
      console.error(
        "Bekräftelsemejlet kunde inte skickas:",
        emailError,
      );
      emailErrorMessage = "Mejltjänsten kunde inte nås.";
    }

    setBookingReference(reference);

    if (emailWasSent) {
      setMessage(
        `Bokningen är bekräftad för ${customerName.trim()}, bord ${selectedTable.id}, ${guestCount} personer. En bekräftelse har skickats till ${customerEmail.trim()}.`,
      );
    } else {
      setMessage(
        `Bokningen är bekräftad och sparad. Bekräftelsemejlet kunde däremot inte skickas${emailErrorMessage ? `: ${emailErrorMessage}` : "."}`,
      );
    }

    setSuccess(true);
    setSubmitting(false);

    await refreshAvailability();
  };

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <header className="border-b border-white/10 bg-[#171512]">
        <div className="mx-auto flex min-h-24 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-14">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-[0.22em] text-white/70 transition hover:text-[#D4B27C]"
          >
            ← Till startsidan
          </Link>

          <p className="font-serif text-2xl">Daloona</p>
        </div>
      </header>

      <section className="px-5 pb-20 pt-14 sm:px-8 lg:px-14 lg:pb-28 lg:pt-20">
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
            Bordsbokning
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <h1 className="max-w-4xl font-serif text-[clamp(3.8rem,8vw,8rem)] leading-[0.87] tracking-[-0.045em]">
              Välj ditt bord.
            </h1>

            <p className="max-w-xl leading-8 text-white/60 lg:justify-self-end">
              Välj datum och tid först. Grönt betyder ledigt, rött betyder
              bokat och guld visar ditt val.
            </p>
          </div>

          <div className="mt-10 grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2 lg:max-w-2xl">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                Datum
              </span>
              <input
                type="date"
                required
                min={getToday()}
                value={bookingDate}
                onChange={(event) => {
                  setBookingDate(event.target.value);
                  setSelectedTableId(null);
                  setMessage("");
                }}
                className="mt-2 min-h-12 w-full border border-white/20 bg-[#24211D] px-4 text-white outline-none focus:border-[#B08A52]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                Tid
              </span>
              <select
                required
                value={bookingTime}
                onChange={(event) => {
                  setBookingTime(event.target.value);
                  setSelectedTableId(null);
                  setMessage("");
                }}
                className="mt-2 min-h-12 w-full border border-white/20 bg-[#24211D] px-4 text-white outline-none focus:border-[#B08A52]"
              >
                <option value="">Välj tid</option>
                {bookingTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 flex gap-3 overflow-x-auto pb-2">
            {areas.map((area) => {
              const active = area.id === activeAreaId;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => selectArea(area.id)}
                  className={`min-w-fit border px-5 py-4 text-left transition ${
                    active
                      ? "border-[#B08A52] bg-[#B08A52] text-[#191815]"
                      : "border-white/15 bg-white/[0.03] text-white hover:border-white/40"
                  }`}
                >
                  <span className="block text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-65">
                    {area.subtitle}
                  </span>
                  <span className="mt-1 block font-serif text-xl">
                    {area.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_420px]">
            <div className="overflow-x-auto border border-white/10 bg-[#24211D] p-3 sm:p-6">
              <div className="min-w-[760px]">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-serif text-3xl">{activeArea.name}</p>
                    <p className="mt-1 text-sm text-white/45">
                      {!bookingDate || !bookingTime
                        ? "Välj datum och tid ovan"
                        : availabilityLoading
                          ? "Kontrollerar lediga bord..."
                          : "Klicka på ett grönt bord"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-white/65">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 bg-[#4E8B5B]" />
                      Ledigt
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 bg-[#9F4040]" />
                      Bokat
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 bg-[#C39A58]" />
                      Ditt val
                    </span>
                  </div>
                </div>

<div className="relative aspect-[10/8] overflow-hidden border border-white/10 bg-[#302B26]">
  <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:40px_40px]" />

  {/* NORR / VÄTTERN */}
  <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex h-[7%] min-h-10 items-center justify-center border-b border-[#7FA3AE]/35 bg-[#22343A]/80 backdrop-blur-sm">
    <div className="flex items-center gap-4">
      <span className="text-[0.58rem] font-bold uppercase tracking-[0.3em] text-[#9FC3CC]">
        ↑ Norr
      </span>

      <span className="h-4 w-px bg-white/20" />

      <span className="font-serif text-lg tracking-wide text-[#C7E0E5]">
        Vättern
      </span>
    </div>
  </div>

                  {activeAreaId === "indoor" && (
                    <div className="absolute bottom-[10%] left-[27%] h-[11%] w-[38%] border border-[#D4B27C]/50 bg-[#8A6638]/35">
                      <span className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-[0.2em] text-[#E7C88F]">
                        Bar
                      </span>
                    </div>
                  )}

                  {activeArea.tables.map((table) => {
                    const selected = selectedTableId === table.id;
                    const booked = bookedTableNumbers.has(table.id);

                    const color = selected
                      ? "border-[#F2D39B] bg-[#C39A58] text-[#191815] shadow-[0_0_0_4px_rgba(195,154,88,.18)]"
                      : booked
                        ? "cursor-not-allowed border-[#C86969] bg-[#9F4040] text-white"
                        : "border-[#79B686] bg-[#4E8B5B] text-white hover:z-10 hover:scale-105 hover:border-white";

                    return (
<button
  key={table.id}
  type="button"
  disabled={booked || availabilityLoading}
  onClick={() => selectTable(table)}
  aria-label={`Bord ${table.id}, ${table.capacity} platser, ${
    booked ? "bokat" : "ledigt"
  }`}
  className={`absolute flex items-center justify-center border text-center transition duration-200 disabled:cursor-not-allowed disabled:opacity-75 ${color}`}
  style={{
    left: `${table.x}%`,
    top: `${table.y}%`,
    width: `${table.width}%`,
    height: `${table.height}%`,
    transform: `rotate(${table.rotation ?? 0}deg)`,
  }}
>
                        <span
                          className="leading-none"
                          style={{
                            transform: `rotate(-${table.rotation ?? 0}deg)`,
                          }}
                        >
                          <strong className="block text-sm sm:text-base">
                            {table.id}
                          </strong>
                          <span className="mt-1 hidden text-[0.55rem] uppercase tracking-[0.12em] opacity-80 sm:block">
                            {table.capacity} pers
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <aside className="border border-white/10 bg-[#F3EEE3] p-6 text-[#191815] sm:p-8">
              <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#9A7341]">
                Ditt val
              </p>

              {selectedTable ? (
                <>
                  <div className="mt-4 border-b border-[#D8CDBD] pb-6">
                    <h2 className="font-serif text-4xl">
                      {selectedTable.id === "Lounge"
                        ? "Lounge"
                        : `Bord ${selectedTable.id}`}
                    </h2>
                    <p className="mt-3 text-[#676158]">
                      {activeArea.name} · {selectedTable.capacity} platser
                    </p>
                    <p className="mt-1 text-sm text-[#8A6638]">
                      Minst {selectedTable.minGuests} gäster
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Antal personer
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={guestCount}
                        onChange={(event) => {
                          setGuestCount(Number(event.target.value));
                          setMessage("");
                          setSuccess(false);
                        }}
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 text-lg outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Namn
                      </span>
                      <input
                        type="text"
                        required
                        autoComplete="name"
                        value={customerName}
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Telefonnummer
                      </span>
                      <input
                        type="tel"
                        required
                        autoComplete="tel"
                        value={customerPhone}
                        onChange={(event) =>
                          setCustomerPhone(event.target.value)
                        }
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        E-post
                      </span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={customerEmail}
                        onChange={(event) =>
                          setCustomerEmail(event.target.value)
                        }
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <div className="border border-[#D8CDBD] bg-white/60 p-4 text-sm leading-6 text-[#676158]">
                      <p>
                        <strong>Datum:</strong> {bookingDate}
                      </p>
                      <p>
                        <strong>Tid:</strong> {bookingTime}
                      </p>
                    </div>

                    {message && (
                      <div
                        role="alert"
                        className={`border px-4 py-3 text-sm leading-6 ${
                          success
                            ? "border-[#75A87D] bg-[#E5F1E7] text-[#315C39]"
                            : "border-[#C98C86] bg-[#F7E7E5] text-[#7A302B]"
                        }`}
                      >
                        <p>{message}</p>
                        {success && bookingReference && (
                          <p className="mt-2 font-bold">
                            Bokningsnummer:{" "}
                            {bookingReference.slice(0, 8).toUpperCase()}
                          </p>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || success}
                      className="inline-flex min-h-14 w-full items-center justify-center bg-[#191815] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#3F4935] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {submitting
                        ? "Sparar bokningen..."
                        : success
                          ? "Bokningen är sparad"
                          : "Bekräfta bokning"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="mt-6 border border-dashed border-[#CDBFAE] px-5 py-12 text-center">
                  <p className="font-serif text-3xl">Inget bord valt</p>
                  <p className="mx-auto mt-3 max-w-xs leading-7 text-[#676158]">
                    Välj datum, tid och därefter ett grönt bord på kartan.
                  </p>

                  {message && (
                    <div className="mt-6 border border-[#C98C86] bg-[#F7E7E5] px-4 py-3 text-sm leading-6 text-[#7A302B]">
                      {message}
                    </div>
                  )}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}