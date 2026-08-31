/* ===== حالة التطبيق ===== */
const state = {
  dateOffset: 0,          // -1 أمس / 0 اليوم / 1 غداً
  selectedDate: null,     // تاريخ مخصص من منتقي التاريخ
  filter: "all",
  matches: [],
  timer: null,
  clockTimer: null
};

const $ = (sel) => document.querySelector(sel);
const matchesEl   = $("#matches");
const loadingEl   = $("#loading");
const errorEl     = $("#error");
const emptyEl     = $("#empty");
const lastUpdateEl = $("#lastUpdate");

/* ===== أدوات مساعدة ===== */
function pad(n) { return String(n).padStart(2, "0"); }

function apiDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function currentDate() {
  if (state.selectedDate) return state.selectedDate;
  const d = new Date();
  d.setDate(d.getDate() + state.dateOffset);
  return d;
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "--:--";
  let h = d.getHours();
  const m = pad(d.getMinutes());
  const period = h >= 12 ? "م" : "ص";
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

// وقت نسبي مثل: "بعد ساعة و27 دقيقة" / "قبل 20 دقيقة"
function relativeTime(dateStr) {
  const diff = new Date(dateStr) - new Date();
  const abs = Math.abs(diff);
  const mins = Math.round(abs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  const parts = [];
  if (days) parts.push(`${days} يوم`);
  else if (hours) parts.push(`${hours} ساعة`);
  if (mins % 60 && !days && hours < 10) parts.push(`${mins % 60} دقيقة`);
  const text = parts.join(" و") || "أقل من دقيقة";

  return diff >= 0 ? `بعد ${text}` : `قبل ${text}`;
}

function isLive(status) {
  return ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(status);
}

function matchGroup(match) {
  if (isLive(match.status)) return "live";
  if (["FT", "AET", "PEN", "AWD", "WO"].includes(match.status)) return "finished";
  if (match.status === "NS" || !match.status) return "upcoming";
  return "other";
}

/* ===== جلب البيانات ===== */
async function fetchMatches() {
  const d = apiDate(currentDate());
  const url = `${CONFIG.API_BASE}/eventsday.php?d=${d}&s=${CONFIG.SPORT}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const events = (data.events || []).map(mapEvent);

    state.matches = sortMatches(events);
    localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify({
      ts: Date.now(), date: d, matches: state.matches
    }));
    errorEl.hidden = true;
reg`  } catch (err) {
    console.warn("تعذر الجلب من الـ API:", err);
    loadFromCache(d);
  }

  render();
  const now = new Date();
  lastUpdate.textContent = `آخر تحديث: ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function mapEvent(e) {
  return {
    id: e.idEvent,
    league: e.strLeague || "مباريات",
    leagueBadge: e.strLeagueBadge || "",
    home: e.strHomeTeam || "—",
    away: e.strAwayTeam || "—",
    homeBadge: e.strHomeTeamBadge || e.strHomeTeamBadge || "",
    awayBadge: e.strAwayTeamBadge || "",
    homeScore: e.intHomeScore,
    awayScore: e.intAwayScore,
    status: (e.strStatus || "NS").toUpperCase(),
    time: e.strTime || e.dateEvent + "T00:00:00",
    dateEvent: e.dateEvent,
    timestamp: e.strTimestamp ? new Date(e.strTimestamp).getTime() : null
  };
}

function sortMatches(list) {
  const leagueRank = (name) => {
    const i = CONFIG.TOP_LEAGUES.indexOf(name);
    return i === -1 ? CONFIG.TOP_LEAGUES.length : i;
  };
  return list.sort((a, b) => {
    const la = leagueRank(a.league), lb = leagueRank(b.league);
    if (la !== lb) return la - lb;
    return (a.timestamp || 0) - (b.timestamp || 0);
  });
}

function loadFromCache(dateStr) {
  try {
    const cached = JSON.parse(localStorage.getItem(CONFIG.CACHE_KEY));
    if (cached && cached.date === dateStr) {
      state.matches = cached.matches;
      errorEl.hidden = true;
    } else if (cached && Date.now() - cached.ts < CONFIG.CACHE_TTL) {
      state.matches = cached.matches;
      errorEl.hidden = false;
    } else {
      state.matches = [];
      errorEl.hidden = false;
    }
  } catch {
    state.matches = [];
    errorEl.hidden = false;
  }
}

/* ===== العرض ===== */
function render() {
  loadingEl.hidden = true;

  let list = state.matches;
  if (state.filter !== "all") list = list.filter(m => matchGroup(m) === state.filter);

  emptyEl.hidden = list.length > 0;
  matchesEl.innerHTML = "";

  if (state.filter === "all") {
    const groups = {};
    list.forEach(m => (groups[m.league] = groups[m.league] || []).push(m));
    const names = Object.keys(groups).sort((a, b) =>
      CONFIG.TOP_LEAGUES.indexOf(a) - CONFIG.TOP_LEAGUES.indexOf(b));

    for (const league of names) {
      const badge = groups[league][0].leagueBadge;
      const section = document.createElement("div");
      section.className = "league-card";
      section.innerHTML = `
        <div class="league-header">
          ${badge ? `<img src="${badge}" alt="" loading="lazy" onerror="this.style.display='none'">` : "🏆"}
          <h2>${CONFIG.LEAGUE_NAMES_AR[league] || league}</h2>
          <span class="count">${groups[league].length} مباريات</span>
        </div>
        <div class="league-matches"></div>`;
      const box = section.querySelector(".league-matches");
      groups[league].forEach(m => box.appendChild(matchCard(m)));
      matchesEl.appendChild(section);
    }
  } else {
    list.forEach(m => matchesEl.appendChild(matchCard(m)));
  }
}

function teamLogo(url, name) {
  const initial = name.trim().charAt(0);
  return url
    ? `<img src="${url}" alt="${name}" loading="lazy" onerror="this.outerHTML='<span class=&quot;team-fallback&quot;>${initial}</span>'">`
    : `<span class="team-fallback">${initial}</span>`;
}

function matchCard(m) {
  const el = document.createElement("article");
  el.className = `match-card group-${matchGroup(m)}`;

  let centerHTML;
  if (matchGroup(m) === "upcoming") {
    el.dataset.ts = m.timestamp || "";
    el.classList.add("upcoming");
    el.innerHTML = `
      <div class="teams">
        <div class="team">${teamLogo(m.homeBadge, m.home)}<span>${m.home}</span></div>
        <div class="center">
          <div class="time">${formatTime(currentDate() + "T" + (m.time || "00:00:00"))}</div>
          <div class="reltime" data-ts="${m.timestamp || ""}">${m.timestamp ? relativeTime(new Date(m.timestamp).toISOString()) : ""}</div>
        </div>
        <div class="team away">${teamLogo(m.awayBadge, m.away)}<span>${m.away}</span></div>
      </div>`;
    return el;
  }

  const live = isLive(m.status);
  const label = CONFIG.STATUS_AR[m.status] || m.status;
  el.innerHTML = `
    <div class="teams">
      <div class="team">${teamLogo(m.homeBadge, m.home)}<span>${m.home}</span></div>
      <div class="center">
        <div class="score ${live ? "live" : ""}">${m.homeScore ?? "-"} : ${m.awayScore ?? "-"}</div>
        <div class="status ${live ? "live" : ""}">${live ? '<span class="live-dot"></span>' : ""}${label}</div>
      </div>
      <div class="team away">${teamLogo(m.awayBadge, m.away)}<span>${m.away}</span></div>
    </div>`;
  return el;
}

// تحديث الأوقات النسبية كل دقيقة
function tickRelativeTimes() {
  document.querySelectorAll(".reltime[data-ts]").forEach(el => {
    const ts = Number(el.dataset.ts);
    if (ts) el.textContent = relativeTime(new Date(ts).toISOString());
  });
}

/* ===== الأحداث ===== */
document.querySelectorAll(".date-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".date-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.dateOffset = Number(btn.dataset.day);
    state.selectedDate = null;
    $("#datePicker").value = "";
    load();
  });
});

$("#datePicker").addEventListener("change", (e) => {
  if (!e.target.value) return;
  state.selectedDate = new Date(e.target.value + "T12:00:00");
  document.querySelectorAll(".date-btn").forEach(b => b.classList.remove("active"));
  load();
});

document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.filter = btn.dataset.filter;
    render();
  });
});

$("#retryBtn")?.addEventListener("click", load);

function load() {
  loadingEl.hidden = false;
  matchesEl.innerHTML = "";
  fetchMatches();
}

/* ===== زر تثبيت التطبيق (PWA) ===== */
let deferredPrompt = null;
const installBtn = $("#installBtn");
const installIosBtn = $("#installIosBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.hidden = false;
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});

// iOS Safari لا يدعم beforeinstallprompt — نعرض تعليمات يدوية
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
if (isIOS && !window.navigator.standalone) {
  installIosBtn.hidden = false;
  installIosBtn.addEventListener("click", () => {
    alert("لإضافة التطبيق على الآيفون:\n1. اضغط زر المشاركة في سفلي المتصفح\n2. اختر «إضافة إلى الشاشة الرئيسية»");
  });
}

// إخفاء الزر إذا كان التطبيق مثبتاً بالفعل
window.addEventListener("appinstalled", () => {
  installBtn.hidden = true;
  if (window.matchMedia("(display-mode: standalone)").matches) installBtn.hidden = true;
});

/* ===== التشغيل ===== */
load();
state.timer = setInterval(load, CONFIG.REFRESH_INTERVAL);
state.clockTimer = setInterval(tickRelativeTimes, 60000);
