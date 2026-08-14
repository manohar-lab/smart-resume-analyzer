export interface Match {
    candidateId: string;
    jobId: string;
    matchScore: number;
    confidenceLevel: number;
    skillsVerified: boolean;
    riskIndicators: RiskIndicator[];
}

export interface RiskIndicator {
    skill: string;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
}

export interface MatchSummary {
    totalMatches: number;
    successfulMatches: number;
    failedMatches: number;
    matchDetails: Match[];
}