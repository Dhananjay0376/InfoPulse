import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "../lib/http-error.js";
import { findUserById } from "../repositories/users.js";

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing bearer token"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    const user = await findUserById(payload.sub);

    if (!user || !user.isActive) {
      return next(new HttpError(401, "Invalid access token"));
    }

    req.auth = {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(new HttpError(401, "Invalid access token"));
  }
}

export function requireRole(roles: Array<"admin" | "sender" | "viewer">) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new HttpError(401, "Authentication required"));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new HttpError(403, "Insufficient permissions"));
    }

    next();
  };
}
