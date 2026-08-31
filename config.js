// ===== إعدادات الموقع العامة =====
const CONFIG = {
  // TheSportsDB - API مجاني للمباريات (المفتاح التجريبي "123" مجاني للاستخدام)
  // يمكنك التسجيل مجاناً للحصول على مفتاح خاص: https://www.thesportsdb.com/register
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
