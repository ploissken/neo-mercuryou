import { createChart } from "../services/chart-service.js";
import { getAspects } from "../utils/aspects.helper.js";
import { insertChart } from "../db/save-chart.js";

export const chartSave = async (req, res) => {
  // TODO: add request check with express-validator
  const { location, date, name } = req.body;

  const chart = await createChart({
    chartDate: date,
    location,
  });

  const { persistedPlanets, persistedChart } = await insertChart({
    userId: req.user.id,
    chart,
    name,
    referenceDate: date,
  });

  const mappedPlanets = persistedPlanets.map((planet) => {
    return {
      ...planet,
      planet_id: planet.planet_index,
      planetIndex: planet.planet_index,
      signIndex: planet.sign_index,
      ...planet.metadata,
    };
  });

  res.send({
    ...persistedChart,
    asc: chart.houses?.[0],
    aspects: getAspects(mappedPlanets),
    planets: mappedPlanets,
    ascSign: persistedChart.asc_sign_index,
    sunSign: persistedChart.sun_sign_index,
    moonSign: persistedChart.moon_sign_index,
  });
};
