import { cert, getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import type { Env } from "../config/env";

export interface VerifiedIdentity {
  uid: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}

/** Verifies a bearer token. Swappable so tests don't need Firebase. */
export interface TokenVerifier {
  verify(token: string): Promise<VerifiedIdentity>;
}

/**
 * Firebase Admin verifier. With FIREBASE_AUTH_EMULATOR_HOST set, the Admin SDK
 * talks to the local Auth emulator automatically and accepts its tokens.
 */
export function createFirebaseVerifier(env: Env): TokenVerifier {
  // Emulator: no credential needed. Cloud Run: Application Default Credentials. Elsewhere: service account.
  const credential = env.FIREBASE_SERVICE_ACCOUNT_BASE64
    ? cert(JSON.parse(Buffer.from(env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf8")))
    : env.FIREBASE_AUTH_EMULATOR_HOST
      ? null
      : applicationDefault();
  const app =
    getApps()[0] ?? initializeApp({ projectId: env.FIREBASE_PROJECT_ID, ...(credential ? { credential } : {}) });
  const auth = getAuth(app);

  return {
    async verify(token) {
      const decoded = await auth.verifyIdToken(token, true);
      if (!decoded.email) throw new Error("Token has no email");
      return {
        uid: decoded.uid,
        email: decoded.email.toLowerCase(),
        emailVerified: decoded.email_verified ?? false,
        name: decoded.name as string | undefined,
        picture: decoded.picture,
      };
    },
  };
}
