import { Router } from "express";
import { chartCreate } from "../../controllers/chart-create.js";

const router = Router();

router.post("/create", chartCreate);

export default router;
