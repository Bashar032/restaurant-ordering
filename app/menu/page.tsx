import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  name: string;
  description?: string;
  price: string;
  dietary?: string[];
};

type MenuCategory = {
  id: string;
  title: string;
  description: string;
  items: MenuItem[];
};

const menuCategories: MenuCategory[] = [
  {
    id: "warm-mezze",
    title: "Varma meze",
    description: "Varma smårätter som passar bra att dela runt bordet.",
    items: [
      {
        name: "Friterad kebbeh, 3 st",
        description:
          "Friterade nötfärsbollar fyllda med sauterad köttfärs och lök.",
        price: "69 kr",
      },
      {
        name: "Friterade ostrullar, 4 st",
        description: "Friterade knyten fyllda med ost.",
        price: "69 kr",
      },
    ],
  },
  {
    id: "cold-mezze",
    title: "Kalla meze",
    description:
      "Klassiska röror, sallader och tillbehör från Mellanösterns kök.",
    items: [
      {
        name: "Hummus",
        description:
          "Kikärtsröra av mosade kokta kikärter med vitlök och olivolja.",
        price: "59 kr",
      },
      {
        name: "Moutabal",
        description: "Grillad aubergineröra med en härligt rökig smak.",
        price: "59 kr",
      },
      {
        name: "Mhamara",
        description:
          "En pepprig, het och smakrik röra på paprikapuré, rostade valnötter och granatäpplesirap.",
        price: "59 kr",
      },
      {
        name: "Warak inab",
        description:
          "Vinbladsdolma fyllda med en syrlig vegetarisk blandning.",
        price: "69 kr",
      },
      {
        name: "Tsatsiki",
        description: "Mild grekisk yoghurt med gurka.",
        price: "59 kr",
      },
      {
        name: "Cream toum",
        description: "Vitlöksås.",
        price: "45 kr",
      },
      {
        name: "Tabbouleh",
        description:
          "Persiljesallad smaksatt med lök, hackade tomater och lite bulgur.",
        price: "69 kr",
      },
      {
        name: "Fattoush",
        description:
          "Sallad med gurka, tomat och rädisor samt syrlighet från färskpressad citronjuice.",
        price: "69 kr",
      },
    ],
  },
  {
    id: "main-courses",
    title: "Varmrätter",
    description:
      "Grillspett och generösa tallrikar som serveras med pommes eller ris.",
    items: [
      {
        name: "Kycklingspett",
        description:
          "Två grillade kycklingspett med grillade grönsaker. Serveras med pommes eller ris.",
        price: "169 kr",
      },
      {
        name: "Shish kebab",
        description:
          "Två köttfärsspett med grillade grönsaker. Serveras med pommes eller ris.",
        price: "169 kr",
      },
      {
        name: "Mix spett",
        description:
          "Ett kycklingspett och ett köttfärsspett med grillade grönsaker. Serveras med pommes eller ris.",
        price: "169 kr",
      },
      {
        name: "Crispy chicken",
        description:
          "Friterad kyckling med krispig yta och saftigt inre. Serveras med pommes.",
        price: "145 kr",
      },
      {
        name: "Shawarmatallrik",
        description:
          "Saftig kycklingshawarma serverad med pommes och cream toum.",
        price: "139 kr",
      },
      {
        name: "Falafeltallrik",
        description:
          "Falafelbollar gjorda på torkade kikärter och kryddor. Serveras med pommes och tarator.",
        price: "115 kr",
      },
    ],
  },
  {
    id: "alcohol-free",
    title: "Alkoholfritt",
    description: "Alkoholfria alternativ till maten.",
    items: [
      { name: "Mariestads", price: "49 kr" },
      { name: "Melleruds", price: "49 kr" },
      { name: "Heineken", price: "49 kr" },
      { name: "Briska cider", price: "49 kr" },
      { name: "Spring Village", price: "59 kr" },
      { name: "Rött vin / vitt vin", price: "Fråga personalen" },
    ],
  },
  {
    id: "soft-drinks",
    title: "Läsk",
    description: "Kalla alkoholfria drycker.",
    items: [
      { name: "Loka naturell / Loka citron", price: "35 kr" },
      { name: "Lättöl", price: "35 kr" },
      {
        name: "Coca-Cola / Coca-Cola Zero / Fanta / Sprite",
        price: "35 kr",
      },
    ],
  },
  {
    id: "red-wine",
    title: "Rött vin",
    description: "Röda viner från Frankrike och Italien.",
    items: [
      {
        name: "Art du France Merlot",
        description: "Frankrike.",
        price: "380 kr flaska / 89 kr glas",
      },
      {
        name: "Pasqua Valpolicella Ripasso DOCG",
        description: "Italien.",
        price: "445 kr",
      },
      {
        name: "Louis M. Martini Cabernet Sauvignon",
        description: "Frankrike.",
        price: "495 kr",
      },
    ],
  },
  {
    id: "white-wine",
    title: "Vitt vin",
    description: "Vita viner från Frankrike och Tyskland.",
    items: [
      {
        name: "Art du France Chardonnay, Sauvignon Blanc",
        description: "Frankrike.",
        price: "380 kr flaska / 79 kr glas",
      },
      {
        name: "Even & Odd Riesling",
        description: "Tyskland.",
        price: "420 kr",
      },
      {
        name: "Laroche L Chardonnay",
        description: "Frankrike.",
        price: "430 kr",
      },
    ],
  },
  {
    id: "sparkling-wine",
    title: "Mousserande vin",
    description: "Prosecco, cava och champagne.",
    items: [
      {
        name: "Prosecco Le Contesse Extra Dry",
        description: "Frankrike.",
        price: "375 kr flaska / 95 kr glas",
      },
      {
        name: "Cava",
        description: "Spanien.",
        price: "375 kr flaska / 95 kr glas",
      },
      {
        name: "Philipponnat Royale Reserve",
        description: "Frankrike.",
        price: "855 kr flaska",
      },
    ],
  },
  {
    id: "rose",
    title: "Rosé",
    description: "Rosévin från Frankrike.",
    items: [
      {
        name: "Art de France Grenache",
        description: "Frankrike.",
        price: "380 kr flaska / 89 kr glas",
      },
    ],
  },
  {
    id: "beer",
    title: "Öl",
    description: "Fatöl och flasköl från flera olika länder.",
    items: [
      {
        name: "Heineken fat",
        description: "Nederländerna, 40 cl.",
        price: "85 kr",
      },
      {
        name: "Norrlands Ljus fat",
        description: "Sverige, 40 cl.",
        price: "89 kr",
      },
      {
        name: "Krušovice fat",
        description: "Tjeckien, 40 cl.",
        price: "95 kr",
      },
      {
        name: "A Ship Full of IPA fat",
        description: "Sverige, 33 cl.",
        price: "95 kr",
      },
      {
        name: "Menabrea fat",
        description: "Italien, 33 cl.",
        price: "89 kr",
      },
      {
        name: "Mariestads Export",
        description: "Sverige, 50 cl.",
        price: "85 kr",
      },
      {
        name: "Heineken",
        description: "Nederländerna, 33 cl.",
        price: "69 kr",
      },
      {
        name: "Estrella Damm",
        description: "Spanien, 33 cl.",
        price: "69 kr",
      },
      {
        name: "Daura Damm",
        description: "Spanien, 33 cl.",
        price: "69 kr",
        dietary: ["Glutenfri"],
      },
      {
        name: "Sitting Bulldog IPA",
        description: "Sverige, 33 cl.",
        price: "89 kr",
      },
      {
        name: "Melleruds",
        description: "33 cl.",
        price: "69 kr",
      },
      {
        name: "Sol",
        description: "Mexiko, 33 cl.",
        price: "69 kr",
      },
    ],
  },
  {
    id: "cider",
    title: "Cider",
    description: "Cider och andra kalla drycker.",
    items: [
      {
        name: "Briska Demi Sec Persika",
        description: "33 cl.",
        price: "69 kr",
      },
      {
        name: "Briska Päroncider",
        description: "33 cl.",
        price: "69 kr",
      },
      {
        name: "Briska Äppelcider",
        description: "33 cl.",
        price: "69 kr",
      },
      {
        name: "Briska",
        description: "Fläder, ananas eller hallon och vinbär.",
        price: "69 kr",
      },
      {
        name: "Smirnoff Ice",
        price: "69 kr",
      },
    ],
  },
  {
    id: "spirits",
    title: "Whisky, cognac och rom",
    description: "Serveras per centiliter.",
    items: [
      { name: "Johnnie Walker Red Label", price: "29 kr / cl" },
      { name: "Johnnie Walker Black Label", price: "33 kr / cl" },
      { name: "Dalmore 12 YO", price: "29 kr / cl" },
      { name: "Lagavulin 16 YO", price: "33 kr / cl" },
      { name: "Pierre Ferrand VSOP", price: "33 kr / cl" },
      { name: "Daron Fine", price: "29 kr / cl" },
      { name: "Plantation Grande Reserve", price: "29 kr / cl" },
    ],
  },
];

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#F3EEE3] text-[#191815]">
      <header className="border-b border-white/10 bg-[#191815] text-white">
        <div className="mx-auto flex min-h-24 max-w-[1500px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-14">
          <Link href="/" aria-label="Tillbaka till Daloonas startsida">
            <Image
              src="/images/daloona-logo.png"
              alt="Daloona"
              width={220}
              height={140}
              priority
              className="h-auto w-28 object-contain sm:w-32"
            />
          </Link>

          <nav
            aria-label="Navigation på menysidan"
            className="flex items-center gap-4 sm:gap-8"
          >
            <Link
              href="/"
              className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white/80 transition hover:text-[#D4B27C] sm:inline"
            >
              Startsida
            </Link>

            <Link
              href="/#booking"
              className="inline-flex min-h-12 items-center justify-center bg-[#B08A52] px-5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#191815] transition hover:bg-[#C29B61] sm:px-7"
            >
              Boka bord
            </Link>
          </nav>
        </div>
      </header>

      <section className="bg-[#191815] px-6 pb-24 pt-20 text-white sm:px-10 lg:px-16 lg:pb-32 lg:pt-28">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#B08A52]">
            Daloona
          </p>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="max-w-5xl font-serif text-[clamp(4.5rem,11vw,11rem)] font-normal leading-[0.78] tracking-[-0.055em]">
              Meny
            </h1>

            <p className="max-w-xl text-base leading-8 text-white/65 sm:text-lg lg:justify-self-end">
              Traditionella smaker från Mellanöstern, skapade för att delas
              runt bordet.
            </p>
          </div>
        </div>
      </section>

      <nav
        aria-label="Menykategorier"
        className="sticky top-0 z-30 overflow-x-auto border-b border-[#D8CDBD] bg-[#F3EEE3]/95 backdrop-blur-md"
      >
        <div className="mx-auto flex min-w-max max-w-[1400px] px-5 sm:px-8 lg:px-16">
          {menuCategories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="border-b-2 border-transparent px-4 py-5 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#676158] transition hover:border-[#B08A52] hover:text-[#191815] sm:px-6"
            >
              {category.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="space-y-24 lg:space-y-32">
          {menuCategories.map((category, categoryIndex) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="scroll-mt-24"
            >
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
                <div>
                  <span className="text-[0.68rem] font-bold tracking-[0.25em] text-[#B08A52]">
                    {String(categoryIndex + 1).padStart(2, "0")}
                  </span>

                  <h2
                    id={`${category.id}-heading`}
                    className="mt-5 font-serif text-[clamp(3rem,5vw,5.8rem)] leading-[0.95] tracking-[-0.035em]"
                  >
                    {category.title}
                  </h2>

                  <p className="mt-6 max-w-md leading-8 text-[#676158]">
                    {category.description}
                  </p>
                </div>

                <div className="border-t border-[#D8CDBD]">
                  {category.items.map((item) => (
                    <article
                      key={item.name}
                      className="grid gap-4 border-b border-[#D8CDBD] py-7 sm:grid-cols-[1fr_auto] sm:gap-8"
                    >
                      <div>
                        <h3 className="font-serif text-2xl sm:text-3xl">
                          {item.name}
                        </h3>

                        {item.description && (
                          <p className="mt-3 max-w-2xl leading-7 text-[#676158]">
                            {item.description}
                          </p>
                        )}

                        {item.dietary && item.dietary.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {item.dietary.map((label) => (
                              <span
                                key={label}
                                className="border border-[#D8CDBD] px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[#676158]"
                              >
                                {label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <p className="font-serif text-xl sm:text-2xl">
                        {item.price}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="bg-[#E8DFD0] px-6 py-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-[#B08A52]">
              Allergier och önskemål
            </p>

            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">
              Prata gärna med oss.
            </h2>
          </div>

          <p className="max-w-xl leading-8 text-[#676158] lg:justify-self-end">
            Berätta för personalen om allergier eller särskilda kostbehov innan
            du beställer. Informationen på sidan ersätter inte personalens
            allergenkontroll.
          </p>
        </div>
      </section>

      <footer className="bg-[#191815] px-6 py-10 text-white sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Daloona. Alla rättigheter förbehållna.
          </p>

          <Link
            href="/"
            className="w-fit border-b border-white/30 pb-1 text-white/75 transition hover:border-[#B08A52] hover:text-[#B08A52]"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </footer>
    </main>
  );
}