import sendMail from "./mail.js";
import dotenv from "dotenv";

dotenv.config();

// 8000086 Duisburg Hbf Code
// 8000263 Münster Hbf Code

/** * Fetches late arrivals for the RE 2 and RE 42 lines at Münster Hbf.
 * If the delay is 60 minutes or more, it sends an email notification.
 * @param {Date} time - The time to check for arrivals.
 * @param {Object} client - The client to fetch arrivals from.
 **/
async function getLateArrivalsMunster(time, client) {
  const { arrivals, _ } = await client.arrivals("8000263", {
    when: time,
    duration: 10,
  });

  for (const arrival of arrivals) {
    if (
      (arrival.line.name === "RE 2" && arrival.provenance === "Düsseldorf Hbf") ||
      (arrival.line.name === "RE 42" && arrival.provenance === "Mönchengladbach Hbf")
    ) {
      let date = Date.parse(arrival.when);
      date = new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(date);

      const delay = arrival.delay !== null ? arrival.delay : 0;

      if (delay >= 3600) {
        const message = `Ankunft in Münster(Westf)Hbf: ${arrival.line.name} (${
          arrival.line.fahrtNr
        }), Zeit: ${date} mit ${Math.round(delay / 60)} Minuten Verspätung`;
        console.log(message);
        sendMail(message, process.env.EMAIL_RECEIVER);
      }
    }
  }
}

/** * Fetches late arrivals for the RE 2 and RE 42 lines at Duisburg Hbf.
 * If the delay is 60 minutes or more, it sends an email notification.
 * @param {Date} time - The time to check for arrivals.
 * @param {Object} client - The client to fetch arrivals from.
 **/
async function getLateArrivalsDuisburg(time, client) {
  const { arrivals, _ } = await client.arrivals("8000086", {
    when: time,
    duration: 10,
  });

  for (const arrival of arrivals) {
    if (
      (arrival.line.name === "RE 2" && arrival.provenance === "Osnabrück Hbf") ||
      (arrival.line.name === "RE 42" && arrival.provenance === "Münster(Westf)Hbf")
    ) {
      let date = Date.parse(arrival.when);
      date = new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(date);

      const delay = arrival.delay !== null ? arrival.delay : 0;

      if (delay >= 3600) {
        const message = `Ankunft in Duisburg Hbf: ${arrival.line.name} (${
          arrival.line.fahrtNr
        }), Zeit: ${date} mit ${Math.round(delay / 60)} Minuten Verspätung`;
        console.log(message);
        sendMail(message, process.env.EMAIL_RECEIVER);
      }
    }
  }
}

export { getLateArrivalsMunster, getLateArrivalsDuisburg };
