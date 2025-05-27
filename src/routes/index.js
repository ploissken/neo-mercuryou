import { Router } from "express";
import chartRoutes from "./chart/index.js";
import createSignupRoutes from "./sign-up/create.js";
import userRoutes from "./user/index.js";

const router = Router();
router.use("/chart", chartRoutes);
router.use("/sign-up", createSignupRoutes);
router.use("/user", userRoutes);

export default router;
