export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-[#46513B] text-white"
    >
      <div className="grid min-h-[850px] lg:grid-cols-2">
        {/* VÄNSTER: KONTAKTINFORMATION */}
        <div className="flex items-center">
          <div className="w-full px-5 py-20 sm:px-8 lg:px-14 lg:py-28 xl:pl-[max(3.5rem,calc((100vw-1500px)/2))]">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4B27C]">
              Besök oss
            </p>

            <h2
              id="contact-heading"
              className="mt-5 font-serif text-[clamp(3.8rem,7vw,7rem)] leading-[0.92] tracking-[-0.04em]"
            >
              Vi ses vid Vättern.
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-white/70 sm:text-lg">
              Samla familj och vänner för en kväll med generösa smaker,
              avslappnad atmosfär och utsikt över vattnet.
            </p>

            <div className="mt-12 grid gap-10 border-y border-white/20 py-10 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4B27C]">
                  Adress
                </h3>

                <p className="mt-4 leading-7 text-white/80">
                  Östra Storgatan 85 D
                  <br />
                  553 21 Jönköping
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4B27C]">
                  Kontakt
                </h3>

                <div className="mt-4 space-y-2 text-white/80">
                  <a
                    className="block transition hover:text-white"
                    href="tel:+4636163400"
                  >
                    036-16 34 00
                  </a>

                  <a
                    className="block transition hover:text-white"
                    href="mailto:info@daloona.se"
                  >
                    info@daloona.se
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4B27C]">
                  Öppettider
                </h3>

                <p className="mt-4 leading-7 text-white/80">
                  Mån–Tor: 11:00–22:00
                  <br />
                  Fre–Lör: 11:00–23:00
                  <br />
                  Sön: 12:00–21:00
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4B27C]">
                  Följ oss
                </h3>

                <a
                  href="https://www.instagram.com/daloona.jkpg/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex border-b border-white/40 pb-1 text-white/80 transition hover:border-white hover:text-white"
                >
                  Instagram
                </a>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/booking"
                className="inline-flex min-h-14 items-center justify-center bg-[#B08A52] px-9 text-xs font-bold uppercase tracking-[0.22em] text-[#191815] transition hover:bg-[#C29B61]"
              >
                Boka bord
              </a>

              <a
                href="/private-events"
                className="inline-flex min-h-14 items-center justify-center border border-white/25 px-9 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:border-[#B08A52] hover:text-[#D4B27C]"
              >
                Boka privat event
              </a>
            </div>
          </div>
        </div>

        {/* HÖGER: VIDEO */}
        <div className="relative min-h-[650px] overflow-hidden bg-black lg:min-h-full">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source
              src="/videos/contact-video.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-black/10" />

          <div className="absolute bottom-10 left-8 right-8 sm:bottom-12 sm:left-12 sm:right-12">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4B27C]">
              Daloona
            </p>


          </div>
        </div>
      </div>
    </section>
  );
}