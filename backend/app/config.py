import os

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "PrepVerse AI")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "prepverse_secret_key_2026_dev_secure")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./prepverse.db")
    
    # External credentials (blank = fallback to intelligent mock services)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    JUDGE0_URL: str = os.getenv("JUDGE0_URL", "")
    JUDGE0_API_KEY: str = os.getenv("JUDGE0_API_KEY", "")
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")

settings = Settings()
