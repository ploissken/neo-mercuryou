import { Router } from "express";
import { chartSave } from "../../controllers/chart-save.js";
import { authMiddleware } from "../../utils/auth-middleware.js";

const router = Router();

router.post("/", authMiddleware, chartSave);

export default router;
