"use strict";

const imagePath = (fileName) => `images/${fileName}`;

const boardSpaceData = [
  { name: "START", points: 0, type: "corner", fallback: "from-[#082b49] via-[#0b4775] to-[#67d5df]" },
  { name: "Lobby", points: 5, image: "lobby.webp", fallback: "from-[#0b4775] via-[#f7efe2] to-[#d7b46a]" },
  { name: "Marina", points: 10, image: "marina.webp", fallback: "from-[#076a82] via-[#67d5df] to-[#082b49]" },
  { name: "AVIVA", points: 15, image: "aviva.webp", fallback: "from-[#1f2937] via-[#0b4775] to-[#67d5df]" },
  { name: "Fitness Center", points: 20, image: "fitness-center.webp", fallback: "from-[#111827] via-[#475569] to-[#67d5df]" },
  { name: "Ballroom", points: 25, image: "ballroom.webp", fallback: "from-[#4b2e20] via-[#d7b46a] to-[#f7efe2]" },
  { name: "Azul", points: 30, image: "azul.webp", fallback: "from-[#082b49] via-[#0b4775] to-[#d6dfe3]" },
  { name: "Indigo", points: 35, image: "indigo.webp", fallback: "from-[#1e1b4b] via-[#4338ca] to-[#67d5df]" },
  { name: "Resort Pool", points: 40, image: "resort-pool.webp", fallback: "from-[#0891b2] via-[#67d5df] to-[#f7efe2]" },
  { name: "The Club", points: 45, type: "corner", image: "the-club.webp", fallback: "from-[#14532d] via-[#d7b46a] to-[#f7efe2]" },
  { name: "Presidential Suite", points: 50, image: "presidential-suite.webp", fallback: "from-[#4b5563] via-[#d7b46a] to-[#fff7e8]" },
  { name: "Kids Club", points: 55, image: "kids-club.webp", fallback: "from-[#84cc16] via-[#facc15] to-[#67d5df]" },
  { name: "Snow Room", points: 60, image: "snow-room.webp", fallback: "from-[#e5e7eb] via-[#f8fafc] to-[#94a3b8]" },
  { name: "Pier Top", points: 65, image: "pier-top.webp", fallback: "from-[#082b49] via-[#d7b46a] to-[#7c2d12]" },
  { name: "Guest Room", points: 70, image: "guest-room.webp", fallback: "from-[#64748b] via-[#f7efe2] to-[#0b4775]" },
  { name: "Valet Arrival", points: 75, image: "valet-arrival.webp", fallback: "from-[#f8fafc] via-[#d7b46a] to-[#082b49]" },
  { name: "Elate Cafe", points: 80, image: "elate-cafe.webp", fallback: "from-[#78350f] via-[#d7b46a] to-[#fff7e8]" },
  { name: "Villas", points: 85, image: "villas.webp", fallback: "from-[#0f766e] via-[#f7efe2] to-[#d7b46a]" },
  { name: "Spa Pool", points: 90, image: "spa-pool.webp", fallback: "from-[#0e7490] via-[#67d5df] to-[#f8fafc]" },
  { name: "Waterslides", points: 95, type: "corner", image: "waterslides.webp", fallback: "from-[#0284c7] via-[#67d5df] to-[#facc15]" },
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

const storageKey = "pier66-department-race-scores-v1";
let departments = loadDepartments();
let selectedDepartmentId = departments[0].id;

function loadDepartments() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");

    if (Array.isArray(saved)) {
      return departmentBank.map((department) => {
        const savedDepartment = saved.find((item) => item.id === department.id);

        return {
          ...department,
          score: savedDepartment ? clampScore(Number(savedDepartment.score)) : 0,
        };
      });
    }
  } catch (error) {
    console.warn("Could not load saved department scores", error);
  }

  return departmentBank.map((department) => ({ ...department, score: 0 }));
}

function saveDepartments() {
  localStorage.setItem(
    storageKey,
    JSON.stringify(departments.map(({ id, score }) => ({ id, score })))
  );
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

function getDisplayedLevel(score) {
  return score >= 100 ? getDisplayedSpireLevel(score) : getDisplayedBoardLevel(score);
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

function markerHtml(team, large = false) {
  return `
    <div class="marker ${large ? "large" : ""} ${team.color}" title="${escapeHtml(team.name)} - ${team.score} pts">
      ${escapeHtml(getInitials(team.name))}
    </div>
  `;
}

function tileHtml(space, teams) {
  const isStart = space.name === "START";
  const cornerClass = space.type === "corner" ? "corner" : "";

  const image =
    !isStart && space.imageUrl
      ? `${space.imageUrl}" loading="eager" onerror="this.style.display='none'" />`
      : "";

  const startVisual = isStart
    ? `
      <div class="start-visual">
        <div class="start-badge">
          <div class="start-arrow">▶</div>
          <div class="start-word">Begin</div>
        </div>
      </div>
    `
    : "";

  return `
    <div class="tile ${cornerClass}">
      ${startVisual}
      ${image}

      <div class="tile-overlay"></div>
      <div class="tile-ring"></div>

      <div class="tile-points">${space.points} PTS</div>

      <div class="tile-teams">
        ${teams.map((team) => markerHtml(team)).join("")}
      </div>

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

  const levelLines = spireLevels
    .map(
      (level) => `
        <div class="spire-level" style="bottom:${levelBottom(level)}px">
          <div class="spire-level-label ${level === 110 ? "crown" : ""}">${level}</div>
          <div class="spire-level-line"></div>
        </div>
      `
    )
    .join("");

  const climberMarkers = climbers
    .map((team, index) => {
      const displayLevel = getDisplayedSpireLevel(team.score);
      const bottom = levelBottom(displayLevel) - 17;
      const sideOffset = index % 2 === 0 ? 214 : 52;

      return `
        <div class="spire-marker-wrap" style="bottom:${bottom}px; left:${sideOffset}px">
          ${markerHtml(team, true)}
        </div>
      `;
    })
    .join("");

  const championHtml = champion
    ? `
      <div class="spire-champion">
        ${markerHtml(champion)}
        <div>
          <div class="champion-name">${escapeHtml(champion.name)}</div>
          <div class="champion-score">${champion.score} pts shown at ${getDisplayedSpireLevel(champion.score)}</div>
        </div>
      </div>
    `
    : `<div class="champion-score" style="margin-top:8px">No department has reached 100 yet.</div>`;

  const legendRows = spireLevels
    .map((level) => {
      const teamsAtLevel = climbers.filter((team) => getDisplayedSpireLevel(team.score) === level);

      return `
        <div class="spire-legend-row">
          <div class="legend-level ${level === 110 ? "crown" : ""}">${level}</div>
          <div class="legend-label">${level === 110 ? "Crown" : level === 100 ? "Entry" : "Climb"}</div>
          <div class="legend-markers">
            ${teamsAtLevel.map((team) => markerHtml(team)).join("")}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div class="spire-card">
      <div class="spire-bg-one"></div>
      <div class="spire-bg-two"></div>
      <div class="spire-bg-three"></div>

      <div class="spire-layout">
        <div class="spire-info">
          <div class="spire-eyebrow">The Race to</div>
          <h2 class="spire-title">The Spire</h2>
          <p class="spire-copy">Scores are logged exactly, while board and Spire tokens snap to the last completed threshold.</p>

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

          <div class="tower-body">
            <div class="tower-center-column"></div>
            <div class="tower-fade"></div>
          </div>

          <div class="tower-base-one"></div>
          <div class="tower-base-two"></div>

          ${levelLines}
          ${climberMarkers}
        </div>

        <div class="spire-legend">
          ${legendRows}
        </div>
      </div>
    </div>
  `;
}

function renderBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  boardSpaces.forEach((space) => {
    const gp = getGridPosition(space.id);

    const departmentsHere = departments.filter(
      (department) => getDisplayedBoardLevel(department.score) === space.points
    );

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

  const rankedDepartments = [...departments].sort(
    (a, b) => b.score - a.score || a.name.localeCompare(b.name)
  );

  rankings.innerHTML = rankedDepartments
    .map((department, index) => {
      const displayLevel = getDisplayedLevel(department.score);
      const rank = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

      return `
        <div class="ranking-row ${index < 3 ? "top" : ""}">
          <div class="ranking-left">
            <div class="rank-badge">${rank}</div>
            ${markerHtml(department)}

            <div class="ranking-name-wrap">
              <span class="ranking-name">${escapeHtml(department.name)}</span>
              ${
                department.score !== displayLevel
                  ? `<span class="ranking-shown">shown at ${displayLevel}</span>`
                  : ""
              }
            </div>
          </div>

          <span class="ranking-score">${department.score} pts</span>
        </div>
      `;
    })
    .join("");
}

function syncControls() {
  const select = document.getElementById("departmentSelect");
  const score = document.getElementById("scoreInput");

  select.innerHTML = departments
    .map((department) => `<option value="${department.id}">${escapeHtml(department.name)}</option>`)
    .join("");

  select.value = selectedDepartmentId;

  const selected = departments.find((department) => department.id === selectedDepartmentId) || departments[0];

  score.value = String(selected.score);
}

function renderAll() {
  syncControls();
  renderBoard();
  renderRankings();
}

function init() {
  const select = document.getElementById("departmentSelect");
  const score = document.getElementById("scoreInput");
  const move = document.getElementById("moveButton");
  const reset = document.getElementById("resetButton");

  select.addEventListener("change", () => {
    selectedDepartmentId = select.value;

    const selected = departments.find((department) => department.id === selectedDepartmentId);

    score.value = String(selected ? selected.score : 0);
  });

  score.addEventListener("blur", () => {
    score.value = String(clampScore(Number(score.value)));
  });

  score.addEventListener("keydown", (event) => {
    if (event.key === "Enter") move.click();
  });

  move.addEventListener("click", () => {
    const cleanScore = clampScore(Number(score.value));

    departments = departments.map((department) =>
      department.id === selectedDepartmentId ? { ...department, score: cleanScore } : department
    );

    saveDepartments();
    renderAll();
  });

  reset.addEventListener("click", () => {
    departments = departmentBank.map((department) => ({ ...department, score: 0 }));
    selectedDepartmentId = departments[0].id;

    saveDepartments();
    renderAll();
  });

  renderAll();
}

document.addEventListener("DOMContentLoaded", init);
