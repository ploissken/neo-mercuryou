import { Router } from "express";
import { userCharts } from "../../controllers/user/get-charts.js";
import { authMiddleware } from "../../utils/auth-middleware.js";

const router = Router();

router.get("/", authMiddleware, userCharts);

export default router;
