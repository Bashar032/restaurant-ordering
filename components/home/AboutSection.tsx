const highlights = [
  {
    number: "01",
    title: "Smaker med tradition",
    description:
      "Rätter inspirerade av Mellanösterns matkultur, tillagade med respekt för råvaran och recepten.",
  },
  {
    number: "02",
    title: "Tillagat med omsorg",
    description:
      "Från krämig hummus till grillat kött – varje servering förbereds med fokus på smak och kvalitet.",
  },
  {
    number: "03",
    title: "Vid Vätterns strand",
    description:
      "En avslappnad restaurangupplevelse där god mat möter utsikten och atmosfären vid vattnet.",
  },
];

export function AboutSection() {
  return (
<section
  id="about"
  aria-labelledby="about-heading"
  className="scroll-mt-24 overflow-hidden bg-[#F3EEE3]"
>
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-2">
        {/* Visuell del */}
        <div className="relative min-h-[520px] overflow-hidden bg-[#191815] sm:min-h-[650px] lg:min-h-screen">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
          >
            <source src="/videos/mashawi.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />

          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10 lg:p-14">
            <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-white/75">
              Vår berättelse
            </p>

            <p className="max-w-lg font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
              Mat som samlar människor runt samma bord.
            </p>
          </div>
        </div>

        {/* Textdel */}
        <div className="flex items-center px-6 py-20 sm:px-10 sm:py-24 lg:px-[clamp(4rem,7vw,8rem)] lg:py-28">
          <div className="w-full max-w-2xl">
            <p className="mb-6 text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#B08A52]">
              Om Daloona
            </p>

            <h2
              id="about-heading"
              className="max-w-xl font-serif text-[clamp(3rem,6vw,6.2rem)] font-normal leading-[0.92] tracking-[-0.035em] text-[#191815]"
            >
              En smakresa vid Vättern.
            </h2>

            <div className="mt-9 max-w-xl space-y-5 text-base leading-8 text-[#676158] sm:text-lg">
              <p>
                På Daloona möts traditionella smaker från Mellanöstern och en
                modern, avslappnad restaurangkänsla.
              </p>

              <p>
                Vi vill skapa en plats där familj, vänner och nya bekantskaper
                kan samlas kring generösa rätter, färska råvaror och varm
                gästfrihet.
              </p>
            </div>

            <div className="mt-12 divide-y divide-[#D8CDBD] border-y border-[#D8CDBD]">
              {highlights.map((highlight) => (
                <article
                  key={highlight.number}
                  className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-6"
                >
                  <span
                    aria-hidden="true"
                    className="text-xs font-bold tracking-[0.2em] text-[#B08A52]"
                  >
                    {highlight.number}
                  </span>

                  <div>
                    <h3 className="font-serif text-2xl text-[#191815]">
                      {highlight.title}
                    </h3>

                    <p className="mt-2 max-w-lg leading-7 text-[#676158]">
                      {highlight.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <a
              href="#signature"
              className="group mt-10 inline-flex items-center gap-4 text-xs font-bold uppercase tracking-[0.22em] text-[#191815]"
            >
              Upptäck våra smaker

              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}