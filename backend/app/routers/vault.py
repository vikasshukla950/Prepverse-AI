from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Resource, ResourceProgress
from .auth import get_current_user

router = APIRouter(prefix="/api/vault", tags=["Material Vault"])

@router.get("/resources")
def search_resources(
    topic: Optional[str] = None,
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Resource)
    if topic:
        query = query.filter(Resource.topic == topic)
    if category:
        query = query.filter(Resource.category == category)
    if difficulty:
        query = query.filter(Resource.difficulty == difficulty)
    if search:
        query = query.filter(Resource.title.ilike(f"%{search}%") | Resource.summary.ilike(f"%{search}%"))
        
    resources = query.all()
    
    # Fetch user progress
    user_progress = {
        rp.resource_id: rp 
        for rp in db.query(ResourceProgress).filter(ResourceProgress.user_id == current_user.id).all()
    }
    
    out = []
    for r in resources:
        prog = user_progress.get(r.id)
        out.append({
            "id": r.id,
            "title": r.title,
            "topic": r.topic,
            "category": r.category,
            "difficulty": r.difficulty,
            "summary": r.summary,
            "content": r.content,
            "read_time": r.read_time,
            "tags": r.tags.split(",") if r.tags else [],
            "status": prog.status if prog else "not_started",
            "is_bookmarked": prog.is_bookmarked if prog else False
        })
        
    return out

@router.post("/resources/{resource_id}/progress")
def update_resource_progress(
    resource_id: int,
    status: Optional[str] = None,
    is_bookmarked: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prog = db.query(ResourceProgress).filter(
        ResourceProgress.user_id == current_user.id,
        ResourceProgress.resource_id == resource_id
    ).first()
    
    if not prog:
        prog = ResourceProgress(user_id=current_user.id, resource_id=resource_id)
        db.add(prog)
        
    if status is not None:
        prog.status = status
    if is_bookmarked is not None:
        prog.is_bookmarked = is_bookmarked
        
    db.commit()
    return {"message": "Resource status updated", "status": prog.status, "is_bookmarked": prog.is_bookmarked}
