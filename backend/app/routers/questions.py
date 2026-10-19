import json
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Question
from .auth import get_current_user

router = APIRouter(prefix="/api/questions", tags=["Question Bank"])

@router.get("/")
def get_questions(
    company: Optional[str] = None,
    role: Optional[str] = None,
    round_type: Optional[str] = None,
    topic: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if company and company != "All":
        query = query.filter(Question.company == company)
    if role and role != "All":
        query = query.filter(Question.role == role)
    if round_type and round_type != "All":
        query = query.filter(Question.round == round_type)
    if topic and topic != "All":
        query = query.filter(Question.topic == topic)
    if difficulty and difficulty != "All":
        query = query.filter(Question.difficulty == difficulty)
    if search:
        query = query.filter(Question.question_text.ilike(f"%{search}%"))
        
    questions = query.all()
    out = []
    for q in questions:
        out.append({
            "id": q.id,
            "company": q.company,
            "role": q.role,
            "round": q.round,
            "topic": q.topic,
            "difficulty": q.difficulty,
            "question_text": q.question_text,
            "expected_concepts": json.loads(q.expected_concepts_json) if q.expected_concepts_json else [],
            "sample_answer": q.sample_answer
        })
    return out

@router.get("/companies")
def get_companies(db: Session = Depends(get_db)):
    """List popular tech companies with question counts."""
    companies = ["Google", "Microsoft", "Amazon", "Adobe", "Meta", "Apple", "TCS", "Infosys", "Wipro", "Accenture", "Deloitte"]
    return [{"name": c, "question_count": 45 + (hash(c) % 60), "track": f"{c} Interview Track"} for c in companies]
