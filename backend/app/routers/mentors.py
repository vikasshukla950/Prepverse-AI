from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Profile, Mentor, MentorBooking, ChatMessage
from ..schemas import MentorBookingRequest, ChatMessageRequest
from .auth import get_current_user

router = APIRouter(prefix="/api/mentors", tags=["Mentor Marketplace"])

@router.get("/")
def get_mentors(
    company: Optional[str] = None,
    skill: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Mentor).filter(Mentor.is_verified == True)
    if company and company != "All":
        query = query.filter(Mentor.company == company)
    if search:
        query = query.filter(Mentor.bio.ilike(f"%{search}%") | Mentor.skills.ilike(f"%{search}%"))
        
    mentors = query.all()
    out = []
    for m in mentors:
        user = db.query(User).filter(User.id == m.user_id).first()
        out.append({
            "id": m.id,
            "name": user.full_name if user else "Senior Mentor",
            "title": m.title,
            "company": m.company,
            "experience_years": m.experience_years,
            "bio": m.bio,
            "hourly_rate": m.hourly_rate,
            "rating": m.rating,
            "total_reviews": m.total_reviews,
            "skills": m.skills.split(",") if m.skills else [],
            "is_verified": m.is_verified
        })
    return out

@router.get("/{mentor_id}")
def get_mentor_detail(mentor_id: int, db: Session = Depends(get_db)):
    m = db.query(Mentor).filter(Mentor.id == mentor_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mentor not found")
        
    user = db.query(User).filter(User.id == m.user_id).first()
    
    # Available booking slots
    available_slots = [
        {"date": "2026-08-27", "time": "10:00 AM", "available": True},
        {"date": "2026-08-27", "time": "04:00 PM", "available": True},
        {"date": "2026-08-28", "time": "11:30 AM", "available": True},
        {"date": "2026-08-28", "time": "06:00 PM", "available": True}
    ]
    
    return {
        "id": m.id,
        "name": user.full_name if user else "Senior Mentor",
        "title": m.title,
        "company": m.company,
        "experience_years": m.experience_years,
        "bio": m.bio,
        "hourly_rate": m.hourly_rate,
        "rating": m.rating,
        "total_reviews": m.total_reviews,
        "skills": m.skills.split(",") if m.skills else [],
        "available_slots": available_slots
    }

@router.post("/book")
def book_mentor_session(data: MentorBookingRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mentor = db.query(Mentor).filter(Mentor.id == data.mentor_id).first()
    if not mentor:
        raise HTTPException(status_code=404, detail="Mentor not found")
        
    # Check double booking
    existing = db.query(MentorBooking).filter(
        MentorBooking.mentor_id == data.mentor_id,
        MentorBooking.session_date == data.session_date,
        MentorBooking.session_time == data.session_time,
        MentorBooking.status.in_(["Confirmed", "Pending"])
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Selected slot is already booked. Please choose another time.")
        
    booking = MentorBooking(
        student_id=current_user.id,
        mentor_id=data.mentor_id,
        session_date=data.session_date,
        session_time=data.session_time,
        session_type=data.session_type,
        notes=data.notes,
        status="Confirmed",
        payment_status="Paid"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return {
        "message": "Mentor session booked successfully",
        "booking_id": booking.id,
        "session_date": booking.session_date,
        "session_time": booking.session_time,
        "meeting_link": booking.meeting_link
    }

@router.get("/my-sessions")
def get_my_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    bookings = db.query(MentorBooking).filter(MentorBooking.student_id == current_user.id).order_by(MentorBooking.created_at.desc()).all()
    out = []
    for b in bookings:
        m = db.query(Mentor).filter(Mentor.id == b.mentor_id).first()
        m_user = db.query(User).filter(User.id == m.user_id).first() if m else None
        out.append({
            "id": b.id,
            "mentor_name": m_user.full_name if m_user else "Expert Mentor",
            "mentor_company": m.company if m else "Tech Leader",
            "session_type": b.session_type,
            "session_date": b.session_date,
            "session_time": b.session_time,
            "status": b.status,
            "meeting_link": b.meeting_link
        })
    return out

@router.post("/chat/send")
def send_chat_message(data: ChatMessageRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    msg = ChatMessage(
        sender_id=current_user.id,
        receiver_id=data.receiver_id,
        message=data.message
    )
    db.add(msg)
    db.commit()
    return {"message": "Sent", "id": msg.id}

@router.get("/chat/{other_user_id}")
def get_chat_history(other_user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    msgs = db.query(ChatMessage).filter(
        ((ChatMessage.sender_id == current_user.id) & (ChatMessage.receiver_id == other_user_id)) |
        ((ChatMessage.sender_id == other_user_id) & (ChatMessage.receiver_id == current_user.id))
    ).order_by(ChatMessage.created_at.asc()).all()
    
    out = []
    for m in msgs:
        out.append({
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "message": m.message,
            "created_at": m.created_at.strftime("%H:%M")
        })
    return out
