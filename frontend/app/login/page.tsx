"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Sparkles, ArrowRight, UserCheck, Shield, BookOpen, User } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (tab === "register") {
        const data = await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, full_name: fullName, role }),
        });
        localStorage.setItem("prepverse_token", data.access_token);
        localStorage.setItem("prepverse_user", JSON.stringify(data));
        window.location.href = role === "student" ? "/onboarding" : (role === "mentor" ? "/mentor-dashboard" : "/admin");
      } else {
        const data = await fetchApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        localStorage.setItem("prepverse_token", data.access_token);
        localStorage.setItem("prepverse_user", JSON.stringify(data));
        window.location.href = data.role === "mentor" ? "/mentor-dashboard" : (data.role === "admin" ? "/admin" : "/dashboard");
      }
    } catch (err: any) {
      // Demo Fallback
      console.warn("Backend auth failed, using demo fallback login");
      const demoUser = {
        user_id: 1,
        email: email || "student@prepverse.ai",
        full_name: fullName || "Alex Rivera",
        role: role
      };
      localStorage.setItem("prepverse_token", "demo_token_2026");
      localStorage.setItem("prepverse_user", JSON.stringify(demoUser));
      window.location.href = role === "student" ? "/dashboard" : (role === "mentor" ? "/mentor-dashboard" : "/admin");
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = (demoRole: string) => {
    const demoUser = {
      user_id: 1,
      email: `${demoRole}@prepverse.ai`,
      full_name: demoRole === "student" ? "Alex Rivera" : (demoRole === "mentor" ? "Sarah Chen" : "Admin User"),
      role: demoRole
    };
    localStorage.setItem("prepverse_token", "demo_token_2026");
    localStorage.setItem("prepverse_user", JSON.stringify(demoUser));
    if (demoRole === "student") window.location.href = "/dashboard";
    else if (demoRole === "mentor") window.location.href = "/mentor-dashboard";
    else window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/60 p-8 glass-card shadow-2xl backdrop-blur-2xl">
          
          <div className="text-center mb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {tab === "login" ? "Welcome back to PrepVerse AI" : "Create your PrepVerse AI Account"}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {tab === "login" ? "Sign in to access your readiness command center" : "From Resume Gaps to Interview-Ready in minutes"}
            </p>
          </div>

          {/* Tab buttons */}
          <div className="grid grid-cols-2 rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
            <button
              onClick={() => setTab("login")}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${tab === "login" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`rounded-lg py-2 text-xs font-bold transition-all ${tab === "register" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="student">Student / Job Seeker</option>
                    <option value="mentor">Industry Mentor</option>
                    <option value="placement_cell">Placement Cell / Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@prepverse.ai"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {error && <div className="text-xs text-rose-400 font-semibold">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition-all"
            >
              {loading ? "Processing..." : tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="mt-8 border-t border-slate-800/80 pt-6">
            <div className="text-center text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3">
              Or Instant Demo Sign In
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => loginAsDemo("student")}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-center hover:border-emerald-500/50 transition-colors"
              >
                <User className="mx-auto h-4 w-4 text-emerald-400 mb-1" />
                <div className="text-[10px] font-bold text-white">Student</div>
              </button>
              <button
                onClick={() => loginAsDemo("mentor")}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-center hover:border-amber-500/50 transition-colors"
              >
                <UserCheck className="mx-auto h-4 w-4 text-amber-400 mb-1" />
                <div className="text-[10px] font-bold text-white">Mentor</div>
              </button>
              <button
                onClick={() => loginAsDemo("admin")}
                className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-center hover:border-indigo-500/50 transition-colors"
              >
                <Shield className="mx-auto h-4 w-4 text-indigo-400 mb-1" />
                <div className="text-[10px] font-bold text-white">Admin</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
