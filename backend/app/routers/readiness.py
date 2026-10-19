import io
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from ..database import get_db
from ..models import User, Profile
from .auth import get_current_user

router = APIRouter(prefix="/api/readiness", tags=["360 Readiness Analytics"])

@router.get("/360")
def get_360_readiness(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        
    readiness_breakdown = [
        {"pillar": "Resume Quality", "score": profile.resume_score, "status": "Strong", "weight": "15%"},
        {"pillar": "ATS Optimization", "score": profile.ats_score, "status": "Good", "weight": "15%"},
        {"pillar": "Technical & Core CS", "score": profile.technical_score, "status": "Needs Review", "weight": "20%"},
        {"pillar": "Coding IDE Performance", "score": profile.coding_score, "status": "Strong", "weight": "20%"},
        {"pillar": "Communication & Fluency", "score": profile.comm_score, "status": "Good", "weight": "15%"},
        {"pillar": "Mock Interview Arena", "score": profile.interview_score, "status": "Moderate", "weight": "15%"}
    ]
    
    recommendations = [
        {"area": "DBMS Normalization", "why": "Score is 15% below target threshold.", "action": "Complete DBMS Cheat Sheet & 10 Practice MCQs", "url": "/vault"},
        {"area": "Resume ATS Match", "why": "Missing keywords: Microservices, Redis, CI/CD", "action": "Re-run ATS Optimizer with target Job Description", "url": "/ats"},
        {"area": "System Design Communication", "why": "Long pauses observed during live mock interviews.", "action": "Record a 15-min System Design Mock Interview", "url": "/arena"}
    ]
    
    return {
        "user_name": current_user.full_name,
        "target_role": profile.target_role,
        "target_company": profile.target_company,
        "overall_score": profile.overall_readiness,
        "status_label": "Strongly Prepared" if profile.overall_readiness >= 80 else ("Almost Ready" if profile.overall_readiness >= 70 else "Needs Improvement"),
        "breakdown": readiness_breakdown,
        "recommendations": recommendations
    }

@router.get("/pdf-report")
def export_pdf_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    # Header
    p.setFont("Helvetica-Bold", 20)
    p.drawString(50, 750, "PREPVERSE AI - 360° CAREER READINESS REPORT")
    p.setFont("Helvetica", 11)
    p.drawString(50, 730, "Tagline: From Resume Gaps to Interview-Ready")
    p.line(50, 715, 550, 715)
    
    # Candidate Summary
    p.setFont("Helvetica-Bold", 14)
    p.drawString(50, 685, f"Student: {current_user.full_name}")
    p.setFont("Helvetica", 11)
    p.drawString(50, 665, f"Target Role: {profile.target_role if profile else 'SDE'}")
    p.drawString(50, 650, f"Target Company: {profile.target_company if profile else 'Google'}")
    p.drawString(50, 635, f"Overall Readiness Index: {profile.overall_readiness if profile else 71}/100")
    
    # Pillar Scores
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, 595, "PILLAR SCORE BREAKDOWN:")
    p.setFont("Helvetica", 10)
    scores = [
        f"• Resume Score: {profile.resume_score}/100",
        f"• ATS Score: {profile.ats_score}/100",
        f"• Technical & Core CS Score: {profile.technical_score}/100",
        f"• Coding Score: {profile.coding_score}/100",
        f"• Communication Score: {profile.comm_score}/100",
        f"• AI Mock Interview Score: {profile.interview_score}/100",
    ] if profile else []
    
    y = 575
    for s in scores:
        p.drawString(70, y, s)
        y -= 18
        
    p.line(50, y - 10, 550, y - 10)
    p.setFont("Helvetica-Bold", 12)
    p.drawString(50, y - 35, "KEY RECOMMENDATIONS & NEXT STEPS:")
    p.setFont("Helvetica", 10)
    p.drawString(70, y - 55, "1. Focus on DBMS Indexing & Normalization in Material Vault.")
    p.drawString(70, y - 72, "2. Add quantifiable metrics to resume project descriptions for higher ATS match.")
    p.drawString(70, y - 89, "3. Take 1 AI Mock Interview per week to reduce speech hesitation markers.")
    
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=prepverse_360_readiness_report.pdf"})
