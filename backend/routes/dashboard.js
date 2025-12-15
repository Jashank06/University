const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard 1: Admission Trends
router.get('/admission-trends', dashboardController.getAdmissionTrends);

// Dashboard 2: Attendance Analytics
router.get('/attendance-analytics', dashboardController.getAttendanceAnalytics);

// Dashboard 3: Result Analysis
router.get('/result-analysis', dashboardController.getResultAnalysis);

// Dashboard 4: Feedback Analysis
router.get('/feedback-analysis', dashboardController.getFeedbackAnalysis);

// Dashboard 5: Placement Analysis
router.get('/placement-analysis', dashboardController.getPlacementAnalysis);

// Research Dashboards
router.get('/research/publications', dashboardController.getPublications);
router.get('/research/patents', dashboardController.getPatents);
router.get('/research/collaborations', dashboardController.getCollaborations);

module.exports = router;
