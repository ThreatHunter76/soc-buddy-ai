"use client";

import { useState } from "react";

export default function UploadLogsPage() {

  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [analysis, setAnalysis] = useState<any>(null);


  async function handleUpload() {

    if (!file) {
      alert("Please select a log file.");
      return;
    }


    try {

      setUploading(true);

      setMessage("");

      setAnalysis(null);


      const formData = new FormData();

      formData.append(
        "file",
        file
      );


      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/upload/",
        {
          method: "POST",
          body: formData,
        }
      );


      const data = await response.json();


      console.log(
        "SOC BUDDY RESPONSE:",
        data
      );


      if (!response.ok) {

        throw new Error(
          data.detail || "Upload failed"
        );

      }


      setMessage(
        data.message
      );


      if (data.analysis) {

        setAnalysis(
          data.analysis
        );

      }
      else {

        setMessage(
          "Upload completed but no AI analysis was returned."
        );

      }


    }

    catch(error) {

      console.error(
        error
      );


      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed"
      );

    }


    finally {

      setUploading(false);

    }

  }



  return (

    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-5xl mx-auto">


        <h1 className="text-4xl font-bold text-cyan-400 mb-3">

          🤖 SOC Buddy AI Log Investigation

        </h1>


        <p className="text-slate-400 mb-8">

          Upload security logs and receive AI-powered SOC analysis.

        </p>



        <div className="bg-slate-900 border border-cyan-700 rounded-xl p-8">


          <input

            type="file"

            accept=".log,.txt,.csv,.json"

            onChange={
              (e)=>
              setFile(
                e.target.files?.[0] || null
              )
            }

            className="mb-5"

          />



          {file && (

            <div className="bg-slate-800 p-4 rounded-lg">

              <p className="text-cyan-400 font-bold">

                Selected File

              </p>


              <p>

                {file.name}

              </p>


              <p className="text-sm text-gray-400">

                {(file.size / 1024).toFixed(2)} KB

              </p>


            </div>

          )}




          <button

            onClick={handleUpload}

            disabled={uploading}

            className="mt-6 bg-cyan-500 text-black font-bold px-8 py-3 rounded-lg"

          >

            {

              uploading

              ?

              "🤖 SOC Buddy AI Investigating..."

              :

              "🚀 Upload & Analyze"

            }


          </button>




          {message && (

            <div className="mt-6 bg-green-900 border border-green-500 p-4 rounded-xl">

              {message}

            </div>

          )}






          {analysis && (

            <div className="mt-10 space-y-6">



              <h2 className="text-3xl font-bold text-cyan-400">

                Investigation Report

              </h2>





              <section className="bg-slate-800 p-6 rounded-xl">

                <h3 className="text-xl text-cyan-400 font-bold">

                  Executive Summary

                </h3>


                <p className="mt-3">

                  {analysis.executive_summary}

                </p>


              </section>






              <section className="bg-slate-800 p-6 rounded-xl">


                <h3 className="text-xl text-red-400 font-bold">

                  Threat Summary

                </h3>


                <p className="mt-3">

                  {analysis.threat_summary}

                </p>


              </section>







              <div className="grid md:grid-cols-3 gap-5">


                <div className="bg-slate-800 p-5 rounded-xl">

                  <h3 className="text-yellow-400">

                    Risk Level

                  </h3>


                  <p className="text-3xl font-bold">

                    {analysis.risk_level}

                  </p>


                </div>




                <div className="bg-slate-800 p-5 rounded-xl">

                  <h3 className="text-cyan-400">

                    Confidence

                  </h3>


                  <p className="text-3xl font-bold">

                    {analysis.confidence}%

                  </p>


                </div>





                <div className="bg-slate-800 p-5 rounded-xl">

                  <h3 className="text-green-400">

                    Chunks

                  </h3>


                  <p className="text-3xl font-bold">

                    {analysis.chunks_analyzed}

                  </p>


                </div>


              </div>








              <section className="bg-slate-800 p-6 rounded-xl">

                <h3 className="text-purple-400 text-xl font-bold">

                  MITRE ATT&CK

                </h3>


                <pre className="mt-3 whitespace-pre-wrap">

                  {JSON.stringify(
                    analysis.mitre_attack,
                    null,
                    2
                  )}

                </pre>


              </section>







              <section className="bg-slate-800 p-6 rounded-xl">


                <h3 className="text-orange-400 text-xl font-bold">

                  Indicators of Compromise

                </h3>


                <pre className="mt-3 whitespace-pre-wrap">

                  {JSON.stringify(
                    analysis.iocs,
                    null,
                    2
                  )}

                </pre>


              </section>







              <section className="bg-slate-800 p-6 rounded-xl">


                <h3 className="text-blue-400 text-xl font-bold">

                  Evidence

                </h3>


                <pre className="mt-3 whitespace-pre-wrap">

                  {JSON.stringify(
                    analysis.evidence,
                    null,
                    2
                  )}

                </pre>


              </section>






              <section className="bg-slate-800 p-6 rounded-xl">


                <h3 className="text-green-400 text-xl font-bold">

                  Recommended Actions

                </h3>


                <pre className="mt-3 whitespace-pre-wrap">

                  {JSON.stringify(
                    analysis.recommended_actions,
                    null,
                    2
                  )}

                </pre>


              </section>







              <section className="bg-slate-800 p-6 rounded-xl">


                <h3 className="text-gray-300 text-xl font-bold">

                  Analyst Notes

                </h3>


                <p className="mt-3">

                  {analysis.analyst_notes}

                </p>


              </section>





            </div>

          )}



        </div>


      </div>


    </main>

  );

}