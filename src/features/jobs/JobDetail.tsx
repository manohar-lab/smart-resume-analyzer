import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJobDetails } from './job.api';
import { Job } from '../../types/job';
import './JobDetail.css';

const JobDetail: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getJobDetails = async () => {
            try {
                const jobData = await fetchJobDetails(jobId);
                setJob(jobData);
            } catch (err) {
                setError('Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        getJobDetails();
    }, [jobId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!job) {
        return <div className="no-job">No job details available</div>;
    }

    return (
        <div className="job-detail">
            <h1 className="job-title">{job.title}</h1>
            <div className="job-description">{job.description}</div>
            <div className="job-requirements">
                <h2>Requirements</h2>
                <ul>
                    {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                </ul>
            </div>
            <div className="job-location">
                <h2>Location</h2>
                <p>{job.location}</p>
            </div>
            <div className="job-salary">
                <h2>Salary</h2>
                <p>{job.salary}</p>
            </div>
        </div>
    );
};

export default JobDetail;