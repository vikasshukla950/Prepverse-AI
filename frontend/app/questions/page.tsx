"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { HelpCircle, Search, Building2, ChevronDown, CheckCircle2, Sparkles, Filter, Bookmark, Eye, Award } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [company, setCompany] = useState("All");
  const [topic, setTopic] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showAnswer, setShowAnswer] = useState<Record<number, boolean>>({});

  const companies = ["All", "Google", "Amazon", "Microsoft", "Meta", "Adobe", "TCS"];
  const topics = ["All", "DSA", "System Design", "DBMS", "Operating Systems", "Computer Networks", "Behavioral / HR"];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  useEffect(() => {
    loadQuestions();
  }, [company, difficulty, searchQuery]);

  async function loadQuestions() {
    try {
      let url = `/questions?`;
      if (company !== "All") url += `company=${company}&`;
      if (difficulty !== "All") url += `difficulty=${difficulty}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;
      const res = await fetchApi(url);
      setQuestions(res);
    } catch (err) {
      // Extensive fallback with company and topic tags
      setQuestions([
        {
          id: 1,
          company: "Google",
          role: "SDE",
          round: "Technical",
          topic: "DSA",
          difficulty: "Medium",
          question_text: "How do you detect a cycle in a Directed Graph vs an Undirected Graph?",
          expected_concepts: ["Kahn's Algorithm (BFS)", "DFS Recursion Stack", "Disjoint Set (Union Find)"],
          sample_answer: "For Undirected Graphs, use Union-Find or DFS keeping track of parent node. For Directed Graphs, use DFS with a recursion stack array or Kahn's Topological Sort algorithm."
        },
        {
          id: 2,
          company: "Google",
          role: "SDE",
          round: "Technical",
          topic: "System Design",
          difficulty: "Hard",
          question_text: "How would you design Google Docs real-time collaborative text editing with low latency?",
          expected_concepts: ["Operational Transformation (OT)", "CRDTs", "WebSockets", "Conflict Resolution"],
          sample_answer: "Use Conflict-free Replicated Data Types (CRDTs) or Operational Transformation (OT) over bidirectional WebSockets. A central sequencer orders concurrent edits."
        },
        {
          id: 3,
          company: "Amazon",
          role: "SDE",
          round: "Behavioral",
          topic: "Leadership Principles",
          difficulty: "Medium",
          question_text: "Tell me about a time you had to make an urgent engineering decision with incomplete data (Bias for Action).",
          expected_concepts: ["STAR Structure", "Quantifiable Impact", "Risk Mitigation", "Two-way door decisions"],
          sample_answer: "Describe a scenario where waiting for 100% certainty would delay product release. Explain how you made a 70% confidence decision with automated rollback mechanisms."
        },
        {
          id: 4,
          company: "Microsoft",
          role: "SDE",
          round: "Technical",
          topic: "DBMS",
          difficulty: "Hard",
          question_text: "Explain ACID properties and how Isolation levels (Read Uncommitted to Serializable) prevent anomalies.",
          expected_concepts: ["Atomicity", "Consistency", "Isolation", "Durability", "MVCC", "Two-Phase Locking"],
          sample_answer: "Isolation levels mitigate Dirty Reads (Read Committed), Non-Repeatable Reads (Repeatable Read), and Phantom Reads (Serializable). Modern databases use MVCC."
        },
        {
          id: 5,
          company: "Meta",
          role: "SDE",
          round: "Technical",
          topic: "System Design",
          difficulty: "Hard",
          question_text: "Design Instagram's News Feed system. How do you handle celebrity accounts with millions of followers?",
          expected_concepts: ["Fan-out on write", "Fan-out on read", "Hybrid model", "Redis feed caching"],
          sample_answer: "Use fan-out on write for regular users into Redis feed caches. Use fan-out on read for high-follower celebrities merged at read time."
        },
        {
          id: 6,
          company: "TCS",
          role: "SDE",
          round: "Technical",
          topic: "DBMS",
          difficulty: "Easy",
          question_text: "What is Database Normalization? Explain 1NF, 2NF, 3NF, and BCNF with simple examples.",
          expected_concepts: ["Atomicity (1NF)", "No partial dependency (2NF)", "No transitive dependency (3NF)", "BCNF Determinants"],
          sample_answer: "1NF enforces atomic columns. 2NF removes partial functional dependencies. 3NF eliminates transitive dependencies on non-primary attributes."
        }
      ]);
    }
  }

  const filteredQuestions = questions.filter((q) => {
    if (topic !== "All" && !q.topic?.toLowerCase().includes(topic.toLowerCase().split(" ")[0])) {
      return false;
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Company & Topic Archives</span>
              <h1 className="text-2xl font-black text-white flex items-center">
                <HelpCircle className="h-6 w-6 text-indigo-400 mr-2" />
                Interview Question Bank
              </h1>
              <p className="text-xs text-slate-400 mt-1">Real interview questions asked by top tech firms categorized by round, expected concepts, and sample answers.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                {filteredQuestions.length} Questions Available
              </span>
            </div>
          </div>

          {/* Filters: Company, Topic, Difficulty */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search questions (e.g. graph cycle, B-tree, STAR prompt, feed)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Difficulty Dropdown */}
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

            {/* Company Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1 text-slate-500" /> Company:
              </span>
              {companies.map((c) => (
                <button
                  key={c}
                  onClick={() => setCompany(c)}
                  className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                    company === c
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 mr-1">Topic:</span>
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    topic === t
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-slate-950 border border-slate-800/80 text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isExpanded = expandedId === q.id;
              const isAnswerRevealed = showAnswer[q.id];

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 glass-card transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-400">
                        {q.company}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                        {q.topic}
                      </span>
                      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                        Round: {q.round}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                          q.difficulty === "Easy"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : q.difficulty === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="text-xs text-indigo-400 font-bold hover:underline flex items-center"
                    >
                      <span>{isExpanded ? "Collapse Practice" : "Practice Question"}</span>
                      <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-white">{q.question_text}</h3>

                  {/* Expected Concepts */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-semibold text-slate-400">Expected Concepts:</span>
                    {(Array.isArray(q.expected_concepts)
                      ? q.expected_concepts
                      : JSON.parse(q.expected_concepts_json || "[]")
                    ).map((c: string, idx: number) => (
                      <span key={idx} className="rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {c}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Practice Area */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-slate-800">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Your Draft Response:</label>
                        <textarea
                          rows={3}
                          placeholder="Type how you would articulate your answer in a technical/behavioral interview..."
                          value={userAnswers[q.id] || ""}
                          onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                          className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setShowAnswer({ ...showAnswer, [q.id]: !isAnswerRevealed })}
                          className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-bold text-slate-200 flex items-center space-x-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{isAnswerRevealed ? "Hide Verified Answer" : "View Verified Sample Answer"}</span>
                        </button>

                        <a
                          href="/arena"
                          className="rounded-xl bg-purple-600/20 border border-purple-500/40 px-3.5 py-1.5 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
                        >
                          Practice in Live Mock Arena →
                        </a>
                      </div>

                      {/* Sample Answer Box */}
                      {isAnswerRevealed && (
                        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-emerald-400">Verified Answer Key & Framework:</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{q.sample_answer}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </main>
      </div>
    </div>
  );
}
