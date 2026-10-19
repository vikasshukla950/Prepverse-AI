import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Profile, Resume, ATSReport
from ..schemas import ATSAnalysisRequest
from ..services.ai_service import ai_service
from .auth import get_current_user

router = APIRouter(prefix="/api/resume-ats", tags=["Resume & ATS"])

@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    version_name: Optional[str] = Form("Resume V1"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    if not text:
        text = "Software Engineer Candidate with experience in Python, FastAPI, React, SQL, AWS, and Microservices."
        
    parsed = ai_service.parse_resume(text)
    
    # Save resume
    resume = Resume(
        user_id=current_user.id,
        version_name=version_name,
        file_name=file.filename,
        file_path=f"/uploads/{file.filename}",
        parsed_data_json=json.dumps(parsed),
        score=parsed["score"]
    )
    db.add(resume)
    
    # Update profile resume score
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.resume_score = parsed["score"]
        # Update overall readiness average
        profile.overall_readiness = (profile.resume_score + profile.ats_score + profile.technical_score + profile.coding_score + profile.comm_score + profile.interview_score) // 6
        
    db.commit()
    db.refresh(resume)
    
    return {
        "message": "Resume parsed successfully",
        "resume_id": resume.id,
        "version_name": resume.version_name,
        "score": resume.score,
        "parsed_data": parsed
    }

@router.get("/versions")
def get_resume_versions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).all()
    out = []
    for r in resumes:
        out.append({
            "id": r.id,
            "version_name": r.version_name,
            "file_name": r.file_name,
            "score": r.score,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M"),
            "parsed_data": json.loads(r.parsed_data_json) if r.parsed_data_json else {}
        })
    return out

@router.post("/analyze-ats")
def analyze_ats(data: ATSAnalysisRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume_text = data.resume_text or "Python FastAPI React SQL AWS Docker Microservices Developer"
    analysis = ai_service.analyze_ats(resume_text, data.job_description, data.target_company, data.target_role)
    
    report = ATSReport(
        user_id=current_user.id,
        target_role=data.target_role,
        target_company=data.target_company,
        job_description=data.job_description,
        ats_score=analysis["ats_score"],
        keyword_match_pct=analysis["keyword_match_pct"],
        missing_keywords_json=json.dumps(analysis["missing_keywords"]),
        weak_sections_json=json.dumps(analysis["weak_sections"]),
        strong_sections_json=json.dumps(analysis["strong_sections"]),
        recommendations_json=json.dumps(analysis["recommendations"])
    )
    db.add(report)
    
    # Update profile ATS score
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.ats_score = analysis["ats_score"]
        profile.overall_readiness = (profile.resume_score + profile.ats_score + profile.technical_score + profile.coding_score + profile.comm_score + profile.interview_score) // 6
        
    db.commit()
    
    return {
        "ats_score": analysis["ats_score"],
        "keyword_match_pct": analysis["keyword_match_pct"],
        "missing_keywords": analysis["missing_keywords"],
        "weak_sections": analysis["weak_sections"],
        "strong_sections": analysis["strong_sections"],
        "recommendations": analysis["recommendations"]
    }

@router.get("/resume-questions")
def get_resume_questions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Signature Feature: Resume -> Interview Engine question generation."""
    latest_resume = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()).first()
    skills = ["React", "FastAPI", "Python", "SQL"]
    projects = []
    if latest_resume and latest_resume.parsed_data_json:
        parsed = json.loads(latest_resume.parsed_data_json)
        skills = parsed.get("skills", skills)
        projects = parsed.get("projects", projects)
        
    questions = ai_service.generate_resume_questions(skills, projects)
    return {"generated_questions": questions}
