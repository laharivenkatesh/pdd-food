const fs = require('fs');
const path = require('path');
const { translations, translateFoodName, translateNGODescription } = require('./scratch/translations');

const languages = Object.keys(translations);
console.log(`Auditing ${languages.length} languages: ${languages.join(', ')}`);

const enKeys = Object.keys(translations.en || {});
console.log(`Total translation keys in 'en': ${enKeys.length}`);

// Allowed proper nouns & system tokens
const PROPER_NOUN_PATTERNS = [
  /^Zerra( Food Hub)?$/i,
  /^Akshaya Trust$/i,
  /^Siragu Montessori School Trust$/i,
  /^Blue Cross of India$/i,
  /^Chennai Animal Action Group$/i,
  /^Exnora International$/i,
  /^The Robin Hood Army$/i,
  /^Helping Hands Foundation$/i,
  /^Paws Rescue$/i,
  /^City Food Bank$/i,
  /^Delhi Animal Shelter$/i,
  /^Roti Bank Delhi$/i,
  /^Welfare of Stray Dogs$/i,
  /^Hope Foundation Kolkata$/i,
  /^Sarv Seva Samithi$/i,
  /^Reach India$/i,
  /^(https?:\/\/|tel:|mailto:|\d|:\d|\+|#|₹|\$)/,
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
];

function isProperNoun(str) {
  const trimmed = str.trim();
  return PROPER_NOUN_PATTERNS.some(pat => pat.test(trimmed));
}

// 1. Dictionary Audit
const dictionaryLeaks = {};

languages.forEach(lang => {
  if (lang === 'en') return;
  const langDict = translations[lang] || {};
  const leaks = [];

  enKeys.forEach(key => {
    const val = langDict[key];
    const enVal = translations.en[key];

    if (!val || val.trim() === '') {
      leaks.push({ key, val: '', enVal });
    } else if (val === enVal && /[a-zA-Z]{3,}/.test(enVal)) {
      if (!isProperNoun(enVal)) {
        leaks.push({ key, val, enVal });
      }
    }
  });

  if (leaks.length > 0) {
    dictionaryLeaks[lang] = leaks;
  }
});

// 2. Source Code Hardcoded Text Audit
function getAllFiles(dir, ext = ['.tsx', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else {
      if (ext.some(e => filePath.endsWith(e)) && !filePath.includes('translations.ts') && !filePath.includes('transliterate.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const srcFiles = getAllFiles(path.join(__dirname, 'src'));
const codeLeaks = [];

srcFiles.forEach(file => {
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('import ')) return;

    // Check JSX text
    const jsxMatches = line.match(/>([^<>{}\n]+)</g);
    if (jsxMatches) {
      jsxMatches.forEach(m => {
        const text = m.substring(1, m.length - 1).trim();
        if (text && /[a-zA-Z]{3,}/.test(text)) {
          if (!isProperNoun(text) && !trimmed.includes('t(') && !trimmed.includes('styles.')) {
            codeLeaks.push({ file: relPath, line: lineNum, text, category: 'UNINTENDED_ENGLISH_LEAK' });
          }
        }
      });
    }
  });
});

// 3. Rendered Data Pipeline Verification
const renderedLeaks = [];

const sampleFoods = ["Vegetable Biryani", "Fresh Bread Loaves", "Chicken Curry", "Gulab Jamun", "Paneer"];
const sampleNGOs = [
  { id: "c1", name: "Akshaya Trust", description: "Feeds thousands of Chennai's hungry daily" },
  { id: "c2", name: "Siragu Montessori School Trust", description: "Supports underprivileged children with meals" },
  { id: "c3", name: "Blue Cross of India", description: "Animal rescue and care across Tamil Nadu" },
  { id: "c4", name: "Chennai Animal Action Group", description: "Rescues and rehabilitates street animals" },
  { id: "c5", name: "Reach India", description: "Community outreach for humans" },
  { id: "c6", name: "Exnora International", description: "Waste reduction and food redistribution" },
  { id: "d2", name: "Roti Bank Delhi", description: "Free meals for the homeless" },
  { id: "m1", name: "The Robin Hood Army", description: "Zero-waste food rescue network" }
];

languages.forEach(lang => {
  if (lang === 'en') return;

  // Test Food Name translation/transliteration
  sampleFoods.forEach(foodName => {
    const rendered = translateFoodName(foodName, lang);
    if (/^[a-zA-Z\s]+$/.test(rendered) && !['es', 'fr', 'de'].includes(lang)) {
      renderedLeaks.push({ lang, itemType: 'Food Name', id: foodName, text: rendered });
    }
  });

  // Test NGO Description translation
  sampleNGOs.forEach(ngo => {
    if (ngo.description) {
      const renderedDesc = translateNGODescription(ngo.id, ngo.description, lang);
      if (renderedDesc && /^[a-zA-Z\s',-]+$/.test(renderedDesc)) {
        renderedLeaks.push({ lang, itemType: 'NGO Description', id: ngo.id, text: renderedDesc });
      }
    }
  });
});

console.log("\n==============================================");
console.log("             LOCALIZATION AUDIT REPORT         ");
console.log("==============================================");

let totalLeaks = 0;

languages.forEach(lang => {
  if (lang === 'en') return;
  const dictLeakCount = dictionaryLeaks[lang] ? dictionaryLeaks[lang].length : 0;
  const rendLeakCount = renderedLeaks.filter(r => r.lang === lang).length;
  const sum = dictLeakCount + rendLeakCount;
  totalLeaks += sum;

  console.log(`[${lang.toUpperCase()}] Dictionary Leaks: ${dictLeakCount} | Rendered Pipeline Leaks: ${rendLeakCount}`);
  if (dictLeakCount > 0) {
    dictionaryLeaks[lang].forEach(l => console.log(`   - Missing/English key: '${l.key}' (EN: "${l.enVal}")`));
  }
});

console.log(`\nCodebase JSX Hardcoded Leaks: ${codeLeaks.length}`);
codeLeaks.forEach(c => console.log(`   - ${c.file}:${c.line} -> "${c.text}"`));

console.log("\n----------------------------------------------");
if (totalLeaks === 0 && codeLeaks.length === 0) {
  console.log(" SUCCESS: 0 UNINTENDED ENGLISH LEAKS DETECTED ACROSS ALL 15 NON-ENGLISH LANGUAGES! 🎉");
} else {
  console.log(` WARNING: ${totalLeaks + codeLeaks.length} TOTAL LOCALIZATION ISSUES FOUND!`);
}
console.log("----------------------------------------------\n");

fs.writeFileSync('audit_summary.json', JSON.stringify({ dictionaryLeaks, codeLeaks, renderedLeaks, totalLeaks: totalLeaks + codeLeaks.length }, null, 2));
