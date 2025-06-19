import { Router } from "express";
import userUpdateRoutes from "./update.js";
import usernameAvailabilityRoutes from "./username-available.js";
import signInRoutes from "./sign-in.js";
import userChartRoutes from "./charts.js";

const router = Router();

router.use("/update", userUpdateRoutes);
router.use("/username-available", usernameAvailabilityRoutes);
router.use("/sign-in", signInRoutes);
router.use("/get-charts", userChartRoutes);

export default router;
