import csv from "csv-parser";
import fs from "fs";

/** Parse string date to a readable date string
 * @param {string} date - The date string to parse.
 * @returns {string} - The formatted date string.
 */
function parseDate(date) {
  date = Date.parse(date);
  date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(date);

  return date;
}

/**
 * Checks if an entry already exists in a CSV file.
 * @param {string} dateipfad - The path to the CSV file.
 * @param {Array} kriterium - The entry to check for.
 * @param {boolean} dateiExistiert - Whether the file already exists.
 * @param {function} callback - Callback function to return the result.
 */
function eintragExistiert(dateipfad, kriterium, dateiExistiert, callback) {
  let gefunden = false;
  if (dateiExistiert) {
    fs.createReadStream(dateipfad)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        row = [row];
        if (JSON.stringify(row) === JSON.stringify(kriterium)) {
          gefunden = true;
        }
      })
      .on("end", () => {
        callback(gefunden);
      });
  } else {
    callback(gefunden);
  }
}

export { parseDate, eintragExistiert };
