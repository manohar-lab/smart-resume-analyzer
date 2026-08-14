import React from 'react';
import { useMatchSummary } from './matching.api';
import { Card } from '../../components/common/Card';
import { ConfidenceMeter } from '../../components/analytics/ConfidenceMeter';
import { RiskIndicators } from '../../components/analytics/RiskIndicators';
import './MatchSummary.css';

const MatchSummary: React.FC = () => {
    const { summaryData, loading, error } = useMatchSummary();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading match summary.</div>;
    }

    return (
        <div className="match-summary">
            <h2>Match Summary</h2>
            <Card>
                <h3>Overall Match Score</h3>
                <ConfidenceMeter score={summaryData.matchScore} />
                <RiskIndicators risks={summaryData.risks} />
            </Card>
            <div className="details">
                <h4>Details</h4>
                <p>{summaryData.details}</p>
            </div>
        </div>
    );
};

export default MatchSummary;