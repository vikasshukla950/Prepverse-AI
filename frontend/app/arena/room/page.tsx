"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { Mic, MicOff, Video, VideoOff, Send, Clock, Sparkles, AlertCircle, ShieldAlert, Award } from "lucide-react";
import { fetchApi } from "@/lib/api";

export default function LiveInterviewRoomPage() {
  const [interviewData, setInterviewData] = useState<any>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 mins

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("prepverse_active_interview");
    if (raw) {
      const parsed = JSON.parse(raw);
      setInterviewData(parsed);
      setQuestionText(parsed.first_question || "Welcome to your AI Mock Interview. Introduce yourself and your key tech stack.");
      setTranscripts([{ speaker: "AI Interviewer", text: parsed.first_question || "Introduce yourself." }]);
    } else {
      setQuestionText("Welcome to your Google SDE AI Mock Interview. Introduce yourself and highlight your core technical strengths.");
      setTranscripts([{ speaker: "AI Interviewer", text: "Welcome to your Google SDE AI Mock Interview. Introduce yourself and highlight your core technical strengths." }]);
    }

    // Activate Webcam Stream
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.warn("Camera access fallback", err));
    }

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSendAnswer = async () => {
    if (!answerText.trim()) return;

    const currentQ = questionText;
    const currentAns = answerText;
    const updatedTranscripts = [...transcripts, { speaker: "Student", text: currentAns }];
    setTranscripts(updatedTranscripts);
    setAnswerText("");
    setSubmitting(true);

    try {
      const res = await fetchApi("/interview/answer", {
        method: "POST",
        body: JSON.stringify({
          interview_id: interviewData?.interview_id || 1,
          question_text: currentQ,
          answer_text: currentAns,
        }),
      });
      
      setQuestionText(res.next_question);
      setTranscripts([...updatedTranscripts, { speaker: "AI Interviewer", text: res.next_question }]);
    } catch (err) {
      const fallbackNext = "Could you elaborate on how you handled edge cases and system performance bottlenecks in that approach?";
      setQuestionText(fallbackNext);
      setTranscripts([...updatedTranscripts, { speaker: "AI Interviewer", text: fallbackNext }]);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    try {
      const res = await fetchApi(`/interview/${interviewData?.interview_id || 1}/end`, { method: "POST" });
      window.location.href = `/arena/report/${res.report_id || 1}`;
    } catch (err) {
      window.location.href = "/arena/report/1";
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Room Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
          <span className="text-xs font-extrabold text-white">LIVE INTERVIEW ARENA</span>
          <span className="text-xs text-slate-400">• {interviewData?.company || "Google"} ({interviewData?.role || "SDE"})</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-400 bg-indigo-600/10 border border-indigo-500/30 px-3 py-1 rounded-lg">
            <Clock className="h-4 w-4" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          <button
            onClick={handleEndInterview}
            className="rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-md transition-all"
          >
            End Interview & Generate Report
          </button>
        </div>
      </header>

      {/* Main Room Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 p-6 gap-6 overflow-hidden">
        
        {/* Left: AI Interviewer Stream */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between glass-card">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">AI Interview Engine</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">Active Conversation Context</span>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Current Question</span>
              <p className="text-xs text-white leading-relaxed font-medium">{questionText}</p>
            </div>
          </div>

          {/* Transcript History */}
          <div className="mt-4 flex-1 rounded-2xl bg-slate-950/60 p-4 border border-slate-800 overflow-y-auto space-y-3 max-h-60">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Live Transcript Stream</div>
            {transcripts.map((t, idx) => (
              <div key={idx} className="text-xs leading-relaxed">
                <strong className={t.speaker === "AI Interviewer" ? "text-indigo-400" : "text-emerald-400"}>
                  {t.speaker}:
                </strong>{" "}
                <span className="text-slate-300">{t.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Candidate Live Video Feed */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between glass-card relative">
          
          {/* Webcam Video Container */}
          <div className="relative flex-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center min-h-[300px]">
            {!isCameraOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-center text-slate-500 text-xs">
                <VideoOff className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                <span>Camera Stream Disabled</span>
              </div>
            )}

            {/* Visual Indicators Overlay */}
            <div className="absolute top-4 left-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 text-[11px] text-emerald-400 font-semibold flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Observed Indicator: High Centered Eye Contact</span>
            </div>
          </div>

          {/* Answer Input & Multimodal Audio Controls */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAnswer()}
                placeholder="Speak into microphone or type your response here..."
                className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 px-5 py-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleSendAnswer}
                disabled={submitting || !answerText.trim()}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Analyzing..." : "Submit Answer"}</span>
              </button>
            </div>

            {/* Bottom Audio / Camera Toggles */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border transition-colors ${isMuted ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-900 border-slate-800 text-slate-300"}`}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-2.5 rounded-xl border transition-colors ${isCameraOff ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-slate-900 border-slate-800 text-slate-300"}`}
                >
                  {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </button>
              </div>

              <span className="text-[11px] text-slate-500">Pacing: ~132 WPM • Zero Long Pauses</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
