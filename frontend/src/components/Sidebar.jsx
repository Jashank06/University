import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navItems = [
        {
            path: '/admission-trends',
            icon: '📊',
            label: 'Admission Trends',
            description: 'Year & program-wise analysis'
        },
        {
            path: '/attendance-analytics',
            icon: '📅',
            label: 'Attendance Analytics',
            description: 'Course & semester tracking'
        },
        {
            path: '/result-analysis',
            icon: '📈',
            label: 'Result Analysis',
            description: 'Pass/Fail & marks'
        },
        {
            path: '/feedback-analysis',
            icon: '⭐',
            label: 'Feedback Analysis',
            description: 'Faculty & program ratings'
        },
        {
            path: '/placement-analysis',
            icon: '🏆',
            label: 'Placement Analysis',
            description: 'Company & package data'
        },
        {
            path: '/research',
            icon: '🔬',
            label: 'Research',
            description: 'Publications, Patents & Collaborations'
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h1 className="university-name">
                    <span className="uni-icon">🎓</span>
                    Manav Rachna
                </h1>
                <p className="university-tagline">University Dashboard</p>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <div className="nav-content">
                            <span className="nav-label">{item.label}</span>
                            <span className="nav-description">{item.description}</span>
                        </div>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p className="footer-text">Real-time data from Google Sheets</p>
                <div className="status-indicator">
                    <span className="status-dot"></span>
                    <span className="status-text">Connected</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
