export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

export const badRequest = (message: string, details?: unknown) => new HttpError(400, "bad_request", message, details);
export const unauthorized = (message = "Sign in to continue") => new HttpError(401, "unauthorized", message);
export const forbidden = (message = "You can't do that") => new HttpError(403, "forbidden", message);
export const notFound = (what = "Resource") => new HttpError(404, "not_found", `${what} not found`);
export const conflict = (message: string) => new HttpError(409, "conflict", message);
export const tooMany = (message: string) => new HttpError(429, "rate_limited", message);
export const needsOnboarding = () => new HttpError(403, "onboarding_required", "Finish setting up your profile first");
