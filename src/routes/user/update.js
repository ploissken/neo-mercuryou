import { Router } from "express";
import { authMiddleware } from "../../utils/auth-middleware.js";
import { updateUser } from "../../db/update-user.js";

const router = Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/update", authMiddleware, async (req, res) => {
  console.log("user/update yeah baby");
  // TODO: add request check with express-validator
  const { fullName, username, genderIdentities, sexualOrientations } = req.body;
  console.log(req.user);
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
