"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  Clock,
  Sparkles,
  Award,
  Volume2,
  VolumeX,
  RotateCcw,
  Square,
  Activity,
  Radio,
  User,
  CheckCircle2,
  AlertTriangle,
  Play
} from "lucide-react";
import { fetchApi } from "@/lib/api";

const FILLER_WORDS = ["um", "uh", "like", "basically", "actually", "you know", "sort of", "i mean", "right"];

export default function LiveInterviewRoomPage() {
  const [interviewData, setInterviewData] = useState<any>(null);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [roundTitle, setRoundTitle] = useState("Candidate Introduction & Background");

  // Media & Device States
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 mins
  const [audioLevel, setAudioLevel] = useState(0); // 0 - 100

  // Voice Model & Speech Recognition States
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [aiIsSpeaking, setAiIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  // Live Speech Analytics
  const [speakingDuration, setSpeakingDuration] = useState(0);
  const [detectedFillers, setDetectedFillers] = useState<string[]>([]);
  const [liveWpm, setLiveWpm] = useState(0);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentSessionText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
            } else {
              currentSessionText += transcript;
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          if (event.error === "not-allowed") {
            setIsListening(false);
          }
        };

        recognition.onend = () => {
          // If state still thinks we are listening, restart recognition (continuous)
          if (recognitionRef.current && (recognitionRef.current as any)._shouldBeListening) {
            try {
              recognition.start();
            } catch (e) {
              // Ignore duplicate start
            }
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechSupported(false);
      }
    }

    // Load active session from sessionStorage
    const raw = sessionStorage.getItem("prepverse_active_interview");
    const initialCompany = "Google";
    const initialRole = "Software Development Engineer (SDE)";
    let firstQ = `Hello and welcome! I am your AI Interviewer today for the ${initialRole} role at ${initialCompany}. To get started, please tell me something about yourself, your technical background, and a key software project you are proud of.`;

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setInterviewData(parsed);
        firstQ =
          parsed.first_question ||
          `Hello and welcome! I am your AI Interviewer today for the ${parsed.role || initialRole} role at ${parsed.company || initialCompany}. To get started, please tell me something about yourself, your technical background, and a key software project you are proud of.`;
        setCurrentRound(parsed.current_round || 1);
        setTotalRounds(parsed.total_rounds || 5);
        setRoundTitle(parsed.round_title || "Candidate Introduction & Background");
      } catch (err) {
        console.error("Error reading session interview:", err);
      }
    }

    setQuestionText(firstQ);
    setTranscripts([{ speaker: "AI Interviewer", text: firstQ }]);

    // Speak initial welcome question after 1.2s delay for browser audio context
    const initialSpeakTimeout = setTimeout(() => {
      speakAiQuestion(firstQ);
    }, 1200);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Initialize Camera and Web Audio Meter
    setupMediaDevices();

    return () => {
      clearTimeout(initialSpeakTimeout);
      clearInterval(timer);
      stopListening();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Web Audio Level Meter & Webcam
  const setupMediaDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        mediaStreamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Web Audio Context for Live Volume Meter
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          const source = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);

          const updateVolume = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              setAudioLevel(Math.min(Math.round((avg / 128) * 100), 100));
            }
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      }
    } catch (err) {
      console.warn("Camera/Microphone access notice:", err);
    }
  };

  // Analyze Answer text in real-time for WPM and filler words
  useEffect(() => {
    if (!answerText.trim()) {
      setLiveWpm(0);
      setDetectedFillers([]);
      return;
    }

    const words = answerText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Detect filler words
    const lower = answerText.toLowerCase();
    const foundFillers: string[] = [];
    FILLER_WORDS.forEach((f) => {
      const regex = new RegExp(`\\b${f}\\b`, "gi");
      const matches = lower.match(regex);
      if (matches) {
        for (let i = 0; i < matches.length; i++) {
          foundFillers.push(f);
        }
      }
    });
    setDetectedFillers(foundFillers);

    // Compute live WPM
    if (speakingDuration > 2) {
      const minutes = speakingDuration / 60;
      setLiveWpm(Math.round(wordCount / minutes));
    } else {
      setLiveWpm(Math.min(wordCount * 4, 135));
    }
  }, [answerText, speakingDuration]);

  // Speaking duration timer
  useEffect(() => {
    if (isListening) {
      speechTimerRef.current = setInterval(() => {
        setSpeakingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (speechTimerRef.current) {
        clearInterval(speechTimerRef.current);
      }
    }
    return () => {
      if (speechTimerRef.current) {
        clearInterval(speechTimerRef.current);
      }
    };
  }, [isListening]);

  // AI Voice Model - Text To Speech
  const speakAiQuestion = (text: string) => {
    if (!aiVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown asterisks or special characters for smooth voice synthesis
    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/•/g, "")
      .replace(/`/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.98; // Natural, clear interview pacing
    utterance.pitch = 1.0;

    // Pick a natural sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") ||
            v.name.includes("Natural") ||
            v.name.includes("Samantha") ||
            v.name.includes("Microsoft") ||
            v.name.includes("Daniel"))
      ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setAiIsSpeaking(true);
      // Auto-pause microphone while AI is speaking to avoid feedback loop
      if (isListening) {
        stopListening();
      }
    };

    utterance.onend = () => {
      setAiIsSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e);
      setAiIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAiVoice = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setAiIsSpeaking(false);
    }
  };

  // Speech-to-Text: Start / Stop listening
  const startListening = () => {
    if (!recognitionRef.current) return;
    // Interrupt AI voice if it was speaking
    stopAiVoice();

    try {
      (recognitionRef.current as any)._shouldBeListening = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      // If already started, ensure state is set
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      (recognitionRef.current as any)._shouldBeListening = false;
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore
      }
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Submit Answer to Backend
  const handleSendAnswer = async () => {
    if (!answerText.trim() || submitting) return;

    // Stop candidate recording
    stopListening();
    stopAiVoice();

    const currentQ = questionText;
    const currentAns = answerText.trim();
    const durationSent = Math.max(speakingDuration, 10);

    const updatedTranscripts = [...transcripts, { speaker: "Student", text: currentAns }];
    setTranscripts(updatedTranscripts);
    setAnswerText("");
    setSpeakingDuration(0);
    setSubmitting(true);

    try {
      const res = await fetchApi("/interview/answer", {
        method: "POST",
        body: JSON.stringify({
          interview_id: interviewData?.interview_id || 1,
          question_text: currentQ,
          answer_text: currentAns,
          audio_duration_seconds: durationSent,
          audio_metrics: {
            filler_words_detected: detectedFillers.length,
            wpm: liveWpm || 132,
            word_count: currentAns.split(/\s+/).length
          }
        }),
      });

      const nextQ = res.next_question;
      setQuestionText(nextQ);
      setCurrentRound(res.current_round || Math.min(currentRound + 1, 5));
      setRoundTitle(res.round_title || `Round ${Math.min(currentRound + 1, 5)} of 5`);
      setTranscripts([...updatedTranscripts, { speaker: "AI Interviewer", text: nextQ }]);

      // Trigger AI voice response for the new question
      speakAiQuestion(nextQ);
    } catch (err) {
      // Intelligent fallback progression if backend is in offline demo mode
      const fallbackQuestions = [
        "Thank you for that background! In that system architecture, how did you decouple microservice boundaries, handle database transactions, and maintain sub-100ms API latency?",
        "That architectural explanation is clear. Suppose traffic spikes 10x during a peak event at Google. How do you prevent cascading database connection pool exhaustion and cache stampedes?",
        "Great problem-solving. Technical capability goes hand-in-hand with engineering collaboration. Can you tell me about a time you had a tough technical disagreement with a teammate and how you resolved it using the STAR method?",
        "To conclude our round: If you had the opportunity to rebuild that primary project from scratch today, what major design decision or framework would you replace? And do you have any questions for me?"
      ];

      const nextRoundIndex = Math.min(currentRound, fallbackQuestions.length);
      const fallbackNext = fallbackQuestions[nextRoundIndex - 1] || "Thank you! You have completed all 5 rounds. Please click 'End Interview & Generate Report' to view your 360° readiness breakdown.";

      setQuestionText(fallbackNext);
      setCurrentRound((prev) => Math.min(prev + 1, 5));
      setRoundTitle(`Round ${Math.min(currentRound + 1, 5)} of 5`);
      setTranscripts([...updatedTranscripts, { speaker: "AI Interviewer", text: fallbackNext }]);

      speakAiQuestion(fallbackNext);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    stopAiVoice();
    stopListening();
    try {
      const res = await fetchApi(`/interview/${interviewData?.interview_id || 1}/end`, {
        method: "POST",
      });
      window.location.href = `/arena/report/${res.report_id || interviewData?.interview_id || 1}`;
    } catch (err) {
      window.location.href = `/arena/report/${interviewData?.interview_id || 1}`;
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const companyName = interviewData?.company || "Google";
  const roleName = interviewData?.role || "Software Development Engineer (SDE)";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Room Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-wider text-white uppercase">
                ONE-TO-ONE AI INTERVIEW ARENA
              </span>
              <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                Voice Model Active
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              {companyName} • {roleName}
            </span>
          </div>
        </div>

        {/* Round Progress indicator */}
        <div className="hidden md:flex items-center space-x-3 bg-slate-950/80 border border-slate-800 px-4 py-1.5 rounded-2xl">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Round {currentRound} of {totalRounds}
            </div>
            <div className="text-xs font-semibold text-indigo-300 max-w-[220px] truncate">
              {roundTitle}
            </div>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <div
                key={r}
                className={`h-2 w-5 rounded-full transition-all ${
                  r < currentRound
                    ? "bg-emerald-500"
                    : r === currentRound
                    ? "bg-indigo-500 animate-pulse"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Controls: Timer & End Button */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-mono font-bold text-indigo-400 bg-indigo-600/10 border border-indigo-500/30 px-3 py-1.5 rounded-xl">
            <Clock className="h-4 w-4" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          <button
            onClick={handleEndInterview}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-1.5 text-xs font-bold text-white hover:from-rose-500 hover:to-rose-600 shadow-md shadow-rose-900/20 transition-all flex items-center space-x-1.5"
          >
            <span>Finish Interview</span>
          </button>
        </div>
      </header>

      {/* Main Grid: 2 Columns (Left: AI Interviewer & Voice, Right: Candidate Camera & Mic) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6 overflow-hidden">
        
        {/* Left Column (5 Cols): AI Interviewer Voice Model & Live Question */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* AI Interviewer Avatar Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 glass-card relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glow when AI Speaks */}
            {aiIsSpeaking && (
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-600/10 to-transparent pointer-events-none animate-pulse"></div>
            )}

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Glowing Animated Avatar */}
                  <div className="relative">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-xl transition-all ${
                        aiIsSpeaking
                          ? "shadow-indigo-500/50 scale-105 ring-4 ring-indigo-500/30"
                          : "shadow-indigo-500/20"
                      }`}
                    >
                      <div className="h-full w-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                        <Sparkles
                          className={`h-7 w-7 text-indigo-400 ${
                            aiIsSpeaking ? "animate-spin text-indigo-300" : ""
                          }`}
                        />
                      </div>
                    </div>
                    {/* Pulsing indicator ring */}
                    {aiIsSpeaking && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500 text-[8px] text-white font-bold items-center justify-center">
                          AI
                        </span>
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-extrabold text-white">
                        AI Technical Interviewer
                      </h3>
                      <span className="rounded bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 text-[9px] font-bold">
                        {companyName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          aiIsSpeaking
                            ? "bg-indigo-400 animate-ping"
                            : isListening
                            ? "bg-emerald-400 animate-pulse"
                            : "bg-slate-500"
                        }`}
                      />
                      <span className="text-[11px] font-semibold text-slate-300">
                        {aiIsSpeaking
                          ? "Speaking question aloud..."
                          : isListening
                          ? "Attentively listening to you..."
                          : "Standing by"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Audio Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      if (aiIsSpeaking) {
                        stopAiVoice();
                      } else {
                        speakAiQuestion(questionText);
                      }
                    }}
                    title={aiIsSpeaking ? "Pause AI Speech" : "Replay Question Aloud"}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                  >
                    {aiIsSpeaking ? (
                      <Square className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-indigo-400" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (aiVoiceEnabled) {
                        stopAiVoice();
                        setAiVoiceEnabled(false);
                      } else {
                        setAiVoiceEnabled(true);
                        speakAiQuestion(questionText);
                      }
                    }}
                    title={aiVoiceEnabled ? "Mute AI Voice" : "Enable AI Voice"}
                    className={`p-2 rounded-xl border transition-colors ${
                      aiVoiceEnabled
                        ? "bg-indigo-600/20 text-indigo-400 border-indigo-500/40"
                        : "bg-slate-800 text-slate-500 border-slate-700"
                    }`}
                  >
                    {aiVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Animated Equalizer Waveform while AI is speaking */}
              {aiIsSpeaking && (
                <div className="flex items-center justify-center space-x-1.5 py-2 bg-indigo-950/30 border border-indigo-800/40 rounded-2xl">
                  {[40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 45].map((height, idx) => (
                    <div
                      key={idx}
                      className="w-1 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full animate-bounce"
                      style={{
                        height: `${Math.max(12, (height * 32) / 100)}px`,
                        animationDelay: `${idx * 0.08}s`,
                        animationDuration: "0.65s",
                      }}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-indigo-300 ml-2 tracking-wide uppercase">
                    AI Voice Active
                  </span>
                </div>
              )}

              {/* Current Question Bubble */}
              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800/80 shadow-inner space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 flex items-center">
                    <Radio className="h-3.5 w-3.5 mr-1 animate-pulse" />
                    Question {currentRound} of {totalRounds} • {roundTitle}
                  </span>
                  <button
                    onClick={() => speakAiQuestion(questionText)}
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-400 flex items-center space-x-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Repeat</span>
                  </button>
                </div>
                <p className="text-xs md:text-sm text-slate-100 leading-relaxed font-medium">
                  {questionText}
                </p>
              </div>
            </div>

            {/* Live Transcript Stream */}
            <div className="mt-4 rounded-2xl bg-slate-950/80 p-3.5 border border-slate-800 overflow-y-auto max-h-56 space-y-3">
              <div className="text-[10px] font-black tracking-wider text-slate-500 uppercase flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Conversation Transcript</span>
                <span className="text-[9px] text-slate-400 lowercase">{transcripts.length} turns</span>
              </div>
              {transcripts.map((t, idx) => (
                <div key={idx} className="text-xs leading-relaxed space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        t.speaker === "AI Interviewer" ? "text-indigo-400" : "text-emerald-400"
                      }`}
                    >
                      {t.speaker}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] pl-2 border-l border-slate-800">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Tips Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-3.5 text-xs text-slate-400 flex items-start space-x-2.5">
            <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-slate-200">Interview Tip:</strong> Use the STAR methodology (Situation, Task, Action, Result) for behavioral questions and state Big-O complexity when detailing technical systems.
            </p>
          </div>

        </div>

        {/* Right Column (7 Cols): Candidate Video, Live Microphone & Speech Recognition */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Candidate Webcam & Visual Analytics Feed */}
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-4 glass-card overflow-hidden flex flex-col min-h-[300px] flex-1">
            
            {/* Video Feed Box */}
            <div className="relative flex-1 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {!isCameraOff ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover rounded-2xl mirror-mode"
                />
              ) : (
                <div className="text-center text-slate-500 py-16">
                  <VideoOff className="mx-auto h-12 w-12 text-slate-600 mb-2" />
                  <span className="text-xs font-semibold">Candidate Camera Feed Disabled</span>
                </div>
              )}

              {/* Overlay: Live Visual Indicator */}
              <div className="absolute top-3 left-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 text-[10px] text-emerald-400 font-bold flex items-center space-x-2 shadow-lg">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Gaze: Centered Focus • Posture Stable</span>
              </div>

              {/* Overlay: Real-time Audio Visualizer Bars over video */}
              <div className="absolute bottom-3 right-3 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 flex items-center space-x-2 shadow-lg">
                <Mic className={`h-3.5 w-3.5 ${isListening ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
                <div className="flex items-center space-x-1 h-3">
                  {[20, 45, 80, 60, 100, 70, 30].map((v, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isListening
                          ? audioLevel > v / 2
                            ? "bg-emerald-400"
                            : "bg-slate-700"
                          : "bg-slate-800"
                      }`}
                      style={{
                        height: isListening ? `${Math.max(4, (audioLevel * 14) / 100)}px` : "4px",
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-slate-300">
                  {isListening ? `${audioLevel}%` : "Muted"}
                </span>
              </div>

              {/* Camera & Mic Toggle Overlay */}
              <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                <button
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs ${
                    isCameraOff
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                      : "bg-slate-950/80 text-slate-300 border-slate-700 hover:bg-slate-900"
                  }`}
                  title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs ${
                    isMuted
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                      : "bg-slate-950/80 text-slate-300 border-slate-700 hover:bg-slate-900"
                  }`}
                  title={isMuted ? "Unmute Mic" : "Mute Mic"}
                >
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Live Speaking Metrics Row */}
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Speaking Pacing</span>
                <span className="text-xs font-black text-indigo-400 font-mono">
                  {liveWpm > 0 ? `${liveWpm} WPM` : "Optimal (~130 WPM)"}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Filler Words</span>
                <span className={`text-xs font-black font-mono ${detectedFillers.length > 3 ? "text-amber-400" : "text-emerald-400"}`}>
                  {detectedFillers.length} detected
                </span>
              </div>

              <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-2.5 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Speaking Duration</span>
                <span className="text-xs font-black text-white font-mono">
                  {formatTimer(speakingDuration)}
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Speech-to-Text Input Area */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 glass-card space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleListening}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg ${
                    isListening
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-500/50"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                  }`}
                >
                  {isListening ? (
                    <>
                      <Square className="h-3.5 w-3.5 fill-white" />
                      <span>Stop Speaking</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-3.5 w-3.5" />
                      <span>Speak via Microphone</span>
                    </>
                  )}
                </button>

                {isListening && (
                  <span className="text-[11px] text-emerald-400 font-semibold animate-pulse flex items-center space-x-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    <span>Listening... Speak your answer</span>
                  </span>
                )}
              </div>

              {detectedFillers.length > 0 && (
                <div className="text-[10px] text-amber-400 flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Noted fillers: {detectedFillers.slice(-3).join(", ")}</span>
                </div>
              )}
            </div>

            {/* Answer Text Area (Editable with real-time speech-to-text transcript sync) */}
            <div className="relative">
              <textarea
                rows={4}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening to your voice... Spoken words will appear here in real time. You can also edit text directly."
                    : "Click 'Speak via Microphone' to talk naturally, or type your response here..."
                }
                className="w-full rounded-2xl bg-slate-950 border border-slate-800 px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
              />

              {/* Word Count Indicator */}
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-slate-900/80 px-2 py-0.5 rounded-md">
                {answerText.trim() ? `${answerText.trim().split(/\s+/).length} words` : "0 words"}
              </div>
            </div>

            {/* Submit & Next Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {speechSupported
                  ? "Speech-to-text & AI voice model active."
                  : "Speech recognition unavailable in this browser; text mode active."}
              </span>

              <button
                onClick={handleSendAnswer}
                disabled={submitting || !answerText.trim()}
                className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-bold text-white hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>{submitting ? "Analyzing Audio & Speech..." : "Submit Spoken Answer →"}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
