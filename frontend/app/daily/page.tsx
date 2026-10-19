"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Flame, Award, CheckCircle2, Code, HelpCircle, ArrowRight, Calendar, Zap, Shield, Sparkles } from "lucide-react";

export default function DailyChallengePage() {
  const [streakDays, setStreakDays] = useState(14);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    code: false,
    concept: true,
    hr: false
  });

  // 4-week GitHub / LeetCode style activity heatmap matrix
  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const activityWeeks = [
    [2, 3, 4, 3, 2, 4, 3],
    [3, 4, 2, 4, 3, 3, 4],
    [4, 3, 4, 4, 3, 2, 4],
    [3, 4, 4, 4, 3, 4, 1] // current week
  ];

  const toggleTask = (key: string) => {
    const nextState = !completedTasks[key];
    setCompletedTasks({ ...completedTasks, [key]: nextState });
    if (nextState && Object.values({ ...completedTasks, [key]: true }).every(Boolean)) {
      setStreakDays(prev => prev + 1);
    }
  };

  const getHeatmapColor = (intensity: number) => {
    switch (intensity) {
      case 4: return "bg-amber-400";
      case 3: return "bg-amber-500/80";
      case 2: return "bg-amber-600/50";
      case 1: return "bg-amber-900/40 border border-amber-500/40";
      default: return "bg-slate-900";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Consistency & Gamification</span>
              <h1 className="text-2xl font-black text-white flex items-center">
                <Flame className="h-6 w-6 text-amber-400 mr-2" />
                Daily Preparation Challenge & Streaks
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Maintain your preparation momentum with daily micro-tasks: 1 Coding challenge, 1 Core CS concept, and 1 STAR behavioral prompt.
              </p>
            </div>

            {/* Streak Badge */}
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-5 py-2.5 text-center flex items-center space-x-3 shadow-lg shadow-amber-500/10">
                <Flame className="h-7 w-7 text-amber-400 fill-amber-400 animate-pulse" />
                <div className="text-left">
                  <div className="text-lg font-black text-white">{streakDays} Days</div>
                  <div className="text-[10px] uppercase font-bold text-amber-400">Active Prep Streak</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap Grid (LeetCode / GitHub style) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Daily Consistency Activity Heatmap</h3>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                <span>Less</span>
                <span className="h-3 w-3 rounded bg-slate-900 border border-slate-800 inline-block" />
                <span className="h-3 w-3 rounded bg-amber-600/50 inline-block" />
                <span className="h-3 w-3 rounded bg-amber-500 inline-block" />
                <span className="h-3 w-3 rounded bg-amber-400 inline-block" />
                <span>More</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                {activityWeeks.map((week, wIdx) => (
                  <div key={wIdx} className="space-y-1.5">
                    {week.map((val, dIdx) => (
                      <div
                        key={dIdx}
                        title={`Day ${wIdx * 7 + dIdx + 1}: ${val} tasks completed`}
                        className={`h-4 w-4 rounded-md transition-transform hover:scale-125 ${getHeatmapColor(val)}`}
                      />
                    ))}
                  </div>
                ))}
                <div className="pl-4 text-xs text-slate-400 space-y-1">
                  <div>🔥 <strong>88%</strong> consistency rating this month</div>
                  <div>⚡ <strong>1,850 XP</strong> earned through daily drills</div>
                  <div>🏆 Longest streak: <strong>21 days</strong></div>
                </div>
              </div>

              {/* Milestone Streak Rewards */}
              <div className="flex items-center space-x-3">
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Next Perk</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">7-Day Badge</div>
                  <div className="text-[10px] text-emerald-400">Unlocked ✓</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">15-Day Perk</div>
                  <div className="text-xs font-bold text-white mt-0.5">+100 XP Boost</div>
                  <div className="text-[10px] text-amber-400 font-bold">In 1 Day!</div>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 border border-slate-800 text-center min-w-[90px]">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">30-Day Perk</div>
                  <div className="text-xs font-bold text-slate-300 mt-0.5">Free Mock 1-on-1</div>
                  <div className="text-[10px] text-slate-500">Locked</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's 3 Daily Challenge Cards */}
          <div className="space-y-3">
            <h2 className="text-base font-extrabold text-white flex items-center">
              <Zap className="h-4 w-4 text-amber-400 mr-2" />
              Today's 3 Daily Preparation Challenges:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Challenge 1: Coding */}
              <div className={`rounded-3xl border p-6 space-y-4 glass-card transition-all flex flex-col justify-between ${
                completedTasks.code ? "bg-emerald-950/20 border-emerald-800/40" : "bg-slate-900/60 border-slate-800"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs">
                      <Code className="h-4 w-4" />
                      <span>Coding Challenge (+50 XP)</span>
                    </div>
                    {completedTasks.code && (
                      <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">Reverse Words in a String</h3>
                  <p className="text-xs text-slate-400">Given an input string s, reverse the order of the words with O(1) extra memory in O(n) runtime.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href="/coding/1"
                    className="block text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
                  >
                    Solve in IDE
                  </a>
                  <button
                    onClick={() => toggleTask("code")}
                    className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {completedTasks.code ? "Mark as Incomplete" : "Mark as Solved ✓"}
                  </button>
                </div>
              </div>

              {/* Challenge 2: Technical Concept */}
              <div className={`rounded-3xl border p-6 space-y-4 glass-card transition-all flex flex-col justify-between ${
                completedTasks.concept ? "bg-emerald-950/20 border-emerald-800/40" : "bg-slate-900/60 border-slate-800"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                      <HelpCircle className="h-4 w-4" />
                      <span>Technical Concept (+25 XP)</span>
                    </div>
                    {completedTasks.concept && (
                      <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">DBMS B-Tree vs Hash Indexing</h3>
                  <p className="text-xs text-slate-400">Explain why B+ Tree indexes are preferred over Hash indexes for range queries in PostgreSQL.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href="/questions"
                    className="block text-center rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
                  >
                    Answer Question Key
                  </a>
                  <button
                    onClick={() => toggleTask("concept")}
                    className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {completedTasks.concept ? "Mark as Incomplete" : "Mark as Solved ✓"}
                  </button>
                </div>
              </div>

              {/* Challenge 3: HR Prompt */}
              <div className={`rounded-3xl border p-6 space-y-4 glass-card transition-all flex flex-col justify-between ${
                completedTasks.hr ? "bg-emerald-950/20 border-emerald-800/40" : "bg-slate-900/60 border-slate-800"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                      <Award className="h-4 w-4" />
                      <span>HR STAR Prompt (+25 XP)</span>
                    </div>
                    {completedTasks.hr && (
                      <span className="rounded-md bg-emerald-500/20 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                        Completed ✓
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-white">Difficult Debugging Challenge</h3>
                  <p className="text-xs text-slate-400">Record a 1-minute voice answer using Situation, Task, Action, and Result addressing an unexpected outage.</p>
                </div>

                <div className="space-y-2 pt-2">
                  <a
                    href="/arena"
                    className="block text-center rounded-xl bg-purple-600 py-2.5 text-xs font-bold text-white hover:bg-purple-500 transition-all shadow-md shadow-purple-600/20"
                  >
                    Record Voice in Arena
                  </a>
                  <button
                    onClick={() => toggleTask("hr")}
                    className="w-full text-center text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    {completedTasks.hr ? "Mark as Incomplete" : "Mark as Solved ✓"}
                  </button>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
