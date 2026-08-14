const fs = require('fs');
const path = require('path');

// Dictionary of new translation keys and their values for all 16 languages
const newKeys = {
  // Relative Time & Notifications
  justNow: {
    en: "Just now", hi: "अभी-अभी", te: "ఇప్పుడే", ta: "இப்போதே", kn: "ಈಗಷ್ಟೇ",
    mr: "आत्ताच", bn: "এখনই", ml: "ഇപ്പോൾ തന്നെ", gu: "હમણાં જ", pa: "ਹੁਣੇ ਜਿਹੇ",
    or: "ଏବେ", ur: "ابھی ابھی", es: "Ahora mismo", fr: "À l'instant", ar: "الآن", de: "Gerade eben"
  },
  minsAgo: {
    en: "{{count}}m ago", hi: "{{count}} मिनट पहले", te: "{{count}}ని॥ క్రితం", ta: "{{count}}நி முன்", kn: "{{count}}ನಿ ಹಿಂದೆ",
    mr: "{{count}} मि. पूर्वी", bn: "{{count}} মি. আগে", ml: "{{count}} മിനിറ്റ് മുൻപ്", gu: "{{count}} મિનિટ પહેલાં", pa: "{{count}} ਮਿੰਟ ਪਹਿਲਾਂ",
    or: "{{count}} ମିନିଟ୍ ପୂର୍ବରୁ", ur: "{{count}} منٹ پہلے", es: "Hace {{count}}m", fr: "Il y a {{count}}m", ar: "منذ {{count}} د", de: "Vor {{count}}m"
  },
  hoursAgo: {
    en: "{{count}}h ago", hi: "{{count}} घंटे पहले", te: "{{count}}గం॥ క్రితం", ta: "{{count}}மணி முன்", kn: "{{count}}ಗಂಟೆ ಹಿಂದೆ",
    mr: "{{count}} ता. पूर्वी", bn: "{{count}} ঘণ্টা আগে", ml: "{{count}} മണിക്കൂർ മുൻപ്", gu: "{{count}} કલાક પહેલાં", pa: "{{count}} ਘੰਟੇ ਪਹਿਲਾਂ",
    or: "{{count}} ଘଣ୍ଟା ପୂର୍ବରୁ", ur: "{{count}} گھنٹے پہلے", es: "Hace {{count}}h", fr: "Il y a {{count}}h", ar: "منذ {{count}} س", de: "Vor {{count}}h"
  },
  daysAgo: {
    en: "{{count}}d ago", hi: "{{count}} दिन पहले", te: "{{count}}రోజుల క్రితం", ta: "{{count}}நாள் முன்", kn: "{{count}}ದಿನ ಹಿಂದೆ",
    mr: "{{count}} दिवसांपूर्वी", bn: "{{count}} দিন আগে", ml: "{{count}} ദിവസം മുൻപ്", gu: "{{count}} દિવસ પહેલાં", pa: "{{count}} ਦਿਨ ਪਹਿਲਾਂ",
    or: "{{count}} ଦିନ ପୂର୍ବରୁ", ur: "{{count}} دن پہلے", es: "Hace {{count}}d", fr: "Il y a {{count}}j", ar: "منذ {{count}} يوم", de: "Vor {{count}}d"
  },
  recently: {
    en: "Recently", hi: "हाल ही में", te: "ఇటీవల", ta: "சமீபத்தில்", kn: "ಇತ್ತೀಚೆಗೆ",
    mr: "नुकतेच", bn: "সম্প্রতি", ml: "അടുത്തിടെ", gu: "તાજેતરમાં", pa: "ਹਾਲ ਹੀ ਵਿੱਚ",
    or: "ନିକଟରେ", ur: "حالیہ", es: "Recientemente", fr: "Récemment", ar: "مؤخراً", de: "Kürzlich"
  },
  noNotificationsYet: {
    en: "No notifications", hi: "कोई सूचनाएं नहीं हैं", te: "నోటిఫికేషన్‌లు లేవు", ta: "அறிவிப்புகள் இல்லை", kn: "ಯಾವುದೇ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ",
    mr: "कोणत्याही सूचना नाहीत", bn: "কোনো বিজ্ঞপ্তি নেই", ml: "അറിയിപ്പുകൾ ഒന്നുമില്ല", gu: "કોઈ સૂચનાઓ નથી", pa: "ਕੋਈ ਨੋਟੀਫਿਕੇਸ਼ਨ ਨਹੀਂ",
    or: "କୌଣସି ସୂଚନା ନାହିଁ", ur: "کوئی اطلاع نہیں", es: "Sin notificaciones", fr: "Aucune notification", ar: "لا يوجد إشعارات", de: "Keine Benachrichtigungen"
  },

  // Home Page
  loadingFood: {
    en: "Loading available food...", hi: "उपलब्ध भोजन लोड हो रहा है...", te: "అందుబాటులో ఉన్న ఆహారం లోడ్ అవుతోంది...", ta: "கிடைக்கும் உணவு ஏற்றப்படுகிறது...", kn: "ಲಭ್ಯವಿರುವ ಆಹಾರ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    mr: "उपलब्ध अन्न लोड होत आहे...", bn: "উপলব্ধ খাবার লোড হচ্ছে...", ml: "ലഭ്യമായ ഭക്ഷണം ലോഡ് ചെയ്യുന്നു...", gu: "ઉપલબ્ધ ખોરાક લોડ થઈ રહ્યો છે...", pa: "ਉਪਲਬਧ ਭੋਜਨ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    or: "ଉପଲବ୍ଧ ଖାଦ୍ୟ ଲୋଡ୍ ହେଉଛି...", ur: "دستیاب کھانا لوڈ ہو رہا ہے...", es: "Cargando comida disponible...", fr: "Chargement de la nourriture disponible...", ar: "جاري تحميل الطعام المتاح...", de: "Verfügbare Lebensmittel werden geladen..."
  },
  noFoodListings: {
    en: "No food listings found", hi: "कोई भोजन सूची नहीं मिली", te: "ఆహార జాబితాలు ఏవీ కనుగొనబడలేదు", ta: "உணவுப் பட்டியல்கள் எதுவும் கிடைக்கவில்லை", kn: "ಯಾವುದೇ ಆಹಾರ ಪಟ್ಟಿ ಕಂಡುಬಂದಿಲ್ಲ",
    mr: "कोणतीही अन्न सूची आढळली नाही", bn: "কোনো খাবারের তালিকা পাওয়া যায়নি", ml: "ഭക്ഷണ ലിസ്റ്റിംഗുകളൊന്നും കണ്ടില്ല", gu: "કોઈ ખોરાકની યાદી મળી નથી", pa: "ਕੋਈ ਭੋਜਨ ਸੂਚੀ ਨਹੀਂ ਮਿਲੀ",
    or: "କୌଣସି ଖାଦ୍ୟ ତାଲିକା ମିଳିଲା ନାହିଁ", ur: "کوئی کھانے کی فہرست نہیں ملی", es: "No se encontraron publicaciones de comida", fr: "Aucune annonce de nourriture trouvée", ar: "لم يتم العثور على قوائم طعام", de: "Keine Lebensmittelangebote gefunden"
  },
  checkBackSoon: {
    en: "Check back soon for fresh listings!", hi: "ताज़ा सूचियों के लिए जल्द ही दोबारा जांचें!", te: "తాజా జాబితాల కోసం త్వరలో మళ్లీ చూడండి!", ta: "புதிய பட்டியல்களுக்கு விரைவில் மீண்டும் சரிபார்க்கவும்!", kn: "ಹೊಸ ಪಟ್ಟಿಗಳಿಗಾಗಿ ಶೀಘ್ರದಲ್ಲೇ ಮತ್ತೆ ಪರಿಶೀಲಿಸಿ!",
    mr: "नवीन सूचीसाठी लवकरच पुन्हा तपासा!", bn: "নতুন তালিকার জন্য শীঘ্রই আবার দেখুন!", ml: "പുതിയ ലിസ്റ്റിംഗുകൾക്കായി ഉടൻ തന്നെ വീണ്ടും പരിശോധിക്കുക!", gu: "નવી યાદીઓ માટે ટૂંક સમયમાં ફરી તપાસો!", pa: "ਨਵੀਂ ਸੂਚੀਆਂ ਲਈ ਜਲਦੀ ਹੀ ਦੁਬਾਰਾ ਦੇਖੋ!",
    or: "ନୂତନ ତାଲିକା ପାଇଁ ଶୀଘ୍ର ପୁନର୍ବାର ଯାଞ୍ଚ କରନ୍ତୁ!", ur: "تازہ فہرستوں کے لیے جلد دوبارہ چیک کریں!", es: "¡Vuelve pronto para ver nuevas publicaciones!", fr: "Revenez bientôt pour de nouvelles annonces !", ar: "عد قريباً للاطلاع على القوائم الجديدة!", de: "Schauen Sie bald wieder vorbei für neue Angebote!"
  },

  // Food Card & Delete Actions
  confirmDeleteFood: {
    en: "Are you sure you want to delete \"{{name}}\"?", hi: "क्या आप निश्चित रूप से \"{{name}}\" को हटाना चाहते हैं?", te: "మీరు ఖచ్చితంగా \"{{name}}\" ని తొలగించాలనుకుంటున్నారా?", ta: "\"{{name}}\"-ஐ நிச்சயமாக நீக்க விரும்புகிறீர்களா?", kn: "ನೀವು ಖಂಡಿತವಾಗಿ \"{{name}}\" ಅನ್ನು ಅಳಿಸಲು ಬಯಸುತ್ತೀರಾ?",
    mr: "तुम्हाला नक्की \"{{name}}\" हटवायचे आहे का?", bn: "আপনি কি নিশ্চিত যে \"{{name}}\" মুছে ফেলতে চান?", ml: "\"{{name}}\" ഇല്ലാതാക്കണമെന്ന് ഉറപ്പാണോ?", gu: "શું તમે ખરેખર \"{{name}}\" દૂર કરવા માંગો છો?", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ \"{{name}}\" ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    or: "ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ \"{{name}}\" କୁ ହଟାଇବାକୁ ଚାହୁଁଛନ୍ତି?", ur: "کیا آپ واقعی \"{{name}}\" کو حذف کرنا چاہتے ہیں؟", es: "¿Estás seguro de que deseas eliminar \"{{name}}\"?", fr: "Êtes-vous sûr de vouloir supprimer \"{{name}}\" ?", ar: "هل أنت تأكد من أنك تريد حذف \"{{name}}\"؟", de: "Sind Sie sicher, dass Sie \"{{name}}\" löschen möchten?"
  },
  deleteSuccessMsg: {
    en: "Listing deleted successfully!", hi: "सूची सफलतापूर्वक हटा दी गई!", te: "జాబితా విజయవంతంగా తొలగించబడింది!", ta: "பட்டியல் வெற்றிகரமாக நீக்கப்பட்டது!", kn: "ಪಟ್ಟಿ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ!",
    mr: "सूची यशस्वीरीत्या हटवली!", bn: "তালিকা সফলভাবে মুছে ফেলা হয়েছে!", ml: "ലിസ്റ്റിംഗ് വിജയകരമായി ഇല്ലാതാക്കി!", gu: "યાદી સફળતાપૂર્વક દૂર કરવામાં આવી!", pa: "ਸੂਚੀ ਸਫਲਤਾਪੂਰਵਕ ਹਟਾਈ ਗਈ!",
    or: "ତାଲିକା ସଫଳତାର ସହିତ ହଟାଗଲା!", ur: "فہرست کاميابی سے حذف ہو گئی!", es: "¡Publicación eliminada con éxito!", fr: "Annonce supprimée avec succès !", ar: "تم حذف القائمة بنجاح!", de: "Eintrag erfolgreich gelöscht!"
  },
  deleteListingTitle: {
    en: "Delete Listing", hi: "सूची हटाएं", te: "జాబితాను తొలగించండి", ta: "பட்டியலை நீக்கு", kn: "ಪಟ್ಟಿಯನ್ನು ಅಳಿಸಿ",
    mr: "सूची हटवा", bn: "তালিকা মুছুন", ml: "ലിസ്റ്റിംഗ് ഇല്ലാതാക്കുക", gu: "યાદી દૂર કરો", pa: "ਸੂਚੀ ਹਟਾਓ",
    or: "ତାଲିକା ହଟାନ୍ତୁ", ur: "فہرست حذف کریں", es: "Eliminar publicación", fr: "Supprimer l'annonce", ar: "حذف القائمة", de: "Eintrag löschen"
  },
  cancel: {
    en: "Cancel", hi: "रद्द करें", te: "రద్దు చేయి", ta: "ரத்துசெய்", kn: "రద్దు ಮಾಡಿ",
    mr: "रद्द करा", bn: "বাতিল করুন", ml: "റദ്ദാക്കുക", gu: "રદ કરો", pa: "ਰੱਦ ਕਰੋ",
    or: "ରଦ୍ଦ କରନ୍ତୁ", ur: "منسوخ کریں", es: "Cancelar", fr: "Annuler", ar: "إلغاء", de: "Abbrechen"
  },

  // Food Detail Page
  loadingDetails: {
    en: "Loading food details...", hi: "भोजन का विवरण लोड हो रहा है...", te: "ఆహార వివరాలు లోడ్ అవుతున్నాయి...", ta: "உணவு விவரங்கள் ஏற்றப்படுகின்றன...", kn: "ಆಹಾರದ ವಿವರಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
    mr: "अन्नाचे तपशील लोड होत आहेत...", bn: "খাবারের বিবরণ লোড হচ্ছে...", ml: "ഭക്ഷണത്തിന്റെ വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...", gu: "ખોરાકની વિગતો લોડ થઈ રહી છે...", pa: "ਭੋਜਨ ਦੇ ਵੇਰਵੇ ਲੋਡ ਹੋ ਰਹੇ ਹਨ...",
    or: "ଖାଦ୍ୟ ବିବରଣୀ ଲୋଡ୍ ହେଉଛି...", ur: "کھانے کی تفصیلات لوڈ ہو رہی ہیں...", es: "Cargando detalles de la comida...", fr: "Chargement des détails...", ar: "جاري تحميل تفاصيل الطعام...", de: "Lebensmitteldetails werden geladen..."
  },
  foodNotFound: {
    en: "Food not found.", hi: "भोजन नहीं मिला।", te: "ఆహారం కనుగొనబడలేదు.", ta: "உணவு கிடைக்கவில்லை.", kn: "ಆಹಾರ ಕಂಡುಬಂದಿಲ್ಲ.",
    mr: "अन्न आढळले नाही.", bn: "খাবার পাওয়া যায়নি।", ml: "ഭക്ഷണം കണ്ടില്ല.", gu: "ખોરાક મળ્યો નથી.", pa: "ਭੋਜਨ ਨਹੀਂ ਮਿਲਿਆ।",
    or: "ଖାଦ୍ୟ ମିଳିଲା ନାହିଁ।", ur: "کھانا نہیں ملا۔", es: "Comida no encontrada.", fr: "Nourriture non trouvée.", ar: "لم يتم العثور على الطعام.", de: "Lebensmittel nicht gefunden."
  },
  goBackHome: {
    en: "Go back Home", hi: "मुख्य पृष्ठ पर वापस जाएं", te: "హోమ్‌కి తిరిగి వెళ్లండి", ta: "முகப்புக்குத் திரும்பு", kn: "ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    mr: "मुख्य पृष्ठावर परत जा", bn: "হোমে ফিরে যান", ml: "ഹോമിലേക്ക് മടങ്ങുക", gu: "મુખ્ય પૃષ્ઠ પર પાછા જાઓ", pa: "ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    or: "ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରିଯାଅ", ur: "ہوم پر واپس جائیں", es: "Volver al Inicio", fr: "Retour à l'accueil", ar: "العودة إلى الرئيسية", de: "Zurück zur Startseite"
  },
  loginRequiredTitle: {
    en: "Login Required", hi: "लॉगिन आवश्यक है", te: "లాగిన్ అవసరం", ta: "உள்நுழைவு தேவை", kn: "ಲಾಗಿನ್ ಅಗತ್ಯವಿದೆ",
    mr: "लॉगिन आवश्यक आहे", bn: "লগইন প্রয়োজন", ml: "ലോഗിൻ ആവശ്യമാണ്", gu: "લૉગિન જરૂરી છે", pa: "ਲੌਗਇਨ ਲੋੜੀਂਦਾ ਹੈ",
    or: "ଲଗଇନ୍ ଆବଶ୍ୟକ", ur: "لاگ ان درکار ہے", es: "Inicio de sesión requerido", fr: "Connexion requise", ar: "تسجيل الدخول مطلوب", de: "Anmeldung erforderlich"
  },
  loginRequiredMsg: {
    en: "Please login to book food", hi: "भोजन बुक करने के लिए कृपया लॉगिन करें", te: "ఆహారాన్ని బుక్ చేయడానికి దయచేసి లాగిన్ చేయండి", ta: "உணவை முன்பதிவு செய்ய உள்நுழையவும்", kn: "ಆಹಾರ ಕಾಯ್ದಿರಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ",
    mr: "अन्न बुक करण्यासाठी कृपया लॉगिन करा", bn: "খাবার বুক করতে অনুগ্রহ করে লগইন করুন", ml: "ഭക്ഷണം ബുക്ക് ചെയ്യാൻ ലോഗിൻ ചെയ്യുക", gu: "ખોરાક બુક કરવા માટે કૃપા કરીને લૉગિન કરો", pa: "ਭੋਜਨ ਬੁੱਕ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਲੌਗਇਨ ਕਰੋ",
    or: "ଖାଦ୍ୟ ବୁକ୍ କରିବା ପାଇଁ ଦୟାକରି ଲଗଇନ୍ କରନ୍ତୁ", ur: "کھانا بک کرنے کے لیے براہ کرم لاگ ان کریں", es: "Inicia sesión para reservar comida", fr: "Veuillez vous connecter pour réserver", ar: "يرجى تسجيل الدخول للحجز", de: "Bitte melden Sie sich an, um Essen zu buchen"
  },
  successTitle: {
    en: "Success", hi: "सफलता", te: "విజయం", ta: "வெற்றி", kn: "ಯಶಸ್ಸು",
    mr: "यशस्वी", bn: "সফল", ml: "വിജയം", gu: "સફળતા", pa: "ਸਫਲਤਾ",
    or: "ସଫଳତା", ur: "کامیابی", es: "Éxito", fr: "Succès", ar: "نجاح", de: "Erfolg"
  },
  bookedSuccessMsg: {
    en: "Booked {{count}} portions successfully!", hi: "{{count}} भाग सफलतापूर्वक बुक किए गए!", te: "{{count}} భాగాలు విజయవంతంగా బుక్ చేయబడ్డాయి!", ta: "{{count}} பகுதிகள் வெற்றிகரமாக முன்பதிவு செய்யப்பட்டன!", kn: "{{count}} ಭಾಗಗಳು ಯಶಸ್ವಿಯಾಗಿ ಕಾಯ್ದಿರಿಸಲ್ಪಟ್ಟಿವೆ!",
    mr: "{{count}} भाग यशस्वीरीत्या बुक केले!", bn: "{{count}}টি অংশ সফলভাবে বুক করা হয়েছে!", ml: "{{count}} പോർഷനുകൾ വിജയകരമായി ബുക്ക് ചെയ്തു!", gu: "{{count}} ભાગો સફળતાપૂર્વક બુક થયા!", pa: "{{count}} ਹਿੱਸੇ ਸਫਲਤਾਪੂਰਵਕ ਬੁੱਕ ਕੀਤੇ ਗਏ!",
    or: "{{count}} ଟି ଭାଗ ସଫଳତାର ସହିତ ବୁକ୍ ହେଲା!", ur: "{{count}} حصے کامیابی سے بک ہو گئے!", es: "¡Se reservaron {{count}} porciones con éxito!", fr: "{{count}} portions réservées avec succès !", ar: "تم حجز {{count}} حصص بنجاح!", de: "{{count}} Portione(n) erfolgreich gebucht!"
  },
  bookingFailedTitle: {
    en: "Booking Failed", hi: "बुकिंग विफल रही", te: "బుకింగ్ విఫలమైంది", ta: "முன்பதிவு தோல்வியடைந்தது", kn: "ಕಾಯ್ದಿರಿಸುವಿಕೆ ವಿಫಲವಾಗಿದೆ",
    mr: "बुकिंग अयशस्वी", bn: "বুকিং ব্যর্থ হয়েছে", ml: "ബുക്കിംഗ് പരാജയപ്പെട്ടു", gu: "બુકિંગ નિષ્ફળ ગયું", pa: "ਬੁਕਿੰਗ ਅਸਫਲ ਰਹੀ",
    or: "ବୁକିଂ ବିଫଳ ହେଲା", ur: "بکنگ ناکام ہو گئی", es: "Reserva fallida", fr: "Échec de la réservation", ar: "فشل الحجز", de: "Buchung fehlgeschlagen"
  },
  bookingFailedMsg: {
    en: "Failed to book portions", hi: "भागों को बुक करने में विफल", te: "భాగాలను బుక్ చేయడం విఫలమైంది", ta: "பகுதிகளை முன்பதிவு செய்ய முடியவில்லை", kn: "ಭಾಗಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲು ವಿಫಲವಾಗಿದೆ",
    mr: "भाग बुक करण्यात अयशस्वी", bn: "অংশ বুক করতে ব্যর্থ হয়েছে", ml: "പോർഷനുകൾ ബുക്ക് ചെയ്യാൻ കഴിഞ്ഞില്ല", gu: "ભાગો બુક કરવામાં નિષ્ફળ", pa: "ਹਿੱਸੇ ਬੁੱਕ ਕਰਨ ਵਿੱਚ ਅਸਫਲ",
    or: "ଭାଗ ବୁକ୍ କରିବାରେ ବିଫଳ", ur: "حصے بک کرنے میں ناکامی", es: "No se pudieron reservar las porciones", fr: "Impossible de réserver les portions", ar: "تعذر حجز الحصص", de: "Portionen konnten nicht gebucht werden"
  },
  confirmDeletePrompt: {
    en: "Are you sure you want to delete this listing?", hi: "क्या आप निश्चित रूप से इस सूची को हटाना चाहते हैं?", te: "మీరు ఖచ్చితంగా ఈ జాబితాను తొలగించాలనుకుంటున్నారా?", ta: "இந்த பட்டியலை நிச்சயமாக நீக்க விரும்புகிறீர்களா?", kn: "ನೀವು ಖಂಡಿತವಾಗಿ ಈ ಪಟ್ಟಿಯನ್ನು ಅಳಿಸಲು ಬಯಸುತ್ತೀರಾ?",
    mr: "तुम्हाला नक्की ही सूची हटवायची आहे का?", bn: "আপনি কি নিশ্চিত যে এই তালিকাটি মুছে ফেলতে চান?", ml: "ഈ ലിസ്റ്റിംഗ് ഇല്ലാതാക്കണമെന്ന് ഉറപ്പാണോ?", gu: "શું તમે ખરેખર આ યાદી દૂર કરવા માંગો છો?", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਸੂਚੀ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
    or: "ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ଏହି ତାଲିକାକୁ ହଟାଇବାକୁ ଚାହୁଁଛନ୍ତି?", ur: "کیا آپ واقعی اس فہرست کو حذف کرنا چاہتے ہیں؟", es: "¿Estás seguro de que deseas eliminar esta publicación?", fr: "Êtes-vous sûr de vouloir supprimer cette annonce ?", ar: "هل أنت تأكد من أنك تريد حذف هذه القائمة؟", de: "Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?"
  },
  portionsBookedLabel: {
    en: "Portions Booked", hi: "बुक किए गए भाग", te: "బుక్ చేసిన భాగాలు", ta: "முன்பதிவு செய்யப்பட்ட பகுதிகள்", kn: "ಕಾಯ್ದಿರಿಸಿದ ಭಾಗಗಳು",
    mr: "बुक केलेले भाग", bn: "বুক করা অংশ", ml: "ബുക്ക് ചെയ്ത പോർഷനുകൾ", gu: "બુક થયેલ ભાગો", pa: "ਬੁੱਕ ਕੀਤੇ ਹਿੱਸੇ",
    or: "ବୁକ୍ ହୋଇଥିବା ଭାଗ", ur: "بک شدہ حصے", es: "Porciones reservadas", fr: "Portions réservées", ar: "الحصص المحجوزة", de: "Gebuchte Portionen"
  },
  portionsClaimedMetric: {
    en: "{{booked}} / {{total}} Claimed", hi: "{{booked}} / {{total}} दावा किया गया", te: "{{booked}} / {{total}} పొందినవి", ta: "{{booked}} / {{total}} பெறப்பட்டது", kn: "{{booked}} / {{total}} ಪಡೆಯಲಾಗಿದೆ",
    mr: "{{booked}} / {{total}} घेतलेले", bn: "{{booked}} / {{total}} নেওয়া হয়েছে", ml: "{{booked}} / {{total}} ക്ലെയിം ചെയ്തു", gu: "{{booked}} / {{total}} મેળવેલ", pa: "{{booked}} / {{total}} ਲਏ ਗਏ",
    or: "{{booked}} / {{total}} ଦାବି କରାଯାଇଛି", ur: "{{booked}} / {{total}} کلیم شدہ", es: "{{booked}} / {{total}} Reclamadas", fr: "{{booked}} / {{total}} réclamées", ar: "{{booked}} / {{total}} مطالب بها", de: "{{booked}} / {{total}} beansprucht"
  },
  trustScoreLabel: {
    en: "Trust Score", hi: "विश्वास स्कोर", te: "నమ్మక స్కోరు", ta: "நம்பிக்கை மதிப்பெண்", kn: "ನಂಬಿಕೆ స్కోರ್",
    mr: "विश्वास स्कोर", bn: "ট্রাস্ট স্কোর", ml: "ട്രസ്റ്റ് സ്കോർ", gu: "ટ્રસ્ટ સ્કોર", pa: "ਭਰੋਸਾ ਸਕੋਰ",
    or: "ବିଶ୍ୱାସ ସ୍କୋର", ur: "ٹرسٹ اسکور", es: "Puntuación de confianza", fr: "Score de confiance", ar: "درجة الثقة", de: "Vertrauenswert"
  },
  choosePortionsHeading: {
    en: "Choose Portions ({{remaining}} remaining)", hi: "भाग चुनें ({{remaining}} शेष)", te: "భాగాలను ఎంచుకోండి ({{remaining}} మిగిలి ఉన్నాయి)", ta: "பகுதிகளைத் தேர்ந்தெடுக்கவும் ({{remaining}} மீதம்)", kn: "ಭಾಗಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ ({{remaining}} ಉಳಿದಿದೆ)",
    mr: "भाग निवडा ({{remaining}} शिल्लक)", bn: "অংশ নির্বাচন করুন ({{remaining}}টি বাকি)", ml: "പോർഷനുകൾ തിരഞ്ഞെടുക്കുക ({{remaining}} ബാക്കി)", gu: "ભાગો પસંદ કરો ({{remaining}} બાકી)", pa: "ਹਿੱਸੇ ਚੁਣੋ ({{remaining}} ਬਾਕੀ)",
    or: "ଭାଗ ବାଛନ୍ତୁ ({{remaining}} ବଳକା)", ur: "حصے منتخب کریں ({{remaining}} باقی)", es: "Elegir porciones ({{remaining}} restantes)", fr: "Choisir les portions ({{remaining}} restantes)", ar: "اختر الحصص (المتبقي {{remaining}})", de: "Portionen wählen ({{remaining}} verbleibend)"
  },
  onePortionChip: {
    en: "1 Portion", hi: "1 भाग", te: "1 భాగం", ta: "1 பகுதி", kn: "1 ಭಾಗ",
    mr: "1 भाग", bn: "১টি অংশ", ml: "1 പോർഷൻ", gu: "1 ભાગ", pa: "1 ਹਿੱਸਾ",
    or: "1 ଭାଗ", ur: "1 حصہ", es: "1 Porción", fr: "1 Portion", ar: "حصة واحدة", de: "1 Portion"
  },
  halfPortionChip: {
    en: "Half ({{count}})", hi: "आधा ({{count}})", te: "సగం ({{count}})", ta: "பாதி ({{count}})", kn: "ಅರ್ಧ ({{count}})",
    mr: "अर्धे ({{count}})", bn: "অর্ধেক ({{count}})", ml: "പകുതി ({{count}})", gu: "અડધું ({{count}})", pa: "ਅੱਧਾ ({{count}})",
    or: "ଅଧା ({{count}})", ur: "آدھا ({{count}})", es: "Mitad ({{count}})", fr: "Moitié ({{count}})", ar: "النصف ({{count}})", de: "Hälfte ({{count}})"
  },
  fullPortionChip: {
    en: "Full ({{count}})", hi: "पूरा ({{count}})", te: "పూర్తి ({{count}})", ta: "முழுவதும் ({{count}})", kn: "ಪೂರ್ಣ ({{count}})",
    mr: "पूर्ण ({{count}})", bn: "সম্পূর্ণ ({{count}})", ml: "മുഴുവൻ ({{count}})", gu: "પૂરું ({{count}})", pa: "ਪੂਰਾ ({{count}})",
    or: "ପୂରା ({{count}})", ur: "مکمل ({{count}})", es: "Completo ({{count}})", fr: "Total ({{count}})", ar: "الكل ({{count}})", de: "Voll ({{count}})"
  },
  portionCountText: {
    en: "{{count}} Portion(s)", hi: "{{count}} भाग", te: "{{count}} భాగం(లు)", ta: "{{count}} பகுதி(கள்)", kn: "{{count}} భాగ(ಗಳು)",
    mr: "{{count}} भाग", bn: "{{count}}টি অংশ", ml: "{{count}} പോർഷൻ(കൾ)", gu: "{{count}} ભાગ", pa: "{{count}} ਹਿੱਸੇ",
    or: "{{count}} ଭାଗ", ur: "{{count}} حصہ/حصے", es: "{{count}} Porción(es)", fr: "{{count}} Portion(s)", ar: "{{count}} حصة/حصص", de: "{{count}} Portion(en)"
  },
  bookingProgress: {
    en: "Booking...", hi: "बुकिंग हो रही है...", te: "బుకింగ్ అవుతోంది...", ta: "முன்பதிவு செய்யப்படுகிறது...", kn: "ಕಾಯ್ದಿರಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "बुकिंग होत आहे...", bn: "বুকিং হচ্ছে...", ml: "ബുക്ക് ചെയ്യുന്നു...", gu: "બુકિંગ થઈ રહ્યું છે...", pa: "ਬੁਕਿੰਗ ਹੋ ਰਹੀ ਹੈ...",
    or: "ବୁକିଂ ହେଉଛି...", ur: "بکنگ ہو رہی ہے...", es: "Reservando...", fr: "Réservation...", ar: "جاري الحجز...", de: "Wird gebucht..."
  },
  bookPortionsBtn: {
    en: "🍽️ Book {{count}} Portion(s)", hi: "🍽️ {{count}} भाग बुक करें", te: "🍽️ {{count}} భాగం(లు) బుక్ చేయండి", ta: "🍽️ {{count}} பகுதி(கள்) முன்பதிவு செய்", kn: "🍽️ {{count}} ಭಾಗ(ಗಳನ್ನು) ಕಾಯ್ದಿರಿಸಿ",
    mr: "🍽️ {{count}} भाग बुक करा", bn: "🍽️ {{count}}টি অংশ বুক করুন", ml: "🍽️ {{count}} പോർഷൻ ബുക്ക് ചെയ്യുക", gu: "🍽️ {{count}} ભાગ બુક કરો", pa: "🍽️ {{count}} ਹਿੱਸੇ ਬੁੱਕ ਕਰੋ",
    or: "🍽️ {{count}} ଭାଗ ବୁକ୍ କରନ୍ତୁ", ur: "🍽️ {{count}} حصہ/حصے بک کریں", es: "🍽️ Reservar {{count}} Porción(es)", fr: "🍽️ Réserver {{count}} Portion(s)", ar: "🍽️ حجز {{count}} حصة/حصص", de: "🍽️ {{count}} Portion(en) buchen"
  },
  bookedCollectorsHeader: {
    en: "Booked Collectors ({{count}})", hi: "बुक किए गए प्राप्तकर्ता ({{count}})", te: "బుక్ చేసిన గ్రహీతలు ({{count}})", ta: "முன்பதிவு செய்தவர்கள் ({{count}})", kn: "ಕಾಯ್ದಿರಿಸಿದ ಸಂಗ್ರಾಹಕರು ({{count}})",
    mr: "बुक केलेले संकलनकर्ते ({{count}})", bn: "বুক করা সংগ্রহকারী ({{count}})", ml: "ബുക്ക് ചെയ്ത കളക്ടർമാർ ({{count}})", gu: "બુક થયેલ સંગ્રાહકો ({{count}})", pa: "ਬੁੱਕ ਕੀਤੇ ਪ੍ਰਾਪਤਕਰਤਾ ({{count}})",
    or: "ବୁକ୍ ହୋଇଥିବା ସଂଗ୍ରାହକ ({{count}})", ur: "بک شدہ وصول کنندگان ({{count}})", es: "Recolectores que reservaron ({{count}})", fr: "Collecteurs inscrits ({{count}})", ar: "المجمعون الذين حجزوا ({{count}})", de: "Gebuchte Abholer ({{count}})"
  },
  noCollectorsClaimed: {
    en: "No collector has claimed this food post yet.", hi: "किसी भी प्राप्तकर्ता ने अभी तक इस भोजन पर दावा नहीं किया है।", te: "ఇంకా ఏ గ్రహీతా ఈ ఆహారాన్ని క్లెయిమ్ చేయలేదు.", ta: "இதுவரை எந்தப் பெறுநரும் இந்த உணவைக் கோரவில்லை.", kn: "ಇನ್ನೂ ಯಾವುದೇ ಸಂಗ್ರಾಹಕರು ಈ ಆಹಾರವನ್ನು ಪಡೆದುಕೊಂಡಿಲ್ಲ.",
    mr: "अद्याप कोणीही या अन्नावर दावा केलेला नाही.", bn: "এখনও কোনো সংগ্রহকারী এই খাবার দাবি করেননি।", ml: "ആരും ഇതുവരെ ഈ ഭക്ഷണം ക്ലെയിം ചെയ്തിട്ടില്ല.", gu: "હજી સુધી કોઈ સંગ્રાહકે આ ખોરાકનો દાવો કર્યો નથી.", pa: "ਅਜੇ ਤੱਕ ਕਿਸੇ ਵੀ ਪ੍ਰਾਪਤਕਰਤਾ ਨੇ ਇਸ ਭੋਜਨ ਦਾ ਦਾਅਵਾ ਨਹੀਂ ਕੀਤਾ ਹੈ।",
    or: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସଂଗ୍ରାହକ ଏହି ଖାଦ୍ୟ ଦାବି କରିନାହାଁନ୍ତି।", ur: "ابھی تک کسی بھی وصول کنندہ نے اس کھانے کا دعویٰ نہیں کیا ہے۔", es: "Ningún recolector ha reclamado esta publicación aún.", fr: "Aucun collecteur n'a encore réclamé cette annonce.", ar: "لم يطالب أي مجمع بهذه التدوينة حتى الآن.", de: "Bisher hat noch kein Abholer diesen Eintrag beansprucht."
  },
  callCollector: {
    en: "Call Collector", hi: "प्राप्तकर्ता को कॉल करें", te: "గ్రహీతకు కాల్ చేయండి", ta: "பெறுநரை அழைக்கவும்", kn: "ಸಂಗ್ರಾಹಕರಿಗೆ ಕರೆ ಮಾಡಿ",
    mr: "संकलनकर्त्याला कॉल करा", bn: "সংগ্রহকারীকে কল করুন", ml: "കളക്ടറെ വിളിക്കുക", gu: "સંગ્રાહકને કૉલ કરો", pa: "ਪ੍ਰਾਪਤਕਰਤਾ ਨੂੰ ਕਾਲ ਕਰੋ",
    or: "ସଂଗ୍ରାହକଙ୍କୁ କଲ୍ କରନ୍ତୁ", ur: "وصول کنندہ کو کال کریں", es: "Llamar al recolector", fr: "Appeler le collecteur", ar: "الاتصال بالمجمع", de: "Abholer anrufen"
  },
  handedOverSuccessTitle: {
    en: "Handed Over! 🎉", hi: "सौंप दिया गया! 🎉", te: "అప్పగించబడింది! 🎉", ta: "ஒப்படைக்கப்பட்டது! 🎉", kn: "ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ! 🎉",
    mr: "सुपूर्द केले! 🎉", bn: "হস্তান্তর করা হয়েছে! 🎉", ml: "കൈമാറി! 🎉", gu: "સોંપી દેવામાં આવ્યું! 🎉", pa: "ਸੌਂਪ ਦਿੱਤਾ ਗਿਆ! 🎉",
    or: "ହସ୍ତାନ୍ତର ହେଲା! 🎉", ur: "حوالے کر دیا گیا! 🎉", es: "¡Entregado! 🎉", fr: "Remis ! 🎉", ar: "تم التسليم! 🎉", de: "Übergeben! 🎉"
  },
  handedOverSuccessMsg: {
    en: "Marked as completed.", hi: "पूर्ण के रूप में चिह्नित किया गया।", te: "పూర్తయినట్లు గుర్తు చేయబడింది.", ta: "நிறைவடைந்ததாகக் குறிக்கப்பட்டது.", kn: "ಪೂರ್ಣಗೊಂಡಿದೆ ಎಂದು ಗುರುತಿಸಲಾಗಿದೆ.",
    mr: "पूर्ण झाल्याचे चिन्हांकित केले.", bn: "সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।", ml: "പൂർത്തിയായതായി രേഖപ്പെടുത്തി.", gu: "પૂર્ણ તરીકે દર્શાવવામાં આવ્યું.", pa: "ਪੂਰਾ ਹੋਣ ਵਜੋਂ ਨਿਸ਼ਾਨਬੱਧ ਕੀਤਾ ਗਿਆ।",
    or: "ସମ୍ପୂର୍ଣ୍ଣ ଭାବରେ ଚିହ୍ନିତ ହେଲା।", ur: "مکمل کے طور پر نشان زد کر دیا گیا۔", es: "Marcado como completado.", fr: "Marqué comme terminé.", ar: "تم التحديد كمكتمل.", de: "Als abgeschlossen markiert."
  },
  markHandedOverBtn: {
    en: "Mark Handed Over", hi: "हस्तांतरित चिह्नित करें", te: "అప్పగించినట్లు గుర్తు చేయండి", ta: "ஒப்படைத்ததாகக் குறிக்கவும்", kn: "ಹಸ್ತಾಂತರಿಸಲಾಗಿದೆ ಎಂದು ಗುರುತಿಸಿ",
    mr: "सुपूर्द केल्याचे चिन्हांकित करा", bn: "হস্তান্তরিত চিহ্নিত করুন", ml: "കൈമാറിയതായി രേഖപ്പെടുത്തുക", gu: "સોંપેલ તરીકે દર્શાવો", pa: "ਸੌਂਪਿਆ ਨਿਸ਼ਾਨਬੱਧ ਕਰੋ",
    or: "ହସ୍ତାନ୍ତର ଚିହ୍ନିତ କରନ୍ତୁ", ur: "حوالے کیا گیا نشان زد کریں", es: "Marcar como entregado", fr: "Marquer comme remis", ar: "تحديد كـ تم التسليم", de: "Als übergeben markieren"
  },

  // Activity / Profile Page
  loginToViewProfile: {
    en: "Please log in to view your profile", hi: "अपनी प्रोफ़ाइल देखने के लिए कृपया लॉग इन करें", te: "మీ ప్రొఫైల్‌ను వీక్షించడానికి దయచేసి లాగిన్ చేయండి", ta: "உங்கள் சுயவிவரத்தைப் பார்க்க உள்நுழையவும்", kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಲು ದಯವಿಟ್ಟು ಲಾಗಿನ್ ಮಾಡಿ",
    mr: "तुमचे प्रोफाईल पाहण्यासाठी कृपया लॉगिन करा", bn: "আপনার প্রোফাইল দেখতে অনুগ্রহ করে লগইন করুন", ml: "നിങ്ങളുടെ പ്രൊഫൈൽ കാണാൻ ലോഗിൻ ചെയ്യുക", gu: "તમારી પ્રોફાઇલ જોવા માટે કૃપા કરીને લૉગિન કરો", pa: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਦੇਖਣ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਲੌਗਇਨ ਕਰੋ",
    or: "ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ଦେଖିବା ପାଇଁ ଦୟାକରି ଲଗଇନ୍ କରନ୍ତୁ", ur: "اپنی پروفائل دیکھنے کے لیے براہ کرم لاگ ان کریں", es: "Inicia sesión para ver tu perfil", fr: "Veuillez vous connecter pour voir votre profil", ar: "يرجى تسجيل الدخول لعرض ملفك الشخصي", de: "Bitte melden Sie sich an, um Ihr Profil anzusehen"
  },
  loginOrSignUpBtn: {
    en: "Log In or Sign Up", hi: "लॉग इन या साइन अप करें", te: "లాగిన్ లేదా సైన్ అప్ చేయండి", ta: "உள்நுழையவும் அல்லது பதிவு செய்யவும்", kn: "ಲಾಗಿನ್ અથવા ಸೈನ್ ಅಪ್ ಮಾಡಿ",
    mr: "लॉगिन किंवा साइन अप करा", bn: "লগইন বা সাইন আপ করুন", ml: "ലോഗിൻ അല്ലെങ്കിൽ സൈൻ അപ്പ് ചെയ്യുക", gu: "લૉગિન અથવા સાઇન અપ કરો", pa: "ਲੌਗਇਨ ਜਾਂ ਸਾਈਨ ਅੱਪ ਕਰੋ",
    or: "ଲଗଇନ୍ କିମ୍ବା ସାଇନ୍ ଅପ୍ କରନ୍ତୁ", ur: "لاگ ان یا سائن اپ کریں", es: "Iniciar sesión o Registrarse", fr: "Se connecter ou S'inscrire", ar: "تسجيل الدخول أو الاشتراك", de: "Anmelden oder Registrieren"
  },
  profileTitle: {
    en: "Profile", hi: "प्रोफ़ाइल", te: "ప్రొఫైల్", ta: "சுயவிவரம்", kn: "ಪ್ರೊಫೈಲ್",
    mr: "प्रोफाईल", bn: "প্রোফাইল", ml: "പ്രൊഫൈൽ", gu: "પ્રોફાઇલ", pa: "ਪ੍ਰੋਫਾਈਲ",
    or: "ପ୍ରୋଫାଇଲ୍", ur: "پروفائل", es: "Perfil", fr: "Profil", ar: "الملف الشخصي", de: "Profil"
  },
  communityMemberRole: {
    en: "Community Member", hi: "समुदाय सदस्य", te: "సముదాయ సభ్యుడు", ta: "சமூக உறுப்பினர்", kn: "ಸಮುದಾಯದ ಸದಸ್ಯ",
    mr: "समुदाय सदस्य", bn: "সদস্য", ml: "കമ്മ്യൂണിറ്റി അംഗം", gu: "સમુદાય સભ્ય", pa: "ਕਮਿਊਨਿਟੀ ਮੈਂਬਰ",
    or: "ସମୁଦାୟ ସଦସ୍ୟ", ur: "کمیونٹی ممبر", es: "Miembro de la comunidad", fr: "Membre de la communauté", ar: "عضو المجتمع", de: "Community-Mitglied"
  },
  mealsCollectedStat: {
    en: "Meals Collected", hi: "भोजन एकत्र किया", te: "సేకరించిన భోజనాలు", ta: "சேகரிக்கப்பட்ட உணவுகள்", kn: "ಸಂಗ್ರಹಿಸಿದ ಊಟಗಳು",
    mr: "गोळा केलेले जेवण", bn: "সংগৃহীত খাবার", ml: "ശേഖരിച്ച ഭക്ഷണം", gu: "એકત્રિત ભોજન", pa: "ਇਕੱਠਾ ਕੀਤਾ ਭੋਜਨ",
    or: "ସଂଗୃହିତ ଖାଦ୍ୟ", ur: "جمع شدہ کھانا", es: "Comidas recolectadas", fr: "Repas collectés", ar: "الوجبات المجمعة", de: "Gesammelte Mahlzeiten"
  },
  animalsFedStat: {
    en: "Animals Fed", hi: "पशुओं को खिलाया", te: "ఆహారం అందించిన జంతువులు", ta: "உணவளிக்கப்பட்ட விலங்குகள்", kn: "ಆಹಾರ ನೀಡಿದ ಪ್ರಾಣಿಗಳು",
    mr: "भरवलेले प्राणी", bn: "খাওয়ানো পশু", ml: "ഭക്ഷണം നൽകിയ മൃഗങ്ങൾ", gu: "ખવડાવેલ પ્રાણીઓ", pa: "ਖੁਆਏ ਗਏ ਜਾਨਵਰ",
    or: "ଖାଦ୍ୟ ଦିଆଯାଇଥିବା ପଶୁ", ur: "کھانا کھلایا گیا جانور", es: "Animales alimentados", fr: "Animaux nourris", ar: "الحيوانات المطعمة", de: "Gefütterte Tiere"
  },
  postsMadeStat: {
    en: "Posts Made", hi: "पोस्ट की गई", te: "చేసిన పోస్ట్‌లు", ta: "செய்த பதிவுகள்", kn: "ಮಾಡಿದ ಪೋಸ್ಟ್‌ಗಳು",
    mr: "केलेल्या पोस्ट", bn: "করা পোস্ট", ml: "ചെയ്ത പോസ്റ്റുകൾ", gu: "કરેલ પોસ્ટ્સ", pa: "ਕੀਤੀਆਂ ਪੋਸਟਾਂ",
    or: "କରାଯାଇଥିବା ପୋଷ୍ଟ", ur: "شائع کردہ پوسٹس", es: "Publicaciones hechas", fr: "Annonces publiées", ar: "المنشورات المقدمة", de: "Erstellte Beiträge"
  },
  pickupSuccessStat: {
    en: "Pickup Success", hi: "पिकअप सफलता", te: "పికప్ విజయం", ta: "பிக்கப் வெற்றி", kn: "ಪಿಕಪ್ ಯಶಸ್ಸು",
    mr: "पिकअप यश", bn: "পিকআপ সাফল্য", ml: "പിക്കപ്പ് വിജയം", gu: "પિકઅપ સફળતા", pa: "ਪਿਕਅੱਪ ਸਫਲਤਾ",
    or: "ପିକଅପ୍ ସଫଳତା", ur: "پک اپ کی کامیابی", es: "Éxito de recogida", fr: "Succès du retrait", ar: "نجاح الاستلام", de: "Abholerfolg"
  },
  totalCountBadge: {
    en: "{{count}} Total", hi: "कुल {{count}}", te: "మొత్తం {{count}}", ta: "மொத்தம் {{count}}", kn: "ಒಟ್ಟು {{count}}",
    mr: "एकूण {{count}}", bn: "মোট {{count}}টি", ml: "ആകെ {{count}}", gu: "કુલ {{count}}", pa: "ਕੁੱਲ {{count}}",
    or: "ମୋଟ {{count}}", ur: "کل {{count}}", es: "{{count}} En total", fr: "{{count}} au total", ar: "الإجمالي {{count}}", de: "{{count}} Gesamt"
  },
  noPostsYet: {
    en: "You haven't posted any food yet.", hi: "आपने अभी तक कोई भोजन पोस्ट नहीं किया है।", te: "మీరు ఇంకా ఏ ఆహారాన్ని పోస్ట్ చేయలేదు.", ta: "நீங்கள் இன்னும் எந்த உணவையும் பதிவிடவில்லை.", kn: "ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಆಹಾರವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಿಲ್ಲ.",
    mr: "तुम्ही अद्याप कोणतेही अन्न पोस्ट केलेले नाही.", bn: "আপনি এখনও কোনো খাবার পোস্ট করেননি।", ml: "നിങ്ങൾ ഇതുവരെ ഭക്ഷണങ്ങളൊന്നും പോസ്റ്റ് ചെയ്തിട്ടില്ല.", gu: "તમે હજી સુધી કોઈ ખોરાક પોસ્ટ કર્યો નથી.", pa: "ਤੁਸੀਂ ਅਜੇ ਤੱਕ ਕੋਈ ਭੋਜਨ ਪੋਸਟ ਨਹੀਂ ਕੀਤਾ ਹੈ।",
    or: "ଆପଣ ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଖାଦ୍ୟ ପୋଷ୍ଟ କରିନାହାଁନ୍ତି।", ur: "آپ نے ابھی تک کوئی کھانا پوسٹ نہیں کیا ہے۔", es: "Aún no has publicado ninguna comida.", fr: "Vous n'avez encore publié aucune nourriture.", ar: "لم تقم بنشر أي طعام بعد.", de: "Sie haben noch keine Lebensmittel gepostet."
  },
  portionsLeftSummary: {
    en: "{{remaining}} / {{total}} left", hi: "{{remaining}} / {{total}} शेष", te: "{{remaining}} / {{total}} మిగిలి ఉంది", ta: "{{remaining}} / {{total}} மீதம்", kn: "{{remaining}} / {{total}} ಉಳಿದಿದೆ",
    mr: "{{remaining}} / {{total}} शिल्लक", bn: "{{remaining}} / {{total}}টি বাকি", ml: "{{remaining}} / {{total}} ബാക്കി", gu: "{{remaining}} / {{total}} બાકી", pa: "{{remaining}} / {{total}} ਬਾਕੀ",
    or: "{{remaining}} / {{total}} ବଳକା", ur: "{{remaining}} / {{total}} باقی", es: "Quedan {{remaining}} / {{total}}", fr: "{{remaining}} / {{total}} restantes", ar: "المتبقي {{remaining}} / {{total}}", de: "{{remaining}} / {{total}} übrig"
  },

  // Authentication Page
  registrationErr: {
    en: "An error occurred during registration.", hi: "पंजीकरण के दौरान एक त्रुटि हुई।", te: "రిజిస్ట్రేషన్ సమయంలో లోపం సంభవించింది.", ta: "பதிவின் போது ஒரு பிழை ஏற்பட்டது.", kn: "ನೋಂದಣಿ ಸಮಯದಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ.",
    mr: "नोंदणी दरम्यान त्रुटी आली.", bn: "নিবন্ধনের সময় একটি ত্রুটি ঘটেছে।", ml: "രജിസ്ട്രേഷനിടെ ഒരു പിശക് സംഭവിച്ചു.", gu: "નોંધણી દરમિયાન ભૂલ આવી.", pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਦੌਰਾਨ ਇੱਕ ਗਲਤੀ ਹੋਈ।",
    or: "ପଞ୍ଜୀକରଣ ସମୟରେ ତ୍ରୁଟି ଘଟିଲା।", ur: "رجسٹریشن کے دوران ایک خرابی پیش آئی۔", es: "Ocurrió un error durante el registro.", fr: "Une erreur est survenue lors de l'inscription.", ar: "حدث خطأ أثناء التسجيل.", de: "Bei der Registrierung ist ein Fehler aufgetreten."
  },
  regFailedTitle: {
    en: "Registration Failed", hi: "पंजीकरण विफल", te: "రిజిస్ట్రేషన్ విఫలమైంది", ta: "பதிவு தோல்வியடைந்தது", kn: "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ",
    mr: "नोंदणी अयशस्वी", bn: "নিবন্ধন ব্যর্থ হয়েছে", ml: "രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു", gu: "નોંધણી નિષ્ફળ ગઈ", pa: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਸਫਲ ਰਹੀ",
    or: "ପଞ୍ଜୀକରଣ ବିଫଳ ହେଲା", ur: "رجسٹریشن ناکام ہو گئی", es: "Error de registro", fr: "Échec de l'inscription", ar: "فشل التسجيل", de: "Registrierung fehlgeschlagen"
  },
  otpSentTitle: {
    en: "Verification Code Sent", hi: "सत्यापन कोड भेजा गया", te: "ధృవీకరణ కోడ్ పంపబడింది", ta: "சரிபார்ப்புக் குறியீடு அனுப்பப்பட்டது", kn: "ಪರಿಶೀಲನಾ ಕೋಡ್ ಕಳುಹಿಸಲಾಗಿದೆ",
    mr: "सत्यापन कोड पाठवला", bn: "যাচাইকরণ কোড পাঠানো হয়েছে", ml: "വെരിഫിക്കേഷൻ കോഡ് അയച്ചു", gu: "ચકાસણી કોડ મોકલ્યો", pa: "ਸਤਿਆਪਨ ਕੋਡ ਭੇਜਿਆ ਗਿਆ",
    or: "ଯାଞ୍ଚ କୋଡ୍ ପଠାଗଲା", ur: "تصدیقی کوڈ بھیج دیا گیا", es: "Código de verificación enviado", fr: "Code de vérification envoyé", ar: "تم إرسال رمز التحقق", de: "Bestätigungscode gesendet"
  },
  otpSentMsg: {
    en: "Check {{email}} for your 6-digit OTP verification code!", hi: "अपने 6-अंकों के ओटीपी कोड के लिए {{email}} जांचें!", te: "మీ 6-అంకెల OTP కోడ్ కోసం {{email}} ని తనిఖీ చేయండి!", ta: "உங்கள் 6-இலக்க OTP குறியீட்டிற்கு {{email}}-ஐச் சரிபார்க்கவும்!", kn: "ನಿಮ್ಮ 6-ಅಂಕಿಯ OTP ಕೋಡ್‌ಗಾಗಿ {{email}} ಪರಿಶೀಲಿಸಿ!",
    mr: "तुमच्या 6-अंकी OTP कोडसाठी {{email}} तपासा!", bn: "আপনার ৬-সংখ্যার OTP কোডের জন্য {{email}} দেখুন!", ml: "നിങ്ങളുടെ 6 അക്ക OTP കോഡിനായി {{email}} പരിശോധിക്കുക!", gu: "તમારા 6-અંકના OTP કોડ માટે {{email}} ચકાસો!", pa: "ਆਪਣੇ 6-ਅੰਕਾਂ ਦੇ OTP ਕੋਡ ਲਈ {{email}} ਦੀ ਜਾਂਚ ਕਰੋ!",
    or: "ଆପଣଙ୍କ 6-ଅଙ୍କ ବିଶିଷ୍ଟ OTP କୋଡ୍ ପାଇଁ {{email}} ଯାଞ୍ଚ କରନ୍ତୁ!", ur: "اپنے 6 ہندسوں کے OTP کے لیے {{email}} چیک کریں!", es: "¡Consulta {{email}} para ver tu código OTP de 6 dígitos!", fr: "Vérifiez {{email}} pour obtenir votre code OTP à 6 chiffres !", ar: "تحقق من {{email}} للحصول على رمز OTP المكون من 6 أرقام!", de: "Überprüfen Sie {{email}} auf Ihren 6-stelligen OTP-Code!"
  },
  resetPassSubtitle: {
    en: "Create a new password for your account", hi: "अपने खाते के लिए नया पासवर्ड बनाएं", te: "మీ ఖాతా కోసం కొత్త పాస్‌వర్డ్‌ను సృష్టించండి", ta: "உங்கள் கணக்கிற்குப் புதிய கடவுச்சொல்லை உருவாக்கவும்", kn: "ನಿಮ್ಮ ಖಾತೆಗೆ ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ರಚಿಸಿ",
    mr: "तुमच्या खात्यासाठी नवीन पासवर्ड तयार करा", bn: "আপনার অ্যাকাউন্টের জন্য একটি নতুন পাসওয়ার্ড তৈরি করুন", ml: "നിങ്ങളുടെ അക്കൗണ്ടിനായി ഒരു പുതിയ പാസ്‌വേഡ് സൃഷ്‌ടിക്കുക", gu: "તમારા ખાતા માટે નવો પાસવર્ડ બનાવો", pa: "ਆਪਣੇ ਖਾਤੇ ਲਈ ਇੱਕ ਨਵਾਂ ਪਾਸਵਰਡ ਬਣਾਓ",
    or: "ଆପଣଙ୍କ ଆକାଉଣ୍ଟ୍ ପାଇଁ ନୂତନ ପାସୱାର୍ଡ ତିଆରି କରନ୍ତୁ", ur: "اپنے اکاؤنٹ کے لیے نیا پاس ورڈ بنائیں", es: "Crea una nueva contraseña para tu cuenta", fr: "Créez un nouveau mot de passe pour votre compte", ar: "أنشئ كلمة مرور جديدة لحسابك", de: "Erstellen Sie ein neues Passwort für Ihr Konto"
  },
  forgotPassSubtitle: {
    en: "Enter your email to receive reset instructions", hi: "रीसेट निर्देश प्राप्त करने के लिए अपना ईमेल दर्ज करें", te: "రీసెట్ సూచనలను పొందడానికి మీ ఇమెయిల్‌ను నమోదు చేయండి", ta: "கடவுச்சொல் மீட்பு வழிமுறைகளைப் பெற மின்னஞ்சலை உள்ளிடவும்", kn: "ಮರುಹೊಂದಿಸುವ ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ",
    mr: "रीसेट सूचना मिळवण्यासाठी तुमचा ईमेल प्रविष्ट करा", bn: "পুনরুদ্ধারের নির্দেশাবলী পেতে আপনার ইমেল লিখুন", ml: "റീസെറ്റ് നിർദ്ദേശങ്ങൾ ലഭിക്കുന്നതിന് നിങ്ങളുടെ ഇമെയിൽ നൽകുക", gu: "રીસેટ સૂચનાઓ મેળવવા માટે તમારો ઇમેઇલ દાખલ કરો", pa: "ਰੀਸੈਟ ਹਦਾਇਤਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਆਪਣਾ ਈਮੇਲ ਦਰਜ ਕਰੋ",
    or: "ରିସେଟ୍ ନିର୍ଦ୍ଦେଶାବଳୀ ପାଇବା ପାଇଁ ଆପଣଙ୍କ ଇମେଲ୍ ପ୍ରବେଶ କରନ୍ତୁ", ur: "ریسیٹ کی ہدایات حاصل کرنے کے لیے اپنا ای میل درج کریں", es: "Introduce tu correo electrónico para recibir instrucciones", fr: "Entrez votre e-mail pour recevoir les instructions", ar: "أدخل بريدك الإلكتروني لتلقي تعليمات إعادة التعيين", de: "Geben Sie Ihre E-Mail-Adresse ein, um Anweisungen zum Zurücksetzen zu erhalten"
  },
  otpSubtitle: {
    en: "Enter the 6-digit OTP sent to {{email}}", hi: "{{email}} पर भेजा गया 6-अंकों का ओटीपी दर्ज करें", te: "{{email}} కి పంపబడిన 6-అంకెల OTPని నమోదు చేయండి", ta: "{{email}}-க்கு அனுப்பப்பட்ட 6-இலக்க OTP-ஐ உள்ளிடவும்", kn: "{{email}} ಗೆ ಕಳುಹಿಸಲಾದ 6-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    mr: "{{email}} वर पाठवलेला 6-अंकी OTP प्रविष्ट करा", bn: "{{email}}-এ পাঠানো ৬-সংখ্যার OTP লিখুন", ml: "{{email}}-ലേക്ക് അയച്ച 6 അക്ക OTP നൽകുക", gu: "{{email}} પર મોકલેલ 6-અંકનો OTP દાખલ કરો", pa: "{{email}} 'ਤੇ ਭੇਜਿਆ ਗਿਆ 6-ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ",
    or: "{{email}} କୁ ପଠାଯାଇଥିବା 6-ଅଙ୍କ ବିଶିଷ୍ଟ OTP ପ୍ରବେଶ କରନ୍ତୁ", ur: "{{email}} پر بھیجا گیا 6 ہندسوں کا OTP درج کریں", es: "Introduce el OTP de 6 dígitos enviado a {{email}}", fr: "Saisissez le code OTP à 6 chiffres envoyé à {{email}}", ar: "أدخل رمز OTP المكون من 6 أرقام المرسل إلى {{email}}", de: "Geben Sie den 6-stelligen OTP-Code ein, der an {{email}} gesendet wurde"
  },
  loginSubtitle: {
    en: "Welcome back! Sign in to continue.", hi: "वापसी पर स्वागत है! जारी रखने के लिए साइन इन करें।", te: "తిరిగి వచ్చినందుకు స్వాగతం! కొనసాగడానికి సైన్ ఇన్ చేయండి.", ta: "மீண்டும் வருக! தொடர உள்நுழையவும்.", kn: "ಮತ್ತೆ ಸ್ವಾಗತ! ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    mr: "पुन्हा स्वागत आहे! पुढे जाण्यासाठी साइन इन करा.", bn: "স্বাগতম! চালিয়ে যেতে সাইন ইন করুন।", ml: "വീണ്ടും സ്വാഗതം! തുടരാൻ സൈൻ ഇൻ ചെയ്യുക.", gu: "પાછા સ્વાગત છે! આગળ વધવા માટે સાઇન ઇન કરો.", pa: "ਜੀ ਆਇਆਂ ਨੂੰ! ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।",
    or: "ପୁନର୍ବାର ସ୍ୱାଗତ! ଜାରି ରଖିବା ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ।", ur: "خوش آمدید! جاری رکھنے کے لیے سائن ان کریں۔", es: "¡Bienvenido de nuevo! Inicia sesión para continuar.", fr: "Ravi de vous revoir ! Connectez-vous pour continuer.", ar: "مرحباً بعودتك! سجل الدخول للمتابعة.", de: "Willkommen zurück! Melden Sie sich an, um fortzufahren."
  },
  signupSubtitle: {
    en: "Create an account to start sharing food.", hi: "भोजन साझा करना शुरू करने के लिए एक खाता बनाएं।", te: "ఆహారాన్ని పంచుకోవడం ప్రారంభించడానికి ఒక ఖాతాను సృష్టించండి.", ta: "உணவைப் பகிரத் தொடங்க கணக்கை உருவாக்கவும்.", kn: "ಆಹಾರವನ್ನು ಹಂಚಿಕೊಳ್ಳಲು ಪ್ರಾರಂಭಿಸಲು ಖಾತೆಯನ್ನು ರಚಿಸಿ.",
    mr: "अन्न शेअर करणे सुरू करण्यासाठी खाते तयार करा.", bn: "খাবার ভাগ করা শুরু করতে একটি অ্যাকাউন্ট তৈরি করুন।", ml: "ഭക്ഷണം പങ്കിടാൻ തുടങ്ങാൻ ഒരു അക്കൗണ്ട് സൃഷ്‌ടിക്കുക.", gu: "ખોરાક શેર કરવાનું શરૂ કરવા માટે એક ખાતું બનાવો.", pa: "ਭੋਜਨ ਸਾਂਝਾ ਕਰਨਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਇੱਕ ਖਾਤਾ ਬਣਾਓ।",
    or: "ଖାଦ୍ୟ ବାଣ୍ଟିବା ଆରମ୍ଭ କରିବା ପାଇଁ ଏକ ଆକାଉଣ୍ଟ୍ ତିଆରି କରନ୍ତୁ।", ur: "کھانا شیئر کرنا شروع کرنے کے لیے اکاؤنٹ بنائیں۔", es: "Crea una cuenta para empezar a compartir comida.", fr: "Créez un compte pour commencer à partager de la nourriture.", ar: "أنشئ حساباً لبدء مشاركة الطعام.", de: "Erstellen Sie ein Konto, um Lebensmittel zu teilen."
  },
  resetLinkSentHeader: {
    en: "Password Reset Link Sent! ✉️", hi: "पासवर्ड रीसेट लिंक भेजा गया! ✉️", te: "పాస్‌వర్డ్ రీసెట్ లింక్ పంపబడింది! ✉️", ta: "கடவுச்சொல் மீட்பு இணைப்பு அனுப்பப்பட்டது! ✉️", kn: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ! ✉️",
    mr: "पासवर्ड रीसेट लिंक पाठवली! ✉️", bn: "পাসওয়ার্ড রিসেট লিঙ্ক পাঠানো হয়েছে! ✉️", ml: "പാസ്‌വേഡ് റീസെറ്റ് ലിങ്ക് അയച്ചു! ✉️", gu: "પાસવર્ડ રીસેટ લિંક મોકલી! ✉️", pa: "ਪਾਸਵਰਡ ਰੀਸੈਟ ਲਿੰਕ ਭੇਜਿਆ ਗਿਆ! ✉️",
    or: "ପାସୱାର୍ଡ ରିସେଟ୍ ଲିଙ୍କ୍ ପଠାଗଲା! ✉️", ur: "پاس ورڈ ریسیٹ لنک بھیج دیا گیا! ✉️", es: "¡Enlace de restablecimiento enviado! ✉️", fr: "Lien de réinitialisation envoyé ! ✉️", ar: "تم إرسال رابط إعادة تعيين كلمة المرور! ✉️", de: "Link zum Zurücksetzen gesendet! ✉️"
  },
  resetLinkSentBody: {
    en: "We've sent a password reset link to {{email}}. Please check your inbox and spam folder, then tap the link to reset your password.", hi: "हमने {{email}} पर एक पासवर्ड रीसेट लिंक भेजा है। कृपया अपना इनबॉक्स और स्पैम फ़ोल्डर जांचें।", te: "మేము {{email}} కి పాస్‌వర్డ్ రీసెట్ లింక్‌ను పంపాము. దయచేసి మీ ఇన్‌బాక్స్ మరియు స్పామ్ ఫోల్డర్‌ను తనిఖీ చేయండి.", ta: "{{email}}-க்கு மீட்பு இணைப்பு அனுப்பப்பட்டுள்ளது. உங்கள் மின்னஞ்சல் மற்றும் ஸ்பேம் கோப்புறையைச் சரிபார்க்கவும்.", kn: "ನಾವು {{email}} ಗೆ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ. దಯವಿಟ್ಟು మీ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ.",
    mr: "आम्ही {{email}} वर पासवर्ड रीसेट लिंक पाठवली आहे. कृपया तुमचा इनबॉक्स आणि स्पॅम फोल्डर तपासा.", bn: "আমরা {{email}}-এ একটি পাসওয়ার্ড রিসেট লিঙ্ক পাঠিয়েছি। আপনার ইনবক্স এবং স্প্যাম ফোল্ডার পরীক্ষা করুন।", ml: "ഞങ്ങൾ {{email}}-ലേക്ക് ഒരു പാസ്‌വേഡ് റീസെറ്റ് ലിങ്ക് അയച്ചിട്ടുണ്ട്. നിങ്ങളുടെ ഇൻബോക്സ് പരിശോധിക്കുക.", gu: "અમે {{email}} પર પાસવર્ડ રીસેટ લિંક મોકલી છે. કૃપા કરીને તમારું ઇનબોક્સ ચકાસો.", pa: "ਅਸੀਂ {{email}} 'ਤੇ ਇੱਕ ਪਾਸਵਰਡ ਰੀਸੈਟ ਲਿੰਕ ਭੇਜਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇਨਬਾਕਸ ਜਾਂਚੋ।",
    or: "ଆମ୍ଭେ {{email}} କୁ ପାସୱାର୍ଡ ରିସେଟ୍ ଲିଙ୍କ୍ ପଠାଇଛୁ। ଦୟାକରି ଆପଣଙ୍କ ଇନବକ୍ସ ଯାଞ୍ଚ କରନ୍ତୁ।", ur: "ہم نے {{email}} پر پاس ورڈ ریسیٹ لنک بھیج دیا ہے۔ براہ کرم اپنا ان باکس چیک کریں۔", es: "Hemos enviado un enlace a {{email}}. Revisa tu bandeja de entrada y la carpeta de spam.", fr: "Nous avons envoyé un lien à {{email}}. Veuillez vérifier votre boîte de réception et vos spams.", ar: "لقد أرسلنا رابطاً إلى {{email}}. يرجى التحقق من صندوق الوارد ومجلد البريد العشوائي.", de: "Wir haben einen Link an {{email}} gesendet. Bitte überprüfen Sie Ihren Posteingang."
  },
  backToLoginBtn: {
    en: "← Back to Log In", hi: "← लॉग इन पर वापस जाएं", te: "← లాగిన్‌కి తిరిగి వెళ్లండి", ta: "← உள்நுழைவுக்குத் திரும்பு", kn: "← ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    mr: "← लॉगिनवर परत जा", bn: "← লগইনে ফিরে যান", ml: "← ലോഗിനിലേക്ക് മടങ്ങുക", gu: "← લૉગિન પર પાછા જાઓ", pa: "← ਲੌਗਇਨ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    or: "← ଲଗଇନ୍ କୁ ଫେରିଯାଅ", ur: "← لاگ ان پر واپس جائیں", es: "← Volver a Iniciar sesión", fr: "← Retour à la connexion", ar: "← العودة إلى تسجيل الدخول", de: "← Zurück zur Anmeldung"
  },
  newPasswordPlaceholder: {
    en: "New Password (min 6 characters)", hi: "नया पासवर्ड (न्यूनतम 6 अक्षर)", te: "కొత్త పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)", ta: "புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துக்கள்)", kn: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ (ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು)",
    mr: "नवीन पासवर्ड (किमान 6 अक्षरे)", bn: "নতুন পাসওয়ার্ড (সর্বনিম্ন ৬টি অক্ষর)", ml: "പുതിയ പാസ്‌വേഡ് (കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ)", gu: "નવો પાસવર્ડ (ઓછામાં ઓછા 6 અક્ષરો)", pa: "ਨਵਾਂ ਪਾਸਵਰਡ (ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ)",
    or: "ନୂତନ ପାସୱାର୍ଡ (କମରେ କମ୍ 6 ଅକ୍ଷର)", ur: "نیا پاس ورڈ (کم از کم 6 حروف)", es: "Nueva contraseña (mínimo 6 caracteres)", fr: "Nouveau mot de passe (min 6 caractères)", ar: "كلمة مرور جديدة (6 أحرف على الأقل)", de: "Neues Passwort (mind. 6 Zeichen)"
  },
  confirmPasswordPlaceholder: {
    en: "Confirm New Password", hi: "नये पासवर्ड की पुष्टि करें", te: "కొత్త పాస్‌వర్డ్‌ను నిర్ధారించండి", ta: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்", kn: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಖಚಿತಪಡಿಸಿ",
    mr: "नवीन पासवर्डची पुष्टी करा", bn: "নতুন পাসওয়ার্ড নিশ্চিত করুন", ml: "പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക", gu: "નવા પાસવર્ડની પુષ્ટિ કરો", pa: "ਨਵੇਂ ਪਾਸਵਰਡ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ",
    or: "ନୂତନ ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ", ur: "نئے پاس ورڈ کی تصدیق کریں", es: "Confirmar nueva contraseña", fr: "Confirmer le nouveau mot de passe", ar: "تأكيد كلمة المرور الجديدة", de: "Neues Passwort bestätigen"
  },
  updatingPasswordState: {
    en: "Updating Password...", hi: "पासवर्ड अपडेट हो रहा है...", te: "పాస్‌వర్డ్ అప్‌డేట్ అవుతోంది...", ta: "கடவுச்சொல் புதுப்பிக்கப்படுகிறது...", kn: "ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "पासवर्ड अपडेट होत आहे...", bn: "পাসওয়ার্ড আপডেট হচ্ছে...", ml: "പാസ്‌വേഡ് അപ്ഡേറ്റ് ചെയ്യുന്നു...", gu: "પાસવર્ડ અપડેટ થઈ રહ્યો છે...", pa: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਹੋ ਰਿਹਾ ਹੈ...",
    or: "ପାସୱାର୍ଡ ଅପଡେଟ୍ ହେଉଛି...", ur: "پاس ورڈ اپ ڈیٹ ہو رہا ہے...", es: "Actualizando contraseña...", fr: "Mise à jour du mot de passe...", ar: "جاري تحديث كلمة المرور...", de: "Passwort wird aktualisiert..."
  },
  updatePasswordBtn: {
    en: "Update Password & Log In", hi: "पासवर्ड अपडेट करें और लॉग इन करें", te: "పాస్‌వర్డ్‌ను అప్‌డేట్ చేసి లాగిన్ చేయండి", ta: "கடவுச்சொல்லைப் புதுப்பித்து உள்நுழையவும்", kn: "ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
    mr: "पासवर्ड अपडेट करा आणि लॉगिन करा", bn: "পাসওয়ার্ড আপডেট করুন এবং লগইন করুন", ml: "പാസ്‌വേഡ് അപ്ഡേറ്റ് ചെയ്ത് ലോഗിൻ ചെയ്യുക", gu: "પાસવર્ડ અપડેટ કરો અને લૉગિન કરો", pa: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਕਰੋ ਅਤੇ ਲੌਗਇਨ ਕਰੋ",
    or: "ପାସୱାର୍ଡ ଅପଡେଟ୍ କରନ୍ତୁ ଏବଂ ଲଗଇନ୍ କରନ୍ତୁ", ur: "پاس ورڈ اپ ڈیٹ کریں اور لاگ ان کریں", es: "Actualizar contraseña e iniciar sesión", fr: "Mettre à jour le mot de passe et se connecter", ar: "تحديث كلمة المرور وتسجيل الدخول", de: "Passwort aktualisieren & anmelden"
  },
  emailInputPlaceholder: {
    en: "Enter your registered email address", hi: "अपना पंजीकृत ईमेल पता दर्ज करें", te: "మీ నమోదిత ఇమెయిల్ చిరునామాను నమోదు చేయండి", ta: "பதிவுசெய்த மின்னஞ்சல் முகவரியை உள்ளிடவும்", kn: "ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ",
    mr: "तुमचा नोंदणीकृत ईमेल पत्ता प्रविष्ट करा", bn: "আপনার নিবন্ধিত ইমেল ঠিকানা লিখুন", ml: "നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത ഇമെയിൽ നൽകുക", gu: "તમારું નોંધાયેલ ઇમેઇલ સરનામું દાખલ કરો", pa: "ਆਪਣਾ ਰਜਿਸਟਰਡ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
    or: "ଆପଣଙ୍କ ପଞ୍ଜୀକୃତ ଇମେଲ୍ ଠିକଣା ପ୍ରବେଶ କରନ୍ତୁ", ur: "اپنا رجسٹرڈ ای میل درج کریں", es: "Introduce tu correo registrado", fr: "Entrez votre e-mail enregistré", ar: "أدخل عنوان بريدك الإلكتروني المسجل", de: "Geben Sie Ihre registrierte E-Mail-Adresse ein"
  },
  sendingLinkState: {
    en: "Sending Link...", hi: "लिंक भेजा जा रहा है...", te: "లింక్ పంపబడుతోంది...", ta: "இணைப்பு அனுப்பப்படுகிறது...", kn: "ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "लिंक पाठवली जात आहे...", bn: "লিঙ্ক পাঠানো হচ্ছে...", ml: "ലിങ്ക് അയക്കുന്നു...", gu: "લિંક મોકલાઈ રહી છે...", pa: "ਲਿੰਕ ਭੇਜਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    or: "ଲିଙ୍କ୍ ପଠାଯାଉଛି...", ur: "لنک بھیجا جا رہا ہے...", es: "Enviando enlace...", fr: "Envoi du lien...", ar: "جاري إرسال الرابط...", de: "Link wird gesendet..."
  },
  sendResetEmailBtn: {
    en: "Send Password Reset Email", hi: "पासवर्ड रीसेट ईमेल भेजें", te: "పాస్‌వర్డ్ రీసెట్ ఇమెయిల్ పంపండి", ta: "மீட்பு மின்னஞ்சலை அனுப்பு", kn: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಇಮೇಲ್ ಕಳುಹಿಸಿ",
    mr: "पासवर्ड रीसेट ईमेल पाठवा", bn: "পাসওয়ার্ড রিসেট ইমেল পাঠান", ml: "പാസ്‌വേഡ് റീസെറ്റ് ഇമെയിൽ അയയ്ക്കുക", gu: "પાસવર્ડ રીસેટ ઇમેઇલ મોકલો", pa: "ਪਾਸਵਰਡ ਰੀਸੈਟ ਈਮੇਲ ਭੇਜੋ",
    or: "ପାସୱାର୍ଡ ରିସେଟ୍ ଇମେଲ୍ ପଠାନ୍ତୁ", ur: "پاس ورڈ ریسیٹ ای میل بھیجیں", es: "Enviar correo de restablecimiento", fr: "Envoyer l'e-mail de réinitialisation", ar: "إرسال بريد إعادة تعيين كلمة المرور", de: "E-Mail zum Zurücksetzen senden"
  },
  verifyingState: {
    en: "Verifying...", hi: "सत्यापित किया जा रहा है...", te: "ధృవీకరిస్తోంది...", ta: "சரிபார்க்கப்படுகிறது...", kn: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "सत्यापित करत आहे...", bn: "যাচাই করা হচ্ছে...", ml: "പരിശോധിക്കുന്നു...", gu: "ચકાસણી થઈ રહી છે...", pa: "ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    or: "ଯାଞ୍ଚ କରାଯାଉଛି...", ur: "تصدیق کی جا رہی ہے...", es: "Verificando...", fr: "Vérification...", ar: "جاري التحقق...", de: "Bestätigung..."
  },
  verifyCodeBtn: {
    en: "Verify Code & Log In", hi: "कोड सत्यापित करें और लॉग इन करें", te: "కోడ్‌ను ధృవీకరించి లాగిన్ చేయండి", ta: "குறியீட்டைச் சரிபார்த்து உள்நுழையவும்", kn: "ಕೋಡ್ ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
    mr: "कोड सत्यापित करा आणि लॉगिन करा", bn: "কোড যাচাই করুন এবং লগইন করুন", ml: "കോഡ് പരിശോധിച്ച് ലോഗിൻ ചെയ്യുക", gu: "કોડ ચકાસો અને લૉગિન કરો", pa: "ਕੋਡ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਲੌਗਇਨ ਕਰੋ",
    or: "କୋଡ୍ ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଲଗଇନ୍ କରନ୍ତୁ", ur: "کوڈ کی تصدیق کریں اور لاگ ان کریں", es: "Verificar código e iniciar sesión", fr: "Vérifier le code et se connecter", ar: "التحقق من الرمز وتسجيل الدخول", de: "Code bestätigen & anmelden"
  },
  fullNamePlaceholder: {
    en: "Full Name", hi: "पूरा नाम", te: "పూర్తి పేరు", ta: "முழு பெயர்", kn: "ಪೂರ್ಣ ಹೆಸರು",
    mr: "पूर्ण नाव", bn: "পুরো নাম", ml: "മുഴുവൻ പേര്", gu: "પૂરું નામ", pa: "ਪੂਰਾ ਨਾਮ",
    or: "ପୂରା ନାମ", ur: "پورا نام", es: "Nombre completo", fr: "Nom complet", ar: "الاسم الكامل", de: "Vollständiger Name"
  },
  phoneNumberPlaceholder: {
    en: "Phone Number", hi: "फ़ोन नंबर", te: "ఫోన్ నంబర్", ta: "தொலைபேசி எண்", kn: "ಫೋನ್ ಸಂಖ್ಯೆ",
    mr: "फोन नंबर", bn: "ফোন নম্বর", ml: "ഫോൺ നമ്പർ", gu: "ફોન નંબર", pa: "ਫੋਨ ਨੰਬਰ",
    or: "ଫୋନ୍ ନମ୍ବର", ur: "فون نمبر", es: "Número de teléfono", fr: "Numéro de téléphone", ar: "رقم الهاتف", de: "Telefonnummer"
  },
  forgotPasswordLink: {
    en: "Forgot Password?", hi: "पासवर्ड भूल गए?", te: "పాస్‌వర్డ్ మరిచిపోయారా?", ta: "கடவுச்சொல் மறந்துவிட்டதா?", kn: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
    mr: "पासवर्ड विसरलात?", bn: "পাসওয়ার্ড ভুলে গেছেন?", ml: "പാസ്‌വേഡ് മറന്നോ?", gu: "પાસવર્ડ ભૂલી ગયા છો?", pa: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    or: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ କି?", ur: "پاس ورڈ بھول گئے؟", es: "¿Olvidaste tu contraseña?", fr: "Mot de passe oublié ?", ar: "هل نسيت كلمة المرور؟", de: "Passwort vergessen?"
  },
  processingState: {
    en: "Processing...", hi: "प्रक्रिया जारी है...", te: "ప్రాసెస్ చేస్తోంది...", ta: "செயலாக்கப்படுகிறது...", kn: "ಸಂಸ್ಕರಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "प्रक्रिया सुरू आहे...", bn: "প্রক্রিয়াধীন...", ml: "പ്രോസസ്സ് ചെയ്യുന്നു...", gu: "પ્રક્રિયા થઈ રહી છે...", pa: "ਪ੍ਰੋਸੈਸਿੰਗ ਹੋ ਰਹੀ ਹੈ...",
    or: "ପ୍ରକ୍ରିୟାକରଣ ହେଉଛି...", ur: "پروسیسنگ ہو رہی ہے...", es: "Procesando...", fr: "Traitement...", ar: "جاري المعالجة...", de: "Verarbeitung..."
  },
  registerAccountBtn: {
    en: "Register Account", hi: "खाता पंजीकृत करें", te: "ఖాతాను నమోదు చేయండి", ta: "கணக்கைப் பதிவுசெய்", kn: "ಖಾತೆಯನ್ನು ನೋಂದಾಯಿಸಿ",
    mr: "खाते नोंदणी करा", bn: "অ্যাকাউন্ট নিবন্ধন করুন", ml: "അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യുക", gu: "ખાતું નોંધાવો", pa: "ਖਾਤਾ ਰਜਿਸਟਰ ਕਰੋ",
    or: "ଆକାଉଣ୍ଟ୍ ପଞ୍ଜୀକୃତ କରନ୍ତୁ", ur: "اکاؤنٹ رجسٹر کریں", es: "Registrar cuenta", fr: "Créer un compte", ar: "تسجيل الحساب", de: "Konto registrieren"
  },

  // Post Food Page
  customPrepPlaceholder: {
    en: "Enter custom prep time (e.g. Prepared at 8:00 AM)", hi: "कस्टम तैयारी समय दर्ज करें (जैसे सुबह 8:00 बजे)", te: "కస్టమ్ తయారు చేసిన సమయాన్ని నమోదు చేయండి", ta: "தயாரிப்பு நேரத்தை உள்ளிடவும்", kn: "ತಯಾರಿಸಿದ ಸಮಯವನ್ನು ನಮೂದಿಸಿ",
    mr: "तयारीची वेळ प्रविष्ट करा", bn: "প্রস্তুতির সময় লিখুন", ml: "തയ്യാറാക്കിയ സമയം നൽകുക", gu: "તૈયારીનો સમય દાખલ કરો", pa: "ਤਿਆਰੀ ਦਾ ਸਮਾਂ ਦਰਜ ਕਰੋ",
    or: "ପ୍ରସ୍ତୁତି ସମୟ ପ୍ରବେଶ କରନ୍ତୁ", ur: "تیاری کا وقت درج کریں", es: "Introduce la hora de preparación personalizada", fr: "Heure de préparation personnalisée", ar: "أدخل وقت التحضير المخصص", de: "Benutzerdefinierte Zubereitungszeit eingeben"
  },
  customHoursChip: {
    en: "Custom Hours", hi: "कस्टम घंटे", te: "కస్టమ్ గంటలు", ta: "தனிப்பயன் மணிநேரம்", kn: "ಕಸ್ಟಮ್ ಗಂಟೆಗಳು",
    mr: "कस्टम तास", bn: "কাস্টম ঘণ্টা", ml: "കസ്റ്റം മണിക്കൂറുകൾ", gu: "કસ્ટમ કલાકો", pa: "ਕਸਟਮ ਘੰਟੇ",
    or: "କଷ୍ଟମ୍ ଘଣ୍ଟା", ur: "حسب ضرورت گھنٹے", es: "Horas personalizadas", fr: "Heures personnalisées", ar: "ساعات مخصصة", de: "Benutzerdefinierte Stunden"
  },
  hoursCountChip: {
    en: "⏳ {{count}} Hours", hi: "⏳ {{count}} घंटे", te: "⏳ {{count}} గంటలు", ta: "⏳ {{count}} மணிநேரம்", kn: "⏳ {{count}} ಗಂಟೆಗಳು",
    mr: "⏳ {{count}} तास", bn: "⏳ {{count}} ঘণ্টা", ml: "⏳ {{count}} മണിക്കൂർ", gu: "⏳ {{count}} કલાક", pa: "⏳ {{count}} ਘੰਟੇ",
    or: "⏳ {{count}} ଘଣ୍ଟା", ur: "⏳ {{count}} گھنٹے", es: "⏳ {{count}} Horas", fr: "⏳ {{count}} Heures", ar: "⏳ {{count}} ساعات", de: "⏳ {{count}} Stunden"
  },
  customExpiryPlaceholder: {
    en: "Enter expiry hours (e.g. 5)", hi: "समाप्ति घंटे दर्ज करें (जैसे 5)", te: "గడువు గంటలను నమోదు చేయండి (ఉదా. 5)", ta: "காலா Nic மணிநேரங்களை உள்ளிடவும்", kn: "ಅವಧಿ ಮುಕ್ತಾಯದ ಗಂಟೆಗಳನ್ನು ನಮೂದಿಸಿ",
    mr: "कालबाह्य तास प्रविष्ट करा", bn: "মেয়াদোত্তীর্ণের ঘণ্টা লিখুন", ml: "കാലാവധി കഴിയുന്ന മണിക്കൂറുകൾ നൽകുക", gu: "સમાપ્તિના કલાકો દાખલ કરો", pa: "ਮਿਆਦ ਪੁੱਗਣ ਦੇ ਘੰਟੇ ਦਰਜ ਕਰੋ",
    or: "ସମାପ୍ତି ଘଣ୍ଟା ପ୍ରବେଶ କରନ୍ତୁ", ur: "میعاد ختم ہونے کے گھنٹے درج کریں", es: "Introduce las horas de caducidad", fr: "Heures d'expiration (ex: 5)", ar: "أدخل ساعات الانتهاء", de: "Ablaufstunden eingeben (z.B. 5)"
  },
  optionalBadge: {
    en: "Optional", hi: "ऐच्छिक", te: "ఐచ్ఛికం", ta: "விருப்பத்தேர்வு", kn: "ಐಚ್ಛಿಕ",
    mr: "ऐच्छिक", bn: "ঐচ্ছিক", ml: "ഓപ്ഷണൽ", gu: "વૈકલ્પિક", pa: "ਚੋਣਵਾਂ",
    or: "ଐଚ୍ଛିକ", ur: "اختیاری", es: "Opcional", fr: "Optionnel", ar: "اختياري", de: "Optional"
  },

  // Expired Outlet Page
  goneInCountdown: {
    en: "⏳ Gone in {{time}}", hi: "⏳ {{time}} में समाप्त", te: "⏳ {{time}} లో ముగుస్తుంది", ta: "⏳ {{time}} இல் முடிகிறது", kn: "⏳ {{time}} ರಲ್ಲಿ ಮುಕ್ತಾಯ",
    mr: "⏳ {{time}} मध्ये संपेल", bn: "⏳ {{time}} এ শেষ", ml: "⏳ {{time}} ഇൽ അവസാനിക്കും", gu: "⏳ {{time}} માં પૂરું થશે", pa: "⏳ {{time}} ਵਿੱਚ ਖਤਮ",
    or: "⏳ {{time}} ରେ ସମାପ୍ତ", ur: "⏳ {{time}} میں ختم", es: "⏳ Expira en {{time}}", fr: "⏳ Expire dans {{time}}", ar: "⏳ ينتهي خلال {{time}}", de: "⏳ Abgelaufen in {{time}}"
  },
  loadingExpiredItems: {
    en: "Loading expired items...", hi: "समाप्त आइटम लोड हो रहे हैं...", te: "గడువు ముగిసిన అంశాలు లోడ్ అవుతున్నాయి...", ta: "காலாவதியான பொருட்கள் ஏற்றப்படுகின்றன...", kn: "ಅವಧಿ ಮುಗಿದ ವಸ್ತುಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...",
    mr: "कालबाह्य वस्तू लोड होत आहेत...", bn: "মেয়াদোত্তীর্ণ আইটেম লোড হচ্ছে...", ml: "കാലാവധി കഴിഞ്ഞ ഇനങ്ങൾ ലോഡ് ചെയ്യുന്നു...", gu: "સમાપ્ત થયેલ વસ્તુઓ લોડ થઈ રહી છે...", pa: "ਮਿਆਦ ਪੁੱਗੀਆਂ ਵਸਤੂਆਂ ਲੋਡ ਹੋ ਰਹੀਆਂ ਹਨ...",
    or: "ସମାପ୍ତ ସାମଗ୍ରୀ ଲୋଡ୍ ହେଉଛି...", ur: "میعاد ختم شدہ اشیاء لوڈ ہو رہی ہیں...", es: "Cargando artículos expirados...", fr: "Chargement des articles expirés...", ar: "جاري تحميل العناصر المنتهية...", de: "Abgelaufene Artikel werden geladen..."
  },

  // Location Picker Modal
  loadingAddressText: {
    en: "Loading address...", hi: "पता लोड हो रहा है...", te: "చిరునామా లోడ్ అవుతోంది...", ta: "முகவரி ஏற்றப்படுகிறது...", kn: "ವಿಳಾಸ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    mr: "पत्ता लोड होत आहे...", bn: "ঠিকানা লোড হচ্ছে...", ml: "വിലാസം ലോഡ് ചെയ്യുന്നു...", gu: "સરનામું લોડ થઈ રહ્યું છે...", pa: "ਪਤਾ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    or: "ଠିକଣା ଲୋଡ୍ ହେଉଛି...", ur: "پتہ لوڈ ہو رہا ہے...", es: "Cargando dirección...", fr: "Chargement de l'adresse...", ar: "جاري تحميل العنوان...", de: "Adresse wird geladen..."
  },
  mapDragHint: {
    en: "📍 Tap or drag marker anywhere on map", hi: "📍 मानचित्र पर कहीं भी मार्कर टैप या ड्रैग करें", te: "📍 మ్యాప్‌లో ఎక్కడైనా మార్కర్‌ను నొక్కండి లేదా లాగండి", ta: "📍 வரைபடத்தில் எங்கு வேண்டுமானாலும் குறிப்பானைத் தட்டவும்", kn: "📍 ನಕ್ಷೆಯಲ್ಲಿ ಎಲ್ಲಿಯಾದರೂ ಮಾರ್ಕರ್ ಅನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ",
    mr: "📍 नकाशावर कुठेही मार्कर टॅप करा किंवा ड्रॅग करा", bn: "📍 মানচিত্রে যেকোনো জায়গায় মার্কার আলতো চাপুন", ml: "📍 മാപ്പിൽ എവിടെ വേണമെങ്കിലും മാർക്കർ ടാപ്പ് ചെയ്യുക", gu: "📍 નકશા પર ગમે ત્યાં માર્કર ટેપ કરો", pa: "<ctrl42> ਨਕਸ਼ੇ 'ਤੇ ਕਿਤੇ ਵੀ ਮਾਰਕਰ ਟੈਪ ਕਰੋ",
    or: "📍 ମାନଚିତ୍ରରେ ଯେକୌଣସି ସ୍ଥାନରେ ମାର୍କର ଟ୍ୟାପ୍ କରନ୍ତୁ", ur: "📍 نقشے پر کہیں بھی مارکر ٹیپ کریں", es: "📍 Toca o arrastra el marcador en el mapa", fr: "📍 Touchez ou faites glisser le marqueur sur la carte", ar: "📍 اضغط أو اسحب العلامة في أي مكان على الخريطة", de: "📍 Tippen Sie auf die Karte oder ziehen Sie die Markierung"
  },
  mapIframeTitle: {
    en: "Interactive Location Picker Map", hi: "इंटरएक्टिव स्थान पिकर मानचित्र", te: "ఇంటరాక్టివ్ స్థాన పికర్ మ్యాప్", ta: "வரைபடம்", kn: "ನಕ್ಷೆ",
    mr: "नकाशा", bn: "মানচিত্র", ml: "മാപ്പ്", gu: "નકશો", pa: "ਨਕਸ਼ਾ",
    or: "ମାନଚିତ୍ର", ur: "نقشہ", es: "Mapa interactivo", fr: "Carte interactive", ar: "خريطة تفاعلية", de: "Interaktive Karte"
  },
  selectedAddressLabel: {
    en: "Selected Address:", hi: "चयनित पता:", te: "ఎంచుకున్న చిరునామా:", ta: "தேர்ந்தெடுக்கப்பட்ட முகவரி:", kn: "ಆಯ್ಕೆಮಾಡಿದ ವಿಳಾಸ:",
    mr: "निवडलेला पत्ता:", bn: "নির্বাচিত ঠিকানা:", ml: "തിരഞ്ഞെടുത്ത വിലാസം:", gu: "પસંદ કરેલ સરનામું:", pa: "ਚੁਣਿਆ ਗਿਆ ਪਤਾ:",
    or: "ଚୟନିତ ଠିକଣା:", ur: "منتخب کردہ پتہ:", es: "Dirección seleccionada:", fr: "Adresse sélectionnée :", ar: "العنوان المحدد:", de: "Ausgewählte Adresse:"
  },
  confirmLocationBtn: {
    en: "Confirm Location 📍", hi: "स्थान की पुष्टि करें 📍", te: "స్థానాన్ని నిర్ధారించండి 📍", ta: "இருப்பிடத்தை உறுதிசெய் 📍", kn: "ಸ್ಥಳವನ್ನು ಖಚಿತಪಡಿಸಿ 📍",
    mr: "स्थान निश्चित करा 📍", bn: "অবস্থান নিশ্চিত করুন 📍", ml: "ലൊക്കേഷൻ സ്ഥിരീകരിക്കുക 📍", gu: "સ્થળની પુષ્ટિ કરો 📍", pa: "ਸਥਾਨ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ 📍",
    or: "ସ୍ଥାନ ନିଶ୍ଚିତ କରନ୍ତୁ 📍", ur: "مقام کی تصدیق کریں 📍", es: "Confirmar ubicación 📍", fr: "Confirmer l'emplacement 📍", ar: "تأكيد الموقع 📍", de: "Standort bestätigen 📍"
  },

  // Reviews Component
  loginToReviewMsg: {
    en: "Please login to submit a review", hi: "समीक्षा सबमिट करने के लिए कृपया लॉगिन करें", te: "సమీక్షను సమర్పించడానికి దయచేసి లాగిన్ చేయండి", ta: "மதிப்பாய்வைச் சமர்ப்பிக்க உள்நுழையவும்", kn: "ವಿಮರ್ಶೆಯನ್ನು ಸಲ್ಲಿಸಲು ಲಾಗಿನ್ ಮಾಡಿ",
    mr: "पुनरावलोकन सबमिट करण्यासाठी कृपया लॉगिन करा", bn: "পর্যালোচনা জমা দিতে লগইন করুন", ml: "അവലോകനം സമർപ്പിക്കാൻ ലോഗിൻ ചെയ്യുക", gu: "સમીક્ષા સબમિટ કરવા માટે લૉગિન કરો", pa: "ਸਮੀਖਿਆ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ",
    or: "ସମୀକ୍ଷା ଦାଖଲ କରିବା ପାଇଁ ଲଗଇନ୍ କରନ୍ତୁ", ur: "جائزہ جمع کرانے کے لیے لاگ ان کریں", es: "Inicia sesión para publicar una reseña", fr: "Veuillez vous connecter pour donner un avis", ar: "يرجى تسجيل الدخول لتقديم مراجعة", de: "Bitte melden Sie sich an, um eine Bewertung abzugeben"
  },
  ratingRequiredTitle: {
    en: "Rating Required", hi: "रेटिंग आवश्यक है", te: "రేటింగ్ అవసరం", ta: "மதிப்பீடு தேவை", kn: "ರೇಟಿಂಗ್ ಅಗತ್ಯವಿದೆ",
    mr: "रेटिंग आवश्यक आहे", bn: "রেটিং প্রয়োজন", ml: "റേറ്റിംഗ് ആവശ്യമാണ്", gu: "રેટિંગ જરૂરી છે", pa: "ਰੇਟਿੰਗ ਲੋੜੀਂਦੀ ਹੈ",
    or: "ରେଟିଂ ଆବଶ୍ୟକ", ur: "ریٹنگ درکار ہے", es: "Calificación requerida", fr: "Évaluation requise", ar: "التقييم مطلوب", de: "Bewertung erforderlich"
  },
  selectStarRatingMsg: {
    en: "Please select a star rating (1 to 5 stars) before submitting!", hi: "सबमिट करने से पहले कृपया स्टार रेटिंग (1 से 5 स्टार) चुनें!", te: "సమర్పించే ముందు దయచేసి స్టార్ రేటింగ్‌ను ఎంచుకోండి!", ta: "சமர்ப்பிப்பதற்கு முன் நட்சத்திர மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்!", kn: "ಸಲ್ಲಿಸುವ ಮೊದಲು ನಕ್ಷತ್ರ ರೇಟಿಂಗ್ ಆಯ್ಕೆಮಾಡಿ!",
    mr: "सबमिट करण्यापूर्वी कृपया स्टार रेटिंग निवडा!", bn: "জমা দেওয়ার আগে স্টার রেটিং নির্বাচন করুন!", ml: "സമർപ്പിക്കുന്നതിന് മുൻപ് സ്റ്റാർ റേറ്റിംഗ് തിരഞ്ഞെടുക്കുക!", gu: "સબમિટ કરતા પહેલા સ્ટાર રેટિંગ પસંદ કરો!", pa: "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਟਾਰ ਰੇਟਿੰਗ ਚੁਣੋ!",
    or: "ଦାଖଲ କରିବା ପୂର୍ବରୁ ଷ୍ଟାର୍ ରେଟିଂ ବାଛନ୍ତୁ!", ur: "جمع کرانے سے پہلے اسٹار ریٹنگ منتخب کریں!", es: "Selecciona una calificación antes de enviar", fr: "Veuillez choisir une note avant de valider !", ar: "يرجى تحديد تقييم بالنجوم قبل التقديم!", de: "Bitte wählen Sie eine Sternebewertung aus!"
  },
  commentRequiredTitle: {
    en: "Comment Required", hi: "टिप्पणी आवश्यक है", te: "వ్యాఖ్య అవసరం", ta: "கருத்து தேவை", kn: "ಕಾಮೆಂಟ್ ಅಗತ್ಯವಿದೆ",
    mr: "टिप्पणी आवश्यक आहे", bn: "মন্তব্য প্রয়োজন", ml: "അഭിപ്രായം ആവശ്യമാണ്", gu: "ટિપ્પણી જરૂરી છે", pa: "ਟਿੱਪਣੀ ਲੋੜੀਂਦੀ ਹੈ",
    or: "ମନ୍ତବ୍ୟ ଆବଶ୍ୟକ", ur: "تبصرہ درکار ہے", es: "Comentario requerido", fr: "Commentaire requis", ar: "التعليق مطلوب", de: "Kommentar erforderlich"
  },
  typeCommentMsg: {
    en: "Please type a short comment/experience before submitting!", hi: "सबमिट करने से पहले कृपया एक संक्षिप्त टिप्पणी लिखें!", te: "సమర్పించే ముందు దయచేసి చిన్న కామెంట్ రాయండి!", ta: "சமர்ப்பிப்பதற்கு முன் ஒரு சிறிய கருத்தை டைப் செய்யவும்!", kn: "ಸಲ್ಲಿಸುವ ಮೊದಲು ಸಣ್ಣ ಕಾಮೆಂಟ್ ಬರೆಯಿರಿ!",
    mr: "सबमिट करण्यापूर्वी कृपया एक छोटी टिप्पणी लिहा!", bn: "জমা দেওয়ার আগে একটি ছোট মন্তব্য লিখুন!", ml: "സമർപ്പിക്കുന്നതിന് മുൻപ് ചെറിയ അഭിപ്രായം എഴുതുക!", gu: "સબમિટ કરતા પહેલા ટૂંકી ટિપ્પણી લખો!", pa: "ਜਮ੍ਹਾਂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇੱਕ ਛੋਟੀ ਟਿੱਪਣੀ ਲਿਖੋ!",
    or: "ଦାଖଲ କରିବା ପୂର୍ବରୁ ସଂକ୍ଷିପ୍ତ ମନ୍ତବ୍ୟ ଲେଖନ୍ତୁ!", ur: "جمع کرانے سے پہلے مختصر تبصرہ لکھیں!", es: "Escribe un comentario antes de enviar", fr: "Veuillez rédiger un court commentaire !", ar: "يرجى كتابة تعليق قصير قبل التقديم!", de: "Bitte schreiben Sie einen kurzen Kommentar!"
  },
  reviewErrMsg: {
    en: "Review Error: {{error}}", hi: "समीक्षा त्रुटि: {{error}}", te: "సమీక్ష లోపం: {{error}}", ta: "மதிப்பாய்வு பிழை: {{error}}", kn: "ವಿಮರ್ಶೆ ದೋಷ: {{error}}",
    mr: "पुनरावलोकन त्रुटी: {{error}}", bn: "পর্যালোচনা ত্রুটি: {{error}}", ml: "അവലോകന പിശക്: {{error}}", gu: "સમીક્ષા ભૂલ: {{error}}", pa: "ਸਮੀਖਿਆ ਗਲਤੀ: {{error}}",
    or: "ସମୀକ୍ଷା ତ୍ରୁଟି: {{error}}", ur: "جائزہ میں خرابی: {{error}}", es: "Error en la reseña: {{error}}", fr: "Erreur d'avis : {{error}}", ar: "خطأ في المراجعة: {{error}}", de: "Bewertungsfehler: {{error}}"
  },
  reviewFailedTitle: {
    en: "Review Failed", hi: "समीक्षा विफल रही", te: "సమీక్ష విఫలమైంది", ta: "மதிப்பாய்வு தோல்வியடைந்தது", kn: "ವಿಮರ್ಶೆ ವಿಫಲವಾಗಿದೆ",
    mr: "पुनरावलोकन अयशस्वी", bn: "পর্যালোচনা ব্যর্থ হয়েছে", ml: "അവലോകനം പരാജയപ്പെട്ടു", gu: "સમીક્ષા નિષ્ફળ ગઈ", pa: "ਸਮੀਖਿਆ ਅਸਫਲ ਰਹੀ",
    or: "ସମୀକ୍ଷା ବିଫଳ ହେଲା", ur: "جائزہ ناکام ہو گیا", es: "Error al publicar reseña", fr: "Échec de l'avis", ar: "فشلت المراجعة", de: "Bewertung fehlerhaft"
  },
  newReviewNotifTitle: {
    en: "⭐ New Review Received!", hi: "⭐ नई समीक्षा प्राप्त हुई!", te: "⭐ కొత్త సమీక్ష వచ్చింది!", ta: "⭐ புதிய மதிப்பாய்வு பெறப்பட்டது!", kn: "⭐ ಹೊಸ ವಿಮರ್ಶೆ ಸ್ವೀಕರಿಸಲಾಗಿದೆ!",
    mr: "⭐ नवीन पुनरावलोकन प्राप्त झाले!", bn: "⭐ নতুন পর্যালোচনা পাওয়া গেছে!", ml: "⭐ പുതിയ അവലോകനം ലഭിച്ചു!", gu: "⭐ નવી સમીક્ષા મળી!", pa: "⭐ ਨਵੀਂ ਸਮੀਖਿਆ ਪ੍ਰਾਪਤ ਹੋਈ!",
    or: "⭐ ନୂତନ ସମୀକ୍ଷା ମିଳିଲା!", ur: "⭐ نیا جائزہ موصول ہوا!", es: "¡⭐ Nueva reseña recibida!", fr: "⭐ Nouvel avis reçu !", ar: "⭐ تم استلام مراجعة جديدة!", de: "⭐ Neue Bewertung erhalten!"
  },
  newReviewNotifMsg: {
    en: "{{userName}} left a {{rating}}-star review: \"{{comment}}\"", hi: "{{userName}} ने {{rating}}-स्टार समीक्षा दी: \"{{comment}}\"", te: "{{userName}} {{rating}}-స్టార్ సమీక్ష ఇచ్చారు: \"{{comment}}\"", ta: "{{userName}} {{rating}}-நட்சத்திர மதிப்பாய்வை அளித்தார்: \"{{comment}}\"", kn: "{{userName}} {{rating}}-ಸ್ಟಾರ್ ವಿಮರ್ಶೆ ನೀಡಿದ್ದಾರೆ: \"{{comment}}\"",
    mr: "{{userName}} यांनी {{rating}}-स्टार पुनरावलोकन दिले: \"{{comment}}\"", bn: "{{userName}} {{rating}}-স্টার পর্যালোচনা দিয়েছেন: \"{{comment}}\"", ml: "{{userName}} {{rating}}-സ്റ്റാർ അവലോകനം നൽകി: \"{{comment}}\"", gu: "{{userName}} એ {{rating}}-સ્ટાર સમીક્ષા આપી: \"{{comment}}\"", pa: "{{userName}} ਨੇ {{rating}}-ਸਟਾਰ ਸਮੀਖਿਆ ਦਿੱਤੀ: \"{{comment}}\"",
    or: "{{userName}} {{rating}}-ଷ୍ଟାର୍ ସମୀକ୍ଷା ଦେଲେ: \"{{comment}}\"", ur: "{{userName}} نے {{rating}}-اسٹار جائزہ دیا: \"{{comment}}\"", es: "{{userName}} dejó una reseña de {{rating}} estrellas: \"{{comment}}\"", fr: "{{userName}} a laissé un avis {{rating}} étoiles : \"{{comment}}\"", ar: "ترك {{userName}} مراجعة {{rating}} نجوم: \"{{comment}}\"", de: "{{userName}} hat eine {{rating}}-Sterne-Bewertung hinterlassen: \"{{comment}}\""
  },
  reviewSubmittedTitle: {
    en: "⭐ Review Submitted!", hi: "⭐ समीक्षा सबमिट की गई!", te: "⭐ సమీక్ష సమర్పించబడింది!", ta: "⭐ மதிப்பாய்வு சமர்ப்பிக்கப்பட்டது!", kn: "⭐ ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
    mr: "⭐ पुनरावलोकन सबमिट केले!", bn: "⭐ পর্যালোচনা জমা দেওয়া হয়েছে!", ml: "⭐ അവലോകനം സമർപ്പിച്ചു!", gu: "⭐ સમીક્ષા સબમિટ થઈ!", pa: "⭐ ਸਮੀਖਿਆ ਜਮ੍ਹਾਂ ਹੋ ਗਈ!",
    or: "⭐ ସମୀକ୍ଷା ଦାଖଲ ହେଲା!", ur: "⭐ جائزہ جمع کر دیا گیا!", es: "¡⭐ Reseña enviada!", fr: "⭐ Avis envoyé !", ar: "⭐ تم تقديم المراجعة!", de: "⭐ Bewertung übermittelt!"
  },
  reviewSubmittedMsg: {
    en: "Thank you! Your review has been saved and provider overall ratings updated.", hi: "धन्यवाद! आपकी समीक्षा सहेज ली गई है।", te: "ధన్యవాదాలు! మీ సమీక్ష సేవ్ చేయబడింది.", ta: "நன்றி! உங்கள் மதிப்பாய்வு சேமிக்கப்பட்டது.", kn: "ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿಮರ್ಶೆಯನ್ನು ಉಳಿಸಲಾಗಿದೆ.",
    mr: "धन्यवाद! तुमचे पुनरावलोकन जतन केले आहे.", bn: "ধন্যবাদ! আপনার পর্যালোচনা সংরক্ষণ করা হয়েছে।", ml: "നന്ദി! നിങ്ങളുടെ അവലോകനം സംരക്ഷിച്ചു.", gu: "આભાર! તમારી સમીક્ષા સાચવવામાં આવી છે.", pa: "ਧੰਨਵਾਦ! ਤੁਹਾਡੀ ਸਮੀਖਿਆ ਸੰਭਾਲੀ ਗਈ ਹੈ।",
    or: "ଧନ୍ୟବାଦ! ଆପଣଙ୍କ ସମୀକ୍ଷା ସଂରକ୍ଷିତ ହେଲା।", ur: "شکریہ! آپ کا جائزہ محفوظ کر لیا گیا ہے۔", es: "¡Gracias! Tu reseña ha sido guardada.", fr: "Merci ! Votre avis a été enregistré.", ar: "شكراً لك! تم حفظ مراجعتك.", de: "Vielen Dank! Ihre Bewertung wurde gespeichert."
  },
  errorTitle: {
    en: "Error", hi: "त्रुटि", te: "లోపం", ta: "பிழை", kn: "ದೋಷ",
    mr: "त्रुटी", bn: "ত্রুটি", ml: "പിശക്", gu: "ભૂલ", pa: "ਗਲਤੀ",
    or: "ତ୍ରୁଟି", ur: "خرابی", es: "Error", fr: "Erreur", ar: "خطأ", de: "Fehler"
  },
  genericErrMsg: {
    en: "An error occurred. Please try again.", hi: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।", te: "ఒక లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.", ta: "ஒரு பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.", kn: "ಒಂದು ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    mr: "एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा.", bn: "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।", ml: "ഒരു പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.", gu: "એક ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો.", pa: "ਇੱਕ ਗਲਤੀ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    or: "ଏକ ତ୍ରୁଟି ଘଟିଲା। ଦୟାକରି ପୁନର୍ବାର ଚେଷ୍ଟା କରନ୍ତୁ।", ur: "ایک خرابی پیش آئی۔ دوبارہ کوشش کریں۔", es: "Ocurrió un error. Inténtalo de nuevo.", fr: "Une erreur s'est produite. Veuillez réessayer.", ar: "حدث خطأ. يرجى المحاولة مرة أخرى.", de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
  },
  shareExperiencePlaceholder: {
    en: "Share your experience…", hi: "अपना अनुभव साझा करें…", te: "మీ అనుభవాన్ని పంచుకోండి…", ta: "உங்கள் அனுபவத்தைப் பகிரவும்…", kn: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ…",
    mr: "तुमचा अनुभव शेअर करा…", bn: "আপনার অভিজ্ঞতা শেয়ার করুন…", ml: "നിങ്ങളുടെ അനുഭവം പങ്കിടുക…", gu: "તમારો અનુભવ શેર કરો…", pa: "ਆਪਣਾ ਤਜ਼ਰਬਾ ਸਾਂਝਾ ਕਰੋ…",
    or: "ଆପଣଙ୍କ ଅନୁଭବ ବାଣ୍ଟନ୍ତୁ…", ur: "اپنا تجربہ شیئر کریں…", es: "Comparte tu experiencia…", fr: "Partagez votre expérience…", ar: "شارك تجربتك…", de: "Teilen Sie Ihre Erfahrung…"
  },
  submittingReviewState: {
    en: "Submitting...", hi: "सबमिट किया जा रहा है...", te: "సమర్పిస్తోంది...", ta: "சமர்ப்பிக்கப்படுகிறது...", kn: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...",
    mr: "सबमिट करत आहे...", bn: "জমা দেওয়া হচ্ছে...", ml: "സമർപ്പിക്കുന്നു...", gu: "સબમિટ થઈ રહ્યું છે...", pa: "ਜਮ੍ਹਾਂ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    or: "ଦାଖଲ କରାଯାଉଛି...", ur: "جمع کیا جا رہا ہے...", es: "Enviando...", fr: "Envoi...", ar: "جاري التقديم...", de: "Wird übermittelt..."
  },
  submitReviewBtn: {
    en: "Submit Review", hi: "समीक्षा सबमिट करें", te: "సమీక్షను సమర్పించండి", ta: "மதிப்பாய்வைச் சமர்ப்பி", kn: "ವಿಮರ್ಶೆ ಸಲ್ಲಿಸಿ",
    mr: "पुनरावलोकन सबमिट करा", bn: "পর্যালোচনা জমা দিন", ml: "അവലോകനം സമർപ്പിക്കുക", gu: "સમીક્ષા સબમિટ કરો", pa: "ਸਮੀਖਿਆ ਜਮ੍ਹਾਂ ਕਰੋ",
    or: "ସମୀକ୍ଷା ଦାଖଲ କରନ୍ତୁ", ur: "جائزہ جمع کریں", es: "Enviar reseña", fr: "Soumettre l'avis", ar: "تقديم المراجعة", de: "Bewertung absenden"
  },
  noReviewsYet: {
    en: "No reviews yet.", hi: "अभी तक कोई समीक्षा नहीं।", te: "ఇంకా సమీక్షలు లేవు.", ta: "இன்னும் மதிப்பாய்வுகள் இல்லை.", kn: "ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳಿಲ್ಲ.",
    mr: "अद्याप कोणतीही पुनरावलोकने नाहीत.", bn: "এখনও কোনো পর্যালোচনা নেই।", ml: "ഇതുവരെ അവലോകനങ്ങളൊന്നുമില്ല.", gu: "હજી સુધી કોઈ સમીક્ષાઓ નથી.", pa: "ਅਜੇ ਤੱਕ ਕੋਈ ਸਮੀਖਿਆਵਾਂ ਨਹੀਂ ਹਨ।",
    or: "ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସମୀକ୍ଷା ନାହିଁ।", ur: "ابھی تک کوئی جائزہ نہیں ہے۔", es: "Aún no hay reseñas.", fr: "Aucun avis pour le moment.", ar: "لا يوجد مراجعات حتى الآن.", de: "Noch keine Bewertungen."
  },

  // App & Navigation
  openMainAppBtn: {
    en: "Open Main App 🚀", hi: "मुख्य ऐप खोलें 🚀", te: "ప్రధాన యాప్‌ను తెరిచి 🚀", ta: "முதன்மை பயன்பாட்டைத் திற 🚀", kn: "ಮುಖ್ಯ ಅಪ್ಲಿಕೇಶನ್ ತೆರೆಯಿರಿ 🚀",
    mr: "मुख्य ॲप उघडा 🚀", bn: "প্রধান অ্যাপ খুলুন 🚀", ml: "പ്രധാന ആപ്പ് തുറക്കുക 🚀", gu: "મુખ્ય એપ ખોલો 🚀", pa: "ਮੁੱਖ ਐਪ ਖੋਲ੍ਹੋ 🚀",
    or: "ମୁଖ୍ୟ ଆପ୍ ଖୋଲନ୍ତୁ 🚀", ur: "مین ایپ کھولیں 🚀", es: "Abrir aplicación principal 🚀", fr: "Ouvrir l'application 🚀", ar: "فتح التطبيق الرئيسي 🚀", de: "Haupt-App öffnen 🚀"
  },
  welcomeTitle: {
    en: "Welcome to Zerra Food Hub", hi: "ज़र्रा फूड हब में आपका स्वागत है", te: "జెర్రా ఫుడ్ హబ్‌కు స్వాగతం", ta: "செர்ரா ஃபூட் ஹப்பிற்கு வரவேற்கிறோம்", kn: "ಜೆರ್ರಾ ಫುಡ್ ಹಬ್‌ಗೆ സ്വാಗತ",
    mr: "झेर्रा फूड हब मध्ये आपले स्वागत आहे", bn: "জেরা ফুড হাবে স্বাগতম", ml: "സെറ ഫുഡ് ഹബ്ബിലേക്ക് സ്വാഗതം", gu: "ઝેરા ફૂડ હબમાં આપનું સ્વાગત છે", pa: "ਜ਼ੇਰਾ ਫੂਡ ਹਬ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ",
    or: "ଜେରା ଫୁଡ୍ ହବ୍ କୁ ସ୍ୱାଗତ", ur: "زیرا فوڈ ہب میں خوش آمدید", es: "Bienvenido a Zerra Food Hub", fr: "Bienvenue sur Zerra Food Hub", ar: "مرحباً بك في زيرا فود هاب", de: "Willkommen bei Zerra Food Hub"
  },
  pageNotFoundTitle: {
    en: "Oops! Page not found", hi: "ओह! पृष्ठ नहीं मिला", te: "అయ్యో! పేజీ కనుగొనబడలేదు", ta: "அச்சச்சோ! பக்கம் கிடைக்கவில்லை", kn: "ಅಯ್ಯೋ! ಪುಟ ಕಂಡುಬಂದಿಲ್ಲ",
    mr: "अरेरे! पृष्ठ आढळले नाही", bn: "উফ! পৃষ্ঠাটি পাওয়া যায়নি", ml: "അയ്യോ! പേജ് കണ്ടില്ല", gu: "અરેরে! પૃષ્ઠ મળ્યું નથી", pa: "ਉਫ਼! ਪੰਨਾ ਨਹੀਂ ਮਿਲਿਆ",
    or: "ଆହା! ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ", ur: "اوہ! صفحہ نہیں ملا", es: "¡Vaya! Página no encontrada", fr: "Oups ! Page non trouvée", ar: "عفواً! الصفحة غير موجودة", de: "Hoppla! Seite nicht gefunden"
  },
  returnHomeBtn: {
    en: "Return to Home", hi: "मुख्य पृष्ठ पर लौटें", te: "హోమ్‌కి తిరిగి వెళ్లండి", ta: "முகப்புக்குத் திரும்பு", kn: "ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ",
    mr: "मुख्य पृष्ठावर परत जा", bn: "হোমে ফিরে যান", ml: "ഹോമിലേക്ക് മടങ്ങുക", gu: "મુખ્ય પૃષ્ઠ પર પાછા જાઓ", pa: "ਮੁੱਖ ਪੰਨੇ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    or: "ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରିଯାଅ", ur: "ہوم پر واپس جائیں", es: "Volver al Inicio", fr: "Retour à l'accueil", ar: "العودة إلى الرئيسية", de: "Zurück zur Startseite"
  },
  configMissingTitle: {
    en: "Configuration Missing", hi: "कॉन्फ़िगरेशन गायब है", te: "కాన్ఫిగరేషన్ లోపించింది", ta: "அமைப்புகள் இல்லை", kn: "ಕಾನ್ಫಿಗರೇಶನ್ ಕಾಣೆಯಾಗಿದೆ",
    mr: "कॉन्फिगरेशन गहाळ आहे", bn: "কনফিগারেশন অনুপুস্থিত", ml: "കോൺഫിഗറേഷൻ കാണാനില്ല", gu: "કન્ફિગરેશન ખૂટે છે", pa: "ਕਨਫਿਗਰੇਸ਼ਨ ਗਾਇਬ ਹੈ",
    or: "କନ୍ଫିଗରେସନ୍ ଅନୁପସ୍ଥିତ", ur: "کنفیگریشن غائب ہے", es: "Falta configuración", fr: "Configuration manquante", ar: "التكوين مفقود", de: "Konfiguration fehlt"
  },
  loadingText: {
    en: "Loading…", hi: "लोड हो रहा है…", te: "లోడ్ అవుతోంది…", ta: "ஏற்றப்படுகிறது…", kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
    mr: "लोड होत आहे…", bn: "লোড হচ্ছে…", ml: "ലോഡ് ചെയ്യുന്നു…", gu: "લોડ થઈ રહ્યું છે…", pa: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ…",
    or: "ଲୋଡ୍ ହେଉଛି…", ur: "لوڈ ہو رہا ہے…", es: "Cargando…", fr: "Chargement…", ar: "جاري التحميل…", de: "Wird geladen…"
  },
  targetHumans: {
    en: "Humans", hi: "इंसान", te: "మానవులు", ta: "மனிதர்கள்", kn: "ಮಾನವರು",
    mr: "मानव", bn: "মানুষ", ml: "മനുഷ്യർ", gu: "મનુષ્યો", pa: "ਮਨੁੱਖ",
    or: "ମଣିଷ", ur: "انسان", es: "Humanos", fr: "Humains", ar: "البشر", de: "Menschen"
  },
  targetAnimals: {
    en: "Animals", hi: "पशु", te: "జంతువులు", ta: "விலங்குகள்", kn: "ಪ್ರಾಣಿಗಳು",
    mr: "प्राणी", bn: "পশু", ml: "മൃഗങ്ങൾ", gu: "પ્રાણીઓ", pa: "ਜਾਨਵਰ",
    or: "ପଶୁ", ur: "جانور", es: "Animales", fr: "Animaux", ar: "الحيوانات", de: "Tiere"
  }
};

// 1. Read translations.ts
const transFilePath = path.join(__dirname, 'src/i18n/translations.ts');
let content = fs.readFileSync(transFilePath, 'utf8');

// Also fix Odia navHome: "Home" -> "ମୁଖ୍ୟ ପୃଷ୍ଠା"
content = content.replace(/or:\s*{([\s\S]*?)navHome:\s*"Home"/, (match, group) => {
  return `or: {${group}navHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା"`;
});

// We can append new keys into each language block before the closing brace of each language dict
const languages = ['en', 'hi', 'te', 'ta', 'kn', 'mr', 'bn', 'ml', 'gu', 'pa', 'or', 'ur', 'es', 'fr', 'ar', 'de'];

languages.forEach(lang => {
  let langNewEntries = '';
  Object.keys(newKeys).forEach(key => {
    const val = newKeys[key][lang] || newKeys[key]['en'];
    // Escape double quotes if any inside val
    const escapedVal = val.replace(/"/g, '\\"');
    langNewEntries += `    ${key}: "${escapedVal}",\n`;
  });

  // Insert langNewEntries right before the end of that language's dictionary
  // Regexp matches language block like `en: { ... \n  },`
  const regex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?)(^\\s*\\},)`, 'm');
  content = content.replace(regex, `$1\n    // Added Localizations\n${langNewEntries}$2`);
});

fs.writeFileSync(transFilePath, content, 'utf8');
console.log('Successfully updated translations.ts with all new keys for 16 languages!');
