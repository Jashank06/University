import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdmissionTrends from './pages/AdmissionTrends';
import AttendanceAnalytics from './pages/AttendanceAnalytics';
import ResultAnalysis from './pages/ResultAnalysis';
import FeedbackAnalysis from './pages/FeedbackAnalysis';
import PlacementAnalysis from './pages/PlacementAnalysis';
import Research from './pages/Research';
import './App.css';

function App() {
    return (
        <Router basename="/University">
            <div className="app">
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/admission-trends" replace />} />
                        <Route path="/admission-trends" element={<AdmissionTrends />} />
                        <Route path="/attendance-analytics" element={<AttendanceAnalytics />} />
                        <Route path="/result-analysis" element={<ResultAnalysis />} />
                        <Route path="/feedback-analysis" element={<FeedbackAnalysis />} />
                        <Route path="/placement-analysis" element={<PlacementAnalysis />} />
                        <Route path="/research" element={<Research />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
