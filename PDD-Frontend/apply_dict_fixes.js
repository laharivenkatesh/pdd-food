const fs = require('fs');
const path = require('path');
const { translations } = require('./src/i18n/translations');

// Populate Odia translations for all newly added keys
const odiaTranslations = {
  navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
  navExpired: "ସମାପ୍ତ",
  navPost: "ପୋଷ୍ଟ କରନ୍ତୁ",
  navActivity: "କାର୍ଯ୍ୟକଳାପ",
  navNGOs: "ଏନଜିଓ",
  logOut: "ଲଗ୍ ଆଉଟ୍",
  notifications: "ସୂଚନା",
  selectLanguage: "ଭାଷା ବାଛନ୍ତୁ",
  homeTitle: "ଅତିରିକ୍ତ ଖାଦ୍ୟ ବଜାର 🌱",
  homeSubtitle: "ନିକଟସ୍ଥ ଗୋଷ୍ଠୀ ସଦସ୍ୟ ଏବଂ ଏନଜିଓ ସହିତ ଅତିରିକ୍ତ ଖାଦ୍ୟ ସେୟାର କରନ୍ତୁ",
  searchPlaceholder: "ଖାଦ୍ୟ, ବ୍ୟଞ୍ଜନ ନାମ କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ...",
  allCategory: "ସମସ୍ତ",
  veg: "ଶାକାହାରୀ",
  nonVeg: "ଆମିଷ",
  bakery: "ବେକରୀ",
  fried: "ଛାଣିବା ଖାଦ୍ୟ",
  sweets: "ମିଠା",
  feedsPeople: "{{count}} ଜଣଙ୍କ ପାଇଁ",
  portionsLeft: "{{remaining}} / {{total}} ଭାଗ ବଳକା",
  free: "ମାଗଣା",
  viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
  reservePortion: "ଖାଦ୍ୟ ସଂରକ୍ଷଣ କରନ୍ତୁ",
  postTitle: "ଅତିରିକ୍ତ ଖାଦ୍ୟ ପୋଷ୍ଟ କରନ୍ତୁ 🌱",
  postSubtitle: "ନିକଟସ୍ଥ ଗୋଷ୍ଠୀ ସଦସ୍ୟ ଏବଂ ଏନଜିଓ ସହିତ ଖାଦ୍ୟ ସେୟାର କରନ୍ତୁ",
  foodOverview: "ଖାଦ୍ୟ ବିବରଣୀ",
  foodNamePlaceholder: "ଖାଦ୍ୟ ନାମ (ଯଥା: ବିରିୟାନି, ରୋଟି)",
  quantityPlaceholder: "ପରିମାଣ (ଯଥା: 5 କିଗ୍ରା, 10 ପ୍ଲେଟ୍)",
  feedsPlaceholder: "କେତେ ଜଣଙ୍କ ପାଇଁ (ଯଥା: 8)",
  prepAndExpiry: "ପ୍ରସ୍ତୁତି ସମୟ ଏବଂ ସମାପ୍ତି",
  whenPrepared: "କେବେ ପ୍ରସ୍ତୁତ ହୋଇଥିଲା?",
  expiresInHours: "ସମାପ୍ତି ସମୟ (ଘଣ୍ଟା)",
  pickupLocation: "ପିକଅପ୍ ସ୍ଥାନ",
  addressPlaceholder: "ରାସ୍ତା, ଅଞ୍ଚଳ କିମ୍ବା ଲ୍ୟାଣ୍ଡମାର୍କ ପ୍ରବେଶ କରନ୍ତୁ",
  autoDetectGPS: "ଜିପିଏସ୍ ସାହାଯ୍ୟରେ ଖୋଜନ୍ତୁ",
  dragPinOnMap: "ମାନଚିତ୍ରରେ ପିନ୍ ଲଗାନ୍ତୁ 📍",
  photoAttachment: "ଖାଦ୍ୟ ଫଟୋ",
  takePhoto: "ଫଟୋ ଉଠାନ୍ତୁ",
  chooseGallery: "ଗ୍ୟାଲେରୀରୁ ବାଛନ୍ତୁ",
  removePhoto: "ଫଟୋ ହଟାନ୍ତୁ",
  photoOptionalNote: "ଫଟୋ ଐଚ୍ଛିକ ଅଟେ।",
  categoryAndPurpose: "ଶ୍ରେଣୀ ଏବଂ ଉଦ୍ଦେଶ୍ୟ",
  categoryLabel: "ଶ୍ରେଣୀ",
  purposeLabel: "ଲକ୍ଷ୍ୟସାଧ୍ୟ ଶ୍ରୋତା / ଉଦ୍ଦେଶ୍ୟ",
  safeForAnimals: "ପଶୁମାନଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ",
  paidListing: "ମୂଲ୍ୟଯୁକ୍ତ",
  freeListing: "ମାଗଣା",
  pricePlaceholder: "ମୂଲ୍ୟ (ଯଥା: 50)",
  notesForCollector: "ସଂଗ୍ରାହକଙ୍କ ପାଇଁ ସୂଚନା",
  notesPlaceholder: "ପିକଅପ୍ ନିର୍ଦ୍ଦେଶାବଳୀ ଉଲ୍ଲେଖ କରନ୍ତୁ...",
  publishPostBtn: "ଖାଦ୍ୟ ପୋଷ୍ଟ ପ୍ରକାଶ କରନ୍ତୁ 🌱",
  publishingBtn: "ଅପଲୋଡ୍ ଏବଂ ପୋଷ୍ଟ ହେଉଛି…",
  backToFeed: "ଫିଡ୍ କୁ ଫେରିଯାଅ",
  delete: "ହଟାନ୍ତୁ",
  portionAvailable: "ଉପଲବ୍ଧ ଭାଗ",
  cookedAt: "ପ୍ରସ୍ତୁତ",
  expiresIn: "ସମାପ୍ତି ସମୟ",
  pickupAddress: "ପିକଅପ୍ ଠିକଣା",
  openGoogleMaps: "ଗୁଗଲ୍ ମ୍ୟାପ୍ସରେ ଖୋଲନ୍ତୁ",
  donorDetails: "ଦାତା ବିବରଣୀ",
  contactDonor: "ଦାତାଙ୍କ ସହ ଯୋଗାଯୋଗ କରନ୍ତୁ",
  reserveModalTitle: "ଭାଗ ସଂରକ୍ଷଣ କରନ୍ତୁ",
  confirmReservation: "ସଂରକ୍ଷଣ ନିଶ୍ଚିତ କରନ୍ତୁ",
  reviewsTitle: "ରେଟିଂ ଏବଂ ସମୀକ୍ଷା",
  activityTitle: "କାର୍ଯ୍ୟକଳାପ ଏବଂ ଦାବି 📋",
  activeClaims: "ସକ୍ରିୟ ଦାବି",
  completedClaims: "ସମ୍ପୂର୍ଣ୍ଣ",
  myDonations: "ମୋର ଦାନ",
  noClaimsYet: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଦାବି ନାହିଁ",
  browseFoodCTA: "ଖାଦ୍ୟ ବଜାର ବ୍ରାଉଜ୍ କରନ୍ତୁ",
  markCollected: "ସଂଗୃହିତ ଚିହ୍ନିତ କରନ୍ତୁ",
  cancelClaim: "ଦାବି ରଦ୍ଦ କରନ୍ତୁ",
  ngoTitle: "ଏନଜିଓ ଏବଂ ଭାଗିଦାର 🤝",
  ngoSubtitle: "ଯାଞ୍ଚକୃତ ଅନୁଷ୍ଠାନ ଯେଉଁମାନେ ଖାଦ୍ୟ ବାଣ୍ଟନ୍ତି",
  searchNGOPlaceholder: "ଏନଜିଓ ନାମ ଖୋଜନ୍ତୁ...",
  allPartners: "ସମସ୍ତ ଭାଗିଦାର",
  foodBanks: "ଫୁଡ୍ ବ୍ୟାଙ୍କ",
  animalRescue: "ପଶୁ କଲ୍ୟାଣ",
  childCare: "ଶିଶୁ ଯତ୍ନ",
  callNGO: "ଏନଜିଓ କୁ କଲ୍ କରନ୍ତୁ",
  donateDirect: "ସିଧାସଳଖ ଖାଦ୍ୟ ଦାନ କରନ୍ତୁ",
  authTitle: "ଜେରା ଫୁଡ୍ ହବ୍",
  authSubtitle: "ଶୂନ୍ୟ ବର୍ଜ୍ୟ, ପୂର୍ଣ୍ଣ ପେଟ",
  loginTab: "ଲଗଇନ୍",
  signUpTab: "ସାଇନ୍ ଅପ୍",
  emailPlaceholder: "ଇମେଲ୍ ଠିକଣା",
  passwordPlaceholder: "ପାସୱାର୍ଡ",
  loginBtn: "ଆକାଉଣ୍ଟ୍ ଲଗଇନ୍ କରନ୍ତୁ",
  signUpBtn: "ନୂତନ ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ",
  expiresInPrefix: "⏳ {{time}} ରେ ସମାପ୍ତ",
  urgentLeft: "🔥 ଜରୁରୀ · {{time}} ବଳକା",
  expiredText: "ସମାପ୍ତ",
  bookedBadge: "ସଂରକ୍ଷିତ",
  availableBadge: "ଉପଲବ୍ଧ",
  collectedBadge: "ସଂଗୃହିତ",
  postedByYou: "🌱 ଆପଣଙ୍କ ଦ୍ୱାରା ପୋଷ୍ଟ ହୋଇଛି",
  animalPriority: "🐾 ପଶୁ ପ୍ରାଥମିକତା",
  safeForAnimalsTag: "✔ ପଶୁମାନଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ",
  notForAnimalsTag: "⚠️ ପଶୁମାନଙ୍କ ପାଇଁ ନୁହେଁ",
  openInMaps: "ମାନଚିତ୍ରରେ ଦେଖନ୍ତୁ 📍",
  tapToOpenMaps: "ମାନଚିତ୍ର ଖୋଲିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତୁ ↗",
  viewLocationOnMaps: "ଗୁଗଲ୍ ମ୍ୟାପ୍ସରେ ଦେଖନ୍ତୁ",
  startSharingFood: "ଖାଦ୍ୟ ସେୟାର କରିବା ଆରମ୍ଭ କରନ୍ତୁ",
  keepSavingFood: "ଖାଦ୍ୟ ବଞ୍ଚାନ୍ତୁ!",
  postsMadeCount: "{{count}} ଟି ପୋଷ୍ଟ କରାଗଲା",
  expiredOutletTitle: "ସମାପ୍ତ ଖାଦ୍ୟ କେନ୍ଦ୍ର",
  requestableHours: "ଆଉ 3 ଘଣ୍ଟା ପାଇଁ ଅନୁରୋଧ ଯୋଗ୍ୟ",
  sustainabilitySpotlight: "ସ୍ଥାୟୀତ୍ୱ ବାର୍ତ୍ତା: ଏହି ସାମଗ୍ରୀ 3 ଘଣ୍ଟା ପାଇଁ ପଶୁ କିମ୍ବା ଖତ ପାଇଁ ଉପଲବ୍ଧ।",
  searchExpiredPlaceholder: "ସମାପ୍ତ ସାମଗ୍ରୀ ଖୋଜନ୍ତୁ...",
  zeroExpiredTitle: "କୌଣସି ଖାଦ୍ୟ ନଷ୍ଟ ହୋଇନାହିଁ! 🎉",
  zeroExpiredSub: "ସମସ୍ତ ଖାଦ୍ୟ ସମାପ୍ତ ହେବା ପୂର୍ବରୁ ରକ୍ଷା କରାଗଲା।",
  directionsBtn: "ଦିଗ 🧭",
  donateFoodBtn: "ଖାଦ୍ୟ ଦାନ କରନ୍ତୁ ❤️"
};

Object.keys(odiaTranslations).forEach(key => {
  translations.or[key] = odiaTranslations[key];
});

// Re-write formatted translations.ts
const languages = Object.keys(translations);
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
console.log('Successfully updated Odia translations!');
