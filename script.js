"use strict";

const imagePath = (fileName) => `Images/${fileName}`;
const scoresPath = "scores.csv";
const MAX_VISIBLE_TILE_TOKENS = 7;

const boardSpaceData = [
  { name: "START", points: 0, type: "corner", image: "Start.png" },
  { name: "Lobby", points: 5, image: "lobby.jpg" },
  { name: "Marina", points: 10, image: "Marina.jpg" },
  { name: "AVIVA", points: 15, image: "Aviva-yacht-RR-6.jpeg" },
  { name: "Fitness Center", points: 20, image: "Fitness Center.jpg" },
  { name: "Ballroom", points: 25, image: "Ballroom.jpg" },
  { name: "Azul", points: 30, image: "Azul.jpg" },
  { name: "Indigo", points: 35, image: "indigo.jpg" },
  { name: "Resort Pool", points: 40, image: "Resort Pool.jpg" },
  { name: "The Club", points: 45, type: "corner", image: "The Club.jpg" },
  { name: "Presidential Suite", points: 50, image: "Presidential Suite.jpg" },
  { name: "Kids Club", points: 55, image: "Kids Club.jpg" },
  { name: "Snow Room", points: 60, image: "Snow Room.jpg" },
  { name: "Pier Top", points: 65, image: "Pier Top.jpg" },
  { name: "Guest Room", points: 70, image: "Guest Room.jpg" },
  { name: "Valet Arrival", points: 75, image: "Valet Arrival.jpg" },
  { name: "Elate Cafe", points: 80, image: "Elate Cafe.jpg" },
  { name: "Villas", points: 85, image: "Villas.jpg" },
  { name: "Spa Pool", points: 90, image: "Spa Pool.jpg" },
  { name: "Waterslides", points: 95, type: "corner", image: "Waterslides.jpg" },
];

const boardSpaces = boardSpaceData.map((space, index) => ({
  ...space,
  id: index,
  imageUrl: space.image ? imagePath(space.image) : null,
}));

const spireLevels = [110, 108, 106, 104, 102, 100];

const forecastingDepartmentIds = new Set([
  "elate",
  "calusso",
  "nectar",
  "ird",
  "garni",
  "spa",
  "pier-top",
  "pool",
  "reservations",
  "saltbreeze",
  "sotogrande",
  "windows",
]);

const nonForecastingDepartmentIds = new Set([
  "saltbreeze-boh",
  "housekeeping",
  "engineering",
  "windows-ird-boh",
  "security",
  "guest-services",
  "bell-service",
  "sotogrande-boh",
  "pastry",
  "pier-top-boh",
  "garni-boh",
  "calusso-boh",
  "stewarding",
  "banquets-boh",
  "front-office",
  "banquets-foh",
]);

function getDepartmentGroup(departmentId) {
  if (forecastingDepartmentIds.has(departmentId)) return "forecasting";
  if (nonForecastingDepartmentIds.has(departmentId)) return "nonforecasting";
  return "other";
}

function getDepartmentGroupLabel(group) {
  if (group === "forecasting") return "Forecasting Departments";
  if (group === "nonforecasting") return "Non-Forecasting Departments";
  return "Other Departments";
}

const departmentBank = [
  { id: "elate", name: "Elate", color: "bg-amber-600" },
  { id: "nectar", name: "Nectar", color: "bg-lime-600" },
  { id: "pier-top", name: "Pier Top", color: "bg-sky-700" },
  { id: "pool", name: "Pool", color: "bg-cyan-500" },
  { id: "spa", name: "Spa", color: "bg-teal-500" },
  { id: "windows", name: "Windows", color: "bg-sky-500" },
  { id: "calusso", name: "Calusso", color: "bg-orange-700" },
  { id: "reservations", name: "Reservations", color: "bg-indigo-600" },
  { id: "ird", name: "IRD", color: "bg-purple-600" },
  { id: "garni", name: "Garni", color: "bg-rose-500" },
  { id: "sotogrande", name: "Sotogrande", color: "bg-emerald-700" },
  { id: "saltbreeze", name: "Saltbreeze", color: "bg-blue-600" },
  { id: "saltbreeze-boh", name: "Saltbreeze BOH", color: "bg-blue-800" },
  { id: "windows-ird-boh", name: "Windows/IRD BOH", color: "bg-violet-700" },
  { id: "security", name: "Security", color: "bg-slate-700" },
  { id: "guest-services", name: "Guest Services", color: "bg-cyan-700" },
  { id: "bell-service", name: "Bell Service", color: "bg-yellow-700" },
  { id: "pastry", name: "Pastry", color: "bg-pink-500" },
  { id: "stewarding", name: "Stewarding", color: "bg-stone-600" },
  { id: "housekeeping", name: "Housekeeping", color: "bg-green-600" },
  { id: "engineering", name: "Engineering", color: "bg-orange-600" },
  { id: "front-office", name: "Front Office", color: "bg-sky-500" },
  { id: "banquets-foh", name: "Banquets FOH", color: "bg-fuchsia-600" },
  { id: "sotogrande-boh", name: "Sotogrande BOH", color: "bg-emerald-900" },
  { id: "banquets-boh", name: "Banquets BOH", color: "bg-fuchsia-800" },
  { id: "pier-top-boh", name: "Pier Top BOH", color: "bg-sky-900" },
  { id: "garni-boh", name: "Garni BOH", color: "bg-rose-700" },
  { id: "calusso-boh", name: "Calusso BOH", color: "bg-orange-900" },
];

const dynamicDepartmentColors = [
  "bg-amber-600", "bg-lime-600", "bg-sky-700", "bg-cyan-500", "bg-teal-500", "bg-orange-700",
  "bg-indigo-600", "bg-purple-600", "bg-rose-500", "bg-emerald-700", "bg-blue-600", "bg-violet-700",
  "bg-slate-700", "bg-yellow-700", "bg-pink-500", "bg-stone-600", "bg-green-600", "bg-fuchsia-600"
];

function formatDepartmentNameFromId(departmentId) {
  return String(departmentId || "")
    .replace(/-/g, " ")
    .replace(/\bboh\b/gi, "BOH")
    .replace(/\bird\b/gi, "IRD")
    .replace(/\bfoh\b/gi, "FOH")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bBoh\b/g, "BOH")
    .replace(/\bIrd\b/g, "IRD")
    .replace(/\bFoh\b/g, "FOH");
}

function getDynamicDepartmentColor(departmentId) {
  const code = String(departmentId || "").split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return dynamicDepartmentColors[code % dynamicDepartmentColors.length];
}

function inferDepartmentGroup(departmentId, row) {
  const id = String(departmentId || "").toLowerCase();
  if (forecastingDepartmentIds.has(id)) return "forecasting";
  if (nonForecastingDepartmentIds.has(id)) return "nonforecasting";
  if (id.includes("boh")) return "nonforecasting";

  const maxWeeklyScore = row && Array.isArray(row.weekScores)
    ? Math.max(...row.weekScores.map((score) => Number(score || 0)))
    : 0;
  const activeWeeks = Math.max(Number(contestContext.weeksCompleted || 0), Number(contestContext.latestWeekNumber || 0));
  const currentAverage = row && activeWeeks > 0 ? Number(row.totalScore || 0) / activeWeeks : 0;

  if (maxWeeklyScore > 105 || currentAverage > 105) return "forecasting";
  return "forecasting";
}

function getAllDepartmentDefinitionsFromCSV(scoreMap) {
  const departmentMap = new Map(departmentBank.map((department) => [department.id, { ...department }]));

  scoreMap.forEach((unusedScore, departmentId) => {
    if (!departmentMap.has(departmentId)) {
      departmentMap.set(departmentId, {
        id: departmentId,
        name: formatDepartmentNameFromId(departmentId),
        color: getDynamicDepartmentColor(departmentId),
        dynamic: true,
      });
    }

    const row = extendedScoreRows.get(departmentId);
    const inferredGroup = inferDepartmentGroup(departmentId, row);
    if (inferredGroup === "forecasting") forecastingDepartmentIds.add(departmentId);
    if (inferredGroup === "nonforecasting") nonForecastingDepartmentIds.add(departmentId);
  });

  return [...departmentMap.values()];
}

let departments = departmentBank.map((department) => ({ ...department, score: 0 }));
let contestContext = { month: null, year: null, displayMonth: "Current Competition", weeksCompleted: 0, maxWeeks: 0, latestWeekNumber: 0 };
let extendedScoreRows = new Map();

function updateStaticText() {
  const headerRow = document.querySelector(".header-row");
  if (headerRow) {
    headerRow.style.justifyContent = "center";
    headerRow.style.textAlign = "center";
    headerRow.style.alignItems = "center";
  }

  const headerInner = headerRow ? headerRow.querySelector("div") : null;
  if (headerInner) {
    headerInner.style.width = "100%";
    headerInner.innerHTML = `
      <div class="main-title-block" style="width:100%;text-align:center;padding:4px 0 8px;">
        <div class="main-title-kicker" style="color:#d7b46a;font-size:18px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;line-height:1.1;text-align:center;">Pier Sixty-Six</div>
        <h1 class="main-title" style="margin:2px 0 0;color:#082b49;font-size:clamp(34px,4.6vw,52px);line-height:1;font-weight:950;letter-spacing:-.04em;text-transform:uppercase;text-align:center;">Department Monopoly</h1>
      </div>
    `;
  }

  const rankingsHeader = document.querySelector(".rankings-header");
  if (rankingsHeader) {
    rankingsHeader.style.position = "relative";
    rankingsHeader.style.alignItems = "center";
    rankingsHeader.style.justifyContent = "center";
    const titleWrap = rankingsHeader.querySelector("div:first-child");
    if (titleWrap) {
      titleWrap.style.flex = "1";
      titleWrap.style.textAlign = "center";
      titleWrap.innerHTML = `<h2 style="text-align:center;margin:0;color:#082b49;font-size:20px;font-weight:950;">Department Rankings</h2>`;
    }
    const deptCount = document.getElementById("departmentCount");
    if (deptCount) {
      deptCount.style.position = "absolute";
      deptCount.style.right = "0";
    }
  }
}

async function loadScoresFromCSV() {
  try {
    const response = await fetch(`${scoresPath}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return console.warn(`scores.csv could not be loaded. Status: ${response.status}`);
    const scoreMap = parseScoresCSV(await response.text());
    const activeDepartmentBank = getAllDepartmentDefinitionsFromCSV(scoreMap);
    const globalWeeksCompleted = Math.max(Number(contestContext.weeksCompleted || 0), Number(contestContext.latestWeekNumber || 0));
    departments = activeDepartmentBank.map((department) => {
      const row = extendedScoreRows.get(department.id);
      const weeksCompleted = globalWeeksCompleted || (row ? Number(row.weeksCompleted || 0) : 0);
      const totalScore = row ? Number(row.totalScore || 0) : 0;
      const currentAverage = weeksCompleted > 0 ? totalScore / weeksCompleted : Number(scoreMap.get(department.id) || 0);
      return {
        ...department,
        score: scoreMap.has(department.id) ? clampScore(Number(scoreMap.get(department.id))) : 0,
        gameScore: scoreMap.has(department.id) ? Number(scoreMap.get(department.id)) : 0,
        totalScore,
        weeksCompleted,
        maxWeeks: row ? Number(row.maxWeeks || contestContext.maxWeeks || 0) : contestContext.maxWeeks,
        yearlyScore: row ? Number(row.yearlyScore || 0) : 0,
        weekScores: row ? row.weekScores : [0, 0, 0, 0, 0],
        currentWeekScore: row ? getWeekScore(row.weekScores, contestContext.latestWeekNumber) : 0,
        previousWeekScore: row ? getWeekScore(row.weekScores, contestContext.latestWeekNumber - 1) : 0,
        currentAverage,
        status: getPerformanceStatus(currentAverage),
      };
    });
  } catch (error) {
    console.warn("Could not load scores.csv. Falling back to zero scores.", error);
  }
}

function parseScoresCSV(csvText) {
  const scoreMap = new Map();
  extendedScoreRows = new Map();
  contestContext = { month: null, year: null, displayMonth: "Current Competition", weeksCompleted: 0, maxWeeks: 0, latestWeekNumber: 0 };

  const lines = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return scoreMap;

  const headers = splitCSVLine(lines[0]).map(normalizeHeader);
  const hasNamedHeaders = headers.includes("departmentid");

  for (const line of lines.slice(hasNamedHeaders ? 1 : 0)) {
    const cells = splitCSVLine(line);
    if (!cells.length) continue;

    if (!hasNamedHeaders) {
      const id = cells[0] ? cells[0].trim() : "";
      const score = cells[1] ? cells[1].trim() : "";
      if (!id || id.toLowerCase() === "id" || Number.isNaN(Number(score))) continue;
      scoreMap.set(id, Number(score));
      continue;
    }

    const raw = {};
    headers.forEach((header, index) => {
      raw[header] = cells[index] !== undefined ? cells[index].trim() : "";
    });

    const id = raw.departmentid;
    if (!id) continue;

    const gameScore = Number(raw.gamescore || raw.score || 0);
    if (!Number.isNaN(gameScore)) scoreMap.set(id, gameScore);

    const weekScores = [1, 2, 3, 4, 5].map((week) => Number(raw[`week${week}`] || 0));
    weekScores.forEach((score, index) => {
      if (score > 0) contestContext.latestWeekNumber = Math.max(contestContext.latestWeekNumber, index + 1);
    });

    const row = {
      id,
      gameScore,
      totalScore: Number(raw.totalscore || 0),
      month: Number(raw.month || 0),
      year: Number(raw.year || 0),
      weeksCompleted: Number(raw.weekscompleted || 0),
      maxWeeks: Number(raw.maxweeks || 0),
      yearlyScore: Number(raw.yearlyscore || 0),
      weekScores,
    };

    extendedScoreRows.set(id, row);
    if (!contestContext.month && row.month) contestContext.month = row.month;
    if (!contestContext.year && row.year) contestContext.year = row.year;
    contestContext.weeksCompleted = Math.max(contestContext.weeksCompleted, row.weeksCompleted || 0);
    contestContext.maxWeeks = Math.max(contestContext.maxWeeks, row.maxWeeks || 0);
  }

  if (!contestContext.latestWeekNumber) contestContext.latestWeekNumber = contestContext.weeksCompleted;
  contestContext.displayMonth = formatMonthYear(contestContext.month, contestContext.year);
  return scoreMap;
}

function splitCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function normalizeHeader(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getWeekScore(weekScores, weekNumber) {
  if (!weekNumber || weekNumber < 1) return 0;
  return Number(weekScores[weekNumber - 1] || 0);
}

function formatMonthYear(month, year) {
  if (!month || !year) return "Current Competition";
  const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString("en-US", { month: "long" });
  return `${monthName} ${year}`;
}

function getPerformanceStatus(avg) {
  const value = Number(avg || 0);
  if (value >= 90) return { label: "Excellent", className: "status-excellent" };
  if (value >= 80) return { label: "Strong", className: "status-strong" };
  if (value >= 70) return { label: "Good", className: "status-good" };
  return { label: "Needs Support", className: "status-support" };
}

function statusBadgeHtml(department) {
  const status = department.status || getPerformanceStatus(department.currentAverage);
  return `<span class="status-badge ${status.className}">${status.label}</span>`;
}

function getGridPosition(index) {
  if (index >= 0 && index <= 5) return { row: 1, col: index + 1 };
  if (index >= 6 && index <= 10) return { row: index - 4, col: 6 };
  if (index >= 11 && index <= 15) return { row: 6, col: 16 - index };
  if (index >= 16 && index <= 19) return { row: 21 - index, col: 1 };
  return { row: 1, col: 1 };
}

function getDisplayedBoardLevel(score) {
  if (score >= 100) return null;
  if (score <= 0) return 0;
  return Math.floor(score / 5) * 5;
}

function getDisplayedSpireLevel(score) {
  if (score < 100) return score;
  if (score >= 110) return 110;
  return Math.floor((score - 100) / 2) * 2 + 100;
}

function clampScore(value) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(110, value));
}

function getInitials(name) {
  return name.replace("Windows/IRD", "Windows IRD").split(/\s|\//).filter(Boolean).map((word) => word[0]).join("").substring(0, 3).toUpperCase();
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function getRankClass(teamId) {
  const group = getDepartmentGroup(teamId);
  const rankedDepartments = [...departments]
    .filter((department) => getDepartmentGroup(department.id) === group)
    .sort(compareDepartmentRank);

  const rankIndex = rankedDepartments.findIndex((department) => department.id === teamId);
  if (rankIndex === 0) return "rank-gold";
  if (rankIndex === 1) return "rank-silver";
  if (rankIndex === 2) return "rank-bronze";
  return "";
}


function getRankStyle(rankClass) {
  if (rankClass === "rank-gold") return "box-shadow:0 0 0 2px rgba(215,180,106,.95),0 0 16px rgba(255,215,0,.95),0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-silver") return "box-shadow:0 0 0 2px rgba(148,163,184,1),0 0 14px rgba(100,116,139,.95),0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-bronze") return "box-shadow:0 0 0 2px rgba(205,127,50,.95),0 0 14px rgba(205,127,50,.9),0 10px 18px rgba(15,23,42,.28);";
  return "";
}

function makeIcon(body, badge = "") {
  return `<svg width="100%" height="100%" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="28" fill="#082b49" stroke="#d7b46a" stroke-width="4"/><circle cx="32" cy="32" r="21" fill="rgba(103,213,223,0.16)" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>${body}${badge}</svg>`;
}

function bohBadge() {
  return `<g><circle cx="49" cy="49" r="13" fill="#082b49" stroke="#d7b46a" stroke-width="3"/><text x="49" y="55" text-anchor="middle" font-size="16" font-weight="900" fill="#ffffff" font-family="Arial, sans-serif">B</text></g>`;
}

function iconSvg(teamId) {
  const isBoh = teamId.endsWith("-boh");
  const badge = isBoh ? bohBadge() : "";
  let baseId = teamId.replace("-boh", "");
  if (baseId === "windows-ird") baseId = "ird";
  if (baseId === "banquets") baseId = "banquets-foh";

  const icons = {
    "windows": () => makeIcon(`<g transform="translate(20 20)"><path fill="#67d5df" stroke="#ffffff" stroke-width="2" d="M0 2l11-2v15H0z"/><path fill="#f7efe2" stroke="#ffffff" stroke-width="2" d="M15-1l13-2v18H15z"/><path fill="#0b4775" stroke="#ffffff" stroke-width="2" d="M0 19h11v15L0 32z"/><path fill="#67d5df" stroke="#ffffff" stroke-width="2" d="M15 19h13v17l-13-2z"/><path fill="none" stroke="#d7b46a" stroke-width="2" stroke-linecap="round" d="M13 1v33M1 17h26"/></g>`, badge),
    "elate": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M16 27h29v12c0 8-6 14-14 14S16 47 16 39V27z"/><path fill="none" stroke="#d7b46a" stroke-width="3" d="M45 31h5c5 0 5 9 0 9h-5"/><ellipse cx="30.5" cy="27" rx="16" ry="5" fill="#082b49" stroke="#d7b46a" stroke-width="3"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M23 24c3-4 6-4 9 0 3-4 6-4 9 0"/>`, badge),
    "pier-top": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M28 12h8l3 12v28H25V24l3-12z"/><path fill="#67d5df" d="M29 25h6v25h-6z" opacity=".85"/><path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M18 24h28c2 0 5 6 4 9H14c-1-3 2-9 4-9z"/><path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M18 21h28M32 6v8M23 19l-4-5M41 19l4-5"/>`, badge),
    "pool": () => makeIcon(`<path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M12 39c7-7 13-7 20 0s13 7 20 0v10c-7 7-13 7-20 0s-13-7-20 0V39z"/><path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M20 24c8-9 16-9 24 0-5-1-8 0-12 3-4-3-7-4-12-3z"/><path fill="none" stroke="#082b49" stroke-width="3" stroke-linecap="round" d="M32 26v17"/><circle cx="48" cy="28" r="6" fill="#d7b46a"/><path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" d="M16 47c5-4 9-4 14 0M34 47c5 4 9 4 14 0"/>`, badge),
    "reservations": () => makeIcon(`<rect x="17" y="18" width="30" height="33" rx="5" fill="#f7efe2" stroke="#d7b46a" stroke-width="3"/><path fill="#d7b46a" d="M17 24h30v8H17z"/><path fill="none" stroke="#082b49" stroke-width="2" d="M23 37h6M35 37h6M23 44h6M35 44h6"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M24 15v7M40 15v7"/>`, badge),
    "bell-service": () => makeIcon(`<path fill="#d7b46a" stroke="#ffffff" stroke-width="2" d="M32 15c-9 0-16 7-16 17h32c0-10-7-17-16-17z"/><path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M13 33h38v8H13z"/><path fill="#d7b46a" d="M29 9h6v7h-6z"/><circle cx="32" cy="8" r="4" fill="#d7b46a"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M19 48h26"/>`, badge),
    "ird": () => makeIcon(`<path fill="#cbd5e1" stroke="#ffffff" stroke-width="2" d="M14 38c2-11 10-17 18-17s16 6 18 17H14z"/><path fill="#94a3b8" stroke="#d7b46a" stroke-width="3" d="M10 38h44v7H10z"/><path fill="#e5e7eb" d="M29 17h6v6h-6z"/><circle cx="32" cy="16" r="4" fill="#e5e7eb" stroke="#ffffff" stroke-width="1.5"/><path fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" d="M20 34h24"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M18 50h28"/>`, badge),
    "housekeeping": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M17 25h30v24H17z"/><path fill="#67d5df" d="M20 30h24v6H20zM20 40h24v5H20z" opacity=".85"/><path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M20 23c4-7 20-7 24 0"/><path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" d="M18 53h30"/><path fill="#d7b46a" d="M48 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>`, badge),
    "security": () => makeIcon(`<path fill="#94a3b8" stroke="#d7b46a" stroke-width="3" d="M16 27h22l6-6v25H16z"/><circle cx="27" cy="36" r="8" fill="#082b49" stroke="#ffffff" stroke-width="3"/><circle cx="27" cy="36" r="3" fill="#67d5df"/><path fill="#d7b46a" d="M44 29l9-5v18l-9-5z"/>`, badge),
    "guest-services": () => makeIcon(`<circle cx="23" cy="29" r="10" fill="#082b49" stroke="#d7b46a" stroke-width="4"/><circle cx="23" cy="29" r="4" fill="#ffffff"/><path fill="none" stroke="#d7b46a" stroke-width="5" stroke-linecap="round" d="M32 29h21"/><path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M44 29v8M52 29v6"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 50h35"/>`, badge),
    "garni": () => makeIcon(`<ellipse cx="26" cy="35" rx="11" ry="15" fill="#ffffff" stroke="#d7b46a" stroke-width="3" transform="rotate(-18 26 35)"/><circle cx="27" cy="37" r="5" fill="#f59e0b"/><path fill="#d7b46a" stroke="#f7efe2" stroke-width="2" d="M37 22c10 3 13 10 8 19-9-3-13-10-8-19z"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 52h32"/>`, badge),
    "pastry": () => makeIcon(`<path fill="#d9892b" stroke="#7c3f13" stroke-width="2.5" d="M9 38c4-12 14-20 25-21 11-1 20 5 22 14-8-3-15-1-20 6-3 4-6 8-11 10-6 3-12 1-16-9z"/><path fill="#f7b267" stroke="#d7b46a" stroke-width="2" d="M15 37c3-7 8-12 15-14-3 5-5 11-4 18-4-3-8-4-11-4z"/><path fill="#f59e0b" stroke="#d7b46a" stroke-width="2" d="M30 22c6-2 12-1 17 3-5 2-9 6-12 11-3-5-4-9-5-14z"/><path fill="#c46216" opacity=".9" d="M39 37c4-5 9-7 16-6-3 4-7 7-12 10-2-1-3-2-4-4z"/><path fill="none" stroke="#fff0c7" stroke-width="3" stroke-linecap="round" d="M18 33c7-5 15-7 25-4"/><path fill="none" stroke="#7c3f13" stroke-width="1.8" stroke-linecap="round" opacity=".55" d="M18 40l6-2M28 26l3 4M42 29l4 3M37 43l5-4"/>`, badge),
    "sotogrande": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M19 48V29c0-8 6-14 13-14s13 6 13 14v19H19z"/><path fill="#67d5df" d="M25 48V31c0-4 3-7 7-7s7 3 7 7v17H25z"/><path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M17 51h31M21 25h23"/><circle cx="47" cy="19" r="5" fill="#f59e0b"/>`, badge),
    "saltbreeze": () => makeIcon(`<path fill="#f59e0b" stroke="#f7efe2" stroke-width="2" d="M16 38c8-13 24-17 35-8-11 2-19 8-24 19-4-6-7-9-11-11z"/><path fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" d="M35 20c4-8 10-10 17-6M34 21c-7-7-14-6-20 0"/><path fill="none" stroke="#67d5df" stroke-width="4" stroke-linecap="round" d="M17 50c7-4 13-4 20 0 5 3 9 3 14 0"/>`, badge),
    "calusso": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M12 42C15 29 24 18 32 13C40 18 49 29 52 42H12z"/><path fill="none" stroke="#082b49" stroke-width="2.8" stroke-linecap="round" d="M32 16v25"/><path fill="none" stroke="#082b49" stroke-width="2.8" stroke-linecap="round" d="M25 20l5 21"/><path fill="none" stroke="#082b49" stroke-width="2.8" stroke-linecap="round" d="M39 20l-5 21"/><path fill="none" stroke="#082b49" stroke-width="2.8" stroke-linecap="round" d="M18 30l11 12"/><path fill="none" stroke="#082b49" stroke-width="2.8" stroke-linecap="round" d="M46 30L35 42"/><path fill="none" stroke="#e8d8b0" stroke-width="2" stroke-linecap="round" d="M21 40h22"/><path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M15 43h34"/><path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 51c7-4 13-4 20 0 5 3 9 3 13 0"/>`, badge),
    "nectar": () => makeIcon(`<path fill="#22c55e" stroke="#d7b46a" stroke-width="3" d="M49 12C29 12 17 25 18 47c20 0 32-13 31-35z"/><path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" d="M22 44c8-11 15-18 24-28"/><path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M20 31h18l-3 22H23l-3-22z" opacity=".8"/>`, badge),
    "spa": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M32 13c7 7 8 14 0 23-8-9-7-16 0-23z"/><path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M17 25c10 1 16 6 15 18-11-2-16-8-15-18zM47 25c-10 1-16 6-15 18 11-2 16-8 15-18z"/><circle cx="32" cy="34" r="5" fill="#f472b6" stroke="#ffffff" stroke-width="2"/><path fill="none" stroke="#082b49" stroke-width="4" stroke-linecap="round" d="M17 49h30"/>`, badge),
    "stewarding": () => makeIcon(`<circle cx="30" cy="31" r="18" fill="#ffffff" stroke="#d7b46a" stroke-width="4"/><circle cx="30" cy="31" r="10" fill="none" stroke="#67d5df" stroke-width="3"/><path fill="none" stroke="#082b49" stroke-width="4" stroke-linecap="round" d="M45 16v30M51 16v30"/><path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M15 52h33"/>`, badge),
    "engineering": () => makeIcon(`<g transform="translate(24 30)"><path fill="#d7b46a" d="M0-17l3 6 7-3-3 7 6 3-7 3 3 7-7-3-3 6-3-6-7 3 3-7-6-3 7-3-3-7 7 3z"/><circle r="8" fill="#082b49" stroke="#f7efe2" stroke-width="3"/><circle r="3" fill="#67d5df"/></g><g transform="translate(43 39) scale(.78)"><path fill="#d7b46a" d="M0-17l3 6 7-3-3 7 6 3-7 3 3 7-7-3-3 6-3-6-7 3 3-7-6-3 7-3-3-7 7 3z"/><circle r="8" fill="#082b49" stroke="#f7efe2" stroke-width="3"/><circle r="3" fill="#67d5df"/></g>`, badge),
    "front-office": () => makeIcon(`<path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M13 33h38v18H13z"/><path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M18 19h28v14H18z"/><path fill="#67d5df" d="M22 24h20v5H22z"/><circle cx="32" cy="42" r="4" fill="#d7b46a"/>`, badge),
    "banquets-foh": () => makeIcon(`<path fill="#d7b46a" d="M22 12h20l-3 20H25L22 12z"/><path fill="#67d5df" d="M25 17h14l-2 10H27z"/><path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M32 32v18M23 52h18"/><circle cx="46" cy="38" r="8" fill="#ffffff" stroke="#d7b46a" stroke-width="3"/>`, badge),
  };

  return icons[baseId] ? icons[baseId]() : "";
}

function markerHtml(team, large = false, suppressRank = false) {
  const rankClass = suppressRank ? "" : getRankClass(team.id);
  const rankStyle = getRankStyle(rankClass);
  const icon = iconSvg(team.id);
  const initials = escapeHtml(getInitials(team.name));
  const sizeStyle = icon ? (large ? "width:46px;height:46px;font-size:0;" : "width:38px;height:38px;font-size:0;") : "";
  const status = team.status || getPerformanceStatus(team.currentAverage || team.score);
  const title = `${team.name} | ${status.label} | Avg: ${formatScore(team.currentAverage || team.score)} | Total: ${formatScore(team.totalScore || 0)} | Board Progress: ${formatScore(team.gameScore || team.score)} | Weeks: ${team.weeksCompleted || 0}/${team.maxWeeks || contestContext.maxWeeks || 0}`;
  if (icon) {
    return `<div class="marker icon-marker ${large ? "large" : ""} ${team.color} ${rankClass} ${status.className}" style="${sizeStyle}${rankStyle}" title="${escapeHtml(title)}">${icon}</div>`;
  }
  return `<div class="marker ${large ? "large" : ""} ${team.color} ${rankClass} ${status.className}" style="${rankStyle}" title="${escapeHtml(title)}">${initials}</div>`;
}

function tileHtml(space, teams) {
  const cornerClass = space.type === "corner" ? "corner" : "";
  const image = space.imageUrl ? `<img class="tile-img" src="${space.imageUrl}" alt="${escapeHtml(space.name)}" loading="eager" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="image-error" style="display:none;position:absolute;inset:12px 8px 48px 8px;align-items:center;justify-content:center;text-align:center;padding:8px;border-radius:12px;background:rgba(0,0,0,0.45);color:white;font-size:10px;font-weight:900;line-height:1.25;z-index:4;">IMAGE NOT FOUND<br>${escapeHtml(space.imageUrl)}</div>` : "";
  const visibleTeams = teams.slice(0, MAX_VISIBLE_TILE_TOKENS);
  const hiddenTeams = teams.slice(MAX_VISIBLE_TILE_TOKENS);
  const hiddenCount = hiddenTeams.length;
  const hiddenList = hiddenTeams
    .map((team) => `<li><span class="tile-hidden-name">${escapeHtml(team.name)}</span><span class="tile-hidden-status">${team.status.label} • ${formatScore(team.currentAverage || team.score)}</span></li>`)
    .join("");
  const hiddenTitle = hiddenTeams.map((team) => `${team.name} - ${team.status.label}`).join(" | ");
  const overflowBadge = hiddenCount ? `<div class="tile-overflow-badge" title="${escapeHtml(hiddenTitle)}">+${hiddenCount}</div>` : "";
  const overflowPopover = hiddenCount ? `<div class="tile-overflow-popover"><div class="tile-overflow-title">Also on ${escapeHtml(space.name)}</div><ul>${hiddenList}</ul></div>` : "";
  return `<div class="tile ${cornerClass}">${image}<div class="tile-overlay"></div><div class="tile-ring"></div><div class="tile-teams">${visibleTeams.map((team) => markerHtml(team)).join("")}${overflowBadge}</div>${overflowPopover}<div class="tile-name">${escapeHtml(space.name)}</div></div>`;
}

function levelBottom(score) {
  const pct = Math.min(1, Math.max(0, (score - 100) / 10));
  return 48 + pct * 424;
}

function spireHtml() {
  const climbers = departments.filter((team) => team.score >= 100);
  const champion = climbers.length ? [...climbers].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0] : null;
  const otherClimbers = champion ? climbers.filter((team) => team.id !== champion.id) : climbers;
  const otherClimbersHtml = otherClimbers.length
    ? otherClimbers
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
        .map((team) => `<span class="spire-club-member">${markerHtml(team, false, true)} <span>${escapeHtml(team.name)}</span></span>`)
        .join("")
    : `<div class="spire-club-empty">No additional elite performers yet.</div>`;

  const levelLines = spireLevels.map((level) => `<div class="spire-level" style="bottom:${levelBottom(level)}px"><div class="spire-level-label ${level === 110 ? "crown" : ""}">${level}</div><div class="spire-level-line"></div></div>`).join("");
  const climberMarkers = climbers.map((team, index) => {
    const displayLevel = getDisplayedSpireLevel(team.score);
    const bottom = levelBottom(displayLevel) - 17;
    const sideOffset = index % 2 === 0 ? 214 : 52;
    return `<div class="spire-marker-wrap" style="bottom:${bottom}px; left:${sideOffset}px">${markerHtml(team, true)}</div>`;
  }).join("");
  const championHtml = champion ? `<div class="spire-champion">${markerHtml(champion)}<div><div class="champion-name">${escapeHtml(champion.name)}</div><div class="champion-score">${formatScore(champion.currentAverage || champion.score)} avg • ${formatScore(champion.gameScore || champion.score)} progress</div></div></div>` : `<div class="champion-score" style="margin-top:8px">No department has reached the Spire yet.</div>`;
  const legendRows = spireLevels.map((level) => {
    const teamsAtLevel = climbers.filter((team) => getDisplayedSpireLevel(team.score) === level);
    return `<div class="spire-legend-row"><div class="legend-level ${level === 110 ? "crown" : ""}">${level}</div><div class="legend-label">${level === 110 ? "Crown" : level === 100 ? "Entry" : "Climb"}</div><div class="legend-markers">${teamsAtLevel.map((team) => markerHtml(team)).join("")}</div></div>`;
  }).join("");

  return `<div class="spire-card"><div class="spire-bg-one"></div><div class="spire-bg-two"></div><div class="spire-bg-three"></div><div class="spire-layout"><div class="spire-info"><div class="spire-heading-block" style="text-align:center;margin-bottom:14px;"><div class="spire-eyebrow" style="text-align:center;">The Race to</div><h2 class="spire-title" style="text-align:center;">The Spire</h2></div><div class="spire-top-box"><div class="spire-box-label">Current Top Climber</div>${championHtml}</div><div class="spire-club-box"><div class="spire-box-label">Elite Monthly Performers</div><div class="spire-club-members">${otherClimbersHtml}</div></div></div><div class="spire-tower"><div class="tower-glow"></div><div class="tower-spire"></div><div class="tower-neck"></div><div class="tower-top"></div><div class="tower-body"><div class="tower-center-column"></div><div class="tower-fade"></div></div><div class="tower-base-one"></div><div class="tower-base-two"></div>${levelLines}${climberMarkers}</div><div class="spire-legend">${legendRows}</div></div></div>`;
}


function getDepartmentsByGroup(group) {
  return departments
    .filter((department) => getDepartmentGroup(department.id) === group)
    .sort(compareDepartmentRank);
}

function formatScore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0 pts";
  const rounded = Math.round(Number(value) * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)} pts`;
}

function getWeeklyAverage(department) {
  const activeWeeks = Math.max(Number(contestContext.weeksCompleted || 0), Number(contestContext.latestWeekNumber || 0), Number(department.weeksCompleted || 0));
  const totalScore = Number(department.totalScore || 0);
  if (activeWeeks > 0) return totalScore / activeWeeks;

  const explicitAverage = Number(department.currentAverage || 0);
  if (explicitAverage > 0) return explicitAverage;
  return 0;
}

function averageScore(items) {
  if (!items.length) return 0;
  return items.reduce((sum, department) => sum + getWeeklyAverage(department), 0) / items.length;
}

function totalAverageScore(items) {
  if (!items.length) return 0;
  return items.reduce((sum, department) => sum + Number(department.totalScore || 0), 0) / items.length;
}

function compareDepartmentRank(a, b) {
  return Number(b.totalScore || 0) - Number(a.totalScore || 0)
    || Number(b.currentAverage || 0) - Number(a.currentAverage || 0)
    || a.name.localeCompare(b.name);
}

function leadText(items) {
  if (items.length < 2) return "No runner-up yet";
  const lead = getWeeklyAverage(items[0]) - getWeeklyAverage(items[1]);
  return `+${(Math.round(lead * 10) / 10).toFixed(1)} weekly avg over #2`;
}

function insightChampionCard(group, icon) {
  const items = getDepartmentsByGroup(group);
  const leader = items[0];
  const label = getDepartmentGroupLabel(group).replace(" Departments", " Champion");

  if (!leader) {
    return `
      <div class="insight-card champion-card">
        <div class="insight-label">${icon} ${label}</div>
        <div class="insight-empty">No scores loaded</div>
      </div>
    `;
  }

  return `
    <div class="insight-card champion-card">
      <div class="insight-label">${icon} ${label}</div>
      <div class="insight-main">
        ${markerHtml(leader, true)}
        <div>
          <div class="insight-name">${escapeHtml(leader.name)}</div>
          <div class="insight-sub">${formatScore(leader.score)} • ${leadText(items)}</div>
        </div>
      </div>
    </div>
  `;
}

function insightAverageCard(group) {
  const items = getDepartmentsByGroup(group);
  const average = averageScore(items);
  const leader = items[0];

  return `
    <div class="insight-card average-card">
      <div class="insight-label">${getDepartmentGroupLabel(group)}</div>
      <div class="insight-number">${formatScore(average)}</div>
      <div class="insight-sub">Division average${leader ? ` • Leader: ${escapeHtml(leader.name)}` : ""}</div>
    </div>
  `;
}

function insightClubCard() {
  const club = [...departments]
    .filter((department) => Number(department.score || 0) >= 100)
    .sort(compareDepartmentRank);

  const visibleMembers = club.slice(0, 6).map((department) => `
    <span class="club-member">${markerHtml(department)} ${escapeHtml(department.name)}</span>
  `).join("");

  return `
    <div class="insight-card club-card">
      <div class="insight-label">100+ Club</div>
      <div class="insight-number">${club.length}</div>
      <div class="club-members">
        ${club.length ? visibleMembers : `<span class="insight-sub">No departments have reached 100 yet.</span>`}
      </div>
    </div>
  `;
}

function renderInsights() {
  const insights = document.getElementById("divisionInsights");
  if (!insights) return;

  insights.innerHTML = `
    ${insightChampionCard("forecasting", "🏆")}
    ${insightChampionCard("nonforecasting", "🏆")}
  `;
}

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "0";
  const rounded = Math.round(Number(value) * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
}

function getCurrentWeekLeaders() {
  return [...departments]
    .filter((department) => Number(department.currentWeekScore || 0) > 0)
    .sort((a, b) => b.currentWeekScore - a.currentWeekScore || a.name.localeCompare(b.name));
}

function getTopImprovers(limit = 3) {
  return [...departments]
    .map((department) => ({ ...department, movement: Number(department.currentWeekScore || 0) - Number(department.previousWeekScore || 0) }))
    .filter((department) => department.previousWeekScore > 0 && department.currentWeekScore > 0)
    .sort((a, b) => b.movement - a.movement || b.currentWeekScore - a.currentWeekScore || a.name.localeCompare(b.name))
    .slice(0, limit);
}

function getStatusCounts() {
  const counts = { Excellent: 0, Strong: 0, Good: 0, "Needs Support": 0 };
  departments.forEach((department) => {
    const label = (department.status || getPerformanceStatus(department.currentAverage || department.score)).label;
    counts[label] = (counts[label] || 0) + 1;
  });
  return counts;
}

function getWithinReach(limit = 3) {
  const thresholds = [
    { label: "Good", value: 70 },
    { label: "Strong", value: 80 },
    { label: "Excellent", value: 90 },
  ];
  return [...departments]
    .map((department) => {
      const avg = Number(department.currentAverage || 0);
      const next = thresholds.find((threshold) => avg < threshold.value);
      return next ? { ...department, nextLabel: next.label, gap: next.value - avg } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.gap - b.gap || b.currentAverage - a.currentAverage)
    .slice(0, limit);
}

function weeklyBreakdownHtml(department) {
  const maxWeeks = Number(department.maxWeeks || contestContext.maxWeeks || 5);
  const activeWeeks = Math.max(Number(contestContext.weeksCompleted || 0), Number(contestContext.latestWeekNumber || 0), Number(department.weeksCompleted || 0));
  const weekRows = department.weekScores.slice(0, maxWeeks).map((score, index) => {
    const weekNumber = index + 1;
    const numericScore = Number(score || 0);
    const isActiveOrPastWeek = weekNumber <= activeWeeks;
    const status = isActiveOrPastWeek ? getPerformanceStatus(numericScore) : { label: "Pending", className: "status-pending" };
    const scoreLabel = isActiveOrPastWeek ? formatScore(numericScore) : "-";
    return `<div class="ranking-week-row ${isActiveOrPastWeek ? "" : "pending"}"><div class="ranking-week-label">Week ${weekNumber}</div><div class="ranking-week-score">${scoreLabel}</div><span class="status-badge week-status ${status.className}">${status.label}</span></div>`;
  }).join("");
  return `<div class="ranking-hover-card"><div class="ranking-hover-title">${escapeHtml(department.name)}</div><div class="ranking-hover-summary"><span>Total: ${formatScore(department.totalScore || 0)}</span><span>Weekly Average: ${formatScore(department.currentAverage || department.score)}</span></div><div class="ranking-week-list">${weekRows}</div></div>`;
}

function renderSeasonBanner() {
  const banner = document.getElementById("seasonBanner");
  if (!banner) return;
  const weekText = contestContext.maxWeeks ? `Week ${contestContext.weeksCompleted || contestContext.latestWeekNumber || 0} of ${contestContext.maxWeeks}` : "Current standings";
  banner.innerHTML = `<div class="season-banner-left"><div class="season-kicker">Current Competition</div><div class="season-title">${escapeHtml(contestContext.displayMonth)}</div></div><div class="season-banner-right">${escapeHtml(weekText)}</div>`;
}

function renderProgressOverview() {
  const card = document.getElementById("progressOverview");
  if (!card) return;
  const maxWeeks = Number(contestContext.maxWeeks || 0);
  const weeksCompleted = Number(contestContext.weeksCompleted || contestContext.latestWeekNumber || 0);
  const progressPct = maxWeeks ? Math.min(100, Math.max(0, (weeksCompleted / maxWeeks) * 100)) : 0;
  const bestThisWeek = getCurrentWeekLeaders()[0];
  const avgCurrent = averageScore(departments.filter((department) => department.currentAverage > 0));

  card.innerHTML = `<div class="progress-header"><div><div class="progress-kicker">Monthly Race Progress</div><h2>${escapeHtml(contestContext.displayMonth)}</h2></div><div class="progress-week-pill">${weeksCompleted} of ${maxWeeks || "-"} weeks complete</div></div><div class="progress-track" aria-label="Monthly progress"><div class="progress-fill" style="width:${progressPct}%"></div></div><div class="progress-stats"><div class="progress-stat"><div class="progress-stat-label">Month Progress</div><div class="progress-stat-value">${Math.round(progressPct)}%</div></div><div class="progress-stat"><div class="progress-stat-label">Best This Week</div><div class="progress-stat-value small">${bestThisWeek ? escapeHtml(bestThisWeek.name) : "-"}</div><div class="progress-stat-sub">${bestThisWeek ? formatScore(bestThisWeek.currentWeekScore) : "No weekly score"}</div></div><div class="progress-stat"><div class="progress-stat-label">Combined Weekly Average</div><div class="progress-stat-value">${formatScore(avgCurrent)}</div></div></div>`;
}

function renderStatusLegendPanel() {
  const panel = document.getElementById("statusLegendPanel");
  if (!panel) return;
  const counts = getStatusCounts();
  panel.innerHTML = `<div class="status-legend-grid"><div class="metric-box"><div class="metric-box-kicker">Current Status Counts</div><h2>Status Counts</h2><div class="status-count-row large"><span class="status-badge status-excellent">Excellent ${counts.Excellent || 0}</span><span class="status-badge status-strong">Strong ${counts.Strong || 0}</span><span class="status-badge status-good">Good ${counts.Good || 0}</span><span class="status-badge status-support">Needs Support ${counts["Needs Support"] || 0}</span></div></div><div class="metric-box"><div class="metric-box-kicker">Scoring Guide</div><h2>Scoring Legend</h2><div class="legend-pill-row large"><span>90+ Excellent</span><span>80-89 Strong</span><span>70-79 Good</span><span>&lt;70 Needs Support</span></div></div></div>`;
}

function renderWithinReachPanel() {
  const panel = document.getElementById("withinReachPanel");
  if (!panel) return;
  const reach = getWithinReach(5);
  const reachHtml = reach.length ? reach.map((department, index) => `<div class="reach-card-row"><div class="reach-card-top"><div class="reach-rank">#${index + 1}</div>${markerHtml(department, false, true)}<div class="reach-name-block"><div class="reach-name">${escapeHtml(department.name)} ${statusBadgeHtml(department)}</div><div class="reach-sub">${formatScore(department.currentAverage)} weekly avg</div></div></div><div class="reach-gap">+${formatNumber(department.gap)} to ${department.nextLabel}</div></div>`).join("") : `<div class="reach-empty">No departments are below Excellent.</div>`;
  panel.innerHTML = `<div class="within-reach-header"><div><div class="within-reach-kicker">Almost There</div><h2>Within Reach</h2></div><div class="within-reach-note">Closest to next status tier</div></div><div class="within-reach-list">${reachHtml}</div>`;
}

function renderMoversInsights() {
  const card = document.getElementById("moversInsights");
  if (!card) return;
  const movers = getTopImprovers(3);
  const rows = movers.length ? movers.map((department, index) => `<div class="mover-row"><div class="mover-rank">#${index + 1}</div>${markerHtml(department, false, true)}<div class="mover-name-block"><div class="mover-name">${escapeHtml(department.name)} ${statusBadgeHtml(department)}</div><div class="mover-sub">Week ${contestContext.latestWeekNumber - 1}: ${formatScore(department.previousWeekScore)} → Week ${contestContext.latestWeekNumber}: ${formatScore(department.currentWeekScore)}</div></div><div class="mover-delta">+${formatNumber(department.movement)}</div></div>`).join("") : `<div class="movers-empty">Not enough week-over-week data yet.</div>`;
  card.innerHTML = `<div class="movers-header"><div><div class="movers-kicker">Momentum Watch</div><h2>Biggest Improvements This Week</h2></div><div class="movers-note">Compared to prior week</div></div><div class="movers-grid">${rows}</div>`;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  boardSpaces.forEach((space) => {
    const gp = getGridPosition(space.id);
    const departmentsHere = departments.filter((department) => getDisplayedBoardLevel(department.score) === space.points);
    const cell = document.createElement("div");
    cell.style.gridColumn = gp.col;
    cell.style.gridRow = gp.row;
    cell.innerHTML = tileHtml(space, departmentsHere);
    board.appendChild(cell);
  });
  const spireCell = document.createElement("div");
  spireCell.style.gridColumn = "2 / span 4";
  spireCell.style.gridRow = "2 / span 4";
  spireCell.innerHTML = spireHtml();
  board.appendChild(spireCell);
}

function renderRankingDivision(group) {
  const rankedDepartments = [...departments]
    .filter((department) => getDepartmentGroup(department.id) === group)
    .sort(compareDepartmentRank);
  const rows = rankedDepartments.map((department, index) => {
    const rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
    return `<div class="ranking-row ${index < 3 ? "top" : ""}"><div class="ranking-left"><div class="rank-badge">${rank}</div>${markerHtml(department)}<div class="ranking-name-wrap"><span class="ranking-name">${escapeHtml(department.name)}</span>${statusBadgeHtml(department)}</div></div><div class="ranking-score-stack"><span class="ranking-score">${formatScore(department.totalScore || 0)} total</span><span class="ranking-sub-score">${formatScore(department.currentAverage || department.score)} weekly avg</span></div>${weeklyBreakdownHtml(department)}</div>`;
  }).join("");
  return `<section class="ranking-division ${group}"><div class="ranking-division-header"><h3>${getDepartmentGroupLabel(group)}</h3><span>${rankedDepartments.length} departments</span></div><div class="ranking-division-grid">${rows}</div><div class="division-summary-grid">
  <div class="division-average-card total-average-card">
    <div class="division-average-label">Total Average</div>
    <div class="division-average-score">${formatScore(totalAverageScore(rankedDepartments))}</div>
  </div>
  <div class="division-average-card weekly-average-card">
    <div class="division-average-label">Week ${contestContext.latestWeekNumber || contestContext.weeksCompleted || ""} Average</div>
    <div class="division-average-score">${formatScore(averageScore(rankedDepartments))}</div>
  </div>
</div></section>`;
}

function renderRankings() {
  const rankings = document.getElementById("rankings");
  const departmentCount = document.getElementById("departmentCount");

  const forecastingCount = departments.filter((department) => getDepartmentGroup(department.id) === "forecasting").length;
  const nonForecastingCount = departments.filter((department) => getDepartmentGroup(department.id) === "nonforecasting").length;
  departmentCount.textContent = `${forecastingCount} forecasting | ${nonForecastingCount} non-forecasting`;

  rankings.innerHTML = `
    ${renderRankingDivision("forecasting")}
    ${renderRankingDivision("nonforecasting")}
  `;
}


function renderAll() {
  updateStaticText();
  try { renderSeasonBanner(); } catch (error) { console.warn("Season banner failed", error); }
  renderBoard();
  try { renderProgressOverview(); } catch (error) { console.warn("Progress overview failed", error); }
  try { renderInsights(); } catch (error) { console.warn("Insights failed", error); }
  renderRankings();
  try { renderStatusLegendPanel(); } catch (error) { console.warn("Status/legend panel failed", error); }
  try { renderWithinReachPanel(); } catch (error) { console.warn("Within reach panel failed", error); }
  try { renderMoversInsights(); } catch (error) { console.warn("Movers failed", error); }
  updateStaticText();
}

async function init() {
  await loadScoresFromCSV();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);


/* ===== V14 STATUS COUNTS HOVER MENU - APPEND TO BOTTOM OF script.js ===== */
function getDepartmentsByStatusLabel(statusLabel) {
  return [...departments]
    .filter((department) => {
      const status = department.status || getPerformanceStatus(department.currentAverage || department.score);
      return status.label === statusLabel;
    })
    .sort((a, b) => (b.currentAverage || b.score) - (a.currentAverage || a.score) || a.name.localeCompare(b.name));
}

function statusCountHoverCard(statusLabel, className, count) {
  const matchingDepartments = getDepartmentsByStatusLabel(statusLabel);
  const listItems = matchingDepartments.length
    ? matchingDepartments
        .map((department) => `<li><span>${escapeHtml(department.name)}</span><b>${formatScore(department.currentAverage || department.score)}</b></li>`)
        .join("")
    : `<li><span>No departments</span><b>-</b></li>`;

  return `<div class="status-count-hover-wrap">
    <span class="status-badge status-count-pill ${className}">${statusLabel} ${count}</span>
    <div class="status-count-popover">
      <div class="status-count-popover-title">${statusLabel} Departments</div>
      <ul>${listItems}</ul>
    </div>
  </div>`;
}

renderStatusLegendPanel = function renderStatusLegendPanel() {
  const panel = document.getElementById("statusLegendPanel");
  if (!panel) return;

  const counts = getStatusCounts();

  panel.innerHTML = `<div class="status-legend-grid">
    <div class="metric-box">
      <div class="metric-box-kicker">Current Status Counts</div>
      <h2>Status Counts</h2>
      <div class="status-count-row large">
        ${statusCountHoverCard("Excellent", "status-excellent", counts.Excellent || 0)}
        ${statusCountHoverCard("Strong", "status-strong", counts.Strong || 0)}
        ${statusCountHoverCard("Good", "status-good", counts.Good || 0)}
        ${statusCountHoverCard("Needs Support", "status-support", counts["Needs Support"] || 0)}
      </div>
    </div>

    <div class="metric-box">
      <div class="metric-box-kicker">Scoring Guide</div>
      <h2>Scoring Legend</h2>
      <div class="legend-pill-row large">
        <span>90+ Excellent</span>
        <span>80-89 Strong</span>
        <span>70-79 Good</span>
        <span>&lt;70 Needs Support</span>
      </div>
    </div>
  </div>`;
};
