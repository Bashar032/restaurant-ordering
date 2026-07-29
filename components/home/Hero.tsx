export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      {/* Bakgrundsvideo */}
      <video
        className="absolute inset-0 -z-30 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Mörk overlay för läsbarhet */}
      <div className="absolute inset-0 -z-20 bg-black/55" />

      {/* Gradienter som skapar djup */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/35 via-transparent to-black/75" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.45)_100%)]" />

      {/* Hero-innehåll */}
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pb-24 pt-32 text-center text-white sm:px-8">
        <p className="mb-6 text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-white/90 sm:text-xs md:text-sm">
          Strandbar &amp; restaurang
        </p>

        <h1 className="font-serif text-[clamp(4.5rem,14vw,11rem)] font-normal leading-[0.78] tracking-[-0.055em]">
          Daloona
        </h1>

        <p className="mt-10 max-w-3xl text-sm font-medium uppercase leading-7 tracking-[0.2em] text-white/90 sm:text-base sm:leading-8 md:text-lg">
          Traditionella smaker från Mellanöstern möter en modern känsla vid
          Vätterns strand.
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col justify-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <a
            href="#booking"
            className="inline-flex min-h-14 items-center justify-center bg-[#B08A52] px-9 text-xs font-bold uppercase tracking-[0.22em] text-[#15130f] transition duration-300 hover:bg-[#c29b61] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Boka bord
          </a>

          <a
            href="/menu"
            className="inline-flex min-h-14 items-center justify-center border border-white/55 bg-black/15 px-9 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition duration-300 hover:border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Utforska menyn
          </a>
        </div>
      </div>

      {/* Scrollindikator */}
      <a
        href="#about"
        aria-label="Scrolla till nästa sektion"
        className="group absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-white sm:bottom-9"
      >
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-white/80">
          Upptäck Daloona
        </span>

        <span className="flex h-9 w-px justify-center overflow-hidden bg-white/30">
          <span className="block h-4 w-px animate-bounce bg-white" />
        </span>
      </a>
    </section>
  );
}