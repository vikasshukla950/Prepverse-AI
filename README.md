<<<<<<< HEAD
# Prepverse-AI
=======
# PrepVerse AI ("From Resume Gaps to Interview-Ready")

> **One intelligent platform for complete interview preparation.**

PrepVerse AI brings resume analysis, ATS optimization, personalized preparation roadmaps, browser-based coding IDE, multimodal AI mock interviews, expert mentorship marketplace, and 360° readiness analytics into one unified career-readiness ecosystem.

---

## 🌟 Signature Features

1. **360° Career Readiness Index (0-100)**: Dynamically calculated across Resume, ATS Match, Technical Depth, Coding IDE, Speech Pacing/Fluency, and AI Mock Interviews.
2. **Resume ➔ Interview Engine**: Automatically extracts projects & technologies from student resumes to generate targeted technical interview questions.
3. **Coding ➔ Interview Explanation**: After solving problems in the Monaco/Code editor, candidates explain their solution complexities out loud or in writing to evaluate articulation.
4. **Multimodal AI Interview Arena**: Live webcam & speech interview room evaluating pacing (WPM), filler words, and eye-contact indicators.
5. **AI Personal Career Coach**: 24/7 intelligent coach answering *"What should I study today?"* relying on actual candidate data.
6. **1-on-1 Mentor Marketplace**: Paid mock interviews with verified engineers from Google, Amazon, and Microsoft with calendar slot booking and mock payment gateways.
7. **Placement Cell Batch Analytics**: Aggregate institution readiness metrics, batch distribution, top technical skill gaps, and role splits.

---
**Before commit make sure update changes in both files**-----
---**progress.md** -----
---**Rollback.md** ------

## 🚀 Quick Setup & Local Execution

### 1. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Backend (FastAPI + SQLite/PostgreSQL)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- **API Docs (Swagger UI)**: `http://127.0.0.1:8000/docs`
- Database automatically initializes and seeds demo data on startup!

### 3. Frontend (Next.js 14 + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

---

## 👤 Quick Demo Logins

- **Student User**: `student@prepverse.ai` | Password: `password123`
- **Mentor User**: `mentor@prepverse.ai` | Password: `password123`
- **Admin User**: `admin@prepverse.ai` | Password: `password123`
- **Placement Cell**: `placement@prepverse.ai` | Password: `password123`

---

## 🧪 Testing

Run backend API automated tests:
```bash
cd backend
pytest
```

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
>>>>>>> 4301169 (feat: complete PrepVerse AI production platform with 60+ coding challenges, JD ATS checker, 14-day roadmap, interview arena, mentor marketplace and vault)
