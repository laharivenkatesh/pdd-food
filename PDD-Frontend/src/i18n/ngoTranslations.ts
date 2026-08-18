import { LanguageCode } from './translations';

const ngoNameMap: Record<string, Partial<Record<LanguageCode, string>>> = {
  "Akshaya Trust": {
    en: "Akshaya Trust", te: "అక్షయ ట్రస్ట్", hi: "अक्षय ट्रस्ट", ta: "அக்ஷயா டிரஸ்ட்", kn: "ಅಕ್ಷಯ ಟ್ರಸ್ಟ್", mr: "अक्षय ट्रस्ट", bn: "অক্ষয় ট্রাস্ট", ml: "അക്ഷയ ട്രസ്റ്റ്", gu: "અક્ષય ટ્રસ્ટ", pa: "ਅਕਸ਼ੈ ਟਰੱਸਟ", or: "ଅକ୍ଷୟ ଟ୍ରଷ୍ଟ", ur: "اکشے ٹرسٹ", es: "Fundación Akshaya", fr: "Fondation Akshaya", ar: "مؤسسة أكشايا", de: "Akshaya Stiftung"
  },
  "Siragu Montessori School Trust": {
    en: "Siragu Montessori School Trust", te: "సిరగు మాంటిస్సోరి స్కూల్ ట్రస్ట్", hi: "सिरगु मोंटेसरी स्कूल ट्रस्ट", ta: "சிறகு மாண்டிசோரி பள்ளி அறக்கட்டளை", kn: "ಸಿರಗು ಮಾಂಟೆಸ್ಸರಿ ಸ್ಕೂಲ್ ಟ್ರಸ್ಟ್", mr: "सिरगु मोंटेसॉरी स्कूल ट्रस्ट", bn: "সিরাগু মন্টেসরি স্কুল ট্রাস্ট", ml: "സിറഗു മോണ്ടെസ്സോറി സ്കൂൾ ട്രസ്റ്റ്", gu: "સિરગુ મોન્ટેસરી સ્કૂલ ટ્રસ્ટ", pa: "ਸਿਰਗੂ ਮੋਂਟੇਸਰੀ ਸਕੂਲ ਟਰੱਸਟ", or: "ସିରଗୁ ମୋଣ୍ଟେସରୀ ସ୍କୁଲ ଟ୍ରଷ୍ଟ", ur: "سرگو مونٹیسوری اسکول ٹرسٹ", es: "Fundación Escuela Siragu", fr: "Fondation École Siragu", ar: "مؤسسة سيراغو مونتيسوري", de: "Siragu Montessori Stiftung"
  },
  "Blue Cross of India": {
    en: "Blue Cross of India", te: "బ్లూ క్రాస్ ఆఫ్ ఇండియా", hi: "ब्लू क्रॉस ऑफ इंडिया", ta: "ப்ளூ க்ராஸ் ஆஃப் இந்தியா", kn: "ಬ್ಲೂ ಕ್ರಾಸ್ ಆಫ್ ಇಂಡಿಯಾ", mr: "ब्लू क्रॉस ऑफ इंडिया", bn: "ব্লু ক্রস অব ইন্ডিয়া", ml: "ബ്ലൂ ക്രോസ് ഓഫ് ഇന്ത്യ", gu: "બ્લુ ક્રોસ ઓફ ઇન્ડિયા", pa: "ਬਲੂ ਕਰਾਸ ਆਫ ਇੰਡੀਆ", or: "ବ୍ଲୁ କ୍ରସ ଅଫ ଇଣ୍ଡିଆ", ur: "بلیو کراس آف انڈیا", es: "Cruz Azul de India", fr: "Croix Bleue de l'Inde", ar: "الصليب الأزرق الهندي", de: "Blaues Kreuz Indien"
  },
  "Chennai Animal Action Group": {
    en: "Chennai Animal Action Group", te: "చెన్నై యానిమల్ యాక్షన్ గ్రూప్", hi: "चेन्नई एनिमल एक्शन ग्रुप", ta: "சென்னையில் விலங்குகள் நலக் குழு", kn: "ಚೆನ್ನೈ ಅನಿಮಲ್ ಆಕ್ಷನ್ ಗ್ರೂಪ್", mr: "चेन्नई ॲनिमल ॲक्शन ग्रुप", bn: "চেন্নাই অ্যানিম্যাল অ্যাকশন গ্রুপ", ml: "ചെന്നൈ അനിമൽ ആക്ഷൻ ഗ്രൂപ്പ്", gu: "ચેન્નઈ એસિમલ એક્શન ગ્રુપ", pa: "ਚੇਨਈ ਐਨੀਮਲ ਐਕਸ਼ਨ ਗਰੁੱਪ", or: "ଚେନ୍ନାଇ ଆନିମଲ ଆକ୍ସନ ଗ୍ରୁପ", ur: "چنئی اینیمل ایکشن گروپ", es: "Grupo de Acción Animal Chennai", fr: "Groupe d'Action Animale Chennai", ar: "مجموعة العمل الحيواني بفيناي", de: "Tierschutzgruppe Chennai"
  },
  "Reach India": {
    en: "Reach India", te: "రీచ్ ఇండియా", hi: "रीच इंडिया", ta: "ரீச் இந்தியா", kn: "ರೀಚ್ ಇಂಡಿಯಾ", mr: "रीच इंडिया", bn: "রিচ ইন্ডিয়া", ml: "റീച്ച് ഇന്ത്യ", gu: "રીચ ઈન્ડિયા", pa: "ਰੀਚ ਇੰਡੀਆ", or: "ରିଚ୍ ଇଣ୍ଡିଆ", ur: "ریچ انڈیا", es: "Reach India", fr: "Reach India", ar: "ريتش إنديا", de: "Reach India"
  },
  "Exnora International": {
    en: "Exnora International", te: "ఎక్స్నోరా ఇంటర్నేషనల్", hi: "एक्सनोरा इंटरनेशनल", ta: "எக்ஸ்నోரா இன்டர்நேஷனல்", kn: "ಎಕ್ಸ್‌ನೋರಾ ಇಂಟರ್ನ್ಯಾಷನಲ್", mr: "एक्सनोरा इंटरनेशनल", bn: "এক্সনোরা ইন্টারন্যাশনাল", ml: "എക്സ്നോറ ഇന്റർനാഷണൽ", gu: "એક્સનોરા ઈન્ટરનેશનલ", pa: "ਐਕਸਨੋਰਾ ਇੰਟਰਨੈਸ਼ਨਲ", or: "ଏକ୍ସନୋରା ଇଣ୍ଟରନ୍ୟାସନାଲ", ur: "ایکسنورا انٹرنیشنل", es: "Exnora Internacional", fr: "Exnora International", ar: "إكسنورا الدولية", de: "Exnora International"
  },
  "Helping Hands Foundation": {
    en: "Helping Hands Foundation", te: "హెల్పింగ్ హ్యాండ్స్ ఫౌండేషన్", hi: "हेल्पिंग हैंड्स फाउंडेशन", ta: "ஹெல்பிங் ஹேண்ட்ஸ் பவுண்டேஷன்", kn: "ಹೆಲ್ಪಿಂಗ್ ಹ್ಯಾಂಡ್ಸ್ ಫೌಂಡೇಶನ್", mr: "हेल्पिंग हँड्स फाउंडेशन", bn: "হেল্পিং হ্যান্ডস ফাউন্ডেশন", ml: "ഹെൽപ്പിംഗ് ഹാൻഡ്സ് ഫൗണ്ടേഷൻ", gu: "હેલ્પિંગ હેન્ડ્સ ફાઉન્ડેશન", pa: "ਹੈਲਪਿੰਗ ਹੈਂਡਜ਼ ਫਾਊਂਡੇਸ਼ਨ", or: "ହେଲ୍ପିଂ ହ୍ୟାଣ୍ଡସ ଫାଉଣ୍ଡେସନ", ur: "ہیلپنگ ہینڈز فاؤنڈیشن", es: "Fundación Manos Amigas", fr: "Mains Tendues Fondation", ar: "مؤسسة الأيادي المساعدة", de: "Helfende Hände Stiftung"
  },
  "Paws Rescue": {
    en: "Paws Rescue", te: "పాస్ రెస్క్యూ", hi: "पॉज रेस्क्यू", ta: "பாஸ் ரெஸ்கியூ", kn: "ಪಾಸ್ రెಸ್ಕ್ಯೂ", mr: "पॉज रेस्क्यू", bn: "পজ রেসকিউ", ml: "പോസ് റെസ്ക്യൂ", gu: "પોઝ રેસ્ક્યુ", pa: "ਪਾਜ਼ ਰੈਸਕਿਊ", or: "ପଜ୍ ରେସକ୍ୟୁ", ur: "پاز ریسکیو", es: "Rescate Paws", fr: "Sauvetage Paws", ar: "إنقاذ الكفوف", de: "Paws Tierrettung"
  },
  "City Food Bank": {
    en: "City Food Bank", te: "సిటీ ఫుడ్ బ్యాంక్", hi: "सिटी फूड बैंक", ta: "சிட்டி ஃபுட் பேங்க்", kn: "ಸಿಟಿ ಫುಡ್ ಬ್ಯಾಂಕ್", mr: "सिटी फूड बँक", bn: "সিটি ফুড ব্যাংক", ml: "സിറ്റി ഫുഡ് ബാങ്ക്", gu: "સિટી ફૂડ બેંક", pa: "ਸਿਟੀ ਫੂਡ ਬੈਂਕ", or: "ସିଟି ଫୁଡ୍ ବ୍ୟାଙ୍କ", ur: "سٹی فوڈ بینک", es: "Banco de Alimentos Ciudad", fr: "Banque Alimentaire Ville", ar: "بنك الطعام للمدينة", de: "Stadt Lebensmittelbank"
  },
  "Delhi Animal Shelter": {
    en: "Delhi Animal Shelter", te: "ఢిల్లీ యానిమల్ షెల్టర్", hi: "दिल्ली एनिमल शेल्टर", ta: "டெல்லி அனிமல் ஷெல்டர்", kn: "ದೆಹಲಿ ಅನಿಮಲ್ ಶೆಲ್ಟರ್", mr: "दिल्ली ॲनिमल शेल्टर", bn: "দিল্লি অ্যানিম্যাল শেল্টার", ml: "ഡൽഹി അനിമൽ ഷെൽട്ടർ", gu: "દિલ્હી એનિમલ શેલ્ટર", pa: "ਦਿੱਲੀ ਐਨੀਮਲ ਸ਼ੈਲਟਰ", or: "ଦିଲ୍ଲୀ ଆନିମଲ ଶେଲଟର", ur: "دہلی اینیمل شیلٹر", es: "Refugio de Animales Delhi", fr: "Refuge Animalier Delhi", ar: "ملجأ الحيوانات دلهي", de: "Tierheim Delhi"
  },
  "The Robin Hood Army": {
    en: "The Robin Hood Army", te: "ది రాబిన్ హుడ్ ఆర్మీ", hi: "द रॉबिन हुड आर्मी", ta: "தி ராபின் ஹூட் ஆர்மி", kn: "ದಿ ರಾబిನ್ ಹುಡ್ ಆರ್ಮಿ", mr: "द रॉबिन हूड आर्मी", bn: "দ্য রবিন হুড আর্মি", ml: "ദി റോബിൻ ഹുഡ് ആർമി", gu: "ધી રોબિન હૂડ આર્મી", pa: "ਦ ਰੋਬਿਨ ਹੁੱਡ ਆਰਮੀ", or: "ଦି ରବିନ୍ ଫୁଡ୍ ଆର୍ମି", ur: "دی رابن ہوڈ آرمی", es: "Ejército Robin Hood", fr: "Armée Robin des Bois", ar: "جيش روبن هود", de: "Robin Hood Armee"
  },
  "Roti Bank Delhi": {
    en: "Roti Bank Delhi", te: "రోటీ బ్యాంక్ ఢిల్లీ", hi: "रोटी बैंक दिल्ली", ta: "రోటీ பேங்க் டெல்லி", kn: "ರೊಟ್ಟಿ ಬ್ಯಾಂಕ್ ದೆಹಲಿ", mr: "रोटी बँक दिल्ली", bn: "রুটি ব্যাংক দিল্লি", ml: "റൊട്ടി ബാങ്ക് ഡൽഹി", gu: "રોટી બેંક દિલ્હી", pa: "ਰੋਟੀ ਬੈਂਕ ਦਿੱਲੀ", or: "ରୋଟି ବ୍ୟାଙ୍କ ଦିଲ୍ଲୀ", ur: "روٹی بینک دہلی", es: "Banco de Alimentos Delhi", fr: "Banque Alimentaire Delhi", ar: "بنك الخبز دلهي", de: "Roti Bank Delhi"
  },
  "Welfare of Stray Dogs": {
    en: "Welfare of Stray Dogs", te: "వెల్ఫేర్ ఆఫ్ స్ట్రే డాగ్స్", hi: "वेलफेयर ऑफ स्ट्रे डॉग्स", ta: "வெல்ஃபேர் ஆஃப் ஸ்ட்ரே டாக்ஸ்", kn: "ವೆಲ್ಫೇರ್ ಆಫ್ ಸ್ಟ್ರೇ ಡಾಗ್ಸ್", mr: "वेलफेअर ऑफ स्ट्रे डॉग्स", bn: "ওয়েলফেয়ার অব স্ট্রে ডগস", ml: "വെൽഫെയർ ഓഫ് സ്ട്രേ ഡോഗ്സ്", gu: "વેલફેર ઓફ સ્ટ્રે ડોગ્સ", pa: "ਵੈਲਫੇਅਰ ਆਫ ਸਟ੍ਰੇ ਡੌਗਸ", or: "ୱେଲଫେୟାର ଅଫ ଷ୍ଟ୍ରେ ଡଗସ", ur: "ویلفیئر آف سٹرے ڈاگس", es: "Bienestar de Perros Callejeros", fr: "Bien-être des Chiens Errants", ar: "رعاية الكلاب الضالة", de: "Schutz für Streunerhunde"
  },
  "Hope Foundation Kolkata": {
    en: "Hope Foundation Kolkata", te: "హోప్ ఫౌండేషన్ కోల్‌కతా", hi: "होप फाउंडेशन कोलकाता", ta: "ஹோப் பவுண்டேஷன் கொல்கத்தா", kn: "<ctrl42>ੋਪ ಫೌಂಡೇಶನ್ ಕೋಲ್ಕತ್ತಾ", mr: "होप फाउंडेशन कोलकाता", bn: "হোপ ফাউন্ডেশন কলকাতা", ml: "ഹോപ്പ് ഫൗണ്ടേഷൻ കൊൽക്കത്ത", gu: "હોપ ફાઉન્ડેશન કોલકાતા", pa: "ਹੋਪ ਫਾਊਂਡੇਸ਼ਨ ਕੋਲਕਾਤਾ", or: "ହୋପ ଫାଉଣ୍ଡେସନ କୋଲକାତା", ur: "ہوپ فاؤنڈیشن کولکتہ", es: "Fundación Esperanza Kolkata", fr: "Fondation Espoir Kolkata", ar: "مؤسسة الأمل كولكاتا", de: "Hoffnung Stiftung Kolkata"
  },
  "Sarv Seva Samithi": {
    en: "Sarv Seva Samithi", te: "సర్వ సేవా సమితి", hi: "सर्व सेवा समिति", ta: "சர்வ சேவா சமிதி", kn: "ಸರ್ವ ಸೇವಾ ಸಮಿತಿ", mr: "सर्व सेवा समिती", bn: "সর্ব সেবা সমিতি", ml: "സർവ സേവാ സമിതി", gu: "સર્વ સેવા સમિતિ", pa: "ਸਰਵ ਸੇਵਾ ਸਮਿਤੀ", or: "ସର୍ବ ସେବା ସମିତି", ur: "سرو سیوا سمیتی", es: "Comité de Servicio Universal", fr: "Comité de Service Universel", ar: "جمعية خدمة الجميع", de: "Universal Service Komitee"
  }
};

const ngoDescMap: Record<string, Partial<Record<LanguageCode, string>>> = {
  "Feeds thousands of Chennai's hungry daily": {
    en: "Feeds thousands of Chennai's hungry daily", te: "చెన్నైలోని వేలాది మంది ఆకలి తీరుస్తుంది", hi: "चेन्नई में रोज़ाना हज़ारों भूखों को भोजन कराता है", ta: "சென்னையில் தினமும் ஆயிரக்கணக்கான பசியுள்ளவர்களுக்கு உணவளிக்கிறது", kn: "ಚೆನ್ನೈನ ಸಾವಿರಾರು ಹಸಿವಿನಿಂದ ಬಳಲುತ್ತಿರುವವರಿಗೆ ದಿನನಿತ್ಯ ಆಹಾರ ನೀಡುತ್ತದೆ"
  },
  "Supports underprivileged children with meals": {
    en: "Supports underprivileged children with meals", te: "పేద పిల్లలకు ఉచిత భోజనం అందిస్తుంది", hi: "वंचित बच्चों को भोजन सहायता प्रदान करता है", ta: "ஏழை குழந்தைகளுக்கு உணவு வழங்கி ஆதரவளிக்கிறது", kn: "ಬಡ ಮಕ್ಕಳಿಗೆ ಊಟದ ನೆರವು ನೀಡುತ್ತದೆ"
  },
  "Animal rescue and care across Tamil Nadu": {
    en: "Animal rescue and care across Tamil Nadu", te: "తమిళనాడు వ్యాప్తంగా జంతువుల రక్షణ మరియు సంరక్షణ", hi: "तमिलनाडु भर में पशु बचाव और देखभाल", ta: "தமிழ்நாடு முழுவதும் விலங்குகள் மீட்பு மற்றும் பராமரிப்பு", kn: "ತಮಿಳುನಾಡಿನಾದ್ಯಂತ ಪ್ರಾಣಿಗಳ ರಕ್ಷಣೆ ಮತ್ತು ಆರೈಕೆ"
  },
  "Rescues and rehabilitates street animals": {
    en: "Rescues and rehabilitates street animals", te: "వీధి జంతువుల రక్షణ మరియు పునరావాసం", hi: "सड़क के जानवरों का बचाव और पुनर्वास", ta: "தெரு விலங்குகளை மீட்டு புனரமைக்கிறது", kn: "ಬೀದಿ ಪ್ರಾಣಿಗಳ ರಕ್ಷಣೆ ಮತ್ತು ಪುನರ್ವಸತಿ"
  },
  "Community outreach for humans": {
    en: "Community outreach for humans", te: "మానవుల కోసం సమాజ సేవా కార్యక్రమాలు", hi: "मानव सहायता और सामुदायिक सेवा", ta: "மனிதர்களுக்கான சமூக நலப் பணிகள்", kn: "ಮಾನವ ಕಲ್ಯಾಣಕ್ಕಾಗಿ ಸಮುದಾಯ ಸೇವೆ"
  },
  "Waste reduction and food redistribution": {
    en: "Waste reduction and food redistribution", te: "ఆహార వృథా నివారణ మరియు పునఃపంపకం", hi: "कचरा घटाना और भोजन का पुनः वितरण", ta: "கழிவு குறைப்பு மற்றும் உணவு மறுபகிர்வு", kn: "ಆಹಾರ ತ್ಯಾಜ್ಯ ತಡೆ మరియు మరుహಂಚಿಕೆ"
  },
  "Free meals for the homeless": {
    en: "Free meals for the homeless", te: "నిరాశ్రయులకు ఉచిత ఆహార పంపిణీ", hi: "बेघर लोगों के लिए मुफ्त भोजन", ta: "வீடற்றவர்களுக்கு இலவச உணவு", kn: "ನಿರಾಶ್ರಿತರಿಗೆ ಉಚಿತ ಊಟ"
  },
  "Zero-waste food rescue network": {
    en: "Zero-waste food rescue network", te: "ఆహార వృథా నివారణ నెట్‌వర్క్", hi: "जीरो-वेस्ट भोजन बचाव नेटवर्क", ta: "உணவு வீணாவதைத் தடுக்கும் அமைப்பு", kn: "ಆಹಾರ ತ್ಯಾಜ್ಯ ತಡೆ ಜಾಲ"
  }
};

const ngoAddressMap: Record<string, Partial<Record<LanguageCode, string>>> = {
  "Besant Nagar, Chennai": { en: "Besant Nagar, Chennai", te: "బెసెంట్ నగర్, చెన్నై", hi: "बेसेंट नगर, चेन्नई", ta: "பெசன்ட் நகர், சென்னை", kn: "ಬೆಸೆಂಟ್ ನಗರ, ಚೆನ್ನೈ" },
  "Kodambakkam, Chennai": { en: "Kodambakkam, Chennai", te: "కోడంబాక్కం, చెన్నై", hi: "कोडमबाक्कम, चेन्नई", ta: "கோடம்பாக்கம், சென்னை", kn: "ಕೊಡಂಬಾಕ್ಕಂ, ಚೆನ್ನೈ" },
  "Guindy, Chennai": { en: "Guindy, Chennai", te: "గిండి, చెన్నై", hi: "गिंडी, चेन्नई", ta: "கிண்டி, சென்னை", kn: "ಗಿಂಡಿ, ಚೆನ್ನೈ" },
  "Anna Nagar, Chennai": { en: "Anna Nagar, Chennai", te: "అన్నా నగర్, చెన్నై", hi: "अन्ना नगर, चेन्नई", ta: "அண்ணா நகர், சென்னை", kn: "ಅಣ್ಣಾ ನಗರ, ಚೆನ್ನೈ" },
  "T. Nagar, Chennai": { en: "T. Nagar, Chennai", te: "టీ. నగర్, చెన్నై", hi: "टी. नगर, चेन्नई", ta: "தி. நகர், சென்னை", kn: "ಟಿ. ನಗರ, ಚೆನ್ನೈ" },
  "Nungambakkam, Chennai": { en: "Nungambakkam, Chennai", te: "నుంగంబాక్కం, చెన్నై", hi: "नुंगमबक्कम, चेन्नई", ta: "நுங்கம்பாக்கம், சென்னை", kn: "ನುಂಗಂಬಾಕ್ಕಂ, ಚೆನ್ನೈ" },
  "Koramangala, Bangalore": { en: "Koramangala, Bangalore", te: "కోరమంగళ, బెంగళూరు", hi: "कोरमंगला, बैंगलोर", ta: "கோரமங்களா, பெங்களூரு", kn: "ಕೋರಮಂಗಲ, ಬೆಂಗಳೂರು" },
  "Indiranagar, Bangalore": { en: "Indiranagar, Bangalore", te: "ఇందిరానగర్, బెంగళూరు", hi: "इंदिरानगर, बैंगलोर", ta: "இந்திராநகர், பெங்களூரு", kn: "ಇಂದಿರಾನಗರ, ಬೆಂಗಳೂರು" },
  "Jayanagar, Bangalore": { en: "Jayanagar, Bangalore", te: "జయనగర్, బెంగళూరు", hi: "जयनगर, बैंगलोर", ta: "ஜெயநகர், பெங்களூரு", kn: "ಜಯನಗರ, ಬೆಂಗಳೂರು" },
  "Hauz Khas, New Delhi": { en: "Hauz Khas, New Delhi", te: "హౌజ్ ఖాస్, న్యూఢిల్లీ", hi: "हौज खास, नई दिल्ली", ta: "ஹவுஸ் காஸ், புது டெல்லி", kn: "ಹೌಜ್ ಖಾಸ್, ನವದೆಹಲಿ" },
  "Connaught Place, New Delhi": { en: "Connaught Place, New Delhi", te: "కన్నాట్ ప్లేస్, న్యూఢిల్లీ", hi: "कनॉट प्लेस, नई दिल्ली", ta: "கனாட் பிளேஸ், புது டெல்லி", kn: "ಕಾನ್ನಾಟ್ ಪ್ಲೇಸ್, ನವದೆಹಲಿ" },
  "Bandra, Mumbai": { en: "Bandra, Mumbai", te: "బాంద్రా, ముంబై", hi: "बांद्रा, मुंबई", ta: "பாந்த்ரா, மும்பை", kn: "ಬಾಂದ್ರಾ, ಮುಂಬೈ" },
  "Matunga, Mumbai": { en: "Matunga, Mumbai", te: "మాటుంగా, ముంబై", hi: "माटुंगा, मुंबई", ta: "மாதுங்கா, மும்பை", kn: "ಮಾಟುಂಗಾ, ಮುಂಬೈ" },
  "Salt Lake, Kolkata": { en: "Salt Lake, Kolkata", te: "సాల్ట్ లేక్, కోల్‌కతా", hi: "साल्ट लेक, कोलकाता", ta: "சால்ட் லேக், கொல்கத்தா", kn: "ಸಾಲ್ಟ್ ಲೇಕ್, ಕೋಲ್ಕತ್ತಾ" },
  "Secunderabad, Hyderabad": { en: "Secunderabad, Hyderabad", te: "సికింద్రాబాద్, హైదరాబాద్", hi: "सिकंदराबाद, हैदराबाद", ta: "செகந்திராபாத், ஹைதராபாத்", kn: "సికింద్రాబాద్, సికింద్రాబాద్" }
};

export function translateNGOName(name: string, lang: LanguageCode): string {
  if (!name) return name;
  const key = name.trim();
  if (ngoNameMap[key] && ngoNameMap[key][lang]) {
    return ngoNameMap[key][lang]!;
  }
  return name;
}

export function translateNGODescription(desc: string | undefined, lang: LanguageCode): string | undefined {
  if (!desc) return desc;
  const key = desc.trim();
  if (ngoDescMap[key] && ngoDescMap[key][lang]) {
    return ngoDescMap[key][lang]!;
  }
  return desc;
}

export function translateNGOAddress(address: string, lang: LanguageCode): string {
  if (!address) return address;
  const key = address.trim();
  if (ngoAddressMap[key] && ngoAddressMap[key][lang]) {
    return ngoAddressMap[key][lang]!;
  }
  return address;
}
