import type { ErrorRequestHandler, RequestHandler } from "express";
import type { ApiErrorBody } from "@repo/shared";
import type { AppContext } from "../context";
import { HttpError } from "../lib/errors";

export const notFoundHandler: RequestHandler = (req, res) => {
  const body: ApiErrorBody = { error: { code: "not_found", message: `No route for ${req.method} ${req.path}` } };
  res.status(404).json(body);
};

export function errorHandler(ctx: AppContext): ErrorRequestHandler {
  return (error, req, res, _next) => {
    if (error instanceof HttpError) {
      const body: ApiErrorBody = { error: { code: error.code, message: error.message, details: error.details } };
      return res.status(error.status).json(body);
    }
    // Malformed JSON bodies from express.json()
    if (error?.type === "entity.parse.failed") {
      return res.status(400).json({ error: { code: "bad_request", message: "Invalid JSON body" } } satisfies ApiErrorBody);
    }
    // Prisma unique-constraint race (e.g. double-tap like) → treat as conflict
    if (error?.code === "P2002") {
      return res.status(409).json({ error: { code: "conflict", message: "Already exists" } } satisfies ApiErrorBody);
    }
    ctx.logger.error({ err: error, path: req.path }, "unhandled error");
    const body: ApiErrorBody = { error: { code: "internal", message: "Something went wrong on our side" } };
    res.status(500).json(body);
  };
}
