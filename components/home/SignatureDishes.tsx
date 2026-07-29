const dishes = [
  {
    title: "Mashawi",
    eyebrow: "Grillat över öppen eld",
    description:
      "Saftigt grillat kött med djupa smaker, kryddat med inspiration från Mellanösterns kök.",
    video: "/videos/mashawi.mp4",
    reverse: false,
  },
  {
    title: "Hummus",
    eyebrow: "Len, krämig och klassisk",
    description:
      "Vår hummus serveras med en balanserad smak av tahini, citron och olivolja.",
    video: "/videos/hummus.mp4",
    reverse: true,
  },
  {
    title: "Fattoush",
    eyebrow: "Friskt och krispigt",
    description:
      "En livfull sallad med färska grönsaker, örter och syrlig dressing.",
    video: "/videos/fattoush.mp4",
    reverse: false,
  },
  {
    title: "Mojito",
    eyebrow: "Frisk svalka",
    description:
      "En uppfriskande drink med lime, mynta och en lätt, elegant sötma.",
    video: "/videos/mojito.mp4",
    reverse: true,
  },
];

export function SignatureDishes() {
  return (
<section
  id="signature"
  aria-labelledby="signature-heading"
  className="scroll-mt-24 bg-[#191815] text-white"
>
      <div className="mx-auto max-w-[1600px] px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#B08A52]">
            Våra signaturrätter
          </p>

          <h2
            id="signature-heading"
            className="mt-5 font-serif text-[clamp(3rem,7vw,7rem)] leading-[0.95] tracking-[-0.04em]"
          >
            Smaker värda att minnas.
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Några av de rätter och drycker som bäst fångar känslan på Daloona.
          </p>
        </div>

        <div className="mt-20 space-y-24 lg:mt-28 lg:space-y-32">
          {dishes.map((dish) => (
            <article
              key={dish.title}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <div
                className={`relative min-h-[520px] overflow-hidden bg-black sm:min-h-[650px] ${
                  dish.reverse ? "lg:order-2" : ""
                }`}
              >
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                >
                  <source src={dish.video} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
              </div>

              <div className={dish.reverse ? "lg:order-1" : ""}>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
                  {dish.eyebrow}
                </p>

                <h3 className="mt-5 font-serif text-[clamp(3.2rem,6vw,6.5rem)] leading-none tracking-[-0.04em]">
                  {dish.title}
                </h3>

                <p className="mt-7 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                  {dish.description}
                </p>

                <a
                  href="#menu"
                  className="group mt-9 inline-flex items-center gap-4 border-b border-white/35 pb-2 text-xs font-bold uppercase tracking-[0.22em] transition-colors hover:border-[#B08A52] hover:text-[#B08A52]"
                >
                  Se hela menyn
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-2"
                  >
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}