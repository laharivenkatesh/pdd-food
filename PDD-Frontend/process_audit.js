const fs = require('fs');
const data = JSON.parse(fs.readFileSync('audit_result.json'));

let output = '';
output += '=== DICTIONARY AUDIT (ALL 16 LANGUAGES) ===\n';
Object.keys(data.dictionaryAudit).forEach(lang => {
  const item = data.dictionaryAudit[lang];
  output += `Language [${lang}]: Missing Keys = ${item.missingCount}, Extra Keys = ${item.extraCount}, Untranslated English Values = ${item.untranslatedCount}\n`;
  if (item.untranslatedCount > 0) {
    output += `  Untranslated items: ${JSON.stringify(item.untranslatedEnglish)}\n`;
  }
  if (item.missingCount > 0) {
    output += `  Missing keys: ${JSON.stringify(item.missingKeys)}\n`;
  }
});

output += '\n=== CODE LEAKS IN ALL SOURCE FILES ===\n';
const byFile = {};
data.codeLeaks.forEach(leak => {
  byFile[leak.file] = byFile[leak.file] || [];
  byFile[leak.file].push(leak);
});

Object.keys(byFile).sort().forEach(f => {
  output += `\nFILE: ${f} (${byFile[f].length} potential leaks)\n`;
  byFile[f].forEach(l => {
    output += `  Line ${l.line} [${l.type}]: "${l.text}"\n`;
    output += `    Snippet: ${l.codeSnippet}\n`;
  });
});

fs.writeFileSync('audit_summary.txt', output);
console.log('Wrote complete audit to audit_summary.txt');
