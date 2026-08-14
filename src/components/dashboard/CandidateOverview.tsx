import React from 'react';
import { useCandidates } from '../../features/candidates/candidate.api';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import './CandidateOverview.css';

const CandidateOverview: React.FC = () => {
    const { candidates, loading, error } = useCandidates();

    if (loading) {
        return <div className="loading">Loading candidates...</div>;
    }

    if (error) {
        return <div className="error">Error loading candidates: {error.message}</div>;
    }

    return (
        <div className="candidate-overview">
            <h2>Candidate Overview</h2>
            <div className="candidate-list">
                {candidates.map(candidate => (
                    <Card key={candidate.id} className="candidate-card">
                        <h3>{candidate.name}</h3>
                        <p>{candidate.skills.join(', ')}</p>
                        <Button onClick={() => handleViewDetails(candidate.id)}>View Details</Button>
                    </Card>
                ))}
            </div>
        </div>
    );

    function handleViewDetails(candidateId: string) {
        // Logic to navigate to candidate detail page
    }
};

export default CandidateOverview;