import { Router } from "express";
import bcrypt from "bcryptjs";
import { insertUser } from "../../db/insert-user.js";
import { PG_CONSTRAINT_VIOLATION_CODE } from "../../utils/consts.d.js";
import { generateToken } from "../../utils/jwt.js";

const router = Router();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/create", async (req, res) => {
  // TODO: add request check with express-validator
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({ ok: false, error: "missing_data" });
  }
  if (password.length < 8) {
    return res.send({ ok: false, error: "password_too_short" });
  }
  if (!emailRegex.test(email)) {
    return res.send({ ok: false, error: "invalid_email" });
  }

  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await insertUser({ email, passwordHash: hash });
    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    return res.send({ ok: true, data: { user } });
  } catch (err) {
    if (err.code === PG_CONSTRAINT_VIOLATION_CODE) {
      console.error(`[ERROR ${err.code}]: ${email} ${err.message}`);
      return res.send({ ok: false, error: err.constraint });
    } else {
      console.error(`[ERROR ${err.code}]: ${err.message}`);
      return res.send({ ok: false, error: err.code });
    }
  }
});

export default router;
