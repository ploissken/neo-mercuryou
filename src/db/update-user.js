import { query } from "./pool.js";

export async function updateUser({
  id,
  fullName,
  username,
  genderIdentities,
  sexualOrientations,
}) {
  const {
    rows: [user],
  } = await query(
    `UPDATE users
        SET name = COALESCE($2, name),
            username = COALESCE($3, username),
            gender_id = COALESCE($4, gender_id),
            orientation = COALESCE($5, orientation)
        WHERE id = $1
        RETURNING id, name, username, email, gender_id, orientation, settings`,
    [id, fullName, username, genderIdentities, sexualOrientations]
  );
  return user;
}
