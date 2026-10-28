import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import User, Profile, MockInterview, InterviewTranscript
from ..schemas import InterviewSetupRequest, InterviewAnswerRequest
from ..services.ai_service import ai_service
from ..services.speech_service import speech_service
from ..services.vision_service import vision_service
from .auth import get_current_user

router = APIRouter(prefix="/api/interview", tags=["Interview Arena"])

ROUND_DEFINITIONS = [
    {
        "round": 1,
        "title": "Candidate Introduction & Background",
        "focus": "Communication clarity, personal introduction, and tech stack overview"
    },
    {
        "round": 2,
        "title": "System Architecture & Technical Depth",
        "focus": "Component boundaries, data flow, API design, and trade-offs"
    },
    {
        "round": 3,
        "title": "Scalability, Concurrency & Edge Cases",
        "focus": "10x traffic spikes, database replication, caching, and fault tolerance"
    },
    {
        "round": 4,
        "title": "Behavioral Leadership & Conflict Resolution (STAR)",
        "focus": "Technical disagreements, deadline pressure, and engineering ownership"
    },
    {
        "round": 5,
        "title": "Technical Retrospective & Candidate Questions",
        "focus": "System redesign reflections, self-critique, and candidate inquiry"
    }
]

@router.post("/setup")
def setup_interview(data: InterviewSetupRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    company = data.company or "Google"
    role = data.role or "Software Development Engineer (SDE)"
    topic_focus = getattr(data, "topic_focus", None) or "System Design & Distributed Systems"
    
    interview = MockInterview(
        user_id=current_user.id,
        company=company,
        role=role,
        difficulty=data.difficulty or "Medium",
        interview_type=data.interview_type or "Technical",
        topic_focus=topic_focus,
        duration_minutes=getattr(data, "duration_minutes", 30) or 30,
        language=getattr(data, "language", "English (US)") or "English (US)",
        status="In Progress"
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)
    
    # First AI Interviewer Question - Classic warm-up starting with "Tell me about yourself"
    first_q = (
        f"Hello and welcome! I am your AI Interviewer today for the {role} role at {company}. "
        f"To get started, please tell me something about yourself, your technical background, and a key software project you are proud of."
    )
    
    transcript = InterviewTranscript(
        interview_id=interview.id,
        speaker="AI Interviewer",
        text=first_q
    )
    db.add(transcript)
    db.commit()
    
    return {
        "interview_id": interview.id,
        "company": company,
        "role": role,
        "difficulty": interview.difficulty,
        "topic_focus": topic_focus,
        "current_round": 1,
        "total_rounds": 5,
        "round_title": ROUND_DEFINITIONS[0]["title"],
        "first_question": first_q
    }

@router.post("/answer")
def submit_interview_answer(data: InterviewAnswerRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == data.interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")
        
    duration = data.audio_duration_seconds if data.audio_duration_seconds and data.audio_duration_seconds > 0 else 30.0
    speech_metrics = speech_service.analyze_speech(data.answer_text, duration_seconds=duration)
    vision_metrics = vision_service.analyze_frame_metrics(camera_active=True)
    
    # If client passed audio_metrics, merge them
    if data.audio_metrics:
        speech_metrics.update(data.audio_metrics)
    
    st_transcript = InterviewTranscript(
        interview_id=interview.id,
        speaker="Student",
        text=data.answer_text,
        metrics_json=json.dumps({"speech": speech_metrics, "vision": vision_metrics})
    )
    db.add(st_transcript)
    db.commit()
    
    # Check turns count for structured progression
    student_turns = db.query(InterviewTranscript).filter(
        InterviewTranscript.interview_id == interview.id,
        InterviewTranscript.speaker == "Student"
    ).all()
    turn_num = len(student_turns)
    
    # History for AI evaluation
    all_transcripts = db.query(InterviewTranscript).filter(
        InterviewTranscript.interview_id == interview.id
    ).order_by(InterviewTranscript.id.asc()).all()
    
    history = [{"speaker": t.speaker, "text": t.text} for t in all_transcripts]
    
    eval_res = ai_service.evaluate_interview_turn(
        history=history,
        company=interview.company,
        role=interview.role,
        interview_type=interview.interview_type,
        topic_focus=getattr(interview, "topic_focus", "System Design") or "System Design",
        difficulty=interview.difficulty or "Medium",
        current_question=data.question_text,
        answer=data.answer_text,
        code_context=data.editor_code,
        language=data.language or "python"
    )
    
    # Progressive multi-question conversation design
    company = interview.company
    role = interview.role
    ans_lower = data.answer_text.lower()
    ai_generated = eval_res.get("follow_up_question", "")

    if turn_num == 1:
        # Move to Round 2: Technical Architecture & Deep Dive
        round_info = ROUND_DEFINITIONS[1]
        if ai_generated and len(ai_generated) > 20 and not ai_generated.startswith("Interesting"):
            next_question = f"Thanks for that introduction! {ai_generated}"
        else:
            tech_match = "your stack"
            for t in ["react", "fastapi", "python", "node", "java", "golang", "docker", "aws", "postgresql", "mongodb"]:
                if t in ans_lower:
                    tech_match = t.capitalize()
                    break
            next_question = (
                f"Thank you for sharing your background. You mentioned working with {tech_match}. "
                f"Could you walk me through the end-to-end architecture of that project? "
                f"Specifically, how did you decouple services, design the data models, and ensure API responsiveness?"
            )
    elif turn_num == 2:
        # Move to Round 3: Scalability, Concurrency & Edge Cases
        round_info = ROUND_DEFINITIONS[2]
        if ai_generated and ("concurr" in ai_generated.lower() or "cache" in ai_generated.lower() or "spike" in ai_generated.lower()):
            next_question = ai_generated
        else:
            next_question = (
                f"That architectural explanation is very clear. Now, imagine this service is deployed at {company} scale "
                f"and experiences a 10x traffic spike during a flash event or peak load. "
                f"Where would the primary bottleneck emerge first, and how would you implement caching, database read-replicas, or rate-limiting to prevent service degradation?"
            )
    elif turn_num == 3:
        # Move to Round 4: Behavioral Leadership (STAR Method)
        round_info = ROUND_DEFINITIONS[3]
        next_question = (
            f"Solid technical breakdown on handling high concurrency. At {company}, technical capability goes hand-in-hand with collaborative ownership. "
            f"Can you tell me about a time you faced a difficult technical disagreement or conflicting deadline with a teammate or stakeholder? "
            f"Using the STAR method, what was the situation, your specific action, and the outcome?"
        )
    elif turn_num == 4:
        # Move to Round 5: Technical Retrospective & Candidate Questions
        round_info = ROUND_DEFINITIONS[4]
        next_question = (
            f"That shows great perspective on team communication. As our final round before concluding: "
            f"Looking back at the architecture you designed, what is one technical trade-off or technology choice you would rethink today? "
            f"Also, what questions do you have for me regarding engineering culture and tech challenges at {company}?"
        )
    else:
        # All 5 rounds completed
        round_info = {
            "round": 5,
            "title": "Interview Completed",
            "focus": "All questions completed. Proceed to performance report."
        }
        next_question = (
            f"Thank you for completing this comprehensive mock interview for {company} {role}! "
            f"I have recorded all your spoken responses, audio WPM pacing, filler word metrics, and technical answers. "
            f"Please click 'End Interview & Generate Report' to view your complete 360° readiness score and actionable feedback."
        )

    # Save AI Interviewer follow-up transcript
    ai_transcript = InterviewTranscript(
        interview_id=interview.id,
        speaker="AI Interviewer",
        text=next_question
    )
    db.add(ai_transcript)
    db.commit()
    
    return {
        "evaluation": eval_res,
        "speech_metrics": speech_metrics,
        "vision_metrics": vision_metrics,
        "next_question": next_question,
        "current_round": min(turn_num + 1, 5),
        "total_rounds": 5,
        "round_title": round_info["title"],
        "is_final_round": turn_num >= 5
    }

@router.post("/{interview_id}/end")
def end_interview(interview_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")
        
    raw_transcripts = db.query(InterviewTranscript).filter(
        InterviewTranscript.interview_id == interview.id
    ).order_by(InterviewTranscript.id.asc()).all()
    
    parsed_transcripts = []
    for t in raw_transcripts:
        parsed_transcripts.append({
            "speaker": t.speaker,
            "text": t.text,
            "metrics": json.loads(t.metrics_json) if t.metrics_json else None
        })

    # Generate comprehensive, evidence-based performance report
    report = ai_service.generate_comprehensive_interview_report(
        interview=interview,
        transcripts=parsed_transcripts,
        code_snippet=getattr(interview, "code_editor_content", None)
    )

    interview.status = "Completed"
    interview.overall_score = report.get("overall_score", 78)
    interview.tech_score = report.get("tech_score", 76)
    interview.comm_score = report.get("comm_score", 80)
    interview.visual_score = report.get("visual_score", 85)
    
    feedback = {
        "overall_summary": f"Structured interview completion across {report.get('turn_count', 0)} rounds with average {report.get('average_wpm', 134)} WPM cadence.",
        "strengths": report.get("strengths", []),
        "weaknesses": report.get("weaknesses", []),
        "recommendations": report.get("recommendations", [])
    }
    
    interview.feedback_json = json.dumps(feedback)
    interview.strengths_json = json.dumps(report.get("strengths", []))
    interview.weaknesses_json = json.dumps(report.get("weaknesses", []))
    interview.recommendations_json = json.dumps(report.get("recommendations", []))
    interview.detailed_report_json = json.dumps(report)
    
    # Update profile readiness scores
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile:
        profile.interview_score = interview.overall_score
        profile.comm_score = interview.comm_score
        profile.technical_score = max(profile.technical_score or 70, interview.tech_score)
        profile.overall_readiness = (
            (profile.resume_score or 75) + 
            (profile.ats_score or 75) + 
            (profile.technical_score or 75) + 
            (profile.coding_score or 75) + 
            (profile.comm_score or 75) + 
            (profile.interview_score or 75)
        ) // 6
        
    db.commit()
    return {
        "message": "Interview ended", 
        "overall_score": interview.overall_score, 
        "report_id": interview.id,
        "report": report
    }

@router.get("/report/{interview_id}")
def get_interview_report(interview_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    interview = db.query(MockInterview).filter(MockInterview.id == interview_id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview report not found")
        
    transcripts = db.query(InterviewTranscript).filter(InterviewTranscript.interview_id == interview.id).order_by(InterviewTranscript.id.asc()).all()
    
    parsed_transcripts = []
    for t in transcripts:
        parsed_transcripts.append({
            "speaker": t.speaker,
            "text": t.text,
            "metrics": json.loads(t.metrics_json) if t.metrics_json else None
        })
        
    return {
        "id": interview.id,
        "company": interview.company,
        "role": interview.role,
        "interview_type": interview.interview_type,
        "difficulty": interview.difficulty,
        "topic_focus": getattr(interview, "topic_focus", "General Technical"),
        "overall_score": interview.overall_score,
        "tech_score": interview.tech_score,
        "comm_score": interview.comm_score,
        "visual_score": interview.visual_score,
        "strengths": json.loads(interview.strengths_json) if interview.strengths_json else [],
        "weaknesses": json.loads(interview.weaknesses_json) if interview.weaknesses_json else [],
        "recommendations": json.loads(interview.recommendations_json) if interview.recommendations_json else [],
        "detailed_report": json.loads(interview.detailed_report_json) if getattr(interview, "detailed_report_json", None) else None,
        "transcripts": parsed_transcripts
    }

@router.get("/history")
def get_interview_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    interviews = db.query(MockInterview).filter(MockInterview.user_id == current_user.id).order_by(MockInterview.created_at.desc()).all()
    out = []
    for i in interviews:
        out.append({
            "id": i.id,
            "company": i.company,
            "role": i.role,
            "interview_type": i.interview_type,
            "overall_score": i.overall_score,
            "status": i.status,
            "date": i.created_at.strftime("%b %d, %Y")
        })
    return out
