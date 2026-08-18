"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const navigation = [
  { label: "Hem", href: "#home" },
  { label: "Om oss", href: "#about" },
  { label: "Signaturrätter", href: "#signature" },
  { label: "Meny", href: "#menu" },
  { label: "Privata event", href: "/private-events" },
  { label: "Kontakt", href: "#contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled || isOpen
          ? "border-b border-white/15 bg-[#191815] shadow-lg"
          : "border-b border-white/10 bg-black/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto grid h-28 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-14">
        {/* Logotyp */}
        <a
          href="#home"
          aria-label="Gå till startsidan"
          onClick={closeMenu}
          className="relative z-50 justify-self-start"
        >
          <Image
            src="/images/daloona-logo.png"
            alt="Daloona"
            width={240}
            height={160}
            priority
            className="h-auto w-32 object-contain sm:w-36"
          />
        </a>

        {/* Desktopnavigation */}
        <nav
          aria-label="Huvudnavigation"
          className="hidden items-center gap-8 lg:flex xl:gap-12"
        >
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              style={{
                color: "#FFF7E6",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.95)",
              }}
              className={`group relative py-3 text-[0.9rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300 hover:!text-[#D4B27C] ${
  item.label === "Privata event"
    ? "!text-[#D4B27C]"
    : ""
}`}
            >
              {item.label}

              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[#D4B27C] transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        {/* Bokningsknapp */}
        <a
          href="/booking"
          className="hidden min-h-14 items-center justify-center justify-self-end border border-[#B08A52] bg-[#B08A52] px-8 text-xs font-bold uppercase tracking-[0.2em] text-[#191815] transition duration-300 hover:bg-[#C29B61] lg:inline-flex"
        >
          Boka bord
        </a>

        {/* Mobilknapp */}
        <button
          type="button"
          aria-label={isOpen ? "Stäng menyn" : "Öppna menyn"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((current) => !current)}
          className="relative z-50 col-start-3 flex h-12 w-12 items-center justify-center justify-self-end text-white lg:hidden"
        >
          <span className="sr-only">
            {isOpen ? "Stäng menyn" : "Öppna menyn"}
          </span>

          <span className="relative block h-5 w-7">
            <span
              className={`absolute left-0 top-0 block h-px w-7 bg-current transition duration-300 ${
                isOpen ? "translate-y-[10px] rotate-45" : ""
              }`}
            />

            <span
              className={`absolute left-0 top-[10px] block h-px w-7 bg-current transition duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />

            <span
              className={`absolute bottom-0 left-0 block h-px w-7 bg-current transition duration-300 ${
                isOpen ? "-translate-y-[9px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobilmeny */}
      <div
        id="mobile-navigation"
        className={`fixed inset-0 z-40 flex bg-[#191815] px-6 pb-10 pt-32 transition duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-5 opacity-0"
        }`}
      >
        <div className="flex w-full flex-col">
          <nav
            aria-label="Mobilnavigation"
            className="flex flex-col border-t border-white/15"
          >
            {navigation.map((item, index) => (
<a
  key={item.label}
  href={item.href}
  onClick={closeMenu}
  style={{
    color: "#FFF7E6",
  }}
  className="flex items-center justify-between border-b border-white/15 py-6 font-serif text-3xl transition-colors hover:!text-[#D4B27C]"
>
  <span>
    {item.label}
  </span>

  <span
    style={{ color: "#B08A52" }}
    className="font-sans text-xs tracking-[0.2em]"
  >
    {String(index + 1).padStart(2, "0")}
  </span>
</a>
            ))}
          </nav>

          <a
            href="/booking"
            onClick={closeMenu}
            className="mt-auto inline-flex min-h-14 items-center justify-center bg-[#B08A52] px-8 text-xs font-bold uppercase tracking-[0.22em] text-[#191815]"
          >
            Boka bord
          </a>

          <p className="mt-7 text-center text-xs uppercase tracking-[0.2em] text-white/45">
            Strandbar &amp; restaurang
          </p>
        </div>
      </div>
    </header>
  );
}