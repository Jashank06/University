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
import { generatePDFReport } from '../utils/reportGenerator';

const PlacementAnalysis = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Filter State
    const [filters, setFilters] = useState({
        program: '',
        company: '',
        minPackage: '',
        status: ''
    });

    // Filter Options
    const [filterOptions, setFilterOptions] = useState({
        programs: [],
        companies: [],
        statuses: []
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.program) params.append('program', filters.program);
            if (filters.company) params.append('company', filters.company);
            if (filters.minPackage) params.append('minPackage', filters.minPackage);
            if (filters.status) params.append('status', filters.status);

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/placement-analysis?${params.toString()}`);
            setData(response.data.data);

            // Populate options from raw data on initial load
            if (filterOptions.programs.length === 0 && response.data.data.raw) {
                const raw = response.data.data.raw;
                const uniquePrograms = [...new Set(raw.map(item => item.program || item.Program))].filter(Boolean).sort();
                const uniqueCompanies = [...new Set(raw.map(item => item.Company))].filter(Boolean).sort();
                const uniqueStatuses = [...new Set(raw.map(item => item.Status))].filter(Boolean).sort();

                setFilterOptions({
                    programs: uniquePrograms,
                    companies: uniqueCompanies,
                    statuses: uniqueStatuses
                });
            }

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
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setFilters({
            program: '',
            company: '',
            minPackage: '',
            status: ''
        });
    };

    if (loading) return <div className="loading">🏆 Loading placement data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const handleDownloadReport = async () => {
        await generatePDFReport('placement-analysis-dashboard', 'Placement Analysis Report');
    };

    return (
        <div className="dashboard-container" id="placement-analysis-dashboard">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="dashboard-title">🏆 Placement Analysis</h1>
                    <p className="dashboard-subtitle">
                        Comprehensive career placement statistics, top recruiters, and compensation analytics
                    </p>
                </div>
                <button onClick={handleDownloadReport} className="download-btn">
                    📄 Download Report
                </button>
            </div>

            {/* Filter Bar */}
            <div className="filter-container">
                <div className="filter-group">
                    <label className="filter-label">Program</label>
                    <select name="program" value={filters.program} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Programs</option>
                        {filterOptions.programs.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Company</label>
                    <select name="company" value={filters.company} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Companies</option>
                        {filterOptions.companies.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Statuses</option>
                        {filterOptions.statuses.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group" style={{ flex: '0 0 160px' }}>
                    <label className="filter-label">Min Package (LPA)</label>
                    <input
                        type="number"
                        name="minPackage"
                        value={filters.minPackage}
                        onChange={handleFilterChange}
                        className="filter-input"
                        placeholder="0"
                        min="0"
                    />
                </div>

                {Object.values(filters).some(Boolean) && (
                    <button onClick={resetFilters} className="reset-filters-btn">
                        <span>↺</span> Reset
                    </button>
                )}
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
