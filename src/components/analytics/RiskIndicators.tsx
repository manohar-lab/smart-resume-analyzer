import React from 'react';
import { useEffect, useState } from 'react';
import { fetchRiskIndicators } from '../../features/matching/matching.api';
import { RiskIndicator } from '../../types/match';
import './RiskIndicators.css';

const RiskIndicators: React.FC = () => {
    const [riskIndicators, setRiskIndicators] = useState<RiskIndicator[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadRiskIndicators = async () => {
            try {
                const data = await fetchRiskIndicators();
                setRiskIndicators(data);
            } catch (err) {
                setError('Failed to load risk indicators');
            } finally {
                setLoading(false);
            }
        };

        loadRiskIndicators();
    }, []);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="risk-indicators">
            <h2>Risk Indicators</h2>
            <ul>
                {riskIndicators.map((indicator) => (
                    <li key={indicator.id} className={`risk-indicator ${indicator.level}`}>
                        <span>{indicator.name}</span>
                        <span>{indicator.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RiskIndicators;