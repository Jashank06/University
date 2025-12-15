import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, ComposedChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    VIBRANT_COLORS,
    PREMIUM_GRADIENTS,
    PremiumTooltip,
    AXIS_STYLE,
    GRID_STYLE,
    PremiumDot,
    PremiumActiveDot
} from '../utils/PremiumChartConfig';
import '../styles/Dashboard.css';

const ResultAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/result-analysis`);
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

    if (loading) return <div className="loading">📈 Loading result data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const avgPassRate = data?.programStats?.reduce((sum, item) =>
        sum + parseFloat(item.passPercentage), 0) / (data?.programStats?.length || 1);

    const totalBacklogs = data?.failedStudents?.length || 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">📈 Academic Results Analysis</h1>
                <p className="dashboard-subtitle">
                    Comprehensive performance metrics, pass/fail trends, and student achievement analytics
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">✅ Average Pass Rate</div>
                    <div className="stat-value">
                        <AnimatedCounter end={avgPassRate} duration={2000} decimals={1} suffix="%" />
                    </div>
                    <div className={`stat-change ${avgPassRate >= 75 ? 'positive' : 'negative'}`}>
                        {avgPassRate >= 75 ? '🎉' : '⚠️'} Academic performance
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📚 Total Backlogs</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalBacklogs} duration={2000} />
                    </div>
                    <div className="stat-change negative">Pending clearances</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🎓 Programs Analyzed</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.programStats?.length || 0} duration={1800} />
                    </div>
                    <div className="stat-change">Academic tracks</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📊 Subjects</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.courseWiseMarks?.length || 0} duration={1500} />
                    </div>
                    <div className="stat-change">Performance metrics</div>
                </div>
            </div>

            {/* Pass and Fail Percentage - Two Column Layout */}
            <div className="dashboard-grid">
                {/* Pass Percentage */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">✅ Pass Rates by Program</h3>
                            <p className="chart-subtitle">Student success metrics</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data?.programStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <defs>
                                    <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.green[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.green[1]} stopOpacity={0.7} />
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
                                <YAxis {...AXIS_STYLE} domain={[0, 100]} />
                                <Tooltip content={<PremiumTooltip formatter={(value) => `${value}%`} />} />
                                <Bar
                                    dataKey="passPercentage"
                                    fill="url(#colorPass)"
                                    radius={[12, 12, 0, 0]}
                                    name="Pass %"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fail Percentage */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">❌ Areas Needing Support</h3>
                            <p className="chart-subtitle">Intervention opportunities</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data?.programStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <defs>
                                    <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.fire[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.fire[1]} stopOpacity={0.7} />
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
                                <YAxis {...AXIS_STYLE} domain={[0, 100]} />
                                <Tooltip content={<PremiumTooltip formatter={(value) => `${value}%`} />} />
                                <Bar
                                    dataKey="failPercentage"
                                    fill="url(#colorFail)"
                                    radius={[12, 12, 0, 0]}
                                    name="Fail %"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Subject-wise Score Trend - Enhanced Area Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📊 Subject Performance Trends</h3>
                        <p className="chart-subtitle">Average scores across different subjects</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data?.courseWiseMarks || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis
                                dataKey="course"
                                {...AXIS_STYLE}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                            />
                            <YAxis {...AXIS_STYLE} domain={[0, 100]} />
                            <Tooltip content={<PremiumTooltip formatter={(value) => `${value}%`} />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Area
                                type="monotone"
                                dataKey="averageMarks"
                                fill="url(#colorScore)"
                                stroke={PREMIUM_GRADIENTS.purple[0]}
                                strokeWidth={3}
                                name="Average Score"
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="averageMarks"
                                stroke={PREMIUM_GRADIENTS.purple[0]}
                                strokeWidth={3}
                                dot={<PremiumDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                                activeDot={<PremiumActiveDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                                name="Trend"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Backlogs Table */}
            {data?.failedStudents?.length > 0 && (
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">⚠️ Backlog Analysis</h3>
                            <p className="chart-subtitle">Students requiring academic support</p>
                        </div>
                    </div>
                    <div className="alert-badge error">
                        🚨 {data.failedStudents.length} student(s) with backlogs - Immediate intervention required
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Program</th>
                                    <th>Course</th>
                                    <th>Marks Scored</th>
                                    <th>Result</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.failedStudents?.map((item, index) => {
                                    const marks = parseInt(item.Marks || 0);
                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: '700' }}>{item['Student Name']}</td>
                                            <td>{item.Program}</td>
                                            <td>{item.Course}</td>
                                            <td style={{
                                                color: marks < 40 ? '#ef4444' : '#f59e0b',
                                                fontWeight: '700',
                                                fontSize: '1.125rem'
                                            }}>
                                                {marks}%
                                            </td>
                                            <td>
                                                <span style={{
                                                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                                    color: '#991b1b',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '10px',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: '700'
                                                }}>
                                                    {item.Result}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`student-status ${marks < 30 ? 'at-risk' : 'average'}`}>
                                                    {marks < 30 ? 'Critical' : 'Need Support'}
                                                </span>
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

export default ResultAnalysis;
