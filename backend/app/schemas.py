from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from datetime import datetime

# Auth & User
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "student"
    college: Optional[str] = None
    target_role: Optional[str] = None
    grad_year: Optional[int] = None
    company: Optional[str] = None
    title: Optional[str] = None
    experience_years: Optional[int] = None
    skills: Optional[str] = None
    hourly_rate: Optional[float] = None
    institution: Optional[str] = None
    designation: Optional[str] = None
    batch_size: Optional[str] = None
    admin_code: Optional[str] = None

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
    interview_type: str # Technical, HR, Behavioral, System Design, etc.
    topic_focus: Optional[str] = "Comprehensive Technical"
    duration_minutes: Optional[int] = 30
    language: Optional[str] = "English (US)"
    include_coding_ide: Optional[bool] = False
    use_resume_context: Optional[bool] = True
    custom_job_description: Optional[str] = None

class InterviewAnswerRequest(BaseModel):
    interview_id: int
    question_text: str
    answer_text: str
    audio_duration_seconds: Optional[float] = 30.0
    editor_code: Optional[str] = None
    language: Optional[str] = "python"
    audio_metrics: Optional[dict] = None # filler_words, wpm, pauses
    visual_metrics: Optional[dict] = None # eye_contact, posture

class InterviewCodeReviewRequest(BaseModel):
    interview_id: int
    code: str
    language: str = "python"
    current_question: Optional[str] = ""

class InterviewHintRequest(BaseModel):
    interview_id: int
    current_question: str
    current_code: Optional[str] = ""
    hint_level: Optional[int] = 1

class InterviewScheduleRequest(BaseModel):
    company: str
    role: str
    interview_type: str
    difficulty: str
    scheduled_date: str
    scheduled_time: str
    duration_minutes: Optional[int] = 30
    topic_focus: Optional[str] = "Comprehensive Technical"
    language: Optional[str] = "English (US)"

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
