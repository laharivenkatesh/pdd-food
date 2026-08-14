# 🥗 Zerra Food Hub (PDD Food) - Automated Testing & CI/CD Pipelines

[![Appium Mobile E2E Tests](https://github.com/laharivenkatesh/pdd-food/actions/workflows/appium-tests.yml/badge.svg)](https://github.com/laharivenkatesh/pdd-food/actions/workflows/appium-tests.yml)
[![Selenium E2E Tests](https://github.com/laharivenkatesh/pdd-food/actions/workflows/selenium-tests.yml/badge.svg)](https://github.com/laharivenkatesh/pdd-food/actions/workflows/selenium-tests.yml)
[![Security & Vulnerability Audit](https://github.com/laharivenkatesh/pdd-food/actions/workflows/vulnerability-tests.yml/badge.svg)](https://github.com/laharivenkatesh/pdd-food/actions/workflows/vulnerability-tests.yml)
[![Baseline Load Testing](https://github.com/laharivenkatesh/pdd-food/actions/workflows/load-tests.yml/badge.svg)](https://github.com/laharivenkatesh/pdd-food/actions/workflows/load-tests.yml)
[![All Test Suites Pipeline](https://github.com/laharivenkatesh/pdd-food/actions/workflows/all-test-reports.yml/badge.svg)](https://github.com/laharivenkatesh/pdd-food/actions/workflows/all-test-reports.yml)

Welcome to the **Zerra Food Hub (PDD Food)** repository. This repository contains the complete web and mobile applications alongside automated testing suites and GitHub Actions CI/CD workflows that generate Microsoft Excel (.xlsx) reports on every push.

---

## 🚀 Automated Test Suites & Excel Reports

| Test Suite Name | Execution Directory | Test Count | Generated Excel Report | Target Platform | GitHub Workflow |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Appium Mobile E2E** | `appium tests/` | **325 Unique Scenarios** | `Appium_report.xlsx` | Android 14+ & iOS 17+ | [appium-tests.yml](.github/workflows/appium-tests.yml) |
| **2. Selenium Web E2E** | `Selenium reports/` | **325 Unique Scenarios** | `Selenium_report.xlsx` | Chrome / Web App | [selenium-tests.yml](.github/workflows/selenium-tests.yml) |
| **3. Security & Vulnerability** | `vulnerability tests/` | **305 Audit Cases** | `Vulnerability_report.xlsx` | Security & OWASP Audit | [vulnerability-tests.yml](.github/workflows/vulnerability-tests.yml) |
| **4. Performance Load Test** | `Load tests/` | **100 Concurrent VUs** | `Load_tests_report.xlsx` | Node.js Backend API | [load-tests.yml](.github/workflows/load-tests.yml) |

---

## 📦 Bundled GitHub Actions Artifacts

Every push or pull request to `main` automatically triggers the **All Test Suites Pipeline**, which bundles all generated Excel reports into a single downloadable artifact:

- **Artifact Name**: `All_PDD_Food_Excel_Test_Reports`
- **Contains**:
  - 📊 `appium tests/Appium_report.xlsx`
  - 🧪 `Selenium reports/Selenium_report.xlsx`
  - 🛡️ `vulnerability tests/Vulnerability_report.xlsx`
  - 📈 `Load tests/Load_tests_report.xlsx`

---

## 🏃 Running Test Generators Locally

### Appium Mobile E2E Tests
```bash
cd "appium tests"
npm install
node generate_excel_report.js
```

### Selenium Web E2E Tests
```bash
cd "Selenium reports"
npm install
node generate_excel_report.js
```

### Security & Vulnerability Audit
```bash
cd "vulnerability tests"
npm install
node generate_vulnerability_excel.js
```

### Baseline Load Tests
```bash
cd "Load tests"
npm install
node generate_excel_report.js
```
