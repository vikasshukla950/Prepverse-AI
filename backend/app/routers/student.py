from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, Profile, UserRoadmap, RoadmapTask
from ..schemas import OnboardingRequest, ProfileUpdate, ProfileResponse
from .auth import get_current_user

router = APIRouter(prefix="/api/student", tags=["Student"])

@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return ProfileResponse(
        user_id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role,
        college=profile.college,
        degree=profile.degree,
        branch=profile.branch,
        grad_year=profile.grad_year,
        skills=profile.skills,
        target_role=profile.target_role,
        target_company=profile.target_company,
        prep_time=profile.prep_time,
        xp=profile.xp,
        streak=profile.streak,
        resume_score=profile.resume_score,
        ats_score=profile.ats_score,
        technical_score=profile.technical_score,
        coding_score=profile.coding_score,
        comm_score=profile.comm_score,
        interview_score=profile.interview_score,
        overall_readiness=profile.overall_readiness
    )

@router.post("/onboarding")
def complete_onboarding(data: OnboardingRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.full_name = data.full_name
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        
    profile.college = data.college
    profile.degree = data.degree
    profile.branch = data.branch
    profile.grad_year = data.grad_year
    profile.skills = ", ".join(data.skills)
    profile.target_role = data.target_role
    profile.target_company = data.target_company
    profile.prep_time = data.prep_time
    
    db.commit()
    
    # Auto-generate Initial Career Readiness Profile & Roadmap
    roadmap = UserRoadmap(
        user_id=current_user.id,
        title=f"14-Day {data.target_role} Preparation Roadmap",
        target_role=data.target_role,
        target_company=data.target_company,
        total_days=14,
        current_day=1
    )
    db.add(roadmap)
    db.commit()
    db.refresh(roadmap)
    
    # Add initial roadmap tasks
    default_tasks = [
        {"day": 1, "category": "DSA", "title": "Solve 2 Array Problems", "desc": "Focus on Two Pointer & Sliding Window patterns.", "url": "/coding"},
        {"day": 1, "category": "DBMS", "title": "Revise DBMS Indexing & Joins", "desc": "Study index optimization & inner/outer join mechanics.", "url": "/vault"},
        {"day": 1, "category": "HR", "title": "Practice 5 STAR HR Questions", "desc": "Structure answers for 'Tell me about a challenge'.", "url": "/questions"},
        {"day": 1, "category": "Mock Interview", "title": "Complete 10-Min AI Mock Interview", "desc": "Assess baseline communication & technical cadence.", "url": "/arena"}
    ]
    for t in default_tasks:
        task = RoadmapTask(
            roadmap_id=roadmap.id,
            day_number=t["day"],
            category=t["category"],
            task_title=t["title"],
            task_description=t["desc"],
            action_url=t["url"]
        )
        db.add(task)
    db.commit()
    
    return {"message": "Onboarding completed successfully", "overall_readiness": profile.overall_readiness}

@router.get("/dashboard-data")
def get_dashboard_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        
    roadmap = db.query(UserRoadmap).filter(UserRoadmap.user_id == current_user.id).first()
    today_tasks = []
    if roadmap:
        tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == roadmap.id, RoadmapTask.day_number == roadmap.current_day).all()
        for task in tasks:
            today_tasks.append({
                "id": task.id,
                "category": task.category,
                "title": task.task_title,
                "description": task.task_description,
                "action_url": task.action_url,
                "is_completed": task.is_completed
            })
            
    # Weak areas heatmap
    weak_areas = [
        {"topic": "DBMS & SQL", "score": profile.technical_score - 15, "status": "Needs Attention", "action": "Study DBMS Cheat Sheet"},
        {"topic": "Communication & Fluency", "score": profile.comm_score - 8, "status": "Moderate", "action": "Practice Voice Mock"},
        {"topic": "Data Structures & Algo", "score": profile.coding_score, "status": "Strong", "action": "Solve Hard Dynamic Programming"}
    ]
    
    return {
        "user_name": current_user.full_name,
        "target_role": profile.target_role,
        "target_company": profile.target_company,
        "streak": profile.streak,
        "xp": profile.xp,
        "overall_readiness": profile.overall_readiness,
        "scores": {
            "resume": profile.resume_score,
            "ats": profile.ats_score,
            "technical": profile.technical_score,
            "coding": profile.coding_score,
            "communication": profile.comm_score,
            "interview": profile.interview_score
        },
        "today_tasks": today_tasks,
        "weak_areas": weak_areas
    }
