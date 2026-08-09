import Link from "next/link";

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
  created_at: string;
}

interface IncidentTableProps {
  incidents: Incident[];
}

export default function IncidentTable({
  incidents,
}: IncidentTableProps) {
  return (
    <div className="bg-slate-900 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Incidents</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400">
            <th className="p-3">ID</th>
            <th className="p-3">Title</th>
            <th className="p-3">Severity</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>

        <tbody>
          {incidents.map((incident) => (
            <tr
              key={incident.id}
              className="border-b border-slate-800 hover:bg-slate-800 transition"
            >
              <td className="p-3">
                <Link
                  href={`/incidents/${incident.id}`}
                  className="text-blue-400 hover:underline"
                >
                  {incident.id}
                </Link>
              </td>

              <td className="p-3">{incident.title}</td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    incident.severity.toLowerCase() === "high"
                      ? "bg-red-600"
                      : incident.severity.toLowerCase() === "medium"
                      ? "bg-yellow-600"
                      : "bg-green-600"
                  }`}
                >
                  {incident.severity}
                </span>
              </td>

              <td className="p-3">{incident.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}