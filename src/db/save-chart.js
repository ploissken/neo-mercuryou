import { transaction } from "./pool.js";

// TODO: save this in a helper
/**
 * Performs a bulk insert into a PostgreSQL table.
 * @param {object} client - pg client (from pool.connect()).
 * @param {string} tableName - Name of the table to insert into.
 * @param {string[]} columns - Array of column names.
 * @param {Array<Array>} rows - Array of row arrays (each inner array is one row of values).
 */
export async function bulkInsert(client, tableName, columns, rows) {
  if (rows.length === 0) return;

  const columnList = columns.map((col) => `"${col}"`).join(", ");

  const valuePlaceholders = rows
    .map((row, rowIndex) => {
      const baseIndex = rowIndex * columns.length;
      const placeholders = row.map(
        (_, colIndex) => `$${baseIndex + colIndex + 1}`
      );
      return `(${placeholders.join(", ")})`;
    })
    .join(", ");

  const flatValues = rows.flat();

  const query = `
      INSERT INTO ${tableName} (${columnList})
      VALUES ${valuePlaceholders}
      RETURNING *
    `;

  const result = await client.query(query, flatValues);
  return result.rows;
}

export async function insertChart({
  userId,
  chart,
  name,
  referenceDate,
  metadata,
}) {
  const persistMetadata = {
    ...chart.metadata,
    ...metadata,
  };

  const ascSignIndex = chart.houses.length > 0 ? chart.houses[0].sign_id : -1;

  return await transaction(async (client) => {
    const {
      rows: [persistedChart],
    } = await client.query(
      `INSERT INTO charts (owner_id, asc_sign_index, houses, name, date, metadata)
               VALUES ($1, $2, $3, $4, $5, $6)
               RETURNING *`,
      [
        userId,
        ascSignIndex,
        JSON.stringify(chart.houses),
        name,
        referenceDate,
        JSON.stringify(persistMetadata),
      ]
    );

    const chartId = persistedChart.id;

    const planetRows = chart.planets.map((planet) => [
      chartId,
      planet.planet_id,
      planet.sign_id,
      planet.longitude,
      JSON.stringify({
        dms: `${planet.degrees}°${planet.minutes}'${planet.seconds}"`,
        speed: planet.speed,
        direction: planet.direction,
        house: planet.house,
      }),
    ]);

    const persistedPlanets = await bulkInsert(
      client,
      "planets",
      ["chart_id", "planet_index", "sign_index", "longitude", "metadata"],
      planetRows
    );

    const aspectRows = chart.aspects.map((aspect) => [
      chartId,
      aspect.planet_a_id,
      aspect.planet_b_id,
      aspect.aspect_id,
      JSON.stringify({
        dms: aspect.dms,
        direction: aspect.direction,
        value: aspect.value,
      }),
    ]);

    const persistedAspects = await bulkInsert(
      client,
      "aspects",
      [
        "chart_id",
        "planet_a_index",
        "planet_b_index",
        "aspect_index",
        "metadata",
      ],
      aspectRows
    );

    return {
      persistedAspects,
      persistedPlanets,
      persistedChart,
    };
  });
}
