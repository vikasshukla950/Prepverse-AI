"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Award, CheckCircle2, AlertTriangle, ArrowRight, Video, FileText, Sparkles } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function InterviewReportPage({ params }: { params: { id: string } }) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [params.id]);

  async function loadReport() {
    try {
      const res = await fetchApi(`/interview/report/${params.id}`);
      setReport(res);
    } catch (err) {
      setReport({
        id: 1,
        company: "Google",
        role: "Software Development Engineer (SDE)",
        interview_type: "Technical",
        difficulty: "Medium",
        overall_score: 78,
        tech_score: 76,
        comm_score: 80,
        visual_score: 85,
        strengths: ["Structured STAR response methodology", "Optimal speaking pacing (132 WPM)", "Consistent centered eye-contact indicator"],
        weaknesses: ["Missed explicit mention of edge-case error handling in Q2"],
        recommendations: ["Review Database Sharding & Transactions in Material Vault", "Practice system failure recovery questions in Question Bank"],
        transcripts: [
          { speaker: "AI Interviewer", text: "Welcome to your Google SDE Technical interview. Could you introduce yourself and describe a key technical project?" },
          { speaker: "Student", text: "Hello! I built a scalable E-Commerce Microservices platform using React, FastAPI, and Docker. I implemented JWT auth and connection pooling for PostgreSQL." },
          { speaker: "AI Interviewer", text: "How did you manage connection pooling and async requests in FastAPI under peak load?" }
        ]
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading Performance Report...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Interview Arena Report #{report.id}</span>
              <h1 className="text-2xl font-black text-white">{report.company} - {report.role} Mock Interview</h1>
              <p className="text-xs text-slate-400 mt-1">{report.interview_type} Round • Difficulty: {report.difficulty}</p>
            </div>

            <a href="/arena" className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 shadow-md">
              Start New Mock Interview →
            </a>
          </div>

          {/* Overall Score Header */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
              <span className="text-4xl font-black text-emerald-400">{report.overall_score}%</span>
              <span className="text-xs font-bold text-slate-300 mt-1">Overall Interview Score</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-semibold"><span className="text-slate-400">Technical Depth:</span><span className="text-white font-bold">{report.tech_score}%</span></div>
              <div className="flex justify-between font-semibold"><span className="text-slate-400">Communication & Pacing:</span><span className="text-white font-bold">{report.comm_score}%</span></div>
              <div className="flex justify-between font-semibold"><span className="text-slate-400">Visual Stability:</span><span className="text-white font-bold">{report.visual_score}%</span></div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="text-xs font-bold text-white flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-1.5" />
                <span>Observed Strengths:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                {report.strengths?.map((s: string, idx: number) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Weaknesses & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="text-xs font-bold text-amber-400 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                <span>Areas Needing Attention:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                {report.weaknesses?.map((w: string, idx: number) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="text-xs font-bold text-indigo-400 flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span>Recommended Action Steps:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1 pl-5 list-disc">
                {report.recommendations?.map((r: string, idx: number) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Transcript */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
            <h3 className="text-sm font-bold text-white">Complete Q&A Transcript</h3>
            <div className="space-y-3">
              {report.transcripts?.map((t: any, idx: number) => (
                <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-1 text-xs">
                  <div className={`font-bold ${t.speaker === "AI Interviewer" ? "text-indigo-400" : "text-emerald-400"}`}>
                    {t.speaker}:
                  </div>
                  <p className="text-slate-300 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
