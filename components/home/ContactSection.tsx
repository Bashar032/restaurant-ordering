export function ContactSection() {
  return (
<section
  id="contact"
  aria-labelledby="contact-heading"
  className="scroll-mt-24 bg-[#3F4935] text-white"
>
      <div
  id="booking"
  className="mx-auto grid max-w-[1600px] scroll-mt-24 lg:grid-cols-2"
>
        <div className="flex items-center px-6 py-24 sm:px-10 lg:px-[clamp(4rem,7vw,8rem)] lg:py-32">
          <div className="max-w-2xl">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#D4B27C]">
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
                  Lägg in Daloonas adress här
                  <br />
                  Jönköping
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-[#D4B27C]">
                  Kontakt
                </h3>
                <div className="mt-4 space-y-2 text-white/80">
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
                  href="#"
                  className="mt-4 inline-flex border-b border-white/40 pb-1 text-white/80 hover:border-white hover:text-white"
                >
                  Instagram
                </a>
              </div>
            </div>

            <a
              href="#booking"
              className="mt-10 inline-flex min-h-14 items-center justify-center bg-[#B08A52] px-9 text-xs font-bold uppercase tracking-[0.22em] text-[#191815] transition hover:bg-[#C29B61]"
            >
              Boka bord
            </a>
          </div>
        </div>

<div className="relative min-h-[520px] overflow-hidden bg-[#191815] lg:min-h-[820px]">
  <video
    className="absolute inset-0 h-full w-full object-cover"
    autoPlay
    muted
    loop
    playsInline
    preload="none"
  >
    <source src="/videos/contact-video.mp4" type="video/mp4" />
  </video>

  <div className="absolute inset-0 bg-black/35" />

  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20" />

  <div className="absolute inset-x-0 bottom-0 p-8 sm:p-12 lg:p-16">
    <p className="max-w-xl font-serif text-4xl leading-tight text-white sm:text-5xl">
      En plats för långa middagar, spontana kvällar och nya minnen.
    </p>
  </div>
</div>
      </div>
    </section>
  );
}