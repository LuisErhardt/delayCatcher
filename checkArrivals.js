import { writeCSV } from "./writeFiles.js";
import { parseDate } from "./util.js";

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

  // console.log(arrivals);

  for (const arrival of arrivals) {
    const date = parseDate(arrival.when);
    const delay = arrival.delay !== null ? arrival.delay : 0;

    if (arrival.line.mode === "train" && arrival.line.product === "regional" && delay >= 3600) {
      const message = `Ankunft in ${arrival.stop.name}: ${arrival.line.name} (${arrival.line.fahrtNr}) aus ${
        arrival.provenance
      }, Zeit: ${date} mit ${Math.round(delay / 60)} Minuten Verspätung`;
      console.log(message);

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

export { getLateArrivalsAtStation };
