import Image from "next/image";
import PrintQrButton from "@/components/admin/PrintQrButton";

const tables = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",

  "101", "102", "103", "104", "105",

  "201", "202", "203", "204",

  "301", "302", "303", "304", "305", "306", "307", "308",
  "309", "310", "311", "312", "313", "314", "315", "316",

  "401", "402", "403", "404", "405",

  "501", "502", "503", "504",

  "LOUNGE",
];

function getQrPath(table: string) {
  if (table === "LOUNGE") {
    return "/qr-cards/lounge.svg";
  }

  return `/qr-cards/table-${table}.svg`;
}

export default function AdminQrPage() {
  return (
    <main className="min-h-screen bg-[#171512] px-6 py-10 text-white print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-[1500px] print:max-w-none">

        {/* Rubrik */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 print:hidden">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
              Daloona admin
            </p>

            <h1 className="mt-3 font-serif text-5xl">
              QR-koder
            </h1>

            <p className="mt-3 max-w-xl text-white/55">
              Alla bordsskyltar är färdiga för utskrift.
            </p>
          </div>

          <PrintQrButton />
        </div>

        {/* Alla QR-skyltar */}
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3 print:grid-cols-2 print:gap-4">
          {tables.map((table) => (
            <article
              key={table}
              className="break-inside-avoid border border-white/10 bg-white p-3 print:border-black/10"
            >
              <Image
                src={getQrPath(table)}
                alt={
                  table === "LOUNGE"
                    ? "QR-kod Lounge"
                    : `QR-kod bord ${table}`
                }
                width={1200}
                height={1700}
                className="h-auto w-full"
              />
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}