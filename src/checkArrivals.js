import { writeCSV } from "./writeFiles.js";
import { parseDate } from "./util.js";
import sendMail from "./mail.js";
import dotenv from "dotenv";

dotenv.config();

/** * Fetches late arrivals at a specific station.
 * If the delay is 60 minutes or more for regional trains, it writes the data to a CSV file.
 * @param {Date} time - The time to check for arrivals.
 * @param {Object} client - The client to fetch arrivals from.
 * @param {string} stationCode - The code of the station to check.
 **/
async function getLateArrivalsAtStation(time, client, stationCode) {
  stationCode = stationCode.toString();

  const { arrivals, _ } = await client.arrivals(stationCode, {
    when: time,
    duration: 59,
  });

  if (!arrivals || arrivals.length === 0) {
    console.log("No arrivals found! Check the stationCode.");
  }

  for (const arrival of arrivals) {
    const delay = arrival.delay !== null ? arrival.delay : 0;

    if (arrival.line.mode === "train" && arrival.line.product === "regional" && delay >= 3600) {
      const ankunft_plan = parseDate(arrival.plannedWhen);
      const ankunft_real = parseDate(arrival.when);
      const data = [
        {
          Startbahnhof: arrival.provenance,
          Zugnummer: `${arrival.line.name} (${arrival.line.fahrtNr})`,
          Zielbahnhof: arrival.stop.name,
          Ankunft_Plan: ankunft_plan,
          Ankunft_tatsächlich: ankunft_real,
          Verspätung: Math.round(delay / 60).toString(),
        },
      ];
      writeCSV(data, time);
    }
  }
}

// 8000263  Münster Hbf
// 8000086 Duisburg Hbf

async function getLateDeparturesAtDuisburgToMuenster(time, client) {
  console.log("Suche nach Verspätungen für " + time.toLocaleString("de-DE"));
  const stationCode = "8000086"; // Duisburg Hbf

  const { departures, _ } = await client.departures(stationCode, {
    when: time,
    duration: 30,
  });

  if (!departures || departures.length === 0) {
    console.log("No arrivals found! Check the stationCode.");
  }

  for (const departure of departures) {
    let delay = departure.delay !== null ? departure.delay : 0;

    const departureTime = new Date(departure.when);
    const cutoffTime = new Date(time);
    cutoffTime.setMinutes(cutoffTime.getMinutes() + 30);

    if (
      (departure.line.name === "RE 2" || departure.line.name === "RE 42") &&
      (departure.direction === "Münster(Westf)Hbf" || departure.direction === "Osnabrück Hbf") &&
      departureTime < cutoffTime &&
      delay >= 20 * 60
    ) {
      delay = Math.round(delay / 60);
      const mailMessage = {};
      mailMessage.subject = `${departure.line.name} in Richtung ${departure.direction}`;
      mailMessage.text = `${departure.line.name} in Richtung ${
        departure.direction
      } war am Bahnhof Duisburg Hbf ${delay} min zu spät. Abfahrt: ${parseDate(departureTime)}`;
      sendMail(mailMessage, process.env.EMAIL_RECEIVER);
    }
  }
}

export { getLateArrivalsAtStation, getLateDeparturesAtDuisburgToMuenster };
