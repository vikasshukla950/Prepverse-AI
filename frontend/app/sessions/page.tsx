"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Calendar, MessageSquare, Video, Send, User } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const res = await fetchApi("/mentors/my-sessions");
      setSessions(res);
    } catch (err) {
      setSessions([
        {
          id: 1,
          mentor_name: "Sarah Chen",
          mentor_company: "Google",
          session_type: "1-on-1 Mock Interview",
          session_date: "2026-08-28",
          session_time: "10:00 AM",
          status: "Confirmed",
          meeting_link: "https://meet.prepverse.ai/session-room-live"
        }
      ]);
    }
  }

  const openChat = (s: any) => {
    setActiveChatUser(s);
    setMessages([
      { id: 1, sender_id: 2, message: `Hi Alex! Looking forward to our mock interview on ${s.session_date}. Make sure to bring your resume questions!`, created_at: "10:00 AM" }
    ]);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), sender_id: 1, message: chatInput, created_at: "10:05 AM" }]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-2xl font-black text-white flex items-center">
              <Calendar className="h-6 w-6 text-indigo-400 mr-2" />
              My Mentor Sessions & Chat
            </h1>
            <p className="text-xs text-slate-400 mt-1">Manage confirmed 1-on-1 sessions, join live video rooms, and chat with your mentor.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sessions List */}
            <div className="lg:col-span-2 space-y-4">
              {sessions.map((s) => (
                <div key={s.id} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card">
                  <div>
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {s.status}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{s.session_type} with {s.mentor_name}</h3>
                    <p className="text-xs text-indigo-400 font-semibold">{s.mentor_company}</p>
                    <p className="text-xs text-slate-400 mt-1">Date: {s.session_date} at {s.session_time}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => openChat(s)}
                      className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 flex items-center justify-center space-x-1"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>Chat</span>
                    </button>

                    <a
                      href="/arena/room"
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 flex items-center justify-center space-x-1 shadow-md"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Room</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Student-Mentor Chat Window */}
            {activeChatUser ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card flex flex-col h-[500px]">
                <div className="border-b border-slate-800 pb-3 mb-3">
                  <h4 className="text-sm font-bold text-white">Chat with {activeChatUser.mentor_name}</h4>
                  <p className="text-[10px] text-slate-400">{activeChatUser.mentor_company}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-2">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender_id === 1 ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-xs rounded-2xl p-3 text-xs ${m.sender_id === 1 ? "bg-indigo-600 text-white" : "bg-slate-950 border border-slate-800 text-slate-300"}`}>
                        {m.message}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type message..."
                    className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white"
                  />
                  <button onClick={handleSendMessage} className="rounded-xl bg-indigo-600 p-2 text-white">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
                Select a session to chat with your mentor.
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}
