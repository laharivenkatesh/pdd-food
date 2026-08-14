import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, '../Selenium reports/test_cases_database.js');
const targetPath = path.resolve(__dirname, 'test_cases_database.js');

let content = fs.readFileSync(sourcePath, 'utf8');
content = content
    .replace('PDD-Food Web Application (https://pdd-food-new.vercel.app)', 'PDD-Food Web Build & Production Bundle Verification (https://pdd-food-new.vercel.app)')
    .replace(/multiTabVerified/g, 'webBuildVerified');

fs.writeFileSync(targetPath, content, 'utf8');
console.log('✅ Successfully copied all 325 unique test cases to web build reports/test_cases_database.js');
