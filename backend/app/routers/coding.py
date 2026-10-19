import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Profile, CodingProblem, CodingSubmission
from ..schemas import CodeRunRequest, CodeSubmitRequest, SolutionExplanationRequest
from ..services.judge_service import judge_service
from ..services.ai_service import ai_service
from .auth import get_current_user

router = APIRouter(prefix="/api/coding", tags=["Coding Practice"])

@router.get("/problems")
def get_problems(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CodingProblem)
    if category and category != "All":
        query = query.filter(CodingProblem.category == category)
    if difficulty and difficulty != "All":
        query = query.filter(CodingProblem.difficulty == difficulty)
        
    problems = query.all()
    out = []
    for p in problems:
        out.append({
            "id": p.id,
            "title": p.title,
            "slug": p.slug,
            "category": p.category,
            "difficulty": p.difficulty,
            "summary": p.problem_statement[:120] + "..."
        })
    return out

@router.get("/problems/{problem_id}")
def get_problem_detail(problem_id: int, db: Session = Depends(get_db)):
    problem = db.query(CodingProblem).filter(CodingProblem.id == problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Coding problem not found")
        
    return {
        "id": problem.id,
        "title": problem.title,
        "slug": problem.slug,
        "category": problem.category,
        "difficulty": problem.difficulty,
        "problem_statement": problem.problem_statement,
        "input_format": problem.input_format,
        "output_format": problem.output_format,
        "constraints": problem.constraints,
        "sample_cases": json.loads(problem.sample_cases_json) if problem.sample_cases_json else [],
        "templates": json.loads(problem.templates_json) if problem.templates_json else {}
    }

@router.post("/run")
def run_code(data: CodeRunRequest, current_user: User = Depends(get_current_user)):
    result = judge_service.execute_code(data.code, data.language)
    return result

@router.post("/submit")
def submit_code(data: CodeSubmitRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    problem = db.query(CodingProblem).filter(CodingProblem.id == data.problem_id).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
        
    sample_cases = json.loads(problem.sample_cases_json) if problem.sample_cases_json else []
    result = judge_service.execute_code(data.code, data.language, sample_cases)
    
    submission = CodingSubmission(
        user_id=current_user.id,
        problem_id=problem.id,
        code=data.code,
        language=data.language,
        status=result["status"],
        execution_time=result["execution_time"],
        memory_used=result["memory_used"]
    )
    db.add(submission)
    
    # Give XP & update profile coding score if passed
    if result["status"] == "Accepted":
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        if profile:
            profile.xp += 50
            profile.coding_score = min(profile.coding_score + 2, 98)
            profile.overall_readiness = (profile.resume_score + profile.ats_score + profile.technical_score + profile.coding_score + profile.comm_score + profile.interview_score) // 6
            
    db.commit()
    db.refresh(submission)
    
    return {
        "submission_id": submission.id,
        "status": result["status"],
        "passed_count": result["passed_count"],
        "total_count": result["total_count"],
        "execution_time": result["execution_time"],
        "memory_used": result["memory_used"],
        "prompt_explanation": True # Signature trigger to show "Explain your solution like sitting in an interview"
    }

@router.post("/explain-solution")
def evaluate_explanation(data: SolutionExplanationRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Signature Feature: Evaluate candidate's verbal/text explanation of their solution."""
    submission = db.query(CodingSubmission).filter(CodingSubmission.id == data.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    problem = db.query(CodingProblem).filter(CodingProblem.id == submission.problem_id).first()
    eval_result = ai_service.evaluate_solution_explanation(
        problem_title=problem.title if problem else "Coding Problem",
        code=submission.code,
        explanation=data.explanation_text
    )
    
    submission.explanation_text = data.explanation_text
    submission.explanation_score = eval_result["explanation_score"]
    
    # Boost communication score
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.comm_score = min(profile.comm_score + 1, 98)
        profile.overall_readiness = (profile.resume_score + profile.ats_score + profile.technical_score + profile.coding_score + profile.comm_score + profile.interview_score) // 6
        
    db.commit()
    return eval_result
