import { Router } from "express";
import bcrypt from "bcryptjs";
import { getUser } from "../../db/get-user.js";
import { PG_CONSTRAINT_VIOLATION_CODE } from "../../utils/consts.d.js";
import { generateToken } from "../../utils/jwt.js";

const router = Router();

router.post("/", async (req, res) => {
  // TODO: add request check with express-validator
  const { email, password } = req.body;

  try {
    const user = await getUser({ email });

    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const token = generateToken(user);

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        const { password: _, ...safeUser } = user;

        return res.send({ ok: true, data: { user: safeUser } });
      }
    }

    return res.status(401).send({ ok: false, error: "wrong_credentials" });
  } catch (err) {
    if (err.code === PG_CONSTRAINT_VIOLATION_CODE) {
      console.error(`[ERROR ${err.code}]: ${email} ${err.message}`);
      return res.status(400).send({ ok: false, error: err.constraint });
    } else {
      console.error(`[ERROR ${err.code}]: ${err.message}`);
      return res.status(500).send({ ok: false, error: err.code });
    }
  }
});

export default router;
