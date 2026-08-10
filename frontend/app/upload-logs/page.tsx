"use client";

import { useState } from "react";

export default function UploadLogsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function handleUpload() {
    if (!selectedFile) {
      alert("Please select a log file first.");
      return;
    }

    alert(
      `Selected file: ${selectedFile.name}\n\nBackend upload will be connected next.`
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          📂 Upload Security Logs
        </h1>

        <p className="text-slate-400 mb-10">
          Upload security log files and let SOC Buddy AI analyze them automatically.
        </p>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-10">

          <div className="border-2 border-dashed border-cyan-500 rounded-xl p-12 text-center">

            <div className="text-6xl mb-4">
              📁
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              Drag & Drop Logs
            </h2>

            <p className="text-slate-400 mb-6">
              or choose a file from your computer
            </p>

            <input
              type="file"
              onChange={handleFileChange}
              className="mb-6"
              accept=".evtx,.log,.txt,.csv,.json"
            />

            {selectedFile && (
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-green-400">
                  ✅ {selectedFile.name}
                </p>

                <p className="text-sm text-slate-400 mt-2">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <button
              onClick={handleUpload}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-3 rounded-lg transition"
            >
              🚀 Upload & Analyze
            </button>

          </div>

          <div className="mt-10">

            <h3 className="text-xl font-bold text-cyan-400 mb-4">
              Supported Formats
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="bg-slate-800 p-4 rounded-lg">
                🪟 Windows Event Logs (.evtx)
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                🖥️ Sysmon Logs
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                🌐 Apache / Nginx Logs
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                📄 CSV Files
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                📜 JSON Logs
              </div>

              <div className="bg-slate-800 p-4 rounded-lg">
                📝 Plain Text Logs
              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}