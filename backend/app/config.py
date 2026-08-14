from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # App settings
    APP_NAME: str = "EviMatch API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/evimatch"
    SQLALCHEMY_ECHO: bool = False
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_MAX_TOKENS: int = 2000
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # File upload
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50 MB
    UPLOAD_DIR: str = "./uploads"
    ALLOWED_EXTENSIONS: list = [".pdf", ".txt", ".docx"]
    
    # CORS
    CORS_ORIGINS: list = ["*"]
    
    # Skills dictionary (will be loaded from database)
    SKILL_CATEGORIES: dict = {
        "languages": [
            "Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust",
            "C#", "PHP", "Ruby", "Kotlin", "Swift", "SQL"
        ],
        "frameworks": [
            "React", "Vue.js", "Angular", "Django", "Flask", "FastAPI",
            "Express.js", "Spring Boot", "ASP.NET", "Next.js"
        ],
        "cloud": [
            "AWS", "Google Cloud", "Azure", "Docker", "Kubernetes",
            "Serverless", "Lambda", "CloudRun"
        ],
        "databases": [
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
            "DynamoDB", "Firestore", "Oracle"
        ],
        "tools": [
            "Git", "GitHub", "GitLab", "Jenkins", "GitHub Actions",
            "Docker", "Kubernetes", "Terraform", "Ansible"
        ],
        "soft_skills": [
            "Leadership", "Communication", "Problem-solving", "Teamwork",
            "Project Management", "Agile", "Scrum", "Time Management"
        ]
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()

settings = get_settings()
