"use client";

import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/v1";

export default function CreateIncidentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [status, setStatus] = useState("Open");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/incidents/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          severity,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create incident");
      }

      await response.json();

      setMessage("✅ Incident created successfully!");

      setTitle("");
      setDescription("");
      setSeverity("Medium");
      setStatus("Open");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create incident.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">
        Create Incident
      </h1>

      <p className="text-gray-600 mb-8">
        Add a new security incident to SOC Buddy AI.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 border rounded-xl p-6"
      >
        <div>
          <label className="block font-medium mb-2">
            Incident Title
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-lg p-3"
            placeholder="Example: Multiple Failed Logins"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            className="w-full border rounded-lg p-3"
            placeholder="Describe the incident..."
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Severity
          </label>

          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Incident"}
        </button>

        {message && (
          <div className="border rounded-lg p-4">
            {message}
          </div>
        )}
      </form>
    </main>
  );
}