from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, Profile
from ..schemas import CoachQueryRequest
from ..services.ai_service import ai_service
from .auth import get_current_user

router = APIRouter(prefix="/api/coach", tags=["AI Coach"])

@router.post("/query")
def ask_coach(data: CoachQueryRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    profile_data = {
        "target_role": profile.target_role if profile else "SDE",
        "target_company": profile.target_company if profile else "Google",
        "overall_readiness": profile.overall_readiness if profile else 70,
        "technical_score": profile.technical_score if profile else 68,
        "coding_score": profile.coding_score if profile else 74,
        "comm_score": profile.comm_score if profile else 72,
        "ats_score": profile.ats_score if profile else 70
    }
    
    reply = ai_service.ask_career_coach(data.message, profile_data)
    return {"reply": reply}
