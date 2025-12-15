const { getSheetData, rowsToObjects } = require('../config/googleSheets');

/**
 * Dashboard 1: Admission Trends
 * Expected columns: Year, Program, Gender, Category, Students Admitted
 */
exports.getAdmissionTrends = async (req, res) => {
    try {
        const sheetId = process.env.ADMISSION_TRENDS_SHEET_ID;
        const sheetName = process.env.ADMISSION_TRENDS_SHEET_NAME || 'Sheet1';

        const rows = await getSheetData(sheetId, `${sheetName}!A:E`);
        const data = rowsToObjects(rows);

        // Process data for different visualizations
        const yearWise = processYearWiseData(data);
        const programWise = processProgramWiseData(data);
        const genderWise = processGenderData(data);
        const categoryWise = processCategoryData(data);

        res.json({
            success: true,
            data: {
                yearWise,
                programWise,
                genderWise,
                categoryWise,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getAdmissionTrends:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Dashboard 2: Attendance Analytics
 * Expected columns: Semester, Program, Course, Student Name, Attendance %
 */
exports.getAttendanceAnalytics = async (req, res) => {
    try {
        const sheetId = process.env.ATTENDANCE_ANALYTICS_SHEET_ID;
        const sheetName = process.env.ATTENDANCE_ANALYTICS_SHEET_NAME || 'Sheet1';

        const rows = await getSheetData(sheetId, `${sheetName}!A:E`);
        const data = rowsToObjects(rows);

        // Process data
        const courseWise = processCourseAttendance(data);
        const lowAttendance = data.filter(item => parseFloat(item['Attendance %']) < 75);
        const semesterWise = processSemesterAttendance(data);

        res.json({
            success: true,
            data: {
                courseWise,
                lowAttendance,
                semesterWise,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getAttendanceAnalytics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Dashboard 3: Result Analysis
 * Expected columns: Student Name, Program, Semester, Course, Marks, Result
 */
exports.getResultAnalysis = async (req, res) => {
    try {
        const sheetId = process.env.RESULT_ANALYSIS_SHEET_ID;
        const sheetName = process.env.RESULT_ANALYSIS_SHEET_NAME || 'Sheet1';

        const rows = await getSheetData(sheetId, `${sheetName}!A:F`);
        const data = rowsToObjects(rows);

        // Calculate pass/fail statistics by program
        const programStats = processProgramStats(data);
        const courseWiseMarks = processCourseMarks(data);
        const failedStudents = data.filter(item => item.Result && item.Result.toLowerCase() === 'fail');

        res.json({
            success: true,
            data: {
                programStats,
                courseWiseMarks,
                failedStudents,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getResultAnalysis:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Dashboard 4: Feedback Analysis
 * Expected columns: Student Name, Program, Faculty, Rating, Comments
 */
exports.getFeedbackAnalysis = async (req, res) => {
    try {
        const sheetId = process.env.FEEDBACK_ANALYSIS_SHEET_ID;
        const sheetName = process.env.FEEDBACK_ANALYSIS_SHEET_NAME || 'Sheet1';

        const rows = await getSheetData(sheetId, `${sheetName}!A:E`);
        const data = rowsToObjects(rows);

        // Process feedback data
        const facultyRatings = processFacultyRatings(data);
        const programRatings = processProgramRatings(data);
        const topRatedFaculty = facultyRatings.filter(f => parseFloat(f.averageRating) >= 4).slice(0, 10);
        const lowRatedFaculty = facultyRatings.filter(f => parseFloat(f.averageRating) < 3);

        res.json({
            success: true,
            data: {
                facultyRatings,
                programRatings,
                topRatedFaculty,
                lowRatedFaculty,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getFeedbackAnalysis:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Dashboard 5: Placement Analysis
 * Expected columns: Student Name, program, Company, Package (LPA), Status
 */
exports.getPlacementAnalysis = async (req, res) => {
    try {
        const sheetId = process.env.PLACEMENT_ANALYSIS_SHEET_ID;
        const sheetName = process.env.PLACEMENT_ANALYSIS_SHEET_NAME || 'Sheet1';

        const rows = await getSheetData(sheetId, `${sheetName}!A:E`);
        const data = rowsToObjects(rows);

        // Process placement data
        const placedStudents = data.filter(item => item.Status && item.Status.toLowerCase() === 'placed');
        const programWisePlacements = processProgramPlacements(data);
        const companyWise = processCompanyPlacements(data);
        const packageRanges = processPackageRanges(data);

        // Calculate statistics
        const avgPackage = placedStudents.length > 0
            ? placedStudents.reduce((sum, s) => sum + parseFloat(s['Package (LPA)'] || 0), 0) / placedStudents.length
            : 0;

        const maxPackage = placedStudents.length > 0
            ? Math.max(...placedStudents.map(s => parseFloat(s['Package (LPA)'] || 0)))
            : 0;

        res.json({
            success: true,
            data: {
                placedStudents,
                programWisePlacements,
                companyWise,
                packageRanges,
                avgPackage: avgPackage.toFixed(2),
                maxPackage: maxPackage.toFixed(2),
                placementRate: ((placedStudents.length / data.length) * 100).toFixed(2),
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getPlacementAnalysis:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper functions for data processing

function processYearWiseData(data) {
    const yearMap = {};
    data.forEach(item => {
        const year = item.Year;
        const count = parseInt(item['Students Admitted']) || 0;
        yearMap[year] = (yearMap[year] || 0) + count;
    });

    return Object.keys(yearMap).map(year => ({
        year,
        admissions: yearMap[year]
    }));
}

function processProgramWiseData(data) {
    const programMap = {};
    data.forEach(item => {
        const program = item.Program;
        const count = parseInt(item['Students Admitted']) || 0;

        if (!programMap[program]) {
            programMap[program] = 0;
        }
        programMap[program] += count;
    });

    return Object.keys(programMap).map(program => ({
        program,
        admissions: programMap[program]
    }));
}

function processGenderData(data) {
    const genderMap = {};
    data.forEach(item => {
        const gender = item.Gender;
        const count = parseInt(item['Students Admitted']) || 0;
        genderMap[gender] = (genderMap[gender] || 0) + count;
    });

    return Object.keys(genderMap).map(gender => ({
        name: gender,
        value: genderMap[gender]
    }));
}

function processCategoryData(data) {
    const categoryMap = {};
    data.forEach(item => {
        const category = item.Category;
        const count = parseInt(item['Students Admitted']) || 0;
        categoryMap[category] = (categoryMap[category] || 0) + count;
    });

    return Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category]
    }));
}

function processCourseAttendance(data) {
    const courseMap = {};
    data.forEach(item => {
        const course = item.Course;
        const attendance = parseFloat(item['Attendance %']) || 0;

        if (!courseMap[course]) {
            courseMap[course] = { total: 0, count: 0 };
        }
        courseMap[course].total += attendance;
        courseMap[course].count += 1;
    });

    return Object.keys(courseMap).map(course => ({
        course,
        averageAttendance: (courseMap[course].total / courseMap[course].count).toFixed(2)
    }));
}

function processSemesterAttendance(data) {
    const semesterMap = {};
    data.forEach(item => {
        const semester = item.Semester;
        const attendance = parseFloat(item['Attendance %']) || 0;

        if (!semesterMap[semester]) {
            semesterMap[semester] = { total: 0, count: 0 };
        }
        semesterMap[semester].total += attendance;
        semesterMap[semester].count += 1;
    });

    return Object.keys(semesterMap).map(semester => ({
        semester,
        averageAttendance: (semesterMap[semester].total / semesterMap[semester].count).toFixed(2)
    }));
}

function processProgramStats(data) {
    const programMap = {};
    data.forEach(item => {
        const program = item.Program;
        const result = item.Result ? item.Result.toLowerCase() : '';

        if (!programMap[program]) {
            programMap[program] = { total: 0, passed: 0, failed: 0 };
        }
        programMap[program].total += 1;
        if (result === 'pass') programMap[program].passed += 1;
        if (result === 'fail') programMap[program].failed += 1;
    });

    return Object.keys(programMap).map(program => ({
        program,
        passPercentage: ((programMap[program].passed / programMap[program].total) * 100).toFixed(2),
        failPercentage: ((programMap[program].failed / programMap[program].total) * 100).toFixed(2),
        total: programMap[program].total
    }));
}

function processCourseMarks(data) {
    const courseMap = {};
    data.forEach(item => {
        const course = item.Course;
        const marks = parseFloat(item.Marks) || 0;

        if (!courseMap[course]) {
            courseMap[course] = { total: 0, count: 0 };
        }
        courseMap[course].total += marks;
        courseMap[course].count += 1;
    });

    return Object.keys(courseMap).map(course => ({
        course,
        averageMarks: (courseMap[course].total / courseMap[course].count).toFixed(2)
    }));
}

function processFacultyRatings(data) {
    const facultyMap = {};
    data.forEach(item => {
        const faculty = item.Faculty;
        const rating = parseFloat(item.Rating) || 0;

        if (!facultyMap[faculty]) {
            facultyMap[faculty] = { total: 0, count: 0 };
        }
        facultyMap[faculty].total += rating;
        facultyMap[faculty].count += 1;
    });

    return Object.keys(facultyMap).map(faculty => ({
        faculty,
        averageRating: (facultyMap[faculty].total / facultyMap[faculty].count).toFixed(2),
        feedbackCount: facultyMap[faculty].count
    })).sort((a, b) => b.averageRating - a.averageRating);
}

function processProgramRatings(data) {
    const programMap = {};
    data.forEach(item => {
        const program = item.Program;
        const rating = parseFloat(item.Rating) || 0;

        if (!programMap[program]) {
            programMap[program] = { total: 0, count: 0 };
        }
        programMap[program].total += rating;
        programMap[program].count += 1;
    });

    return Object.keys(programMap).map(program => ({
        program,
        averageRating: (programMap[program].total / programMap[program].count).toFixed(2)
    }));
}

function processProgramPlacements(data) {
    const programMap = {};
    data.forEach(item => {
        const program = item.program || item.Program;
        const status = item.Status ? item.Status.toLowerCase() : '';

        if (!programMap[program]) {
            programMap[program] = { total: 0, placed: 0 };
        }
        programMap[program].total += 1;
        if (status === 'placed') programMap[program].placed += 1;
    });

    return Object.keys(programMap).map(program => ({
        program,
        placementRate: ((programMap[program].placed / programMap[program].total) * 100).toFixed(2),
        placedCount: programMap[program].placed,
        totalCount: programMap[program].total
    }));
}

function processCompanyPlacements(data) {
    const companyMap = {};
    data.forEach(item => {
        if (item.Status && item.Status.toLowerCase() === 'placed') {
            const company = item.Company;
            companyMap[company] = (companyMap[company] || 0) + 1;
        }
    });

    return Object.keys(companyMap).map(company => ({
        company,
        studentsPlaced: companyMap[company]
    })).sort((a, b) => b.studentsPlaced - a.studentsPlaced);
}

function processPackageRanges(data) {
    const ranges = {
        '0-5 LPA': 0,
        '5-10 LPA': 0,
        '10-15 LPA': 0,
        '15-20 LPA': 0,
        '20+ LPA': 0
    };

    data.forEach(item => {
        if (item.Status && item.Status.toLowerCase() === 'placed') {
            const pkg = parseFloat(item['Package (LPA)']) || 0;
            if (pkg < 5) ranges['0-5 LPA']++;
            else if (pkg < 10) ranges['5-10 LPA']++;
            else if (pkg < 15) ranges['10-15 LPA']++;
            else if (pkg < 20) ranges['15-20 LPA']++;
            else ranges['20+ LPA']++;
        }
    });

    return Object.keys(ranges).map(range => ({
        range,
        count: ranges[range]
    }));
}

/**
 * Research Dashboard 1: Publications
 * Expected columns: Year, Faculty, Department, Title, Type, Indexed (Yes/No), Citations
 */
exports.getPublications = async (req, res) => {
    try {
        const sheetId = process.env.RESEARCH_SHEET_ID || '1h2DUT5v7-1-scwGLzLw0Z3a56gceK2UW6OPBnHKKF-c';
        const sheetName = process.env.PUBLICATIONS_SHEET_NAME || 'Publication';

        const rows = await getSheetData(sheetId, `${sheetName}!A:G`);
        const data = rowsToObjects(rows);

        // Process data for visualizations
        const yearWise = processPublicationYearData(data);
        const departmentWise = processPublicationDepartmentData(data);
        const typeWise = processPublicationTypeData(data);
        const topFaculty = processTopFacultyPublications(data);

        res.json({
            success: true,
            data: {
                yearWise,
                departmentWise,
                typeWise,
                topFaculty,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getPublications:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Research Dashboard 2: Patents
 * Expected columns: Year, Faculty, Department, Patent Title, Type, Status (Filed/Granted), National/International
 */
exports.getPatents = async (req, res) => {
    try {
        const sheetId = process.env.RESEARCH_SHEET_ID || '1h2DUT5v7-1-scwGLzLw0Z3a56gceK2UW6OPBnHKKF-c';
        const sheetName = process.env.PATENTS_SHEET_NAME || 'Patent';

        const rows = await getSheetData(sheetId, `${sheetName}!A:G`);
        const data = rowsToObjects(rows);

        // Process data for visualizations
        const yearWise = processPatentYearData(data);
        const departmentWise = processPatentDepartmentData(data);
        const statusWise = processPatentStatusData(data);
        const scopeWise = processPatentScopeData(data);
        const typeWise = processPatentTypeData(data);

        res.json({
            success: true,
            data: {
                yearWise,
                departmentWise,
                statusWise,
                scopeWise,
                typeWise,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getPatents:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Research Dashboard 3: Collaborations
 * Expected columns: Year, Faculty, Partner, Type, Funding (INR)
 */
exports.getCollaborations = async (req, res) => {
    try {
        const sheetId = process.env.RESEARCH_SHEET_ID || '1h2DUT5v7-1-scwGLzLw0Z3a56gceK2UW6OPBnHKKF-c';
        const sheetName = process.env.COLLABORATIONS_SHEET_NAME || 'Collaboration';

        const rows = await getSheetData(sheetId, `${sheetName}!A:E`);
        const data = rowsToObjects(rows);

        // Process data for visualizations
        const yearWise = processCollaborationYearData(data);
        const typeWise = processCollaborationTypeData(data);
        const fundingByType = processFundingByType(data);
        const topPartners = processTopPartners(data);

        res.json({
            success: true,
            data: {
                yearWise,
                typeWise,
                fundingByType,
                topPartners,
                raw: data
            }
        });
    } catch (error) {
        console.error('Error in getCollaborations:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Helper functions for Publications
function processPublicationYearData(data) {
    const yearMap = {};
    data.forEach(item => {
        const year = item.Year;
        yearMap[year] = (yearMap[year] || 0) + 1;
    });

    return Object.keys(yearMap).sort().map(year => ({
        year,
        count: yearMap[year]
    }));
}

function processPublicationDepartmentData(data) {
    const deptMap = {};
    data.forEach(item => {
        const dept = item.Department;
        deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.keys(deptMap).map(dept => ({
        name: dept,
        value: deptMap[dept]
    })).sort((a, b) => b.value - a.value);
}

function processPublicationTypeData(data) {
    const typeMap = {};
    data.forEach(item => {
        const type = item.Type || 'Unknown';
        typeMap[type] = (typeMap[type] || 0) + 1;
    });

    return Object.keys(typeMap).map(type => ({
        name: type,
        value: typeMap[type]
    }));
}

function processTopFacultyPublications(data) {
    const facultyMap = {};
    data.forEach(item => {
        const faculty = item.Faculty;
        const dept = item.Department;
        const citations = parseInt(item.Citations) || 0;

        if (!facultyMap[faculty]) {
            facultyMap[faculty] = { department: dept, publications: 0, citations: 0 };
        }
        facultyMap[faculty].publications += 1;
        facultyMap[faculty].citations += citations;
    });

    return Object.keys(facultyMap).map(faculty => ({
        name: faculty,
        department: facultyMap[faculty].department,
        publications: facultyMap[faculty].publications,
        citations: facultyMap[faculty].citations
    })).sort((a, b) => b.publications - a.publications);
}

// Helper functions for Patents
function processPatentYearData(data) {
    const yearMap = {};
    data.forEach(item => {
        const year = item.Year;
        yearMap[year] = (yearMap[year] || 0) + 1;
    });

    return Object.keys(yearMap).sort().map(year => ({
        year,
        count: yearMap[year]
    }));
}

function processPatentDepartmentData(data) {
    const deptMap = {};
    data.forEach(item => {
        const dept = item.Department;
        deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.keys(deptMap).map(dept => ({
        name: dept,
        value: deptMap[dept]
    })).sort((a, b) => b.value - a.value);
}

function processPatentStatusData(data) {
    const statusMap = {};
    data.forEach(item => {
        const status = item['Status (Filed/Granted)'] || item.Status || 'Unknown';
        statusMap[status] = (statusMap[status] || 0) + 1;
    });

    return Object.keys(statusMap).map(status => ({
        name: status,
        value: statusMap[status]
    }));
}

function processPatentScopeData(data) {
    const scopeMap = {};
    data.forEach(item => {
        const scope = item['National/International'] || 'Unknown';
        scopeMap[scope] = (scopeMap[scope] || 0) + 1;
    });

    return Object.keys(scopeMap).map(scope => ({
        name: scope,
        value: scopeMap[scope]
    }));
}

function processPatentTypeData(data) {
    const typeMap = {};
    data.forEach(item => {
        const type = item.Type || 'Unknown';
        typeMap[type] = (typeMap[type] || 0) + 1;
    });

    return Object.keys(typeMap).map(type => ({
        name: type,
        value: typeMap[type]
    }));
}

// Helper functions for Collaborations
function processCollaborationYearData(data) {
    const yearMap = {};
    data.forEach(item => {
        const year = item.Year;
        yearMap[year] = (yearMap[year] || 0) + 1;
    });

    return Object.keys(yearMap).sort().map(year => ({
        year,
        count: yearMap[year]
    }));
}

function processCollaborationTypeData(data) {
    const typeMap = {};
    data.forEach(item => {
        const type = item.Type || 'Unknown';
        typeMap[type] = (typeMap[type] || 0) + 1;
    });

    return Object.keys(typeMap).map(type => ({
        name: type,
        value: typeMap[type]
    }));
}

function processFundingByType(data) {
    const fundingMap = {};
    data.forEach(item => {
        const type = item.Type || 'Unknown';
        const funding = parseFloat(item['Funding (INR)']) || 0;
        fundingMap[type] = (fundingMap[type] || 0) + funding;
    });

    return Object.keys(fundingMap).map(type => ({
        name: type,
        value: fundingMap[type]
    })).sort((a, b) => b.value - a.value);
}

function processTopPartners(data) {
    const partnerMap = {};
    data.forEach(item => {
        const partner = item.Partner;
        partnerMap[partner] = (partnerMap[partner] || 0) + 1;
    });

    return Object.keys(partnerMap).map(partner => ({
        name: partner,
        value: partnerMap[partner]
    })).sort((a, b) => b.value - a.value).slice(0, 10);
}
