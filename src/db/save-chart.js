import { transaction } from "./pool.js";
import { bulkInsert } from "../utils/bulk-insert.db.js";

export async function insertChart({ userId, chart, name, referenceDate }) {
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
        JSON.stringify(chart.metadata),
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
