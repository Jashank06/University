# Research Dashboards

## Overview
Three new research-focused dashboards have been added to the Manav Rachna University Dashboard to track and analyze research activities:

1. **Publications Dashboard** - Track faculty publications, citations, and research output
2. **Patents Dashboard** - Monitor patent filings, grants, and innovation metrics
3. **Collaborations Dashboard** - Analyze research partnerships and funding

## Google Sheets Configuration

### Sheet IDs
All three research dashboards use the same Google Sheet with ID: `1h2DUT5v7-1-scwGLzLw0Z3a56gceK2UW6OPBnHKKF-c`

### Sheet Structure

#### 1. Publications (Tab: "Publication")
**Columns Required:**
- `Year` - Publication year
- `Faculty` - Faculty member name
- `Department` - Department name
- `Title` - Publication title
- `Type` - Type of publication (Journal, Conference, etc.)
- `Indexed (Yes/No)` - Whether the publication is indexed
- `Citations` - Number of citations received

**Example:**
```
Year | Faculty      | Department | Title                    | Type       | Indexed (Yes/No) | Citations
2023 | Dr. John Doe | CSE        | AI Research Paper       | Journal    | Yes              | 25
2023 | Dr. Jane Smith| ECE       | IoT Systems             | Conference | Yes              | 10
```

#### 2. Patents (Tab: "Patent")
**Columns Required:**
- `Year` - Patent filing/grant year
- `Faculty` - Faculty member name
- `Department` - Department name
- `Patent Title` - Title of the patent
- `Type` - Patent type
- `Status (Filed/Granted)` or `Status` - Current status
- `National/International` - Patent scope

**Example:**
```
Year | Faculty      | Department | Patent Title        | Type     | Status  | National/International
2023 | Dr. John Doe | CSE        | ML Algorithm       | Utility  | Granted | International
2023 | Dr. Jane Smith| ECE       | IoT Device         | Design   | Filed   | National
```

#### 3. Collaborations (Tab: "Collaboration")
**Columns Required:**
- `Year` - Collaboration year
- `Faculty` - Faculty member name
- `Partner` - Partner organization name
- `Type` - Type of collaboration (Research Grant, Industry Partnership, etc.)
- `Funding (INR)` - Funding amount in Indian Rupees

**Example:**
```
Year | Faculty      | Partner      | Type              | Funding (INR)
2023 | Dr. John Doe | ISRO         | Research Grant    | 5000000
2023 | Dr. Jane Smith| TCS         | Industry Partner  | 2500000
```

## Frontend Routes

- `/research` - Unified Research dashboard with tabs for:
  - Publications
  - Patents
  - Collaborations

## Backend API Endpoints

- `GET /api/dashboard/research/publications` - Fetch publications data
- `GET /api/dashboard/research/patents` - Fetch patents data
- `GET /api/dashboard/research/collaborations` - Fetch collaborations data

## Features

### Publications Dashboard
- **Stats Cards:**
  - Total Publications
  - Indexed Publications (with percentage)
  - Total Citations
  - Active Departments
- **Visualizations:**
  - Year-wise publications trend (Line Chart)
  - Department-wise publications (Bar Chart)
  - Publication type distribution (Pie Chart)
  - Top faculty by publications (Table)

### Patents Dashboard
- **Stats Cards:**
  - Total Patents
  - Granted Patents
  - Filed Patents
  - International Patents (with percentage)
- **Visualizations:**
  - Year-wise patent filings (Line Chart)
  - Patent status distribution (Pie Chart)
  - National vs International distribution (Pie Chart)
  - Department-wise patents (Bar Chart)
  - Patent type distribution (Bar Chart)

### Collaborations Dashboard
- **Stats Cards:**
  - Total Collaborations
  - Total Funding (formatted in Cr/L)
  - Average Funding
  - Unique Partners
- **Visualizations:**
  - Year-wise collaborations (Bar Chart)
  - Collaboration type distribution (Pie Chart)
  - Funding by type (Bar Chart)
  - Top research partners (Horizontal Bar Chart)
  - Recent collaborations (Table)

## Auto-refresh
All dashboards automatically refresh every 30 seconds to display real-time data from Google Sheets.

## Accessing the Data
The dashboards are accessible from the sidebar navigation menu:
- 🔬 Research - Click to access the unified research dashboard
  - Use the tabs at the top to switch between:
    - 📚 Publications
    - 💡 Patents
    - 🤝 Collaborations
