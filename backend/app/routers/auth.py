import hashlib
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

from ..database import get_db
from ..models import User, Profile, Mentor
from ..schemas import UserRegister, UserLogin, TokenResponse
from ..config import settings

router = APIRouter(prefix="/api/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_password_hash(password: str) -> str:
    return hashlib.sha256((password + settings.SECRET_KEY).encode("utf-8")).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return get_password_hash(plain_password) == hashed_password

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")
        
    hashed_pwd = get_password_hash(user_data.password)
    user_role = (user_data.role or "student").lower()
    
    user = User(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        role=user_role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Initialize appropriate role record
    if user_role == "mentor":
        mentor_rec = Mentor(
            user_id=user.id,
            company=user_data.company or "Google / Tech Leader",
            title=user_data.title or "Senior Industry Mentor",
            experience_years=user_data.experience_years or 5,
            skills=user_data.skills or "System Design, Mock Interviews, Architecture, DSA",
            hourly_rate=user_data.hourly_rate or 499.0,
            bio=f"Senior mentor at {user_data.company or 'Tech Leader'}. Passionate about helping candidates ace technical rounds.",
            is_verified=True
        )
        db.add(mentor_rec)
        db.commit()
    elif user_role == "placement_cell":
        profile = Profile(
            user_id=user.id,
            college=user_data.institution or "Campus Placement Cell",
            degree="Training & Placement Division",
            branch=user_data.designation or "Career Services Head",
            grad_year=2026,
            target_role="Campus Hiring & Placement Analytics",
            target_company="Top Tech Recruiters"
        )
        db.add(profile)
        db.commit()
    elif user_role == "admin":
        profile = Profile(
            user_id=user.id,
            college=user_data.institution or "PrepVerse Platform Operations",
            degree="System Administration",
            branch="Engineering & Security",
            grad_year=2026,
            target_role="Platform Superuser",
            target_company="PrepVerse AI"
        )
        db.add(profile)
        db.commit()
    else:  # student
        profile = Profile(
            user_id=user.id,
            college=user_data.college or "Tech University",
            degree="B.Tech Computer Science",
            branch="Computer Science",
            grad_year=user_data.grad_year or 2025,
            target_role=user_data.target_role or "Software Development Engineer (SDE)",
            target_company="Tier-1 Tech Company"
        )
        db.add(profile)
        db.commit()
    
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": user.email, "role": user.role, "user_id": user.id})
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    return {
        "user_id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "profile": {
            "college": profile.college if profile else "",
            "target_role": profile.target_role if profile else "",
            "overall_readiness": profile.overall_readiness if profile else 0,
        } if profile else None
    }
