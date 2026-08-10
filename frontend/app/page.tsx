"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import IncidentTable from "@/components/IncidentTable";
import Analytics from "@/components/Analytics/Analytics";
import ActivityFeed from "@/components/ActivityFeed/ActivityFeed";
import SearchBar from "@/components/SearchBar/SearchBar";
import SeverityFilter from "@/components/SeverityFilter/SeverityFilter";
import StatusFilter from "@/components/StatusFilter/StatusFilter";
import { getIncidents } from "@/services/api";

type Incident = {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
};

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents();
        setIncidents(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesSearch = incident.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesSeverity =
        severity === "All" ||
        incident.severity === severity;

      const matchesStatus =
        status === "All" ||
        incident.status === status;

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [incidents, search, severity, status]);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          SOC Dashboard
        </h1>

        <p className="text-slate-400 mb-8">
          Monitor, investigate and analyze security incidents.
        </p>

        {/* STAT CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Total Incidents"
            value={incidents.length}
          />

          <StatCard
            title="High Severity"
            value={
              incidents.filter(
                (i) => i.severity === "High"
              ).length
            }
          />

          <StatCard
            title="Resolved Cases"
            value={
              incidents.filter(
                (i) => i.status === "Resolved"
              ).length
            }
          />

        </div>

        {/* ANALYTICS + ACTIVITY */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

          <div className="xl:col-span-2">
            <Analytics incidents={incidents} />
          </div>

          <ActivityFeed incidents={incidents} />

        </div>

        {/* SEARCH */}

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        {/* FILTERS */}

        <div className="mt-6">

          <h2 className="font-semibold mb-3">
            Filter by Severity
          </h2>

          <SeverityFilter
            value={severity}
            onChange={setSeverity}
          />

        </div>

        <div className="mt-6 mb-8">

          <h2 className="font-semibold mb-3">
            Filter by Status
          </h2>

          <StatusFilter
            value={status}
            onChange={setStatus}
          />

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex flex-wrap justify-between gap-4 mb-8">

          <Link href="/create-incident">

            <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-lg transition">

              ➕ Create Incident

            </button>

          </Link>

          <Link href="/incidents/1">

            <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-6 py-3 rounded-lg transition">

              🤖 Analyze Incident

            </button>

          </Link>

        </div>

        {/* INCIDENT TABLE */}

        <IncidentTable
          incidents={filteredIncidents}
        />

      </main>
    </>
  );
}