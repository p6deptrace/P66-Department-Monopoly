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

    if (!response.ok) {
      console.warn(`scores.csv could not be loaded. Status: ${response.status}`);
      return;
    }

    const csvText = await response.text();
    const scoreMap = parseScoresCSV(csvText);

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
    const columns = line.split(",").map((cell) => cell.trim());
    const id = columns[0];
    const score = columns[1];

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
  return name
    .replace("Windows/IRD", "Windows IRD")
    .split(/\s|\//)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 3)
    .toUpperCase();
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
  const rankedDepartments = [...departments].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name)
  );

  const rankIndex = rankedDepartments.findIndex((department) => department.id === teamId);

  if (rankIndex === 0) return "rank-gold";
  if (rankIndex === 1) return "rank-silver";
  if (rankIndex === 2) return "rank-bronze";

  return "";
}

function getRankStyle(rankClass) {
  if (rankClass === "rank-gold") return "box-shadow:0 0 0 2px rgba(215,180,106,.95), 0 0 16px rgba(255,215,0,.95), 0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-silver") return "box-shadow:0 0 0 2px rgba(226,232,240,.95), 0 0 14px rgba(226,232,240,.95), 0 10px 18px rgba(15,23,42,.28);";
  if (rankClass === "rank-bronze") return "box-shadow:0 0 0 2px rgba(205,127,50,.95), 0 0 14px rgba(205,127,50,.9), 0 10px 18px rgba(15,23,42,.28);";
  return "";
}

function iconSvg(teamId) {
  const gold = "#d7b46a";
  const navy = "#082b49";
  const aqua = "#67d5df";
  const cream = "#f7efe2";
  const white = "#ffffff";

  const isBoh = teamId.endsWith("-boh");
  const baseId = teamId
    .replace("-boh", "")
    .replace("windows-ird", "ird")
    .replace("banquets", "banquets-foh");

  const iconMap = {
    "elate": "☕",
    "nectar": "🍃",
    "pier-top": "♜",
    "pool": "◒",
    "spa": "✿",
    "calusso": "🐚",
    "reservations": "●",
    "ird": "◉",
    "garni": "🥐",
    "sotogrande": "◆",
    "saltbreeze": "✦",
    "security": "◆",
    "guest-services": "⚿",
    "bell-service": "▣",
    "pastry": "◕",
    "stewarding": "◎",
    "housekeeping": "✧",
    "engineering": "⚙",
    "front-office": "▰",
    "banquets-foh": "◈",
  };

  const accentMap = {
    "elate": "#f7efe2",
    "nectar": "#91c96b",
    "pier-top": "#67d5df",
    "pool": "#67d5df",
    "spa": "#9de2dd",
    "calusso": "#f7efe2",
    "reservations": "#d7b46a",
    "ird": "#f7efe2",
    "garni": "#f7b267",
    "sotogrande": "#2dd4bf",
    "saltbreeze": "#f59e0b",
    "security": "#94a3b8",
    "guest-services": "#d7b46a",
    "bell-service": "#facc15",
    "pastry": "#f9a8d4",
    "stewarding": "#d1d5db",
    "housekeeping": "#86efac",
    "engineering": "#fb923c",
    "front-office": "#7dd3fc",
    "banquets-foh": "#f0abfc",
  };

  const symbol = iconMap[baseId];
  if (!symbol) return "";

  const accent = accentMap[baseId] || cream;
  const bohBadge = isBoh
    ? `<g><circle cx="49" cy="49" r="11" fill="${navy}" stroke="${gold}" stroke-width="3"/><text x="49" y="54" text-anchor="middle" font-size="13" font-weight="900" fill="${white}" font-family="Arial, sans-serif">B</text></g>`
    : "";

  const extraIcon = (() => {
    if (baseId === "reservations") return `<path d="M20 36h24v7H20z" fill="${gold}"/><path d="M24 33c1-8 6-13 8-13s7 5 8 13H24z" fill="${gold}" stroke="${white}" stroke-width="2"/><circle cx="32" cy="18" r="4" fill="${gold}"/>`;
    if (baseId === "pool") return `<path d="M14 42c6-5 11-5 17 0s12 5 19 0" fill="none" stroke="${aqua}" stroke-width="6" stroke-linecap="round"/><path d="M20 28c8-9 16-9 24 0" fill="none" stroke="${gold}" stroke-width="5" stroke-linecap="round"/>`;
    if (baseId === "pier-top") return `<path d="M29 12h6l3 13v26H26V25z" fill="${cream}" stroke="${gold}" stroke-width="3"/><path d="M18 24h28c2 0 4 5 4 8H14c0-3 2-8 4-8z" fill="${navy}" stroke="${gold}" stroke-width="3"/>`;
    if (baseId === "elate") return `<path d="M17 27h28v12c0 8-6 14-14 14S17 47 17 39V27z" fill="${cream}" stroke="${gold}" stroke-width="3"/><path d="M45 31h5c4 0 4 8 0 8h-5" fill="none" stroke="${gold}" stroke-width="3"/><ellipse cx="31" cy="27" rx="15" ry="5" fill="${navy}" stroke="${gold}" stroke-width="3"/>`;
    return `<text x="32" y="40" text-anchor="middle" font-size="30" font-weight="900" fill="${accent}" font-family="Arial, sans-serif">${symbol}</text>`;
  })();

  return `
    <svg width="100%" height="100%" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="27" fill="${navy}" stroke="${gold}" stroke-width="4"/>
      <circle cx="32" cy="32" r="21" fill="rgba(103,213,223,0.18)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
      ${extraIcon}
      ${bohBadge}
    </svg>
  `;
}


function markerHtml(team, large = false) {
  const rankClass = getRankClass(team.id);
  const rankStyle = getRankStyle(rankClass);
  const icon = iconSvg(team.id);
  const initials = escapeHtml(getInitials(team.name));
  const sizeStyle = icon ? (large ? "width:44px;height:44px;font-size:0;" : "width:34px;height:34px;font-size:0;") : "";

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
    </div>
  `;
}

function levelBottom(score) {
  const pct = Math.min(1, Math.max(0, (score - 100) / 10));
  return 48 + pct * 424;
}

function spireHtml() {
  const climbers = departments.filter((team) => team.score >= 100);
  const champion = climbers.length
    ? [...climbers].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))[0]
    : null;

  const levelLines = spireLevels.map((level) => `
    <div class="spire-level" style="bottom:${levelBottom(level)}px">
      <div class="spire-level-label ${level === 110 ? "crown" : ""}">${level}</div>
      <div class="spire-level-line"></div>
    </div>
  `).join("");

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
      </div>
    `;
  }).join("");

  return `
    <div class="spire-card">
      <div class="spire-bg-one"></div>
      <div class="spire-bg-two"></div>
      <div class="spire-bg-three"></div>
      <div class="spire-layout">
        <div class="spire-info">
          <div class="spire-eyebrow">The Race to</div>
          <h2 class="spire-title">The Spire</h2>
          <p class="spire-copy">Scores are loaded globally from scores.csv. Board and Spire tokens snap to the last completed threshold.</p>
          <div class="spire-top-box">
            <div class="spire-box-label">Current Top Climber</div>
            ${championHtml}
          </div>
        </div>
        <div class="spire-tower">
          <div class="tower-glow"></div>
          <div class="tower-spire"></div>
          <div class="tower-neck"></div>
          <div class="tower-top"></div>
          <div class="tower-body"><div class="tower-center-column"></div><div class="tower-fade"></div></div>
          <div class="tower-base-one"></div>
          <div class="tower-base-two"></div>
          ${levelLines}
          ${climberMarkers}
        </div>
        <div class="spire-legend">${legendRows}</div>
      </div>
    </div>
  `;
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
          <div class="rank-badge">${rank}</div>
          ${markerHtml(department)}
          <div class="ranking-name-wrap">
            <span class="ranking-name">${escapeHtml(department.name)}</span>
          </div>
        </div>
        <span class="ranking-score">${department.score} pts</span>
      </div>
    `;
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
