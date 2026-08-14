import React from 'react';
import { useMatchSummary } from '../../features/matching/matching.api';
import Card from '../common/Card';
import './JobMatchSummary.css';

const JobMatchSummary: React.FC = () => {
    const { data, isLoading, error } = useMatchSummary();

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error loading match summary.</div>;
    }

    return (
        <div className="job-match-summary">
            <h2>Job Match Summary</h2>
            {data && data.length > 0 ? (
                data.map((match) => (
                    <Card key={match.jobId} className="match-card">
                        <h3>{match.jobTitle}</h3>
                        <p>Match Score: {match.matchScore}</p>
                        <p>Confidence Level: {match.confidenceLevel}</p>
                        <p>Skills Required: {match.skills.join(', ')}</p>
                    </Card>
                ))
            ) : (
                <p>No matches found.</p>
            )}
        </div>
    );
};

export default JobMatchSummary;