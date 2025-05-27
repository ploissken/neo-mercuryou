import { Router } from "express";
import userUpdateRoutes from "./update.js";
import usernameAvailabilityRoutes from "./username-available.js";
import signInRoutes from "./sign-in.js";

const router = Router();

router.use("/update", userUpdateRoutes);
router.use("/username-available", usernameAvailabilityRoutes);
router.use("/sign-in", signInRoutes);

export default router;
