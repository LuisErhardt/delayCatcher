import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import { eintragExistiert } from "./util.js";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

async function insertArrival(row) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const query = `
    INSERT INTO arrivals (
      startbahnhof, zugnummer, zielbahnhof, ankunft_plan, ankunft_tatsaechlich, verspaetung_minuten
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;

  row = row[0];
  const values = [
    row.Startbahnhof,
    row.Zugnummer,
    row.Zielbahnhof,
    row.Ankunft_Plan,
    row["Ankunft_tatsächlich"],
    parseInt(row.Verspätung, 10),
  ];

  try {
    await pool.query(query, values);
    console.log(`✔ Uploaded: ${row.Zugnummer} → ${row.Zielbahnhof}`);
  } catch (err) {
    console.error(`❌ Fehler bei ${row.Zugnummer}:`, err.message);
  }
}

function writeCSV(data, date) {
  // Aktuellen Monat und Tag mit führender 0
  const monat = String(date.getMonth() + 1).padStart(2, "0");
  const dateiname = `data/delays${monat}.csv`;

  // Prüfen, ob Datei schon existiert
  const dateiExistiert = fs.existsSync(dateiname);

  const csvWriter = createObjectCsvWriter({
    path: dateiname,
    header: [
      { id: "Startbahnhof", title: "Startbahnhof" },
      { id: "Zugnummer", title: "Zugnummer" },
      { id: "Zielbahnhof", title: "Zielbahnhof" },
      { id: "Ankunft_Plan", title: "Ankunft_Plan" },
      { id: "Ankunft_tatsächlich", title: "Ankunft_tatsächlich" },
      { id: "Verspätung", title: "Verspätung" },
    ],
    append: dateiExistiert, // Wenn Datei existiert → anhängen
    fieldDelimiter: ";",
  });
  eintragExistiert(dateiname, data, dateiExistiert, (gefunden) => {
    if (gefunden) {
      console.log("Eintrag existiert bereits:", data);
    } else {
      csvWriter.writeRecords(data);
    }
  });
}

export { writeCSV, insertArrival };
