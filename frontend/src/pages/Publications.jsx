import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
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
import { generatePDFReport } from '../utils/reportGenerator';

const Publications = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Filter State
    const [filters, setFilters] = useState({
        faculty: '',
        department: '',
        type: '',
        journalName: '',
        journalType: ''
    });

    // Filter Options
    const [filterOptions, setFilterOptions] = useState({
        faculties: [],
        departments: [],
        types: [],
        journalNames: [],
        journalTypes: []
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.faculty) params.append('faculty', filters.faculty);
            if (filters.department) params.append('department', filters.department);
            if (filters.type) params.append('type', filters.type);
            if (filters.journalName) params.append('journalName', filters.journalName);
            if (filters.journalType) params.append('journalType', filters.journalType);

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/research/publications?${params.toString()}`);
            setData(response.data.data);

            // Populate options from raw data on initial load
            if (filterOptions.faculties.length === 0 && response.data.data.raw) {
                const raw = response.data.data.raw;
                const getUnique = (key) => [...new Set(raw.map(item => item[key]))].filter(Boolean).sort();

                setFilterOptions({
                    faculties: getUnique('Faculty'),
                    departments: getUnique('Department'),
                    types: getUnique('Type'),
                    journalNames: getUnique('Name of the Journal'),
                    journalTypes: getUnique('Type of Journal')
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
            faculty: '',
            department: '',
            type: '',
            journalName: '',
            journalType: ''
        });
    };

    if (loading) return <div className="loading">📊 Loading publications data...</div>;
    if (error) return <div className="error">❌ Error loading data: {error}</div>;

    const totalPublications = data?.raw?.length || 0;
    const indexedCount = data?.raw?.filter(p => p['Indexed (Yes/No)']?.toLowerCase() === 'yes').length || 0;
    const totalCitations = data?.raw?.reduce((sum, item) => sum + parseInt(item.Citations || 0), 0) || 0;


    const indexedPercentage = totalPublications > 0 ? ((indexedCount / totalPublications) * 100).toFixed(1) : 0;

    const handleDownloadReport = async () => {
        await generatePDFReport('publications-dashboard', 'Research Publications Report');
    };

    return (
        <div className="dashboard-container" id="publications-dashboard">
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 className="dashboard-title">📚 Research Publications</h1>
                    <p className="dashboard-subtitle">
                        Comprehensive analysis of faculty publications, citations, and research output across departments
                    </p>
                </div>
                <button onClick={handleDownloadReport} className="download-btn">
                    📄 Download Report
                </button>
            </div>

            {/* Filter Bar */}
            <div className="filter-container">
                <div className="filter-group">
                    <label className="filter-label">Faculty</label>
                    <select name="faculty" value={filters.faculty} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Faculty</option>
                        {filterOptions.faculties.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Department</label>
                    <select name="department" value={filters.department} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Departments</option>
                        {filterOptions.departments.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Type</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Types</option>
                        {filterOptions.types.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Journal Name</label>
                    <select name="journalName" value={filters.journalName} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Journals</option>
                        {filterOptions.journalNames.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="filter-group">
                    <label className="filter-label">Journal Type</label>
                    <select name="journalType" value={filters.journalType} onChange={handleFilterChange} className="filter-select">
                        <option value="">All Categories</option>
                        {filterOptions.journalTypes.map((o, i) => <option key={i} value={o}>{o}</option>)}
                    </select>
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
                    <div className="stat-label">📖 Total Publications</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalPublications} duration={2000} />
                    </div>
                    <div className="stat-change">All time research output</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">✅ Indexed Publications</div>
                    <div className="stat-value">
                        <AnimatedCounter end={indexedCount} duration={2000} />
                    </div>
                    <div className="stat-change positive">
                        ↑ {indexedPercentage}% indexed in reputable databases
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🎯 Total Citations</div>
                    <div className="stat-value">
                        <AnimatedCounter end={totalCitations} duration={2500} separator="," />
                    </div>
                    <div className="stat-change success">Impact across all publications</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">🏛️ Active Departments</div>
                    <div className="stat-value">
                        <AnimatedCounter end={data?.departmentWise?.length || 0} duration={1800} />
                    </div>
                    <div className="stat-change">Contributing to research excellence</div>
                </div>
            </div>

            {/* Year-wise Publications - Enhanced Area Chart */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">📈 Year-wise Publications Trend</h3>
                        <p className="chart-subtitle">Research output trajectory over the years</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={data?.yearWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorPublications" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={PREMIUM_GRADIENTS.purple[0]} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={PREMIUM_GRADIENTS.purple[1]} stopOpacity={0.2} />
                                </linearGradient>
                                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={PREMIUM_GRADIENTS.purple[0]} />
                                    <stop offset="100%" stopColor={PREMIUM_GRADIENTS.purple[1]} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid {...GRID_STYLE} />
                            <XAxis dataKey="year" {...AXIS_STYLE} />
                            <YAxis {...AXIS_STYLE} />
                            <Tooltip content={<PremiumTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="url(#strokeGradient)"
                                strokeWidth={3}
                                fill="url(#colorPublications)"
                                name="Publications"
                                animationDuration={1500}
                                animationEasing="ease-out"
                                dot={<PremiumDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                                activeDot={<PremiumActiveDot stroke={PREMIUM_GRADIENTS.purple[0]} />}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two Column Charts */}
            <div className="dashboard-grid">
                {/* Department-wise Publications - 3D Effect Bar Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">🏢 Department-wise Distribution</h3>
                            <p className="chart-subtitle">Research contribution by department</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data?.departmentWise || []} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                                <defs>
                                    <linearGradient id="colorDept" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={PREMIUM_GRADIENTS.blue[0]} stopOpacity={0.9} />
                                        <stop offset="95%" stopColor={PREMIUM_GRADIENTS.blue[1]} stopOpacity={0.7} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid {...GRID_STYLE} />
                                <XAxis
                                    dataKey="name"
                                    {...AXIS_STYLE}
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    interval={0}
                                />
                                <YAxis {...AXIS_STYLE} />
                                <Tooltip content={<PremiumTooltip />} />
                                <Bar
                                    dataKey="value"
                                    fill="url(#colorDept)"
                                    radius={[12, 12, 0, 0]}
                                    name="Publications"
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Publication Type - Donut Chart */}
                <div className="chart-container">
                    <div className="chart-header">
                        <div>
                            <h3 className="chart-title">📊 Publication Types</h3>
                            <p className="chart-subtitle">Distribution by publication category</p>
                        </div>
                    </div>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <defs>
                                    {VIBRANT_COLORS.map((color, index) => (
                                        <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={1} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={data?.typeWise || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={premiumPieLabel}
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                >
                                    {data?.typeWise?.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#pieGradient${index % VIBRANT_COLORS.length})`}
                                            stroke="#fff"
                                            strokeWidth={2}
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
            </div>

            {/* Top Faculty Table - Premium Design */}
            <div className="chart-container">
                <div className="chart-header">
                    <div>
                        <h3 className="chart-title">🏆 Top Faculty by Publications</h3>
                        <p className="chart-subtitle">Most prolific researchers and their impact</p>
                    </div>
                </div>
                <div className="alert-badge success">
                    ✨ Recognizing our research champions
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>🥇 Rank</th>
                                <th>Faculty Member</th>
                                <th>Department</th>
                                <th>Publications</th>
                                <th>Citations</th>
                                <th>Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topFaculty?.slice(0, 10).map((faculty, index) => {
                                const avgCitations = faculty.citations / faculty.publications;
                                return (
                                    <tr key={index}>
                                        <td style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td style={{ fontWeight: '700', color: '#1f2937' }}>{faculty.name}</td>
                                        <td>{faculty.department}</td>
                                        <td>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '12px',
                                                fontWeight: '700'
                                            }}>
                                                {faculty.publications}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '600', color: '#4facfe' }}>{faculty.citations}</td>
                                        <td>
                                            <span style={{
                                                color: avgCitations > 20 ? '#10b981' : avgCitations > 10 ? '#f59e0b' : '#6b7280',
                                                fontWeight: '700'
                                            }}>
                                                {avgCitations.toFixed(1)} avg
                                            </span>
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

export default Publications;
