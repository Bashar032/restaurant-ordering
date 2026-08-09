"use client";

export default function PrintQrButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center justify-center bg-[#B08A52] px-6 text-xs font-bold uppercase tracking-[0.18em] text-[#191815]"
    >
      Skriv ut alla
    </button>
  );
}