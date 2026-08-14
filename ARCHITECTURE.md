# EviMatch - System Architecture & Technical Design

## Overview

EviMatch is a two-tier web application that combines evidence-based skill analysis with AI-powered interview preparation. The system processes user-provided resumes and job descriptions to identify, classify, and match technical skills.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Tier (Browser)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ React 18 + TypeScript + Redux Toolkit + Material-UI  │   │
│  │ - Login/Register pages                               │   │
│  │ - Upload resume & job description                    │   │
│  │ - View analysis results                              │   │
│  │ - Generate interview questions                       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┬─┘
                            │ HTTP/HTTPS
                            │ Axios Client
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  API Gateway Tier                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FastAPI (Python)                                     │   │
│  │ - JWT Authentication & Authorization                 │   │
│  │ - Request Validation (Pydantic)                      │   │
│  │ - Error Handling & Logging                           │   │
│  │ - CORS Middleware                                    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┬─┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   ┌────────────┐  ┌──────────────┐  ┌──────────────────┐
   │   Auth     │  │  Analysis    │  │   Interview      │
   │   Routes   │  │   Routes     │  │   Routes         │
   └─────┬──────┘  └──────┬───────┘  └────────┬─────────┘
         │                │                    │
         └────────────────┼────────────────────┘
                          │
                          ▼
    ┌─────────────────────────────────────────────────────┐
    │           Business Logic Layer (Services)           │
    │  ┌─────────────────────────────────────────────┐   │
    │  │ 1. Text Extractor      - Extract PDF/TXT   │   │
    │  │ 2. Skill Extractor     - Detect skills     │   │
    │  │ 3. Evidence Analyzer   - Classify evidence │   │
    │  │ 4. Skill Matcher       - Match & score     │   │
    │  │ 5. LLM Service         - AI integration    │   │
    │  │ 6. Auth Service        - JWT + passwords   │   │
    │  └─────────────────────────────────────────────┘   │
    └────────────────────┬────────────────────────────────┘
                         │
                         ▼
    ┌─────────────────────────────────────────────────────┐
    │          Data Access Layer (ORM)                    │
    │  ┌─────────────────────────────────────────────┐   │
    │  │ SQLAlchemy                                  │   │
    │  │ - Models: User, Analysis, SkillDetected     │   │
    │  │ - Relationships & constraints               │   │
    │  │ - Transaction management                    │   │
    │  └─────────────────────────────────────────────┘   │
    └────────────────────┬────────────────────────────────┘
                         │
                         ▼
    ┌─────────────────────────────────────────────────────┐
    │         Database Tier (PostgreSQL)                  │
    │  ┌─────────────────────────────────────────────┐   │
    │  │ users               (Authentication)         │   │
    │  │ analyses            (Analysis records)       │   │
    │  │ skills_detected     (Detected skills)       │   │
    │  │ interview_questions (Generated questions)   │   │
    │  │ skill_dictionary    (Skill reference)       │   │
    │  └─────────────────────────────────────────────┘   │
    └─────────────────────────────────────────────────────┘

External Services:
    ┌───────────────────────┐
    │   OpenAI API          │
    │ (Interview generation)│
    └───────────────────────┘
```

## Data Flow

### 1. Analysis Creation Flow

```
User Input (Resume + Job Desc)
    ↓
FileUpload Component (React)
    ↓
POST /api/analysis
    ↓
[Auth Middleware] - Verify JWT token
    ↓
[Validation] - Check text length
    ↓
SkillMatcher Service:
  1. SkillExtractor.extract_required_skills()
     └─> Detect skills from job description
  
  2. SkillExtractor.extract_resume_skills()
     └─> Detect skills from resume
  
  3. For each required skill:
     a. EvidenceFinder.find_evidence_sentences()
        └─> Find relevant sentences in resume
     
     b. EvidenceFinder.classify_evidence()
        └─> Classify as VERIFIED/SUPPORTED/CLAIMED/UNCERTAIN
     
     c. EvidenceFinder.determine_skill_depth()
        └─> Determine BEGINNER/INTERMEDIATE/ADVANCED
  
  4. Calculate metrics:
     - skill_match_percentage
     - evidence_coverage_score
     - interview_readiness_score
    ↓
Create Analysis record in database
    ↓
Create SkillDetected records for each skill
    ↓
Return AnalysisResponse to frontend
    ↓
Display results in AnalysisResults component
```

### 2. Interview Question Generation Flow

```
User Clicks "Generate Interview Questions"
    ↓
GET /api/analysis/{id}/interview-questions
    ↓
[Auth Middleware] - Verify JWT
    ↓
Get analysis and detected skills
    ↓
For each skill (top 5):
  
  LLMService.generate_interview_questions():
    1. Adjust difficulty based on evidence
       - VERIFIED + ADVANCED → Ask advanced
       - SUPPORTED + INTERMEDIATE → Ask intermediate
       - CLAIMED → Ask beginner (verify)
    
    2. Build OpenAI prompt
    
    3. Call OpenAI API
    
    4. Parse response (JSON)
    
    5. Store in database
    
    6. Return with full details
    ↓
Display questions in tab view
    ↓
User can read expected answers and resources
```

## Key Components

### Frontend Components

#### Authentication Layer
- **Login.tsx** - User login with JWT
- **Register.tsx** - User registration
- **ProtectedRoute.tsx** - Route protection

#### Analysis Components
- **FileUpload.tsx** - Resume/Job description input
- **AnalysisResults.tsx** - Display matched skills
- **Interview Questions UI** - Display AI-generated questions

#### Pages
- **Home.tsx** - Upload interface + dashboard
- **AnalysisDetail.tsx** - Full analysis view with tabs

### Backend Services

#### Text Extraction
```python
extract_text_from_file(content, filename) → str
```
Supports PDF and TXT formats with encoding detection.

#### Skill Detection
```python
extractor = SkillExtractor()
skills = extractor.extract_resume_skills(text) → Dict[str, Dict]
```
Uses dictionary matching with variations and aliases.

#### Evidence Classification
```python
finder = EvidenceFinder()
status, confidence = finder.classify_evidence(text, skill) → (EvidenceStatus, float)
```
ML-inspired pattern matching for evidence classification.

#### Skill Matching
```python
matcher = SkillMatcher()
results = matcher.match_skills(resume, job_desc) → Dict
```
Orchestrates full analysis pipeline.

#### LLM Integration
```python
llm = LLMService()
questions = llm.generate_interview_questions(
    skill, depth, evidence, years
) → List[Dict]
```
OpenAI integration with fallback to mock questions.

## Data Models

### User
```
id: UUID
email: VARCHAR (unique)
password_hash: VARCHAR
name: VARCHAR
profile_picture: VARCHAR (optional)
is_active: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Analysis
```
id: UUID
user_id: UUID (FK)
resume_text: TEXT
job_description_text: TEXT
skill_match_percentage: FLOAT
evidence_coverage_score: FLOAT
interview_readiness_score: FLOAT
analysis_date: TIMESTAMP
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### SkillDetected
```
id: UUID
analysis_id: UUID (FK)
skill_name: VARCHAR
status: ENUM (VERIFIED, SUPPORTED, CLAIMED, UNCERTAIN)
evidence_text: TEXT
confidence_score: FLOAT (0-1)
depth_level: ENUM (BEGINNER, INTERMEDIATE, ADVANCED)
years_of_experience: FLOAT
last_used: VARCHAR (date string)
is_required: BOOLEAN
match_percentage: FLOAT
created_at: TIMESTAMP
```

### InterviewQuestion
```
id: UUID
analysis_id: UUID (FK)
skill_name: VARCHAR
difficulty_level: ENUM
question_text: TEXT
expected_answer: TEXT
resources: JSON (List)
question_type: VARCHAR
created_at: TIMESTAMP
```

## Authentication & Authorization

### JWT Flow
```
1. User registers/logs in
2. Backend creates access_token (30 min) and refresh_token (7 days)
3. Frontend stores tokens in localStorage
4. Every API request includes: Authorization: Bearer {access_token}
5. Backend validates token in middleware
6. When access_token expires:
   - Frontend uses refresh_token to get new access_token
   - Transparently continues operation
```

### Password Security
- Bcrypt hashing (12 rounds)
- Never stored in plain text
- Min 8 characters, uppercase, lowercase, numbers required

## Performance Optimizations

### Frontend
- **Code Splitting** - React Router lazy loading
- **Component Memoization** - React.memo where appropriate
- **Redux** - Selective subscriptions
- **Image Optimization** - MUI built-in
- **Bundle Size** - ~400KB gzipped (with tree-shaking)

### Backend
- **Connection Pooling** - 20-50 PostgreSQL connections
- **Database Indexes** - On user_id, analysis_id, skill_name
- **Query Optimization** - SQLAlchemy query profiling
- **Caching** - Future Redis integration

### Database
- **Indexing Strategy**:
  ```sql
  CREATE INDEX idx_analyses_user_id ON analyses(user_id);
  CREATE INDEX idx_skills_analysis_id ON skills_detected(analysis_id);
  CREATE INDEX idx_skills_name ON skills_detected(skill_name);
  ```

## Error Handling

### Frontend
- Try-catch blocks in async functions
- User-friendly error messages
- Automatic token refresh on 401
- Fallback UI for failures

### Backend
- Pydantic validation errors → 422
- Auth errors → 401
- Not found → 404
- Server errors → 500 with logging

## Security Measures

1. **Authentication**
   - JWT tokens with expiration
   - Secure password hashing

2. **Authorization**
   - User-scoped data access
   - No horizontal privilege escalation

3. **Input Validation**
   - Pydantic schemas
   - Zod validation (frontend)
   - File type checking

4. **Data Protection**
   - HTTPS recommended
   - CORS configuration
   - SQL injection prevention (ORM)
   - XSS prevention (React escaping)

## Scalability Considerations

### Current (Single Server)
- ~100 concurrent users
- ~10,000 analyses per day
- Supports up to 1GB databases

### Future Enhancements
- **Horizontal Scaling**: Docker containerization
- **Load Balancing**: Nginx/HAProxy
- **Caching**: Redis for benchmarks/market data
- **Task Queue**: Celery for async processing
- **Database Replication**: Master-slave setup
- **CDN**: For frontend assets

## Deployment Architecture

### Development
```
localhost:3000 (React)
         ↓ HTTP
localhost:8000 (FastAPI)
         ↓
localhost/PostgreSQL
```

### Production (Recommended)
```
CDN → Static Frontend
  ↓
Nginx (reverse proxy)
  ↓
Gunicorn/Uvicorn (FastAPI)
  ↓
PostgreSQL (RDS/Managed)
  ↓
OpenAI API (external)
```

## Future Roadmap

### Phase 2 (Learning Paths)
- Week-by-week curriculum generation
- Resource recommendations
- Progress tracking
- Skill milestones

### Phase 3 (Advanced Analytics)
- Benchmarking against industry
- Market demand analysis
- Salary predictions
- Career path recommendations

### Phase 4 (AI Enhancements)
- Mock interview simulator
- Conversation analysis
- Skill gap identification
- Personalized learning suggestions

### Phase 5 (Scaling)
- Kubernetes deployment
- Horizontal scaling
- Advanced caching
- Real-time WebSocket updates

## Monitoring & Logging

### Metrics to Track
- Response time (p50, p95, p99)
- Error rate
- API throughput
- Database query time
- Token refresh rate
- LLM API latency

### Logging Strategy
```python
logger.info("User {user_id} created analysis {analysis_id}")
logger.warning("Unverified skill claim: {skill_name}")
logger.error("LLM API error: {error}", exc_info=True)
```

## Testing Strategy

### Unit Tests
- Service functions
- Evidence classification
- Skill matching logic
- Auth utilities

### Integration Tests
- API endpoints
- Database interactions
- Full analysis pipeline
- Auth flow

### E2E Tests (Future)
- Entire user journey
- Multi-browser testing
- Performance benchmarks

---

**Last Updated**: 2024-08-13
**Version**: 1.0.0 (MVP)
