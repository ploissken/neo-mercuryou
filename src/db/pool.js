import {
  POOL_CONNECTION_TIMEOUT,
  POOL_MAX_CONNECTIONS,
} from "../utils/consts.d.js";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: POOL_MAX_CONNECTIONS,
  idleTimeoutMillis: POOL_CONNECTION_TIMEOUT,
});

export const query = (text, params) => pool.query(text, params);

export async function transaction(callback) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
