import logging
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models import User, Analysis, SkillDetected, InterviewQuestion
from app.schemas import (
    AnalysisRequest, AnalysisResponse, AnalysisDetailResponse,
    SkillDetectedResponse, InterviewQuestionsResponse, InterviewQuestionResponse
)
from app.services import (
    extract_text_from_file, clean_text, SkillMatcher, LLMService
)
from app.utils import AuthService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

def get_current_user(authorization: str = None, db: Session = Depends(get_db)) -> User:
    """Dependency to get current authenticated user"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    try:
        token = authorization.split(" ")[1]
    except IndexError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format"
        )
    
    token_data = AuthService.verify_token(token, token_type="access")
    
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = db.query(User).filter(User.id == token_data.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user

@router.post("", response_model=AnalysisDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_analysis(
    request: AnalysisRequest,
    authorization: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new skill matching analysis
    
    Args:
        request: Analysis request with resume and job description text
        authorization: Bearer token
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Detailed analysis results
        
    Raises:
        HTTPException: If analysis fails
    """
    try:
        logger.info(f"Starting analysis for user: {current_user.email}")
        
        # Extract and clean text
        resume_text = clean_text(request.resume_text)
        job_text = clean_text(request.job_description_text)
        
        if len(resume_text) < 50:
            raise ValueError("Resume text is too short")
        if len(job_text) < 50:
            raise ValueError("Job description text is too short")
        
        # Initialize matcher
        matcher = SkillMatcher()
        match_results = matcher.match_skills(resume_text, job_text)
        
        # Create analysis record in database
        analysis = Analysis(
            user_id=current_user.id,
            resume_text=resume_text,
            job_description_text=job_text,
            resume_filename=request.resume_filename or "resume.txt",
            job_description_filename=request.job_description_filename or "job_desc.txt",
            skill_match_percentage=match_results['skill_match_percentage'],
            evidence_coverage_score=match_results['evidence_coverage_score'],
            interview_readiness_score=match_results['interview_readiness_score']
        )
        
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        
        logger.info(f"Analysis created: {analysis.id}")
        
        # Store detected skills
        for skill_match in match_results['skill_matches']:
            skill_detected = SkillDetected(
                analysis_id=analysis.id,
                skill_name=skill_match['skill_name'],
                status=skill_match['evidence_status'],
                evidence_text=skill_match['evidence_text'],
                confidence_score=skill_match['confidence_score'],
                depth_level=skill_match.get('depth_level', 'BEGINNER'),
                is_required=skill_match['is_matched'],
                years_of_experience=skill_match.get('years_of_experience'),
                last_used=skill_match.get('last_used'),
                match_percentage=100.0 if skill_match['is_matched'] else 0.0
            )
            db.add(skill_detected)
        
        db.commit()
        
        # Prepare response
        skills = db.query(SkillDetected).filter(SkillDetected.analysis_id == analysis.id).all()
        
        return AnalysisDetailResponse(
            id=analysis.id,
            user_id=analysis.user_id,
            resume_text=analysis.resume_text[:500],  # Truncate for response
            job_description_text=analysis.job_description_text[:500],
            skill_match_percentage=analysis.skill_match_percentage,
            evidence_coverage_score=analysis.evidence_coverage_score,
            interview_readiness_score=analysis.interview_readiness_score,
            analysis_date=analysis.analysis_date,
            created_at=analysis.created_at,
            skills_detected=[SkillDetectedResponse.from_orm(s) for s in skills],
            total_skills_in_job=len(match_results['skill_matches']),
            matched_skills=len([s for s in match_results['skill_matches'] if s['is_matched']]),
            missing_skills=match_results['missing_skills']
        )
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating analysis: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating analysis"
        )

@router.get("/{analysis_id}", response_model=AnalysisDetailResponse)
async def get_analysis(
    analysis_id: str,
    authorization: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get analysis details
    
    Args:
        analysis_id: Analysis ID
        authorization: Bearer token
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Analysis details
        
    Raises:
        HTTPException: If analysis not found
    """
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    skills = db.query(SkillDetected).filter(SkillDetected.analysis_id == analysis.id).all()
    
    return AnalysisDetailResponse(
        id=analysis.id,
        user_id=analysis.user_id,
        resume_text=analysis.resume_text[:500],
        job_description_text=analysis.job_description_text[:500],
        skill_match_percentage=analysis.skill_match_percentage,
        evidence_coverage_score=analysis.evidence_coverage_score,
        interview_readiness_score=analysis.interview_readiness_score,
        analysis_date=analysis.analysis_date,
        created_at=analysis.created_at,
        skills_detected=[SkillDetectedResponse.from_orm(s) for s in skills],
        total_skills_in_job=len(skills),
        matched_skills=len([s for s in skills if s.is_required])
    )

@router.get("/{analysis_id}/skills", response_model=list[SkillDetectedResponse])
async def get_analysis_skills(
    analysis_id: str,
    authorization: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all detected skills for an analysis
    
    Args:
        analysis_id: Analysis ID
        authorization: Bearer token
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        List of detected skills
        
    Raises:
        HTTPException: If analysis not found
    """
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    skills = db.query(SkillDetected).filter(SkillDetected.analysis_id == analysis.id).all()
    
    return [SkillDetectedResponse.from_orm(s) for s in skills]

@router.get("/{analysis_id}/interview-questions", response_model=InterviewQuestionsResponse)
async def get_interview_questions(
    analysis_id: str,
    authorization: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get generated interview questions for an analysis
    
    Args:
        analysis_id: Analysis ID
        authorization: Bearer token
        db: Database session
        current_user: Current authenticated user
        
    Returns:
        Interview questions response
        
    Raises:
        HTTPException: If analysis not found or question generation fails
    """
    # Verify analysis exists
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    # Check if questions already exist
    existing_questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.analysis_id == analysis_id
    ).all()
    
    if existing_questions:
        return InterviewQuestionsResponse(
            analysis_id=analysis_id,
            total_questions=len(existing_questions),
            questions=[InterviewQuestionResponse.from_orm(q) for q in existing_questions],
            interview_readiness_score=analysis.interview_readiness_score
        )
    
    try:
        # Generate new questions using LLM
        llm_service = LLMService()
        skills = db.query(SkillDetected).filter(SkillDetected.analysis_id == analysis_id).all()
        
        if not skills:
            raise ValueError("No skills found for this analysis")
        
        all_questions = []
        
        for skill in skills[:5]:  # Limit to top 5 skills to save tokens
            questions = llm_service.generate_interview_questions(
                skill.skill_name,
                skill.depth_level or "BEGINNER",
                skill.status,
                skill.years_of_experience or 0.0
            )
            
            for question in questions:
                interview_q = InterviewQuestion(
                    analysis_id=analysis_id,
                    skill_name=skill.skill_name,
                    difficulty_level=skill.depth_level or "BEGINNER",
                    question_text=question.get('question', ''),
                    expected_answer=question.get('expected_answer'),
                    resources=question.get('resources'),
                    question_type=question.get('question_type', 'technical')
                )
                db.add(interview_q)
                all_questions.append(interview_q)
        
        db.commit()
        
        return InterviewQuestionsResponse(
            analysis_id=analysis_id,
            total_questions=len(all_questions),
            questions=[InterviewQuestionResponse.from_orm(q) for q in all_questions],
            interview_readiness_score=analysis.interview_readiness_score
        )
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error generating interview questions: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error generating interview questions"
        )

@router.delete("/{analysis_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_analysis(
    analysis_id: str,
    authorization: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete an analysis
    
    Args:
        analysis_id: Analysis ID to delete
        authorization: Bearer token
        db: Database session
        current_user: Current authenticated user
        
    Raises:
        HTTPException: If analysis not found
    """
    analysis = db.query(Analysis).filter(
        Analysis.id == analysis_id,
        Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    db.delete(analysis)
    db.commit()
    
    logger.info(f"Analysis deleted: {analysis_id}")
    return None
