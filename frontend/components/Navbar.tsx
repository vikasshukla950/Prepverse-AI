"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, User, LogOut, ChevronDown, Shield, UserCheck, Building, GraduationCap, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("prepverse_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("prepverse_token");
    localStorage.removeItem("prepverse_user");
    window.location.href = "/login";
  };

  const navigateToRoleAuth = (role: string, tab: "login" | "register" = "login") => {
    setShowRoleMenu(false);
    window.location.href = `/login?role=${role}&tab=${tab}`;
  };

  const roleConfigs = [
    {
      id: "student",
      label: "Student",
      title: "Student / Job Seeker",
      desc: "ATS checker, 360° Readiness, Coding IDE & Mock Arena",
      icon: GraduationCap,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60",
      badge: "Candidate"
    },
    {
      id: "mentor",
      label: "Mentor",
      title: "Industry Mentor",
      desc: "Conduct 1-on-1 mock interviews, set slots & review code",
      icon: UserCheck,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60",
      badge: "Verified Expert"
    },
    {
      id: "placement_cell",
      label: "Placement Cell",
      title: "Placement Cell Officer",
      desc: "Institution batch analytics, talent skill gaps & hiring trends",
      icon: Building,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/60",
      badge: "University"
    },
    {
      id: "admin",
      label: "Administrator",
      title: "System Administrator",
      desc: "Platform governance, system metrics & user administration",
      icon: Shield,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/60",
      badge: "Superuser"
    }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">PREPVERSE <span className="text-indigo-400">AI</span></span>
            <span className="hidden sm:block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Career Operating System</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link href="/vault" className="hover:text-indigo-400 transition-colors">Material Vault</Link>
          <Link href="/questions" className="hover:text-indigo-400 transition-colors">Question Bank</Link>
          <Link href="/coding" className="hover:text-indigo-400 transition-colors">Coding Practice</Link>
          <Link href="/arena" className="hover:text-indigo-400 transition-colors">Interview Arena</Link>
          <Link href="/mentors" className="hover:text-indigo-400 transition-colors">Mentors</Link>
          <Link href="/ats" className="hover:text-indigo-400 transition-colors">ATS Analyzer</Link>
        </nav>

        {/* User Account & Role Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Switch Role Context Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 rounded-xl bg-slate-900 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-indigo-500 shadow-sm transition-all"
            >
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>Role: <strong className="capitalize text-indigo-300">{user?.role?.replace("_", " ") || "Switch Context"}</strong></span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${showRoleMenu ? "rotate-180" : ""}`} />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl z-50 backdrop-blur-2xl space-y-2">
                <div className="px-2 py-1 flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Switch Role Context</span>
                  <span className="text-[10px] text-indigo-400 font-semibold">Select Role to Sign In / Register</span>
                </div>

                <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
                  {roleConfigs.map((rc) => {
                    const IconComponent = rc.icon;
                    return (
                      <div
                        key={rc.id}
                        className={`rounded-xl border p-2.5 transition-all ${rc.bg}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className={`p-1.5 rounded-lg bg-slate-950 border border-slate-800 ${rc.color}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="text-xs font-bold text-white">{rc.title}</span>
                                <span className="text-[9px] font-semibold bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 border border-slate-800">
                                  {rc.badge}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{rc.desc}</p>
                            </div>
                          </div>
                        </div>

                        {/* Dual Action Buttons: Sign In or Register */}
                        <div className="mt-2.5 flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => navigateToRoleAuth(rc.id, "login")}
                            className="flex-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700/80 py-1.5 text-[11px] font-bold text-white transition-all text-center flex items-center justify-center space-x-1"
                          >
                            <span>Sign In</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                          </button>
                          <button
                            onClick={() => navigateToRoleAuth(rc.id, "register")}
                            className="flex-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 hover:border-indigo-500 py-1.5 text-[11px] font-bold text-indigo-200 hover:text-white transition-all text-center"
                          >
                            Register
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                href={user.role === "mentor" ? "/mentor-dashboard" : (user.role === "admin" || user.role === "placement_cell" ? "/admin" : "/dashboard")}
                className="flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:brightness-110 transition-all"
              >
                <User className="h-3.5 w-3.5" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=register"
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
