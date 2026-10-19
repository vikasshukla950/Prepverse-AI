from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# Auth & User
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "student"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str

class OnboardingRequest(BaseModel):
    full_name: str
    college: str
    degree: str
    branch: str
    grad_year: int
    skills: List[str]
    target_role: str
    target_company: str
    prep_time: str

# Profile & Readiness
class ProfileUpdate(BaseModel):
    college: Optional[str] = None
    degree: Optional[str] = None
    branch: Optional[str] = None
    target_role: Optional[str] = None
    target_company: Optional[str] = None
    prep_time: Optional[str] = None

class ProfileResponse(BaseModel):
    user_id: int
    email: str
    full_name: str
    role: str
    college: str
    degree: str
    branch: str
    grad_year: int
    skills: str
    target_role: str
    target_company: str
    prep_time: str
    xp: int
    streak: int
    resume_score: int
    ats_score: int
    technical_score: int
    coding_score: int
    comm_score: int
    interview_score: int
    overall_readiness: int

# ATS & Resume
class ATSAnalysisRequest(BaseModel):
    target_role: str
    target_company: str
    job_description: str
    resume_text: Optional[str] = None

# Coding & Submission
class CodeRunRequest(BaseModel):
    code: str
    language: str
    custom_input: Optional[str] = ""

class CodeSubmitRequest(BaseModel):
    problem_id: int
    code: str
    language: str

class SolutionExplanationRequest(BaseModel):
    submission_id: int
    explanation_text: str

# Interview Arena
class InterviewSetupRequest(BaseModel):
    company: str
    role: str
    difficulty: str
    interview_type: str # Technical, HR, Behavioral, System Design
    duration_minutes: Optional[int] = 30

class InterviewAnswerRequest(BaseModel):
    interview_id: int
    question_text: str
    answer_text: str
    audio_metrics: Optional[dict] = None # filler_words, wpm, pauses
    visual_metrics: Optional[dict] = None # eye_contact, posture

# Mentor Booking
class MentorBookingRequest(BaseModel):
    mentor_id: int
    session_date: str
    session_time: str
    session_type: str
    notes: Optional[str] = ""

# AI Coach
class CoachQueryRequest(BaseModel):
    message: str

class ChatMessageRequest(BaseModel):
    receiver_id: int
    message: str
