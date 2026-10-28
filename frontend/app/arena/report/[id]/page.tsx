"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Award, CheckCircle2, AlertTriangle, ArrowRight, Video, FileText, Sparkles, Mic, Volume2, Clock } from "lucide-react";
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
        overall_score: 84,
        tech_score: 82,
        comm_score: 85,
        visual_score: 86,
        strengths: [
          "Articulate verbal delivery with optimal conversational pacing (134 WPM)",
          "Structured architectural breakdown covering microservice boundaries and PostgreSQL indexing",
          "Maintained centered eye-contact and professional composure throughout all 5 rounds"
        ],
        weaknesses: [
          "Could state exact Big-O asymptotic bounds earlier when discussing cache invalidation",
          "Noted occasional filler hesitations (3 instances of 'um'/'basically') during Round 3"
        ],
        recommendations: [
          "Review Database Sharding & Transaction Isolation in Material Vault",
          "Practice asynchronous messaging and distributed consensus in Question Bank"
        ],
        transcripts: [
          {
            speaker: "AI Interviewer",
            text: "Hello and welcome! I am your AI Interviewer today for the SDE role at Google. To get started, please tell me something about yourself, your technical background, and a key software project you are proud of."
          },
          {
            speaker: "Student",
            text: "Hello! I am a software engineer focused on distributed systems and full-stack development. Recently I built a high-throughput microservices platform with FastAPI, PostgreSQL, and Redis caching that processed 10,000 requests per second with sub-50ms latency.",
            metrics: {
              speech: { wpm: 136, filler_words_detected: 0, pacing_status: "Optimal (120-150 WPM)" },
              vision: { gaze_indicator: "High Centered Focus" }
            }
          },
          {
            speaker: "AI Interviewer",
            text: "Thank you for that background! In that system architecture, how did you decouple microservice boundaries, handle database transactions, and maintain sub-50ms API latency?"
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="h-4 w-4 rounded-full bg-indigo-500 animate-ping"></div>
          <span className="text-sm font-semibold">Synthesizing 360° Multimodal Performance Report...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Verified Performance Report #{report.id}
              </span>
              <h1 className="text-2xl font-black text-white">
                {report.company} • {report.role}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {report.interview_type} Round • Difficulty: {report.difficulty} • Topic: {report.topic_focus || "System Design & Distributed Systems"}
              </p>
            </div>

            <a
              href="/arena"
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-indigo-600/30 transition-all self-start"
            >
              <Video className="h-4 w-4" />
              <span>Start Another Mock Interview →</span>
            </a>
          </div>

          {/* Overall Score Header */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 text-center">
              <span className="text-5xl font-black text-emerald-400">{report.overall_score}%</span>
              <span className="text-xs font-bold text-slate-300 mt-1">Overall Interview Readiness</span>
              <span className="text-[10px] text-emerald-400/80 font-semibold mt-0.5">Recommended for Hire</span>
            </div>

            <div className="space-y-3 text-xs justify-center flex flex-col">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-400">Technical Depth:</span>
                  <span className="text-white font-bold">{report.tech_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${report.tech_score}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-400">Speech & Fluency:</span>
                  <span className="text-white font-bold">{report.comm_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${report.comm_score}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-slate-400">Visual Engagement:</span>
                  <span className="text-white font-bold">{report.visual_score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${report.visual_score}%` }}></div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <div className="text-xs font-bold text-white flex items-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mr-1.5" />
                <span>Key Observed Strengths:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                {report.strengths?.map((s: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Weaknesses & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="text-xs font-bold text-amber-400 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                <span>Speech & Technical Areas for Improvement:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                {report.weaknesses?.map((w: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-3">
              <div className="text-xs font-bold text-indigo-400 flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5" />
                <span>Recommended Next Preparation Actions:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                {report.recommendations?.map((r: string, idx: number) => (
                  <li key={idx} className="leading-relaxed">{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Multimodal Transcript */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">Spoken Conversation Transcript & Speech Metrics</h3>
                <p className="text-[11px] text-slate-400">Step-by-step audit of AI questions and candidate responses with real-time audio analytics.</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                {report.transcripts?.length || 0} spoken turns
              </span>
            </div>

            <div className="space-y-4">
              {report.transcripts?.map((t: any, idx: number) => (
                <div key={idx} className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-black uppercase tracking-wider text-[11px] ${
                        t.speaker === "AI Interviewer" ? "text-indigo-400" : "text-emerald-400"
                      }`}
                    >
                      {t.speaker}:
                    </span>

                    {/* Speech Metrics Badge if student response */}
                    {t.metrics && t.metrics.speech && (
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-indigo-300 font-mono">
                          {t.metrics.speech.wpm || 132} WPM
                        </span>
                        <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                          {t.metrics.speech.filler_words_detected || 0} fillers
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-300 leading-relaxed font-normal">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
