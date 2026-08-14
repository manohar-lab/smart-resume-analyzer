import logging
import re
from typing import List, Dict, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

class SkillExtractor:
    """Extract and detect skills from resume and job description text"""
    
    def __init__(self):
        """Initialize skill extractor with skill dictionary"""
        self.skills_dict = self._build_skills_dict()
        self.skill_aliases = self._build_aliases()
    
    def _build_skills_dict(self) -> Dict[str, Dict]:
        """Build comprehensive skills dictionary from config"""
        skills_dict = {}
        
        for category, skills in settings.SKILL_CATEGORIES.items():
            for skill in skills:
                skills_dict[skill.lower()] = {
                    'name': skill,
                    'category': category,
                    'variations': self._get_skill_variations(skill)
                }
        
        return skills_dict
    
    def _get_skill_variations(self, skill: str) -> List[str]:
        """Get common variations of a skill name"""
        variations = [skill.lower()]
        
        # Add common abbreviations and variations
        variations_map = {
            'javascript': ['js', 'node', 'nodejs', 'node.js'],
            'typescript': ['ts'],
            'python': ['py'],
            'c++': ['cpp', 'c plus plus'],
            'c#': ['csharp', 'c sharp'],
            'react': ['reactjs', 'react.js'],
            'vue.js': ['vue', 'vuejs'],
            'angular': ['angularjs'],
            'nodejs': ['node.js', 'node'],
            'django': ['drf'],
            'fastapi': ['fast api'],
            'spring boot': ['springboot', 'spring-boot'],
            'asp.net': ['asp', 'dotnet', '.net'],
            'next.js': ['nextjs', 'next'],
            'docker': ['containerization'],
            'kubernetes': ['k8s', 'k8s'],
            'postgresql': ['postgres', 'postgres sql'],
            'mongodb': ['mongo', 'mongo db'],
            'github': ['git hub'],
            'gitlab': ['git lab'],
            'aws': ['amazon', 'amazon web services'],
            'google cloud': ['gcp', 'google cloud platform'],
            'azure': ['microsoft azure'],
        }
        
        skill_lower = skill.lower()
        if skill_lower in variations_map:
            variations.extend(variations_map[skill_lower])
        
        return variations
    
    def _build_aliases(self) -> Dict[str, str]:
        """Build mapping from variations to canonical skill names"""
        aliases = {}
        
        for skill_lower, skill_info in self.skills_dict.items():
            canonical_name = skill_info['name']
            for variation in skill_info['variations']:
                aliases[variation] = canonical_name
        
        return aliases
    
    def extract_skills_from_text(self, text: str) -> Dict[str, List[Tuple[str, int]]]:
        """
        Extract skills from text
        
        Args:
            text: Text to extract skills from
            
        Returns:
            Dictionary mapping skill names to list of (match, position_in_text) tuples
        """
        found_skills = {}
        text_lower = text.lower()
        
        # Find exact matches and partial matches
        for variation, canonical_name in self.aliases.items():
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(variation) + r'\b'
            
            for match in re.finditer(pattern, text_lower):
                if canonical_name not in found_skills:
                    found_skills[canonical_name] = []
                
                found_skills[canonical_name].append({
                    'match': variation,
                    'position': match.start(),
                    'text_snippet': self._get_text_snippet(text, match.start())
                })
        
        logger.info(f"Extracted {len(found_skills)} unique skills from text")
        return found_skills
    
    def _get_text_snippet(self, text: str, position: int, context_length: int = 100) -> str:
        """Get snippet of text around a match for context"""
        start = max(0, position - context_length)
        end = min(len(text), position + context_length)
        
        snippet = text[start:end]
        
        # Clean up snippet
        snippet = snippet.replace('\n', ' ')
        snippet = ' '.join(snippet.split())
        
        return snippet
    
    def extract_required_skills(self, job_description: str) -> List[str]:
        """
        Extract skills required for a job from job description
        
        Args:
            job_description: Job description text
            
        Returns:
            List of required skill names
        """
        found_skills = self.extract_skills_from_text(job_description)
        return list(found_skills.keys())
    
    def extract_resume_skills(self, resume_text: str) -> Dict[str, Dict]:
        """
        Extract skills from resume with additional context
        
        Args:
            resume_text: Resume text
            
        Returns:
            Dictionary of skills with metadata
        """
        found_skills = self.extract_skills_from_text(resume_text)
        
        result = {}
        for skill_name, matches in found_skills.items():
            result[skill_name] = {
                'name': skill_name,
                'category': self.skills_dict.get(skill_name.lower(), {}).get('category', 'unknown'),
                'found_count': len(matches),
                'evidence': [m['text_snippet'] for m in matches[:3]]  # First 3 matches
            }
        
        return result
    
    def get_skill_category(self, skill_name: str) -> str:
        """Get category of a skill"""
        skill_lower = skill_name.lower()
        if skill_lower in self.skills_dict:
            return self.skills_dict[skill_lower]['category']
        return 'unknown'
    
    def get_related_skills(self, skill_name: str) -> List[str]:
        """Get skills related to a given skill"""
        related_map = {
            'python': ['django', 'flask', 'fastapi', 'data science', 'machine learning'],
            'javascript': ['react', 'vue.js', 'angular', 'nodejs', 'typescript'],
            'react': ['javascript', 'typescript', 'nodejs', 'webpack'],
            'docker': ['kubernetes', 'docker compose', 'containerization'],
            'kubernetes': ['docker', 'cloud', 'microservices'],
            'aws': ['cloud', 'lambda', 'dynamodb', 's3'],
            'git': ['github', 'gitlab', 'version control'],
            'java': ['spring boot', 'maven', 'gradle'],
            'sql': ['database', 'postgresql', 'mysql'],
        }
        
        skill_lower = skill_name.lower()
        return related_map.get(skill_lower, [])
