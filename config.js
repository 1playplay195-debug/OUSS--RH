// ===== إعدادات الموقع العامة =====
const CONFIG = {
  // TheSportsDB - API مجاني للمباريات (المفتاح التجريبي "123")
  // سجل مجاناً للحصول على مفتاح خاص: https://www.thesportsdb.com/register
  API_BASE: "https://www.thesportsdb.com/api/v1/json/123",
  SPORT: "Soccer",

  // تحديث تلقائي كل 60 ثانية
  REFRESH_INTERVAL: 60000,

  // ترتيب البطولات في الأعلى (حسب اسم البطولة في الـ API)
  TOP_LEAGUES: [
    "English Premier League",
    "Spanish La Liga",
    "Italian Serie A",
    "German Bundesliga",
    "French Ligue 1",
    "UEFA Champions League",
    "Saudi Pro League",
    "Egyptian Premier League",
    "CAF Champions League",
    "AFC Champions League"
  ],

  // الدوريات الخمسة الكبرى + دوري أبطال أوروبا (بالاسم كما يرد من الـ API)
  // Flags بصور آمنة من CDN بدلاً من إيموجي الأحرف المخفية
  BIG_LEAGUES: [
    { name: "English Premier League", ar: "الدوري الإنجليزي",   flagUrl: "https://flagcdn.com/w40/gb-eng.png" },
    { name: "Spanish La Liga",        ar: "الدوري الإسباني",     flagUrl: "https://flagcdn.com/w40/es.png" },
    { name: "Italian Serie A",        ar: "الدوري الإيطالي",     flagUrl: "https://flagcdn.com/w40/it.png" },
    { name: "German Bundesliga",      ar: "الدوري الألماني",     flagUrl: "https://flagcdn.com/w40/de.png" },
    { name: "French Ligue 1",         ar: "الدوري الفرنسي",      flagUrl: "https://flagcdn.com/w40/fr.png" },
    { name: "UEFA Champions League",  ar: "دوري أبطال أوروبا",   flagUrl: "https://flagcdn.com/w40/eu.png" }
  ],

  // تسميات عربية للبطولات الشائعة (اختياري)
  LEAGUE_NAMES_AR: {
    "English Premier League": "الدوري الإنجليزي",
    "Spanish La Liga": "الدوري الإسباني",
    "Italian Serie A": "الدوري الإيطالي",
    "German Bundesliga": "الدوري الألماني",
    "French Ligue 1": "الدوري الفرنسي",
    "UEFA Champions League": "دوري أبطال أوروبا",
    "UEFA Europa League": "الدوري الأوروبي",
    "Saudi Pro League": "دوري روشن السعودي",
    "Egyptian Premier League": "الدوري المصري",
    "Qatar Stars League": "دوري نجوم قطر",
    "Moroccan Botola Pro": "البطولة المغربية",
    "AFC Champions League": "دوري أبطال آسيا",
    "Copa Libertadores": "كأس ليبرتادوريس"
  },

  // تسميات عربية لحالات المباراة
  STATUS_AR: {
    "NS": "لم تبدأ",
    "TBD": "لم تحدد",
    "1H": "الشوط الأول",
    "2H": "الشوط الثاني",
    "HT": "بين الشوطين",
    "ET": "وقت إضافي",
    "P": "ركلات ترجيح",
    "FT": "انتهت",
    "AET": "بعد التمديد",
    "PEN": "بعد الترجيح",
    "PST": "مؤجلة",
    "CANC": "ملغاة",
    "ABD": "متوقفة",
    "SUSP": "معلقة",
    "AWD": "قطع استسلام",
    "WO": "قطع استسلام"
  },

  CACHE_KEY: "matches_last_result",
  CACHE_TTL: 1000 * 60 * 30 // 30 دقيقة صلاحية للبيانات المحفوظة
};
