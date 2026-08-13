# EviMatch Backend API

## Architecture

The backend is built with FastAPI, a modern, fast Python web framework. It follows a layered architecture:

```
API Routes ↓
  ↓
Services (Business Logic) ↓
  ↓
Database Models ↓
  ↓
PostgreSQL Database
```

## Project Structure

```
app/
├── main.py                 # FastAPI app initialization, lifespan, routes
├── config.py              # Configuration settings from environment
├── database/
│   ├── session.py         # Database engine, session factory
│   └── __init__.py
├── models/
│   ├── base.py            # SQLAlchemy models (User, Analysis, etc.)
│   └── __init__.py
├── schemas/
│   └── __init__.py        # Pydantic schemas for request/response validation
├── routes/
│   ├── auth.py            # Authentication endpoints
│   ├── analysis.py        # Analysis endpoints
│   └── __init__.py
├── services/
│   ├── text_extractor.py  # PDF/TXT text extraction
│   ├── skill_extractor.py # Skill detection from text
│   ├── evidence_analyzer.py # Evidence finding and classification
│   ├── skill_matcher.py   # Main skill matching logic
│   ├── llm_service.py     # OpenAI integration
│   └── __init__.py
├── utils/
│   ├── auth.py            # JWT and password utilities
│   └── __init__.py
└── __init__.py
```

## Core Services

### 1. Text Extractor (`services/text_extractor.py`)
Extracts text from PDF and TXT files.

```python
from app.services import extract_text_from_file

text = extract_text_from_file(file_bytes, "resume.pdf")
```

**Features:**
- PDF extraction via PyPDF2
- TXT file reading with encoding detection
- Text cleaning and normalization

### 2. Skill Extractor (`services/skill_extractor.py`)
Detects skills from text using dictionary matching.

```python
extractor = SkillExtractor()
skills = extractor.extract_resume_skills(resume_text)
```

**Supported Skills:**
- Programming Languages (Python, JavaScript, Java, etc.)
- Frameworks (React, Django, FastAPI, etc.)
- Cloud Services (AWS, GCP, Azure, etc.)
- Databases (PostgreSQL, MongoDB, etc.)
- Tools (Git, Docker, Kubernetes, etc.)
- Soft Skills (Leadership, Communication, etc.)

### 3. Evidence Analyzer (`services/evidence_analyzer.py`)
Finds and classifies evidence for detected skills.

```python
finder = EvidenceFinder()
status, confidence = finder.classify_evidence(evidence_text, skill_name)
# Returns: (EvidenceStatus.VERIFIED, 0.95)
```

**Classification Levels:**
- VERIFIED: Strong evidence (1.0)
- SUPPORTED: Good evidence (0.75)
- CLAIMED: Mentioned only (0.4)
- UNCERTAIN: No evidence (0.0)

### 4. Skill Matcher (`services/skill_matcher.py`)
Main orchestration service that combines all analysis.

```python
matcher = SkillMatcher()
results = matcher.match_skills(resume_text, job_description)
# Returns detailed matching results
```

**Output:**
```python
{
    'skill_match_percentage': 75.5,
    'evidence_coverage_score': 82.3,
    'interview_readiness_score': 7.5,
    'skill_matches': [...],
    'missing_skills': ['Kubernetes'],
    'summary': "Good match with 75% of required skills..."
}
```

### 5. LLM Service (`services/llm_service.py`)
Integrates with OpenAI for AI features.

```python
llm = LLMService()
questions = llm.generate_interview_questions(
    skill_name="Python",
    depth_level="INTERMEDIATE",
    evidence_status="VERIFIED",
    years_experience=3.0
)
```

**Features:**
- Interview question generation
- Learning roadmap generation
- Mock questions fallback when LLM unavailable

## API Routes

### Authentication Routes (`routes/auth.py`)

**POST /api/auth/register**
```python
{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
}
→ {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "tokenType": "bearer"
}
```

**POST /api/auth/login**
```python
{
    "email": "user@example.com",
    "password": "SecurePass123!"
}
→ TokenResponse
```

**GET /api/auth/me**
Returns current authenticated user profile.

### Analysis Routes (`routes/analysis.py`)

**POST /api/analysis**
```python
{
    "resumeText": "Long resume text...",
    "jobDescriptionText": "Job description...",
    "resumeFilename": "resume.pdf",
    "jobDescriptionFilename": "job.txt"
}
→ {
    "id": "uuid",
    "skillMatchPercentage": 75.5,
    "evidenceCoverageScore": 82.3,
    "interviewReadinessScore": 7.5,
    "skillsDetected": [...],
    "matchedSkills": 18,
    "totalSkillsInJob": 24,
    "missingSkills": ["Kubernetes", "AWS"]
}
```

**GET /api/analysis/{id}**
Returns full analysis details including all detected skills.

**GET /api/analysis/{id}/interview-questions**
Generates and returns personalized interview questions.

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    profile_picture VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Analyses Table
```sql
CREATE TABLE analyses (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR FOREIGN KEY,
    resume_text TEXT NOT NULL,
    job_description_text TEXT NOT NULL,
    skill_match_percentage FLOAT,
    evidence_coverage_score FLOAT,
    interview_readiness_score FLOAT,
    analysis_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_date ON analyses(analysis_date);
```

### Skills Detected Table
```sql
CREATE TABLE skills_detected (
    id VARCHAR PRIMARY KEY,
    analysis_id VARCHAR FOREIGN KEY,
    skill_name VARCHAR NOT NULL,
    status ENUM ('VERIFIED', 'SUPPORTED', 'CLAIMED', 'UNCERTAIN'),
    evidence_text TEXT,
    source_section VARCHAR,
    confidence_score FLOAT,
    depth_level ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    years_of_experience FLOAT,
    last_used VARCHAR,
    is_required BOOLEAN DEFAULT FALSE,
    match_percentage FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_skills_analysis_id ON skills_detected(analysis_id);
CREATE INDEX idx_skills_name ON skills_detected(skill_name);
```

## Authentication

### JWT Implementation

Tokens are created and validated using PyJWT:

```python
from app.utils import AuthService

# Create tokens
tokens = AuthService.create_token_pair(user_id, email)
# {
#   "access_token": "eyJhbG...",
#   "refresh_token": "eyJhbG...",
#   "token_type": "bearer"
# }

# Verify token
token_data = AuthService.verify_token(token, token_type="access")
# TokenData(user_id="...", email="...")
```

### Request Headers
```
Authorization: Bearer {access_token}
```

## Error Handling

All endpoints follow consistent error response format:

```python
{
    "detail": "Error message",
    "status_code": 400,
    "error_code": "VALIDATION_ERROR",
    "timestamp": "2024-08-13T10:30:00Z"
}
```

### Common Status Codes
- 200: Success
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 404: Not found
- 500: Server error

## Environment Configuration

```
# .env file
DEBUG=True
DATABASE_URL=postgresql://user:password@localhost:5432/evimatch
SECRET_KEY=your-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-3.5-turbo
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=["http://localhost:3000"]
```

## Testing

### Unit Tests
```bash
pytest tests/test_auth.py
pytest tests/test_skills.py
pytest tests/test_analysis.py
```

### Integration Tests
```bash
pytest tests/ -v
```

### Run with coverage
```bash
pytest --cov=app tests/
```

## Performance Considerations

### Database Optimization
- Indexes on frequently queried columns
- Connection pooling (20-50 connections)
- Query result caching with Redis
- Denormalization where appropriate

### API Performance
- Response time target: < 500ms (p95)
- Throughput: > 1000 req/sec
- Memory: < 500MB baseline
- CPU: < 50% under normal load

### Caching Strategy
- Skill dictionary cached in memory
- Benchmark data cached in Redis
- Market data updated hourly

## Logging

```python
import logging

logger = logging.getLogger(__name__)

logger.info("Analysis created: {analysis_id}")
logger.warning("Unverified skill claim detected")
logger.error("Database connection failed: {error}")
```

Logs include:
- Request/response details
- Error stack traces
- Performance metrics
- Audit trail for analysis actions

## Deployment

### Production Checklist
- [ ] DEBUG=False
- [ ] Unique SECRET_KEY
- [ ] SSL certificates configured
- [ ] Database backups enabled
- [ ] CORS origins specified
- [ ] Error logging configured
- [ ] Monitoring/alerting setup
- [ ] Rate limiting enabled

### Deploy with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Deploy with Docker
```bash
docker build -t evimatch-backend .
docker run -p 8000:8000 evimatch-backend
```

## Monitoring

### Health Check Endpoint
```
GET /health
→ {"status": "healthy", "app": "EviMatch API"}
```

### Metrics to Monitor
- Request latency
- Error rate
- Database query time
- LLM API latency
- Token refresh rate

## Future Enhancements

- [ ] Async task processing (Celery)
- [ ] WebSocket support for real-time updates
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] API versioning
- [ ] Batch analysis processing
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Custom skill dictionary per user
- [ ] Multi-language support

---

For frontend documentation, see [../frontend/README.md](../frontend/README.md)
