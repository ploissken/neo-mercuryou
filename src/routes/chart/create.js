import { Router } from "express";
import { chartCreate } from "../../controllers/chart-create.js";

const router = Router();

router.post("/", chartCreate);

export default router;
