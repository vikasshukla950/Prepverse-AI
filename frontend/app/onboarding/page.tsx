"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, ArrowRight, CheckCircle2, FileText, Target, BookOpen } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("Alex Rivera");
  const [college, setCollege] = useState("IIT Delhi / Tech University");
  const [degree, setDegree] = useState("B.Tech Computer Science");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [gradYear, setGradYear] = useState("2025");
  const [skills, setSkills] = useState<string[]>(["Python", "Java", "React", "SQL", "Data Structures"]);
  const [targetRole, setTargetRole] = useState("Software Development Engineer (SDE)");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [prepTime, setPrepTime] = useState("2 hours / day");
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => {
    setSkills(skills.filter((sk) => sk !== s));
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetchApi("/student/onboarding", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          college,
          degree,
          branch,
          grad_year: parseInt(gradYear),
          skills,
          target_role: targetRole,
          target_company: targetCompany,
          prep_time: prepTime,
        }),
      });
      window.location.href = "/dashboard";
    } catch (err) {
      console.warn("Onboarding API fallback redirect");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/60 p-8 glass-card shadow-2xl backdrop-blur-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Step {step} of 3</span>
              <h2 className="text-2xl font-extrabold text-white">Student Career Profile Onboarding</h2>
            </div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-2 w-8 rounded-full ${s <= step ? "bg-indigo-600" : "bg-slate-800"}`} />
              ))}
            </div>
          </div>

          {/* STEP 1: Academic Background */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300">1. Tell us about your Academic Background</h3>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Graduation Year</label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  >
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center justify-center space-x-2"
              >
                <span>Next: Technical Skills & Goals</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Skills & Target Role */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300">2. Target Role & Tech Stack</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  >
                    <option>Software Development Engineer (SDE)</option>
                    <option>Frontend Engineer</option>
                    <option>Backend Engineer</option>
                    <option>Full Stack Developer</option>
                    <option>Data Scientist / Analyst</option>
                    <option>DevOps Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target Company</label>
                  <select
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white"
                  >
                    <option>Google</option>
                    <option>Microsoft</option>
                    <option>Amazon</option>
                    <option>Adobe</option>
                    <option>Meta</option>
                    <option>TCS / Service Majors</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Add Programming Languages & Skills</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Docker, FastApi, System Design"
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs text-white"
                  />
                  <button
                    onClick={addSkill}
                    type="button"
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span key={s} className="flex items-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1 text-xs text-indigo-300">
                      {s}
                      <button onClick={() => removeSkill(s)} className="ml-2 text-indigo-400 hover:text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-xl bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-500 flex items-center justify-center space-x-2"
                >
                  <span>Next: Initial Readiness Baseline</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Initial Career Readiness Profile Generation */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Generating Baseline 360° Readiness Profile</h3>
                <p className="mt-1 text-xs text-slate-400">
                  PrepVerse AI has processed your profile for <strong className="text-indigo-400">{targetRole} at {targetCompany}</strong>.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 text-left space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-400">Initial Readiness Score:</span><span className="font-bold text-emerald-400">71 / 100</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Resume & ATS Baseline:</span><span className="font-bold text-indigo-400">75%</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Target Preparation Plan:</span><span className="font-bold text-white">14-Day Adaptive Roadmap Created</span></div>
              </div>

              <button
                onClick={handleFinish}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 py-3.5 text-xs font-extrabold text-white shadow-xl hover:brightness-110 transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Initializing..." : "Enter Command Center Dashboard"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
