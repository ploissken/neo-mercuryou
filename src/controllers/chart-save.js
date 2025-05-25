import { createChart } from "../services/chart-service.js";
import { insertChart } from "../db/save-chart.js";

export const chartSave = async (req, res) => {
  // TODO: add request check with express-validator
  const { location, referenceDate, name } = req.body;

  const chart = await createChart({
    referenceDate,
    ...location,
  });

  const savedChart = await insertChart({
    userId: req.user.id,
    chart,
    name,
    referenceDate,
    metadata: {
      location,
      locationName: location.displayName,
    },
  });
  res.send(savedChart);
};
