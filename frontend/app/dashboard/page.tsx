"use client";

import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import IncidentTable from "@/components/IncidentTable";
import ActivityFeed from "@/components/ActivityFeed/ActivityFeed";
import Analytics from "@/components/Analytics/Analytics";
import Link from "next/link";


const incidents = [
  {
    id: 1,
    title: "Failed Login Attempt",
    description:
      "Multiple failed authentication attempts detected from suspicious IP.",
    severity: "High",
    status: "Open",
    created_at: "2026-11-19",
  },
  {
    id: 2,
    title: "PowerShell Execution",
    description:
      "PowerShell activity detected requiring investigation.",
    severity: "Medium",
    status: "Open",
    created_at: "2026-11-19",
  },
];


export default function DashboardPage() {

  return (

    <main className="min-h-screen bg-slate-950 text-white">

      <Navbar />


      <div className="max-w-7xl mx-auto p-8">


        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-4xl font-bold text-cyan-400">
              SOC Buddy AI Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Security Operations Center Overview
            </p>

          </div>


          <Link
            href="/upload-logs"
            className="bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-cyan-600"
          >
            🚀 Upload Logs
          </Link>


        </div>



        <div className="grid md:grid-cols-3 gap-6 mb-8">


          <StatCard
            title="Total Incidents"
            value={incidents.length}
          />


          <StatCard
            title="High Severity"
            value={
              incidents.filter(
                (i) =>
                  i.severity === "High"
              ).length
            }
          />


          <StatCard
            title="Open Incidents"
            value={
              incidents.filter(
                (i) =>
                  i.status === "Open"
              ).length
            }
          />


        </div>



        <Analytics incidents={incidents} />



        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          <ActivityFeed incidents={incidents} />

        </div>



        <IncidentTable incidents={incidents} />


      </div>


    </main>

  );
}