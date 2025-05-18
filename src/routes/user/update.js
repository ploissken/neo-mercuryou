import { Router } from "express";
import bcrypt from "bcryptjs";
import { insertUser } from "../../db/insert-user.js";
import { PG_CONSTRAINT_VIOLATION_CODE } from "../../utils/consts.d.js";
import { generateToken } from "../../utils/jwt.js";
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

  //   try {
  //     const user = await insertUser({ email, hash });
  //     const token = generateToken(user);

  //     res.cookie("token", token, {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "Lax",
  //       path: "/",
  //     });

  //     return res.send({ ok: true, data: { user } });
  //   } catch (err) {
  //     if (err.code === PG_CONSTRAINT_VIOLATION_CODE) {
  //       console.error(`[ERROR ${err.code}]: ${email} ${err.message}`);
  //       return res.send({ ok: false, error: err.constraint });
  //     } else {
  //       console.error(`[ERROR ${err.code}]: ${err.message}`);
  //       return res.send({ ok: false, error: err.code });
  //     }
  //   }
});

export default router;
