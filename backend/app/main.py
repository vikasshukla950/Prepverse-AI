from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .seed import seed_database
from .routers import (
    auth, student, resume_ats, ai_coach, roadmap, 
    vault, questions, coding, interview, mentors, readiness, admin
)

app = FastAPI(
    title="PrepVerse AI - Core Backend API",
    description="Intelligent platform for end-to-end tech interview preparation & career readiness.",
    version="1.0.0"
)

# CORS configuration for Frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_database()

# Include Routers
app.include_router(auth.router)
app.include_router(student.router)
app.include_router(resume_ats.router)
app.include_router(ai_coach.router)
app.include_router(roadmap.router)
app.include_router(vault.router)
app.include_router(questions.router)
app.include_router(coding.router)
app.include_router(interview.router)
app.include_router(mentors.router)
app.include_router(readiness.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "PrepVerse AI Backend API",
        "tagline": "From Resume Gaps to Interview-Ready.",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
