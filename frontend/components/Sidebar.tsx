"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, Target, Bot, BookOpen, HelpCircle, Code, 
  Video, Calendar, Award, Flame, UserCheck, Settings, Sparkles, TrendingUp
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "360° Readiness Report", href: "/readiness", icon: Award, highlight: true },
    { label: "AI Career Coach", href: "/coach", icon: Bot },
    { label: "Resume & ATS", href: "/resume", icon: FileText },
    { label: "ATS Optimizer", href: "/ats", icon: Target },
    { label: "Preparation Roadmap", href: "/roadmap", icon: TrendingUp },
    { label: "Material Vault", href: "/vault", icon: BookOpen },
    { label: "Question Bank", href: "/questions", icon: HelpCircle },
    { label: "Coding IDE", href: "/coding", icon: Code },
    { label: "Interview Arena", href: "/arena", icon: Video },
    { label: "Mentor Marketplace", href: "/mentors", icon: UserCheck },
    { label: "My Sessions", href: "/sessions", icon: Calendar },
    { label: "Daily Challenge", href: "/daily", icon: Flame },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/60 p-4 min-h-[calc(100vh-4rem)] hidden md:block">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Student Navigation</div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                  : item.highlight
                  ? "text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-400" : item.highlight ? "text-emerald-400" : "text-slate-400"}`} />
              <span>{item.label}</span>
              {item.highlight && <span className="ml-auto flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-950 border border-indigo-800/30 p-4 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-2">
          <Sparkles className="h-5 w-5" />
        </div>
        <h4 className="text-xs font-bold text-white">Targeting Google SDE?</h4>
        <p className="text-[11px] text-slate-400 mt-1">Your readiness score is 76%. Focus on DBMS normalization to reach 82%.</p>
        <Link href="/roadmap" className="mt-3 block w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors">
          View Today's Plan
        </Link>
      </div>
    </aside>
  );
}
