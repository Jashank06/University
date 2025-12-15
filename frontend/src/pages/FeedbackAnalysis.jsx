import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis, PolarGrid,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    VIBRANT_COLORS,
    PREMIUM_GRADIENTS,
    PremiumTooltip,
    AXIS_STYLE,
    GRID_STYLE
} from '../utils/PremiumChartConfig';
import '../styles/Dashboard.css';

const FeedbackAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/feedback-analysis`);
            setData(response.data.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="loading">⭐ Loading feedback data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const avgRating = data?.facultyRatings?.reduce((sum, item) =>
        sum + parseFloat(item.averageRating), 0) / (data?.facultyRatings?.length || 1);

    // Convert rating to emoji
    const getRatingEmoji = (rating) => {
        if (rating >= 4.5) return '😍'; // Excellent
        if (rating >= 4.0) return '😊'; // Very Good
        if (rating >= 3.5) return '🙂'; // Good
        if (rating >= 3.0) return '😐'; // Average
        return '😟'; // Needs Improvement
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">⭐ Feedback Analysis</h1>
                <p className="dashboard-subtitle">
                    Student feedback ratings, faculty performance metrics, and satisfaction analytics
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">⭐ Average Rating</div>
                    <div className="stat-value">
                        <AnimatedCounter end={avgRating} duration={2000} decimals={2} suffix="/5" />
                    </div>
                    <div className="stat-change">
                        {getRatingEmoji(avgRating)} Overall satisfaction
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🏆 Top Rated Faculty</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.topRatedFaculty?.length || 0} duration={2000} />
                    </div>
                    <div className="stat-change positive">↑ Rating ≥ 4.0/5</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">⚠️ Needs Improvement</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.lowRatedFaculty?.length || 0} duration={2000} />
                    </div>
                    <div className="stat-change negative">Rating &lt; 3.0/5</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📊 Total Responses</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.raw?.length || 0} duration={2500} separator="," />
                    </div>
                    <div className="stat-change success">Feedback received</div>
                </div>
            </div>

            {/* Faculty Ratings - Enhanced Horizontal Bars */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📊 Faculty Performance Ratings</h3>
                        <p className="chart-subtitle">Average student feedback ratings by faculty member</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart
                            data={data?.facultyRatings?.slice(0, 15) || []}
                            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                        >
                            <defs>
                                <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis
                                dataKey="faculty"
                                {...AXIS_STYLE}
                                angle={-45}
                                textAnchor="end"
                                height={120}
                            />
                            <YAxis {...AXIS_STYLE} domain={[0, 5]} />
                            <Tooltip content={<PremiumTooltip formatter={(value) => `${value}/5`} />} />
                            <Bar
                                dataKey="averageRating"
                                fill="url(#colorRating)"
                                radius={[12, 12, 0, 0]}
                                name="Rating"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Program Ratings */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">🎓 Program Satisfaction Scores</h3>
                        <p className="chart-subtitle">Student satisfaction by academic program</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data?.programRatings || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <defs>
                                <linearGradient id="colorProgram" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.teal[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.teal[1]} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis
                                dataKey="program"
                                {...AXIS_STYLE}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis {...AXIS_STYLE} domain={[0, 5]} />
                            <Tooltip content={<PremiumTooltip formatter={(value) => `${value}/5`} />} />
                            <Bar
                                dataKey="averageRating"
                                fill="url(#colorProgram)"
                                radius={[12, 12, 0, 0]}
                                name="Rating"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Rated Faculty Cards */}
            {data?.topRatedFaculty?.length > 0 && (
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🏆 Excellence in Teaching</h3>
                            <p className="chart-subtitle">Top performing faculty members</p>
                        </div>
                    </div>
                    <div className="alert-badge success">
                        ✨ {data.topRatedFaculty.length} faculty members with outstanding ratings (≥ 4.0/5)
                    </div>
                    <div className="student-cards-grid">
                        {data.topRatedFaculty.slice(0, 6).map((faculty, index) => {
                            const rating = parseFloat(faculty.averageRating);
                            return (
                                <div key={index} className="student-card top-performer">
                                    <div className="student-name">{faculty.faculty}</div>
                                    <div className="student-score" style={{
                                        background: rating >= 4.5
                                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        {getRatingEmoji(rating)} {rating.toFixed(2)}/5
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>
                                        📝 {faculty.feedbackCount} responses
                                    </div>
                                    <span className="student-status top">
                                        {rating >= 4.5 ? 'Exceptional' : 'Excellent'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Low Rated Faculty Table */}
            {data?.lowRatedFaculty?.length > 0 && (
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">⚠️ Development Opportunities</h3>
                            <p className="chart-subtitle">Faculty requiring support and mentorship</p>
                        </div>
                    </div>
                    <div className="alert-badge warning">
                        📢 {data.lowRatedFaculty.length} faculty member(s) below 3.0 rating threshold
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Faculty Member</th>
                                    <th>Rating</th>
                                    <th>Responses</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.lowRatedFaculty.map((faculty, index) => {
                                    const rating = parseFloat(faculty.averageRating);
                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: '700' }}>{faculty.faculty}</td>
                                            <td style={{
                                                fontWeight: '700',
                                                fontSize: '1.125rem',
                                                color: rating < 2.5 ? '#ef4444' : '#f59e0b'
                                            }}>
                                                {getRatingEmoji(rating)} {rating.toFixed(2)}/5
                                            </td>
                                            <td>{faculty.feedbackCount}</td>
                                            <td>
                                                <span className={`student-status ${rating < 2.5 ? 'at-risk' : 'average'}`}>
                                                    {rating < 2.5 ? 'Critical' : 'Needs Support'}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                Priority intervention
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Premium Refresh Indicator */}
            <div className="refresh-indicator">
                <span className="refresh-dot"></span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30 seconds</span>
            </div>
        </div>
    );
};

export default FeedbackAnalysis;
