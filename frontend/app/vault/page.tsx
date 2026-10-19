"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { BookOpen, Search, Filter, Bookmark, CheckCircle2, Clock, Sparkles, ChevronRight, Share2, Tag } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function VaultPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<any | null>(null);

  const topics = ["All", "DBMS", "System Design", "Operating Systems", "Computer Networks", "DSA", "HR"];
  const categories = ["All", "Cheat Sheet", "Notes", "Architecture Guide"];

  useEffect(() => {
    loadResources();
  }, [selectedTopic, searchQuery]);

  async function loadResources() {
    setLoading(true);
    try {
      let url = `/vault/resources?`;
      if (selectedTopic !== "All") url += `topic=${encodeURIComponent(selectedTopic)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;
      const res = await fetchApi(url);
      setResources(res);
      if (res.length > 0 && !selectedResource) setSelectedResource(res[0]);
    } catch (err) {
      const fallbackNotes = [
        {
          id: 1,
          title: "DBMS Indexing, B-Trees & Query Optimization",
          topic: "DBMS",
          category: "Cheat Sheet",
          difficulty: "Medium",
          summary: "Master Clustered vs Non-Clustered Indexes, B-Tree lookups, Composite Index ordering, and EXPLAIN ANALYZE execution plans.",
          content: "### Database Indexing & B-Trees\n- **Clustered Index**: Determines the physical ordering of data rows on disk. Only ONE per table (Primary Key).\n- **Non-Clustered Index**: Separate structure with pointers to the data rows.\n- **B+ Tree Mechanics**: Balanced tree with fanout ~100-500. Leaf nodes form a doubly linked list for range queries `BETWEEN`.\n- **Composite Index Leftmost Prefix Rule**: Index on (A, B, C) serves (A) and (A, B), but NOT (B, C) alone.\n- **EXPLAIN ANALYZE**: Verify index scans vs sequential scans.",
          read_time: "12 min",
          tags: ["DBMS", "SQL", "B-Trees", "Indexing", "Performance"]
        },
        {
          id: 2,
          title: "Top 15 System Design Patterns for SDE Roles",
          topic: "System Design",
          category: "Notes",
          difficulty: "Hard",
          summary: "Comprehensive architecture guide covering Load Balancers, Consistent Hashing, Caching (Redis), Database Sharding, and Event Queues.",
          content: "### Core System Design Patterns\n1. **Load Balancing**: L4 (TCP) vs L7 (HTTP reverse proxy). Algorithms: Round Robin, Weighted Least Connection, IP Hash.\n2. **Caching Strategies**: Cache-Aside (Lazy Loading), Write-Through, and Write-Back.\n3. **Consistent Hashing**: Minimizes key remapping during node scale up/down using a virtual-node hash ring.\n4. **Message Queues**: RabbitMQ (push broker) vs Apache Kafka (pull distributed append-only log).",
          read_time: "25 min",
          tags: ["System Design", "Scalability", "Architecture", "Distributed Systems"]
        },
        {
          id: 3,
          title: "Operating Systems - Memory Virtualization & Deadlock Mechanics",
          topic: "Operating Systems",
          category: "Notes",
          difficulty: "Medium",
          summary: "Virtual Memory, Paging, Page Fault handling, TLB, and Banker's Algorithm for deadlock avoidance.",
          content: "### Operating Systems Core Notes\n- **Virtual Memory**: Decouples process address space from physical RAM via page tables.\n- **TLB**: Hardware cache for virtual-to-physical address mappings.\n- **Page Faults**: Triggers trap to kernel when virtual page is not mapped to physical frame.\n- **Coffman Conditions for Deadlock**: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.\n- **Banker's Algorithm**: Resource allocation graph state check.",
          read_time: "15 min",
          tags: ["OS", "Kernels", "Virtual Memory", "Paging", "Deadlocks"]
        },
        {
          id: 4,
          title: "Computer Networks - TCP/IP, HTTP/3, and DNS Deep Dive",
          topic: "Computer Networks",
          category: "Cheat Sheet",
          difficulty: "Medium",
          summary: "From URL to page render: DNS resolution, TCP 3-way handshake, TLS 1.3, HTTP/2 multiplexing, and HTTP/3 QUIC over UDP.",
          content: "### Networking Cheatsheet\n- **URL Resolution**: Browser -> OS cache -> Resolver -> Root DNS -> TLD -> Authoritative.\n- **TCP 3-Way Handshake**: SYN -> SYN-ACK -> ACK.\n- **HTTP/2 vs HTTP/3**: HTTP/2 uses binary multiplexing over TCP; HTTP/3 runs QUIC over UDP to eliminate head-of-line blocking.",
          read_time: "18 min",
          tags: ["Networks", "TCP", "HTTP3", "DNS", "TLS"]
        },
        {
          id: 5,
          title: "Object-Oriented Design & Clean Architecture Patterns",
          topic: "System Design",
          category: "Notes",
          difficulty: "Medium",
          summary: "SOLID principles in practice, Factory, Strategy, Observer, Decorator, and Singleton patterns with clean code guidelines.",
          content: "### OOP Design Patterns\n- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.\n- **Strategy Pattern**: Interchangeable algorithms (e.g. Stripe, PayPal, Razorpay payment drivers).\n- **Observer Pattern**: Publish/Subscribe event notification.",
          read_time: "14 min",
          tags: ["OOP", "SOLID", "Design Patterns", "Clean Code"]
        },
        {
          id: 6,
          title: "STAR Framework for Behavioral & HR Leadership Rounds",
          topic: "HR",
          category: "Cheat Sheet",
          difficulty: "Easy",
          summary: "How to structure Situation, Task, Action, and Result for Amazon Leadership Principles, Googleyness, and behavioral interviews.",
          content: "### Master the STAR Method\n- **Situation (15%)**: Concise background context.\n- **Task (10%)**: Your specific ownership.\n- **Action (55%)**: The technical execution, decisions, and trade-offs.\n- **Result (20%)**: Measurable business impact (e.g. 35% latency drop, $15k cloud savings).",
          read_time: "10 min",
          tags: ["HR", "Behavioral", "STAR", "Communication"]
        }
      ];
      setResources(fallbackNotes);
      if (!selectedResource) setSelectedResource(fallbackNotes[0]);
    } finally {
      setLoading(false);
    }
  }

  const filteredResources = resources.filter((r) => {
    if (selectedCategory !== "All" && r.category !== selectedCategory) return false;
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
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Curated Interview Knowledge</span>
              <h1 className="text-2xl font-black text-white flex items-center">
                <BookOpen className="h-6 w-6 text-emerald-400 mr-2" />
                Material Vault & Study Notes
              </h1>
              <p className="text-xs text-slate-400 mt-1">High-yield revision cheat sheets, system design architectures, and core CS notes for Tier-1 placements.</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                {resources.length} Modules Available
              </span>
            </div>
          </div>

          {/* Search & Topic Filters */}
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search topics (e.g. B-Tree, Caching, Paging, TCP)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    selectedTopic === t
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Viewer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Note Cards List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredResources.map((res) => {
                const isSelected = selectedResource?.id === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResource(res)}
                    className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-950/50"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-bold text-emerald-400">{res.topic}</span>
                      <span className="text-slate-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {res.read_time}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{res.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{res.summary}</p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                      <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                        {res.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center">
                        Read Module <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Full Interactive Reader */}
            <div className="lg:col-span-7">
              {selectedResource ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 space-y-6 glass-card sticky top-6">
                  
                  <div className="border-b border-slate-800 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                        {selectedResource.topic} • {selectedResource.difficulty || "Medium"}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-slate-500" />
                        {selectedResource.read_time} read
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-white">{selectedResource.title}</h2>
                    <p className="text-xs text-slate-300">{selectedResource.summary}</p>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-4 text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 max-h-[460px] overflow-y-auto whitespace-pre-line">
                    {selectedResource.content}
                  </div>

                  {/* Tags and Action */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-slate-500 mr-1" />
                      {(Array.isArray(selectedResource.tags) ? selectedResource.tags : (selectedResource.tags || "").split(",")).map((t: string) => (
                        <span key={t} className="rounded-md bg-slate-800/60 px-2 py-0.5 text-[10px] text-slate-400 font-medium">
                          {t.trim()}
                        </span>
                      ))}
                    </div>

                    <a
                      href="/questions"
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-all flex items-center space-x-1"
                    >
                      <span>Practice Related Questions</span>
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>

                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  <BookOpen className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                  <p className="text-xs">Select a note or cheatsheet from the left to read.</p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
