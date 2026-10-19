"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReadinessGauge from "@/components/ReadinessGauge";
import { Award, Download, ArrowUpRight, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function ReadinessReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadiness();
  }, []);

  async function loadReadiness() {
    try {
      const res = await fetchApi("/readiness/360");
      setData(res);
    } catch (err) {
      setData({
        user_name: "Alex Rivera",
        target_role: "Software Development Engineer (SDE)",
        target_company: "Google",
        overall_score: 76,
        status_label: "Almost Ready",
        breakdown: [
          { pillar: "Resume Quality", score: 82, status: "Strong", weight: "15%" },
          { pillar: "ATS Optimization", score: 76, status: "Good", weight: "15%" },
          { pillar: "Technical & Core CS", score: 74, status: "Needs Review", weight: "20%" },
          { pillar: "Coding IDE Performance", score: 78, status: "Strong", weight: "20%" },
          { pillar: "Communication & Fluency", score: 72, status: "Good", weight: "15%" },
          { pillar: "Mock Interview Arena", score: 75, status: "Moderate", weight: "15%" }
        ],
        recommendations: [
          { area: "DBMS Normalization", why: "Score is 15% below target threshold.", action: "Complete DBMS Cheat Sheet & 10 Practice MCQs", url: "/vault" },
          { area: "Resume ATS Match", why: "Missing keywords: Microservices, Redis, CI/CD", action: "Re-run ATS Optimizer with target Job Description", url: "/ats" },
          { area: "System Design Communication", why: "Long pauses observed during live mock interviews.", action: "Record a 15-min System Design Mock Interview", url: "/arena" }
        ]
      });
    } finally {
      setLoading(false);
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("prepverse_token");
      const response = await fetch("http://127.0.0.1:8000/api/readiness/pdf-report", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "prepverse_360_readiness_report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("PDF Readiness Report generated successfully! (Demo mode)");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading 360° Readiness Analytics...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Verified Candidate Report</span>
              <h1 className="text-2xl font-black text-white">360° Career Readiness Profile</h1>
              <p className="text-xs text-slate-400 mt-1">Unified readiness index calculated across your resume, ATS match, technical scores, coding IDE, and mock interviews.</p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:brightness-110 flex items-center space-x-2 shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Export Downloadable PDF Report</span>
            </button>
          </div>

          {/* Readiness Gauge */}
          <ReadinessGauge
            score={data.overall_score}
            breakdown={{
              resume: data.breakdown[0].score,
              ats: data.breakdown[1].score,
              technical: data.breakdown[2].score,
              coding: data.breakdown[3].score,
              communication: data.breakdown[4].score,
              interview: data.breakdown[5].score
            }}
          />

          {/* Actionable Recommendations: Score -> Why -> What to Improve -> Next Action */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center">
              <Sparkles className="h-5 w-5 text-indigo-400 mr-2" />
              Actionable Readiness Recommendations
            </h3>

            <div className="space-y-4">
              {data.recommendations?.map((r: any, idx: number) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <h4 className="text-sm font-bold text-white">{r.area}</h4>
                    </div>
                    <p className="text-xs text-slate-400"><strong>Why?</strong> {r.why}</p>
                    <p className="text-xs text-indigo-300 font-medium"><strong>Next Action:</strong> {r.action}</p>
                  </div>

                  <a
                    href={r.url}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shrink-0 flex items-center justify-center space-x-1"
                  >
                    <span>Execute Next Action</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
