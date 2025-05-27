/**
 * Performs a bulk insert into a PostgreSQL table.
 * @param {object} client - pg client (from pool.connect()).
 * @param {string} tableName - Name of the table to insert into.
 * @param {string[]} columns - Array of column names.
 * @param {Array<Array>} rows - Array of row arrays (each inner array is one row of values).
 */
export async function bulkInsert(client, tableName, columns, rows) {
  if (rows.length === 0) return;

  const columnNames = columns.map((col) => `"${col}"`).join(", ");

  const valuePlaceholders = rows
    .map((row, rowIndex) => {
      const baseIndex = rowIndex * columns.length;
      const placeholders = row.map(
        (_, colIndex) => `$${baseIndex + colIndex + 1}`
      );
      return `(${placeholders.join(", ")})`;
    })
    .join(", ");

  const rowValues = rows.flat();

  const query = `
      INSERT INTO ${tableName} (${columnNames})
      VALUES ${valuePlaceholders}
      RETURNING *
    `;

  const result = await client.query(query, rowValues);
  return result.rows;
}
