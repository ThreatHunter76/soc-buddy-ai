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

  function severityColor(severity: string) {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-700 text-white";

      case "high":
        return "bg-red-500 text-white";

      case "medium":
        return "bg-yellow-500 text-black";

      case "low":
        return "bg-green-500 text-black";

      default:
        return "bg-slate-600 text-white";
    }
  }

  function statusColor(status: string) {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-red-500 text-white";

      case "in progress":
        return "bg-yellow-500 text-black";

      case "resolved":
        return "bg-green-500 text-black";

      default:
        return "bg-slate-600 text-white";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden">

      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700">

        <h2 className="text-2xl font-bold text-cyan-400">
          Security Incidents
        </h2>

        <span className="text-slate-400">
          {incidents.length} Incident(s)
        </span>

      </div>

      <table className="w-full">

        <thead className="bg-slate-800">

          <tr>

            <th className="p-4 text-left text-slate-300">
              ID
            </th>

            <th className="p-4 text-left text-slate-300">
              Incident
            </th>

            <th className="p-4 text-left text-slate-300">
              Severity
            </th>

            <th className="p-4 text-left text-slate-300">
              Status
            </th>

            <th className="p-4 text-center text-slate-300">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {incidents.map((incident) => (

            <tr
              key={incident.id}
              className="border-b border-slate-800 hover:bg-slate-800 transition duration-200"
            >

              <td className="p-4 font-bold text-cyan-400">
                #{incident.id}
              </td>

              <td className="p-4">

                <div>

                  <p className="font-semibold">
                    {incident.title}
                  </p>

                  <p className="text-sm text-slate-400 truncate max-w-md">
                    {incident.description}
                  </p>

                </div>

              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${severityColor(
                    incident.severity
                  )}`}
                >
                  {incident.severity.toUpperCase()}
                </span>

              </td>

              <td className="p-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor(
                    incident.status
                  )}`}
                >
                  {incident.status.toUpperCase()}
                </span>

              </td>

              <td className="p-4 text-center">

                <Link href={`/incidents/${incident.id}`}>

                  <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-4 py-2 rounded-lg transition">

                    👁 View

                  </button>

                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}