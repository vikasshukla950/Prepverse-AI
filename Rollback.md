# PrepVerse AI - Rollback & Recovery Guide

> **Core Standard**:
> This document outlines how to safely roll back changes, revert commits, and recover database states in PrepVerse AI.

---

## 🔄 Git Rollback Procedures

### 1. Discard Uncommitted Changes (Working Directory)
To revert unstaged changes in specific files:
```bash
git restore <file_path>
```
To revert all unstaged working directory changes:
```bash
git restore .
```
To clean untracked files (excluding `.env`):
```bash
git clean -fd -e .env
```

### 2. Undo Recent Local Commits
To keep changes in working directory but undo the last commit:
```bash
git reset --soft HEAD~1
```
To completely discard the last commit and all its changes:
```bash
git reset --hard HEAD~1
```

### 3. Reverting Pushed Commits Safely
If a commit was already pushed to `origin/main`, create a revert commit instead of rewriting history:
```bash
git revert <commit_hash>
git push origin main
```

---

## 🗄️ Database Rollback (SQLite / PostgreSQL)

### 1. SQLite Development Database
- The primary development database is `backend/prepverse.db`.
- Automatic backups: before running major migrations, copy `backend/prepverse.db` to `backend/prepverse.db.bak`.
- To restore:
```powershell
Copy-Item backend\prepverse.db.bak backend\prepverse.db -Force
```
- Or re-seed the fresh database anytime:
```powershell
cd backend
python -c "from app.database import engine, Base; from app.seed import seed_database; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); seed_database()"
```

---

## 📋 Rollback Log

| Date | Commit / Scope | Reason for Rollback | Procedure Used | Operator |
| :--- | :--- | :--- | :--- | :--- |
| *No rollbacks required to date.* | - | - | - | - |
