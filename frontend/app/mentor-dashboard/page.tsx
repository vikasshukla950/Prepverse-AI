"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { UserCheck, Calendar, DollarSign, Clock, Star, CheckCircle2 } from "lucide-react";

export default function MentorDashboardPage() {
  const [rate, setRate] = useState(799);
  const [bio, setBio] = useState("100+ interviews conducted at Google & Meta. Master DSA, System Design & behavioral STAR interviews.");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-8">
        
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Mentor Command Center</span>
            <h1 className="text-2xl font-black text-white flex items-center">
              <UserCheck className="h-6 w-6 text-amber-400 mr-2" />
              Sarah Chen (Google SDE) - Mentor Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manage session availability, upcoming student bookings, and earnings.</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-center">
              <span className="text-xs font-bold text-amber-400">Rating: 4.95 ★ (48 Reviews)</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
            <span className="text-xs text-slate-400 font-semibold">Total Sessions Completed</span>
            <div className="text-3xl font-black text-white mt-1">48</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
            <span className="text-xs text-slate-400 font-semibold">Total Earnings</span>
            <div className="text-3xl font-black text-emerald-400 mt-1">₹38,352</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card">
            <span className="text-xs text-slate-400 font-semibold">Upcoming Bookings</span>
            <div className="text-3xl font-black text-indigo-400 mt-1">3</div>
          </div>
        </div>

        {/* Bookings & Availability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
            <h3 className="text-base font-bold text-white">Upcoming Student Bookings</h3>

            <div className="space-y-3">
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">1-on-1 Mock Interview</span>
                  <h4 className="text-xs font-bold text-white">Student: Alex Rivera</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Aug 28, 2026 at 10:00 AM</p>
                </div>
                <a href="/sessions" className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500">
                  Enter Room
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-4">
            <h3 className="text-base font-bold text-white">Profile & Hourly Rate Settings</h3>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Hourly Session Rate (₹)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(parseInt(e.target.value))}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Public Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white"
              />
            </div>

            <button onClick={() => alert("Profile updated!")} className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-500">
              Save Profile Changes
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
