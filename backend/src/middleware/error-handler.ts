import type { NextFunction, Request, Response } from "express";
import type { DatabaseError } from "pg";

import { HttpError } from "../lib/http-error.js";

function isDatabaseError(error: unknown): error is DatabaseError {
  return typeof error === "object" && error !== null && "code" in error;
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  if (isDatabaseError(error) && error.code === "23505") {
    return res.status(409).json({
      message: "A record with the same unique value already exists",
      details: error.detail,
    });
  }

  console.error(error);

  return res.status(500).json({
    message: "Internal server error",
  });
}
