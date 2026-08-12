"use client";

import { useState } from "react";

export default function UploadLogsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload() {
    if (!file) {
      alert("Please select a log file.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setMessage(`✅ ${data.message}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          📁 Upload Security Logs
        </h1>

        <p className="text-slate-400 mb-8">
          Upload security log files and let SOC Buddy AI analyze them.
        </p>

        <div className="border border-cyan-700 rounded-xl p-10 text-center bg-slate-900">

          <input
            type="file"
            accept=".log,.txt,.csv,.json,.evtx"
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />

          {file && (
            <div className="mt-6">
              <p className="text-green-400">
                Selected:
              </p>

              <p>{file.name}</p>

              <p className="text-sm text-slate-400">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-8 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-3 rounded-lg disabled:opacity-50"
          >
            {uploading
              ? "Uploading..."
              : "🚀 Upload & Analyze"}
          </button>

          {message && (
            <div className="mt-6 text-lg">
              {message}
            </div>
          )}

        </div>

      </div>
    </main>
  );
}