import React, { useEffect, useState } from 'react';
import { Job } from '../../types/job';
import { fetchJobs } from './job.api';
import Card from '../../components/common/Card';
import './JobList.css';

const JobList: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                const jobData = await fetchJobs();
                setJobs(jobData);
            } catch (err) {
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, []);

    if (loading) {
        return <div className="loading">Loading jobs...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="job-list">
            {jobs.map((job) => (
                <Card key={job.id} title={job.title} description={job.description} />
            ))}
        </div>
    );
};

export default JobList;