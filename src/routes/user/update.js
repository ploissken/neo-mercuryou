import { Router } from "express";
import { authMiddleware } from "../../utils/auth-middleware.js";
import { updateUser } from "../../db/update-user.js";

const router = Router();
// TODO: put this in the controller
router.post("/", authMiddleware, async (req, res) => {
  // TODO: add request check with express-validator
  const { fullName, username, genderIdentities, sexualOrientations } = req.body;
  const user = await updateUser({
    id: req.user.id,
    fullName,
    username,
    genderIdentities,
    sexualOrientations,
  });

  return res.send({ ok: true, data: user });
});

export default router;
