import { createChart } from "../services/chart-service.js";

export const chartCreate = (req, res) => {
  // TODO: add request check with express-validator
  const { latitude, longitude, referenceDate } = req.body;

  const chart = createChart({
    date: new Date(referenceDate),
    latitude,
    longitude,
  });

  res.send(chart);
};
