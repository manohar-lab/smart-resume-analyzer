import logging
import re
from typing import List, Dict, Tuple
from enum import Enum

logger = logging.getLogger(__name__)

class EvidenceStatus(str, Enum):
    """Evidence classification levels"""
    VERIFIED = "VERIFIED"      # 1.0 - Strong evidence, quantified, verified
    SUPPORTED = "SUPPORTED"    # 0.75 - Good evidence, described with context
    CLAIMED = "CLAIMED"        # 0.4 - Mentioned but not substantiated
    UNCERTAIN = "UNCERTAIN"    # 0.0 - Insufficient evidence

class SkillDepthLevel(str, Enum):
    """Skill depth/proficiency levels"""
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class EvidenceFinder:
    """Find and classify evidence for skills in resume text"""
    
    # Evidence patterns for different classification levels
    VERIFIED_INDICATORS = [
        # Project indicators
        r'(?:developed|built|created|implemented|designed|architected)\s+(?:a\s+)?(?:.*?)(?:that|which|using)',
        r'(?:project|application|system|service).*?(?:python|javascript|java|react|vue|angular)',
        r'(?:github|gitlab|repo|repository).*?(?:python|javascript|java|react)',
        
        # Quantified indicators
        r'\b\d+\s*(?:years?|months?)\s+(?:of\s+)?(?:experience|expertise)\s+(?:in|with)\s+',
        r'(?:led|managed|oversaw)\s+(?:team|project).*?(?:python|javascript|java)',
        
        # Technology depth
        r'(?:architected|optimized|scaled|performance|microservices|kubernetes)',
    ]
    
    SUPPORTED_INDICATORS = [
        # Used in context
        r'(?:worked|used|utilized|leveraged|applied)\s+(?:.*?)(?:python|javascript|java|react)',
        r'(?:python|javascript|java|react|vue|angular)[\s-](?:developer|engineer|specialist)',
        r'(?:responsible\s+)?for.*?(?:python|javascript|java)',
        
        # Learning/training
        r'(?:trained|learned|studied)\s+(?:.*?)(?:python|javascript|java)',
        
        # Projects
        r'(?:project|assignment)\s+(?:using|with).*?(?:python|javascript|java)',
    ]
    
    CLAIMED_INDICATORS = [
        # Simple mentions
        r'(?:skills?|expertise|knowledge).*?(?:python|javascript|java)',
        r'(?:python|javascript|java)\s+(?:skills?|proficient)',
        r'(?:familiar\s+with|knowledge\s+of)\s+(?:python|javascript|java)',
    ]
    
    # Depth indicators
    ADVANCED_INDICATORS = [
        r'(?:architected|designed|optimized|scaled|performance)',
        r'(?:lead|led|mentored|managed)\s+.*?(?:team|developer)',
        r'(?:5\+|6\+|7\+|8\+|9\+|10\+)\s+years?',
        r'(?:open\s+source|github|side\s+project)',
        r'(?:system\s+design|microservices|kubernetes|distributed|scalable)',
        r'(?:senior|lead|principal|architect)',
    ]
    
    INTERMEDIATE_INDICATORS = [
        r'(?:2|3|4)\s+years?',
        r'(?:developed|built|created)\s+.*?(?:feature|module|component)',
        r'(?:full\s+stack|fullstack)',
        r'(?:led|managed)\s+(?:small\s+)?project',
    ]
    
    BEGINNER_INDICATORS = [
        r'(?:learning|studying|started)',
        r'(?:junior|entry\s+level)',
        r'(?:0|1)\s+years?',
        r'(?:basics?|fundamentals?)',
    ]
    
    def find_evidence_sentences(self, text: str, skill_name: str, context_length: int = 200) -> List[str]:
        """
        Find sentences containing evidence for a skill
        
        Args:
            text: Text to search
            skill_name: Skill name to find evidence for
            context_length: Characters to include before/after match
            
        Returns:
            List of evidence sentences
        """
        evidence_sentences = []
        skill_pattern = r'\b' + re.escape(skill_name) + r'\b'
        
        # Find all sentences containing the skill
        sentences = re.split(r'[.!?]\s+', text)
        
        for sentence in sentences:
            if re.search(skill_pattern, sentence, re.IGNORECASE):
                # Clean up sentence
                sentence = sentence.strip()
                if len(sentence) > 10:  # Filter out very short matches
                    evidence_sentences.append(sentence)
        
        return evidence_sentences[:5]  # Return top 5 matches
    
    def classify_evidence(self, evidence_text: str, skill_name: str) -> Tuple[EvidenceStatus, float]:
        """
        Classify evidence level based on text content
        
        Args:
            evidence_text: Evidence sentence/paragraph
            skill_name: Skill being classified
            
        Returns:
            Tuple of (EvidenceStatus, confidence_score)
        """
        text_lower = evidence_text.lower()
        
        # Count indicator matches
        verified_score = sum(1 for pattern in self.VERIFIED_INDICATORS if re.search(pattern, text_lower, re.IGNORECASE))
        supported_score = sum(1 for pattern in self.SUPPORTED_INDICATORS if re.search(pattern, text_lower, re.IGNORECASE))
        claimed_score = sum(1 for pattern in self.CLAIMED_INDICATORS if re.search(pattern, text_lower, re.IGNORECASE))
        
        # Determine classification
        if verified_score >= 2:
            return EvidenceStatus.VERIFIED, min(1.0, 0.85 + (verified_score * 0.05))
        elif verified_score >= 1 or supported_score >= 2:
            return EvidenceStatus.SUPPORTED, min(1.0, 0.70 + (supported_score * 0.05))
        elif supported_score >= 1 or claimed_score >= 2:
            return EvidenceStatus.CLAIMED, min(1.0, 0.35 + (claimed_score * 0.05))
        else:
            return EvidenceStatus.UNCERTAIN, 0.0
    
    def determine_skill_depth(self, evidence_texts: List[str], skill_name: str) -> SkillDepthLevel:
        """
        Determine skill depth level based on evidence
        
        Args:
            evidence_texts: List of evidence sentences
            skill_name: Skill name
            
        Returns:
            SkillDepthLevel
        """
        all_evidence = ' '.join(evidence_texts).lower()
        
        # Count depth indicators
        advanced_count = sum(1 for pattern in self.ADVANCED_INDICATORS if re.search(pattern, all_evidence))
        intermediate_count = sum(1 for pattern in self.INTERMEDIATE_INDICATORS if re.search(pattern, all_evidence))
        beginner_count = sum(1 for pattern in self.BEGINNER_INDICATORS if re.search(pattern, all_evidence))
        
        # Determine depth level
        if advanced_count >= 2:
            return SkillDepthLevel.ADVANCED
        elif intermediate_count >= 2 or (intermediate_count >= 1 and beginner_count == 0):
            return SkillDepthLevel.INTERMEDIATE
        else:
            return SkillDepthLevel.BEGINNER
    
    def extract_years_of_experience(self, evidence_texts: List[str]) -> float:
        """
        Extract years of experience from evidence text
        
        Args:
            evidence_texts: List of evidence sentences
            
        Returns:
            Estimated years of experience (0-40)
        """
        all_evidence = ' '.join(evidence_texts)
        
        # Look for patterns like "5 years", "2+ years", "2-3 years"
        patterns = [
            r'(\d+)\+?\s*(?:years?|yrs?)',
            r'(?:for\s+)?(\d+)\s*(?:years?|yrs?)',
            r'(\d+)(?:-|\.\.)\d+\s*(?:years?|yrs?)',
        ]
        
        years_found = []
        for pattern in patterns:
            matches = re.findall(pattern, all_evidence, re.IGNORECASE)
            years_found.extend([float(m) for m in matches])
        
        if years_found:
            return max(years_found)
        
        return 0.0
    
    def extract_last_used_date(self, evidence_texts: List[str]) -> str:
        """
        Try to extract when skill was last used
        
        Args:
            evidence_texts: List of evidence sentences
            
        Returns:
            Date string or empty string if not found
        """
        all_evidence = ' '.join(evidence_texts)
        
        # Look for date patterns like "2024", "2023-2024", "Currently", "Present"
        patterns = [
            r'(?:currently|present)',
            r'(?:from\s+)?(?:20\d{2})\s*(?:-|to|\s+present)',
            r'(20\d{2})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, all_evidence, re.IGNORECASE)
            if match:
                return match.group(0)
        
        return ""
    
    def score_evidence_coverage(self, required_skills: List[str], resume_evidence: Dict[str, Dict]) -> float:
        """
        Calculate how well resume covers required skills
        
        Args:
            required_skills: List of skills required for job
            resume_evidence: Dict of skills found in resume with evidence
            
        Returns:
            Coverage score 0-1
        """
        if not required_skills:
            return 0.0
        
        covered_count = 0
        evidence_quality_sum = 0.0
        
        for skill in required_skills:
            skill_lower = skill.lower()
            
            # Check if skill is in resume (fuzzy match)
            for resume_skill, evidence_data in resume_evidence.items():
                if skill.lower() in resume_skill.lower() or resume_skill.lower() in skill.lower():
                    covered_count += 1
                    # Add evidence quality score if available
                    if 'status' in evidence_data:
                        status_scores = {
                            'VERIFIED': 1.0,
                            'SUPPORTED': 0.75,
                            'CLAIMED': 0.4,
                            'UNCERTAIN': 0.0
                        }
                        evidence_quality_sum += status_scores.get(evidence_data['status'], 0.0)
                    break
        
        coverage_score = covered_count / len(required_skills)
        
        if covered_count > 0:
            quality_bonus = (evidence_quality_sum / covered_count) * 0.2  # Quality adds up to 20%
            return min(1.0, coverage_score + quality_bonus)
        
        return coverage_score
