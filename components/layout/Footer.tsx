import Image from "next/image";

const navigation = [
  { label: "Hem", href: "#home" },
  { label: "Om oss", href: "#about" },
  { label: "Signaturrätter", href: "#signature" },
  { label: "Meny", href: "#menu" },
  { label: "Kontakt", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#191815] px-6 pb-8 pt-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 border-b border-white/15 pb-14 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image
              src="/images/daloona-logo.png"
              alt="Daloona"
              width={180}
              height={80}
              className="h-auto w-40 object-contain"
            />

            <p className="mt-6 max-w-sm leading-7 text-white/60">
              Traditionella smaker från Mellanöstern möter en modern känsla vid
              Vätterns strand.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#B08A52]">
              Navigera
            </h2>

            <nav className="mt-6 flex flex-col items-start gap-3">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white/70 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[#B08A52]">
              Kontakt
            </h2>

            <div className="mt-6 space-y-3 text-white/70">
              <p>Jönköping, Sverige</p>
              <a className="block hover:text-white" href="tel:+46000000000">
                000-000 00 00
              </a>
              <a
                className="block hover:text-white"
                href="mailto:info@daloona.se"
              >
                info@daloona.se
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Daloona. Alla rättigheter förbehållna.</p>
          <p>Strandbar &amp; restaurang</p>
        </div>
      </div>
    </footer>
  );
}