# Google Sheets Template Guide

This document provides the required structure for each of the 5 Google Sheets used in the dashboard system.

## 📊 Sheet 1: Admission Trends

**Sheet ID Variable**: `ADMISSION_TRENDS_SHEET_ID`

### Required Columns:
| Column | Description | Example |
|--------|-------------|---------|
| Year | Academic year | 2023 |
| Program | Program/Course name | B.Tech CSE |
| Gender | Student gender | Male |
| Category | Reservation category | General |
| Students Admitted | Number of admissions | 45 |

### Sample Data:
```
Year,Program,Gender,Category,Students Admitted
2021,B.Tech CSE,Male,General,50
2021,B.Tech CSE,Female,General,30
2021,MBA,Male,OBC,25
2022,B.Tech CSE,Male,General,55
2022,B.Tech CSE,Female,General,35
2023,MBA,Female,SC,20
```

---

## 📅 Sheet 2: Attendance Analytics

**Sheet ID Variable**: `ATTENDANCE_ANALYTICS_SHEET_ID`

### Required Columns:
| Column | Description | Example |
|--------|-------------|---------|
| Semester | Current semester | 3 |
| Program | Program name | B.Tech CSE |
| Course | Course/Subject name | Data Structures |
| Student Name | Full name of student | Rahul Sharma |
| Attendance % | Attendance percentage (0-100) | 78.5 |

### Sample Data:
```
Semester,Program,Course,Student Name,Attendance %
3,B.Tech CSE,Data Structures,Rahul Sharma,78.5
3,B.Tech CSE,Database Systems,Priya Singh,85.2
3,B.Tech CSE,Data Structures,Amit Kumar,65.0
4,MBA,Marketing,Neha Patel,92.3
3,B.Tech ECE,Signals,Vikram Rao,72.1
```

**Note**: Students with Attendance % < 75 will trigger low attendance alerts.

---

## 📈 Sheet 3: Result Analysis

**Sheet ID Variable**: `RESULT_ANALYSIS_SHEET_ID`

### Required Columns:
| Column | Description | Example |
|--------|-------------|---------|
| Student Name | Full name of student | Rahul Sharma |
| Program | Program name | B.Tech CSE |
| Semester | Current semester | 5 |
| Course | Course/Subject name | Operating Systems |
| Marks | Marks obtained (0-100) | 75 |
| Result | Pass or Fail | Pass |

### Sample Data:
```
Student Name,Program,Semester,Course,Marks,Result
Rahul Sharma,B.Tech CSE,5,Operating Systems,75,Pass
Priya Singh,B.Tech CSE,5,Data Structures,88,Pass
Amit Kumar,MBA,3,Marketing,55,Fail
Neha Patel,B.Tech ECE,4,Signals,92,Pass
Vikram Rao,B.Tech CSE,5,Operating Systems,45,Fail
```

---

## ⭐ Sheet 4: Feedback Analysis

**Sheet ID Variable**: `FEEDBACK_ANALYSIS_SHEET_ID`

### Required Columns:
| Column | Description | Example |
|--------|-------------|---------|
| Student Name | Full name of student | Rahul Sharma |
| Program | Program name | B.Tech CSE |
| Faculty | Faculty member name | Dr. Amit Kumar |
| Rating | Rating out of 5 (0-5) | 4.5 |
| Comments | Student feedback comments | Excellent teaching style |

### Sample Data:
```
Student Name,Program,Faculty,Rating,Comments
Rahul Sharma,B.Tech CSE,Dr. Amit Kumar,4.5,Excellent teaching style
Priya Singh,MBA,Prof. Neha Verma,5.0,Very knowledgeable and helpful
Amit Kumar,B.Tech CSE,Dr. Amit Kumar,4.0,Good explanations
Neha Patel,B.Tech ECE,Dr. Rajesh Singh,3.5,Could improve engagement
Vikram Rao,MBA,Prof. Neha Verma,4.8,Best professor
```

**Ratings Guide**:
- 4.0-5.0: Excellent (Top Rated Faculty)
- 3.0-3.9: Good
- Below 3.0: Needs Improvement

---

## 🏆 Sheet 5: Placement Analysis

**Sheet ID Variable**: `PLACEMENT_ANALYSIS_SHEET_ID`

### Required Columns:
| Column | Description | Example |
|--------|-------------|---------|
| Student Name | Full name of student | Rahul Sharma |
| program | Program name (lowercase) | B.Tech CSE |
| Company | Company name | Google |
| Package (LPA) | Salary package in LPA | 18.5 |
| Status | Placed or Not Placed | Placed |

### Sample Data:
```
Student Name,program,Company,Package (LPA),Status
Rahul Sharma,B.Tech CSE,Google,18.5,Placed
Priya Singh,B.Tech CSE,Microsoft,22.0,Placed
Amit Kumar,MBA,Deloitte,12.5,Placed
Neha Patel,B.Tech ECE,TCS,7.5,Placed
Vikram Rao,B.Tech CSE,Amazon,25.0,Placed
Ankit Verma,MBA,NA,0,Not Placed
```

**Note**: Only students with Status = "Placed" will be counted in placement statistics.

---

## 📝 Important Notes

1. **Column Names**: Must match exactly as shown (case-sensitive, including spaces)
2. **Data Types**: Ensure numerical fields contain only numbers
3. **First Row**: Must be the header row with column names
4. **Empty Values**: Will be treated as 0 or empty string
5. **Sheet Names**: Default is "Sheet1" - update in .env if different
6. **Real-time Updates**: Changes to sheets reflect in dashboard within 30 seconds

## 🔗 Getting Sheet IDs

1. Open your Google Sheet
2. Look at the URL
3. Copy the ID between `/d/` and `/edit`

Example URL:
```
https://docs.google.com/spreadsheets/d/1abc123XYZ-456def/edit
                                      ^^^^^^^^^^^^^^^^
                                      This is your Sheet ID
```

## ✅ Service Account Setup

**IMPORTANT**: Share each Google Sheet with this email address:
```
manav-rachna-university@university-481315.iam.gserviceaccount.com
```

Give it **Viewer** access for all 5 sheets.

## 🧪 Testing Your Sheets

After setting up your sheets:

1. Ensure service account has access to all 5 sheets
2. Verify column names match exactly (including spaces and case)
3. Add some sample data to each sheet
4. Update `backend/.env` with your Sheet IDs
5. Start the backend server: `cd backend && npm start`
6. Test API endpoints in browser or Postman:
   - http://localhost:5000/api/dashboard/admission-trends
   - http://localhost:5000/api/dashboard/attendance-analytics
   - http://localhost:5000/api/dashboard/result-analysis
   - http://localhost:5000/api/dashboard/feedback-analysis
   - http://localhost:5000/api/dashboard/placement-analysis

If you see JSON data in the response, your sheets are configured correctly! 🎉
