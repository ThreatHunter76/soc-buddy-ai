"use client";

import { useState } from "react";
import { login } from "@/services/auth";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await login(email, password);

      // Save token in BOTH localStorage and cookie
      localStorage.setItem(
        "access_token",
        data.access_token
      );

      document.cookie = `access_token=${data.access_token}; path=/`;

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">

      <h1 className="text-3xl font-bold text-center text-cyan-400">
        SOC Buddy AI
      </h1>

      <p className="text-center text-slate-400 mt-2 mb-8">
        AI Powered Security Operations Center
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div>
          <label className="block mb-2 text-sm">
            Email Address
          </label>

          <input
            type="email"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">
            Password
          </label>

          <input
            type="password"
            className="w-full rounded-lg border border-slate-600 bg-slate-800 p-3"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg py-3"
        >
          {loading
            ? "Authenticating..."
            : "🔐 Login"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-8">
        SOC Buddy AI v1.0.0
      </p>

    </div>
  );
}