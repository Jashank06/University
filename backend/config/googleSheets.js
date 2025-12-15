const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Determine credentials path based on environment
let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  // If environment variable is not set, provide helpful error
  console.error('❌ GOOGLE_APPLICATION_CREDENTIALS environment variable is not set!');
  console.error('For Render deployment, set this in Dashboard:');
  console.error('  GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/credentials.json');
  console.error('For local development, set in .env file:');
  console.error('  GOOGLE_APPLICATION_CREDENTIALS=./credentials.json');

  // Try fallback for local development
  credentialsPath = path.join(__dirname, '../credentials.json');
  console.log(`⚠️  Attempting fallback path: ${credentialsPath}`);
}

// Verify credentials file exists
if (!fs.existsSync(credentialsPath)) {
  console.error(`❌ Credentials file not found at: ${credentialsPath}`);
  console.error('Current working directory:', process.cwd());
  console.error('__dirname:', __dirname);
  console.error('\n🔧 To fix on Render:');
  console.error('1. Go to Render Dashboard → Your Service → Environment');
  console.error('2. Add Secret File: credentials.json');
  console.error('3. Set env var: GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/credentials.json');
}

console.log(`✅ Using credentials from: ${credentialsPath}`);

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: credentialsPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

/**
 * Fetch data from a Google Sheet
 * @param {string} spreadsheetId - The ID of the Google Sheet
 * @param {string} range - The range to fetch (e.g., 'Sheet1!A1:Z100')
 * @returns {Promise<Array>} - Array of rows
 */
async function getSheetData(spreadsheetId, range) {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error.message);
    throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
  }
}

/**
 * Convert sheet rows to objects using first row as headers
 * @param {Array} rows - Raw rows from Google Sheets
 * @returns {Array<Object>} - Array of objects with headers as keys
 */
function rowsToObjects(rows) {
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const data = rows.slice(1);

  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
}

module.exports = {
  getSheetData,
  rowsToObjects,
};
