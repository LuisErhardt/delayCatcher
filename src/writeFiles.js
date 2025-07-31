import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import { eintragExistiert } from "./util.js";
import path from "path";

function writeCSV(data, date, directory) {
  // Aktuellen Monat und Tag mit führender 0
  const year = date.getFullYear();
  const monat = String(date.getMonth() + 1).padStart(2, "0");
  const dir = path.join(directory, `${year}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const dateiname = `${dir}/delays${monat}.csv`;

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
    if (!gefunden) {
      const message = `Ankunft in ${data[0].Zielbahnhof}: ${data[0].Zugnummer} aus ${data[0].Startbahnhof}, Zeit: ${data[0].Ankunft_tatsächlich} mit ${data[0].Verspätung} Minuten Verspätung`;
      console.log(message);
      csvWriter.writeRecords(data);
    }
  });
}

export { writeCSV };
