import React from 'react';
import './Button.css';

interface ButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
    size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
    label,
    onClick,
    disabled = false,
    variant = 'primary',
    size = 'medium',
}) => {
    return (
        <button
            className={`button ${variant} ${size}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;