export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience: number; // in years
  education: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experienceRequired: number; // in years
}

export interface MatchResult {
  candidateId: string;
  jobId: string;
  matchScore: number; // percentage
  confidenceLevel: number; // percentage
  riskIndicators: string[];
}