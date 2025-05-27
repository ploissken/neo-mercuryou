import { verifyToken } from "./jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token || token === "undefined") {
    return res.status(401).send({ ok: false, error: "unauthorized" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Failed decoding auth token!", err);
    next();
    return res.status(403).send({ ok: false, error: "invalid_token" });
  }
};
