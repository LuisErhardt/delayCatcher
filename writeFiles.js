import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";
import { eintragExistiert } from "./util.js";

function writeCSV(data, date) {
  // Aktuellen Monat und Tag mit führender 0
  const monat = String(date.getMonth() + 1).padStart(2, "0");
  const tag = String(date.getDate()).padStart(2, "0");
  const dateiname = `data/delays${tag}_${monat}.csv`;

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

export { writeCSV };
