"use client";

import React from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, ChevronRight } from "lucide-react";

interface ReadinessGaugeProps {
  score: number;
  breakdown: {
    resume: number;
    ats: number;
    technical: number;
    coding: number;
    communication: number;
    interview: number;
  };
}

export default function ReadinessGauge({ score, breakdown }: ReadinessGaugeProps) {
  // Determine score color theme
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (s >= 70) return "text-indigo-400 border-indigo-500/40 bg-indigo-500/10";
    return "text-amber-400 border-amber-500/40 bg-amber-500/10";
  };

  const pillars = [
    { label: "Resume Readiness", val: breakdown.resume, color: "bg-indigo-500" },
    { label: "ATS Optimization", val: breakdown.ats, color: "bg-cyan-500" },
    { label: "Technical & Core CS", val: breakdown.technical, color: "bg-amber-500" },
    { label: "Coding IDE Readiness", val: breakdown.coding, color: "bg-emerald-500" },
    { label: "Communication Fluency", val: breakdown.communication, color: "bg-purple-500" },
    { label: "Mock Interview Score", val: breakdown.interview, color: "bg-violet-500" },
  ];

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Main Gauge Score Display */}
        <div className="flex items-center space-x-6">
          <div className={`relative flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 shadow-2xl ${getScoreColor(score)}`}>
            <span className="text-3xl font-black text-white">{score}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/ 100</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-extrabold text-white">360° Career Readiness Index</h3>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                Top 15% Rank
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400 max-w-md">
              Evaluated dynamically across your resume, ATS match, technical questions, coding IDE execution, speech cadence, and AI mock interviews.
            </p>
            <div className="mt-3 flex items-center space-x-4 text-xs font-semibold">
              <span className="flex items-center text-emerald-400">
                <TrendingUp className="mr-1 h-3.5 w-3.5" /> +6% this week
              </span>
              <span className="text-slate-400">• Target: 82% for Google SDE</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <a
          href="/readiness"
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all shrink-0"
        >
          <span>Download 360° PDF Report</span>
          <ChevronRight className="h-4 w-4" />
        </a>

      </div>

      {/* 6 Pillar Progress Bars */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-t border-slate-800/80 pt-6">
        {pillars.map((p) => (
          <div key={p.label} className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="truncate">{p.label}</span>
              <span className="text-white font-bold">{p.val}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${p.color}`}
                style={{ width: `${p.val}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
