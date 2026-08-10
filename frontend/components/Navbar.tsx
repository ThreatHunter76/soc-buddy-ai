"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("access_token");

    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    router.push("/login");

    router.refresh();
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        <Link
          href="/"
          className="text-2xl font-bold text-cyan-400"
        >
          🛡️ SOC Buddy AI
        </Link>

        <div className="flex items-center gap-6">

          <Link
            href="/"
            className="text-slate-300 hover:text-cyan-400"
          >
            Dashboard
          </Link>

          <Link
            href="/create-incident"
            className="text-slate-300 hover:text-cyan-400"
          >
            Create Incident
          </Link>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>
    </nav>
  );
}