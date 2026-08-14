import { Job } from '../../types/job';
import { api } from '../../lib/api';

const JOBS_API_URL = '/api/jobs';

export const fetchJobs = async (): Promise<Job[]> => {
    const response = await api.get(JOBS_API_URL);
    return response.data;
};

export const fetchJobById = async (jobId: string): Promise<Job> => {
    const response = await api.get(`${JOBS_API_URL}/${jobId}`);
    return response.data;
};

export const createJob = async (jobData: Job): Promise<Job> => {
    const response = await api.post(JOBS_API_URL, jobData);
    return response.data;
};

export const updateJob = async (jobId: string, jobData: Job): Promise<Job> => {
    const response = await api.put(`${JOBS_API_URL}/${jobId}`, jobData);
    return response.data;
};

export const deleteJob = async (jobId: string): Promise<void> => {
    await api.delete(`${JOBS_API_URL}/${jobId}`);
};