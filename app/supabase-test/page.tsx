"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type RestaurantTable = {
  id: string;
  table_number: string;
  area: string;
  capacity: number;
  min_guests: number;
  type: string;
  active: boolean;
};

export default function SupabaseTestPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTables() {
      const supabase = createClient();

      const { data, error: supabaseError } = await supabase
        .from("restaurant_tables")
        .select(
          "id, table_number, area, capacity, min_guests, type, active",
        )
        .eq("active", true)
        .order("area")
        .order("table_number");

      if (supabaseError) {
        setError(supabaseError.message);
        setLoading(false);
        return;
      }

      setTables(data ?? []);
      setLoading(false);
    }

    loadTables();
  }, []);

  return (
    <main className="min-h-screen bg-[#171512] px-6 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B08A52]">
          Supabase-test
        </p>

        <h1 className="mt-4 font-serif text-5xl">
          Restaurangens bord
        </h1>

        {loading && (
          <p className="mt-8 text-white/60">Hämtar bord...</p>
        )}

        {error && (
          <div className="mt-8 border border-red-500 bg-red-950/40 p-5 text-red-200">
            <strong>Fel:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="mt-5 text-white/60">
              Databasen returnerade {tables.length} bord.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => (
                <article
                  key={table.id}
                  className="border border-white/15 bg-white/[0.04] p-5"
                >
                  <h2 className="font-serif text-3xl">
                    {table.table_number === "LOUNGE"
                      ? "Lounge"
                      : `Bord ${table.table_number}`}
                  </h2>

                  <dl className="mt-4 space-y-2 text-sm text-white/65">
                    <div className="flex justify-between gap-4">
                      <dt>Avdelning</dt>
                      <dd>{table.area}</dd>
                    </div>

                    <div className="flex justify-between gap-4">
                      <dt>Kapacitet</dt>
                      <dd>{table.capacity} personer</dd>
                    </div>

                    <div className="flex justify-between gap-4">
                      <dt>Minst</dt>
                      <dd>{table.min_guests} personer</dd>
                    </div>

                    <div className="flex justify-between gap-4">
                      <dt>Typ</dt>
                      <dd>{table.type}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}