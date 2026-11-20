"use client";

import { useState } from "react";

type MitreTechnique = {
  technique?: string;
  name?: string;
  reason?: string;
};



type Analysis = {
  executive_summary?: string;

  threat_summary?: string;

  risk_level?: string;

  confidence?: number;


  mitre_attack?: MitreTechnique[];


  indicators?: {
    ips?: string[];
    internal_ips?: string[];
    domains?: string[];
    hashes?: string[];
  };


  evidence?: string[];


  recommended_actions?: string[];


  analyst_notes?: string;
};

export default function UploadLogsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setMessage("");
      setAnalysis(null);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select a log file first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");
      setAnalysis(null);

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.message ||
          "Upload failed"
        );
      }

      setMessage(
        data.message || "Upload and analysis completed."
      );

      if (data.analysis) {
  console.log("Analysis received:", data.analysis);

  if (typeof data.analysis === "string") {
    try {
      setAnalysis(JSON.parse(data.analysis));
    } catch {
      setMessage("AI returned invalid JSON.");
    }
  } else {
    setAnalysis(data.analysis);
  }
}

    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      setMessage(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Upload failed."
      );

    } finally {
      setUploading(false);
    }
  }

  function getRiskStyle(risk: string) {
    switch (risk.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-950 border-red-500 text-red-400";

      case "HIGH":
        return "bg-red-950 border-red-500 text-red-400";

      case "MEDIUM":
        return "bg-yellow-950 border-yellow-500 text-yellow-400";

      case "LOW":
        return "bg-green-950 border-green-500 text-green-400";

      default:
        return "bg-slate-800 border-slate-500 text-slate-300";
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold text-cyan-400">
            📂 Upload Security Logs
          </h1>

          <p className="text-slate-400 mt-2">
            Upload security logs and let SOC Buddy AI investigate
            suspicious activity using local AI.
          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="bg-slate-900 border border-cyan-700 rounded-2xl p-8 shadow-2xl">

          <div className="border-2 border-dashed border-cyan-600 rounded-xl p-10 text-center">

            <div className="text-6xl mb-5">
              📁
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Upload Security Log
            </h2>

            <p className="text-slate-400 mb-6">
              Select a .log, .txt, .csv, or .json security log.
            </p>

            <input
              type="file"
              accept=".log,.txt,.csv,.json,.evtx"
              onChange={handleFileChange}
              className="block mx-auto text-sm text-slate-300
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-cyan-500 file:text-black
                         file:font-semibold
                         hover:file:bg-cyan-400"
            />


            {/* SELECTED FILE */}

            {selectedFile && (

              <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl p-5">

                <p className="text-cyan-400 font-semibold">
                  Selected File
                </p>

                <p className="text-white mt-2 font-medium">
                  {selectedFile.name}
                </p>

                <p className="text-slate-400 text-sm mt-1">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>

              </div>

            )}


            {/* BUTTON */}

            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="mt-7 bg-cyan-500
                         hover:bg-cyan-400
                         disabled:bg-slate-700
                         disabled:text-slate-500
                         disabled:cursor-not-allowed
                         text-black
                         font-bold
                         px-8
                         py-3
                         rounded-lg
                         transition"
            >

              {uploading
                ? "🤖 SOC Buddy AI is Investigating..."
                : "🚀 Upload & Analyze"}

            </button>


            {/* MESSAGE */}

            {message && (

              <div className="mt-6 bg-slate-800 border border-green-500 rounded-xl p-4">

                <p className="text-green-400 font-semibold">
                  {message}
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ANALYSIS REPORT */}

        {analysis && (

          <div className="mt-10 space-y-6">

            {/* REPORT HEADER */}

            <div className="bg-slate-900 border border-cyan-500 rounded-2xl p-7 shadow-xl">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                  <h2 className="text-3xl font-bold text-cyan-400">
                    🤖 SOC Buddy AI Investigation Report
                  </h2>

                  <p className="text-slate-400 mt-2">
                    Local AI-powered security investigation
                  </p>

                </div>

                <div className="text-green-400 font-semibold">
                  ● Analysis Complete
                </div>

              </div>

            </div>


            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


              {/* RISK */}

              <div
                className={`border rounded-2xl p-6 ${getRiskStyle(
                  analysis.risk_level || "UNKNOWN"
                )}`}
              >

                <p className="text-sm uppercase tracking-wider font-semibold">
                  Risk Level
                </p>

                <p className="text-4xl font-black mt-3">
                  {analysis.risk_level || "UNKNOWN"}
                </p>

              </div>


              {/* CONFIDENCE */}

              <div className="bg-yellow-950 border border-yellow-500 rounded-2xl p-6">

                <p className="text-yellow-400 text-sm uppercase tracking-wider font-semibold">
                  Confidence
                </p>

                <p className="text-4xl font-black text-yellow-300 mt-3">
                  {analysis.confidence ?? 0}%
                </p>

              </div>


              {/* AI ENGINE */}

              <div className="bg-cyan-950 border border-cyan-500 rounded-2xl p-6">

                <p className="text-cyan-400 text-sm uppercase tracking-wider font-semibold">
                  AI Engine
                </p>

                <p className="text-2xl font-black text-cyan-300 mt-3">
                  Llama 3.2:3b
                </p>

                <p className="text-xs text-slate-400 mt-2">
                  Local Ollama inference
                </p>

              </div>

            </div>


            {/* THREAT SUMMARY */}

            <div className="bg-slate-900 border border-red-500 rounded-2xl p-7">

              <h3 className="text-2xl font-bold text-red-400 mb-4">
                🚨 Threat Summary
              </h3>

              <p className="text-slate-200 leading-8 whitespace-pre-wrap">
                {analysis.threat_summary ||
                  "No threat summary was returned."}
              </p>

            </div>


            {/* MITRE ATT&CK */}

            <div className="bg-slate-900 border border-purple-500 rounded-2xl p-7">

              <h3 className="text-2xl font-bold text-purple-400 mb-5">
                🎯 MITRE ATT&CK Techniques
              </h3>

              {analysis.mitre_attack &&
              analysis.mitre_attack.length > 0 ? (

                <div className="space-y-4">

                  {analysis.mitre_attack.map(
                    (technique, index) => (

                      <div
                        key={index}
                        className="bg-slate-800 border border-purple-700 rounded-xl p-5"
                      >

                        <div className="flex flex-wrap gap-3 items-center">

                          <span className="bg-purple-600 text-white px-3 py-1 rounded-lg font-bold">
                            {technique.technique || "Unknown"}
                          </span>

                          <span className="text-purple-300 font-semibold">
                            {technique.name || "Unnamed technique"}
                          </span>

                        </div>

                        {technique.reason && (

                          <p className="text-slate-300 mt-3 leading-7">
                            {technique.reason}
                          </p>

                        )}

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p className="text-slate-400">
                  No MITRE ATT&CK techniques were identified.
                </p>

              )}

            </div>
            {/* EVIDENCE */}

            <div className="bg-slate-900 border border-blue-500 rounded-2xl p-7">

              <h3 className="text-2xl font-bold text-blue-400 mb-5">
                📝 Evidence
              </h3>

{analysis.evidence &&
 analysis.evidence.length > 0 ? (

  <ul className="list-disc ml-6 space-y-3">

    {analysis.evidence.map(
      (item: any, index: number) => (

        <li
          key={index}
          className="text-slate-200"
        >

          {typeof item === "string" ? (

            item

          ) : (

            <div className="space-y-1">

              <p>
                <strong>Source IP:</strong> {item.source_ip}
              </p>

              <p>
                <strong>Destination IP:</strong> {item.destination_ip}
              </p>

              <p>
                <strong>Destination Port:</strong> {item.destination_port}
              </p>

              <p>
                <strong>Protocol:</strong> {item.protocol}
              </p>

              <p>
                <strong>Bytes:</strong> {item.bytes}
              </p>

            </div>

          )}

        </li>

      )
    )}

  </ul>

) : (

  <p className="text-slate-400">
    No evidence found.
  </p>

)}

            </div>

            {/* IOCs */}

            <div className="bg-slate-900 border border-orange-500 rounded-2xl p-7">

              <h3 className="text-2xl font-bold text-orange-400 mb-5">
                🔎 Indicators of Compromise
              </h3>

             {analysis.indicators &&
(
  (analysis.indicators.ips?.length ?? 0) > 0 ||
  (analysis.indicators.internal_ips?.length ?? 0) > 0 ||
  (analysis.indicators.domains?.length ?? 0) > 0 ||
  (analysis.indicators.hashes?.length ?? 0) > 0
) ? (

  <div className="space-y-4">


    {analysis.indicators.ips?.map(
      (ip, index) => (

        <div
          key={`ip-${index}`}
          className="bg-slate-800 border border-orange-700 rounded-xl p-5"
        >

          <span className="bg-orange-600 text-white px-3 py-1 rounded-lg font-bold">
            IP Address
          </span>

          <span className="text-orange-300 font-mono ml-3">
            {ip}
          </span>

        </div>

      )
    )}



    {analysis.indicators.internal_ips?.map(
      (ip, index) => (

        <div
          key={`internal-${index}`}
          className="bg-slate-800 border border-orange-700 rounded-xl p-5"
        >

          <span className="bg-orange-600 text-white px-3 py-1 rounded-lg font-bold">
            Internal IP
          </span>

          <span className="text-orange-300 font-mono ml-3">
            {ip}
          </span>

        </div>

      )
    )}



    {analysis.indicators.domains?.map(
      (domain, index) => (

        <div
          key={`domain-${index}`}
          className="bg-slate-800 border border-orange-700 rounded-xl p-5"
        >

          <span className="bg-orange-600 text-white px-3 py-1 rounded-lg font-bold">
            Domain
          </span>

          <span className="text-orange-300 font-mono ml-3">
            {domain}
          </span>

        </div>

      )
    )}



    {analysis.indicators.hashes?.map(
      (hash, index) => (

        <div
          key={`hash-${index}`}
          className="bg-slate-800 border border-orange-700 rounded-xl p-5"
        >

          <span className="bg-orange-600 text-white px-3 py-1 rounded-lg font-bold">
            Hash
          </span>

          <span className="text-orange-300 font-mono ml-3">
            {hash}
          </span>

        </div>

      )
    )}

  </div>

) : (

  <p className="text-slate-400">
    No indicators of compromise were identified.
  </p>

)}

              

            </div>


            {/* RECOMMENDED ACTIONS */}

            <div className="bg-slate-900 border border-green-500 rounded-2xl p-7">

              <h3 className="text-2xl font-bold text-green-400 mb-5">
                🛡️ Recommended SOC Actions
              </h3>

              {analysis.recommended_actions &&
              analysis.recommended_actions.length > 0 ? (

                <ol className="space-y-4">

                  {analysis.recommended_actions.map(
                    (action, index) => (

                      <li
                        key={index}
                        className="bg-slate-800 border border-green-800 rounded-xl p-4 flex gap-4"
                      >

                        <span className="bg-green-600 text-black font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>

                        <span className="text-slate-200 leading-7">
                          {action}
                        </span>

                      </li>

                    )
                  )}

                </ol>

              ) : (

                <p className="text-slate-400">
                  No recommended actions were returned.
                </p>

              )}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}