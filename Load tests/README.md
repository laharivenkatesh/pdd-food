# PDD-Food Baseline / Load Testing Suite 🚀

This directory (`Load tests`) contains all scripts, configuration, benchmarks, and Excel reports for baseline performance load testing of the **PDD-Food API**.

---

## 📌 Baseline Load Testing Requirements

The baseline load test measures system performance under normal, expected concurrent user load:
- **Virtual Users (VUs)**: 100 concurrent connections
- **Duration**: Continuous execution for 1 minute (60 seconds)
- **Traffic Volume**: Thousands of requests per minute

### Key Metrics Tracked
1. **Requests Per Second (RPS)**:
   - *Example*: `120 req/sec` — The API handles ~120 requests every second.
2. **Response Time**:
   - **Min**: Fastest response time (e.g., `50ms`)
   - **Average**: Mean response time (e.g., `250ms`)
   - **Max**: Slowest response time (e.g., `1500ms` / 1.5 seconds)
   - **P95 / P99**: 95th and 99th percentile latencies

---

## 📁 Folder Contents

```text
Load tests/
├── Load_tests_report.xlsx  # Styled Excel Spreadsheet (Executive Summary, Endpoints, 60s Log, Latency SLA)
├── generate_excel_report.js        # Script to create/refresh formatted Excel workbook
├── run_load_test.js                # Runner script for 100 VUs / 60s benchmark test using autocannon
├── load_test_config.json           # Configuration parameters and target SLAs
├── package.json                    # Isolated load test npm package dependencies (autocannon, exceljs)
└── README.md                       # Documentation & instructions
```

---

## 🛠️ How to Run the Load Test & Refresh Excel Report

### 1. Install Dependencies
Run from the `Load tests` directory:
```bash
npm install
```

### 2. Generate / Refresh the Excel Report Directly
```bash
npm run generate:excel
```
This generates `Load_tests_report.xlsx` with complete KPI summaries, endpoint details, second-by-second timeline log, and SLA analysis.

### 3. Run Live Baseline Load Test (100 VUs for 60 Seconds)
```bash
npm run test:load
```
This script will:
1. Connect to or boot the PDD-Food API Express backend (`http://localhost:5000`).
2. Run a continuous 60-second load test with 100 concurrent virtual users via `autocannon`.
3. Calculate RPS, Average, Min, Max, P95, and P99 response times.
4. Export live results directly into `Load_tests_report.xlsx`.

---

## 📊 Excel Sheet Overview (`Load_tests_report.xlsx`)

The workbook contains **4 dedicated tabs**:

1. **Executive Summary**: High-level KPI cards (Total Requests, RPS, Avg/Min/Max Latency, Pass/Fail status vs SLA thresholds).
2. **Endpoint Breakdown**: Performance metrics split by API path (`/api/health`, `/`, `/api/auth/send-otp`, `/api/auth/verify-otp`).
3. **1-Min Timeline (60s)**: Second-by-second trace (T+1s to T+60s) of active VUs, instantaneous RPS, average latency, and max latency spikes.
4. **Latency & SLA Analysis**: Percentile latency distributions (<50ms, 50-150ms, 150-250ms, 250-500ms, >1000ms) and architectural recommendation notes.
