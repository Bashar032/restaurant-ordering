"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AreaId = "indoor" | "terrace" | "lounge";
type RestaurantTable = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: number;
  minGuests: number;
  rotation?: number;
};

type Area = {
  id: AreaId;
  name: string;
  subtitle: string;
  tables: RestaurantTable[];
};

const indoorTables: RestaurantTable[] = [
  { id: "1", x: 16, y: 9, width: 5.2, height: 6.4, capacity: 2, minGuests: 1 },
  { id: "2", x: 16, y: 23, width: 5.2, height: 6.4, capacity: 2, minGuests: 1 },
  { id: "3", x: 32, y: 9, width: 5.2, height: 11, capacity: 6, minGuests: 5 },
  { id: "4", x: 33, y: 36, width: 5.2, height: 7.5, capacity: 4, minGuests: 3 },
  { id: "5", x: 47, y: 9, width: 5.2, height: 6.4, capacity: 2, minGuests: 1 },
  { id: "6", x: 47, y: 23, width: 5.2, height: 6.4, capacity: 2, minGuests: 1 },
  { id: "7", x: 47, y: 36, width: 5.2, height: 7.5, capacity: 4, minGuests: 3 },
  { id: "8", x: 64, y: 9, width: 5.2, height: 8.5, capacity: 4, minGuests: 3 },
  { id: "9", x: 64, y: 36, width: 5.2, height: 8.5, capacity: 4, minGuests: 3 },
  { id: "10", x: 80, y: 9, width: 5.6, height: 11, capacity: 6, minGuests: 5 },
  { id: "11", x: 80, y: 36, width: 5.2, height: 8.5, capacity: 4, minGuests: 3 },
  { id: "12", x: 69, y: 69, width: 5.2, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "13", x: 82, y: 69, width: 5.2, height: 9.5, capacity: 6, minGuests: 5 },
];

const terraceTables: RestaurantTable[] = [
  { id: "105", x: 20, y: 13, width: 4.7, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "104", x: 35, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "103", x: 49, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "102", x: 62, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "101", x: 73, y: 13, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "204", x: 35, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "203", x: 49, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "202", x: 62, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "201", x: 73, y: 29, width: 4.8, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "405", x: 20, y: 50, width: 4.7, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "404", x: 36, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "403", x: 50, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "402", x: 63, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "401", x: 74, y: 50, width: 4.8, height: 9.5, capacity: 6, minGuests: 5 },
  { id: "502", x: 20, y: 68, width: 4.7, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "501", x: 33, y: 68, width: 4.7, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "504", x: 20, y: 80, width: 4.7, height: 6.8, capacity: 2, minGuests: 1 },
  { id: "503", x: 33, y: 80, width: 4.7, height: 6.8, capacity: 2, minGuests: 1 },
{
  id: "Lounge",
  x: 58,
  y: 76,
  width: 16,
  height: 10,
  capacity: 7,
  minGuests: 3,
  
},
];

const loungeTables: RestaurantTable[] = [
  { id: "309", x: 8, y: 7, width: 10.5, height: 5.5, capacity: 6, minGuests: 5 },
  { id: "307", x: 30, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1 },
  { id: "305", x: 42, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1 },
  { id: "303", x: 53, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1 },
  { id: "301", x: 65, y: 8, width: 5.4, height: 6.2, capacity: 2, minGuests: 1 },
  { id: "308", x: 30, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3 },
  { id: "306", x: 42, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3 },
  { id: "304", x: 53, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3 },
  { id: "302", x: 65, y: 22, width: 5.4, height: 9.2, capacity: 4, minGuests: 3 },
  { id: "310", x: 7, y: 37, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "311", x: 24, y: 39, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "312", x: 7, y: 50, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "313", x: 24, y: 50, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "314", x: 7, y: 63, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "315", x: 7, y: 76, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
  { id: "316", x: 24, y: 76, width: 8, height: 5.8, capacity: 4, minGuests: 3 },
];

const areas: Area[] = [
  { id: "indoor", name: "Inneservering", subtitle: "Plan 1", tables: indoorTables },
  { id: "terrace", name: "Uteservering", subtitle: "Ute", tables: terraceTables },
  { id: "lounge", name: "Shisha", subtitle: "Plan 2", tables: loungeTables },
];



type AdminBooking = {
  booking_id: string;
  table_number: string;
  customer_name: string;
  phone: string | null;
  email: string | null;
  guests: number;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
};

const bookingTimes = [
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
  "22:00", "22:30", "23:00", "23:30", "00:00",
];

function getToday() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000)
    .toISOString()
    .split("T")[0];
}

function normalizeTableNumber(value: string) {
  return value.trim().toUpperCase();
}

export default function AdminFloorManager() {
  const supabase = useMemo(() => createClient(), []);

  const [activeAreaId, setActiveAreaId] = useState<AreaId>("indoor");
  const [bookingDate, setBookingDate] = useState(getToday());
  const [bookingTime, setBookingTime] = useState("17:30");

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [notePhone, setNotePhone] = useState("");
  const [noteEmail, setNoteEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const activeArea = useMemo(
    () => areas.find((area) => area.id === activeAreaId) ?? areas[0],
    [activeAreaId],
  );

  const selectedTable = useMemo(
    () =>
      activeArea.tables.find((table) => table.id === selectedTableId) ?? null,
    [activeArea, selectedTableId],
  );

  const bookingsByTable = useMemo(() => {
    const map = new Map<string, AdminBooking>();

    for (const booking of bookings) {
      map.set(normalizeTableNumber(booking.table_number), booking);
    }

    return map;
  }, [bookings]);

  const selectedBooking = selectedTableId
    ? bookingsByTable.get(normalizeTableNumber(selectedTableId)) ?? null
    : null;

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.rpc(
      "get_admin_floor_bookings",
      {
        p_booking_date: bookingDate,
        p_booking_time: bookingTime,
      },
    );

    if (error) {
      setMessage(`Kunde inte hämta bokningar: ${error.message}`);
      setBookings([]);
      setLoading(false);
      return;
    }

    setBookings((data ?? []) as AdminBooking[]);
    setLoading(false);
  }, [bookingDate, bookingTime, supabase]);

  useEffect(() => {
    void loadBookings();
    setSelectedTableId(null);
  }, [loadBookings]);

  useEffect(() => {
    const channel = supabase
      .channel(`admin-floor-${bookingDate}-${bookingTime}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          void loadBookings();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [bookingDate, bookingTime, loadBookings, supabase]);

  function selectArea(areaId: AreaId) {
    setActiveAreaId(areaId);
    setSelectedTableId(null);
    setMessage("");
  }

  function selectTable(table: RestaurantTable) {
    setSelectedTableId(table.id);
    setGuestCount(table.minGuests);
    setCustomerName("");
    setNotePhone("");
    setNoteEmail("");
    setMessage("");
  }

  async function createBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedTable) return;

    if (customerName.trim().length < 2) {
      setMessage("Skriv kundens namn.");
      return;
    }

    if (guestCount < selectedTable.minGuests) {
      setMessage(
        `Bordet kräver minst ${selectedTable.minGuests} gäster.`,
      );
      return;
    }

    if (guestCount > selectedTable.capacity) {
      setMessage(
        `Bordet har plats för högst ${selectedTable.capacity} gäster.`,
      );
      return;
    }

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.rpc("create_admin_booking", {
      p_table_number: selectedTable.id,
      p_customer_name: customerName.trim(),
      p_guests: guestCount,
      p_booking_date: bookingDate,
      p_booking_time: bookingTime,
      p_customer_phone: notePhone.trim() || null,
      p_customer_email: noteEmail.trim().toLowerCase() || null,
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      await loadBookings();
      return;
    }

    setMessage(
      `Bord ${selectedTable.id} är bokat för ${customerName.trim()}.`,
    );
    setSubmitting(false);
    await loadBookings();
  }

  async function cancelBooking() {
    if (!selectedBooking) return;

    const confirmed = window.confirm(
      `Avboka bokningen för ${selectedBooking.customer_name} på bord ${selectedBooking.table_number}?`,
    );

    if (!confirmed) return;

    setSubmitting(true);
    setMessage("");

    const { error } = await supabase.rpc("cancel_admin_booking", {
      p_booking_id: selectedBooking.booking_id,
    });

    if (error) {
      setMessage(error.message);
      setSubmitting(false);
      return;
    }

    setMessage("Bokningen har avbokats och bordet är nu ledigt.");
    setSubmitting(false);
    setSelectedTableId(null);
    await loadBookings();
  }

  return (
    <section className="px-5 pb-20 pt-10 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
              Live floor manager
            </p>
            <h1 className="mt-4 font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.88]">
              Hantera borden.
            </h1>
          </div>

          <div className="grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-2">
            <label>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Datum
              </span>
              <input
                type="date"
                value={bookingDate}
                onChange={(event) => setBookingDate(event.target.value)}
                className="mt-2 min-h-12 w-full border border-white/20 bg-[#24211D] px-4 text-white outline-none focus:border-[#B08A52]"
              />
            </label>

            <label>
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Tid
              </span>
              <select
                value={bookingTime}
                onChange={(event) => setBookingTime(event.target.value)}
                className="mt-2 min-h-12 w-full border border-white/20 bg-[#24211D] px-4 text-white outline-none focus:border-[#B08A52]"
              >
                {bookingTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </label>
          </div>
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
                    {loading
                      ? "Hämtar bokningar..."
                      : "Klicka på ett bord för att hantera det"}
                  </p>
                </div>

                <div className="flex gap-4 text-xs text-white/65">
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

                {activeAreaId === "indoor" && (
                  <div className="absolute bottom-[10%] left-[27%] h-[11%] w-[38%] border border-[#D4B27C]/50 bg-[#8A6638]/35">
                    <span className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-[0.2em] text-[#E7C88F]">
                      Bar
                    </span>
                  </div>
                )}

                {activeArea.tables.map((table) => {
                  const selected = selectedTableId === table.id;
                  const booked = bookingsByTable.has(
                    normalizeTableNumber(table.id),
                  );

                  const color = selected
                    ? "border-[#F2D39B] bg-[#C39A58] text-[#191815] shadow-[0_0_0_4px_rgba(195,154,88,.18)]"
                    : booked
                      ? "border-[#C86969] bg-[#9F4040] text-white hover:scale-105"
                      : "border-[#79B686] bg-[#4E8B5B] text-white hover:scale-105 hover:border-white";

                  return (
                    <button
                      key={table.id}
                      type="button"
                      onClick={() => selectTable(table)}
                      className={`absolute flex items-center justify-center border text-center transition duration-200 ${color}`}
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
              Bordshantering
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
                    {selectedBooking ? "Bokat" : "Ledigt"} kl. {bookingTime}
                  </p>
                </div>

                {selectedBooking ? (
                  <div className="mt-6 space-y-5">
                    <div className="border border-[#D8CDBD] bg-white/60 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9A7341]">
                        Kund
                      </p>
                      <h3 className="mt-2 font-serif text-3xl">
                        {selectedBooking.customer_name}
                      </h3>

                      <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-5">
                          <dt className="text-[#676158]">Personer</dt>
                          <dd>{selectedBooking.guests}</dd>
                        </div>
                        <div className="flex justify-between gap-5">
                          <dt className="text-[#676158]">Telefon</dt>
                          <dd className="text-right">
                            {selectedBooking.phone || "Ej angivet"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-5">
                          <dt className="text-[#676158]">E-post</dt>
                          <dd className="break-all text-right">
                            {selectedBooking.email || "Ej angivet"}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-5">
                          <dt className="text-[#676158]">Starttid</dt>
                          <dd>
                            {selectedBooking.booking_time.slice(0, 5)}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-5">
                          <dt className="text-[#676158]">Bokningsnummer</dt>
                          <dd>
                            {selectedBooking.booking_id
                              .slice(0, 8)
                              .toUpperCase()}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    {message && (
                      <div className="border border-[#D8CDBD] px-4 py-3 text-sm leading-6">
                        {message}
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={submitting}
                      onClick={cancelBooking}
                      className="inline-flex min-h-14 w-full items-center justify-center bg-[#9F4040] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#7F3030] disabled:opacity-50"
                    >
                      {submitting ? "Arbetar..." : "Avboka bokning"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={createBooking} className="mt-6 space-y-5">
                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Kundens namn
                      </span>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold uppercase tracking-[0.16em]">
                        Antal personer
                      </span>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={guestCount}
                        onChange={(event) =>
                          setGuestCount(Number(event.target.value))
                        }
                        className="mt-2 min-h-12 w-full border border-[#CDBFAE] bg-white px-4 outline-none focus:border-[#8A6638]"
                      />
                    </label>

                    <details className="border border-[#D8CDBD] bg-white/50 p-4">
                      <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.14em]">
                        Frivillig kontaktinformation
                      </summary>

                      <div className="mt-4 space-y-4">
                        <input
                          type="tel"
                          placeholder="Telefonnummer"
                          value={notePhone}
                          onChange={(event) =>
                            setNotePhone(event.target.value)
                          }
                          className="min-h-11 w-full border border-[#CDBFAE] bg-white px-4 outline-none"
                        />
                        <input
                          type="email"
                          placeholder="E-post"
                          value={noteEmail}
                          onChange={(event) =>
                            setNoteEmail(event.target.value)
                          }
                          className="min-h-11 w-full border border-[#CDBFAE] bg-white px-4 outline-none"
                        />
                      </div>
                    </details>

                    {message && (
                      <div className="border border-[#D8CDBD] px-4 py-3 text-sm leading-6">
                        {message}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-14 w-full items-center justify-center bg-[#191815] px-6 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#3F4935] disabled:opacity-50"
                    >
                      {submitting
                        ? "Sparar bokningen..."
                        : "Boka bordet"}
                    </button>
                  </form>
                )}
              </>
            ) : (
              <div className="mt-6 border border-dashed border-[#CDBFAE] px-5 py-12 text-center">
                <p className="font-serif text-3xl">Inget bord valt</p>
                <p className="mx-auto mt-3 max-w-xs leading-7 text-[#676158]">
                  Klicka på ett rött bord för kunduppgifter eller ett grönt
                  bord för att skapa en telefonbokning.
                </p>

                {message && (
                  <div className="mt-6 border border-[#D8CDBD] px-4 py-3 text-sm">
                    {message}
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}