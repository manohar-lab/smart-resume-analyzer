from sqlalchemy import Column, String, Text, DateTime, Float, Integer, ForeignKey, Boolean, Enum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class EvidenceStatus(str, enum.Enum):
    """Enumeration for evidence classification"""
    VERIFIED = "VERIFIED"
    SUPPORTED = "SUPPORTED"
    CLAIMED = "CLAIMED"
    UNCERTAIN = "UNCERTAIN"

class SkillDepthLevel(str, enum.Enum):
    """Enumeration for skill depth levels"""
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class User(Base):
    """User model for authentication and profile"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    profile_picture = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email}>"

class Analysis(Base):
    """Analysis model - represents a complete analysis"""
    __tablename__ = "analyses"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    resume_text = Column(Text, nullable=False)
    job_description_text = Column(Text, nullable=False)
    resume_filename = Column(String, nullable=True)
    job_description_filename = Column(String, nullable=True)
    skill_match_percentage = Column(Float, nullable=True)
    evidence_coverage_score = Column(Float, nullable=True)
    interview_readiness_score = Column(Float, nullable=True)
    analysis_date = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="analyses")
    skills_detected = relationship("SkillDetected", back_populates="analysis", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Analysis {self.id}>"

class SkillDetected(Base):
    """Skills detected in analysis"""
    __tablename__ = "skills_detected"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), index=True, nullable=False)
    skill_name = Column(String, index=True, nullable=False)
    status = Column(Enum(EvidenceStatus), nullable=False, default=EvidenceStatus.UNCERTAIN)
    evidence_text = Column(Text, nullable=True)
    source_section = Column(String, nullable=True)  # e.g., "Experience", "Skills", "Projects"
    confidence_score = Column(Float, nullable=False, default=0.5)  # 0.0 to 1.0
    depth_level = Column(Enum(SkillDepthLevel), nullable=True)
    years_of_experience = Column(Float, nullable=True)
    last_used = Column(String, nullable=True)  # Date string
    is_required = Column(Boolean, default=False)  # Is this skill required for the job?
    match_percentage = Column(Float, nullable=True)  # How well does it match job requirement?
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    analysis = relationship("Analysis", back_populates="skills_detected")
    
    def __repr__(self):
        return f"<SkillDetected {self.skill_name}>"

class SkillDictionary(Base):
    """Dictionary of known skills"""
    __tablename__ = "skill_dictionary"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    skill_name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, index=True, nullable=False)  # languages, frameworks, cloud, etc.
    description = Column(Text, nullable=True)
    typical_use_cases = Column(JSON, nullable=True)
    related_skills = Column(JSON, nullable=True)  # List of related skill names
    difficulty_level = Column(Enum(SkillDepthLevel), default=SkillDepthLevel.INTERMEDIATE)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<SkillDictionary {self.skill_name}>"

class InterviewQuestion(Base):
    """Interview questions generated from skills"""
    __tablename__ = "interview_questions"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    analysis_id = Column(String, ForeignKey("analyses.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    difficulty_level = Column(Enum(SkillDepthLevel), nullable=False)
    question_text = Column(Text, nullable=False)
    expected_answer = Column(Text, nullable=True)
    resources = Column(JSON, nullable=True)  # List of learning resources
    question_type = Column(String, default="technical")  # technical, behavioral, scenario
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<InterviewQuestion {self.skill_name}>"
