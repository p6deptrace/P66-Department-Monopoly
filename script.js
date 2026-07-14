"use strict";

const imagePath = (fileName) => `Images/${fileName}`;
const scoresPath = "scores.csv";

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

const departmentBank = [
  { id: "elate", name: "Elate", color: "bg-amber-600" },
  { id: "nectar", name: "Nectar", color: "bg-lime-600" },
  { id: "pier-top", name: "Pier Top", color: "bg-sky-700" },
  { id: "pool", name: "Pool", color: "bg-cyan-500" },
  { id: "spa", name: "Spa", color: "bg-teal-500" },
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

let departments = departmentBank.map((department) => ({ ...department, score: 0 }));

async function loadScoresFromCSV() {
  try {
    const response = await fetch(`${scoresPath}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return console.warn(`scores.csv could not be loaded. Status: ${response.status}`);
    const scoreMap = parseScoresCSV(await response.text());
    departments = departmentBank.map((department) => ({
      ...department,
      score: scoreMap.has(department.id) ? clampScore(Number(scoreMap.get(department.id))) : 0,
    }));
  } catch (error) {
    console.warn("Could not load scores.csv. Falling back to zero scores.", error);
  }
}

function parseScoresCSV(csvText) {
  const scoreMap = new Map();
  const lines = csvText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    const [id, score] = line.split(",").map((cell) => cell.trim());
    if (!id || id.toLowerCase() === "id") continue;
    if (score === undefined || score === "" || Number.isNaN(Number(score))) continue;
    scoreMap.set(id, Number(score));
  }
  return scoreMap;
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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRankClass(teamId) {
  const rankedDepartments = [...departments].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  const rankIndex = rankedDepartments.findIndex((department) => department.id === teamId);
  if (rankIndex === 0) return "rank-gold";
  if (rankIndex === 1) return "rank-silver";
  if (rankIndex === 2) return "rank-bronze";
  return "";
}

function getRankStyle(rankClass) {
  if (rankClass === "rank-gold") return "box-shadow:0 0 0 2px rgba(215,180,106,.95),0 0 16px rgba(255,215,0,.95),0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-silver") return "box-shadow:0 0 0 2px rgba(226,232,240,.95),0 0 14px rgba(226,232,240,.95),0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-bronze") return "box-shadow:0 0 0 2px rgba(205,127,50,.95),0 0 14px rgba(205,127,50,.9),0 10px 18px rgba(15,23,42,.28);";
  return "";
}

function makeIcon(body, badge = "") {
  return `
    <svg width="100%" height="100%" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="28" fill="#082b49" stroke="#d7b46a" stroke-width="4"/>
      <circle cx="32" cy="32" r="21" fill="rgba(103,213,223,0.16)" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
      ${body}
      ${badge}
    </svg>`;
}

function bohBadge() {
  return `
    <g>
      <circle cx="49" cy="49" r="13" fill="#082b49" stroke="#d7b46a" stroke-width="3"/>
      <text x="49" y="55" text-anchor="middle" font-size="16" font-weight="900" fill="#ffffff" font-family="Arial, sans-serif">B</text>
    </g>`;
}

function iconSvg(teamId) {
  const isBoh = teamId.endsWith("-boh");
  const badge = isBoh ? bohBadge() : "";
  let baseId = teamId.replace("-boh", "");
  if (baseId === "windows-ird") baseId = "ird";
  if (baseId === "banquets") baseId = "banquets-foh";

  const icons = {
    "elate": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M16 27h29v12c0 8-6 14-14 14S16 47 16 39V27z"/>
      <path fill="none" stroke="#d7b46a" stroke-width="3" d="M45 31h5c5 0 5 9 0 9h-5"/>
      <ellipse cx="30.5" cy="27" rx="16" ry="5" fill="#082b49" stroke="#d7b46a" stroke-width="3"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M23 24c3-4 6-4 9 0 3-4 6-4 9 0"/>
    `, badge),
    "pier-top": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M28 12h8l3 12v28H25V24l3-12z"/>
      <path fill="#67d5df" d="M29 25h6v25h-6z" opacity=".85"/>
      <path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M18 24h28c2 0 5 6 4 9H14c-1-3 2-9 4-9z"/>
      <path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M18 21h28M32 6v8M23 19l-4-5M41 19l4-5"/>
    `, badge),
    "pool": () => makeIcon(`
      <path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M12 39c7-7 13-7 20 0s13 7 20 0v10c-7 7-13 7-20 0s-13-7-20 0V39z"/>
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M20 24c8-9 16-9 24 0-5-1-8 0-12 3-4-3-7-4-12-3z"/>
      <path fill="none" stroke="#082b49" stroke-width="3" stroke-linecap="round" d="M32 26v17"/>
      <circle cx="48" cy="28" r="6" fill="#d7b46a"/>
      <path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" d="M16 47c5-4 9-4 14 0M34 47c5 4 9 4 14 0"/>
    `, badge),
    "reservations": () => makeIcon(`
      <rect x="17" y="18" width="30" height="33" rx="5" fill="#f7efe2" stroke="#d7b46a" stroke-width="3"/>
      <path fill="#d7b46a" d="M17 24h30v8H17z"/>
      <path fill="none" stroke="#082b49" stroke-width="2" d="M23 37h6M35 37h6M23 44h6M35 44h6"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M24 15v7M40 15v7"/>
    `, badge),
    "bell-service": () => makeIcon(`
      <path fill="#d7b46a" stroke="#ffffff" stroke-width="2" d="M32 15c-9 0-16 7-16 17h32c0-10-7-17-16-17z"/>
      <path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M13 33h38v8H13z"/>
      <path fill="#d7b46a" d="M29 9h6v7h-6z"/><circle cx="32" cy="8" r="4" fill="#d7b46a"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M19 48h26"/>
    `, badge),
    "ird": () => makeIcon(`
      <path fill="#cbd5e1" stroke="#ffffff" stroke-width="2" d="M18 39c2-10 9-16 14-16s12 6 14 16H18z"/>
      <path fill="#64748b" stroke="#d7b46a" stroke-width="3" d="M12 39h40v6H12z"/>
      <path fill="#cbd5e1" d="M30 18h4v6h-4z"/><circle cx="32" cy="17" r="3.5" fill="#cbd5e1"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M19 49h26"/>
    `, badge),
    "housekeeping": () => makeIcon(`
      <path fill="#d7b46a" d="M18 49l22-28 5 4-22 28z"/>
      <path fill="#67d5df" stroke="#ffffff" stroke-width="2" d="M35 17c11 4 14 10 9 19-10-3-14-10-9-19z"/>
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="2" d="M28 24c8 5 10 12 4 20-8-5-10-12-4-20z"/>
      <path fill="none" stroke="#082b49" stroke-width="2" stroke-linecap="round" d="M39 22l-9 18M44 25L33 42"/>
    `, badge),
    "security": () => makeIcon(`
      <path fill="#94a3b8" stroke="#d7b46a" stroke-width="3" d="M16 27h22l6-6v25H16z"/>
      <circle cx="27" cy="36" r="8" fill="#082b49" stroke="#ffffff" stroke-width="3"/>
      <circle cx="27" cy="36" r="3" fill="#67d5df"/>
      <path fill="#d7b46a" d="M44 29l9-5v18l-9-5z"/>
    `, badge),
    "guest-services": () => makeIcon(`
      <circle cx="23" cy="29" r="10" fill="#082b49" stroke="#d7b46a" stroke-width="4"/>
      <circle cx="23" cy="29" r="4" fill="#ffffff"/>
      <path fill="none" stroke="#d7b46a" stroke-width="5" stroke-linecap="round" d="M32 29h21"/>
      <path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M44 29v8M52 29v6"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 50h35"/>
    `, badge),
    "garni": () => makeIcon(`
      <ellipse cx="26" cy="35" rx="11" ry="15" fill="#ffffff" stroke="#d7b46a" stroke-width="3" transform="rotate(-18 26 35)"/>
      <circle cx="27" cy="37" r="5" fill="#f59e0b"/>
      <path fill="#d7b46a" stroke="#f7efe2" stroke-width="2" d="M37 22c10 3 13 10 8 19-9-3-13-10-8-19z"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 52h32"/>
    `, badge),
    "pastry": () => makeIcon(`
      <path fill="#d9892b" stroke="#d7b46a" stroke-width="3" d="M13 38c8-18 30-23 41-8-10 0-17 4-22 13-7-7-13-8-19-5z"/>
      <path fill="none" stroke="#f7efe2" stroke-width="3" stroke-linecap="round" d="M21 34c7-6 14-8 23-5M28 40c5-5 9-7 15-7"/>
    `, badge),
    "sotogrande": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M19 48V29c0-8 6-14 13-14s13 6 13 14v19H19z"/>
      <path fill="#67d5df" d="M25 48V31c0-4 3-7 7-7s7 3 7 7v17H25z"/>
      <path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M17 51h31M21 25h23"/>
      <circle cx="47" cy="19" r="5" fill="#f59e0b"/>
    `, badge),
    "saltbreeze": () => makeIcon(`
      <path fill="#f59e0b" stroke="#f7efe2" stroke-width="2" d="M16 38c8-13 24-17 35-8-11 2-19 8-24 19-4-6-7-9-11-11z"/>
      <path fill="none" stroke="#22c55e" stroke-width="4" stroke-linecap="round" d="M35 20c4-8 10-10 17-6M34 21c-7-7-14-6-20 0"/>
      <path fill="none" stroke="#67d5df" stroke-width="4" stroke-linecap="round" d="M17 50c7-4 13-4 20 0 5 3 9 3 14 0"/>
    `, badge),
    "calusso": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M32 10c13 6 20 16 18 34H14c-2-18 5-28 18-34z"/>
      <path fill="none" stroke="#082b49" stroke-width="3" stroke-linecap="round" d="M32 14v30M23 18l6 26M41 18l-6 26M17 29l11 15M47 29L36 44"/>
      <path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M17 45h30"/>
      <path fill="none" stroke="#67d5df" stroke-width="3" stroke-linecap="round" d="M17 51c7-4 13-4 20 0 5 3 9 3 14 0"/>
    `, badge),
    "nectar": () => makeIcon(`
      <path fill="#22c55e" stroke="#d7b46a" stroke-width="3" d="M49 12C29 12 17 25 18 47c20 0 32-13 31-35z"/>
      <path fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" d="M22 44c8-11 15-18 24-28"/>
      <path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M20 31h18l-3 22H23l-3-22z" opacity=".8"/>
    `, badge),
    "spa": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M32 13c7 7 8 14 0 23-8-9-7-16 0-23z"/>
      <path fill="#67d5df" stroke="#d7b46a" stroke-width="3" d="M17 25c10 1 16 6 15 18-11-2-16-8-15-18zM47 25c-10 1-16 6-15 18 11-2 16-8 15-18z"/>
      <circle cx="32" cy="34" r="5" fill="#f472b6" stroke="#ffffff" stroke-width="2"/>
      <path fill="none" stroke="#082b49" stroke-width="4" stroke-linecap="round" d="M17 49h30"/>
    `, badge),
    "stewarding": () => makeIcon(`
      <circle cx="30" cy="31" r="18" fill="#ffffff" stroke="#d7b46a" stroke-width="4"/>
      <circle cx="30" cy="31" r="10" fill="none" stroke="#67d5df" stroke-width="3"/>
      <path fill="none" stroke="#082b49" stroke-width="4" stroke-linecap="round" d="M45 16v30M51 16v30"/>
      <path fill="none" stroke="#d7b46a" stroke-width="3" stroke-linecap="round" d="M15 52h33"/>
    `, badge),
    "engineering": () => makeIcon(`
      <circle cx="25" cy="31" r="10" fill="none" stroke="#d7b46a" stroke-width="5"/>
      <circle cx="25" cy="31" r="4" fill="#67d5df"/>
      <circle cx="42" cy="38" r="8" fill="none" stroke="#d7b46a" stroke-width="4"/>
      <circle cx="42" cy="38" r="3" fill="#f7efe2"/>
      <path fill="none" stroke="#f7efe2" stroke-width="3" stroke-linecap="round" d="M25 15v6M25 41v6M9 31h6M35 31h5M17 23l4 4M33 39l4 4"/>
    `, badge),
    "front-office": () => makeIcon(`
      <path fill="#f7efe2" stroke="#d7b46a" stroke-width="3" d="M13 33h38v18H13z"/>
      <path fill="#082b49" stroke="#d7b46a" stroke-width="3" d="M18 19h28v14H18z"/>
      <path fill="#67d5df" d="M22 24h20v5H22z"/>
      <circle cx="32" cy="42" r="4" fill="#d7b46a"/>
    `, badge),
    "banquets-foh": () => makeIcon(`
      <path fill="#d7b46a" d="M22 12h20l-3 20H25L22 12z"/>
      <path fill="#67d5df" d="M25 17h14l-2 10H27z"/>
      <path fill="none" stroke="#d7b46a" stroke-width="4" stroke-linecap="round" d="M32 32v18M23 52h18"/>
      <circle cx="46" cy="38" r="8" fill="#ffffff" stroke="#d7b46a" stroke-width="3"/>
    `, badge),
  };

  return icons[baseId] ? icons[baseId]() : "";
}

function markerHtml(team, large = false) {
  const rankClass = getRankClass(team.id);
  const rankStyle = getRankStyle(rankClass);
  const icon = iconSvg(team.id);
  const initials = escapeHtml(getInitials(team.name));
  const sizeStyle = icon ? (large ? "width:46px;height:46px;font-size:0;" : "width:38px;height:38px;font-size:0;") : "";

  if (icon) {
    return `
      <div class="marker icon-marker ${large ? "large" : ""} ${team.color} ${rankClass}" style="${sizeStyle}${rankStyle}" title="${escapeHtml(team.name)} - ${team.score} pts">
        ${icon}
      </div>
    `;
  }

  return `<div class="marker ${large ? "large" : ""} ${team.color} ${rankClass}" style="${rankStyle}" title="${escapeHtml(team.name)} - ${team.score} pts">${initials}</div>`;
}

function tileHtml(space, teams) {
  const cornerClass = space.type === "corner" ? "corner" : "";
  const image = space.imageUrl
    ? `<img class="tile-img" src="${space.imageUrl}" alt="${escapeHtml(space.name)}" loading="eager" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><div class="image-error" style="display:none;position:absolute;inset:38px 8px 48px 8px;align-items:center;justify-content:center;text-align:center;padding:8px;border-radius:12px;background:rgba(0,0,0,0.45);color:white;font-size:10px;font-weight:900;line-height:1.25;z-index:4;">IMAGE NOT FOUND<br>${escapeHtml(space.imageUrl)}</div>`
    : "";
  return `
    <div class="tile ${cornerClass}">
      ${image}
      <div class="tile-overlay"></div>
      <div class="tile-ring"></div>
      <div class="tile-points">${space.points} PTS</div>
      <div class="tile-teams">${teams.map((team) => markerHtml(team)).join("")}</div>
      <div class="tile-name">${escapeHtml(space.name)}</div>
    </div>`;
}

function levelBottom(score) {
  const pct = Math.min(1, Math.max(0, (score - 100) / 10));
  return 48 + pct * 424;
}

function spireHtml() {
  const climbers = departments.filter((team) => team.score >= 100);
  const champion = climbers.length ? [...climbers].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0] : null;
  const levelLines = spireLevels.map((level) => `
    <div class="spire-level" style="bottom:${levelBottom(level)}px">
      <div class="spire-level-label ${level === 110 ? "crown" : ""}">${level}</div>
      <div class="spire-level-line"></div>
    </div>`).join("");
  const climberMarkers = climbers.map((team, index) => {
    const displayLevel = getDisplayedSpireLevel(team.score);
    const bottom = levelBottom(displayLevel) - 17;
    const sideOffset = index % 2 === 0 ? 214 : 52;
    return `<div class="spire-marker-wrap" style="bottom:${bottom}px; left:${sideOffset}px">${markerHtml(team, true)}</div>`;
  }).join("");
  const championHtml = champion
    ? `<div class="spire-champion">${markerHtml(champion)}<div><div class="champion-name">${escapeHtml(champion.name)}</div><div class="champion-score">${champion.score} pts shown at ${getDisplayedSpireLevel(champion.score)}</div></div></div>`
    : `<div class="champion-score" style="margin-top:8px">No department has reached 100 yet.</div>`;
  const legendRows = spireLevels.map((level) => {
    const teamsAtLevel = climbers.filter((team) => getDisplayedSpireLevel(team.score) === level);
    return `
      <div class="spire-legend-row">
        <div class="legend-level ${level === 110 ? "crown" : ""}">${level}</div>
        <div class="legend-label">${level === 110 ? "Crown" : level === 100 ? "Entry" : "Climb"}</div>
        <div class="legend-markers">${teamsAtLevel.map((team) => markerHtml(team)).join("")}</div>
      </div>`;
  }).join("");
  return `
    <div class="spire-card">
      <div class="spire-bg-one"></div><div class="spire-bg-two"></div><div class="spire-bg-three"></div>
      <div class="spire-layout">
        <div class="spire-info">
          <div class="spire-eyebrow">The Race to</div><h2 class="spire-title">The Spire</h2>
          <p class="spire-copy">Scores are loaded globally from scores.csv. Board and Spire tokens snap to the last completed threshold.</p>
          <div class="spire-top-box"><div class="spire-box-label">Current Top Climber</div>${championHtml}</div>
        </div>
        <div class="spire-tower">
          <div class="tower-glow"></div><div class="tower-spire"></div><div class="tower-neck"></div><div class="tower-top"></div>
          <div class="tower-body"><div class="tower-center-column"></div><div class="tower-fade"></div></div>
          <div class="tower-base-one"></div><div class="tower-base-two"></div>${levelLines}${climberMarkers}
        </div>
        <div class="spire-legend">${legendRows}</div>
      </div>
    </div>`;
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

function renderRankings() {
  const rankings = document.getElementById("rankings");
  const departmentCount = document.getElementById("departmentCount");
  departmentCount.textContent = `${departments.length} departments`;
  const rankedDepartments = [...departments].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  rankings.innerHTML = rankedDepartments.map((department, index) => {
    const rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;
    return `
      <div class="ranking-row ${index < 3 ? "top" : ""}">
        <div class="ranking-left">
          <div class="rank-badge">${rank}</div>${markerHtml(department)}
          <div class="ranking-name-wrap"><span class="ranking-name">${escapeHtml(department.name)}</span></div>
        </div>
        <span class="ranking-score">${department.score} pts</span>
      </div>`;
  }).join("");
}

function renderAll() {
  renderBoard();
  renderRankings();
}

async function init() {
  await loadScoresFromCSV();
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
