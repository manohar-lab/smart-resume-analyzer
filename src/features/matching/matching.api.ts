import { api } from '../../lib/api';
import { MatchRequest, MatchResponse } from '../../types/match';

export const matchCandidates = async (requestData: MatchRequest): Promise<MatchResponse> => {
    const response = await api.post<MatchResponse>('/matching/match', requestData);
    return response.data;
};

export const getMatchSummary = async (matchId: string): Promise<MatchResponse> => {
    const response = await api.get<MatchResponse>(`/matching/summary/${matchId}`);
    return response.data;
};