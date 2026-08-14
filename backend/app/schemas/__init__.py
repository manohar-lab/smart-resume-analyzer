from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

# ============== USER SCHEMAS ==============

class UserRegisterRequest(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str = Field(..., min_length=2)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!",
                "name": "John Doe"
            }
        }

class UserLoginRequest(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }

class UserResponse(BaseModel):
    """Schema for user response"""
    id: str
    email: str
    name: str
    profile_picture: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# ============== ANALYSIS SCHEMAS ==============

class EvidenceStatusEnum(str, Enum):
    VERIFIED = "VERIFIED"
    SUPPORTED = "SUPPORTED"
    CLAIMED = "CLAIMED"
    UNCERTAIN = "UNCERTAIN"

class SkillDepthEnum(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class SkillDetectedResponse(BaseModel):
    """Schema for detected skill in analysis"""
    id: str
    skill_name: str
    status: EvidenceStatusEnum
    evidence_text: Optional[str] = None
    source_section: Optional[str] = None
    confidence_score: float = Field(..., ge=0, le=1)
    depth_level: Optional[SkillDepthEnum] = None
    years_of_experience: Optional[float] = None
    last_used: Optional[str] = None
    is_required: bool
    match_percentage: Optional[float] = None
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "skill-123",
                "skill_name": "Python",
                "status": "VERIFIED",
                "evidence_text": "Developed microservices using Python and FastAPI",
                "source_section": "Experience",
                "confidence_score": 0.95,
                "depth_level": "ADVANCED",
                "years_of_experience": 5.0,
                "last_used": "2024-08",
                "is_required": True,
                "match_percentage": 100.0
            }
        }

class AnalysisRequest(BaseModel):
    """Schema for creating a new analysis"""
    resume_text: str = Field(..., min_length=10)
    job_description_text: str = Field(..., min_length=10)
    resume_filename: Optional[str] = None
    job_description_filename: Optional[str] = None

class AnalysisResponse(BaseModel):
    """Schema for analysis response"""
    id: str
    user_id: str
    resume_text: str
    job_description_text: str
    skill_match_percentage: Optional[float] = None
    evidence_coverage_score: Optional[float] = None
    interview_readiness_score: Optional[float] = None
    analysis_date: datetime
    created_at: datetime
    skills_detected: List[SkillDetectedResponse] = []
    
    class Config:
        from_attributes = True

class AnalysisDetailResponse(AnalysisResponse):
    """Extended analysis response with full details"""
    total_skills_in_resume: int = 0
    total_skills_in_job: int = 0
    matched_skills: int = 0
    missing_skills: List[str] = []
    
    class Config:
        from_attributes = True

# ============== INTERVIEW SCHEMAS ==============

class InterviewQuestionResponse(BaseModel):
    """Schema for interview question"""
    id: str
    skill_name: str
    difficulty_level: SkillDepthEnum
    question_text: str
    expected_answer: Optional[str] = None
    resources: Optional[List[dict]] = None
    question_type: str
    
    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "q-123",
                "skill_name": "Python",
                "difficulty_level": "INTERMEDIATE",
                "question_text": "Explain the difference between list and tuple in Python",
                "expected_answer": "Lists are mutable while tuples are immutable...",
                "resources": [
                    {"title": "Python Lists vs Tuples", "url": "https://example.com"}
                ],
                "question_type": "technical"
            }
        }

class InterviewQuestionsResponse(BaseModel):
    """Schema for collection of interview questions"""
    analysis_id: str
    total_questions: int
    questions: List[InterviewQuestionResponse]
    interview_readiness_score: Optional[float] = None

# ============== SKILL DICTIONARY SCHEMAS ==============

class SkillDictionaryResponse(BaseModel):
    """Schema for skill dictionary entry"""
    id: str
    skill_name: str
    category: str
    description: Optional[str] = None
    typical_use_cases: Optional[List[str]] = None
    related_skills: Optional[List[str]] = None
    difficulty_level: SkillDepthEnum
    
    class Config:
        from_attributes = True

# ============== ERROR SCHEMAS ==============

class ErrorResponse(BaseModel):
    """Schema for error responses"""
    detail: str
    status_code: int
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "detail": "User not found",
                "status_code": 404,
                "error_code": "USER_NOT_FOUND"
            }
        }
