import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: "admin" | "sender" | "viewer";
}

export function signAccessToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "1d",
    subject: payload.sub,
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
