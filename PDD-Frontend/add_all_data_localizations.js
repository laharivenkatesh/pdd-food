const fs = require('fs');
const path = require('path');
const { translations } = require('./src/i18n/translations');

const dataKeys = {
  // NGO Descriptions
  ngo_desc_c1: {
    en: "Feeds thousands of Chennai's hungry daily",
    hi: "चेन्नई के हजारों भूखे लोगों को रोजाना भोजन कराता है",
    te: "చెన్నైలోని వేలాది మంది ఆకలితో ఉన్నవారికి ప్రతిరోజూ ఆహారం అందిస్తుంది",
    ta: "சென்னையின் பல்லாயிரக்கணக்கான பசியுள்ள மக்களுக்கு தினமும் உணவளிக்கிறது",
    kn: "ಚೆನ್ನೈನ ಸಾವಿರಾರು ಹಸಿದ ಜನರಿಗೆ ಪ್ರತಿದಿನ ಆಹಾರ ನೀಡುತ್ತದೆ",
    mr: "चेन्नईतील हजारो भुकेल्या लोकांना दररोज अन्न पुरवते",
    bn: "চেন্নাইয়ের হাজার হাজার ক্ষুধার্ত মানুষকে প্রতিদিন খাবার খাওয়ায়",
    ml: "ചെന്നൈയിലെ ആയിരക്കണക്കിന് വിശപ്പുള്ളവർക്ക് ദിവസവും ഭക്ഷണം നൽകുന്നു",
    gu: "ચેન્નાઈના હજારો ભૂખ્યા લોકોને દરરોજ ખોરાક પૂરો પાડે છે",
    pa: "ਚੇਨਈ ਦੇ ਹਜ਼ਾਰਾਂ ਭੁੱਖੇ ਲੋਕਾਂ ਨੂੰ ਰੋਜ਼ਾਨਾ ਭੋਜਨ ਕਰਵਾਉਂਦਾ ਹੈ",
    or: "ଚେନ୍ନାଇର ହଜାର ହଜାର ଭୋକିଲା ଲୋକଙ୍କୁ ପ୍ରତିଦିନ ଖାଦ୍ୟ ଯୋଗାଏ",
    ur: "چنئی کے ہزاروں بھوکے لوگوں کو روزانہ کھانا فراہم کرتا ہے",
    es: "Alimenta a miles de personas con hambre en Chennai diariamente",
    fr: "Nourrit chaque jour des milliers de personnes affamées à Chennai",
    ar: "يطعم آلاف الجياع في تشيناي يومياً",
    de: "Versorgt täglich Tausende Hungrige in Chennai mit Essen"
  },
  ngo_desc_c2: {
    en: "Supports underprivileged children with meals",
    hi: "वंचित बच्चों को भोजन सहायता प्रदान करता है",
    te: "పేద పిల్లలకు పోషకాహారాన్ని అందిస్తుంది",
    ta: "எளிய குழந்தைகளுக்கு உணவளித்து ஆதரவளிக்கிறது",
    kn: "ವಂಚಿತ ಮಕ್ಕಳಿಗೆ ಆಹಾರ ನೆರವು ನೀಡುತ್ತದೆ",
    mr: "वंचित मुलांना अन्नाची मदत पुरवते",
    bn: "সুবিধাবঞ্চিত শিশুদের খাবারের মাধ্যমে সহায়তা করে",
    ml: "അർഹരായ കുട്ടികൾക്ക് ഭക്ഷണം നൽകി സഹായിക്കുന്നു",
    gu: "વંચિત બાળકોને ભોજન સહાય પૂરી પાડે છે",
    pa: "ਲੋੜਵੰਦ ਬੱਚਿਆਂ ਨੂੰ ਭੋਜਨ ਦੀ ਸਹਾਇਤਾ ਦਿੰਦਾ ਹੈ",
    or: "ଅସହାୟ ଶିଶୁମାନଙ୍କୁ ଖାଦ୍ୟ ଯୋଗାଇ ସାହାଯ୍ୟ କରେ",
    ur: "محروم بچوں کو کھانے کی فراہمی میں مدد کرتا ہے",
    es: "Apoya a niños desfavorecidos con comidas",
    fr: "Soutient les enfants défavorisés avec des repas",
    ar: "يدعم الأطفال المحرومين بالوجبات الغذائية",
    de: "Unterstützt benachteiligte Kinder mit Mahlzeiten"
  },
  ngo_desc_c3: {
    en: "Animal rescue and care across Tamil Nadu",
    hi: "पूरे तमिलनाडु में पशु बचाव और देखभाल",
    te: "తమిళనాడు అంతటా జంతువుల రక్షణ మరియు సంరక్షణ",
    ta: "தமிழ்நாடு முழுவதும் விலங்குகள் மீட்பு மற்றும் பராமரிப்பு",
    kn: "ತಮಿಳುನಾಡಿನಾದ್ಯಂತ ಪ್ರಾಣಿಗಳ ರಕ್ಷಣೆ ಮತ್ತು ಆರೈಕೆ",
    mr: "संपूर्ण तामिळनाडूमध्ये प्राणी बचाव आणि देखभाल",
    bn: "পুরো তামিলনাড়ু জুড়ে পশু উদ্ধার ও যত্ন",
    ml: "തമിഴ്‌നാട്ടിലുടനീളം മൃഗസംരക്ഷണവും പരിചരണവും",
    gu: "સમગ્ર તમિલનાડુમાં પ્રાણી બચાવ અને સંભાળ",
    pa: "ਪੂਰੇ ਤਾਮਿਲਨਾਡੂ ਵਿੱਚ ਜਾਨਵਰਾਂ ਦੀ ਸੰਭਾਲ ਅਤੇ ਬਚਾਅ",
    or: "ସମଗ୍ର ତାମିଲନାଡୁରେ ପଶୁ ଉଦ୍ଧାର ଏବଂ ଯତ୍ନ",
    ur: "پورے تامل ناڈو میں جانوروں کا بچاؤ اور دیکھ بھال",
    es: "Rescate y cuidado de animales en Tamil Nadu",
    fr: "Sauvetage et soins des animaux dans tout le Tamil Nadu",
    ar: "إنقاذ ورعاية الحيوانات في جميع أنحاء تاميل نادو",
    de: "Tierschutz und -rettung in ganz Tamil Nadu"
  },
  ngo_desc_c4: {
    en: "Rescues and rehabilitates street animals",
    hi: "आवारा पशुओं का बचाव और पुनर्वास करता है",
    te: "వీధి జంతువులను రక్షించి പുనరావాసం కల్పిస్తుంది",
    ta: "தெரு விலங்குகளை மீட்டு மறுவாழ்வு அளிக்கிறது",
    kn: "ಬೀದಿ ಪ್ರಾಣಿಗಳನ್ನು ರಕ್ಷಿಸಿ ಪುನರ್ವಸತಿ ನೀಡುತ್ತದೆ",
    mr: "भटक्या प्राण्यांची सुटका आणि पुनर्वसन करते",
    bn: "রাস্তার পশুপাখিদের উদ্ধার ও পুনর্বাসন করে",
    ml: "തെരുവ് മൃഗങ്ങളെ സംരക്ഷിക്കുകയും പുനരധിവസിപ്പിക്കുകയും ചെയ്യുന്നു",
    gu: "શેરી પ્રાણીઓને બચાવે છે અને પુનર્વસન કરે છે",
    pa: "ਰੋਡ ਜਾਨਵਰਾਂ ਦਾ ਬਚਾਅ ਅਤੇ ਮੁੜ ਵਸੇਬਾ ਕਰਦਾ ਹੈ",
    or: "ରାସ୍ତା ପଶୁମାନଙ୍କୁ ଉଦ୍ଧାର ଏବଂ ପୁନର୍ବାସ କରେ",
    ur: "آوارہ جانوروں کو بچاتا ہے اور ان کی بحالی کرتا ہے",
    es: "Rescata y rehabilita animales callejeros",
    fr: "Sauve et réhabilite les animaux errants",
    ar: "إنقاذ وإعادة تأهيل حيوانات الشوارع",
    de: "Rettet und rehabilitiert Straßenstrays"
  },
  ngo_desc_c5: {
    en: "Community outreach for humans",
    hi: "मानव कल्याण के लिए सामुदायिक सेवा",
    te: "మానవుల కోసం సామాజిక సేవలు",
    ta: "மனிதர்களுக்கான சமூக நல உதவி",
    kn: "ಮಾನವ ಕಲ್ಯಾಣಕ್ಕಾಗಿ ಸಮುದಾಯ ಸೇವೆ",
    mr: "मानवांसाठी समुदाय सेवा",
    bn: "মানুষের জন্য সামাজিক কল্যাণ কর্মসূচি",
    ml: "മനുഷ്യർക്കായുള്ള കമ്മ്യൂണിറ്റി സേവനങ്ങൾ",
    gu: "મનુષ્યો માટે સમુદાય કલ્યાણ કાર્ય",
    pa: "ਮਨੁੱਖਾਂ ਲਈ ਸਮੁਦਾਇਕ ਸੇਵਾਵਾਂ",
    or: "ମଣିଷମାନଙ୍କ ପାଇଁ ସାମାଜିକ ସେବା",
    ur: "انسانوں کے لیے کمیونٹی کی بہتری کی خدمات",
    es: "Alcance comunitario para humanos",
    fr: "Action communautaire pour les personnes",
    ar: "التواصل المجتمعي للبشر",
    de: "Gemeinnützige Arbeit für Menschen"
  },
  ngo_desc_c6: {
    en: "Waste reduction and food redistribution",
    hi: "अपशिष्ट कमी और भोजन पुनर्वितरण",
    te: "వ్యర్థాల తగ్గింపు మరియు ఆహార పునర్వినియోగం",
    ta: "கழிவு குறைப்பு மற்றும் உணவு மறுபகிர்வு",
    kn: "ತ್ಯಾಜ್ಯ ಕಡಿತ ಮತ್ತು ಆಹಾರ ಮರುಹಂಚಿಕೆ",
    mr: "कचरा कमी करणे आणि अन्न पुनर्वाटप",
    bn: "বর্জ্য হ্রাস এবং খাদ্য পুনর্বণ্টন",
    ml: "മാലിന്യം കുറയ്ക്കലും ഭക്ഷണ വിതരണവും",
    gu: "કચરો ઘટાડવો અને ખોરાકનું પુનઃવિતરણ",
    pa: "ਬਰਬਾਦੀ ਘਟਾਉਣਾ ਅਤੇ ਭੋਜਨ ਦੀ ਮੁੜ ਵੰਡ",
    or: "ବର୍ଜ୍ୟ ହ୍ରାସ ଏବଂ ଖାଦ୍ୟ ପୁନଃବଣ୍ଟନ",
    ur: "کچرے میں کمی اور کھانے کی دوبارہ تقسیم",
    es: "Reducción de residuos y redistribución de alimentos",
    fr: "Réduction des déchets et redistribution alimentaire",
    ar: "حد من النفايات وإعادة توزيع الطعام",
    de: "Abfallreduzierung und Lebensmittelumverteilung"
  },
  ngo_desc_d2: {
    en: "Free meals for the homeless",
    hi: "बेघर लोगों के लिए मुफ्त भोजन",
    te: "నిరాశ్రయులకు ఉచిత భోజనం",
    ta: "வீடற்ற மக்களுக்கு இலவச உணவு",
    kn: "ನಿರಾಶ್ರಿತರಿಗೆ ಉಚಿತ ಊಟ",
    mr: "बेघर लोकांसाठी मोफत जेवण",
    bn: "গৃহহীন মানুষের জন্য বিনামূল্যে খাবার",
    ml: "ഭവനരഹിതർക്ക് സൗജന്യ ഭക്ഷണം",
    gu: "બેઘર લોકો માટે મફત ભોજન",
    pa: "ਬੇਘਰ ਲੋਕਾਂ ਲਈ ਮੁਫ਼ਤ ਭੋਜਨ",
    or: "ନିରାଶ୍ରୟ ଲୋକଙ୍କ ପାଇଁ ମାଗଣା ଖାଦ୍ୟ",
    ur: "بے گھر لوگوں کے لیے مفت کھانا",
    es: "Comidas gratuitas para personas sin hogar",
    fr: "Repas gratuits pour les sans-abri",
    ar: "وجبات مجانية للمشردين",
    de: "Kostenlose Mahlzeiten für Obdachlose"
  },
  ngo_desc_m1: {
    en: "Zero-waste food rescue network",
    hi: "शून्य अपशिष्ट भोजन बचाव नेटवर्क",
    te: "జీరో-వేస్ట్ ఆహార రక్షణ నెట్‌వర్క్",
    ta: "பூஜ்ஜிய கழிவு உணவு மீட்பு வலைப்பின்னல்",
    kn: "ಶೂನ್ಯ-ತ್ಯಾಜ್ಯ ಆಹಾರ ರಕ್ಷಣಾ ಜಾಲ",
    mr: "झिरो-वेस्ट अन्न बचाव नेटवर्क",
    bn: "জিরো-ওয়েস্ট খাদ্য উদ্ধার নেটওয়ার্ক",
    ml: "സീറോ-വേസ്റ്റ് ഭക്ഷണ സംരക്ഷണ ശൃംഖല",
    gu: "ઝીરો-વેસ્ટ ખોરાક બચાવ નેટવર્ક",
    pa: "ਜ਼ੀਰੋ-ਵੇਸਟ ਭੋਜਨ ਬਚਾਅ ਨੈੱਟਵਰਕ",
    or: "ଶୂନ୍ୟ-ବର୍ଜ୍ୟ ଖାଦ୍ୟ ଉଦ୍ଧାର ନେଟୱାର୍କ",
    ur: "زیرو ویسٹ فوڈ ریسکیو نیٹ ورک",
    es: "Red de rescate de alimentos cero residuos",
    fr: "Réseau de sauvetage alimentaire zéro déchet",
    ar: "شبكة إنقاذ الطعام بدون نفايات",
    de: "Zero-Waste Lebensmittelrettungs-Netzwerk"
  },

  // Food Item Translated Names
  "food_Vegetable Biryani": {
    en: "Vegetable Biryani", hi: "वेजिटेबल बिरयानी", te: "వెజిటబుల్ బిర్యానీ", ta: "வெஜிடபிள் பிரியாணி", kn: "ವೆಜಿಟೇಬಲ್ ಬಿರಿಯಾನಿ",
    mr: "व्हेज बिर्याणी", bn: "ভেজিটেবল বিরিয়ানি", ml: "വെജിറ്റബിൾ ബിരിയാണി", gu: "વેજીટેબલ બિરયાની", pa: "ਵੇਜ ਬਿਰਯਾਨੀ",
    or: "ପନିପରିବା ବିରିୟାନି", ur: "ویجیٹیبل بریانی", es: "Biryani de Verduras", fr: "Biryani de Légumes", ar: "برياني خضار", de: "Gemüse-Biryani"
  },
  "food_Fresh Bread Loaves": {
    en: "Fresh Bread Loaves", hi: "ताजा ब्रेड के पैकेट", te: "తాజా బ్రెడ్ లొవ్‌లు", ta: "புதிய ரொட்டிகள்", kn: "ತಾಜಾ ಬ್ರೆಡ್‌ಗಳು",
    mr: "ताजे ब्रेड", bn: "তাজা পাউরুটি", ml: "ഫ്രഷ് ബ്രെഡ്", gu: "તાજી બ્રેડ", pa: "ਤਾਜ਼ੀ ਬ੍ਰੈੱਡ",
    or: "ତାଜା ପାଉଁରୁଟି", ur: "تازہ بریڈ لوف", es: "Panes de molde frescos", fr: "Pains frais", ar: "أرغفة خبز طازجة", de: "Frische Brotleibe"
  },
  "food_Chicken Curry": {
    en: "Chicken Curry", hi: "चिकन करी", te: "చికెన్ కర్రీ", ta: "சிக்கன் கறி", kn: "ಚಿಕನ್ ಕರಿ",
    mr: "चिकन करी", bn: "চিকেন কারি", ml: "ചിക്കൻ കറി", gu: "ચિકન કરી", pa: "ਚਿਕਨ ਕਰੀ",
    or: "କୁକୁଡ଼ା ମାଂସ ତରକାରୀ", ur: "چکن کری", es: "Pollo al Curry", fr: "Poulet au Curry", ar: "كاري الدجاج", de: "Hähnchen-Curry"
  },
  "food_Gulab Jamun": {
    en: "Gulab Jamun", hi: "गुलाब जामुन", te: "గులాబ్ జామూన్", ta: "குலாப் ஜாமுன்", kn: "ಗುಲಾಬ್ ಜಾಮೂನ್",
    mr: "गुलाबजामुन", bn: "গোলাপ জামুন", ml: "ഗുലാബ് ജാമുൻ", gu: "ગુલાબ જાંબુ", pa: "ਗੁਲਾਬ ਜਾਮੁਨ",
    or: "ଗୁଲାବ ଜାମୁନ୍", ur: "گلاب جامن", es: "Gulab Jamun (Dulce tradicional)", fr: "Gulab Jamun", ar: "جلاب جامون", de: "Gulab Jamun (Süßspeise)"
  },

  // Food Tags
  tag_Spicy: {
    en: "Spicy", hi: "मसालेदार", te: "కారంగా", ta: "காரமான", kn: "ಖಾರವಾದ",
    mr: "मसालेदार", bn: "ঝাল", ml: "എരിവുള്ളത്", gu: "મસાલેદાર", pa: "ਮਸਾਲੇਦਾਰ",
    or: "ରାଗ", ur: "مسالہ دار", es: "Picante", fr: "Épicé", ar: "حار", de: "Würzig"
  },
  tag_Rice: {
    en: "Rice", hi: "चावल", te: "అన్నం", ta: "சாதம்", kn: "ಅನ್ನ",
    mr: "भात", bn: "ভাত", ml: "ചോറ്", gu: "ચોખા", pa: "ਚੌਲ",
    or: "ଭାତ", ur: "چاول", es: "Arroz", fr: "Riz", ar: "أرز", de: "Reis"
  },
  tag_Fresh: {
    en: "Fresh", hi: "ताज़ा", te: "తాజా", ta: "புதிய", kn: "ತಾಜಾ",
    mr: "ताजे", bn: "তাজা", ml: "ഫ്രഷ്", gu: "તાજું", pa: "ਤਾਜ਼ਾ",
    or: "ତାଜା", ur: "تازہ", es: "Fresco", fr: "Frais", ar: "طازج", de: "Frisch"
  },
  tag_Bread: {
    en: "Bread", hi: "ब्रेड", te: "బ్రెడ్", ta: "ரொட்டி", kn: "ಬ್ರೆಡ್",
    mr: "ब्रेड", bn: "পাউরুটি", ml: "ബ്രെഡ്", gu: "બ્રેડ", pa: "ਬ੍ਰੈੱਡ",
    or: "ପାଉଁରୁଟି", ur: "بریڈ", es: "Pan", fr: "Pain", ar: "خبز", de: "Brot"
  },
  tag_Vegetarian: {
    en: "Vegetarian", hi: "शाकाहारी", te: "శాకాహారం", ta: "சைவம்", kn: "ಸಸ್ಯಾಹಾರಿ",
    mr: "शाकाहारी", bn: "নিরামিষ", ml: "സസ്യാഹാരം", gu: "શાકાહારી", pa: "ਸ਼ਾਕਾਹਾਰੀ",
    or: "ଶାକାହାରୀ", ur: "سبزی خور", es: "Vegetariano", fr: "Végétarien", ar: "نباتي", de: "Vegetarisch"
  },
  tag_Curry: {
    en: "Curry", hi: "करी", te: "కర్రీ", ta: "கறி", kn: "ಕರಿ",
    mr: "करी", bn: "কারি", ml: "കറി", gu: "કરી", pa: "ਕਰੀ",
    or: "ତରକାରୀ", ur: "سالن", es: "Curry", fr: "Curry", ar: "كاري", de: "Curry"
  },

  // Confidence & Trust Ratings
  confidenceHigh: {
    en: "High Confidence", hi: "उच्च विश्वास", te: "అధిక నమ్మకం", ta: "அதிக நம்பிக்கை", kn: "ಹೆಚ್ಚಿನ ನಂಬಿಕೆ",
    mr: "उच्च विश्वास", bn: "উচ্চ আত্মবিশ্বাস", ml: "ഉയർന്ന വിശ്വാസ്യത", gu: "ઉચ્ચ વિશ્વાસ", pa: "ਉੱਚ ਭਰੋਸਾ",
    or: "ଉଚ୍ଚ ବିଶ୍ୱାସ", ur: "اعلیٰ اعتماد", es: "Confianza Alta", fr: "Confiance élevée", ar: "ثقة عالية", de: "Hohe Vertrauenswürdigkeit"
  },
  confidenceMedium: {
    en: "Medium Confidence", hi: "मध्यम विश्वास", te: "మధ్యస్థ నమ్మకం", ta: "நடுத்தர நம்பிக்கை", kn: "ಮಧ್ಯಮ ನಂಬಿಕೆ",
    mr: "मध्यम विश्वास", bn: "মাঝারি আত্মবিশ্বাস", ml: "മിതമായ വിശ്വാസ്യത", gu: "મધ્યમ વિશ્વાસ", pa: "ਮੱਧਮ ਭਰੋਸਾ",
    or: "ମଧ୍ୟମ ବିଶ୍ୱାସ", ur: "متوسط اعتماد", es: "Confianza Media", fr: "Confiance moyenne", ar: "ثقة متوسطة", de: "Mittlere Vertrauenswürdigkeit"
  },
  confidenceLow: {
    en: "Low Confidence", hi: "कम विश्वास", te: "తక్కువ నమ్మకం", ta: "குறைந்த நம்பிக்கை", kn: "ಕಡಿಮೆ ನಂಬಿಕೆ",
    mr: "कमी विश्वास", bn: "কম আত্মবিশ্বাস", ml: "കുറഞ്ഞ വിശ്വാസ്യത", gu: "ઓછો વિશ્વાસ", pa: "ਘੱਟ ਭਰੋਸਾ",
    or: "କମ୍ ବିଶ୍ୱାସ", ur: "کم اعتماد", es: "Confianza Baja", fr: "Faible confiance", ar: "ثقة منخفضة", de: "Geringe Vertrauenswürdigkeit"
  }
};

const languages = Object.keys(translations);

Object.keys(dataKeys).forEach(key => {
  languages.forEach(lang => {
    translations[lang][key] = dataKeys[key][lang] || dataKeys[key]['en'];
  });
});

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

tsCode += `};\n\n`;

tsCode += `export function translateFoodName(name: string, lang: LanguageCode): string {
  if (!name) return name;
  const dict = translations[lang] || translations.en;
  return dict[\`food_\${name}\`] || name;
}

export function translateNGOName(name: string, lang: LanguageCode): string {
  if (!name) return name;
  const dict = translations[lang] || translations.en;
  return dict[\`ngo_\${name}\`] || name;
}

export function translateNGODescription(id: string, defaultDesc: string | undefined, lang: LanguageCode): string | undefined {
  if (!defaultDesc) return undefined;
  const dict = translations[lang] || translations.en;
  return dict[\`ngo_desc_\${id}\`] || defaultDesc;
}

export function translateTag(tag: string, lang: LanguageCode): string {
  if (!tag) return tag;
  const dict = translations[lang] || translations.en;
  return dict[\`tag_\${tag}\`] || tag;
}

export function translateConfidence(confidence: string, lang: LanguageCode): string {
  if (!confidence) return confidence;
  const dict = translations[lang] || translations.en;
  const key = \`confidence\${confidence}\`;
  return dict[key] || confidence;
}
`;

fs.writeFileSync(path.join(__dirname, 'src/i18n/translations.ts'), tsCode, 'utf8');
console.log('Successfully updated translations.ts with all NGO descriptions, food names, tags, and confidence ratings!');
