import logging
import json
from typing import List, Dict, Optional
from app.config import settings

logger = logging.getLogger(__name__)

try:
    from openai import OpenAI, APIError
    LLM_AVAILABLE = True
except ImportError:
    LLM_AVAILABLE = False
    logger.warning("OpenAI not available, LLM features disabled")

class LLMService:
    """Service for LLM-powered features using OpenAI"""
    
    def __init__(self):
        """Initialize LLM service"""
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.max_tokens = settings.OPENAI_MAX_TOKENS
        
        if LLM_AVAILABLE and self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("LLM service not initialized - API key missing or library unavailable")
    
    def is_available(self) -> bool:
        """Check if LLM service is available"""
        return self.client is not None
    
    def generate_interview_questions(
        self,
        skill_name: str,
        depth_level: str,
        evidence_status: str,
        years_experience: float
    ) -> List[Dict[str, str]]:
        """
        Generate interview questions for a skill
        
        Args:
            skill_name: Name of skill
            depth_level: BEGINNER, INTERMEDIATE, or ADVANCED
            evidence_status: VERIFIED, SUPPORTED, CLAIMED, UNCERTAIN
            years_experience: Years of experience with skill
            
        Returns:
            List of question dictionaries with question and expected_answer
        """
        if not self.is_available():
            logger.warning("LLM not available, generating mock questions")
            return self._generate_mock_questions(skill_name, depth_level)
        
        try:
            # Adjust difficulty based on evidence and experience
            actual_difficulty = self._adjust_difficulty(depth_level, evidence_status, years_experience)
            
            prompt = self._build_question_generation_prompt(
                skill_name,
                actual_difficulty,
                evidence_status
            )
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert technical interviewer. Generate challenging but fair interview questions."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"} if "gpt-4" in self.model else None,
            )
            
            response_text = response.choices[0].message.content
            
            # Parse JSON response
            try:
                questions_data = json.loads(response_text)
                questions = questions_data.get('questions', [])
            except json.JSONDecodeError:
                logger.warning("Failed to parse LLM JSON response, using fallback")
                questions = self._generate_mock_questions(skill_name, actual_difficulty)
            
            logger.info(f"Generated {len(questions)} interview questions for {skill_name}")
            return questions
            
        except APIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return self._generate_mock_questions(skill_name, depth_level)
        except Exception as e:
            logger.error(f"Error generating interview questions: {str(e)}")
            return self._generate_mock_questions(skill_name, depth_level)
    
    def _build_question_generation_prompt(self, skill_name: str, difficulty: str, evidence_status: str) -> str:
        """Build prompt for question generation"""
        instructions = {
            "BEGINNER": "Ask basic conceptual questions that test fundamental understanding.",
            "INTERMEDIATE": "Ask practical questions about how to use this skill in real projects.",
            "ADVANCED": "Ask system design and optimization questions that test deep expertise."
        }
        
        intensity_map = {
            "VERIFIED": "high confidence (candidate has strong evidence)",
            "SUPPORTED": "medium confidence (candidate has decent evidence)",
            "CLAIMED": "low confidence (candidate made unverified claims)",
            "UNCERTAIN": "very low confidence (minimal evidence)"
        }
        
        prompt = f"""
Generate 3 interview questions for the skill "{skill_name}" at {difficulty} level.
The candidate has {intensity_map.get(evidence_status, 'unknown')}.

{instructions.get(difficulty, 'Generate appropriate technical questions.')}

Return ONLY valid JSON in this format (no markdown, no code blocks):
{{
    "questions": [
        {{
            "question": "Your question here?",
            "expected_answer": "What a good answer should cover...",
            "resources": ["Resource title", "Another resource"],
            "question_type": "technical"
        }}
    ]
}}
"""
        return prompt
    
    def _adjust_difficulty(self, depth_level: str, evidence_status: str, years_experience: float) -> str:
        """
        Adjust difficulty based on evidence and experience
        
        Args:
            depth_level: Original depth level
            evidence_status: Evidence classification
            years_experience: Years of experience
            
        Returns:
            Adjusted difficulty level
        """
        # Start with depth_level
        difficulty = depth_level
        
        # Adjust based on evidence_status
        if evidence_status == "CLAIMED" and depth_level in ["INTERMEDIATE", "ADVANCED"]:
            # Lower difficulty if claims are unverified
            difficulty = "BEGINNER"
        elif evidence_status == "UNCERTAIN":
            difficulty = "BEGINNER"
        
        # Adjust based on years of experience
        if years_experience < 1 and difficulty == "ADVANCED":
            difficulty = "INTERMEDIATE"
        
        return difficulty
    
    def _generate_mock_questions(self, skill_name: str, difficulty: str) -> List[Dict[str, str]]:
        """
        Generate mock questions when LLM is unavailable
        
        Args:
            skill_name: Skill name
            difficulty: Difficulty level
            
        Returns:
            List of mock questions
        """
        mock_questions_db = {
            "PYTHON": {
                "BEGINNER": [
                    {
                        "question": "What is the difference between a list and a tuple in Python?",
                        "expected_answer": "Lists are mutable (can be changed), tuples are immutable (cannot be changed). Lists use square brackets [], tuples use parentheses ().",
                        "resources": ["Python Docs: Lists", "Python Docs: Tuples"],
                        "question_type": "technical"
                    },
                    {
                        "question": "Explain what a for loop does in Python.",
                        "expected_answer": "A for loop iterates over items in a sequence. It executes the same code block for each item.",
                        "resources": ["Python For Loops"],
                        "question_type": "technical"
                    }
                ],
                "INTERMEDIATE": [
                    {
                        "question": "What are decorators in Python and how would you use them?",
                        "expected_answer": "Decorators are functions that modify or enhance other functions. They use @decorator syntax and are useful for logging, timing, validation.",
                        "resources": ["Python Decorators Guide"],
                        "question_type": "technical"
                    },
                    {
                        "question": "Explain the Global Interpreter Lock (GIL) and its implications.",
                        "expected_answer": "The GIL is a mutex that protects access to Python objects. It prevents multiple threads from executing Python code simultaneously in the same process.",
                        "resources": ["Understanding Python GIL"],
                        "question_type": "technical"
                    }
                ],
                "ADVANCED": [
                    {
                        "question": "How would you design a scalable web application using Python? Discuss architecture decisions.",
                        "expected_answer": "Use async frameworks (FastAPI), microservices, containerization (Docker), load balancing, caching (Redis), database optimization, monitoring.",
                        "resources": ["FastAPI Best Practices", "System Design"],
                        "question_type": "technical"
                    },
                    {
                        "question": "Explain how you would optimize a computationally intensive Python application.",
                        "expected_answer": "Use NumPy/Pandas for vectorization, multiprocessing for CPU-bound tasks, async for I/O, JIT compilation (Numba), C extensions, profiling first.",
                        "resources": ["Python Performance Optimization"],
                        "question_type": "technical"
                    }
                ]
            }
        }
        
        # Default fallback
        default_questions = [
            {
                "question": f"Tell us about a significant project where you used {skill_name}.",
                "expected_answer": "Describe a real project, your role, challenges, and what you learned.",
                "resources": [],
                "question_type": "technical"
            },
            {
                "question": f"What are the key concepts and best practices for {skill_name}?",
                "expected_answer": "Explain fundamental concepts and industry best practices.",
                "resources": [],
                "question_type": "technical"
            }
        ]
        
        # Try to get specific questions
        skill_upper = skill_name.upper()
        if skill_upper in mock_questions_db:
            return mock_questions_db[skill_upper].get(difficulty, default_questions)
        
        return default_questions
    
    def generate_learning_roadmap(self, skills: List[str], target_level: str) -> Dict:
        """
        Generate a learning roadmap for specified skills
        
        Args:
            skills: List of skills to learn
            target_level: Target proficiency level (BEGINNER, INTERMEDIATE, ADVANCED)
            
        Returns:
            Learning roadmap dictionary
        """
        if not self.is_available():
            return self._generate_mock_roadmap(skills, target_level)
        
        try:
            prompt = f"""
Generate a {target_level} level learning roadmap for: {', '.join(skills)}

Format as JSON:
{{
    "total_weeks": 12,
    "weeks": [
        {{
            "week": 1,
            "focus_skill": "Skill Name",
            "objectives": ["Objective 1", "Objective 2"],
            "resources": ["Resource 1", "Resource 2"],
            "hours_per_week": 10,
            "checkpoint": "Checkpoint description"
        }}
    ]
}}

Provide 4-12 weeks depending on complexity.
"""
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert learning coach. Create effective, structured learning roadmaps."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=self.max_tokens,
            )
            
            response_text = response.choices[0].message.content
            try:
                roadmap = json.loads(response_text)
            except json.JSONDecodeError:
                roadmap = self._generate_mock_roadmap(skills, target_level)
            
            return roadmap
            
        except Exception as e:
            logger.error(f"Error generating roadmap: {str(e)}")
            return self._generate_mock_roadmap(skills, target_level)
    
    def _generate_mock_roadmap(self, skills: List[str], target_level: str) -> Dict:
        """Generate mock roadmap when LLM unavailable"""
        weeks_estimate = {"BEGINNER": 8, "INTERMEDIATE": 12, "ADVANCED": 16}
        total_weeks = weeks_estimate.get(target_level, 12)
        
        return {
            "total_weeks": total_weeks,
            "weeks": [
                {
                    "week": i,
                    "focus_skill": skills[i % len(skills)] if skills else "General",
                    "objectives": ["Complete learning objectives", "Work on practice project"],
                    "resources": ["Tutorial", "Documentation"],
                    "hours_per_week": 10,
                    "checkpoint": f"Week {i} checkpoint"
                }
                for i in range(1, total_weeks + 1)
            ]
        }
