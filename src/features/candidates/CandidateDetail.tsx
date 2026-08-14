import React from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { Candidate } from '../../types/candidate';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import './CandidateDetail.css';

const CandidateDetail: React.FC = () => {
    const { candidateId } = useParams<{ candidateId: string }>();
    const { data: candidate, error, isLoading } = useApi<Candidate>(`/api/candidates/${candidateId}`);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading candidate details.</div>;
    }

    return (
        <div className="candidate-detail">
            <Card>
                <h2>{candidate.name}</h2>
                <p><strong>Email:</strong> {candidate.email}</p>
                <p><strong>Phone:</strong> {candidate.phone}</p>
                <p><strong>Skills:</strong> {candidate.skills.join(', ')}</p>
                <p><strong>Experience:</strong> {candidate.experience} years</p>
                <Button onClick={() => alert('Contacting candidate...')}>Contact Candidate</Button>
            </Card>
        </div>
    );
};

export default CandidateDetail;