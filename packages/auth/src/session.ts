/**
 * @bhavya/auth — Session
 *
 * Token-based session management with expiry.
 */

import { generateToken, sign, verify } from "@bhavya/security/crypto";
import type { User, Session } from "./types.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function createSession(user: User, secret: string): Session {
  const token = generateToken(48);
  const signedToken = sign(token, secret);
  return {
    user,
    token: signedToken,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  };
}

export function isSessionValid(session: Session): boolean {
  return new Date(session.expiresAt) > new Date();
}

export function validateSessionToken(token: string, secret: string): boolean {
  return verify(token, secret);
}
