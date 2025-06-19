import { getAspects } from "../utils/aspects.helper.js";
import { query } from "./pool.js";

export async function getCharts({ userId }) {
  const { rows } = await query(
    `SELECT *
       FROM charts
       WHERE owner_id = $1`,
    [userId]
  );

  const { rows: planets } = await query(
    `SELECT *
       FROM planets
       WHERE owner_id = $1`,
    [userId]
  );

  const charts = rows.map((chart) => {
    const chartPlanets = planets
      .filter((planet) => planet.chart_id === chart.id)
      .map((planet) => {
        return {
          ...planet,
          planet_id: planet.planet_index,
          planetIndex: planet.planet_index,
          signIndex: planet.sign_index,
          ...planet.metadata,
        };
      });
    return {
      ...chart,
      asc: chart.houses?.[0],
      aspects: getAspects(chartPlanets),
      planets: chartPlanets,
      ascSign: chart.asc_sign_index,
      sunSign: chart.sun_sign_index,
      moonSign: chart.moon_sign_index,
    };
  });

  return charts;
}
