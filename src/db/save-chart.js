import { constants } from "sweph";
import { transaction } from "./pool.js";
import { bulkInsert } from "../utils/bulk-insert.db.js";

export async function insertChart({ userId, chart, name, referenceDate }) {
  const ascSignIndex = chart.houses.length > 0 ? chart.houses[0].signIndex : -1;
  const sunSignIndex =
    chart.planets.find((planet) => planet.planet_id === constants.SE_SUN)
      ?.signIndex || -1;
  const moonSignIndex =
    chart.planets.find((planet) => planet.planet_id === constants.SE_MOON)
      ?.signIndex || -1;

  return await transaction(async (client) => {
    const {
      rows: [persistedChart],
    } = await client.query(
      `INSERT INTO charts (owner_id, asc_sign_index, sun_sign_index, moon_sign_index, houses, name, date, metadata, elements)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
               RETURNING *`,
      [
        userId,
        ascSignIndex,
        sunSignIndex,
        moonSignIndex,
        JSON.stringify(chart.houses),
        name,
        referenceDate,
        JSON.stringify(chart.metadata),
        JSON.stringify(chart.elements),
      ]
    );

    const chartId = persistedChart.id;

    const planetRows = chart.planets.map((planet) => [
      chartId,
      planet.planetIndex,
      planet.signIndex,
      planet.longitude,
      JSON.stringify({
        dms: `${planet.degrees}°${planet.minutes}'${planet.seconds}"`,
        degrees: planet.degrees,
        minutes: planet.minutes,
        seconds: planet.seconds,
        renderLongitude: planet.renderLongitude,
        renderMarker: planet.renderMarker,
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
      aspect.planetA,
      aspect.planetB,
      aspect.aspectIndex,
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
