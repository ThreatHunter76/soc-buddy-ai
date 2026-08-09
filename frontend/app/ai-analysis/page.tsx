"use client";

import { useState } from "react";
import { analyzeIncident } from "../../services/api";

export default function AIAnalysisPage() {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);

    try {
      // Analyze Incident ID 1
      const result = await analyzeIncident(1);

      // Display whatever the backend returns
      setAnalysis(JSON.stringify(result, null, 2));
    } catch (error) {
      setAnalysis("Unable to connect to AI service.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        AI Incident Analysis
      </h1>

      <button
        onClick={runAnalysis}
        className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold"
      >
        {loading ? "Analyzing..." : "Analyze Incident"}
      </button>

      <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold mb-4">
          AI Response
        </h2>

        <pre className="whitespace-pre-wrap">
          {analysis || "No analysis yet."}
        </pre>
      </div>
    </main>
  );
}