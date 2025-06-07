import { getLateArrivalsAtStation } from "./checkArrivals.js";
import { createClient } from "db-vendo-client";
import { profile as dbProfile } from "db-vendo-client/p/db/index.js";

// 8000207 Köln Hbf
// 8000086 Duisburg Hbf

try {
  const userAgent = "https://github.com/LuisErhardt/delayCatcher"; // adapt this to your project!
  const client = createClient(dbProfile, userAgent);

  const time = new Date();

  for (let i = 0; i <= 23; i++) {
    time.setHours(i, 0, 0, 0);
    console.log(`Checking arrivals on ${time.toLocaleString("de-DE")}`);
    await getLateArrivalsAtStation(time, client, 8000207);
  }
} catch (error) {
  console.error("An error occurred:", error);
}
