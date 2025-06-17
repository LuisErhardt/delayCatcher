import { getLateDeparturesAtDuisburgToMuenster } from "./src/checkArrivals.js";
import { createClient } from "db-vendo-client";
import { profile as dbProfile } from "db-vendo-client/p/db/index.js";
import dotenv from "dotenv";

dotenv.config();

const date = new Date(Date.now() - 30 * 60 * 1000);

const userAgent = process.env.USERAGENT; // adapt this to your project!
const client = createClient(dbProfile, userAgent);

getLateDeparturesAtDuisburgToMuenster(date, client);
