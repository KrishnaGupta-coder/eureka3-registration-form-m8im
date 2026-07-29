/**
 * ==============================================================================
 * EUREKA! 2026 REGISTRATION WEB APP - GOOGLE APPS SCRIPT BACKEND
 * Organized by Arya College of Engineering & I.T. & Arya Incubation Centre
 * ==============================================================================
 * 
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Open Google Sheets (https://sheets.google.com) and create a new spreadsheet.
 * 2. Rename the spreadsheet to "Eureka 2026 Registrations".
 * 3. Click Extensions > Apps Script in the top menu.
 * 4. Replace all existing code in Code.gs with this entire file.
 * 5. Replace appsscript.json content with the provided appsscript.json manifest.
 * 6. Click "Deploy" > "New deployment".
 * 7. Click the gear icon next to "Select type" and choose "Web app".
 * 8. Set Configuration:
 *    - Description: Eureka 2026 Registration Backend
 *    - Execute as: Me (your Google account)
 *    - Who has access: Anyone
 * 9. Click "Deploy" and authorize access when prompted.
 * 10. Copy the generated "Web App URL" (ends in /exec).
 * 11. Paste the URL into `script.js` on line 11:
 *     const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
 * ==============================================================================
 */

// Global Sheet Configuration
const SHEET_NAME = "Registrations";

// Optional: If Apps Script was created as a standalone script at script.google.com,
// paste your Google Sheet ID here (from Google Sheet URL: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit)
const SPREADSHEET_ID = "";

/**
 * Handles incoming HTTP POST requests from the website submission fetch()
 */
function doPost(e) {
  try {
    let data;
    
    // Parse JSON payload or URL parameters
    if (e.parameter && e.parameter.payload) {
      try {
        data = JSON.parse(e.parameter.payload);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No data received in request.");
    }

    // Get Active Spreadsheet or open by SPREADSHEET_ID
    let ss;
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    } else {
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
      } catch (err) {}
    }

    if (!ss) {
      throw new Error("Spreadsheet not found. Please paste your Google Sheet ID into SPREADSHEET_ID in Code.gs or create script inside Google Sheets via Extensions > Apps Script.");
    }

    let sheet = ss.getSheetByName(SHEET_NAME);

    // If "Registrations" sheet does not exist, create it
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Initialize Header Row if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp",
        "Registration ID",
        "Team Name",
        "Project Name",
        "Team Leader Name",
        "Leader Roll No",
        "Branch",
        "Section",
        "Year of Study",
        "Leader Mobile",
        "Leader Email",
        "Team Size",
        "Member 2 Name",
        "Member 2 Roll No",
        "Member 2 Branch",
        "Member 2 Section",
        "Member 2 Mobile",
        "Member 3 Name",
        "Member 3 Roll No",
        "Member 3 Branch",
        "Member 3 Section",
        "Member 3 Mobile",
        "Member 4 Name",
        "Member 4 Roll No",
        "Member 4 Branch",
        "Member 4 Section",
        "Member 4 Mobile",
        "Project Description"
      ];
      
      sheet.appendRow(headers);
      
      // Format Header Row (Bold, Background Color, Freeze)
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#0B4F9F");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    // Generate Unique Registration ID
    const timestamp = data.timestamp || new Date().toISOString();
    const formattedDate = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    const regId = "EUR-2026-" + Math.floor(1000 + Math.random() * 9000);

    // Extract Team Leader Details
    const teamLeader = data.teamLeader || "";
    const leaderRollNo = data.leaderRollNo || "";
    const branch = data.branch || "";
    const section = data.section || "";
    const year = data.year || "";
    const mobile = data.mobile || "";
    const email = data.email || "";
    const teamName = data.teamName || "";
    const projectName = data.projectName || "N/A";
    const teamSize = data.teamSize || 1;

    // Extract Member 2 Details (supports both nested object & flat params)
    const m2 = data.member2 || {};
    const m2Name = m2.name || data.m2Name || "";
    const m2Roll = m2.rollNumber || data.m2Roll || "";
    const m2Branch = m2.branch || data.m2Branch || "";
    const m2Section = m2.section || data.m2Section || "";
    const m2Mobile = m2.mobile || data.m2Mobile || "";

    // Extract Member 3 Details
    const m3 = data.member3 || {};
    const m3Name = m3.name || data.m3Name || "";
    const m3Roll = m3.rollNumber || data.m3Roll || "";
    const m3Branch = m3.branch || data.m3Branch || "";
    const m3Section = m3.section || data.m3Section || "";
    const m3Mobile = m3.mobile || data.m3Mobile || "";

    // Extract Member 4 Details
    const m4 = data.member4 || {};
    const m4Name = m4.name || data.m4Name || "";
    const m4Roll = m4.rollNumber || data.m4Roll || "";
    const m4Branch = m4.branch || data.m4Branch || "";
    const m4Section = m4.section || data.m4Section || "";
    const m4Mobile = m4.mobile || data.m4Mobile || "";

    // Extract Project Idea Description
    const projectDescription = data.projectDescription || "";

    // Construct Row Data Array
    const rowData = [
      formattedDate,
      regId,
      teamName,
      projectName,
      teamLeader,
      leaderRollNo,
      branch,
      section,
      year,
      mobile,
      email,
      teamSize,
      m2Name,
      m2Roll,
      m2Branch,
      m2Section,
      m2Mobile,
      m3Name,
      m3Roll,
      m3Branch,
      m3Section,
      m3Mobile,
      m4Name,
      m4Roll,
      m4Branch,
      m4Section,
      m4Mobile,
      projectDescription
    ];

    // Append Row to Spreadsheet
    sheet.appendRow(rowData);

    // Return Success JSON Response
    const output = JSON.stringify({
      status: "success",
      message: "Registration recorded successfully",
      registrationId: regId,
      timestamp: formattedDate
    });

    return ContentService
      .createTextOutput(output)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return Error JSON Response
    const errorOutput = JSON.stringify({
      status: "error",
      message: error.toString()
    });

    return ContentService
      .createTextOutput(errorOutput)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles HTTP GET requests to test endpoint health
 */
function doGet(e) {
  const result = JSON.stringify({
    status: "online",
    service: "Eureka! 2026 Registration Backend API",
    organization: "Arya College of Engineering & I.T. x Arya Incubation Centre",
    timestamp: new Date().toISOString()
  });

  return ContentService
    .createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}
