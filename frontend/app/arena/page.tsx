"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Video, Sparkles, Play, Clock, Building2, BookOpen, Mic, Cpu, Volume2, Radio, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function InterviewArenaSetupPage() {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Development Engineer (SDE)");
  const [topicFocus, setTopicFocus] = useState("System Design & Distributed Systems");
  const [interviewType, setInterviewType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState(30);
  const [voiceModelEnabled, setVoiceModelEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const companiesList = [
    { name: "Google", desc: "Focuses on algorithmic elegance, distributed consistency, and Googleyness." },
    { name: "Amazon", desc: "Heavy emphasis on Leadership Principles (STAR method) and AWS microservices." },
    { name: "Microsoft", desc: "Core CS, database isolation levels, cloud scalability, and concurrency." },
    { name: "Meta", desc: "Fast-paced live coding, newsfeed/caching design, and architectural trade-offs." },
    { name: "Adobe", desc: "Low-level design, C++ performance, OOP design patterns, and graphics pipelines." },
    { name: "TCS / Service Majors", desc: "Core Java, DBMS normalization, SQL joins, and behavioral communication." }
  ];

  const topicsList = [
    "Comprehensive Full-Stack (DSA + System Design + HR)",
    "Data Structures & Algorithms Deep-Dive",
    "System Design & Distributed Systems",
    "DBMS, SQL & Index Optimization",
    "Operating Systems, Concurrency & Threads",
    "Computer Networks (TCP/IP & Web Architecture)",
    "HR & Behavioral Leadership (STAR Method)"
  ];

  const handleStart = async () => {
    setLoading(true);
    const openingQuestion = `Hello and welcome! I am your AI Interviewer today for the ${role} role at ${company}. To get started, please tell me something about yourself, your technical background, and a key software project you are proud of.`;

    try {
      const res = await fetchApi("/interview/setup", {
        method: "POST",
        body: JSON.stringify({
          company,
          role,
          interview_type: `${interviewType} (${topicFocus})`,
          difficulty,
          duration_minutes: duration,
        }),
      });
      sessionStorage.setItem("prepverse_active_interview", JSON.stringify({
        ...res,
        company,
        role,
        topicFocus,
        voiceModelEnabled,
        first_question: res.first_question || openingQuestion,
        current_round: 1,
        total_rounds: 5,
        round_title: "Candidate Introduction & Background"
      }));
      window.location.href = "/arena/room";
    } catch (err) {
      sessionStorage.setItem("prepverse_active_interview", JSON.stringify({
        interview_id: 1,
        company,
        role,
        topicFocus,
        difficulty,
        voiceModelEnabled,
        current_round: 1,
        total_rounds: 5,
        round_title: "Candidate Introduction & Background",
        first_question: openingQuestion
      }));
      window.location.href = "/arena/room";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-8 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Multimodal Simulation Suite</span>
            <h1 className="text-2xl font-black text-white flex items-center">
              <Video className="h-6 w-6 text-purple-400 mr-2" />
              AI Mock Interview Arena - One-to-One Talking Setup
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Live two-way conversational interview powered by real-time speech detection, an AI voice model, adaptive follow-up questions, speech pacing (WPM), and filler word analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Setup Form */}
            <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-6">
              
              {/* Company Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center">
                  <Building2 className="h-4 w-4 mr-1 text-indigo-400" />
                  1. Select Target Company
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {companiesList.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setCompany(c.name)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        company === c.name
                          ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="text-xs font-black">{c.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Focus Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1 text-emerald-400" />
                  2. Select Topic Focus
                </label>
                <select
                  value={topicFocus}
                  onChange={(e) => setTopicFocus(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {topicsList.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Role, Difficulty & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option>Software Development Engineer (SDE)</option>
                    <option>Frontend Engineer</option>
                    <option>Backend Engineer</option>
                    <option>Full-Stack Engineer</option>
                    <option>DevOps / Cloud Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Round Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option>Easy (Foundations)</option>
                    <option>Medium (Standard Industry)</option>
                    <option>Hard (Bar Raiser)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option value={15}>15 Minutes (Sprint)</option>
                    <option value={30}>30 Minutes (Standard)</option>
                    <option value={45}>45 Minutes (Full Loop)</option>
                  </select>
                </div>
              </div>

              {/* Voice Model & Speech Settings Banner */}
              <div className="rounded-2xl bg-indigo-950/30 border border-indigo-800/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="h-8 w-8 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">AI Spoken Voice & Speech Recognition</div>
                      <div className="text-[10px] text-slate-400">Two-way natural conversation (AI speaks questions, user talks back)</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setVoiceModelEnabled(!voiceModelEnabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                      voiceModelEnabled
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                        : "bg-slate-900 border-slate-800 text-slate-400"
                    }`}
                  >
                    {voiceModelEnabled ? "Enabled" : "Muted"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1 border-t border-indigo-900/40">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Opening: &quot;Tell me about yourself&quot;</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Real-time WPM & filler word analysis</span>
                  </div>
                </div>
              </div>

              {/* Launch CTA */}
              <button
                onClick={handleStart}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-indigo-600/30 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{loading ? "Preparing Voice Model..." : `Enter ${company} Live Voice Arena →`}</span>
              </button>

            </div>

            {/* Right Card: Feature Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                  What the AI Evaluates in Real-Time:
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                    <div className="font-bold text-indigo-400 flex items-center">
                      <Radio className="h-3.5 w-3.5 mr-1.5" /> 5-Round Progressive Interview
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Begins with background and project introduction, moving adaptively into system architecture, concurrency, behavioral leadership (STAR), and retrospectives.
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                    <div className="font-bold text-emerald-400 flex items-center">
                      <Mic className="h-3.5 w-3.5 mr-1.5" /> Speech Cadence & Filler Words
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      Live WPM tracker (target: 120-150 WPM) and real-time detection of filler hesitations like &quot;um&quot;, &quot;like&quot;, &quot;basically&quot;.
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
                    <div className="font-bold text-purple-400 flex items-center">
                      <Volume2 className="h-3.5 w-3.5 mr-1.5" /> Natural Spoken AI Interviewer
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      The AI speaks each question aloud with visual soundwaves and listens for your natural spoken answer.
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 text-center">
                  All transcript data feeds directly into your verified 360° Readiness score report.
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
