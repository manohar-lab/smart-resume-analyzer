import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.css';

const MainLayout: React.FC = () => {
    return (
        <div className="main-layout">
            <Header />
            <div className="layout-content">
                <Sidebar />
                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;