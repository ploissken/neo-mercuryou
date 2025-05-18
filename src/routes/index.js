import { Router } from "express";
import createChartRoutes from "./chart/create.js";
import createSignupRoutes from "./sign-up/create.js";
import userRoutes from "./user/index.js";

const router = Router();
router.use("/chart", createChartRoutes);
router.use("/sign-up", createSignupRoutes);
router.use("/user", userRoutes);

export default router;
