import React from 'react';
import { useSkillVerification } from '../../hooks/useSkillVerification';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import './SkillVerificationPanel.css';

const SkillVerificationPanel = () => {
    const { skills, verifySkill, loading, error } = useSkillVerification();

    return (
        <div className="skill-verification-panel">
            <h2>Skill Verification</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="skills-list">
                {skills.map(skill => (
                    <Card key={skill.id} className="skill-card">
                        <h3>{skill.name}</h3>
                        <p>Status: {skill.verified ? 'Verified' : 'Not Verified'}</p>
                        <Button 
                            onClick={() => verifySkill(skill.id)} 
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Verify Skill'}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SkillVerificationPanel;