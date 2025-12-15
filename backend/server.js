const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dashboardRoutes = require('./routes/dashboard');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://jashank06.github.io'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.some(allowed => origin.startsWith(allowed))) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard API endpoints:`);
    console.log(`   - GET /api/dashboard/admission-trends`);
    console.log(`   - GET /api/dashboard/attendance-analytics`);
    console.log(`   - GET /api/dashboard/result-analysis`);
    console.log(`   - GET /api/dashboard/feedback-analysis`);
    console.log(`   - GET /api/dashboard/placement-analysis`);
    console.log(`   - GET /api/dashboard/research/publications`);
    console.log(`   - GET /api/dashboard/research/patents`);
    console.log(`   - GET /api/dashboard/research/collaborations`);
});
