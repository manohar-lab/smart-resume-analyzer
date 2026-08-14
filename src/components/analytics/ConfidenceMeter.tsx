import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ConfidenceMeterProps {
    confidenceLevel: number; // Confidence level between 0 and 100
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidenceLevel }) => {
    const { colors } = useTheme();

    const getMeterColor = () => {
        if (confidenceLevel >= 75) return colors.success;
        if (confidenceLevel >= 50) return colors.warning;
        return colors.danger;
    };

    return (
        <div style={{ width: '100%', backgroundColor: colors.background, borderRadius: '8px', padding: '10px' }}>
            <div
                style={{
                    width: `${confidenceLevel}%`,
                    backgroundColor: getMeterColor(),
                    height: '20px',
                    borderRadius: '8px',
                    transition: 'width 0.3s ease-in-out',
                }}
            />
            <div style={{ textAlign: 'center', marginTop: '5px', color: colors.text }}>
                Confidence Level: {confidenceLevel}%
            </div>
        </div>
    );
};

export default ConfidenceMeter;