"use client";

import { useState } from "react";

/**
 * Change-password form for the authenticated user.
 * Posts current + new password to PUT /api/auth/password, which verifies
 * the current password server-side before rotating the hash.
 */
export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Password change failed");
      } else {
        setMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch {
      setError("Password change failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#0d1410] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="current-password"
          className="block text-xs font-medium text-[#8a7359] mb-1.5"
        >
          Current password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-medium text-[#8a7359] mb-1.5"
        >
          New password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
          placeholder="8+ characters"
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
      {message && (
        <p className="text-xs text-green-400 bg-green-400/10 px-3 py-2 rounded-lg">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-[#c9a227] text-[#0a0f0d] text-sm font-semibold hover:bg-[#c9a227]/90 transition-colors disabled:opacity-30"
      >
        {loading ? "Changing…" : "Change password"}
      </button>
    </form>
  );
}
