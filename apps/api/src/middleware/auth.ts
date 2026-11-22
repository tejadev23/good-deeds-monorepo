import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { AppContext } from "../context";
import { forbidden, needsOnboarding, unauthorized } from "../lib/errors";

/**
 * Reads `Authorization: Bearer <firebase id token>`. A valid token attaches the
 * matching user (created on first sign-in). No token → anonymous request.
 * An invalid token is always a 401 so clients know to refresh.
 */
export function authenticate(ctx: AppContext): RequestHandler {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) return next();

    let identity;
    try {
      identity = await ctx.verifier.verify(header.slice("Bearer ".length).trim());
    } catch (error) {
      ctx.logger.debug({ err: error }, "token verification failed");
      return next(unauthorized("Your session has expired, please sign in again"));
    }

    const isAdmin = ctx.env.ADMIN_EMAILS.includes(identity.email);
    const user = await ctx.db.user.upsert({
      where: { firebaseUid: identity.uid },
      update: { email: identity.email },
      create: {
        firebaseUid: identity.uid,
        email: identity.email,
        name: identity.name?.slice(0, 60) || identity.email.split("@")[0]!,
        avatarUrl: identity.picture ?? null,
        role: isAdmin ? "ADMIN" : "USER",
      },
    });

    if (user.status === "SUSPENDED") return next(forbidden("This account has been suspended"));
    req.user = user;
    next();
  };
}

/** Any signed-in user, onboarded or not. */
export const requireAuth: RequestHandler = (req, _res, next) => {
  next(req.user ? undefined : unauthorized());
};

/** Signed-in user who has picked a username. Needed for anything social. */
export const requireMember: RequestHandler = (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  if (!req.user.onboardedAt) return next(needsOnboarding());
  next();
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user) return next(unauthorized());
  next(req.user.role === "ADMIN" ? undefined : forbidden());
};

/** For handlers behind requireAuth/requireMember. */
export function currentUser(req: Request) {
  if (!req.user) throw unauthorized();
  return req.user;
}
