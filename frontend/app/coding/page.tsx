"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Code, Search, Play, CheckCircle2, ArrowRight, Sparkles, Filter, Terminal } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CodingCatalogPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Arrays & Hashing",
    "Two Pointers",
    "Sliding Window",
    "Stack",
    "Binary Search",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "System Design & Data Structures",
    "Backtracking",
    "Bit Manipulation"
  ];

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  useEffect(() => {
    loadProblems();
  }, [category]);

  async function loadProblems() {
    setLoading(true);
    try {
      let url = `/coding/problems?`;
      if (category !== "All") url += `category=${encodeURIComponent(category)}`;
      const res = await fetchApi(url);
      setProblems(res);
    } catch (err) {
      setProblems([
        { id: 1, title: "Two Sum", slug: "two-sum", category: "Arrays & Hashing", difficulty: "Easy", problem_statement: "Given an array of integers nums and an integer target, return indices of the two numbers." },
        { id: 2, title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", category: "Arrays & Hashing", difficulty: "Easy", problem_statement: "Maximize profit by choosing a single day to buy one stock and sell in the future." },
        { id: 3, title: "3Sum", slug: "3sum", category: "Two Pointers", difficulty: "Medium", problem_statement: "Find all unique triplets [nums[i], nums[j], nums[k]] summing to zero." },
        { id: 4, title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", category: "Sliding Window", difficulty: "Medium", problem_statement: "Find the length of the longest substring without duplicate characters." },
        { id: 5, title: "LRU Cache Design", slug: "lru-cache", category: "System Design & Data Structures", difficulty: "Hard", problem_statement: "Design a data structure with O(1) get and put operations using Hash Map and Doubly Linked List." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const filteredProblems = problems.filter((p) => {
    if (difficulty !== "All" && p.difficulty !== difficulty) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Industry Technical Practice</span>
              <h1 className="text-2xl font-black text-white flex items-center">
                <Code className="h-6 w-6 text-indigo-400 mr-2" />
                Browser Coding Practice & Technical IDE
              </h1>
              <p className="text-xs text-slate-400 mt-1">50+ Curated interview problems across Arrays, Trees, Graphs, DP, and System Design with testcase execution & AI explanation review.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                {filteredProblems.length} Problems Available
              </span>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problem title (e.g. Two Sum, LRU, Substring, Knapsack)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>Difficulty: {d}</option>
                ))}
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                    category === c
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Problems Table / Card Grid */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden glass-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Problem Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProblems.map((prob, idx) => (
                    <tr
                      key={prob.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    >
                      <td className="py-3 px-4 text-center text-slate-500 font-mono font-medium">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <Link href={`/coding/${prob.id}`} className="font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center">
                          <Terminal className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 mr-2" />
                          <span>{prob.title}</span>
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-medium">
                        <span className="rounded-md bg-slate-950 px-2 py-0.5 border border-slate-800/80">
                          {prob.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                            prob.difficulty === "Easy"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : prob.difficulty === "Medium"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/coding/${prob.id}`}
                          className="inline-flex items-center space-x-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 px-3 py-1.5 font-bold text-indigo-300 hover:text-white transition-all text-xs"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          <span>Solve</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
