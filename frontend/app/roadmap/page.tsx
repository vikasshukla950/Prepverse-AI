"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { TrendingUp, CheckCircle2, Circle, ArrowUpRight, Sparkles, Calendar, BookOpen, Code, Video, Award, Clock } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [activeDay, setActiveDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  async function loadRoadmap() {
    try {
      const res = await fetchApi("/roadmap");
      setRoadmap(res);
      if (res?.current_day) setActiveDay(res.current_day);
    } catch (err) {
      // High-content 14-day fallback roadmap
      const days: Record<number, any[]> = {
        1: [
          { id: 1, category: "DSA", task_title: "Arrays & Two Pointers", task_description: "Solve Two Sum & Container With Most Water in the IDE.", action_url: "/coding", is_completed: true },
          { id: 2, category: "DBMS", task_title: "B-Tree Indexing Deep Dive", task_description: "Study Clustered vs Non-Clustered Indexes in the Material Vault.", action_url: "/vault", is_completed: true }
        ],
        2: [
          { id: 3, category: "DSA", task_title: "Sliding Window & Hash Maps", task_description: "Solve Longest Substring Without Repeating Characters.", action_url: "/coding", is_completed: true },
          { id: 4, category: "HR", task_title: "Elevator Pitch & Introduction", task_description: "Structure a 2-minute STAR pitch tailored to Google.", action_url: "/questions", is_completed: true }
        ],
        3: [
          { id: 5, category: "OS", task_title: "Memory & Paging Mechanics", task_description: "Review Virtual Memory and Banker's Algorithm in Vault notes.", action_url: "/vault", is_completed: true },
          { id: 6, category: "DSA", task_title: "Fast & Slow Pointers (Linked Lists)", task_description: "Solve Linked List Cycle & Reorder List in IDE.", action_url: "/coding", is_completed: false }
        ],
        4: [
          { id: 7, category: "System Design", task_title: "Top 15 Architecture Patterns", task_description: "Read Cache-Aside, Consistent Hashing & Message Queues in Vault.", action_url: "/vault", is_completed: false },
          { id: 8, category: "Interview", task_title: "15-Min Technical AI Mock", task_description: "Complete a simulated Google SDE technical round in Arena.", action_url: "/arena", is_completed: false }
        ],
        5: [
          { id: 9, category: "DSA", task_title: "Stack & Monotonic Stack", task_description: "Solve Daily Temperatures & Valid Parentheses.", action_url: "/coding", is_completed: false },
          { id: 10, category: "Resume", task_title: "JD ATS Keyword Optimization", task_description: "Run JD-based ATS check against your target Google SDE posting.", action_url: "/ats", is_completed: false }
        ],
        6: [
          { id: 11, category: "DSA", task_title: "Binary Search Mastery", task_description: "Solve Search in Rotated Sorted Array & Koko Eating Bananas.", action_url: "/coding", is_completed: false },
          { id: 12, category: "Networks", task_title: "TCP/IP & HTTP/3 Fundamentals", task_description: "Study 3-way handshake and SYN flood mitigations in Vault.", action_url: "/vault", is_completed: false }
        ],
        7: [
          { id: 13, category: "DSA", task_title: "Trees & Level Order Traversal", task_description: "Invert Binary Tree & Lowest Common Ancestor in IDE.", action_url: "/coding", is_completed: false },
          { id: 14, category: "Mentorship", task_title: "Schedule 1-on-1 Mentor Review", task_description: "Book a 30-min strategy review with Google Mentor Sarah Chen.", action_url: "/mentors", is_completed: false }
        ],
        8: [
          { id: 15, category: "DSA", task_title: "Graph BFS / DFS & Cycle Detection", task_description: "Solve Number of Islands & Course Schedule.", action_url: "/coding", is_completed: false }
        ],
        9: [
          { id: 16, category: "DSA", task_title: "Dynamic Programming Foundations", task_description: "Solve Coin Change & Climbing Stairs with memoization.", action_url: "/coding", is_completed: false }
        ],
        10: [
          { id: 17, category: "System Design", task_title: "Design Twitter / Feed Service", task_description: "Implement Feed Generation and celebrity fan-out trade-offs.", action_url: "/coding", is_completed: false }
        ],
        11: [
          { id: 18, category: "HR", task_title: "STAR Framework Behavioral Prep", task_description: "Practice conflict resolution & leadership principle prompts.", action_url: "/questions", is_completed: false }
        ],
        12: [
          { id: 19, category: "DSA", task_title: "Hard Problem Sprint", task_description: "Tackle LRU Cache & Minimum Window Substring.", action_url: "/coding", is_completed: false }
        ],
        13: [
          { id: 20, category: "Interview", task_title: "Full 45-Min Multimodal AI Mock", task_description: "Attempt end-to-end Technical & Behavioral interview in Arena.", action_url: "/arena", is_completed: false }
        ],
        14: [
          { id: 21, category: "Readiness", task_title: "360° Readiness Verification", task_description: "Audit final score breakdown and export verified PDF report.", action_url: "/readiness", is_completed: false }
        ]
      };

      setRoadmap({
        id: 1,
        title: "14-Day SDE Target Preparation Roadmap",
        target_role: "Software Development Engineer (SDE)",
        target_company: "Google",
        total_days: 14,
        current_day: 3,
        tasks_by_day: days
      });
      setActiveDay(3);
    } finally {
      setLoading(false);
    }
  }

  const toggleTask = async (taskId: number) => {
    try {
      await fetchApi(`/roadmap/task/${taskId}/complete`, { method: "POST" });
      loadRoadmap();
    } catch (err) {
      if (roadmap && roadmap.tasks_by_day) {
        const updated = { ...roadmap };
        for (const d in updated.tasks_by_day) {
          updated.tasks_by_day[d] = updated.tasks_by_day[d].map((t: any) =>
            t.id === taskId ? { ...t, is_completed: !t.is_completed } : t
          );
        }
        setRoadmap(updated);
      }
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "dsa":
      case "coding":
        return <Code className="h-4 w-4 text-indigo-400" />;
      case "dbms":
      case "os":
      case "system design":
      case "networks":
        return <BookOpen className="h-4 w-4 text-emerald-400" />;
      case "interview":
      case "mock interview":
        return <Video className="h-4 w-4 text-purple-400" />;
      default:
        return <Award className="h-4 w-4 text-amber-400" />;
    }
  };

  const calculateProgress = () => {
    if (!roadmap?.tasks_by_day) return 40;
    let total = 0;
    let completed = 0;
    Object.values(roadmap.tasks_by_day).forEach((dayTasks: any) => {
      dayTasks.forEach((t: any) => {
        total++;
        if (t.is_completed) completed++;
      });
    });
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const daysArray = Array.from({ length: 14 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Personalized Adaptive Plan</span>
              <h1 className="text-2xl font-black text-white">{roadmap?.title || "14-Day Preparation Roadmap"}</h1>
              <p className="text-xs text-slate-400 mt-1">Targeting {roadmap?.target_role || "SDE"} at {roadmap?.target_company || "Google"} • Step-by-step daily milestones</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-400">Total Completion</div>
                <div className="text-base font-extrabold text-indigo-400">{calculateProgress()}% Complete</div>
              </div>
              <div className="w-24 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" style={{ width: `${calculateProgress()}%` }} />
              </div>
            </div>
          </div>

          {/* 14-Day Milestone Timeline Carousel */}
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center space-x-2 min-w-max">
              {daysArray.map((day) => {
                const dayTasks = roadmap?.tasks_by_day?.[day] || [];
                const isAllDone = dayTasks.length > 0 && dayTasks.every((t: any) => t.is_completed);
                const isCurrent = day === activeDay;

                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`rounded-2xl px-4 py-3 text-left transition-all border flex flex-col items-center min-w-[76px] ${
                      isCurrent
                        ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-105"
                        : isAllDone
                        ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">Day</span>
                    <span className="text-lg font-black mt-0.5">{day}</span>
                    <span className="text-[9px] mt-1">
                      {isAllDone ? "Done ✓" : `${dayTasks.filter((t: any) => t.is_completed).length}/${dayTasks.length || 0}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Day Detail Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center font-black text-indigo-400">
                  {activeDay}
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Day {activeDay} Milestone Focus</h3>
                  <p className="text-xs text-slate-400">Complete tasks to update your 360° Readiness scores and stay on schedule.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">
                  {roadmap?.tasks_by_day?.[activeDay]?.filter((t: any) => t.is_completed).length || 0} of {roadmap?.tasks_by_day?.[activeDay]?.length || 0} tasks done
                </span>
              </div>
            </div>

            {/* Task list for active day */}
            <div className="space-y-3">
              {(roadmap?.tasks_by_day?.[activeDay] || []).length > 0 ? (
                roadmap.tasks_by_day[activeDay].map((task: any) => (
                  <div
                    key={task.id}
                    className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      task.is_completed
                        ? "bg-emerald-950/20 border-emerald-800/30 text-slate-400"
                        : "bg-slate-950/80 border-slate-800 text-white hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-0.5 shrink-0 transition-transform hover:scale-110"
                      >
                        {task.is_completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-500 hover:text-indigo-400" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                            {getCategoryIcon(task.category)}
                            <span className="ml-1">{task.category}</span>
                          </span>
                          <span className={`text-sm font-bold ${task.is_completed ? "line-through text-slate-500" : "text-white"}`}>
                            {task.task_title || task.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{task.task_description || task.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {task.action_url && (
                        <a
                          href={task.action_url}
                          className="rounded-xl bg-indigo-600/20 border border-indigo-500/40 px-3.5 py-1.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all flex items-center space-x-1"
                        >
                          <span>Start Task</span>
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No tasks assigned for Day {activeDay}. Enjoy your revision or explore the Material Vault!
                </div>
              )}
            </div>

            {/* Quick Navigation between Days */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <button
                disabled={activeDay <= 1}
                onClick={() => setActiveDay((prev) => Math.max(1, prev - 1))}
                className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 font-semibold text-slate-300 hover:text-white disabled:opacity-40"
              >
                ← Previous Day
              </button>
              <button
                disabled={activeDay >= 14}
                onClick={() => setActiveDay((prev) => Math.min(14, prev + 1))}
                className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-500 disabled:opacity-40"
              >
                Next Day →
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
