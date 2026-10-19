import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base
from app.seed import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    seed_database()

def test_root_endpoint():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "PrepVerse AI Backend API"
        assert data["status"] == "online"

def test_auth_login():
    with TestClient(app) as client:
        response = client.post("/api/auth/login", json={
            "email": "student@prepverse.ai",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["role"] == "student"

def test_questions_endpoint():
    with TestClient(app) as client:
        login_res = client.post("/api/auth/login", json={"email": "student@prepverse.ai", "password": "password123"})
        token = login_res.json()["access_token"]
        
        response = client.get("/api/questions/", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        questions = response.json()
        assert isinstance(questions, list)
        assert len(questions) > 0

def test_coding_problems_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/coding/problems")
        assert response.status_code == 200
        problems = response.json()
        assert isinstance(problems, list)
        assert len(problems) > 0

def test_mentors_endpoint():
    with TestClient(app) as client:
        response = client.get("/api/mentors/")
        assert response.status_code == 200
        mentors = response.json()
        assert isinstance(mentors, list)
        assert len(mentors) > 0
