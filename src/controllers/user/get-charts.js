import { getCharts } from "../../db/get-charts.js";

export const userCharts = async (req, res) => {
  const charts = await getCharts({
    userId: req.user.id,
  });

  res.send(charts);
};
