import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const tables = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13",

  "101", "102", "103", "104", "105",
  "201", "202", "203", "204",

  "401", "402", "403", "404", "405",

  "501", "502", "503", "504",

  "301", "302", "303", "304", "305", "306", "307", "308",
  "309", "310", "311", "312", "313", "314", "315", "316",

  "LOUNGE",
];

// När daloona.se pekar på den nya sajten använder vi denna.
const BASE_URL = "http://192.168.0.105:3000";

const outputDirectory = path.join(
  process.cwd(),
  "public",
  "qr",
);

fs.mkdirSync(outputDirectory, {
  recursive: true,
});

for (const table of tables) {
  const url = `${BASE_URL}/order/${encodeURIComponent(table)}`;

  const filename =
    table === "LOUNGE"
      ? "lounge.png"
      : `table-${table}.png`;

  const outputPath = path.join(
    outputDirectory,
    filename,
  );

  await QRCode.toFile(
    outputPath,
    url,
    {
      width: 1000,
      margin: 3,
      errorCorrectionLevel: "H",
    },
  );

  console.log(
    `✅ ${table} → ${url}`,
  );
}

console.log("");
console.log("Alla QR-koder är skapade i public/qr");