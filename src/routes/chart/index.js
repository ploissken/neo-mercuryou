import { Router } from "express";
import createChartRoutes from "./create.js";
import saveChartRoutes from "./save.js";

const router = Router();

router.use("/create", createChartRoutes);
router.use("/save", saveChartRoutes);

export default router;
