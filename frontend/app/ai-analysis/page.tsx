"use client";

import { useState } from "react";
import { analyzeIncident } from "../../services/api";

export default function AIAnalysisPage() {

  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  async function runAnalysis() {

    setLoading(true);

    try {

      const result = await analyzeIncident(1);

      setAnalysis(result);

    } catch(error){

      console.error(error);

      setAnalysis({
        report:"Analysis failed."
      });

    }

    setLoading(false);

  }



  return (

    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-6xl mx-auto">


        <h1 className="text-4xl font-bold text-cyan-400 mb-8">
          AI Investigation Report
        </h1>



        <button

          onClick={runAnalysis}

          className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-lg font-semibold mb-8"

        >

          {loading ? "Analyzing..." : "Analyze Incident"}

        </button>



        {!analysis && (

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6">

            No analysis yet.

          </div>

        )}



        {analysis && (

          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8">


            <div className="mb-5 text-slate-400">

              Chunks analyzed: {analysis.chunks}

            </div>



            <pre className="whitespace-pre-wrap text-slate-200 leading-8">

              {analysis.report}

            </pre>



          </div>

        )}


      </div>

    </main>

  );

}