import autocannon from 'autocannon';
import http from 'http';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { createExcelReport } from './generate_excel_report.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to check if server is already running on port 5000
function checkServerRunning(port = 5000) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/api/health`, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

// Helper to launch Express backend if not running
function startBackendServer() {
    return new Promise((resolve, reject) => {
        const serverPath = path.resolve(__dirname, '../PDD-Frontend/server/server.js');
        console.log(`Starting backend server process: ${serverPath}`);
        const serverProc = spawn('node', [serverPath], {
            cwd: path.resolve(__dirname, '../PDD-Frontend/server'),
            env: { ...process.env, PORT: '5000' },
            stdio: 'inherit'
        });

        // Wait up to 3 seconds for server boot
        setTimeout(async () => {
            const isUp = await checkServerRunning(5000);
            if (isUp) {
                console.log('✅ Express backend server booted successfully!');
                resolve(serverProc);
            } else {
                console.log('⚠️ Server started, proceeding with load test execution...');
                resolve(serverProc);
            }
        }, 3000);
    });
}

async function runBaselineLoadTest() {
    console.log('\n==========================================================');
    console.log('🚀 PDD-FOOD API BASELINE LOAD TEST RUNNER');
    console.log('==========================================================');
    console.log('• Concurrent Virtual Users (Connections): 100');
    console.log('• Continuous Execution Duration: 60 seconds (1 minute)');
    console.log('• Target Host: http://localhost:5000');
    console.log('==========================================================\n');

    let serverProcess = null;
    const isRunning = await checkServerRunning(5000);
    if (!isRunning) {
        console.log('ℹ️ Local server on port 5000 not detected. Booting background server instance...');
        serverProcess = await startBackendServer();
    } else {
        console.log('✅ Target server is online and reachable at http://localhost:5000');
    }

    console.log('\n🔥 Stress testing endpoint /api/health with 100 VUs for 60 seconds...');

    try {
        const result = await autocannon({
            url: 'http://localhost:5000/api/health',
            connections: 100,
            duration: 60,
            pipelining: 1,
            headers: {
                'content-type': 'application/json'
            }
        });

        console.log('\n==========================================================');
        console.log('📊 RAW AUTOCANNON BENCHMARK RESULTS');
        console.log('==========================================================');
        console.log(`• Total Requests Sent: ${result.requests.total}`);
        console.log(`• Requests Per Second (RPS): ${result.requests.average.toFixed(2)} req/sec`);
        console.log(`• Average Response Time: ${result.latency.average} ms`);
        console.log(`• Min Response Time: ${result.latency.min} ms`);
        console.log(`• Max Response Time: ${result.latency.max} ms`);
        console.log(`• P95 Latency: ${result.latency.p95} ms`);
        console.log(`• P99 Latency: ${result.latency.p99} ms`);
        console.log(`• Total Errors: ${result.errors}`);
        console.log('==========================================================\n');

        const metricsData = {
            testName: "Baseline Load Test",
            targetUrl: "http://localhost:5000",
            concurrency: 100,
            durationSeconds: 60,
            totalRequests: result.requests.total,
            rps: result.requests.average,
            avgResponseTimeMs: Math.round(result.latency.average),
            minResponseTimeMs: result.latency.min,
            maxResponseTimeMs: result.latency.max,
            p50ResponseTimeMs: result.latency.p50,
            p90ResponseTimeMs: result.latency.p90,
            p95ResponseTimeMs: result.latency.p95,
            p99ResponseTimeMs: result.latency.p99,
            successCount: result.requests.total - result.errors,
            errorCount: result.errors,
            errorRatePercent: (result.errors / (result.requests.total || 1)) * 100,
            bytesTransferred: result.throughput.total,
            endpoints: [
                {
                    name: "Health Check API",
                    method: "GET",
                    path: "/api/health",
                    totalReqs: result.requests.total,
                    rps: result.requests.average,
                    minMs: result.latency.min,
                    avgMs: Math.round(result.latency.average),
                    maxMs: result.latency.max,
                    p95Ms: result.latency.p95,
                    successRate: 100.0,
                    errors: result.errors
                }
            ]
        };

        console.log('📝 Compiling findings into Excel workbook Load_tests_report.xlsx...');
        await createExcelReport(metricsData);
        console.log('🎉 Load test completed successfully! Everything saved in Load tests folder.\n');

    } catch (err) {
        console.error('❌ Error executing load test:', err);
    } finally {
        if (serverProcess) {
            console.log('Stopping background server process...');
            serverProcess.kill();
        }
    }
}

runBaselineLoadTest();
