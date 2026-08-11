import { Pool } from "pg";
import { environment } from "../env.js";

export const pool = new Pool({
  connectionString: environment.DATABASE_URL,
});
