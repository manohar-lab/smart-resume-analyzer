import React, { useEffect, useState } from 'react';
import { fetchCandidates } from './candidate.api';
import { CandidateCard } from '../../components/common/Card';
import './CandidateList.css';

const CandidateList = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCandidates = async () => {
            try {
                const data = await fetchCandidates();
                setCandidates(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCandidates();
    }, []);

    if (loading) {
        return <div className="loading">Loading candidates...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="candidate-list">
            <h2>Candidate List</h2>
            <div className="candidate-cards">
                {candidates.map(candidate => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
            </div>
        </div>
    );
};

export default CandidateList;