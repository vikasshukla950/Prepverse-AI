"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ReadinessGauge from "@/components/ReadinessGauge";
import { 
  Sparkles, Flame, Target, Play, CheckCircle2, AlertTriangle, 
  ChevronRight, Calendar, Bot, Award, ArrowUpRight, BookOpen, Code, Video
} from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetchApi("/student/dashboard-data");
        setData(res);
      } catch (err) {
        console.warn("Using fallback dashboard data");
        setData({
          user_name: "Alex Rivera",
          target_role: "Software Development Engineer (SDE)",
          target_company: "Google",
          streak: 7,
          xp: 1250,
          overall_readiness: 76,
          scores: {
            resume: 82,
            ats: 76,
            technical: 74,
            coding: 78,
            communication: 72,
            interview: 75
          },
          today_tasks: [
            { id: 1, category: "Coding IDE", title: "Solve 2 Array Problems (Two Sum & LRU Cache)", description: "Focus on hash map lookups & double linked list pointers.", action_url: "/coding", is_completed: false },
            { id: 2, category: "DBMS", title: "Revise DBMS Indexing & Joins", description: "Review B-Tree indexes & Inner vs Left Outer joins.", action_url: "/vault", is_completed: false },
            { id: 3, category: "HR Practice", title: "Practice 5 STAR HR Questions", description: "Structure answers for leadership & conflict resolution.", action_url: "/questions", is_completed: true },
            { id: 4, category: "Interview Arena", title: "Complete 10-Minute AI Technical Mock", description: "Assess speech pacing & technical articulation.", action_url: "/arena", is_completed: false }
          ],
          weak_areas: [
            { topic: "DBMS & SQL Normalization", score: 48, status: "Needs Attention", action_url: "/vault" },
            { topic: "Communication & Fluency", score: 56, status: "Moderate", action_url: "/arena" },
            { topic: "Data Structures (Graphs)", score: 62, status: "Moderate", action_url: "/coding" }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="flex items-center space-x-3 text-indigo-400 font-bold">
          <Sparkles className="h-6 w-6 animate-spin" />
          <span>Loading Career Command Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl font-black text-white">Good morning, {data.user_name} 👋</h1>
              <p className="text-xs text-slate-400 mt-1">
                Targeting <strong className="text-indigo-400">{data.target_role}</strong> at <strong className="text-white">{data.target_company}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400">
                <Flame className="h-4 w-4" />
                <span>{data.streak} Day Prep Streak!</span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-300">
                <Award className="h-4 w-4" />
                <span>{data.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Central 360° Readiness Gauge */}
          <ReadinessGauge score={data.overall_readiness} breakdown={data.scores} />

          {/* Grid Layout: Today's AI Tasks & Weak Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Today's AI Preparation Tasks (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h2 className="text-lg font-extrabold text-white">Today's AI Recommended Tasks</h2>
                </div>
                <a href="/roadmap" className="text-xs font-bold text-indigo-400 hover:underline">View 14-Day Roadmap →</a>
              </div>

              <div className="space-y-3">
                {data.today_tasks.map((task: any) => (
                  <div key={task.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between gap-4 glass-card-hover">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${task.is_completed ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{task.category}</span>
                        <h4 className={`text-sm font-bold ${task.is_completed ? "line-through text-slate-500" : "text-white"}`}>{task.title}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                      </div>
                    </div>

                    <a
                      href={task.action_url}
                      className={`rounded-xl px-4 py-2 text-xs font-bold shrink-0 transition-all ${
                        task.is_completed
                          ? "bg-slate-800 text-slate-400"
                          : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                      }`}
                    >
                      {task.is_completed ? "Completed" : "Start Task"}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Weak Area Heatmap & Improve This Action Buttons (1 Column) */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-extrabold text-white">Weak Area Heatmap</h2>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
                {data.weak_areas.map((w: any) => (
                  <div key={w.topic} className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{w.topic}</span>
                      <span className="text-amber-400">{w.score}% Score</span>
                    </div>

                    <div className="mt-2 h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-500"
                        style={{ width: `${w.score}%` }}
                      ></div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{w.status}</span>
                      <a
                        href={w.action_url}
                        className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 hover:bg-amber-500/20 transition-all flex items-center"
                      >
                        <span>Improve this</span>
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming Live Sessions */}
              <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/30 to-slate-950 p-5">
                <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                  <Calendar className="h-4 w-4" />
                  <span>Upcoming Mentor Mock Session</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">1-on-1 SDE Mock with Sarah Chen (Google)</h4>
                <p className="text-xs text-slate-400 mt-1">Tomorrow at 10:00 AM • 45 Minutes</p>
                <a href="/sessions" className="mt-3 block text-center rounded-xl bg-slate-900 border border-slate-700 py-2 text-xs font-bold text-indigo-300 hover:bg-slate-800">
                  Enter Session Room
                </a>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
