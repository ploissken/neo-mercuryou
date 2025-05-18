import { verifyToken } from "./jwt.js";

export const authMiddleware = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  console.log("le token", token);
  if (!token) {
    console.log("no token!");
    // return res.status(401).send({ ok: false, error: "unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    console.log("le decoded user", decoded);
    next();
  } catch (err) {
    console.log("woopsi failed decoding!", err);
    next();
    // return res.status(403).send({ ok: false, error: "invalid_token" });
  }
};
