# 🚀 Eureka! 2026 Team Registration Portal

**Organized by:** Arya College of Engineering & I.T. × Arya Incubation Centre  
**Technology Stack:** HTML5, Vanilla CSS3 (Glassmorphism & Gradients), Pure JavaScript (ES6), Google Apps Script & Google Spreadsheet DB.

---

## 📌 Features

- **Startup Ecosystem Aesthetics:** Premium Glassmorphism UI, animated gradients, floating geometric particles, custom SVG vector graphics.
- **Interactive Multi-Step Registration Wizard:** 
  - **Step 1:** Team Leader Information & Team Size selection.
  - **Step 2:** Dynamic Team Member Details (automatically shows/hides fields for 1 to 4 members with animated card entrances).
  - **Step 3:** Project Idea Description with live character counter (50–600 chars).
  - **Step 4:** Summary Review & Mandatory Student Declarations.
- **Robust Real-Time Validation:** 10-digit mobile number validation (`^[6-9]\d{9}$`), email format regex, roll number, and required field checks.
- **Serverless Google Sheets Database:** Form submissions write directly to Google Spreadsheets via Google Apps Script Web App API.
- **Success & Error Dialogs:** Animated SVG checkmark success modal and retry error modal.
- **Fully Responsive & Accessible:** Built with semantic HTML5, clean CSS flexbox/grid layout, and WCAG-friendly contrast ratios.

---

## 📂 Project Structure

```
Eureka/
├── index.html          # Semantic HTML5 layout, hero section, about, registration wizard, modals
├── style.css           # Custom CSS design system, glassmorphism, animations, responsive breakpoints
├── script.js           # Multi-step logic, dynamic field toggles, validation, Google Apps Script fetch client
├── Code.gs             # Google Apps Script backend code (doPost & spreadsheet integration)
├── appsscript.json     # Apps Script manifest configuration file
└── README.md           # Deployment guide & Google Sheets setup instructions
```

---

## 📊 Google Spreadsheet Column Structure

When a student team registers, Google Apps Script automatically creates and appends data into a sheet named **`Registrations`** with the following 28 columns:

| Col # | Column Header Name | Description |
| :--- | :--- | :--- |
| 1 | **Timestamp** | Date & Time of submission (IST) |
| 2 | **Registration ID** | Unique ID (e.g. `EUR-2026-8942`) |
| 3 | **Team Name** | Name of the startup team |
| 4 | **Project Name** | Title of the project/idea |
| 5 | **Team Leader Name** | Full name of the team leader |
| 6 | **Leader Roll No** | University Roll Number of leader |
| 7 | **Branch** | CSE, AI & DS, AI & ML, IT, ECE, EE, Mechanical, Civil, Other |
| 8 | **Section** | Section A, B, C, D, or E |
| 9 | **Year of Study** | 1st, 2nd, 3rd, or 4th Year |
| 10 | **Leader Mobile** | 10-digit phone number |
| 11 | **Leader Email** | Verified email address |
| 12 | **Team Size** | Number of team members (1 to 4) |
| 13 | **Member 2 Name** | Name of member 2 (Blank if solo) |
| 14 | **Member 2 Roll No** | Roll No of member 2 |
| 15 | **Member 2 Branch** | Branch of member 2 |
| 16 | **Member 2 Section** | Section of member 2 |
| 17 | **Member 2 Mobile** | Mobile number of member 2 |
| 18 | **Member 3 Name** | Name of member 3 (Blank if <3) |
| 19 | **Member 3 Roll No** | Roll No of member 3 |
| 20 | **Member 3 Branch** | Branch of member 3 |
| 21 | **Member 3 Section** | Section of member 3 |
| 22 | **Member 3 Mobile** | Mobile number of member 3 |
| 23 | **Member 4 Name** | Name of member 4 (Blank if <4) |
| 24 | **Member 4 Roll No** | Roll No of member 4 |
| 25 | **Member 4 Branch** | Branch of member 4 |
| 26 | **Member 4 Section** | Section of member 4 |
| 27 | **Member 4 Mobile** | Mobile number of member 4 |
| 28 | **Project Description**| 50–600 character startup pitch summary |

---

## 🛠️ Step-by-Step Google Apps Script & Sheets Setup Guide

Follow these steps to connect your website to Google Sheets:

### Step 1: Create Google Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com) and click **Blank spreadsheet**.
2. Title the spreadsheet **`Eureka 2026 Registrations`**.

### Step 2: Open Apps Script Editor
1. In the Google Sheet top menu, click **Extensions** > **Apps Script**.
2. Replace all existing code in `Code.gs` with the content of [Code.gs](file:///c:/Users/Krishna/Documents/Eureka/Code.gs).
3. In the left sidebar of the Apps Script editor, click **Project Settings** ⚙️ and check **"Show 'appsscript.json' manifest file in editor"**.
4. Click `appsscript.json` in the file list and paste the content of [appsscript.json](file:///c:/Users/Krishna/Documents/Eureka/appsscript.json).

### Step 3: Deploy as Web App
1. At the top right of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the Gear icon ⚙️ next to "Select type" and select **Web app**.
3. Configure the deployment settings:
   - **Description:** `Eureka 2026 Registration Backend`
   - **Execute as:** `Me (your_email@gmail.com)`
   - **Who has access:** `Anyone` *(Crucial for allowing external form submissions)*
4. Click **Deploy**.
5. Grant necessary permissions when Google prompts for authorization.
6. Copy the **Web App URL** generated (it will look like `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Link Web App URL in Website
1. Open [script.js](file:///c:/Users/Krishna/Documents/Eureka/script.js).
2. Locate line 11:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Replace `'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'` with your copied Web App URL.

---

## 🌐 Local Testing & Production Deployment

### Option A: Local Browser Testing
Open `index.html` directly in any web browser or use VS Code Live Server extension.

### Option B: Hosting on GitHub Pages
1. Push the files `index.html`, `style.css`, and `script.js` to a public GitHub repository.
2. Go to **Settings** > **Pages** in your GitHub repository.
3. Under **Build and deployment**, select `main` branch and `/ (root)` folder.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Option C: Hosting on Vercel / Netlify
1. Drag and drop the `Eureka` directory into the Netlify / Vercel dashboard.
2. Your static registration site will instantly deploy.

---

## 📞 Support & Contact

- **Institution:** Arya College of Engineering & I.T.
- **Centre:** Arya Incubation Centre
- **Location:** SP-42, Kukas Industrial Area, RIICO, Jaipur, Rajasthan 302028
- **Email:** `incubation@aryacollege.in` | `eureka2026@aryacollege.in`
- **Phone:** +91 (141) 2821000
