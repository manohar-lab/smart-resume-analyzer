import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have a CSS file for styling

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-title">EviMatch</h2>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" activeClassName="active-link">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/candidates" activeClassName="active-link">
                            Candidates
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/jobs" activeClassName="active-link">
                            Jobs
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/matching" activeClassName="active-link">
                            Matching
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/analytics" activeClassName="active-link">
                            Analytics
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;