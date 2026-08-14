import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { testCasesDatabase } from './test_cases_database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createAppiumExcelReport(customTestCases = null) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'PDD Food Appium QA Automation Team';
    workbook.created = new Date();
    workbook.modified = new Date();

    const testCases = customTestCases || testCasesDatabase;
    const totalTests = testCases.length;
    const passedTests = testCases.filter(tc => tc.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    const passRate = ((passedTests / (totalTests || 1)) * 100).toFixed(1);

    const outputPath = path.join(__dirname, 'Appium_report.xlsx');

    // Styling Palette
    const colors = {
        navyHeader: '0F172A',
        headerText: 'FFFFFF',
        blueAccent: '2563EB',
        lightBlueFill: 'EFF6FF',
        cardBg: 'F8FAFC',
        greenPass: '15803D',
        greenPassFill: 'DCFCE7',
        redFail: 'B91C1C',
        redFailFill: 'FEE2E2',
        zebraRow: 'F8FAFC'
    };

    const styleHeaderCell = (cell, text) => {
        cell.value = text;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: colors.headerText } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.navyHeader } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
            top: { style: 'thin', color: { argb: '94A3B8' } },
            bottom: { style: 'medium', color: { argb: '475569' } },
            left: { style: 'thin', color: { argb: '94A3B8' } },
            right: { style: 'thin', color: { argb: '94A3B8' } }
        };
    };

    // =========================================================================
    // SHEET 1 (DEFAULT OPEN TAB): ALL APPIUM TEST CASES (325 UNIQUE ROWS)
    // =========================================================================
    const sheet1 = workbook.addWorksheet('All Test Cases (325 Rows)', { views: [{ showGridLines: true }] });

    sheet1.mergeCells('A1:H1');
    const allTitle = sheet1.getCell('A1');
    allTitle.value = 'PDD-FOOD MOBILE APPLICATION - APPIUM END-TO-END AUTOMATED TEST SUITE (325 UNIQUE ROWS)';
    allTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFF' } };
    allTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
    allTitle.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet1.mergeCells('A2:H2');
    const subTitle = sheet1.getCell('A2');
    subTitle.value = `Target App: Zerra Food Hub Mobile & Web  |  Account: bunny.akki21@gmail.com  |  Total Test Cases: ${totalTests} Unique Rows  |  Pass Rate: ${passRate}%`;
    subTitle.font = { name: 'Calibri', size: 10, italic: true, color: { argb: '475569' } };
    subTitle.alignment = { vertical: 'middle', horizontal: 'center' };

    const tcHeaders = ['Test ID', 'Category', 'Feature Area', 'Element / Button Tested', 'Execution Step Instructions', 'Expected Result', 'Mobile OS Scope', 'Status'];
    sheet1.getRow(4).height = 25;

    tcHeaders.forEach((h, i) => {
        const colLetter = String.fromCharCode(65 + i); // A is 65
        styleHeaderCell(sheet1.getCell(`${colLetter}4`), h);
    });

    testCases.forEach((tc, idx) => {
        const rIdx = 5 + idx;
        sheet1.getRow(rIdx).height = 22;

        const rowValues = [
            tc.id,
            tc.category,
            tc.feature,
            tc.elementTested,
            tc.steps,
            tc.expectedResult,
            tc.mobileOSVerified ? 'Android & iOS' : 'Mobile Web / App',
            tc.status
        ];

        rowValues.forEach((val, cIdx) => {
            const colLetter = String.fromCharCode(65 + cIdx);
            const cell = sheet1.getCell(`${colLetter}${rIdx}`);
            cell.value = val;
            cell.font = { name: 'Calibri', size: 9.5 };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 1 ? colors.zebraRow : 'FFFFFF' } };
            cell.border = {
                top: { style: 'thin', color: { argb: 'E2E8F0' } },
                bottom: { style: 'thin', color: { argb: 'E2E8F0' } },
                left: { style: 'thin', color: { argb: 'E2E8F0' } },
                right: { style: 'thin', color: { argb: 'E2E8F0' } }
            };

            // Alignment rules
            if (cIdx === 0) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.font = { name: 'Calibri', size: 9.5, bold: true, color: { argb: colors.blueAccent } };
            } else if (cIdx === 1 || cIdx === 2) {
                cell.alignment = { horizontal: 'left', vertical: 'middle' };
                cell.font = { name: 'Calibri', size: 9.5, bold: true };
            } else if (cIdx === 6) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            } else if (cIdx === 7) {
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: tc.status === 'PASS' ? colors.greenPass : colors.redFail } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: tc.status === 'PASS' ? colors.greenPassFill : colors.redFailFill } };
            } else {
                cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
            }
        });
    });

    // Column widths
    const colWidths = [12, 20, 22, 28, 48, 48, 16, 12];
    colWidths.forEach((w, i) => {
        sheet1.getColumn(i + 1).width = w;
    });

    // =========================================================================
    // SHEET 2: EXECUTIVE SUMMARY & METRICS
    // =========================================================================
    const sheet2 = workbook.addWorksheet('Executive Summary & Metrics', { views: [{ showGridLines: true }] });

    sheet2.mergeCells('A1:G1');
    const execTitle = sheet2.getCell('A1');
    execTitle.value = 'APPIUM MOBILE AUTOMATION TEST SUITE - EXECUTIVE DASHBOARD SUMMARY';
    execTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFF' } };
    execTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };
    execTitle.alignment = { vertical: 'middle', horizontal: 'center' };

    // Metric Cards
    const metrics = [
        { label: 'TOTAL TEST CASES', val: totalTests, color: '2563EB', fill: 'EFF6FF' },
        { label: 'PASSED TEST CASES', val: passedTests, color: '15803D', fill: 'DCFCE7' },
        { label: 'FAILED TEST CASES', val: failedTests, color: 'B91C1C', fill: 'FEE2E2' },
        { label: 'PASS RATE', val: `${passRate}%`, color: '15803D', fill: 'DCFCE7' }
    ];

    sheet2.getRow(3).height = 18;
    sheet2.getRow(4).height = 28;

    metrics.forEach((m, i) => {
        const startCol = String.fromCharCode(65 + (i * 2));
        const endCol = String.fromCharCode(66 + (i * 2));
        sheet2.mergeCells(`${startCol}3:${endCol}3`);
        sheet2.mergeCells(`${startCol}4:${endCol}4`);

        const lblCell = sheet2.getCell(`${startCol}3`);
        lblCell.value = m.label;
        lblCell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: '475569' } };
        lblCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: m.fill } };
        lblCell.alignment = { vertical: 'middle', horizontal: 'center' };

        const valCell = sheet2.getCell(`${startCol}4`);
        valCell.value = m.val;
        valCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: m.color } };
        valCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: m.fill } };
        valCell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Category Breakdown Table
    sheet2.getRow(7).height = 24;
    const catHeaders = ['Category Name', 'Total Cases', 'Passed', 'Failed', 'Pass Rate (%)', 'Mobile OS Scope'];
    catHeaders.forEach((h, i) => {
        const colLetter = String.fromCharCode(65 + i);
        styleHeaderCell(sheet2.getCell(`${colLetter}7`), h);
    });

    const categoryMap = {};
    testCases.forEach(tc => {
        if (!categoryMap[tc.category]) {
            categoryMap[tc.category] = { total: 0, pass: 0, fail: 0 };
        }
        categoryMap[tc.category].total++;
        if (tc.status === 'PASS') categoryMap[tc.category].pass++;
        else categoryMap[tc.category].fail++;
    });

    let catIdx = 8;
    Object.keys(categoryMap).forEach(cat => {
        const stats = categoryMap[cat];
        sheet2.getRow(catIdx).height = 20;

        sheet2.getCell(`A${catIdx}`).value = cat;
        sheet2.getCell(`B${catIdx}`).value = stats.total;
        sheet2.getCell(`C${catIdx}`).value = stats.pass;
        sheet2.getCell(`D${catIdx}`).value = stats.fail;
        sheet2.getCell(`E${catIdx}`).value = `${((stats.pass / stats.total) * 100).toFixed(1)}%`;
        sheet2.getCell(`F${catIdx}`).value = 'Android & iOS';

        ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
            const cell = sheet2.getCell(`${col}${catIdx}`);
            cell.font = { name: 'Calibri', size: 10 };
            cell.alignment = { vertical: 'middle', horizontal: col === 'A' ? 'left' : 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'CBD5E1' } },
                bottom: { style: 'thin', color: { argb: 'CBD5E1' } },
                left: { style: 'thin', color: { argb: 'CBD5E1' } },
                right: { style: 'thin', color: { argb: 'CBD5E1' } }
            };
        });

        catIdx++;
    });

    sheet2.getColumn(1).width = 28;
    sheet2.getColumn(2).width = 16;
    sheet2.getColumn(3).width = 14;
    sheet2.getColumn(4).width = 14;
    sheet2.getColumn(5).width = 16;
    sheet2.getColumn(6).width = 20;

    // Save File
    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ Appium Excel Report generated successfully at: ${outputPath}`);
    return outputPath;
}

// Execute standalone if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('generate_excel_report.js')) {
    createAppiumExcelReport();
}
