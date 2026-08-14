import React from 'react';
import './Card.css';

interface CardProps {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, content, footer, className }) => {
    return (
        <div className={`card ${className}`}>
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-content">
                {content}
            </div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;