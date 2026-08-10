type Incident = {
  id: number;
  title: string;
  severity: string;
  status: string;
};

type ActivityFeedProps = {
  incidents: Incident[];
};

export default function ActivityFeed({
  incidents,
}: ActivityFeedProps) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-6">

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        🟢 Live Activity
      </h2>

      <div className="space-y-5">

        {incidents.slice(0, 5).map((incident) => (

          <div
            key={incident.id}
            className="border-l-4 border-cyan-500 pl-4 pb-4"
          >

            <p className="font-semibold text-white">
              {incident.title}
            </p>

            <div className="flex gap-2 mt-2 flex-wrap">

              <span className="px-2 py-1 rounded-full bg-slate-800 text-xs">
                {incident.severity}
              </span>

              <span className="px-2 py-1 rounded-full bg-cyan-600 text-xs text-white">
                {incident.status}
              </span>

            </div>

            <p className="text-xs text-slate-500 mt-2">
              Incident #{incident.id}
            </p>

          </div>

        ))}

        {incidents.length === 0 && (
          <p className="text-slate-500">
            No recent activity.
          </p>
        )}

      </div>

    </div>
  );
}