// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  isActive: boolean;
  createdAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

// Analysis Types
export interface SkillDetected {
  id: string;
  skillName: string;
  status: 'VERIFIED' | 'SUPPORTED' | 'CLAIMED' | 'UNCERTAIN';
  evidenceText?: string;
  sourceSection?: string;
  confidenceScore: number;
  depthLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  yearsOfExperience?: number;
  lastUsed?: string;
  isRequired: boolean;
  matchPercentage?: number;
}

export interface Analysis {
  id: string;
  userId: string;
  resumeText: string;
  jobDescriptionText: string;
  skillMatchPercentage?: number;
  evidenceCoverageScore?: number;
  interviewReadinessScore?: number;
  analysisDate: string;
  createdAt: string;
  skillsDetected: SkillDetected[];
}

export interface AnalysisDetail extends Analysis {
  totalSkillsInResume: number;
  totalSkillsInJob: number;
  matchedSkills: number;
  missingSkills: string[];
}

export interface AnalysisRequest {
  resumeText: string;
  jobDescriptionText: string;
  resumeFilename?: string;
  jobDescriptionFilename?: string;
}

// Interview Question Types
export interface InterviewQuestion {
  id: string;
  skillName: string;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  questionText: string;
  expectedAnswer?: string;
  resources?: string[];
  questionType: string;
}

export interface InterviewQuestionsResponse {
  analysisId: string;
  totalQuestions: number;
  questions: InterviewQuestion[];
  interviewReadinessScore?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Analysis State Types
export interface AnalysisState {
  analyses: Analysis[];
  currentAnalysis: AnalysisDetail | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  isDarkMode: boolean;
  successMessage: string | null;
  errorMessage: string | null;
}
