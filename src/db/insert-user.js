import { query } from "./pool.js";

export async function insertUser({ email, passwordHash }) {
  const {
    rows: [user],
  } = await query(
    `INSERT INTO users (email, password)
       VALUES ($1, $2)
       RETURNING id, email`,
    [email, passwordHash]
  );
  return user;
}
