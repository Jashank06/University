import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, PieChart, Pie, Cell, ComposedChart, Area, Line,
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

const AdmissionTrends = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admission-trends`);
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

    if (loading) return <div className="loading">📊 Loading admission data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const totalAdmissions = data?.yearWise?.reduce((sum, item) => sum + parseInt(item.admissions), 0) || 0;
    const latestYear = data?.yearWise?.[data.yearWise.length - 1];
    const previousYear = data?.yearWise?.[data.yearWise.length - 2];
    const growth = previousYear ?
        ((latestYear?.admissions - previousYear?.admissions) / previousYear?.admissions * 100).toFixed(1) : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">📊 Admission Trends</h1>
                <p className="dashboard-subtitle">
                    Comprehensive analysis of university admissions across years, courses, and student demographics
                </p>
            </div>

            {/* Premium Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">🎓 Total Admissions</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalAdmissions} duration={2500} separator="," />
                    </div>
                    <div className="stat-change positive">↑ Cumulative enrollments</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📅 Latest Year ({latestYear?.year})</div>
                    <div className="stat-value">
                        <AnimatedCounter end={latestYear?.admissions || 0} duration={2000} separator="," />
                    </div>
                    <div className={`stat-change ${growth > 0 ? 'positive' : 'negative'}`}>
                        {growth > 0 ? '↑' : '↓'} {Math.abs(growth)}% YoY growth
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">📚 Active Programs</div>
                    <div className="stat-value">
                        <AnimatedCounter end={Object.keys(data?.courseWise || {}).length} duration={1800} />
                    </div>
                    <div className="stat-change">Courses offered</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">👥 Diversity Index</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.genderWise?.length || 0} duration={1500} />
                    </div>
                    <div className="stat-change success">Categories tracked</div>
                </div>
            </div>

            {/* Year-wise Admissions - Enhanced Combo Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📈 Year-wise Enrollment Trends</h3>
                        <p className="chart-subtitle">Student admission patterns over the years with growth trajectory</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data?.yearWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.3} />
                                </linearGradient>
                                <linearGradient id="barAdmissions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.blue[0]} stopOpacity={0.9} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.blue[1]} stopOpacity={0.7} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis dataKey="year" {...AXIS_STYLE} />
                            <YAxis {...AXIS_STYLE} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Bar
                                dataKey="admissions"
                                fill="url(#barAdmissions)"
                                radius={[12, 12, 0, 0]}
                                name="Admissions"
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="admissions"
                                stroke={PREMIUM_GRADIENTS.pink[0]}
                                strokeWidth={3}
                                dot={{ r: 6, fill: PREMIUM_GRADIENTS.pink[0], strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 8 }}
                                name="Trend"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two Column Charts */}
            <div className="dashboard-grid">
                {/* Gender Distribution - Enhanced Donut */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">👥 Gender Diversity</h3>
                            <p className="chart-subtitle">Student demographics distribution</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    <linearGradient id="genderGrad0" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PREMIUM_GRADIENTS.blue[0]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={PREMIUM_GRADIENTS.blue[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                    <linearGradient id="genderGrad1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PREMIUM_GRADIENTS.pink[0]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={PREMIUM_GRADIENTS.pink[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                    <linearGradient id="genderGrad2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={PREMIUM_GRADIENTS.green[0]} stopOpacity={1} />
                                        <stop offset="100%" stopColor={PREMIUM_GRADIENTS.green[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <Pie
                                    data={data?.genderWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={premiumPieLabel}
                                    animationDuration={1500}
                                >
                                    {data?.genderWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#genderGrad${index})`}
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

                {/* Category Distribution - Enhanced Donut */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🏷️ Category Distribution</h3>
                            <p className="chart-subtitle">Admissions by reservation category</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    {VIBRANT_COLORS.slice(0, 6).map((color, index) => (
                                        <linearGradient key={`gradient-cat-${index}`} id={`catGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={data?.categoryWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={115}
                                    paddingAngle={4}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    animationDuration={1500}
                                >
                                    {data?.categoryWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#catGradient${index % 6})`}
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

            {/* Premium Refresh Indicator */}
            <div className="refresh-indicator">
                <span className="refresh-dot"></span>
                <span>Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshes every 30 seconds</span>
            </div>
        </div>
    );
};

export default AdmissionTrends;
