import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PolarAngleAxis
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

const AttendanceAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/attendance-analytics`);
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

    if (loading) return <div className="loading">📅 Loading attendance data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const avgAttendance = data?.courseWise?.reduce((sum, item) =>
        sum + parseFloat(item.averageAttendance), 0) / (data?.courseWise?.length || 1);

    const lowAttendanceCount = data?.lowAttendance?.length || 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">📅 Attendance Analytics</h1>
                <p className="dashboard-subtitle">
                    Real-time monitoring of student attendance trends across subjects and semesters
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">📊 Average Attendance</div>
                    <div className="stat-value">
                        <AnimatedCounter end={avgAttendance} duration={2000} decimals={1} suffix="%" />
                    </div>
                    <div className={`stat-change ${avgAttendance >= 75 ? 'positive' : 'negative'}`}>
                        {avgAttendance >= 75 ? '✅' : '⚠️'} Overall performance
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🚨 Low Attendance Alerts</div>
                    <div className="stat-value">
                        <AnimatedCounter end={lowAttendanceCount} duration={2000} />
                    </div>
                    <div className="stat-change negative">Below 75% threshold</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📚 Subjects Tracked</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.courseWise?.length || 0} duration={1800} />
                    </div>
                    <div className="stat-change">Active monitoring</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🎓 Semesters</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.semesterWise?.length || 0} duration={1500} />
                    </div>
                    <div className="stat-change">Academic periods</div>
                </div>
            </div>

            {/* Alert Badge */}
            {lowAttendanceCount > 0 && (
                <div className="alert-badge warning">
                    ⚠️ {lowAttendanceCount} student(s) with attendance below 75% - Immediate attention required
                </div>
            )}

            {/* Subject-wise Attendance - Enhanced Area Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📊 Subject-wise Attendance</h3>
                        <p className="chart-subtitle">Average attendance percentage distribution by subject</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data?.courseWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <defs>
                                <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.blue[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.blue[1]} stopOpacity={0.7} />
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
                            <Bar
                                dataKey="averageAttendance"
                                fill="url(#colorAttendance)"
                                radius={[12, 12, 0, 0]}
                                name="Attendance %"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Semester-wise Trends - Premium Line + Area */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📈 Semester-wise Attendance Trends</h3>
                        <p className="chart-subtitle">Attendance evolution across academic semesters</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data?.semesterWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorSemester" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.2} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis dataKey="semester" {...AXIS_STYLE} />
                            <YAxis {...AXIS_STYLE} domain={[0, 100]} />
                            <Tooltip content={<PremiumTooltip formatter={(value) => `${value}%`} />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Area
                                type="monotone"
                                dataKey="averageAttendance"
                                stroke={PREMIUM_GRADIENTS.purple[0]}
                                strokeWidth={3}
                                fill="url(#colorSemester)"
                                name="Attendance %"
                                animationDuration={1500}
                                dot={<PremiumDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                                activeDot={<PremiumActiveDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Low Attendance Students Table */}
            {lowAttendanceCount > 0 && (
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">⚠️ Students Requiring Intervention</h3>
                            <p className="chart-subtitle">Low attendance cases needing immediate action</p>
                        </div>
                    </div>
                    <div className="alert-badge error">
                        🚨 Priority intervention needed for {lowAttendanceCount} student(s)
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>🆔 Student ID</th>
                                    <th>Student Name</th>
                                    <th>Subject</th>
                                    <th>Semester</th>
                                    <th>Attendance %</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.lowAttendance?.map((student, index) => {
                                    const attendance = parseFloat(student.AttendancePercentage);
                                    return (
                                        <tr key={index}>
                                            <td style={{ fontWeight: '700', color: '#667eea' }}>
                                                {student.StudentID}
                                            </td>
                                            <td style={{ fontWeight: '600' }}>{student.StudentName}</td>
                                            <td>{student.Subject}</td>
                                            <td>{student.Semester}</td>
                                            <td style={{
                                                color: attendance < 60 ? '#ef4444' : attendance < 75 ? '#f59e0b' : '#10b981',
                                                fontWeight: '700',
                                                fontSize: '1.125rem'
                                            }}>
                                                {attendance.toFixed(1)}%
                                            </td>
                                            <td>
                                                <span className={`student-status ${attendance < 60 ? 'at-risk' : 'average'}`}>
                                                    {attendance < 60 ? 'Critical' : 'Warning'}
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

export default AttendanceAnalytics;
