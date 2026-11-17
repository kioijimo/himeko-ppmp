import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const db_url = process.env.DATABASE_URL!;
const client = postgres(db_url, { prepare: false });

export const db = drizzle({ client });
