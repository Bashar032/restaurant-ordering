import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  name: string;
  description?: string;
  price: string;
  image?: string;
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
    id: "meza",
    title: "Meza",
    description:
      "Klassiska röror, sallader och smårätter som passar att dela runt bordet.",
    items: [
      {
        name: "Hummus",
        description: "Kikärtsröra med vitlök och olivolja.",
        price: "69 kr",
      },
      {
        name: "Mhamara",
        description:
          "En pepprig, het och smakrik röra på paprikapuré, rostade valnötter och granatäpplesirap.",
        price: "69 kr",
      },
      {
        name: "Crème Toum",
        description: "Vitlökscrème.",
        price: "59 kr",
        image: "/images/menu/creme-toum.jpg",
      },
      {
        name: "Moutabal",
        description: "Grillad aubergineröra med en härligt rökig smak.",
        price: "69 kr",
      },
      {
        name: "Tzatziki",
        description: "Mild grekisk yoghurt med gurka.",
        price: "69 kr",
      },
      {
        name: "Tarator Djej",
        description: "Kycklingröra med tahini och vitlök.",
        price: "69 kr",
      },
      {
        name: "Kebbeh",
        description:
          "4 friterade färsbollar fyllda med köttfärs, lök och valnötter.",
        price: "89 kr",
      },
      {
        name: "Warak Inab",
        description:
          "Vinbladsdolma fyllda med en syrlig vegetarisk blandning.",
        price: "79 kr",
        image: "/images/menu/warak-inab.jpg",
      },
      {
        name: "Tabbouleh",
        description:
          "Persiljesallad smaksatt med lök, hackade tomater och lite bulgur.",
        price: "79 kr",
      },
      {
        name: "Ostrullar",
        description: "4 friterade knyten fyllda med ost.",
        price: "79 kr",
      },
      {
        name: "Jawanih",
        description: "6 grillade kycklingvingar.",
        price: "79 kr",
      },
      {
        name: "Fattoush",
        description:
          "Sallad med gurka, tomat och rädisor samt syrlighet från färskpressad citronjuice.",
        price: "79 kr",
      },
      {
        name: "Räksallad",
        description:
          "Fräsch sallad med räkor, grönsaker och en syrlig dressing.",
        price: "Fråga personalen",
        image: "/images/menu/räksallad.jpg",
      },
    ],
  },
  {
    id: "seafood-meza",
    title: "Meza med skaldjur",
    description:
      "Smörstekta och friterade skaldjursrätter med vitlök, koriander och citron.",
    items: [
      {
        name: "Hummus Lahme",
        description: "Hummus med smörstekta lammfilébitar.",
        price: "99 kr",
        image: "/images/menu/hummus-med-kött.jpg",
      },
      {
        name: "Scampi",
        description: "Smörstekta scampi med vitlök, koriander och citron.",
        price: "99 kr",
      },
      {
        name: "Hummus Scampi",
        description: "Hummus med såsig, smörstekt och het scampi.",
        price: "99 kr",
        image: "/images/menu/hummus-scampi.jpg",
      },
      {
        name: "Het Scampi",
        description: "Smörstekta scampi med stark sås.",
        price: "99 kr",
      },
      {
        name: "Musslor",
        description: "Smörstekta musslor med vitlök, koriander och citron.",
        price: "99 kr",
      },
      {
        name: "Friterade Scampi",
        description: "Pankofriterade scampi.",
        price: "99 kr",
      },
    ],
  },
  {
    id: "grill",
    title: "Från grillen",
    description:
      "Grillspett med grillad paprika, serverade med pommes eller ris.",
    items: [
      {
        name: "Kycklingspett",
        description:
          "2 grillade kycklingspett med grillad paprika, serveras med pommes eller ris.",
        price: "179 kr",
        image: "/images/menu/kycklingspett.jpg",
      },
      {
        name: "Lammspett",
        description:
          "2 grillade spett med lammfilébitar och grillad paprika, serveras med pommes eller ris.",
        price: "229 kr",
        image: "/images/menu/köttspett.jpg",
      },
      {
        name: "Mix Spett – 2 spett",
        description:
          "Ett kycklingspett och ett köttfärsspett med grillad paprika, serveras med pommes eller ris.",
        price: "179 kr",
      },
      {
        name: "Shish Kebab",
        description:
          "2 köttfärsspett med grillad paprika, serveras med pommes eller ris.",
        price: "179 kr",
        image: "/images/menu/kebabspett.jpg",
      },
      {
        name: "Mix Spett – 3 spett",
        description:
          "Ett kycklingspett, ett köttfärsspett och ett lammspett med grillad paprika, serveras med pommes eller ris.",
        price: "239 kr",
        image: "/images/menu/mixspett-3-spett.jpg",
      },
      {
        name: "Lammracks",
        description:
          "Grillade lammracks med grillad paprika, serveras med pommes eller ris.",
        price: "239 kr",
      },
    ],
  },
  {
    id: "main-courses",
    title: "Varmrätter",
    description:
      "Generösa tallrikar med kyckling, falafel, fisk och klassiska smaker.",
    items: [
      {
        name: "Kebab Betnjan",
        description:
          "Köttfärs och grillat auberginespett med grillade grönsaker, serveras med pommes eller ris.",
        price: "189 kr",
      },
      {
        name: "Shawarma",
        description:
          "Saftig kycklingshawarma serveras med pommes och crème toum.",
        price: "149 kr",
        image: "/images/menu/shawarma.jpg",
      },
      {
        name: "Crispy Chicken",
        description:
          "Friterad kyckling med krispig yta och saftigt inre. Serveras med pommes och dip.",
        price: "145 kr",
      },
      {
        name: "Fish & Chips",
        description:
          "Panerad fisk serveras med pommes och remouladsås.",
        price: "169 kr",
      },
      {
        name: "Falafeltallrik",
        description:
          "Falafelbollar av torkade kikärter och kryddor, serveras med pommes och hummus.",
        price: "145 kr",
        image: "/images/menu/falafel-tallrik.jpg",
      },
      {
        name: "Libanesisk Fajita",
        description:
          "Stekt kyckling, lök, paprika, majs och ost i baguette med pommes och avokadosås.",
        price: "159 kr",
      },
    ],
  },
  {
    id: "wine",
    title: "Vin",
    description: "Rött, vitt, rosé och mousserande.",
    items: [
      {
        name: "Pasqua Mucchietto Nero d’Avola-Shiraz",
        price: "89 kr glas / 339 kr flaska",
      },
      {
        name: "Louis M. Martini California Cabernet Sauvignon",
        price: "119 kr glas / 469 kr flaska",
      },
      {
        name: "Pasqua Mucchietto Chardonnay-Grillo",
        price: "89 kr glas / 339 kr flaska",
      },
      {
        name: "Cono Sur Bicicleta Riesling",
        price: "95 kr glas / 369 kr flaska",
      },
      {
        name: "Barefoot White Zinfandel",
        price: "89 kr glas / 339 kr flaska",
      },
      {
        name: "Mehrlein Pinot Noir Rosé",
        price: "95 kr glas / 369 kr flaska",
      },
      {
        name: "Piccini Prosecco",
        price: "95 kr glas / 369 kr flaska",
      },
      {
        name: "Torre Oria Cava Brut",
        price: "95 kr glas / 369 kr flaska",
      },
    ],
  },
  {
    id: "drinks",
    title: "Drinkar & dryck",
    description:
      "Klassiska drinkar, alkoholfritt, öl, cider, läsk och vatten.",
    items: [
      {
        name: "Mojito",
        description: "Klassisk, passion, jordgubb, hallon eller mango.",
        price: "139 kr",
      },
      {
        name: "Daiquiri",
        description: "Passion, jordgubb, hallon eller mango.",
        price: "139 kr",
      },
      {
        name: "Fläder Collins",
        description: "Gin, limejuice, sockerlag, fläderlikör och äggvita.",
        price: "139 kr",
      },
      {
        name: "Mango Sour",
        description: "Gin, mangolikör, limejuice och sockerlag.",
        price: "139 kr",
      },
      {
        name: "Passion Sour",
        description: "Vodka, passionslikör, limejuice och sockerlag.",
        price: "139 kr",
      },
      {
        name: "Aperol Spritz",
        description: "Aperol och mousserande vin.",
        price: "139 kr",
      },
      {
        name: "Hugo Spritz",
        description: "Fläderlikör, mynta och mousserande vin.",
        price: "139 kr",
      },
      {
        name: "Bellini",
        description: "Persikosyrup och prosecco.",
        price: "139 kr",
      },
      {
        name: "Alkoholfri Mojito / Daiquiri / Mango Sour / Passion Sour",
        price: "69 kr",
      },
      {
        name: "Norrlands Ljus 40 cl",
        price: "75 kr",
      },
      {
        name: "Heineken 40 cl",
        price: "79 kr",
      },
      {
        name: "Krušovice",
        price: "85 kr",
      },
      {
        name: "Briska Cider",
        price: "69 kr",
      },
      {
        name: "Smirnoff Ice",
        price: "69 kr",
      },
      {
        name: "Läsk",
        description: "Coca-Cola, Coca-Cola Zero, Fanta eller Sprite.",
        price: "35 kr",
      },
      {
        name: "Loka",
        description: "Naturell eller citron.",
        price: "35 kr",
      },
    ],
  },
  {
    id: "dessert",
    title: "Dessert & varma drycker",
    description: "Söta avslutningar, färsk juice, kaffe och te.",
    items: [
      {
        name: "Kunafe",
        price: "69 kr",
      },
      {
        name: "Glasskulor",
        description: "Orange eller exotic.",
        price: "69 kr",
      },
      {
        name: "Färsk juice",
        description: "Mango, ananas eller apelsin.",
        price: "69 kr",
      },
      {
        name: "Kaffe",
        price: "25 kr",
      },
      {
        name: "Te",
        price: "25 kr",
      },
    ],
  },
  {
    id: "sets",
    title: "Daloona Set",
    description: "Delningsmenyer för minst två personer.",
    items: [
      {
        name: "Meny 1",
        description:
          "2 valfria meza från sida 1, 1 sallad från sida 2 samt kycklingspett och shish kebab med ris eller pommes.",
        price: "249 kr / person",
      },
      {
        name: "Meny 2",
        description:
          "2 valfria meza från sida 1, 2 valfria meza från sida 2, 1 sallad samt kycklingspett och shish kebab med ris eller pommes.",
        price: "319 kr / person",
      },
      {
        name: "Meny 3",
        description:
          "3 valfria meza från sida 1, 3 valfria meza från sida 2, 1 sallad samt kycklingspett, shish kebab och lammspett med ris eller pommes.",
        price: "449 kr / person",
      },
    ],
  },
];


const sectionThemes = [
  {
    section: "bg-[#F3EEE3] text-[#191815]",
    muted: "text-[#676158]",
    line: "border-[#D8CDBD]",
    card: "bg-[#E9E0D2]",
    price: "text-[#8A6638]",
  },
  {
    section: "bg-[#DDD0BE] text-[#191815]",
    muted: "text-[#625B52]",
    line: "border-[#BFAF9B]",
    card: "bg-[#F3EEE3]",
    price: "text-[#79582F]",
  },
  {
    section: "bg-[#34402F] text-[#FFF9EE]",
    muted: "text-white/65",
    line: "border-white/20",
    card: "bg-[#242D21]",
    price: "text-[#D4B27C]",
  },
  {
    section: "bg-[#171512] text-[#FFF9EE]",
    muted: "text-white/62",
    line: "border-white/15",
    card: "bg-[#25211D]",
    price: "text-[#D4B27C]",
  },
];

function FeaturedMenuCard({
  item,
  theme,
  priority = false,
}: {
  item: MenuItem;
  theme: (typeof sectionThemes)[number];
  priority?: boolean;
}) {
  return (
    <article className={`group overflow-hidden ${theme.card}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#191815] sm:aspect-[5/4]">
        <Image
          src={item.image!}
          alt={item.name}
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 38vw"
          className="object-cover transition duration-1000 ease-out group-hover:scale-[1.045]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <div className="flex items-end justify-between gap-5">
            <h3 className="max-w-[70%] font-serif text-3xl leading-none sm:text-4xl">
              {item.name}
            </h3>

            <p className="shrink-0 text-sm font-bold uppercase tracking-[0.12em] text-[#E7C88F]">
              {item.price}
            </p>
          </div>
        </div>
      </div>

      {item.description && (
        <div className="p-6 sm:p-8">
          <p className={`max-w-xl leading-7 ${theme.muted}`}>
            {item.description}
          </p>
        </div>
      )}
    </article>
  );
}

function TextMenuItem({
  item,
  theme,
}: {
  item: MenuItem;
  theme: (typeof sectionThemes)[number];
}) {
  return (
    <article
      className={`grid gap-4 border-b py-7 sm:grid-cols-[1fr_auto] sm:gap-8 ${theme.line}`}
    >
      <div>
        <h3 className="font-serif text-2xl leading-tight sm:text-3xl">
          {item.name}
        </h3>

        {item.description && (
          <p className={`mt-3 max-w-2xl leading-7 ${theme.muted}`}>
            {item.description}
          </p>
        )}
      </div>

      <p className={`font-serif text-xl sm:text-2xl ${theme.price}`}>
        {item.price}
      </p>
    </article>
  );
}

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-[#171512] text-[#FFF9EE]">
      <header className="absolute inset-x-0 top-0 z-40 border-b border-white/15 bg-black/35 text-white backdrop-blur-sm">
        <div className="mx-auto flex min-h-24 max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-14">
          <Link href="/" aria-label="Tillbaka till Daloonas startsida">
            <Image
              src="/images/daloona-logo.png"
              alt="Daloona"
              width={240}
              height={150}
              priority
              className="h-auto w-28 object-contain sm:w-36"
            />
          </Link>

          <nav
            aria-label="Navigation på menysidan"
            className="flex items-center gap-4 sm:gap-8"
          >
            <Link
              href="/"
              className="hidden text-xs font-bold uppercase tracking-[0.2em] text-white/85 transition hover:text-[#D4B27C] sm:inline"
            >
              Startsida
            </Link>

            <Link
              href="/#booking"
              className="inline-flex min-h-12 items-center justify-center bg-[#B08A52] px-5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[#191815] transition hover:bg-[#C9A76D] sm:px-7"
            >
              Boka bord
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
        <Image
          src="/images/menu/hummus-scampi.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-30 object-cover"
        />

        <div className="absolute inset-0 -z-20 bg-black/48" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/15 to-[#171512]" />

        <div className="mx-auto w-full max-w-[1500px] px-6 pb-20 pt-40 sm:px-10 lg:px-16 lg:pb-28">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.36em] text-[#D4B27C]">
            Daloona · Jönköping
          </p>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <h1 className="font-serif text-[clamp(5rem,14vw,13rem)] font-normal leading-[0.72] tracking-[-0.065em]">
              Meny
            </h1>

            <div className="max-w-xl lg:justify-self-end">
              <p className="text-base leading-8 text-white/75 sm:text-lg">
                Meza, grillrätter och generösa smaker från Mellanöstern —
                skapade för att delas, upptäckas och avnjutas tillsammans.
              </p>

              <a
                href="#meza"
                className="mt-8 inline-flex items-center gap-4 border-b border-[#D4B27C] pb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#F1D9AE]"
              >
                Utforska menyn
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Menykategorier"
        className="sticky top-0 z-30 overflow-x-auto border-y border-[#D8CDBD] bg-[#F3EEE3]/96 text-[#191815] shadow-[0_12px_30px_rgba(25,24,21,0.08)] backdrop-blur-md"
      >
        <div className="mx-auto flex min-w-max max-w-[1500px] gap-2 px-4 py-3 sm:px-8 lg:px-14">
          {menuCategories.map((category, index) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="group inline-flex min-h-10 items-center gap-3 rounded-full border border-[#CDBFAE] px-4 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#5F574D] transition hover:border-[#3F4935] hover:bg-[#3F4935] hover:text-white"
            >
              <span className="text-[#A17D4B] group-hover:text-[#D4B27C]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {category.title}
            </a>
          ))}
        </div>
      </nav>

      {menuCategories.map((category, categoryIndex) => {
        const theme = sectionThemes[categoryIndex % sectionThemes.length];
        const imageItems = category.items.filter((item) => item.image);
        const textItems = category.items.filter((item) => !item.image);

        return (
          <section
            key={category.id}
            id={category.id}
            className={`scroll-mt-20 px-6 py-24 sm:px-10 lg:px-16 lg:py-36 ${theme.section}`}
          >
            <div className="mx-auto max-w-[1500px]">
              <div className="grid gap-10 border-b pb-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
                <div>
                  <p className="text-[0.66rem] font-bold uppercase tracking-[0.3em] text-[#B08A52]">
                    Kapitel {String(categoryIndex + 1).padStart(2, "0")}
                  </p>

                  <h2 className="mt-5 font-serif text-[clamp(3.7rem,7vw,8rem)] leading-[0.83] tracking-[-0.05em]">
                    {category.title}
                  </h2>
                </div>

                <p
                  className={`max-w-xl text-base leading-8 sm:text-lg lg:justify-self-end ${theme.muted}`}
                >
                  {category.description}
                </p>
              </div>

              {imageItems.length > 0 && (
                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {imageItems.map((item, index) => (
                    <FeaturedMenuCard
                      key={item.name}
                      item={item}
                      theme={theme}
                      priority={categoryIndex === 0 && index < 2}
                    />
                  ))}
                </div>
              )}

              {textItems.length > 0 && (
                <div
                  className={`mt-12 grid gap-x-14 border-t lg:grid-cols-2 ${theme.line}`}
                >
                  {textItems.map((item) => (
                    <TextMenuItem
                      key={item.name}
                      item={item}
                      theme={theme}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section className="relative overflow-hidden bg-[#B08A52] px-6 py-20 text-[#191815] sm:px-10 lg:px-16 lg:py-28">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border border-black/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border border-black/10" />

        <div className="relative mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-[0.66rem] font-bold uppercase tracking-[0.28em]">
              Allergier och särskilda önskemål
            </p>

            <h2 className="mt-4 max-w-4xl font-serif text-[clamp(3rem,6vw,6.5rem)] leading-[0.9] tracking-[-0.04em]">
              Fråga oss innan du beställer.
            </h2>

            <p className="mt-6 max-w-2xl leading-8 text-black/65">
              Berätta för personalen om allergier eller särskilda kostbehov.
              Menyn är inte en komplett allergenförteckning.
            </p>
          </div>

          <Link
            href="/#booking"
            className="inline-flex min-h-14 items-center justify-center bg-[#191815] px-8 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-[#30382A]"
          >
            Boka bord
          </Link>
        </div>
      </section>

      <footer className="bg-[#171512] px-6 py-12 text-white sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-t border-white/15 pt-9 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Daloona. Alla rättigheter förbehållna.
          </p>

          <Link
            href="/"
            className="w-fit border-b border-white/30 pb-1 text-white/75 transition hover:border-[#D4B27C] hover:text-[#D4B27C]"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </footer>
    </main>
  );
}