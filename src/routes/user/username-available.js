import { Router } from "express";
import { authMiddleware } from "../../utils/auth-middleware.js";
import { getByUsername } from "../../db/get-username.js";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  // TODO: add request check with express-validator
  const { username } = req.query;
  const userExists = await getByUsername({ username });

  return res.send({ ok: true, data: { available: !userExists?.id } });
});

export default router;
