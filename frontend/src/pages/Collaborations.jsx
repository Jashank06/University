import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    VIBRANT_COLORS,
    PREMIUM_GRADIENTS,
    PremiumTooltip,
    AXIS_STYLE,
    GRID_STYLE,
    formatCompactNumber,
    formatCurrency
} from '../utils/PremiumChartConfig';
import '../styles/Dashboard.css';

const Collaborations = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/research/collaborations`);
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

    if (loading) return <div className="loading">🤝 Loading collaborations data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const totalCollabs = data?.raw?.length || 0;
    const totalFunding = data?.raw?.reduce((sum, item) =>
        sum + parseFloat(item['Funding (INR)'] || 0), 0
    ) || 0;
    const avgFunding = totalCollabs > 0 ? totalFunding / totalCollabs : 0;
    const uniquePartners = new Set(data?.raw?.map(item => item.Partner)).size || 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">🤝 Research Collaborations</h1>
                <p className="dashboard-subtitle">
                    Strategic partnerships, industry collaborations, and research funding analytics
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">🔗 Total Collaborations</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalCollabs} duration={2000} />
                    </div>
                    <div className="stat-change">Active partnerships</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">💰 Total Funding</div>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>
                        ₹<AnimatedCounter end={totalFunding / 10000000} duration={2500} decimals={2} /> Cr
                    </div>
                    <div className="stat-change success">
                        🎯 Total research investment
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📊 Average Funding</div>
                    <div className="stat-value" style={{ fontSize: '2rem' }}>
                        ₹<AnimatedCounter end={avgFunding / 100000} duration={2000} decimals={2} /> L
                    </div>
                    <div className="stat-change">Per collaboration</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🌟 Unique Partners</div>
                    <div className="stat-value">
                        <AnimatedCounter end={uniquePartners} duration={2000} />
                    </div>
                    <div className="stat-change positive">
                        ↑ Diverse ecosystem
                    </div>
                </div>
            </div>

            {/* Year-wise Collaborations - Area Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📈 Year-wise Collaboration Growth</h3>
                        <p className="chart-subtitle">Partnership expansion timeline</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data?.yearWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorCollabs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.forest[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.forest[1]} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis dataKey="year" {...AXIS_STYLE} />
                            <YAxis {...AXIS_STYLE} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Bar
                                dataKey="count"
                                fill="url(#colorCollabs)"
                                radius={[12, 12, 0, 0]}
                                name="Collaborations"
                                animationDuration={1500}
                                animationEasing="ease-out"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two Column Charts */}
            <div className="dashboard-grid">
                {/* Collaboration Type Distribution */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📊 Collaboration Types</h3>
                            <p className="chart-subtitle">Partnership category breakdown</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    {VIBRANT_COLORS.map((color, index) => (
                                        <linearGradient key={`gradient-collab-${index}`} id={`collabGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={data?.typeWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {data?.typeWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#collabGradient${index % VIBRANT_COLORS.length})`}
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

                {/* Funding by Type */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">💸 Funding Distribution</h3>
                            <p className="chart-subtitle">Investment by collaboration type</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data?.fundingByType || []} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                <defs>
                                    <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.sunset[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.sunset[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid {...GRID_STYLE} />
                                <XAxis
                                    dataKey="type"
                                    {...AXIS_STYLE}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                />
                                <YAxis {...AXIS_STYLE} />
                                <Tooltip
                                    content={<PremiumTooltip formatter={(value) => formatCurrency(value)} />}
                                />
                                <Bar
                                    dataKey="funding"
                                    fill="url(#colorFunding)"
                                    radius={[12, 12, 0, 0]}
                                    name="Funding (INR)"
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Research Partners - Enhanced Horizontal Bars */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">🏆 Top Research Partners</h3>
                        <p className="chart-subtitle">Leading organizations by collaboration count</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={data?.topPartners?.slice(0, 10) || []}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="colorPartners" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.ocean[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.ocean[1]} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis type="number" {...AXIS_STYLE} />
                            <YAxis type="category" dataKey="partner" {...AXIS_STYLE} width={110} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Bar
                                dataKey="count"
                                fill="url(#colorPartners)"
                                radius={[0, 12, 12, 0]}
                                name="Collaborations"
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Collaborations Table */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📋 Recent Collaborations</h3>
                        <p className="chart-subtitle">Latest partnership activities</p>
                    </div>
                </div>
                <div className="alert-badge success">
                    ✨ {totalCollabs} active research partnerships
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Faculty</th>
                                <th>Partner Organization</th>
                                <th>Type</th>
                                <th>Funding</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.raw?.slice(0, 15).map((collab, index) => {
                                const funding = parseFloat(collab['Funding (INR)'] || 0);
                                return (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '700', color: '#667eea' }}>{collab.Year}</td>
                                        <td style={{ fontWeight: '600' }}>{collab.Faculty}</td>
                                        <td>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                border: '2px solid #e5e7eb'
                                            }}>
                                                {collab.Partner}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                                                color: '#065f46',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '10px',
                                                fontSize: '0.8125rem',
                                                fontWeight: '700'
                                            }}>
                                                {collab.Type}
                                            </span>
                                        </td>
                                        <td style={{
                                            fontWeight: '700',
                                            color: funding > 5000000 ? '#10b981' : funding > 1000000 ? '#f59e0b' : '#6b7280',
                                            fontSize: '0.9375rem'
                                        }}>
                                            ₹{formatCompactNumber(funding)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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

export default Collaborations;
