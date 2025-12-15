import React, { useState } from 'react';
import Publications from './Publications';
import Patents from './Patents';
import Collaborations from './Collaborations';
import './Research.css';

const Research = () => {
    const [activeTab, setActiveTab] = useState('publications');

    const tabs = [
        { id: 'publications', label: 'Publications', icon: '📚' },
        { id: 'patents', label: 'Patents', icon: '💡' },
        { id: 'collaborations', label: 'Collaborations', icon: '🤝' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'publications':
                return <Publications />;
            case 'patents':
                return <Patents />;
            case 'collaborations':
                return <Collaborations />;
            default:
                return <Publications />;
        }
    };

    return (
        <div className="research-container">
            <div className="research-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`research-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
            <div className="research-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Research;
