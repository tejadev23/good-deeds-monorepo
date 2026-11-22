import type { Request } from "express";
import { badRequest } from "./errors";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Reads a uuid route param, rejecting junk early so Postgres never sees it. */
export function idParam(req: Request, name = "id"): string {
  const value = req.params[name];
  if (typeof value !== "string" || !UUID.test(value)) throw badRequest(`Invalid ${name}`);
  return value;
}

export function stringParam(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value !== "string" || !value) throw badRequest(`Missing ${name}`);
  return value;
}
