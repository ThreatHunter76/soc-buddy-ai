type StatCardProps = {
  title: string;
  value: number | string;
};

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-cyan-500/20">

      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-cyan-500/10 blur-2xl"></div>

      <p className="text-sm uppercase tracking-widest text-slate-400 font-semibold">
        {title}
      </p>

      <h2 className="mt-4 text-5xl font-extrabold text-cyan-400">
        {value}
      </h2>

      <div className="mt-5 h-1 w-full rounded-full bg-slate-700">
        <div className="h-1 w-2/3 rounded-full bg-cyan-400"></div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Live dashboard metric
      </p>
    </div>
  );
}