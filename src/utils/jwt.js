import { sign, verify } from "jsonwebtoken-esm";

export function generateToken(payload) {
  return sign(payload, process.env.JWT_SECRET, { expiresIn: "60d" });
}

export function verifyToken(token) {
  return verify(token, process.env.JWT_SECRET);
}
