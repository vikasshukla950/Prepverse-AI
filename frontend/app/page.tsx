"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { 
  Sparkles, ArrowRight, CheckCircle2, Shield, Bot, FileText, Code, 
  Video, UserCheck, Award, Zap, Building2, ChevronRight, Play, Star
} from "lucide-react";

export default function LandingPage() {
  const companies = [
    "Google", "Microsoft", "Amazon", "Adobe", "Apple", "Meta", 
    "TCS", "Infosys", "Wipro", "Accenture", "Deloitte", "Cognizant"
  ];

  const features = [
    {
      icon: FileText,
      title: "AI Resume & ATS Analyzer",
      description: "Extract skills, compare against target job descriptions, calculate ATS match, and discover missing keywords instantly."
    },
    {
      icon: Sparkles,
      title: "Resume ➔ Interview Engine",
      description: "Automatically generates contextual technical & architecture questions directly from your resume projects."
    },
    {
      icon: Code,
      title: "Coding IDE & Solution Explanation",
      description: "Solve DSA problems in browser IDE, then explain your solution to AI like sitting in a real technical interview."
    },
    {
      icon: Video,
      title: "Multimodal AI Interview Arena",
      description: "Live webcam & speech interview simulation evaluating technical depth, pacing (WPM), filler words, and eye contact indicators."
    },
    {
      icon: Bot,
      title: "AI Personal Career Coach",
      description: "24/7 intelligent coach analyzing your exact practice history to answer 'What should I study today?'"
    },
    {
      icon: UserCheck,
      title: "Expert Mentor Marketplace",
      description: "Book paid 1-on-1 mock interviews and strategy sessions with verified engineers from Google, Amazon, and Microsoft."
    }
  ];

  const steps = [
    { num: "01", title: "Upload Resume", desc: "Parse skills, projects, and calculate baseline ATS readiness score." },
    { num: "02", title: "Discover Skill Gaps", desc: "Pinpoint weak topics across DBMS, System Design, Coding, and HR." },
    { num: "03", title: "Get Adaptive Roadmap", desc: "Receive a personalized 14-day step-by-step interview preparation plan." },
    { num: "04", title: "Enter Interview Arena", desc: "Practice live AI & human mock interviews with audio/video indicators." },
    { num: "05", title: "360° Readiness Score", desc: "Track overall readiness score and export verified PDF readiness report." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>PrepVerse AI 2.0 • One Platform for Complete Interview Prep</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            From Resume Gaps to <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Interview-Ready.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base sm:text-xl text-slate-300 leading-relaxed font-medium">
            PrepVerse AI brings resume analysis, ATS optimization, personalized roadmaps, coding practice, live AI mock interviews, expert mentorship, and 360° readiness analytics into one intelligent platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login?tab=register"
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-indigo-600/40 hover:brightness-110 transition-all flex items-center justify-center space-x-2"
            >
              <span>Start Preparing Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/arena"
              className="w-full sm:w-auto rounded-2xl bg-slate-900 border border-slate-700/80 px-8 py-4 text-sm font-extrabold text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4 text-indigo-400" />
              <span>Explore Interview Arena</span>
            </Link>
          </div>

          {/* Interactive Dashboard Preview Mock */}
          <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl backdrop-blur-2xl">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950 p-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-mono text-slate-400 ml-2">prepverse.ai/dashboard</span>
                </div>
                <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                  <Award className="h-3.5 w-3.5 mr-1" />
                  <span>360° Readiness: 76 / 100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400">RESUME & ATS</div>
                  <div className="text-2xl font-black text-white mt-1">82% Match</div>
                  <div className="mt-2 text-[11px] text-slate-400">Target Role: SDE at Google</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400">CODING IDE</div>
                  <div className="text-2xl font-black text-indigo-400 mt-1">78% Passed</div>
                  <div className="mt-2 text-[11px] text-slate-400">Explanation Score: High</div>
                </div>
                <div className="rounded-xl bg-slate-900 p-4 border border-slate-800">
                  <div className="text-xs font-bold text-slate-400">AI MOCK ARENA</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">75% Overall</div>
                  <div className="mt-2 text-[11px] text-slate-400">Speaking Pacing: 132 WPM</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Platform Stats */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-white">10,000+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Practice Questions</div>
          </div>
          <div>
            <div className="text-3xl font-black text-indigo-400">500+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Coding Problems</div>
          </div>
          <div>
            <div className="text-3xl font-black text-violet-400">100+</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Company Tracks</div>
          </div>
          <div>
            <div className="text-3xl font-black text-cyan-400">AI Mock</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Live Arena</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">4.9★</div>
            <div className="text-xs font-semibold text-slate-400 mt-1">Expert Mentors</div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">How PrepVerse AI Works</h2>
            <p className="mt-3 text-slate-400 text-sm">Seven seamless steps to go from resume gaps to interview-ready.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s) => (
              <div key={s.num} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 relative">
                <span className="text-3xl font-black text-indigo-500/30">{s.num}</span>
                <h3 className="mt-2 text-sm font-bold text-white">{s.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Complete Feature Suite</h2>
            <p className="mt-3 text-slate-400 text-sm">Everything you need to crack SDE, Data, and Core Tech interviews.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div key={idx} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card-hover">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-5">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Company Tracks */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6">Target top global technology companies</h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {companies.map((c) => (
              <span key={c} className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-bold text-slate-300">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Transparent Plans</h2>
            <p className="mt-3 text-slate-400 text-sm">Start for free, upgrade when you are ready for intensive preparation.</p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white">Free Starter</h3>
              <div className="mt-4 text-3xl font-black text-white">$0 <span className="text-xs font-medium text-slate-400">/ forever</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-300 flex-1">
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Basic Resume Parsing</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> 10 Coding Problems</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> 1 AI Mock Interview / month</li>
              </ul>
              <Link href="/login?tab=register" className="mt-8 rounded-xl bg-slate-800 py-3 text-center text-xs font-bold text-white hover:bg-slate-700">
                Get Started Free
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-3xl border-2 border-indigo-500 bg-slate-900 p-8 flex flex-col relative shadow-2xl shadow-indigo-500/20">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                Most Popular
              </span>
              <h3 className="text-xl font-bold text-white">Pro Preparing</h3>
              <div className="mt-4 text-3xl font-black text-white">$19 <span className="text-xs font-medium text-slate-400">/ month</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-300 flex-1">
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Unlimited Resume & ATS Analysis</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Full 500+ Coding IDE & Solutions</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Unlimited AI Multimodal Interviews</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> 360° Readiness PDF Reports</li>
              </ul>
              <Link href="/login?tab=register" className="mt-8 rounded-xl bg-indigo-600 py-3 text-center text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30">
                Start 7-Day Trial
              </Link>
            </div>

            {/* Mentor Session */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 flex flex-col">
              <h3 className="text-xl font-bold text-white">1-on-1 Mentor Pass</h3>
              <div className="mt-4 text-3xl font-black text-white">$29 <span className="text-xs font-medium text-slate-400">/ 45-min session</span></div>
              <ul className="mt-6 space-y-3 text-xs text-slate-300 flex-1">
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Human Mock Interview by Google/Amazon Engineer</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Detailed Verbal Feedback & Rating</li>
                <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> Updates 360° Readiness Profile</li>
              </ul>
              <Link href="/mentors" className="mt-8 rounded-xl bg-slate-800 py-3 text-center text-xs font-bold text-white hover:bg-slate-700">
                Book a Mentor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>© 2026 PrepVerse AI. From Resume Gaps to Interview-Ready. All rights reserved.</p>
      </footer>
    </div>
  );
}
