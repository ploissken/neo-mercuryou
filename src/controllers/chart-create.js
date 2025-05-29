import { createChart } from "../services/chart-service.js";

export const chartCreate = async (req, res) => {
  // TODO: add request check with express-validator
  const { location, date } = req.body;

  const chart = await createChart({
    chartDate: date,
    location,
  });

  res.send(chart);
};
