import { createChart } from "../services/chart-service.js";

export const chartCreate = async (req, res) => {
  // TODO: add request check with express-validator
  const { latitude, longitude, referenceDate } = req.body;

  const chart = await createChart({
    referenceDate,
    latitude,
    longitude,
  });

  res.send(chart);
};
