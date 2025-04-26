import { Router } from "express";
import createChartRoutes from "./chart/create.js";

const router = Router();
router.use("/chart", createChartRoutes);

export default router;
