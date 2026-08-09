# PDD-Food Selenium End-to-End Testing Suite & Reports 🚀

This directory (`Selenium reports`) contains the complete automated End-to-End (E2E) Selenium testing framework and Excel report generator for the **PDD-Food Web Application** (`https://pdd-food-new.vercel.app`).

---

## 📌 Test Suite Specifications

- **Target URL**: `https://pdd-food-new.vercel.app`
- **Login Credentials**:
  - **Email**: `bunny.akki21@gmail.com`
  - **Password**: `Bunny123`
- **Total Unique Test Cases**: **325 Distinct, Non-Repeated Test Cases**
- **Excel Report File**: `Selenium_report.xlsx` (saved in this directory)
- **Multi-Tab Workflows**: Context switching between Tab 1 (Donor) and Tab 2 (Receiver) to verify real-time cross-tab updates.

---

## 📁 Consolidated Directory Contents

```text
Selenium reports/
├── Selenium_report.xlsx      # Styled Excel Report (KPI Summary, 325 Test Cases, Category Breakdown, Multi-Tab Log)
├── test_config.json          # Target URL, Credentials, & Driver Configurations
├── test_cases_database.js    # Database of 325 Unique, Distinct Test Cases
├── generate_excel_report.js  # Excel Workbook Generator script using exceljs
├── run_selenium_tests.js     # Master Selenium Automation Runner & Multi-Tab Executor
├── package.json              # Isolated npm dependencies (selenium-webdriver, exceljs)
└── README.md                 # Documentation
```

---

## 🛠️ How to Run Tests & Regenerate Excel Report

### 1. Install Dependencies
Run from `Selenium reports`:
```bash
npm install
```

### 2. Generate / Refresh the Excel Report Directly
```bash
npm run generate:report
```
This generates `Selenium_report.xlsx` directly inside this `Selenium reports` folder.

### 3. Run Complete Selenium E2E Test Suite
```bash
npm run test:selenium
```
This script will:
1. Initialize the Selenium Chrome WebDriver.
2. Navigate to `https://pdd-food-new.vercel.app`.
3. Perform login authentication with `bunny.akki21@gmail.com` / `Bunny123`.
4. Execute multi-tab cross-context verification (Tab 1 Donor vs Tab 2 Receiver).
5. Verify 325 distinct test cases.
6. Export findings to `Selenium_report.xlsx`.
