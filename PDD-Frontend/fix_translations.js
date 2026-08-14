const fs = require('fs');
const path = require('path');
const { translations } = require('./src/i18n/translations');

// We have the compiled translations object in Node memory!
// Let's verify each language and fix missing keys.
const enKeys = Object.keys(translations.en);
const languages = Object.keys(translations);

console.log(`Checking ${languages.length} languages against ${enKeys.length} baseline keys in 'en'...`);

languages.forEach(lang => {
  if (lang === 'en') return;
  const langObj = translations[lang];
  let added = 0;
  enKeys.forEach(key => {
    if (!(key in langObj)) {
      // If missing, use en value or translated dictionary fallback
      langObj[key] = translations.en[key];
      added++;
    }
  });
  if (added > 0) {
    console.log(`Added ${added} missing keys to language '${lang}'`);
  }
});

// Write updated translations back to translations.ts in proper TS format
let tsCode = `export type LanguageCode = 
  | 'en' | 'hi' | 'te' | 'ta' | 'kn' | 'mr' | 'bn' 
  | 'ml' | 'gu' | 'pa' | 'or' | 'ur' 
  | 'es' | 'fr' | 'ar' | 'de';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  // Major Indian Languages
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', nativeLabel: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', flag: '🇮🇳' },

  // World Languages
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪' },
];

export const translations: Record<LanguageCode, Record<string, string>> = {\n`;

languages.forEach(lang => {
  tsCode += `  ${lang}: {\n`;
  Object.keys(translations[lang]).forEach(k => {
    const val = translations[lang][k].replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    tsCode += `    ${k}: "${val}",\n`;
  });
  tsCode += `  },\n\n`;
});

tsCode += `};\n`;

fs.writeFileSync(path.join(__dirname, 'src/i18n/translations.ts'), tsCode, 'utf8');
console.log('Cleanly formatted and updated src/i18n/translations.ts');
