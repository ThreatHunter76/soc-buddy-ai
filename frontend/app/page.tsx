"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import IncidentTable from "@/components/IncidentTable";
import { getIncidents } from "@/services/api";
import Link from "next/link";

export default function Home() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    async function loadIncidents() {
      const data = await getIncidents();
      setIncidents(data);
    }

    loadIncidents();
  }, []);

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          SOC Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Incidents"
            value={incidents.length}
          />

          <StatCard
            title="High Severity"
            value={
              incidents.filter(
                (i: any) => i.severity === "High"
              ).length
            }
          />

          <StatCard
            title="Resolved Cases"
            value={
              incidents.filter(
                (i: any) => i.status === "Resolved"
              ).length
            }
          />
        </div>

        <div className="flex justify-end mb-6">

          <Link href="/incidents/1">

            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3 rounded-lg transition">
              🤖 Analyze Incident with AI
            </button>

          </Link>

        </div>

        <IncidentTable incidents={incidents} />

      </main>
    </>
  );
}