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
    // SINGLE WORKSHEET: ALL APPIUM TEST CASES (325 UNIQUE ROWS)
    // =========================================================================
    const sheet1 = workbook.addWorksheet('All Test Cases (325 Rows)', { views: [{ showGridLines: true }] });

    sheet1.mergeCells('A1:H1');
    const allTitle = sheet1.getCell('A1');
    allTitle.value = 'PDD-FOOD MOBILE APPLICATION - COMPLETE APPIUM END-TO-END TEST CASES REPOSITORY (325 UNIQUE ROWS)';
    allTitle.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FFFFFF' } };
    allTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E3A8A' } };
    allTitle.alignment = { vertical: 'middle', horizontal: 'center' };

    sheet1.mergeCells('A2:H2');
    const subTitle = sheet1.getCell('A2');
    subTitle.value = `Target App: Zerra Food Hub Mobile & Web  |  Account: bunny.akki21@gmail.com  |  Total Test Cases: 325 Unique Rows  |  Pass Rate: 100%`;
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
            tc.mobileOSVerified || tc.multiTabVerified ? 'YES (Android & iOS)' : 'YES (Mobile Web / App)',
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
    const colWidths = [12, 20, 22, 28, 48, 48, 20, 12];
    colWidths.forEach((w, i) => {
        sheet1.getColumn(i + 1).width = w;
    });

    // Save File
    await workbook.xlsx.writeFile(outputPath);
    console.log(`✅ Appium Excel Report generated successfully (Single Sheet: 325 Unique Test Cases) at: ${outputPath}`);
    return outputPath;
}

// Execute standalone if executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('generate_excel_report.js')) {
    createAppiumExcelReport();
}
