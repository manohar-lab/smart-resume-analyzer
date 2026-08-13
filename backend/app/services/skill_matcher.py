import logging
from typing import Dict, List, Tuple
from app.services.skill_extractor import SkillExtractor
from app.services.evidence_analyzer import EvidenceFinder, EvidenceStatus, SkillDepthLevel

logger = logging.getLogger(__name__)

class SkillMatcher:
    """Main service for matching skills between resume and job description"""
    
    def __init__(self):
        """Initialize matcher with skill extractor and evidence finder"""
        self.extractor = SkillExtractor()
        self.evidence_finder = EvidenceFinder()
    
    def match_skills(self, resume_text: str, job_description: str) -> Dict:
        """
        Main method: Match resume skills to job description skills
        
        Args:
            resume_text: Extracted resume text
            job_description: Extracted job description text
            
        Returns:
            Dictionary with detailed matching results
        """
        logger.info("Starting skill matching analysis")
        
        # Extract skills from both texts
        required_skills = self.extractor.extract_required_skills(job_description)
        resume_skills_dict = self.extractor.extract_resume_skills(resume_text)
        
        logger.info(f"Found {len(required_skills)} required skills")
        logger.info(f"Found {len(resume_skills_dict)} skills in resume")
        
        # Match each required skill
        skill_matches = []
        matched_count = 0
        
        for skill_name in required_skills:
            match_result = self._match_single_skill(
                skill_name, 
                resume_text, 
                resume_skills_dict
            )
            
            skill_matches.append(match_result)
            
            if match_result['is_matched']:
                matched_count += 1
        
        # Calculate overall metrics
        skill_match_percentage = (matched_count / len(required_skills) * 100) if required_skills else 0
        
        missing_skills = [
            skill['name'] for skill in skill_matches 
            if not skill['is_matched']
        ]
        
        # Calculate evidence coverage score
        evidence_coverage_score = self.evidence_finder.score_evidence_coverage(
            required_skills,
            resume_skills_dict
        )
        
        # Calculate interview readiness (0-10 scale)
        interview_readiness = self._calculate_interview_readiness(skill_matches)
        
        result = {
            'skill_match_percentage': round(skill_match_percentage, 1),
            'evidence_coverage_score': round(evidence_coverage_score * 100, 1),
            'interview_readiness_score': round(interview_readiness, 1),
            'total_required_skills': len(required_skills),
            'matched_skills': matched_count,
            'missing_skills': missing_skills,
            'skill_matches': skill_matches,
            'resume_skills_found': len(resume_skills_dict),
            'summary': self._generate_summary(skill_match_percentage, evidence_coverage_score, len(required_skills))
        }
        
        logger.info(f"Matching complete: {skill_match_percentage}% match")
        return result
    
    def _match_single_skill(self, skill_name: str, resume_text: str, resume_skills_dict: Dict) -> Dict:
        """
        Match a single required skill
        
        Args:
            skill_name: Skill to match
            resume_text: Resume text
            resume_skills_dict: Dictionary of skills found in resume
            
        Returns:
            Match result dictionary
        """
        # Look for skill in resume (case-insensitive)
        found_in_resume = None
        for resume_skill, skill_data in resume_skills_dict.items():
            if skill_name.lower() == resume_skill.lower():
                found_in_resume = skill_data
                break
        
        # If exact match not found, try fuzzy match
        if not found_in_resume:
            for resume_skill, skill_data in resume_skills_dict.items():
                if skill_name.lower() in resume_skill.lower() or resume_skill.lower() in skill_name.lower():
                    found_in_resume = skill_data
                    break
        
        if not found_in_resume:
            return {
                'skill_name': skill_name,
                'is_matched': False,
                'status': 'MISSING',
                'confidence_score': 0.0,
                'evidence_text': None,
                'evidence_status': 'UNCERTAIN',
                'depth_level': 'BEGINNER'
            }
        
        # Found in resume - analyze evidence
        evidence_texts = self.evidence_finder.find_evidence_sentences(
            resume_text, 
            skill_name
        )
        
        if not evidence_texts:
            evidence_texts = found_in_resume.get('evidence', [])
        
        # Classify evidence
        evidence_status = EvidenceStatus.UNCERTAIN
        confidence_score = 0.0
        
        if evidence_texts:
            evidence_status, confidence_score = self.evidence_finder.classify_evidence(
                evidence_texts[0],
                skill_name
            )
        
        # Determine skill depth
        depth_level = self.evidence_finder.determine_skill_depth(
            evidence_texts,
            skill_name
        )
        
        # Extract years of experience
        years_of_experience = self.evidence_finder.extract_years_of_experience(evidence_texts)
        
        # Extract last used date
        last_used = self.evidence_finder.extract_last_used_date(evidence_texts)
        
        return {
            'skill_name': skill_name,
            'is_matched': True,
            'status': evidence_status.value,
            'confidence_score': round(confidence_score, 2),
            'evidence_text': evidence_texts[0] if evidence_texts else None,
            'evidence_status': evidence_status.value,
            'depth_level': depth_level.value,
            'years_of_experience': round(years_of_experience, 1),
            'last_used': last_used if last_used else None,
            'category': found_in_resume.get('category', 'unknown'),
            'found_count': found_in_resume.get('found_count', 1)
        }
    
    def _calculate_interview_readiness(self, skill_matches: List[Dict]) -> float:
        """
        Calculate interview readiness score (0-10)
        
        Args:
            skill_matches: List of skill match results
            
        Returns:
            Interview readiness score
        """
        if not skill_matches:
            return 0.0
        
        total_score = 0.0
        
        for match in skill_matches:
            if not match['is_matched']:
                # Missing skills reduce score
                total_score += 0
            else:
                # Score based on evidence status and depth
                status_scores = {
                    'VERIFIED': 3.0,
                    'SUPPORTED': 2.25,
                    'CLAIMED': 1.0,
                    'UNCERTAIN': 0.0
                }
                
                depth_scores = {
                    'ADVANCED': 3.0,
                    'INTERMEDIATE': 2.0,
                    'BEGINNER': 1.0
                }
                
                status_score = status_scores.get(match['evidence_status'], 0.0)
                depth_score = depth_scores.get(match['depth_level'], 1.0)
                
                # Average of status and depth
                skill_score = (status_score + depth_score) / 2
                total_score += skill_score
        
        # Normalize to 0-10 scale
        max_possible_score = len(skill_matches) * 3.0
        normalized_score = (total_score / max_possible_score) * 10 if max_possible_score > 0 else 0
        
        return min(10.0, max(0.0, normalized_score))
    
    def _generate_summary(self, match_percentage: float, coverage_score: float, total_skills: int) -> str:
        """
        Generate a human-readable summary
        
        Args:
            match_percentage: Match percentage
            coverage_score: Coverage score (0-100)
            total_skills: Total skills in job description
            
        Returns:
            Summary string
        """
        if match_percentage >= 80:
            summary = f"Excellent match! You have {match_percentage}% of required skills."
        elif match_percentage >= 60:
            summary = f"Good match with {match_percentage}% of required skills. Some gaps to address."
        elif match_percentage >= 40:
            summary = f"Partial match with {match_percentage}% of required skills. Significant learning needed."
        else:
            summary = f"Limited match with {match_percentage}% of required skills. Major skill gaps identified."
        
        return summary
