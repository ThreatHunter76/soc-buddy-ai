"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Incident = {
  id: number;
  title: string;
  severity: string;
  status: string;
};

type AnalyticsProps = {
  incidents: Incident[];
};

export default function Analytics({
  incidents,
}: AnalyticsProps) {

  const severityData = [
    {
      name: "Critical",
      value: incidents.filter(
        (i) => i.severity.toLowerCase() === "critical"
      ).length,
    },
    {
      name: "High",
      value: incidents.filter(
        (i) => i.severity.toLowerCase() === "high"
      ).length,
    },
    {
      name: "Medium",
      value: incidents.filter(
        (i) => i.severity.toLowerCase() === "medium"
      ).length,
    },
    {
      name: "Low",
      value: incidents.filter(
        (i) => i.severity.toLowerCase() === "low"
      ).length,
    },
  ];

  const statusData = [
    {
      name: "Open",
      value: incidents.filter(
        (i) => i.status.toLowerCase() === "open"
      ).length,
    },
    {
      name: "Resolved",
      value: incidents.filter(
        (i) => i.status.toLowerCase() === "resolved"
      ).length,
    },
  ];

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Incidents by Severity
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <BarChart data={severityData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="value" radius={[8, 8, 0, 0]}>

              {severityData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index]}
                />

              ))}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-xl">

        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Incident Status
        </h2>

        <ResponsiveContainer width="100%" height={300}>

          <PieChart>

            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >

              <Cell fill="#ef4444" />

              <Cell fill="#22c55e" />

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}