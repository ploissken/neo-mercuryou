import { Router } from "express";
import userUpdateRoutes from "./update.js";
import usernameAvailabilityRoutes from "./username-available.js";

const router = Router();

// Mount subroutes here
router.use("/update", userUpdateRoutes);
router.use("/username-available", usernameAvailabilityRoutes);

export default router;
