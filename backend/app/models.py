from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="student") # student, mentor, admin, placement_cell
    full_name = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    profile = relationship("Profile", back_populates="user", uselist=False)
    resumes = relationship("Resume", back_populates="user")
    coding_submissions = relationship("CodingSubmission", back_populates="user")
    mock_interviews = relationship("MockInterview", back_populates="user")
    mentor_profile = relationship("Mentor", back_populates="user", uselist=False)
    bookings_as_student = relationship("MentorBooking", foreign_keys="MentorBooking.student_id", back_populates="student")

class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    college = Column(String, default="IIT Delhi / Tech University")
    degree = Column(String, default="B.Tech Computer Science")
    branch = Column(String, default="Computer Science")
    grad_year = Column(Integer, default=2025)
    skills = Column(Text, default="Python, Java, React, SQL, Data Structures")
    target_role = Column(String, default="Software Development Engineer (SDE)")
    target_company = Column(String, default="Google")
    prep_time = Column(String, default="2 hours / day")
    xp = Column(Integer, default=450)
    streak = Column(Integer, default=7)
    
    # 360 Readiness Metrics (0-100)
    resume_score = Column(Integer, default=75)
    ats_score = Column(Integer, default=70)
    technical_score = Column(Integer, default=68)
    coding_score = Column(Integer, default=74)
    comm_score = Column(Integer, default=72)
    interview_score = Column(Integer, default=65)
    overall_readiness = Column(Integer, default=71)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="profile")

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    version_name = Column(String, default="Resume V1")
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    parsed_data_json = Column(Text, nullable=True) # JSON string of parsed skills, projects, etc.
    score = Column(Integer, default=75)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="resumes")

class ATSReport(Base):
    __tablename__ = "ats_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"))
    target_role = Column(String, nullable=False)
    target_company = Column(String, nullable=False)
    job_description = Column(Text, nullable=False)
    ats_score = Column(Integer, default=72)
    keyword_match_pct = Column(Integer, default=68)
    missing_keywords_json = Column(Text, nullable=True)
    weak_sections_json = Column(Text, nullable=True)
    strong_sections_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserRoadmap(Base):
    __tablename__ = "user_roadmaps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="14-Day SDE Interview Preparation Roadmap")
    target_role = Column(String, default="SDE")
    target_company = Column(String, default="Tech Giants")
    total_days = Column(Integer, default=14)
    current_day = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tasks = relationship("RoadmapTask", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapTask(Base):
    __tablename__ = "roadmap_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("user_roadmaps.id"))
    day_number = Column(Integer, nullable=False)
    category = Column(String, nullable=False) # DSA, DBMS, HR, Mock Interview, Coding
    task_title = Column(String, nullable=False)
    task_description = Column(Text, nullable=False)
    action_url = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    
    roadmap = relationship("UserRoadmap", back_populates="tasks")

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    topic = Column(String, nullable=False) # DSA, DBMS, OS, System Design, HR, Aptitude
    category = Column(String, default="Notes") # Notes, Cheat Sheet, MCQ, Video
    difficulty = Column(String, default="Medium")
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    read_time = Column(String, default="15 min")
    tags = Column(String, default="CS, Interview, Basics")

class ResourceProgress(Base):
    __tablename__ = "resource_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    resource_id = Column(Integer, ForeignKey("resources.id"))
    status = Column(String, default="not_started") # not_started, in_progress, completed
    is_bookmarked = Column(Boolean, default=False)

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, index=True)
    role = Column(String, index=True)
    round = Column(String, default="Technical")
    topic = Column(String, index=True)
    difficulty = Column(String, default="Medium")
    question_text = Column(Text, nullable=False)
    expected_concepts_json = Column(Text, nullable=True)
    sample_answer = Column(Text, nullable=False)

class CodingProblem(Base):
    __tablename__ = "coding_problems"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True)
    category = Column(String, default="Arrays")
    difficulty = Column(String, default="Medium")
    problem_statement = Column(Text, nullable=False)
    input_format = Column(Text, nullable=False)
    output_format = Column(Text, nullable=False)
    constraints = Column(Text, nullable=False)
    sample_cases_json = Column(Text, nullable=False)
    hidden_cases_json = Column(Text, nullable=False)
    templates_json = Column(Text, nullable=False)

class CodingSubmission(Base):
    __tablename__ = "coding_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("coding_problems.id"))
    code = Column(Text, nullable=False)
    language = Column(String, default="python")
    status = Column(String, default="Accepted") # Accepted, Wrong Answer, Time Limit Exceeded
    execution_time = Column(String, default="42 ms")
    memory_used = Column(String, default="14.2 MB")
    explanation_text = Column(Text, nullable=True)
    explanation_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="coding_submissions")

class MockInterview(Base):
    __tablename__ = "mock_interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company = Column(String, default="Google")
    role = Column(String, default="SDE")
    difficulty = Column(String, default="Medium")
    interview_type = Column(String, default="Technical")
    topic_focus = Column(String, default="General Technical")
    duration_minutes = Column(Integer, default=30)
    language = Column(String, default="English (US)")
    code_editor_content = Column(Text, nullable=True)
    scheduled_date = Column(String, nullable=True)
    scheduled_time = Column(String, nullable=True)
    detailed_report_json = Column(Text, nullable=True)
    overall_score = Column(Integer, default=75)
    tech_score = Column(Integer, default=72)
    comm_score = Column(Integer, default=78)
    visual_score = Column(Integer, default=80)
    feedback_json = Column(Text, nullable=True)
    strengths_json = Column(Text, nullable=True)
    weaknesses_json = Column(Text, nullable=True)
    recommendations_json = Column(Text, nullable=True)
    status = Column(String, default="Completed") # Pending, In Progress, Completed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="mock_interviews")
    transcripts = relationship("InterviewTranscript", back_populates="interview", cascade="all, delete-orphan")

class InterviewTranscript(Base):
    __tablename__ = "interview_transcripts"
    
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("mock_interviews.id"))
    speaker = Column(String, nullable=False) # AI or Student
    text = Column(Text, nullable=False)
    metrics_json = Column(Text, nullable=True) # filler words, pauses, WPM
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    interview = relationship("MockInterview", back_populates="transcripts")

class Mentor(Base):
    __tablename__ = "mentors"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    title = Column(String, default="Senior Software Engineer")
    company = Column(String, default="Google")
    experience_years = Column(Integer, default=6)
    bio = Column(Text, default="Passionate about helping students crack Tier-1 tech company interviews.")
    hourly_rate = Column(Float, default=499.0)
    rating = Column(Float, default=4.9)
    total_reviews = Column(Integer, default=34)
    skills = Column(Text, default="DSA, System Design, Resume Review, AI/ML")
    is_verified = Column(Boolean, default=True)
    
    user = relationship("User", back_populates="mentor_profile")
    bookings = relationship("MentorBooking", foreign_keys="MentorBooking.mentor_id", back_populates="mentor")

class MentorBooking(Base):
    __tablename__ = "mentor_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"))
    mentor_id = Column(Integer, ForeignKey("mentors.id"))
    session_date = Column(String, nullable=False) # YYYY-MM-DD
    session_time = Column(String, nullable=False) # HH:MM AM/PM
    duration_minutes = Column(Integer, default=45)
    session_type = Column(String, default="1-on-1 Mock Interview")
    status = Column(String, default="Confirmed") # Pending, Confirmed, Completed, Cancelled
    notes = Column(Text, nullable=True)
    meeting_link = Column(String, default="https://meet.prepverse.ai/session-room-live")
    payment_status = Column(String, default="Paid")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("User", foreign_keys=[student_id], back_populates="bookings_as_student")
    mentor = relationship("Mentor", foreign_keys=[mentor_id], back_populates="bookings")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    target_role = Column(String, default="All")
    created_at = Column(DateTime, default=datetime.utcnow)
