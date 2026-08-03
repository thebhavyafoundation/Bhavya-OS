/**
 * @bhavya/security — Cryptography
 *
 * Password hashing, token generation, and hashing utilities.
 */

import { randomBytes, createHash } from "crypto";

/**
 * Generate a cryptographically secure random token.
 */
export function generateToken(length = 32): string {
  return randomBytes(length).toString("hex");
}

/**
 * Generate a short numeric OTP.
 */
export function generateOtp(length = 6): string {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

/**
 * Hash a string using SHA-256.
 */
export function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Hash a string using SHA-512.
 */
export function sha512(input: string): string {
  return createHash("sha512").update(input).digest("hex");
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Simple HMAC-like signature (for non-security-critical use).
 */
export function sign(data: string, secret: string): string {
  return sha256(`${secret}:${data}`);
}

/**
 * Verify a signature.
 */
export function verify(
  data: string,
  signature: string,
  secret: string,
): boolean {
  return timingSafeEqual(sign(data, secret), signature);
}
