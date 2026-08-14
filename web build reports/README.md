# 🌐 PDD-Food Web Build & Production Deployment Test Suite & Excel Report

This directory contains the **Web Build Verification & Production Asset Audit Test Suite** and **Excel Report Generator** for **Zerra Food Hub (PDD Food)** (`https://pdd-food-new.vercel.app`).

---

## 📊 Overview & Test Coverage

- **Total Unique Test Cases**: 325 Distinct Web Build Scenarios
- **Target Application**: Zerra Food Hub (Expo Web / Vite / Vercel Serverless)
- **Supported Browsers**: Chrome, Safari, Firefox, Edge
- **Generated Report File**: `Web_build_report.xlsx` (Single Sheet with 325 Rows)

---

## 🚀 Running Tests & Generating Reports Locally

```bash
# 1. Navigate to web build reports folder
cd "web build reports"

# 2. Install dependencies
npm install

# 3. Generate the Excel test report
npm run generate:report
```

---

## ⚙️ CI/CD Integration

Integrated with GitHub Actions under `.github/workflows/web-build-tests.yml` and bundled in `.github/workflows/all-test-reports.yml`.
