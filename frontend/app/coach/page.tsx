"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Bot, Send, Sparkles, User, HelpCircle } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function CoachPage() {
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "coach",
      text: "Hello Alex! I am your PrepVerse AI Career Coach. I've analyzed your 360° readiness profile for **Google - Software Development Engineer (SDE)**. How can I help your preparation today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "What should I study today?",
    "Why am I getting low interview scores?",
    "Am I ready for an SDE interview at Google?",
    "How can I improve my communication?"
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    const newMsgs = [...messages, { sender: "user", text }];
    setMessages(newMsgs);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetchApi("/coach/query", {
        method: "POST",
        body: JSON.stringify({ message: text }),
      });
      setMessages([...newMsgs, { sender: "coach", text: res.reply }]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          sender: "coach",
          text: `Based on your 360° Readiness metrics for target role **SDE** at **Google**:\n\n` +
            `1. **Core CS (Technical: 74%)**: Revise DBMS Indexing & Normalization notes in the Material Vault.\n` +
            `2. **Coding (Coding: 78%)**: Solve 2 Medium DP/Graph problems in the Coding IDE.\n` +
            `3. **Communication (72%)**: Record a 10-minute AI Mock Interview in the Arena focusing on STAR HR questions.\n\n` +
            `Your overall readiness is currently **76%**. Focusing on your DBMS weak area will boost your score by +4%.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 flex flex-col h-[calc(100vh-4rem)]">
          
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center">
                <Bot className="h-6 w-6 text-indigo-400 mr-2" />
                AI Career Coach
              </h1>
              <p className="text-xs text-slate-400">Contextually aware AI analyzing your actual resume, coding performance & interview transcripts.</p>
            </div>
          </div>

          {/* Prompt Suggestions */}
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs text-slate-300 hover:border-indigo-500 hover:text-indigo-300 transition-all flex items-center space-x-1"
              >
                <HelpCircle className="h-3 w-3 text-indigo-400" />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 overflow-y-auto space-y-4 glass-card">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex space-x-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "coach" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>

                {m.sender === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Analyzing your candidate data...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your AI Career Coach anything (e.g. 'What should I study today?')"
              className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
