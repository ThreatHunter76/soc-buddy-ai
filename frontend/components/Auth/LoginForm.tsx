"use client";

import { useState } from "react";
import { login } from "@/services/auth";

type Mode = "login" | "forgot" | "reset";

const API_URL = "http://127.0.0.1:8000/api/v1";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function goToLogin() {
    setMode("login");
    clearMessages();

    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setResetToken("");
  }

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      clearMessages();

      const data = await login(email, password);

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      document.cookie = `access_token=${data.access_token}; path=/`;

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // FORGOT PASSWORD
  // ---------------------------------------------------------

  async function handleForgotPassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      clearMessages();

      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to process password reset."
        );
      }

      /*
       * Development mode:
       * Our backend currently returns the reset token directly.
       *
       * In production this will eventually be replaced
       * with an email containing the reset link.
       */
      if (data.reset_token) {
        setResetToken(data.reset_token);

        setMessage(
          "Reset token generated successfully. Continue below to create a new password."
        );

        setMode("reset");
      } else {
        setMessage(
          data.message ||
            "If the account exists, a password reset request has been processed."
        );
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to process password reset."
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // RESET PASSWORD
  // ---------------------------------------------------------

  async function handleResetPassword(
    e: React.FormEvent
  ) {
    e.preventDefault();

    clearMessages();

    if (!resetToken.trim()) {
      setError("Please enter your reset token.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: resetToken,
            new_password: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Password reset failed."
        );
      }

      setMessage(
        "Password reset successful. You can now log in with your new password."
      );

      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");

      setMode("login");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------

  function Header() {
    return (
      <>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-4">
            <span className="text-3xl">🛡️</span>
          </div>

          <h1 className="text-3xl font-bold text-cyan-400">
            SOC Buddy AI
          </h1>

          <p className="text-center text-slate-400 mt-2">
            AI Powered Security Operations Center
          </p>
        </div>
      </>
    );
  }

  // ---------------------------------------------------------
  // LOGIN VIEW
  // ---------------------------------------------------------

  if (mode === "login") {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

        <Header />

        <form
          onSubmit={handleLogin}
          className="space-y-5 mt-8"
        >

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              placeholder="Enter email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">

              <label className="text-sm text-slate-300">
                Password
              </label>

              <button
                type="button"
                onClick={() => {
                  clearMessages();
                  setMode("forgot");
                }}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                Forgot Password?
              </button>

            </div>

            <input
              type="password"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-700 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="bg-green-950/50 border border-green-700 rounded-lg p-3">
              <p className="text-green-400 text-sm">
                {message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-black font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {loading
              ? "Authenticating..."
              : "🔐 Secure Login"}
          </button>

        </form>

        <div className="mt-8 pt-6 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            SOC Buddy AI • Security Operations Center
          </p>
        </div>

      </div>
    );
  }

  // ---------------------------------------------------------
  // FORGOT PASSWORD VIEW
  // ---------------------------------------------------------

  if (mode === "forgot") {
    return (
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

        <Header />

        <div className="mt-8">

          <h2 className="text-2xl font-bold text-white">
            Forgot Password?
          </h2>

          <p className="text-slate-400 text-sm mt-2">
            Enter your account email and we'll generate
            a secure password reset token.
          </p>

        </div>

        <form
          onSubmit={handleForgotPassword}
          className="space-y-5 mt-6"
        >

          <div>
            <label className="block mb-2 text-sm text-slate-300">
              Email Address
            </label>

            <input
              type="email"
              className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-700 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}

          {message && (
            <div className="bg-green-950/50 border border-green-700 rounded-lg p-3">
              <p className="text-green-400 text-sm">
                {message}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-black font-bold rounded-lg py-3 disabled:opacity-50"
          >
            {loading
              ? "Generating Reset Token..."
              : "🔑 Generate Reset Token"}
          </button>

        </form>

        <button
          type="button"
          onClick={goToLogin}
          className="w-full mt-5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 rounded-lg py-3 transition"
        >
          ← Back to Login
        </button>

      </div>
    );
  }

  // ---------------------------------------------------------
  // RESET PASSWORD VIEW
  // ---------------------------------------------------------

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

      <Header />

      <div className="mt-8">

        <h2 className="text-2xl font-bold text-white">
          Reset Password
        </h2>

        <p className="text-slate-400 text-sm mt-2">
          Enter your reset token and create a new password.
        </p>

      </div>

      <form
        onSubmit={handleResetPassword}
        className="space-y-5 mt-6"
      >

        <div>
          <label className="block mb-2 text-sm text-slate-300">
            Reset Token
          </label>

          <textarea
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400 min-h-[100px]"
            placeholder="Paste your reset token"
            value={resetToken}
            onChange={(e) =>
              setResetToken(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-slate-300">
            New Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
            placeholder="Minimum 8 characters"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-slate-300">
            Confirm New Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3 text-white outline-none focus:border-cyan-400"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
          />
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}

        {message && (
          <div className="bg-green-950/50 border border-green-700 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              {message}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition text-black font-bold rounded-lg py-3 disabled:opacity-50"
        >
          {loading
            ? "Resetting Password..."
            : "🔐 Reset Password"}
        </button>

      </form>

      <button
        type="button"
        onClick={goToLogin}
        className="w-full mt-5 border border-slate-600 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 rounded-lg py-3 transition"
      >
        ← Back to Login
      </button>

    </div>
  );
}