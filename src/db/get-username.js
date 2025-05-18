import { query } from "./pool.js";

export async function getByUsername({ username }) {
  const {
    rows: [user],
  } = await query(
    `SELECT id, username
        FROM users
        WHERE username = $1`,
    [username]
  );
  return user;
}
