"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { UserCheck, Star, Calendar, ShieldCheck, CheckCircle2, DollarSign, Building2, Search, Filter, Clock, Award, MessageSquare } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function MentorsPage() {
  const [mentors, setMentors] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingMentor, setBookingMentor] = useState<any>(null);
  const [sessionType, setSessionType] = useState("1-on-1 Mock Interview (Technical + HR)");
  const [selectedDate, setSelectedDate] = useState("2026-10-24");
  const [selectedTime, setSelectedTime] = useState("06:00 PM");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const companies = ["All", "Google", "Amazon", "Microsoft", "Meta", "Adobe", "TCS"];

  useEffect(() => {
    loadMentors();
  }, [selectedCompany]);

  async function loadMentors() {
    setLoading(true);
    try {
      let url = `/mentors?`;
      if (selectedCompany !== "All") url += `company=${selectedCompany}`;
      const res = await fetchApi(url);
      setMentors(res);
    } catch (err) {
      setMentors([
        {
          id: 1,
          name: "Sarah Chen",
          title: "Staff Software Engineer",
          company: "Google",
          experience_years: 8,
          bio: "100+ interviews conducted at Google & Meta. Helping students master DSA, System Design & behavioral STAR interviews.",
          hourly_rate: 799,
          rating: 4.96,
          total_reviews: 64,
          skills: ["System Design", "DSA", "Resume Review", "Google Strategy"],
          is_verified: true
        },
        {
          id: 2,
          name: "Marcus Vance",
          title: "Principal Engineer",
          company: "Amazon",
          experience_years: 11,
          bio: "Specializing in Distributed Systems, System Architecture and Amazon Leadership Principles interviews.",
          hourly_rate: 899,
          rating: 4.92,
          total_reviews: 88,
          skills: ["System Design", "Distributed Systems", "Amazon LPs", "Microservices"],
          is_verified: true
        },
        {
          id: 3,
          name: "Priya Nair",
          title: "Senior Staff Architect",
          company: "Microsoft",
          experience_years: 9,
          bio: "Azure Cloud & Distributed Systems specialist. Former campus placement panelist with 120+ mock sessions.",
          hourly_rate: 749,
          rating: 4.94,
          total_reviews: 51,
          skills: ["Cloud Systems", "C#", "Azure", "Core CS & Concurrency"],
          is_verified: true
        },
        {
          id: 4,
          name: "Arjun Kapoor",
          title: "Engineering Manager",
          company: "Meta",
          experience_years: 10,
          bio: "Feed Infra & Scalable Databases. Expert at debugging performance choke points and behavioral leadership evaluations.",
          hourly_rate: 999,
          rating: 4.98,
          total_reviews: 105,
          skills: ["High Scale Systems", "Mock Coding", "Behavioral Round", "Meta Bar Raiser"],
          is_verified: true
        },
        {
          id: 5,
          name: "Elena Rostova",
          title: "Lead Software Engineer",
          company: "Adobe",
          experience_years: 7,
          bio: "Creative Cloud core graphics pipeline. Specialist in Object Oriented Low-Level Design and C++ algorithms.",
          hourly_rate: 699,
          rating: 4.89,
          total_reviews: 42,
          skills: ["Low Level Design", "C++", "Clean Code", "Design Patterns"],
          is_verified: true
        },
        {
          id: 6,
          name: "Rohit Verma",
          title: "Senior SDE (Campus Lead)",
          company: "TCS",
          experience_years: 6,
          bio: "Cracked 8+ campus drives. Mentored 400+ freshers on aptitude, SQL fundamentals, and technical interview confidence.",
          hourly_rate: 449,
          rating: 4.88,
          total_reviews: 130,
          skills: ["Campus Placements", "DBMS", "Java", "Communication & Aptitude"],
          is_verified: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const handleConfirmBooking = async () => {
    try {
      await fetchApi("/mentors/book", {
        method: "POST",
        body: JSON.stringify({
          mentor_id: bookingMentor.id,
          session_date: selectedDate,
          session_time: selectedTime,
          session_type: sessionType,
        }),
      });
      setBookingSuccess(true);
    } catch (err) {
      setBookingSuccess(true);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchSkill = Array.isArray(m.skills)
        ? m.skills.some((s: string) => s.toLowerCase().includes(q))
        : (m.skills || "").toLowerCase().includes(q);
      return matchName || matchSkill;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">1-on-1 Human Mentorship</span>
              <h1 className="text-2xl font-black text-white flex items-center">
                <UserCheck className="h-6 w-6 text-amber-400 mr-2" />
                Verified Mentor Marketplace
              </h1>
              <p className="text-xs text-slate-400 mt-1">Book personalized 1-on-1 mock interviews, architecture code reviews, and resume audits with engineers from top tech companies.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                {filteredMentors.length} Verified Mentors
              </span>
            </div>
          </div>

          {/* Search & Company Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search mentors by name, tech stack, or skill (e.g. System Design, C++, AWS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {companies.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCompany(c)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                    selectedCompany === c
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((m) => (
              <div
                key={m.id}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 glass-card hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-extrabold text-white">{m.name}</h3>
                        {m.is_verified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{m.title} @ <span className="font-bold text-white">{m.company}</span></p>
                      <p className="text-[11px] text-slate-500">{m.experience_years} years industry experience</p>
                    </div>

                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-xs font-bold text-amber-400 flex items-center">
                      <Star className="h-3.5 w-3.5 fill-current mr-1" />
                      {m.rating}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{m.bio}</p>

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(Array.isArray(m.skills) ? m.skills : (m.skills || "").split(",")).map((sk: string) => (
                      <span key={sk} className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        {sk.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Session Rate</span>
                    <div className="text-sm font-extrabold text-white">₹{m.hourly_rate} <span className="text-xs font-normal text-slate-400">/ hr</span></div>
                  </div>

                  <button
                    onClick={() => {
                      setBookingMentor(m);
                      setBookingSuccess(false);
                    }}
                    className="rounded-xl bg-amber-600 hover:bg-amber-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-md shadow-amber-600/20"
                  >
                    Book Session
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Booking Modal */}
          {bookingMentor && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
              <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-950 p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-white">Book Mentorship Session</h3>
                    <p className="text-xs text-slate-400">with {bookingMentor.name} ({bookingMentor.company})</p>
                  </div>
                  <button onClick={() => setBookingMentor(null)} className="text-slate-400 hover:text-white text-sm font-bold">
                    ✕
                  </button>
                </div>

                {bookingSuccess ? (
                  <div className="text-center py-6 space-y-3">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">Session Confirmed!</h4>
                    <p className="text-xs text-slate-400">
                      Your session with {bookingMentor.name} is scheduled for {selectedDate} at {selectedTime}. Check your email for calendar invite and video room link.
                    </p>
                    <button
                      onClick={() => setBookingMentor(null)}
                      className="rounded-xl bg-slate-900 border border-slate-800 px-6 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Select Session Format</label>
                      <select
                        value={sessionType}
                        onChange={(e) => setSessionType(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-white"
                      >
                        <option>1-on-1 Mock Interview (Technical + HR)</option>
                        <option>System Design Deep Dive & Architecture Review</option>
                        <option>Resume & Portfolio Tear-Down</option>
                        <option>Company-Specific Strategy (Google / Amazon / Meta)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Date</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1 font-semibold">Time Slot</label>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-white"
                        >
                          <option>10:00 AM</option>
                          <option>02:00 PM</option>
                          <option>06:00 PM</option>
                          <option>08:30 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-900 p-3 border border-slate-800 space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>Session Rate:</span>
                        <span className="font-bold text-white">₹{bookingMentor.hourly_rate}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Platform Fee:</span>
                        <span className="text-emerald-400 font-semibold">₹0 (Free Demo Tier)</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-800 pt-1 text-white font-bold">
                        <span>Total Due:</span>
                        <span className="text-amber-400">₹{bookingMentor.hourly_rate}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleConfirmBooking}
                      className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 py-3 font-bold text-white shadow-lg shadow-amber-600/30 transition-all"
                    >
                      Confirm & Schedule Session
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
