import { LanguageCode } from "@/i18n/translations";

// Syllable/char mapping tables for Indian languages
const INDIC_MAPS: Record<string, Record<string, string>> = {
  hi: {
    paneer: "पनीर", biryani: "बिरयानी", samosa: "समोसा", dosa: "डोसा", idli: "इडली", roti: "रोटी", dal: "दाल", chapati: "चपाती", rice: "चावल", curry: "करी"
  },
  te: {
    paneer: "పనీర్", biryani: "బిర్యానీ", samosa: "సమోసా", dosa: "దోశ", idli: "ఇడ్లీ", roti: "రోటీ", dal: "పప్పు", chapati: "చపాతీ", rice: "అన్నం", curry: "కూర"
  },
  ta: {
    paneer: "பனீர்", biryani: "பிரியாணி", samosa: "சமோசா", dosa: "தோசை", idli: "இட்லி", roti: "ரொட்டி", dal: "பருப்பு", chapati: "சப்பாத்தி", rice: "சாதம்", curry: "கறி"
  },
  kn: {
    paneer: "ಪನೀರ್", biryani: "ಬಿರಿಯಾನಿ", samosa: "ಸಮೋಸಾ", dosa: "ದೋಸೆ", idli: "ಇಡ್ಲಿ", roti: "ರೊಟ್ಟಿ", dal: "ಬೇಳೆ", chapati: "ಚಪಾತಿ", rice: "ಅನ್ನ", curry: "ಕರಿ"
  },
  mr: {
    paneer: "पनीर", biryani: "बिर्याणी", samosa: "समोसा", dosa: "डोसा", idli: "इडली", roti: "पोळी", dal: "वरण", chapati: "चपाती", rice: "भात", curry: "रस्सा"
  },
  bn: {
    paneer: "পনীর", biryani: "বিরিয়ানি", samosa: "সিঙাড়া", dosa: "ডোসা", idli: "ইডলি", roti: "রুটি", dal: "ডাল", chapati: "চাপাতি", rice: "ভাত", curry: "কারি"
  },
  ml: {
    paneer: "പനീർ", biryani: "ബിരിയാണി", samosa: "സമോസ", dosa: "ദോശ", idli: "ഇഡ്ഡലി", roti: "റൊട്ടി", dal: "പരിപ്പ്", chapati: "ചപ്പാത്തി", rice: "ചോറ്", curry: "കറി"
  },
  gu: {
    paneer: "પનીર", biryani: "બિરયાની", samosa: "સમોસા", dosa: "ઢોંસા", idli: "ઇડલી", roti: "રોટલી", dal: "દાળ", chapati: "ચપાટી", rice: "ભાત", curry: "શાક"
  },
  pa: {
    paneer: "ਪਨੀਰ", biryani: "ਬਿਰਯਾਨੀ", samosa: "ਸਮੋਸਾ", dosa: "ਡੋਸਾ", idli: "ਇਡਲੀ", roti: "ਰੋਟੀ", dal: "ਦਾਲ", chapati: "ਚਪਾਤੀ", rice: "ਚੌਲ", curry: "ਕਰਚ"
  },
  or: {
    paneer: "ପନୀର", biryani: "ବିରିୟାନି", samosa: "ସିଙ୍ଗଡ଼ା", dosa: "ଦୋସା", idli: "ଇଡ୍ଲି", roti: "ରୁଟି", dal: "ଡାଲି", chapati: "ଚପାତି", rice: "ଭାତ", curry: "ତରକାରୀ"
  },
  ur: {
    paneer: "پنیر", biryani: "بریانی", samosa: "سموسہ", dosa: "ڈوسا", idli: "اڈلی", roti: "روٹی", dal: "دال", chapati: "چپاتی", rice: "چاول", curry: "سالن"
  }
};

/**
 * Transliterates an arbitrary user-entered food name into native Indic script phonetically
 * when no exact translation key exists in translations.ts.
 * Preserves original text for non-Indic languages (es, fr, de) or proper nouns.
 */
export function transliterateIndic(text: string, lang: LanguageCode): string {
  if (!text || lang === 'en') return text;
  
  const map = INDIC_MAPS[lang];
  if (!map) return text; // European languages (es, fr, de) preserve original user text

  const lower = text.trim().toLowerCase();

  // 1. Direct dictionary match for common culinary terms
  if (map[lower]) {
    return map[lower];
  }

  // 2. Token-by-token replacement for multi-word food names (e.g., "Paneer Tikka")
  const tokens = text.split(/(\s+)/);
  const transliteratedTokens = tokens.map(token => {
    const tLower = token.trim().toLowerCase();
    if (map[tLower]) return map[tLower];
    
    if (tLower === 'paneer') return map['paneer'] || token;
    if (tLower === 'dosa') return map['dosa'] || token;
    if (tLower === 'biryani') return map['biryani'] || token;
    if (tLower === 'samosa') return map['samosa'] || token;
    if (tLower === 'idli') return map['idli'] || token;
    if (tLower === 'roti') return map['roti'] || token;
    if (tLower === 'dal') return map['dal'] || token;
    if (tLower === 'curry') return map['curry'] || token;

    return token;
  });

  return transliteratedTokens.join('');
}
