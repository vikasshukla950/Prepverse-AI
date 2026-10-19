"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, User, LogOut, ChevronDown, Shield, UserCheck, BookOpen } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("prepverse_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("prepverse_token");
    localStorage.removeItem("prepverse_user");
    window.location.href = "/login";
  };

  const switchRole = (role: string) => {
    const demoUser = {
      user_id: 1,
      full_name: role === "student" ? "Alex Rivera" : (role === "mentor" ? "Sarah Chen (Mentor)" : "Admin User"),
      email: `${role}@prepverse.ai`,
      role: role
    };
    localStorage.setItem("prepverse_token", "demo_jwt_token_2026");
    localStorage.setItem("prepverse_user", JSON.stringify(demoUser));
    setUser(demoUser);
    setShowRoleMenu(false);
    
    if (role === "admin" || role === "placement_cell") window.location.href = "/admin";
    else if (role === "mentor") window.location.href = "/mentor-dashboard";
    else window.location.href = "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
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

        {/* User Account & Quick Role Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Quick Switch Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-700/60 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-indigo-500 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              <span>Role: <strong className="capitalize text-indigo-300">{user?.role || "Demo Switch"}</strong></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Role Context</div>
                <button
                  onClick={() => switchRole("student")}
                  className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300"
                >
                  <User className="h-4 w-4 text-emerald-400" />
                  <span>Login as Student</span>
                </button>
                <button
                  onClick={() => switchRole("mentor")}
                  className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300"
                >
                  <UserCheck className="h-4 w-4 text-amber-400" />
                  <span>Login as Mentor</span>
                </button>
                <button
                  onClick={() => switchRole("admin")}
                  className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300"
                >
                  <Shield className="h-4 w-4 text-indigo-400" />
                  <span>Login as Admin</span>
                </button>
                <button
                  onClick={() => switchRole("placement_cell")}
                  className="flex w-full items-center space-x-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-300"
                >
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>Login as Placement Cell</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
              >
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
                className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
