import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar,
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
    PremiumActiveDot,
    premiumPieLabel
} from '../utils/PremiumChartConfig';
import '../styles/Dashboard.css';

const Patents = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/research/patents`);
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

    if (loading) return <div className="loading">💡 Loading patents data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const totalPatents = data?.raw?.length || 0;
    const grantedCount = data?.raw?.filter(p => p.Status?.toLowerCase().includes('granted')).length || 0;
    const filedCount = totalPatents - grantedCount;
    const internationalCount = data?.raw?.filter(p =>
        p['National/International']?.toLowerCase().includes('international')
    ).length || 0;
    const internationalPercentage = totalPatents > 0 ? ((internationalCount / totalPatents) * 100).toFixed(1) : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">💡 Patent Portfolio</h1>
                <p className="dashboard-subtitle">
                    Innovation metrics tracking patent filings, grants, and intellectual property development
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">📋 Total Patents</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalPatents} duration={2000} />
                    </div>
                    <div className="stat-change">Complete patent portfolio</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">✅ Granted Patents</div>
                    <div className="stat-value">
                        <AnimatedCounter end={grantedCount} duration={2000} />
                    </div>
                    <div className="stat-change success">
                        🎉 {((grantedCount / totalPatents) * 100).toFixed(1)}% success rate
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">⏳ Filed Patents</div>
                    <div className="stat-value">
                        <AnimatedCounter end={filedCount} duration={2000} />
                    </div>
                    <div className="stat-change">Under review process</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🌍 International Patents</div>
                    <div className="stat-value">
                        <AnimatedCounter end={internationalCount} duration={2000} />
                    </div>
                    <div className="stat-change positive">
                        ↑ {internationalPercentage}% global reach
                    </div>
                </div>
            </div>

            {/* Year-wise Patent Trends - Multi-line Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📈 Year-wise Patent Filings</h3>
                        <p className="chart-subtitle">Innovation growth trajectory over time</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data?.yearWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="strokePatents" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={PREMIUM_GRADIENTS.orange[0]} />
                                    <stop offset="100%" stopColor={PREMIUM_GRADIENTS.orange[1]} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis dataKey="year" {...AXIS_STYLE} />
                            <YAxis {...AXIS_STYLE} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="url(#strokePatents)"
                                strokeWidth={4}
                                name="Patents"
                                animationDuration={1500}
                                animationEasing="ease-out"
                                dot={<PremiumDot stroke={PREMIUM_GRADIENTS.orange[0]} />}
                                activeDot={<PremiumActiveDot stroke={PREMIUM_GRADIENTS.orange[0]} />}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two Column Charts */}
            <div className="dashboard-grid">
                {/* Patent Status - Enhanced Donut Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📊 Patent Status Distribution</h3>
                            <p className="chart-subtitle">Filed vs Granted breakdown</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    {VIBRANT_COLORS.slice(0, 4).map((color, index) => (
                                        <linearGradient key={`gradient-status-${index}`} id={`statusGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={data?.statusWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={premiumPieLabel}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {data?.statusWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#statusGradient${index % 4})`}
                                            stroke="#fff"
                                            strokeWidth={3}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<PremiumTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* National vs International */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🌏 Geographic Scope</h3>
                            <p className="chart-subtitle">National vs International distribution</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    <linearGradient id="natGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PREMIUM_GRADIENTS.green[0]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={PREMIUM_GRADIENTS.green[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                    <linearGradient id="intGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PREMIUM_GRADIENTS.blue[0]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={PREMIUM_GRADIENTS.blue[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={data?.scopeWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    animationDuration={1500}
                                >
                                    {data?.scopeWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.name.toLowerCase().includes('national') ? 'url(#natGrad)' : 'url(#intGrad)'}
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

            {/* Department-wise & Type-wise Charts */}
            <div className="dashboard-grid">
                {/* Department-wise Patents */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🏢 Department Innovation</h3>
                            <p className="chart-subtitle">Patents by academic department</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data?.departmentWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                <defs>
                                    <linearGradient id="colorDeptPatent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.pink[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.pink[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid {...GRID_STYLE} />
                                <XAxis
                                    dataKey="name"
                                    {...AXIS_STYLE}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis {...AXIS_STYLE} />
                                <Tooltip content={<PremiumTooltip />} />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorDeptPatent)"
                                    radius={[12, 12, 0, 0]}
                                    name="Patents"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Patent Type Distribution */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🔧 Patent Types</h3>
                            <p className="chart-subtitle">Distribution by patent category</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data?.typeWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <defs>
                                    <linearGradient id="colorType" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.teal[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.teal[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid {...GRID_STYLE} />
                                <XAxis dataKey="name" {...AXIS_STYLE} />
                                <YAxis {...AXIS_STYLE} />
                                <Tooltip content={<PremiumTooltip />} />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorType)"
                                    radius={[12, 12, 0, 0]}
                                    name="Count"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Premium Refresh Indicator */}
            <div className="refresh-indicator">
                <span className="refresh-dot"></span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30 seconds</span>
            </div>
        </div>
    );
};

export default Patents;
