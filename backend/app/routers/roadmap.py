from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import User, Profile, UserRoadmap, RoadmapTask
from .auth import get_current_user

router = APIRouter(prefix="/api/roadmap", tags=["Roadmap"])

@router.get("/")
def get_roadmap(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = db.query(UserRoadmap).filter(UserRoadmap.user_id == current_user.id).order_by(UserRoadmap.created_at.desc()).first()
    if not roadmap:
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        target_role = profile.target_role if profile else "SDE"
        target_company = profile.target_company if profile else "Tech Giants"
        
        roadmap = UserRoadmap(
            user_id=current_user.id,
            title=f"14-Day {target_role} Preparation Roadmap",
            target_role=target_role,
            target_company=target_company,
            total_days=14,
            current_day=1
        )
        db.add(roadmap)
        db.commit()
        db.refresh(roadmap)
        
        # Populate 14 days of structured tasks
        sample_schedule = [
            (1, "DSA", "Arrays & Two Pointers", "Solve 3 LeetCode Medium problems on Arrays.", "/coding"),
            (1, "DBMS", "Normalization & Indexes", "Review 1NF to BCNF rules & B-Tree indexes.", "/vault"),
            (2, "DSA", "Sliding Window & Hash Maps", "Master string anagram & longest substring patterns.", "/coding"),
            (2, "HR", "Tell Me About Yourself", "Practice 2-minute pitch using STAR framework.", "/questions"),
            (3, "DSA", "Linked List & Fast/Slow Pointers", "Cycle detection & reverse linked list.", "/coding"),
            (3, "OS", "Process vs Thread", "Revise Deadlocks, Semaphores & Virtual Memory.", "/vault"),
            (4, "System Design", "Scalability & Load Balancers", "Study Horizontal vs Vertical Scaling & L4/L7 LB.", "/vault"),
            (4, "Mock Interview", "15-Min Technical Mock", "Attempt AI Interview Arena round for SDE.", "/arena"),
            (5, "DSA", "Binary Trees & BST Traversals", "Inorder, Preorder, Postorder & Level Order.", "/coding"),
            (6, "DSA", "Graph BFS & DFS", "Connected components & shortest path algorithms.", "/coding"),
            (7, "DSA", "Dynamic Programming Basics", "Knapsack & Fibonacci memoization.", "/coding"),
            (8, "System Design", "Caching & Redis Strategies", "Cache-Aside, Write-Through & LRU eviction.", "/vault"),
            (9, "DSA", "Heaps & Priority Queues", "Top K Frequent elements & Median in stream.", "/coding"),
            (10, "Behavioral", "Conflict Resolution", "Prepare STAR response for teamwork disagreement.", "/questions"),
            (11, "Coding", "SQL Queries & Aggregations", "GROUP BY, HAVING, DENSE_RANK window functions.", "/coding"),
            (12, "DSA", "Tries & Backtracking", "Word Search & Sudoku Solver patterns.", "/coding"),
            (13, "System Design", "Database Sharding & Replication", "Master-Slave, Primary-Secondary & Partitioning.", "/vault"),
            (14, "Mock Interview", "Full 45-Min AI Interview", "Comprehensive technical & HR simulation.", "/arena")
        ]
        
        for day, cat, title, desc, url in sample_schedule:
            task = RoadmapTask(
                roadmap_id=roadmap.id,
                day_number=day,
                category=cat,
                task_title=title,
                task_description=desc,
                action_url=url
            )
            db.add(task)
        db.commit()

    tasks = db.query(RoadmapTask).filter(RoadmapTask.roadmap_id == roadmap.id).order_by(RoadmapTask.day_number.asc()).all()
    
    tasks_by_day = {}
    completed_count = 0
    for t in tasks:
        if t.is_completed: completed_count += 1
        if t.day_number not in tasks_by_day:
            tasks_by_day[t.day_number] = []
        tasks_by_day[t.day_number].append({
            "id": t.id,
            "category": t.category,
            "title": t.task_title,
            "description": t.task_description,
            "action_url": t.action_url,
            "is_completed": t.is_completed
        })
        
    total = len(tasks)
    progress_pct = int((completed_count / total) * 100) if total > 0 else 0

    return {
        "id": roadmap.id,
        "title": roadmap.title,
        "target_role": roadmap.target_role,
        "target_company": roadmap.target_company,
        "total_days": roadmap.total_days,
        "current_day": roadmap.current_day,
        "progress_pct": progress_pct,
        "tasks_by_day": tasks_by_day
    }

@router.post("/task/{task_id}/complete")
def toggle_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(RoadmapTask).filter(RoadmapTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task.is_completed = not task.is_completed
    
    # Give XP reward on completion
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if profile and task.is_completed:
        profile.xp += 25
        
    db.commit()
    return {"message": "Task updated", "is_completed": task.is_completed}
