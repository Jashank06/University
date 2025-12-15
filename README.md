# Manav Rachna University Dashboard System

A professional, real-time dashboard system for Manav Rachna University featuring 5 specialized dashboards connected to Google Sheets for live data updates.

## 🚀 Features

- **5 Specialized Dashboards**:
  - 📊 Admission Trends - Year-wise and course-wise analysis
  - 📅 Attendance Analytics - Subject-wise tracking with alerts
  - 📈 Result Analysis - Pass/Fail metrics and backlogs
  - ⭐ Student Success Index - Composite performance scoring
  - 🏆 NAAC/NBA Compliance - Accreditation metrics

- **Real-time Data**: Auto-refreshes every 30 seconds from Google Sheets
- **Professional UI**: Modern dark theme with glassmorphism effects
- **Interactive Charts**: Built with Recharts library
- **Responsive Design**: Works on all screen sizes

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Project with Sheets API enabled
- Google Sheets with data

## 🔧 Google Sheets API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 3: Download Credentials

1. Click on the created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format
5. Download the file and rename it to `credentials.json`
6. Place it in the `backend/` directory

### Step 4: Share Google Sheets

1. Open each of your 5 Google Sheets
2. Click "Share" button
3. Add the service account email (found in credentials.json as `client_email`)
4. Give "Viewer" access
5. Copy each Sheet ID from the URL (the long string between `/d/` and `/edit`)

## 📦 Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your Google Sheets IDs:
```env
PORT=5000
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json

ADMISSION_TRENDS_SHEET_ID=your_sheet_id_here
ATTENDANCE_ANALYTICS_SHEET_ID=your_sheet_id_here
RESULT_ANALYSIS_SHEET_ID=your_sheet_id_here
STUDENT_SUCCESS_SHEET_ID=your_sheet_id_here
NAAC_COMPLIANCE_SHEET_ID=your_sheet_id_here

# Sheet tab names (default is Sheet1)
ADMISSION_TRENDS_SHEET_NAME=Sheet1
ATTENDANCE_ANALYTICS_SHEET_NAME=Sheet1
RESULT_ANALYSIS_SHEET_NAME=Sheet1
STUDENT_SUCCESS_SHEET_NAME=Sheet1
NAAC_COMPLIANCE_SHEET_NAME=Sheet1
```

### Frontend Setup

```bash
cd frontend
npm install
```

The frontend is already configured to connect to `http://localhost:5000`.

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

Server will start on http://localhost:5000

### Start Frontend

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will start on http://localhost:5173

## 📊 Google Sheets Structure

See [GOOGLE_SHEETS_TEMPLATE.md](./GOOGLE_SHEETS_TEMPLATE.md) for detailed column requirements.

## 🎨 Technology Stack

**Frontend:**
- React 18
- React Router DOM
- Recharts (for charts)
- Axios (API calls)
- Vite (build tool)

**Backend:**
- Node.js
- Express.js
- Google Sheets API (googleapis)
- CORS enabled

## 📁 Project Structure

```
manav-rachna-dashboard/
├── backend/
│   ├── config/
│   │   └── googleSheets.js
│   ├── controllers/
│   │   └── dashboardController.js
│   ├── routes/
│   │   └── dashboard.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Sidebar.css
│   │   ├── pages/
│   │   │   ├── AdmissionTrends.jsx
│   │   │   ├── AttendanceAnalytics.jsx
│   │   │   ├── ResultAnalysis.jsx
│   │   │   ├── StudentSuccessIndex.jsx
│   │   │   └── NAACCompliance.jsx
│   │   ├── styles/
│   │   │   └── Dashboard.css
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

- `GET /api/dashboard/admission-trends`
- `GET /api/dashboard/attendance-analytics`
- `GET /api/dashboard/result-analysis`
- `GET /api/dashboard/student-success`
- `GET /api/dashboard/naac-compliance`

## 🐛 Troubleshooting

**Error: "Failed to fetch data from Google Sheets"**
- Verify credentials.json is in the backend directory
- Check that service account email has access to all sheets
- Ensure Sheet IDs in .env are correct

**CORS errors**
- Make sure backend is running on port 5000
- Check VITE_API_URL in frontend/.env

**Charts not displaying**
- Verify data format matches the template
- Check browser console for errors

## 📝 License

MIT

## 👨‍💻 Support

For issues or questions, contact the development team.
