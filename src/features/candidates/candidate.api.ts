import { Candidate } from '../../types/candidate';
import { api } from '../../lib/api';

const BASE_URL = '/api/candidates';

export const fetchCandidates = async (): Promise<Candidate[]> => {
    const response = await api.get(`${BASE_URL}`);
    return response.data;
};

export const fetchCandidateById = async (id: string): Promise<Candidate> => {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createCandidate = async (candidateData: Candidate): Promise<Candidate> => {
    const response = await api.post(`${BASE_URL}`, candidateData);
    return response.data;
};

export const updateCandidate = async (id: string, candidateData: Candidate): Promise<Candidate> => {
    const response = await api.put(`${BASE_URL}/${id}`, candidateData);
    return response.data;
};

export const deleteCandidate = async (id: string): Promise<void> => {
    await api.delete(`${BASE_URL}/${id}`);
};