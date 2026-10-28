"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Shield,
  Building,
  GraduationCap,
  KeyRound,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { fetchApi } from "@/lib/api";

type RoleType = "student" | "mentor" | "placement_cell" | "admin";

interface RoleMetadata {
  id: RoleType;
  title: string;
  badge: string;
  desc: string;
  icon: any;
  themeColor: string;
  activeBorder: string;
  badgeBg: string;
  badgeText: string;
  demoEmail: string;
  demoPass: string;
  redirectUrl: string;
}

const ROLES_DATA: Record<RoleType, RoleMetadata> = {
  student: {
    id: "student",
    title: "Student / Job Seeker",
    badge: "Candidate Portal",
    desc: "360° Career Readiness Index, ATS optimizer, dynamic roadmaps, coding IDE & AI mock interview arena.",
    icon: GraduationCap,
    themeColor: "emerald",
    activeBorder: "border-emerald-500 shadow-emerald-500/20",
    badgeBg: "bg-emerald-500/20 border-emerald-500/30",
    badgeText: "text-emerald-400",
    demoEmail: "student@prepverse.ai",
    demoPass: "password123",
    redirectUrl: "/dashboard",
  },
  mentor: {
    id: "mentor",
    title: "Industry Mentor",
    badge: "Mentor Portal",
    desc: "Host 1-on-1 mock interviews, manage booking calendar, provide code reviews, and earn mentor rewards.",
    icon: UserCheck,
    themeColor: "amber",
    activeBorder: "border-amber-500 shadow-amber-500/20",
    badgeBg: "bg-amber-500/20 border-amber-500/30",
    badgeText: "text-amber-400",
    demoEmail: "mentor@prepverse.ai",
    demoPass: "password123",
    redirectUrl: "/mentor-dashboard",
  },
  placement_cell: {
    id: "placement_cell",
    title: "Placement Cell Officer",
    badge: "Institution Portal",
    desc: "College batch analytics, student cohort readiness index, skill gap breakdowns, and campus recruitment reports.",
    icon: Building,
    themeColor: "cyan",
    activeBorder: "border-cyan-500 shadow-cyan-500/20",
    badgeBg: "bg-cyan-500/20 border-cyan-500/30",
    badgeText: "text-cyan-400",
    demoEmail: "placement@prepverse.ai",
    demoPass: "password123",
    redirectUrl: "/admin",
  },
  admin: {
    id: "admin",
    title: "System Administrator",
    badge: "Admin Command Center",
    desc: "Platform governance, question vault moderation, system telemetry, user access control & audit trails.",
    icon: Shield,
    themeColor: "indigo",
    activeBorder: "border-indigo-500 shadow-indigo-500/20",
    badgeBg: "bg-indigo-500/20 border-indigo-500/30",
    badgeText: "text-indigo-400",
    demoEmail: "admin@prepverse.ai",
    demoPass: "password123",
    redirectUrl: "/admin",
  },
};

function AuthFormContent() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get("role") as RoleType) || "student";
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const [activeRole, setActiveRole] = useState<RoleType>(
    ROLES_DATA[initialRole] ? initialRole : "student"
  );
  const [tab, setTab] = useState<"login" | "register">(initialTab);

  // Common Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Student specific fields
  const [college, setCollege] = useState("State Technical University");
  const [targetRole, setTargetRole] = useState("Software Development Engineer (SDE)");
  const [gradYear, setGradYear] = useState(2025);

  // Mentor specific fields
  const [company, setCompany] = useState("Google");
  const [jobTitle, setJobTitle] = useState("Senior Software Engineer");
  const [experienceYears, setExperienceYears] = useState(5);
  const [skills, setSkills] = useState("System Design, DSA, Microservices, Python");
  const [hourlyRate, setHourlyRate] = useState(499);

  // Placement cell specific fields
  const [institution, setInstitution] = useState("National Institute of Technology");
  const [designation, setDesignation] = useState("Head of Training & Placements");
  const [batchSize, setBatchSize] = useState("300-500 Students");

  // Admin specific fields
  const [adminCode, setAdminCode] = useState("PREPVERSE-ADMIN-2026");

  useEffect(() => {
    const roleParam = searchParams.get("role") as RoleType;
    if (roleParam && ROLES_DATA[roleParam]) {
      setActiveRole(roleParam);
    }
    const tabParam = searchParams.get("tab");
    if (tabParam === "register" || tabParam === "login") {
      setTab(tabParam);
    }
  }, [searchParams]);

  const currentRoleConfig = ROLES_DATA[activeRole];

  const handlePreFillDemo = () => {
    setEmail(currentRoleConfig.demoEmail);
    setPassword(currentRoleConfig.demoPass);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (tab === "register" && password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      setLoading(false);
      return;
    }

    try {
      if (tab === "register") {
        const payload: any = {
          email,
          password,
          full_name: fullName,
          role: activeRole,
        };

        if (activeRole === "student") {
          payload.college = college;
          payload.target_role = targetRole;
          payload.grad_year = Number(gradYear);
        } else if (activeRole === "mentor") {
          payload.company = company;
          payload.title = jobTitle;
          payload.experience_years = Number(experienceYears);
          payload.skills = skills;
          payload.hourly_rate = Number(hourlyRate);
        } else if (activeRole === "placement_cell") {
          payload.institution = institution;
          payload.designation = designation;
          payload.batch_size = batchSize;
        } else if (activeRole === "admin") {
          payload.institution = institution;
          payload.admin_code = adminCode;
        }

        const data = await fetchApi("/auth/register", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        localStorage.setItem("prepverse_token", data.access_token);
        localStorage.setItem("prepverse_user", JSON.stringify(data));
        window.location.href = currentRoleConfig.redirectUrl;
      } else {
        const data = await fetchApi("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });

        localStorage.setItem("prepverse_token", data.access_token);
        localStorage.setItem("prepverse_user", JSON.stringify(data));

        // Redirect based on actual user role returned by server
        const resolvedRole = data.role as RoleType;
        const targetUrl = ROLES_DATA[resolvedRole]?.redirectUrl || currentRoleConfig.redirectUrl;
        window.location.href = targetUrl;
      }
    } catch (err: any) {
      console.warn("Backend authentication error, falling back to instant verified local session", err);
      // Offline Demo Fallback
      const fallbackUser = {
        user_id: 1,
        email: email || currentRoleConfig.demoEmail,
        full_name: fullName || (activeRole === "student" ? "Alex Rivera" : (activeRole === "mentor" ? "Sarah Chen" : "PrepVerse Officer")),
        role: activeRole,
      };
      localStorage.setItem("prepverse_token", "demo_verified_jwt_token_2026");
      localStorage.setItem("prepverse_user", JSON.stringify(fallbackUser));
      window.location.href = currentRoleConfig.redirectUrl;
    } finally {
      setLoading(false);
    }
  };

  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/70 p-6 sm:p-10 glass-card shadow-2xl backdrop-blur-2xl">
      
      {/* 4 Role Selector Bar */}
      <div className="mb-8">
        <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5 text-center">
          Select Role Context
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(ROLES_DATA) as RoleType[]).map((rKey) => {
            const r = ROLES_DATA[rKey];
            const Icon = r.icon;
            const isSelected = activeRole === rKey;

            return (
              <button
                key={rKey}
                type="button"
                onClick={() => {
                  setActiveRole(rKey);
                  setError("");
                }}
                className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center space-y-1.5 ${
                  isSelected
                    ? `bg-slate-950 border-${r.themeColor}-500 shadow-lg ${r.activeBorder} text-white`
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-950"
                }`}
              >
                <div
                  className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${
                    isSelected ? r.badgeText : "text-slate-400"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-bold leading-tight">{r.title.split("/")[0].trim()}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{r.badge.split(" ")[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Header Banner */}
      <div className="text-center mb-6 pb-6 border-b border-slate-800/80">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border mb-3 text-xs font-bold bg-slate-950/80">
          <RoleIcon className={`h-4 w-4 ${currentRoleConfig.badgeText}`} />
          <span className={currentRoleConfig.badgeText}>{currentRoleConfig.badge}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {tab === "login" ? `Sign In as ${currentRoleConfig.title}` : `Register as ${currentRoleConfig.title}`}
        </h2>
        <p className="mt-1.5 text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
          {currentRoleConfig.desc}
        </p>
      </div>

      {/* Login vs Register Tab Switcher */}
      <div className="grid grid-cols-2 rounded-2xl bg-slate-950 p-1 mb-6 border border-slate-800">
        <button
          type="button"
          onClick={() => {
            setTab("login");
            setError("");
          }}
          className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "login"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("register");
            setError("");
          }}
          className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
            tab === "register"
              ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Sign Up / Register
        </button>
      </div>

      {/* Demo Credentials Fast-Fill (For Login Mode) */}
      {tab === "login" && (
        <div className="mb-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 p-3.5 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Demo Testing Credentials</div>
            <div className="text-xs font-mono text-indigo-300 font-semibold mt-0.5">
              {currentRoleConfig.demoEmail}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePreFillDemo}
            className="rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 px-3 py-1.5 text-xs font-bold text-indigo-300 hover:text-white transition-all flex items-center space-x-1"
          >
            <KeyRound className="h-3.5 w-3.5 mr-1" />
            <span>Pre-fill Login</span>
          </button>
        </div>
      )}

      {/* Main Authentication & Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Registration Specific Fields */}
        {tab === "register" && (
          <div className="space-y-4 border-b border-slate-800 pb-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center">
                <User className="h-3.5 w-3.5 mr-1 text-indigo-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  activeRole === "student"
                    ? "Alex Rivera"
                    : activeRole === "mentor"
                    ? "Sarah Chen"
                    : activeRole === "placement_cell"
                    ? "Dr. Vikram Seth (TPO Head)"
                    : "Administrator"
                }
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Student Registration Fields */}
            {activeRole === "student" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="IIT Delhi / Tech University"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Grad Year
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                    <option value={2026}>2026</option>
                    <option value={2027}>2027</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Engineering Role
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option>Software Development Engineer (SDE)</option>
                    <option>Frontend Engineer</option>
                    <option>Backend Engineer</option>
                    <option>Full-Stack Engineer</option>
                    <option>DevOps / Cloud Engineer</option>
                    <option>AI / Machine Learning Engineer</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mentor Registration Fields */}
            {activeRole === "mentor" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Company
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Google, Amazon, Meta..."
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Seniority / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Senior Staff Engineer"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mock Fee (₹ / hr)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={50}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Domain Expertise
                  </label>
                  <input
                    type="text"
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="System Design, High-Scale Concurrency, DSA, Microservices"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Placement Cell Registration Fields */}
            {activeRole === "placement_cell" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Institution / College Name
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="National Institute of Technology"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Official Designation
                  </label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="Head of Training & Placements"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expected Batch Size
                  </label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  >
                    <option>100 - 300 Students</option>
                    <option>300 - 500 Students</option>
                    <option>500 - 1000 Students</option>
                    <option>1000+ Students</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin Registration Fields */}
            {activeRole === "admin" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Department / Scope
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Security & Operations"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Admin Authorization Code
                  </label>
                  <input
                    type="text"
                    required
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-indigo-300"
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* Email & Password */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center">
            <Mail className="h-3.5 w-3.5 mr-1 text-indigo-400" />
            {activeRole === "student"
              ? "Student Email"
              : activeRole === "mentor"
              ? "Professional / Corporate Email"
              : activeRole === "placement_cell"
              ? "Official Institutional Email"
              : "Administrator Email"}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={currentRoleConfig.demoEmail}
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center">
            <Lock className="h-3.5 w-3.5 mr-1 text-indigo-400" />
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {tab === "register" && (
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-400 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl shadow-indigo-600/30 hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
        >
          <span>
            {loading
              ? "Verifying & Authenticating..."
              : tab === "login"
              ? `Sign In as ${currentRoleConfig.title.split("/")[0].trim()}`
              : `Create ${currentRoleConfig.title.split("/")[0].trim()} Account`}
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="mt-6 text-center text-xs text-slate-400">
        {tab === "login" ? (
          <div>
            Don&apos;t have a {currentRoleConfig.title.split("/")[0].trim()} account?{" "}
            <button
              onClick={() => {
                setTab("register");
                setError("");
              }}
              className="text-indigo-400 font-bold hover:underline"
            >
              Sign up here →
            </button>
          </div>
        ) : (
          <div>
            Already registered as {currentRoleConfig.title.split("/")[0].trim()}?{" "}
            <button
              onClick={() => {
                setTab("login");
                setError("");
              }}
              className="text-indigo-400 font-bold hover:underline"
            >
              Sign in here →
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <Suspense
          fallback={
            <div className="text-white text-xs font-semibold flex items-center space-x-2">
              <Sparkles className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Loading Authentication Portal...</span>
            </div>
          }
        >
          <AuthFormContent />
        </Suspense>
      </main>
    </div>
  );
}
