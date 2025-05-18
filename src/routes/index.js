import { Router } from "express";
import createChartRoutes from "./chart/create.js";
import createSignupRoutes from "./sign-up/create.js";
import userUpdateRoutes from "./user/update.js";

const router = Router();
router.use("/chart", createChartRoutes);
router.use("/sign-up", createSignupRoutes);
router.use("/user", userUpdateRoutes);

export default router;
