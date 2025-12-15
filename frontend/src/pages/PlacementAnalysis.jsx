import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, PieChart, Pie, Cell, RadialBarChart, RadialBar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    VIBRANT_COLORS,
    PREMIUM_GRADIENTS,
    PremiumTooltip,
    AXIS_STYLE,
    GRID_STYLE,
    premiumPieLabel
} from '../utils/PremiumChartConfig';
import '../styles/Dashboard.css';

const PlacementAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/placement-analysis`);
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

    if (loading) return <div className="loading">🏆 Loading placement data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">🏆 Placement Analysis</h1>
                <p className="dashboard-subtitle">
                    Comprehensive career placement statistics, top recruiters, and compensation analytics
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">📊 Placement Rate</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.placementRate || 0} duration={2000} decimals={1} suffix="%" />
                    </div>
                    <div className="stat-change positive">↑ Overall success rate</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🎓 Students Placed</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.placedStudents?.length || 0} duration={2000} separator="," />
                    </div>
                    <div className="stat-change success">Successful placements</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">💰 Average Package</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.avgPackage || 0} duration={2500} decimals={2} suffix=" LPA" />
                    </div>
                    <div className="stat-change">Mean compensation</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🌟 Highest Package</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.maxPackage || 0} duration={2000} decimals={2} suffix=" LPA" />
                    </div>
                    <div className="stat-change success">🏅 Top offer secured</div>
                </div>
            </div>

            {/* Program-wise Placements - Enhanced Radial Bars */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">🎯 Program-wise Placement Success</h3>
                        <p className="chart-subtitle">Placement rate by academic program</p>
                    </div>
                </div>
                <div className="alert-badge success">
                    ✨ {data?.programWisePlacements?.length || 0} programs with active placements
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data?.programWisePlacements || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <defs>
                                <linearGradient id="colorPlacement" x1="0" y1="0" x2="0" y2="1">
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
                                dataKey="placementRate"
                                fill="url(#colorPlacement)"
                                radius={[12, 12, 0, 0]}
                                name="Placement Rate %"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
                {/* Top Companies - Enhanced Horizontal Bars */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🏢 Top Recruiting Companies</h3>
                            <p className="chart-subtitle">Highest student placement count</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data?.companyWise?.slice(0, 8) || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <defs>
                                    <linearGradient id="colorCompany" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid {...GRID_STYLE} />
                                <XAxis
                                    dataKey="company"
                                    {...AXIS_STYLE}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis {...AXIS_STYLE} />
                                <Tooltip content={<PremiumTooltip />} />
                                <Bar
                                    dataKey="studentsPlaced"
                                    fill="url(#colorCompany)"
                                    radius={[12, 12, 0, 0]}
                                    name="Students Placed"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Package Distribution - Enhanced Donut */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">💸 Salary Range Breakdown</h3>
                            <p className="chart-subtitle">Package distribution tiers</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    {VIBRANT_COLORS.map((color, index) => (
                                        <linearGradient key={`gradient-pkg-${index}`} id={`pkgGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={data?.packageRanges || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={4}
                                    dataKey="count"
                                    label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                                    animationDuration={1500}
                                >
                                    {data?.packageRanges?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#pkgGradient${index % VIBRANT_COLORS.length})`}
                                            stroke="#fff"
                                            strokeWidth={3}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<PremiumTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Premium Placed Students Table */}
            {data?.placedStudents?.length > 0 && (
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📋 Placement Details</h3>
                            <p className="chart-subtitle">Student-wise placement information</p>
                        </div>
                    </div>
                    <div className="alert-badge success">
                        🎉 {data.placedStudents.length} students successfully placed
                    </div>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>🥇 Rank</th>
                                    <th>Student Name</th>
                                    <th>Program</th>
                                    <th>Company</th>
                                    <th>Package (LPA)</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.placedStudents
                                    .sort((a, b) => parseFloat(b['Package (LPA)']) - parseFloat(a['Package (LPA)']))
                                    .slice(0, 20)
                                    .map((student, index) => {
                                        const pkg = parseFloat(student['Package (LPA)']);
                                        return (
                                            <tr key={index}>
                                                <td style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                                </td>
                                                <td style={{ fontWeight: '700', color: '#1f2937' }}>
                                                    {student['Student Name']}
                                                </td>
                                                <td>{student.program || student.Program}</td>
                                                <td>
                                                    <span style={{
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        color: 'white',
                                                        padding: '0.35rem 0.85rem',
                                                        borderRadius: '12px',
                                                        fontWeight: '700',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {student.Company}
                                                    </span>
                                                </td>
                                                <td style={{
                                                    color: pkg >= 10 ? '#10b981' : pkg >= 5 ? '#f59e0b' : '#6b7280',
                                                    fontWeight: '700',
                                                    fontSize: '1.125rem'
                                                }}>
                                                    {pkg.toFixed(2)}
                                                    {pkg >= 15 && ' 🌟'}
                                                </td>
                                                <td>
                                                    <span className="student-status top">
                                                        {student.Status}
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

export default PlacementAnalysis;
