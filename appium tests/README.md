# 📱 PDD-Food Appium Mobile End-to-End Test Suite & Excel Report

This directory contains the complete **Appium Mobile End-to-End Test Suite** and **Excel Report Generator** for the **Zerra Food Hub (PDD Food)** mobile application (React Native Expo / Mobile Web).

---

## 📊 Overview & Test Coverage

- **Total Unique Test Cases**: 325 Distinct Mobile Scenarios
- **Target Application**: Zerra Food Hub (React Native Expo Mobile & Web)
- **Target OS**: Android 14+ (UiAutomator2) & iOS 17+ (XCUITest)
- **Generated Report File**: `Appium_report.xlsx`

---

## 🚀 Running Tests & Generating Reports Locally

```bash
# 1. Navigate to appium tests folder
cd "appium tests"

# 2. Install dependencies
npm install

# 3. Generate the Excel test report
npm run generate:report

# 4. Run full Appium mobile test suite
npm run test:appium
```

---

## ⚙️ CI/CD Integration

Integrated with GitHub Actions under `.github/workflows/appium-tests.yml` and bundled in `.github/workflows/all-test-reports.yml`.
