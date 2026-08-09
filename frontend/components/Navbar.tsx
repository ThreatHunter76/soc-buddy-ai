export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-cyan-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          🛡️ SOC Buddy AI
        </h1>

        <div className="flex items-center gap-6 text-gray-300">
          <a href="#" className="hover:text-cyan-400 transition">
            Dashboard
          </a>

          <a href="#" className="hover:text-cyan-400 transition">
            Incidents
          </a>

          <a href="#" className="hover:text-cyan-400 transition">
            AI Analysis
          </a>

          <a href="#" className="hover:text-cyan-400 transition">
            Settings
          </a>
        </div>
      </div>
    </nav>
  );
}