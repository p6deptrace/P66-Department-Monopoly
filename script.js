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
  const white = "#ffffff";

  if (teamId === "elate") {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path fill="${white}" d="M14 24h32v13c0 9-7 16-16 16S14 46 14 37V24z"/>
        <path fill="none" stroke="${gold}" stroke-width="4" d="M46 29h4c5 0 5 10 0 10h-4"/>
        <path fill="none" stroke="${gold}" stroke-width="4" d="M14 24h32v13c0 9-7 16-16 16S14 46 14 37V24z"/>
        <ellipse cx="30" cy="24" rx="18" ry="6" fill="${navy}" stroke="${gold}" stroke-width="3"/>
        <path fill="none" stroke="${aqua}" stroke-width="3" stroke-linecap="round" d="M23 20c3-4 6-4 9 0 3-4 6-4 9 0"/>
        <path fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round" d="M19 54h27"/>
      </svg>`;
  }

  if (teamId === "pier-top") {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path fill="${white}" stroke="${gold}" stroke-width="3" d="M28 12h8l3 11v30H25V23l3-11z"/>
        <path fill="${aqua}" d="M29 24h6v26h-6z" opacity=".85"/>
        <path fill="${navy}" stroke="${gold}" stroke-width="3" d="M20 22h24c2 0 5 6 4 9H16c-1-3 2-9 4-9z"/>
        <path fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round" d="M18 20h28M32 6v8M23 18l-4-5M41 18l4-5"/>
        <path fill="${gold}" d="M30 3h4v8h-4z"/>
      </svg>`;
  }

  if (teamId === "pool") {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path fill="${aqua}" stroke="${gold}" stroke-width="3" d="M12 39c7-7 13-7 20 0s13 7 20 0v10c-7 7-13 7-20 0s-13-7-20 0V39z"/>
        <path fill="${white}" stroke="${gold}" stroke-width="3" d="M19 23c9-10 17-10 26 0-5-2-8-1-13 2-5-3-8-4-13-2z"/>
        <path fill="none" stroke="${navy}" stroke-width="3" stroke-linecap="round" d="M32 25v18"/>
        <circle cx="48" cy="28" r="6" fill="${gold}"/>
        <path fill="none" stroke="${white}" stroke-width="3" stroke-linecap="round" d="M16 47c5-4 9-4 14 0M34 47c5 4 9 4 14 0"/>
      </svg>`;
  }

  if (teamId === "reservations") {
    return `
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path fill="${gold}" stroke="${white}" stroke-width="2" d="M32 15c-9 0-16 7-16 17h32c0-10-7-17-16-17z"/>
        <path fill="${navy}" stroke="${gold}" stroke-width="3" d="M13 33h38v8H13z"/>
        <path fill="${gold}" d="M29 9h6v7h-6z"/>
        <circle cx="32" cy="8" r="4" fill="${gold}"/>
        <path fill="none" stroke="${aqua}" stroke-width="3" stroke-linecap="round" d="M19 48h26"/>
        <path fill="${white}" d="M21 36h22v2H21z" opacity=".8"/>
      </svg>`;
  }

  return "";
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
