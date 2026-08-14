import React, { useEffect, useState } from 'react';
import { fetchMatchResults } from './matching.api';
import MatchSummary from './MatchSummary';
import CandidateOverview from '../../components/dashboard/CandidateOverview';
import JobMatchSummary from '../../components/dashboard/JobMatchSummary';
import SkillVerificationPanel from '../../components/dashboard/SkillVerificationPanel';
import './MatchDashboard.css';

const MatchDashboard = () => {
    const [matchResults, setMatchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMatchResults = async () => {
            try {
                const results = await fetchMatchResults();
                setMatchResults(results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMatchResults();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="match-dashboard">
            <h1>Match Dashboard</h1>
            {matchResults && (
                <>
                    <MatchSummary results={matchResults.summary} />
                    <CandidateOverview candidates={matchResults.candidates} />
                    <JobMatchSummary jobs={matchResults.jobs} />
                    <SkillVerificationPanel skills={matchResults.skills} />
                </>
            )}
        </div>
    );
};

export default MatchDashboard;