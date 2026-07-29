const menuCategories = [
  {
    title: "Kalla mezze",
    items: [
      ["Hummus", "Krämig kikärtsröra med tahini och citron."],
      ["Moutabal", "Rökt aubergine med tahini och vitlök."],
      ["Fattoush", "Fräsch sallad med örter och krispigt bröd."],
    ],
  },
  {
    title: "Från grillen",
    items: [
      ["Shish tawouk", "Marinerad kyckling grillad över öppen eld."],
      ["Lahm mashawi", "Saftigt grillat kött med mellanösternkryddor."],
      ["Mix grill", "Ett urval av våra mest uppskattade grillrätter."],
    ],
  },
  {
    title: "Dryck",
    items: [
      ["Mojito", "Lime, mynta och frisk svalka."],
      ["Lemon mint", "Citron, mynta och en lätt sötma."],
      ["Ayran", "Klassisk kall yoghurtdryck."],
    ],
  },
];

export function MenuPreview() {
  return (
<section
  id="menu"
  aria-labelledby="menu-heading"
  className="scroll-mt-24 bg-[#F3EEE3] px-6 py-24 text-[#191815] sm:px-10 lg:px-16 lg:py-32"
>
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 border-b border-[#D8CDBD] pb-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#B08A52]">
              Ett urval från menyn
            </p>

            <h2
              id="menu-heading"
              className="mt-5 max-w-3xl font-serif text-[clamp(3.5rem,7vw,7.2rem)] leading-[0.94] tracking-[-0.045em]"
            >
              Smaker för hela bordet.
            </h2>
          </div>

          <div className="max-w-xl lg:justify-self-end">
            <p className="text-base leading-8 text-[#676158] sm:text-lg">
              Välj bland klassiska mezze, grillade rätter och friska drycker.
              Menyn är skapad för att delas och upptäckas tillsammans.
            </p>

            <a
              href="/menu"
              className="mt-8 inline-flex min-h-14 items-center justify-center bg-[#3F4935] px-8 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#30382A]"
            >
              Se hela menyn
            </a>
          </div>
        </div>

        <div className="grid gap-12 pt-14 lg:grid-cols-3 lg:gap-16">
          {menuCategories.map((category) => (
            <article key={category.title}>
              <h3 className="font-serif text-3xl">{category.title}</h3>

              <div className="mt-7 divide-y divide-[#D8CDBD] border-y border-[#D8CDBD]">
                {category.items.map(([name, description]) => (
                  <div key={name} className="py-6">
                    <h4 className="font-serif text-2xl">{name}</h4>
                    <p className="mt-2 leading-7 text-[#676158]">
                      {description}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}