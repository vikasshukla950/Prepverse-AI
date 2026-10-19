import json
import hashlib
from datetime import datetime
from .database import engine, SessionLocal, Base
from .models import (
    User, Profile, Resume, ATSReport, UserRoadmap, RoadmapTask, Resource, 
    Question, CodingProblem, MockInterview, InterviewTranscript, Mentor, 
    MentorBooking, Announcement
)
from .config import settings
from .seed_coding_problems import get_coding_problems_seed
from .seed_questions import get_questions_seed
from .seed_vault import get_vault_resources_seed

def get_password_hash(password: str) -> str:
    return hashlib.sha256((password + settings.SECRET_KEY).encode("utf-8")).hexdigest()

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Create or Verify Demo Users
    hashed_pwd = get_password_hash("password123")
    
    student_user = db.query(User).filter(User.email == "student@prepverse.ai").first()
    if not student_user:
        student_user = User(
            email="student@prepverse.ai",
            hashed_password=hashed_pwd,
            full_name="Alex Rivera",
            role="student"
        )
        db.add(student_user)
        db.commit()
        db.refresh(student_user)

    mentor_user = db.query(User).filter(User.email == "mentor@prepverse.ai").first()
    if not mentor_user:
        mentor_user = User(
            email="mentor@prepverse.ai",
            hashed_password=hashed_pwd,
            full_name="Sarah Chen",
            role="mentor"
        )
        db.add(mentor_user)

    admin_user = db.query(User).filter(User.email == "admin@prepverse.ai").first()
    if not admin_user:
        admin_user = User(
            email="admin@prepverse.ai",
            hashed_password=hashed_pwd,
            full_name="PrepVerse Admin",
            role="admin"
        )
        db.add(admin_user)

    placement_user = db.query(User).filter(User.email == "placement@prepverse.ai").first()
    if not placement_user:
        placement_user = User(
            email="placement@prepverse.ai",
            hashed_password=hashed_pwd,
            full_name="Placement Cell Officer",
            role="placement_cell"
        )
        db.add(placement_user)
    db.commit()

    # 2. Student Profile
    profile = db.query(Profile).filter(Profile.user_id == student_user.id).first()
    if not profile:
        profile = Profile(
            user_id=student_user.id,
            college="IIT Delhi / Tech University",
            degree="B.Tech Computer Science & Engineering",
            branch="Computer Science",
            grad_year=2025,
            skills="Python, Java, React, Next.js, SQL, Data Structures, FastAPI, Docker",
            target_role="Software Development Engineer (SDE)",
            target_company="Google",
            prep_time="2-3 hours / day",
            xp=1850,
            streak=14,
            resume_score=84,
            ats_score=78,
            technical_score=76,
            coding_score=82,
            comm_score=75,
            interview_score=79,
            overall_readiness=79
        )
        db.add(profile)
        db.commit()

    # 3. Seed Multiple Expert Mentors
    mentors_catalog = [
        {
            "email": "sarah.chen@prepverse.ai",
            "name": "Sarah Chen",
            "title": "Staff Software Engineer",
            "company": "Google",
            "experience_years": 8,
            "bio": "100+ interviews conducted at Google & Meta. Helping students master DSA, System Design, and behavioral STAR interviews.",
            "hourly_rate": 799.0,
            "rating": 4.96,
            "total_reviews": 64,
            "skills": "System Design, DSA, Resume Review, Google Strategy",
            "is_verified": True
        },
        {
            "email": "marcus.vance@prepverse.ai",
            "name": "Marcus Vance",
            "title": "Principal Engineer",
            "company": "Amazon",
            "experience_years": 11,
            "bio": "Specializing in Distributed Systems, System Architecture, AWS Microservices, and Amazon Leadership Principles interviews.",
            "hourly_rate": 899.0,
            "rating": 4.92,
            "total_reviews": 88,
            "skills": "System Design, Distributed Systems, Amazon LPs, Microservices",
            "is_verified": True
        },
        {
            "email": "priya.nair@prepverse.ai",
            "name": "Priya Nair",
            "title": "Senior Staff Architect",
            "company": "Microsoft",
            "experience_years": 9,
            "bio": "Azure Cloud & Distributed Systems specialist. Former campus placement panelist with 120+ mock sessions.",
            "hourly_rate": 749.0,
            "rating": 4.94,
            "total_reviews": 51,
            "skills": "Cloud Systems, C#, Azure, Core CS & Concurrency",
            "is_verified": True
        },
        {
            "email": "arjun.kapoor@prepverse.ai",
            "name": "Arjun Kapoor",
            "title": "Engineering Manager",
            "company": "Meta",
            "experience_years": 10,
            "bio": "Feed Infra & Scalable Databases. Expert at debugging performance choke points and behavioral leadership evaluations.",
            "hourly_rate": 999.0,
            "rating": 4.98,
            "total_reviews": 105,
            "skills": "High Scale Systems, Mock Coding, Behavioral Round, Meta Bar Raiser",
            "is_verified": True
        },
        {
            "email": "elena.rostova@prepverse.ai",
            "name": "Elena Rostova",
            "title": "Lead Software Engineer",
            "company": "Adobe",
            "experience_years": 7,
            "bio": "Creative Cloud core graphics pipeline. Specialist in Object Oriented Low-Level Design and C++ algorithms.",
            "hourly_rate": 699.0,
            "rating": 4.89,
            "total_reviews": 42,
            "skills": "Low Level Design, C++, Clean Code, Design Patterns",
            "is_verified": True
        },
        {
            "email": "rohit.verma@prepverse.ai",
            "name": "Rohit Verma",
            "title": "Senior SDE (Campus Recruiter Lead)",
            "company": "TCS",
            "experience_years": 6,
            "bio": "Cracked 8+ campus drives. Mentored 400+ freshers on aptitude, SQL fundamentals, and technical interview confidence.",
            "hourly_rate": 449.0,
            "rating": 4.88,
            "total_reviews": 130,
            "skills": "Campus Placements, DBMS, Java, Communication & Aptitude",
            "is_verified": True
        }
    ]

    for m_data in mentors_catalog:
        existing_u = db.query(User).filter(User.email == m_data["email"]).first()
        if not existing_u:
            existing_u = User(
                email=m_data["email"],
                hashed_password=hashed_pwd,
                full_name=m_data["name"],
                role="mentor"
            )
            db.add(existing_u)
            db.commit()
            db.refresh(existing_u)
            
        existing_m = db.query(Mentor).filter(Mentor.user_id == existing_u.id).first()
        if not existing_m:
            db.add(Mentor(
                user_id=existing_u.id,
                title=m_data["title"],
                company=m_data["company"],
                experience_years=m_data["experience_years"],
                bio=m_data["bio"],
                hourly_rate=m_data["hourly_rate"],
                rating=m_data["rating"],
                total_reviews=m_data["total_reviews"],
                skills=m_data["skills"],
                is_verified=m_data["is_verified"]
            ))
    db.commit()

    # 4. Seed Material Vault Resources
    vault_resources = get_vault_resources_seed()
    for r in vault_resources:
        if not db.query(Resource).filter(Resource.title == r["title"]).first():
            db.add(Resource(**r))
    db.commit()

    # 5. Seed Question Bank (Company & Topic-wise)
    questions = get_questions_seed()
    for q in questions:
        if not db.query(Question).filter(Question.question_text == q["question_text"]).first():
            db.add(Question(**q))
    db.commit()

    # 6. Seed Coding Problems (50+ Full Problems)
    coding_problems = get_coding_problems_seed()
    for p in coding_problems:
        if not db.query(CodingProblem).filter(CodingProblem.slug == p["slug"]).first():
            db.add(CodingProblem(
                title=p["title"],
                slug=p["slug"],
                category=p["category"],
                difficulty=p["difficulty"],
                problem_statement=p["problem_statement"],
                input_format=p["input_format"],
                output_format=p["output_format"],
                constraints=p["constraints"],
                sample_cases_json=json.dumps(p["sample_cases"]),
                hidden_cases_json=json.dumps(p["hidden_cases"]),
                templates_json=json.dumps(p["templates"])
            ))
    db.commit()

    # 7. Seed Active 14-Day Roadmap if not present
    roadmap = db.query(UserRoadmap).filter(UserRoadmap.user_id == student_user.id).first()
    if not roadmap:
        roadmap = UserRoadmap(
            user_id=student_user.id,
            title="14-Day SDE Target Preparation Roadmap",
            target_role="Software Development Engineer (SDE)",
            target_company="Google",
            total_days=14,
            current_day=3
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)

        roadmap_tasks = [
            # Day 1
            (1, "DSA", "Arrays & Two Pointers", "Solve Two Sum & Container With Most Water in the IDE.", "/coding", True),
            (1, "DBMS", "B-Tree Indexing Deep Dive", "Study Clustered vs Non-Clustered Indexes in the Material Vault.", "/vault", True),
            # Day 2
            (2, "DSA", "Sliding Window & Hash Maps", "Solve Longest Substring Without Repeating Characters.", "/coding", True),
            (2, "HR", "Elevator Pitch & Introduction", "Structure a 2-minute STAR pitch tailored to Google.", "/questions", True),
            # Day 3
            (3, "OS", "Memory & Paging Mechanics", "Review Virtual Memory and Banker's Algorithm in Vault notes.", "/vault", True),
            (3, "DSA", "Fast & Slow Pointers (Linked Lists)", "Solve Linked List Cycle & Reorder List in IDE.", "/coding", True),
            # Day 4
            (4, "System Design", "Top 15 Architecture Patterns", "Read Cache-Aside, Consistent Hashing & Message Queues in Vault.", "/vault", False),
            (4, "Interview", "15-Min Technical AI Mock", "Complete a simulated Google SDE technical round in Arena.", "/arena", False),
            # Day 5
            (5, "DSA", "Stack & Monotonic Stack", "Solve Daily Temperatures & Valid Parentheses.", "/coding", False),
            (5, "Resume", "JD ATS Keyword Optimization", "Run JD-based ATS check against your target Google SDE posting.", "/ats", False),
            # Day 6
            (6, "DSA", "Binary Search Mastery", "Solve Search in Rotated Sorted Array & Koko Eating Bananas.", "/coding", False),
            (6, "Networks", "TCP/IP & HTTP/3 Fundamentals", "Study 3-way handshake and SYN flood mitigations in Vault.", "/vault", False),
            # Day 7
            (7, "DSA", "Trees & Level Order Traversal", "Invert Binary Tree & Lowest Common Ancestor in IDE.", "/coding", False),
            (7, "Mentorship", "Schedule 1-on-1 Mentor Review", "Book a 30-min strategy review with Google Mentor Sarah Chen.", "/mentors", False),
            # Day 8-14
            (8, "DSA", "Graph BFS / DFS & Cycle Detection", "Solve Number of Islands & Course Schedule.", "/coding", False),
            (9, "DSA", "Dynamic Programming Foundations", "Solve Coin Change & Climbing Stairs with memoization.", "/coding", False),
            (10, "System Design", "Design Twitter / Feed Service", "Implement Feed Generation and celebrity fan-out trade-offs.", "/coding", False),
            (11, "HR", "STAR Framework Behavioral Prep", "Practice conflict resolution & leadership principle prompts.", "/questions", False),
            (12, "DSA", "Hard Problem Sprint", "Tackle LRU Cache & Minimum Window Substring.", "/coding", False),
            (13, "Interview", "Full 45-Min Multimodal AI Mock", "Attempt end-to-end Technical & Behavioral interview in Arena.", "/arena", False),
            (14, "Readiness", "360° Readiness Verification", "Audit final score breakdown and export verified PDF report.", "/readiness", False)
        ]

        for day, cat, title, desc, url, done in roadmap_tasks:
            db.add(RoadmapTask(
                roadmap_id=roadmap.id,
                day_number=day,
                category=cat,
                task_title=title,
                task_description=desc,
                action_url=url,
                is_completed=done
            ))
        db.commit()

    print("PrepVerse AI Seed completed successfully with 50+ Coding Problems, 30+ Questions, Mentors, and Vault Notes!")
    db.close()

if __name__ == "__main__":
    seed_database()
