import { createChart } from "../services/chart-service.js";
import { insertChart } from "../db/save-chart.js";

export const chartSave = async (req, res) => {
  // TODO: add request check with express-validator
  const { location, date, name } = req.body;

  const chart = await createChart({
    chartDate: date,
    location,
  });

  const savedChart = await insertChart({
    userId: req.user.id,
    chart,
    name,
    referenceDate: date,
  });
  res.send(savedChart);
};
