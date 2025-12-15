import React from 'react';

/**
 * Premium Chart Configuration
 * Reusable configurations for professional, modern charts
 */

// Premium Color Palettes
export const PREMIUM_GRADIENTS = {
    purple: ['#667eea', '#764ba2'],
    blue: ['#4facfe', '#00f2fe'],
    pink: ['#f093fb', '#f5576c'],
    green: ['#43e97b', '#38f9d7'],
    orange: ['#fa709a', '#fee140'],
    teal: ['#13547a', '#80d0c7'],
    sunset: ['#ff6b6b', '#feca57'],
    ocean: ['#396afc', '#2948ff'],
    forest: ['#11998e', '#38ef7d'],
    fire: ['#eb3349', '#f45c43']
};

export const VIBRANT_COLORS = [
    '#667eea', // Purple
    '#4facfe', // Blue
    '#43e97b', // Green
    '#f093fb', // Pink
    '#feca57', // Yellow
    '#fa709a', // Rose
    '#38f9d7', // Teal
    '#f5576c', // Red
    '#764ba2', // Deep Purple
    '#00f2fe', // Cyan
    '#fee140', // Gold
    '#ff6b6b'  // Coral
];

export const STATUS_COLORS = {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    neutral: '#6b7280'
};

// Gradient Definitions for Charts
export const createGradientDef = (id, colors, direction = 'vertical') => {
    const isVertical = direction === 'vertical';
    return {
        id,
        x1: isVertical ? '0' : '0',
        y1: isVertical ? '0' : '0',
        x2: isVertical ? '0' : '1',
        y2: isVertical ? '1' : '0',
        stops: [
            { offset: '5%', color: colors[0], opacity: 0.9 },
            { offset: '95%', color: colors[1], opacity: 0.6 }
        ]
    };
};

// Premium Tooltip Component
export const PremiumTooltip = ({ active, payload, label, formatter }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)',
            minWidth: '150px'
        }}>
            <p style={{
                margin: '0 0 8px 0',
                fontWeight: '700',
                fontSize: '14px',
                color: '#1f2937',
                borderBottom: '2px solid #667eea',
                paddingBottom: '8px'
            }}>
                {label || payload[0].payload.year || payload[0].payload.name || ''}
            </p>
            {payload.map((entry, index) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    margin: '6px 0',
                    gap: '12px'
                }}>
                    <span style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: entry.color,
                            display: 'inline-block'
                        }}></span>
                        {entry.name}:
                    </span>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: entry.color
                    }}>
                        {formatter ? formatter(entry.value) : entry.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

// Custom Legend Component
export const PremiumLegend = ({ payload }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginTop: '16px'
        }}>
            {payload.map((entry, index) => (
                <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#4b5563'
                }}>
                    <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        background: entry.color,
                        boxShadow: `0 2px 8px ${entry.color}40`
                    }}></div>
                    {entry.value}
                </div>
            ))}
        </div>
    );
};

// Animation Configuration
export const CHART_ANIMATION = {
    animationDuration: 1500,
    animationEasing: 'ease-out',
    animationBegin: 0
};

// Responsive Container Default Props
export const RESPONSIVE_CONFIG = {
    width: '100%',
    height: 350
};

// Chart Margin Configuration
export const CHART_MARGINS = {
    default: { top: 20, right: 30, left: 20, bottom: 20 },
    large: { top: 30, right: 40, left: 30, bottom: 30 },
    withLabels: { top: 20, right: 30, left: 20, bottom: 60 }
};

// Axis Style Configuration
export const AXIS_STYLE = {
    stroke: '#9ca3af',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

// Grid Style Configuration
export const GRID_STYLE = {
    strokeDasharray: '3 3',
    stroke: 'rgba(156, 163, 175, 0.2)',
    strokeWidth: 1
};

// Custom Dot Component for Line Charts
export const PremiumDot = (props) => {
    const { cx, cy, stroke, payload, value } = props;

    if (value === null || value === undefined) return null;

    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={6}
                fill="#fff"
                stroke={stroke}
                strokeWidth={3}
                style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                    transition: 'all 0.3s ease'
                }}
            />
            <circle
                cx={cx}
                cy={cy}
                r={3}
                fill={stroke}
            />
        </g>
    );
};

// Custom Active Dot for Line Charts
export const PremiumActiveDot = (props) => {
    const { cx, cy, stroke } = props;

    return (
        <g>
            <circle
                cx={cx}
                cy={cy}
                r={12}
                fill={stroke}
                fillOpacity={0.2}
                style={{
                    animation: 'pulse 1.5s ease-in-out infinite'
                }}
            />
            <circle
                cx={cx}
                cy={cy}
                r={8}
                fill="#fff"
                stroke={stroke}
                strokeWidth={3}
                style={{
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}
            />
            <circle
                cx={cx}
                cy={cy}
                r={4}
                fill={stroke}
            />
        </g>
    );
};

// Number Formatter Utilities
export const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
};

export const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
};

export const formatCompactNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

// Label Formatter for Pie Charts
export const premiumPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Hide labels for small slices

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            style={{
                fontSize: '13px',
                fontWeight: '700',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default {
    PREMIUM_GRADIENTS,
    VIBRANT_COLORS,
    STATUS_COLORS,
    createGradientDef,
    PremiumTooltip,
    PremiumLegend,
    CHART_ANIMATION,
    RESPONSIVE_CONFIG,
    CHART_MARGINS,
    AXIS_STYLE,
    GRID_STYLE,
    PremiumDot,
    PremiumActiveDot,
    formatNumber,
    formatCurrency,
    formatCompactNumber,
    premiumPieLabel
};
