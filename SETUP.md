# Installation & Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Python 3.11+ ([Download](https://www.python.org/downloads/))
- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 15+ ([Download](https://www.postgresql.org/download/))
- Git ([Download](https://git-scm.com/))

## Backend Setup

### Step 1: Create PostgreSQL Database
```sql
-- In PostgreSQL
CREATE DATABASE evimatch;
CREATE USER evimatch_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE evimatch TO evimatch_user;
```

Or using command line:
```bash
psql -U postgres -c "CREATE DATABASE evimatch;"
psql -U postgres -c "CREATE USER evimatch_user WITH PASSWORD 'your_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE evimatch TO evimatch_user;"
```

### Step 2: Configure Backend
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env file with your settings
# KEY VARIABLES TO SET:
# - DATABASE_URL=postgresql://evimatch_user:your_password@localhost:5432/evimatch
# - SECRET_KEY=your-very-long-secret-key-at-least-32-chars
# - OPENAI_API_KEY=sk-your-openai-api-key (optional)
```

### Step 3: Initialize Database
```bash
python -c "from app.database.session import init_db; init_db()"
```

### Step 4: Run Backend Server
```bash
python main.py
```

✅ Backend running at `http://localhost:8000`
📖 API docs at `http://localhost:8000/docs`

## Frontend Setup

### Step 1: Configure Frontend
```bash
cd frontend

# Create .env file
cp .env.example .env

# .env contents:
# VITE_API_URL=http://localhost:8000/api
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

✅ Frontend running at `http://localhost:3000`

## Test the Application

### 1. Open Browser
Navigate to `http://localhost:3000`

### 2. Create Account
- Click "Sign Up"
- Enter email, name, password
- Click "Create Account"

### 3. Try Analysis
- Paste or upload a resume (or use this sample)
- Paste or upload a job description
- Click "Analyze Skills"
- View results

### Sample Resume
```
Senior Software Engineer
Experienced Python developer with 5+ years building scalable applications.

Experience
- Led team of 5 developers building microservices using Python, FastAPI, and PostgreSQL
- Designed and implemented Docker containerization for 20+ services
- Deployed applications on AWS using Lambda, RDS, and S3
- Optimized database queries reducing latency by 60%

Skills
Python, JavaScript, React, FastAPI, Django, Docker, Kubernetes, AWS, PostgreSQL, MongoDB, Git
```

### Sample Job Description
```
Senior Full Stack Engineer - Fintech Company

Required Skills
- Python or JavaScript (5+ years)
- React or Vue.js
- PostgreSQL or MongoDB
- Docker and Kubernetes
- AWS or Google Cloud
- RESTful API design
- Git and GitHub

Responsibilities
- Build scalable backend services
- Design databases
- Deploy to cloud platforms
- Lead technical discussions
- Mentor junior developers
```

## Common Issues & Solutions

### Issue: "Connection refused" on API calls
**Solution:**
```bash
# Check if backend is running
ps aux | grep python

# If not running, start it
cd backend
source venv/bin/activate  # venv\Scripts\activate on Windows
python main.py
```

### Issue: "Database connection error"
**Solution:**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1;"

# Verify DATABASE_URL in backend/.env
# Format: postgresql://user:password@localhost:5432/dbname

# Reinitialize database
python -c "from app.database.session import init_db; init_db()"
```

### Issue: "npm ERR! code ERESOLVE"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Use legacy peer deps
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest
```

### Issue: "ModuleNotFoundError: No module named 'app'"
**Solution:**
```bash
# Make sure you're in backend directory
cd backend

# Verify PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: OpenAI errors (Optional feature)
**Solution:**
```bash
# Get API key from https://openai.com/api/
# Add to backend/.env
OPENAI_API_KEY=sk-your-key-here

# Test connection
python -c "from app.services import LLMService; print(LLMService().is_available())"
```

## Project Information

### Backend Technologies
- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: JWT with PyJWT
- **API Docs**: Swagger UI at `/docs`

### Frontend Technologies  
- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI v5
- **State**: Redux Toolkit
- **HTTP**: Axios
- **Build**: Vite

### Development Workflow

**Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Build for Production:**
```bash
# Backend (using Gunicorn)
pip install gunicorn
gunicorn -w 4 app.main:app

# Frontend
npm run build
# Outputs optimized build to dist/
```

## File Structure Quick Reference

```
backend/
├── app/
│   ├── main.py           ← Start here for API
│   ├── models/           ← Database schemas
│   ├── routes/           ← API endpoints
│   └── services/         ← Business logic
├── main.py              ← Entry point
└── requirements.txt     ← Dependencies

frontend/
├── src/
│   ├── App.tsx          ← Main app component
│   ├── pages/           ← Page components
│   ├── components/      ← Reusable components
│   ├── services/        ← API client
│   └── store/           ← Redux state
├── package.json         ← Dependencies
└── index.html           ← HTML template
```

## Environment Variables Reference

### Backend (.env)
```env
# Server
DEBUG=True                              # Set to False in production
APP_NAME=EviMatch API

# Database (IMPORTANT!)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname

# Security
SECRET_KEY=your-secret-key-32-chars-min
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Features (Optional)
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Other
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## Next Steps

1. ✅ Get backend and frontend running
2. 🔐 Secure your SECRET_KEY in production
3. 🔑 Add OpenAI API key for interview questions (optional)
4. 🗄️ Back up your PostgreSQL database regularly
5. 📊 Monitor API performance
6. 🚀 Deploy to production

## Useful Commands

```bash
# Backend
python main.py                          # Start server
pytest tests/                           # Run tests
python -c "from app.database.session import init_db; init_db()"  # Reset DB

# Frontend  
npm run dev                            # Dev server
npm run build                          # Production build
npm run preview                        # Preview build
npm run lint                           # Check code quality
npm run type-check                     # Check TypeScript
```

## Getting Help

1. **API Documentation**: http://localhost:8000/docs (when running)
2. **Backend Logs**: Check console output from `python main.py`
3. **Frontend Logs**: Check browser console (F12)
4. **Database Issues**: Use `psql` CLI to inspect database

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Material-UI Docs**: https://mui.com/
- **Redux Toolkit**: https://redux-toolkit.js.org/

---

🎉 You're all set! Start analyzing resumes and job descriptions with EviMatch!
