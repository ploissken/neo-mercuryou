import { query } from "./pool.js";

export async function getUser({ email }) {
  const {
    rows: [user],
  } = await query(
    `SELECT id, name, email, password, settings
       FROM users
       WHERE email = $1`,
    [email]
  );
  return user;
}
