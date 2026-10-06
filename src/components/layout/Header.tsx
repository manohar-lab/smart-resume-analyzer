import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
    return (
        <header className="header">
            <div className="header__logo">
                <Link to="/">EviMatch</Link>
            </div>
            <nav className="header__nav">
                <ul>
                    <li>
                        <Link to="/candidates">Candidates</Link>
                    </li>
                    <li>
                        <Link to="/jobs">Jobs</Link>
                    </li>
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/analytics">Analytics</Link>
                    </li>
                </ul>
            </nav>
            <div className="header__user">
                <Link to="/profile">Profile</Link>
            </div>
        </header>
    );
};

export default Header;