import type { z } from "zod";
import { badRequest } from "./errors";

/** Parses input with a zod schema, turning failures into a 400 with field details. */
export function parse<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
    throw badRequest(details[0]?.message ?? "Invalid input", details);
  }
  return result.data;
}
