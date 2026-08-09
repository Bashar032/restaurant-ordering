import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const BASE_URL = "http://192.168.0.105:3000";

// ==========================================
// DALOONAS BORD
// ==========================================

const tables = [
  // Inneservering
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",

  // Uteservering
  "101",
  "102",
  "103",
  "104",
  "105",

  "201",
  "202",
  "203",
  "204",

  "401",
  "402",
  "403",
  "404",
  "405",

  "501",
  "502",
  "503",
  "504",

  // Plan 2 / Shisha
  "301",
  "302",
  "303",
  "304",
  "305",
  "306",
  "307",
  "308",
  "309",
  "310",
  "311",
  "312",
  "313",
  "314",
  "315",
  "316",

  // Lounge
  "LOUNGE",
];

// ==========================================
// MAPPA
// ==========================================

const outputDirectory = path.join(
  process.cwd(),
  "public",
  "qr-cards",
);

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

// ==========================================
// LOGGA
// ==========================================

const logoPath = path.join(
  process.cwd(),
  "public",
  "images",
  "daloona-logo.png",
);

let logoBase64 = "";

if (fs.existsSync(logoPath)) {
  logoBase64 = fs.readFileSync(logoPath).toString("base64");
} else {
  console.warn(
    "⚠️ Kunde inte hitta public/images/daloona-logo.png",
  );
}

// ==========================================
// GENERERA SKYLTAR
// ==========================================

for (const table of tables) {
  const url =
    `${BASE_URL}/order/${encodeURIComponent(table)}`;

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 900,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#171512",
      light: "#FFFFFF",
    },
  });

  const displayName =
    table === "LOUNGE"
      ? "LOUNGE"
      : `BORD ${table}`;

  const filename =
    table === "LOUNGE"
      ? "lounge.svg"
      : `table-${table}.svg`;

  const svg = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1200"
  height="1700"
  viewBox="0 0 1200 1700"
>
  <!-- Bakgrund -->
  <rect
    width="1200"
    height="1700"
    rx="45"
    fill="#171512"
  />

  <!-- Guldig ram -->
  <rect
    x="35"
    y="35"
    width="1130"
    height="1630"
    rx="35"
    fill="none"
    stroke="#B08A52"
    stroke-width="4"
  />

  ${
    logoBase64
      ? `
  <image
    href="data:image/png;base64,${logoBase64}"
    x="430"
    y="90"
    width="340"
    height="200"
    preserveAspectRatio="xMidYMid meet"
  />
  `
      : ""
  }

  <!-- Bord -->
  <text
    x="600"
    y="390"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="105"
    fill="#FFFFFF"
    font-weight="400"
  >
    ${displayName}
  </text>

  <!-- Undertitel -->
  <text
    x="600"
    y="470"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="32"
    letter-spacing="8"
    fill="#D4B27C"
  >
    BESTÄLL FRÅN BORDET
  </text>

  <!-- QR vit bakgrund -->
  <rect
    x="230"
    y="555"
    width="740"
    height="740"
    rx="30"
    fill="#FFFFFF"
  />

  <!-- QR -->
  <image
    href="${qrDataUrl}"
    x="270"
    y="595"
    width="660"
    height="660"
  />

  <!-- Instruktion -->
  <text
    x="600"
    y="1405"
    text-anchor="middle"
    font-family="Georgia, serif"
    font-size="55"
    fill="#FFFFFF"
  >
    Skanna för att beställa
  </text>

  <text
    x="600"
    y="1470"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="28"
    fill="#FFFFFF"
    opacity="0.65"
  >
    Öppna kameran på din mobil
  </text>

  <text
    x="600"
    y="1515"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="28"
    fill="#FFFFFF"
    opacity="0.65"
  >
    och skanna QR-koden.
  </text>

  <!-- Daloona -->
  <text
    x="600"
    y="1605"
    text-anchor="middle"
    font-family="Arial, sans-serif"
    font-size="22"
    letter-spacing="8"
    fill="#B08A52"
  >
    DALOONA · JÖNKÖPING
  </text>
</svg>
`;

  fs.writeFileSync(
    path.join(outputDirectory, filename),
    svg.trim(),
    "utf8",
  );

  console.log(
    `✅ ${displayName} → ${url}`,
  );
}

console.log("");
console.log(
  "🎉 Alla QR-skyltar finns nu i public/qr-cards",
);