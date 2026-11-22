export class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: "INVALID_CREDENTIALS" | "NOT_FOUND" | "STORAGE_FULL" | "VALIDATION" | "FORBIDDEN",
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
