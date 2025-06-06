import { getLateArrivalsMunster, getLateArrivalsDuisburg } from "./checkArrivals.js";
import { createClient } from "db-vendo-client";
import { profile as dbProfile } from "db-vendo-client/p/db/index.js";

try {
  const userAgent = "https://github.com/LuisErhardt/delayCatcher"; // adapt this to your project!
  const client = createClient(dbProfile, userAgent);

  const time = new Date();
  //   time.setHours(16, 40, 0, 0);

  const date = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(time);
  console.log(`Checking for late arrivals at ${date}...`);

  getLateArrivalsMunster(time, client);
  getLateArrivalsDuisburg(time, client);
} catch (error) {
  console.error("An error occurred:", error);
}
