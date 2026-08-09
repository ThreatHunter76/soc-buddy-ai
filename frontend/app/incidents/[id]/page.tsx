"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getIncident,
  analyzeIncident as analyzeIncidentAPI,
} from "../../../services/api";

type Incident = {
  id: number;
  title: string;
  description: string;
  severity: string;
  status: string;
};

type AnalysisResult = {
  analysis?: string;
  source?: string;
  threat_summary?: string;
  mitre_attack?: string;
  risk_level?: string;
  recommended_action?: string;
};

export default function IncidentDetailsPage() {
  const params = useParams();

  const id = Number(params?.id);

  const [incident, setIncident] = useState<Incident | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncident() {
      try {
        setLoading(true);
        setError("");

        const data = await getIncident(id);

        setIncident(data);
      } catch (err) {
        console.error("Failed to load incident:", err);
        setError("Failed to load incident.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadIncident();
    }
  }, [id]);

  async function handleAnalyzeIncident() {
    try {
      setAnalyzing(true);
      setError("");
      setAnalysis(null);

      const result = await analyzeIncidentAPI(id);

      console.log("AI Analysis Result:", result);

      /*
       * The backend currently returns something like:
       *
       * {
       *   analysis: "...",
       *   source: "..."
       * }
       *
       * So we store the complete object and render
       * its individual properties below.
       */
      setAnalysis(result);
    } catch (err) {
      console.error("AI analysis failed:", err);
      setError("Failed to analyze incident.");
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p>Loading incident...</p>
        </div>
      </main>
    );
  }

  if (error && !incident) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!incident) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <p>Incident not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-3xl font-bold">
            Incident #{incident.id}
          </h1>

          <p className="text-gray-600 mt-1">
            Security incident investigation
          </p>
        </div>

        {/* INCIDENT DETAILS */}
        <div className="border rounded-xl p-6 space-y-5">

          <div>
            <h2 className="text-2xl font-semibold">
              {incident.title}
            </h2>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Description
            </p>

            <p className="mt-1">
              {incident.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="border rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-500">
                Severity
              </p>

              <p className="mt-1 font-medium">
                {incident.severity}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-500">
                Status
              </p>

              <p className="mt-1 font-medium">
                {incident.status}
              </p>
            </div>

          </div>
        </div>

        {/* AI ANALYSIS BUTTON */}
        <div className="border rounded-xl p-6">

          <h2 className="text-xl font-semibold">
            SOC Buddy AI Analysis
          </h2>

          <p className="text-gray-600 mt-1 mb-4">
            Use SOC Buddy AI to analyze this security incident.
          </p>

          <button
            type="button"
            onClick={handleAnalyzeIncident}
            disabled={analyzing}
            className="px-5 py-3 rounded-lg bg-black text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing..." : "🤖 Analyze with AI"}
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="border border-red-300 rounded-xl p-4 text-red-700">
            {error}
          </div>
        )}

        {/* AI ANALYSIS RESULT */}
        {analysis && (
          <div className="border rounded-xl p-6 space-y-6">

            <div>
              <h2 className="text-2xl font-bold">
                AI Analysis
              </h2>

              {analysis.source && (
                <p className="text-sm text-gray-500 mt-1">
                  Source: {analysis.source}
                </p>
              )}
            </div>

            {/* THREAT SUMMARY */}
            {analysis.threat_summary && (
              <div>
                <h3 className="font-semibold text-lg">
                  Threat Summary
                </h3>

                <p className="mt-2 whitespace-pre-wrap">
                  {analysis.threat_summary}
                </p>
              </div>
            )}

            {/* RISK LEVEL */}
            {analysis.risk_level && (
              <div>
                <h3 className="font-semibold text-lg">
                  Risk Level
                </h3>

                <p className="mt-2">
                  {analysis.risk_level}
                </p>
              </div>
            )}

            {/* MITRE ATT&CK */}
            {analysis.mitre_attack && (
              <div>
                <h3 className="font-semibold text-lg">
                  MITRE ATT&CK
                </h3>

                <p className="mt-2 whitespace-pre-wrap">
                  {analysis.mitre_attack}
                </p>
              </div>
            )}

            {/* RECOMMENDED ACTION */}
            {analysis.recommended_action && (
              <div>
                <h3 className="font-semibold text-lg">
                  Recommended Action
                </h3>

                <p className="mt-2 whitespace-pre-wrap">
                  {analysis.recommended_action}
                </p>
              </div>
            )}

            {/* RAW ANALYSIS */}
            {analysis.analysis && (
              <div>
                <h3 className="font-semibold text-lg">
                  Analysis
                </h3>

                <p className="mt-2 whitespace-pre-wrap">
                  {analysis.analysis}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}