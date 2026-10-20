const SOUNDS = [
  { id: "rain", name: "Chuva suave", desc: "Garoa constante", icon: "cloud" },
  { id: "drizzle", name: "Garoa fina", desc: "Neblina úmida", icon: "cloud" },
  { id: "heavy", name: "Temporal", desc: "Chuva forte", icon: "storm" },
  { id: "roof", name: "No telhado", desc: "Gotas no zinco", icon: "roof" },
  { id: "tent", name: "Na barraca", desc: "Lona esticada", icon: "tent" },
  { id: "window", name: "Na janela", desc: "Chuva abafada", icon: "window" },
  { id: "gutter", name: "Calha", desc: "Água escorrendo", icon: "drop" },
  { id: "puddle", name: "Poças", desc: "Gotas na calçada", icon: "drop" },
  { id: "drip", name: "Pingos", desc: "Uma a uma", icon: "drop" },
  { id: "hail", name: "Granizo", desc: "Pedras no telhado", icon: "hail" },
  { id: "thunder", name: "Trovões", desc: "Tempestade média", icon: "bolt" },
  { id: "closeThunder", name: "Trovoada perto", desc: "Estalo e estrondo", icon: "bolt2" },
  { id: "distantThunder", name: "Trovoada longe", desc: "Rolar no horizonte", icon: "cloud2" },
  { id: "lightning", name: "Raios", desc: "Clarões secos", icon: "zap" },
  { id: "rumble", name: "Ribombar", desc: "Grave contínuo", icon: "wave2" },
  { id: "wind", name: "Vento", desc: "Brisa noturna", icon: "wind" },
  { id: "breeze", name: "Brisa suave", desc: "Ar da janela", icon: "wind" },
  { id: "leaves", name: "Folhas", desc: "Vento nas árvores", icon: "leaf" },
  { id: "chime", name: "Sinos de vento", desc: "Metal ao vento", icon: "chime" },
  { id: "river", name: "Riacho", desc: "Água correndo", icon: "wave" },
  { id: "waves", name: "Ondas", desc: "Mar distante", icon: "wave" },
  { id: "frogs", name: "Sapos", desc: "Lago à noite", icon: "frog" },
  { id: "fire", name: "Lareira", desc: "Lenha crepitando", icon: "fire" },
  { id: "crickets", name: "Grilos", desc: "Noite no campo", icon: "bug" },
  { id: "owl", name: "Coruja", desc: "Floresta tarde", icon: "owl" },
  { id: "forest", name: "Mata", desc: "Noite úmida", icon: "tree" },
  { id: "fan", name: "Ventilador", desc: "Zumbido calmo", icon: "fan" },
  { id: "clock", name: "Relógio", desc: "Tique-taque", icon: "clock" },
  { id: "train", name: "Trem longe", desc: "Trilhos na chuva", icon: "train" },
  { id: "purr", name: "Gato", desc: "Ronronar", icon: "cat" },
  { id: "snow", name: "Neve", desc: "Silêncio branco", icon: "snow" },
  { id: "brown", name: "Ruído marrom", desc: "Fundo profundo", icon: "wave2" },
  { id: "cafe", name: "Café silencioso", desc: "Murmúrio suave", icon: "cup" }
];

const GROUPS = [
  { id: "all", name: "Todos" },
  { id: "fav", name: "Favoritos" },
  { id: "rain", name: "Chuva", ids: ["rain", "drizzle", "heavy", "roof", "tent", "window", "gutter", "puddle", "drip", "hail"] },
  { id: "storm", name: "Trovoada", ids: ["thunder", "closeThunder", "distantThunder", "lightning", "rumble", "wind"] },
  { id: "nature", name: "Natureza", ids: ["breeze", "leaves", "chime", "river", "waves", "frogs", "crickets", "owl", "forest", "snow"] },
  { id: "home", name: "Casa", ids: ["fire", "fan", "clock", "train", "purr", "brown", "cafe"] }
];

const PRESETS = [
  { id: "sleep", name: "Pegar no sono", scene: "window", mix: { rain: 0.7, window: 0.35, brown: 0.25 } },
  { id: "storm", name: "Tempestade", scene: "storm", mix: { heavy: 0.75, thunder: 0.55, closeThunder: 0.4, lightning: 0.35, wind: 0.4 } },
  { id: "farstorm", name: "Temporal longe", scene: "window", mix: { rain: 0.55, distantThunder: 0.7, rumble: 0.45, window: 0.3 } },
  { id: "close", name: "Tempestade na janela", scene: "storm", mix: { heavy: 0.7, closeThunder: 0.8, lightning: 0.55, hail: 0.25, roof: 0.4 } },
  { id: "roof", name: "Noite no sótão", scene: "window", mix: { roof: 0.85, thunder: 0.25, wind: 0.2, drip: 0.2 } },
  { id: "cabin", name: "Cabana", scene: "cabin", mix: { rain: 0.45, fire: 0.7, wind: 0.25, window: 0.3 } },
  { id: "field", name: "Campo", scene: "forest", mix: { rain: 0.35, crickets: 0.5, owl: 0.35, wind: 0.2, forest: 0.25 } },
  { id: "forestn", name: "Floresta", scene: "forest", mix: { forest: 0.55, leaves: 0.45, owl: 0.4, rain: 0.3, river: 0.35 } },
  { id: "swamp", name: "Lago", scene: "forest", mix: { frogs: 0.7, drizzle: 0.4, crickets: 0.35, river: 0.3 } },
  { id: "coast", name: "Costa", scene: "ocean", mix: { waves: 0.7, rain: 0.35, wind: 0.45 } },
  { id: "street", name: "Rua molhada", scene: "street", mix: { heavy: 0.5, puddle: 0.65, distantThunder: 0.3, wind: 0.2 } },
  { id: "camp", name: "Acampamento", scene: "tent", mix: { tent: 0.8, rain: 0.45, fire: 0.4, wind: 0.25 } },
  { id: "snown", name: "Neve", scene: "snow", mix: { snow: 0.7, breeze: 0.35, fire: 0.4, wind: 0.15 } },
  { id: "trainn", name: "Viagem", scene: "window", mix: { train: 0.55, rain: 0.4, window: 0.3, brown: 0.2 } },
  { id: "deep", name: "Sono profundo", scene: "window", mix: { brown: 0.7, window: 0.5, rain: 0.25, rumble: 0.15 } },
  { id: "focus", name: "Ler e dormir", scene: "cabin", mix: { cafe: 0.35, rain: 0.55, brown: 0.2, clock: 0.15 } }
];

const SCENES = [
  { id: "window", name: "Janela" },
  { id: "storm", name: "Tempestade" },
  { id: "cabin", name: "Cabana" },
  { id: "forest", name: "Floresta" },
  { id: "ocean", name: "Mar" },
  { id: "street", name: "Cidade" },
  { id: "tent", name: "Barraca" },
  { id: "snow", name: "Neve" }
];

const ICONS = {
  cloud: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 17h10a4 4 0 0 0 0-8 6 6 0 0 0-11.3-1.7A3.5 3.5 0 0 0 7 17z"/><path d="M8 20v1M12 19v2M16 20v1"/></svg>',
  storm: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 16h9a4 4 0 0 0 0-8 6 6 0 0 0-11.3-1.7A3.5 3.5 0 0 0 7 16z"/><path d="m13 16-3 5h2l-1 3 4-6h-2l2-2"/></svg>',
  roof: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12 12 4l9 8"/><path d="M5 10v9h14v-9"/><path d="M9 19v-5h6v5"/></svg>',
  window: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M12 4v16"/></svg>',
  bolt: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2 4 14h7l-1 8 10-14h-8l1-6z"/></svg>',
  wind: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h12a3 3 0 1 0-3-3"/><path d="M4 8h7a2 2 0 1 0-2-2"/><path d="M4 16h14a3 3 0 1 1-3 3"/></svg>',
  fire: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-2 1.5-4 2.5-5.5C9 8 10 10 12 10c0-3 0-5 0-7z"/></svg>',
  bug: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="13" r="5"/><path d="M12 8V4M8 9 5 6M16 9l3-3M7 13H3M21 13h-4M8 17l-3 3M16 17l3 3"/></svg>',
  wave: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 15c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 4 0"/><path d="M3 10c2.5-3 4.5-3 7 0s4.5 3 7 0 4.5-3 4 0"/></svg>',
  wave2: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 14v-1a4 4 0 0 1 8 0v1a4 4 0 0 0 8 0V8"/></svg>',
  cup: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 7h10v6a4 4 0 0 1-8 0"/><path d="M15 8h2.5a2.5 2.5 0 0 1 0 5H15"/><path d="M7 19h8"/></svg>',
  drop: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11z"/></svg>',
  hail: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 14h10a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.5-1.5A3.5 3.5 0 0 0 7 14z"/><path d="M8 18v.01M12 17v.01M16 18v.01M10 21v.01M14 21v.01"/></svg>',
  bolt2: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2 7 12h5l-2 10 9-14h-6l2-6z"/></svg>',
  cloud2: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 17h11a3.5 3.5 0 0 0 0-7 5.5 5.5 0 0 0-10.4-1.6A3 3 0 0 0 6 17z"/><path d="M8 20h.01M12 21h.01M16 20h.01"/></svg>',
  zap: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2 4 14h7l-1 8 10-14h-8l1-6z"/></svg>',
  leaf: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 19c8-1 13-8 14-15-8 1-14 7-14 15z"/><path d="M5 19c3-5 7-8 12-10"/></svg>',
  owl: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="11" r="2"/><circle cx="15" cy="11" r="2"/><path d="M4 10c1-5 16-5 16 0v6a4 4 0 0 1-8 1 4 4 0 0 1-8-1z"/></svg>',
  tree: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22v-6"/><path d="M12 16 7 10h10L12 16z"/><path d="M12 11 8 6h8l-4 5z"/></svg>',
  tent: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4 3 20h18L12 4z"/><path d="M12 4v16"/></svg>',
  chime: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v3M8 8v8M12 8v10M16 8v6M6 8h12"/></svg>',
  frog: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="9" r="2"/><circle cx="16" cy="9" r="2"/><path d="M5 14c2 4 12 4 14 0"/><path d="M8 11c2 2 6 2 8 0"/></svg>',
  fan: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 9c4-6 9-1 3 3M12 15c-4 6-9 1-3-3M15 12c6 4 1 9-3-3M9 12C3 8 8 3 12 9"/></svg>',
  clock: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
  train: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="5" width="16" height="10" rx="2"/><path d="M8 19h.01M16 19h.01M4 12h16"/></svg>',
  cat: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 10 4 5l5 3 3-2 3 2 5-3-2 5"/><ellipse cx="12" cy="14" rx="7" ry="5"/></svg>',
  snow: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3v18M5 7l14 10M19 7 5 17"/><circle cx="12" cy="12" r="2"/></svg>'
};

const STORE = "sereno-state-v4";
const levels = Object.fromEntries(SOUNDS.map((s) => [s.id, 0]));
let playing = false;
let activePreset = null;
let activeScene = "window";
let activeGroup = "rain";
let timerId = null;
let timerEnds = 0;
let fadeMs = 60000;
let waking = false;
let wakeLock = null;
let bgKeep = true;
let favorites = [];
let customPresets = [];
let historyMixes = [];
let idleTimer = null;
let eqLow = 0;
let eqHigh = 0;
let stereo = 0.4;
let living = false;
let livingId = null;
let rampMin = 60;
let lockAmbient = false;
let alarmOn = false;
let alarmTime = "07:00";
let alarmFade = 60000;
let alarmId = null;
let syncCode = "";
let syncTimer = null;
let baseMix = null;
let playStartedAt = 0;
let dimOn = false;

const grid = document.getElementById("sound-grid");
const presetRow = document.getElementById("preset-row");
const sceneRow = document.getElementById("scene-row");
const groupRow = document.getElementById("group-row");
const playBtn = document.getElementById("play-btn");
const nowPlaying = document.getElementById("now-playing");
const master = document.getElementById("master");
const timerBtn = document.getElementById("timer-btn");
const timerLabel = document.getElementById("timer-label");
const timerSheet = document.getElementById("timer-sheet");
const timerGrid = document.getElementById("timer-grid");
const dimBtn = document.getElementById("dim-btn");
const bgBtn = document.getElementById("bg-btn");
const bgLabel = document.getElementById("bg-label");
const untilTime = document.getElementById("until-time");
const keepalive = document.getElementById("keepalive");
const moreBtn = document.getElementById("more-btn");
const moreSheet = document.getElementById("more-sheet");

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || "null");
    if (!s) return;
    if (s.levels) Object.keys(levels).forEach((id) => { if (typeof s.levels[id] === "number") levels[id] = s.levels[id]; });
    if (s.activePreset) activePreset = s.activePreset;
    if (s.activeScene) activeScene = s.activeScene;
    if (s.activeGroup) activeGroup = s.activeGroup;
    if (typeof s.master === "number") master.value = String(Math.round(s.master * 100));
    if (typeof s.fadeMs === "number") fadeMs = s.fadeMs;
    if (typeof s.bgKeep === "boolean") bgKeep = s.bgKeep;
    if (Array.isArray(s.favorites)) favorites = s.favorites.filter((id) => levels[id] !== undefined);
    if (Array.isArray(s.customPresets)) customPresets = s.customPresets;
    if (s.until) untilTime.value = s.until;
    if (s.dim) {
      dimOn = true;
      document.body.classList.add("dim");
      dimBtn.setAttribute("aria-pressed", "true");
    }
    if (typeof s.eqLow === "number") eqLow = s.eqLow;
    if (typeof s.eqHigh === "number") eqHigh = s.eqHigh;
    if (typeof s.stereo === "number") stereo = s.stereo;
    if (typeof s.living === "boolean") living = s.living;
    if (typeof s.rampMin === "number") rampMin = s.rampMin;
    if (typeof s.lockAmbient === "boolean") lockAmbient = s.lockAmbient;
    if (typeof s.alarmOn === "boolean") alarmOn = s.alarmOn;
    if (s.alarmTime) alarmTime = s.alarmTime;
    if (typeof s.alarmFade === "number") alarmFade = s.alarmFade;
    if (Array.isArray(s.historyMixes)) historyMixes = s.historyMixes.slice(0, 8);
    if (s.syncCode) syncCode = String(s.syncCode).toUpperCase();
  } catch (_) {}
}

function persist() {
  try {
    localStorage.setItem(STORE, JSON.stringify({
      levels,
      activePreset,
      activeScene,
      activeGroup,
      master: Number(master.value) / 100,
      fadeMs,
      bgKeep,
      favorites,
      customPresets,
      until: untilTime.value,
      dim: dimOn,
      eqLow, eqHigh, stereo, living, rampMin, lockAmbient,
      alarmOn, alarmTime, alarmFade, historyMixes, syncCode
    }));
    try {
      if (window.SerenoAndroid && SerenoAndroid.saveSnapshot) {
        SerenoAndroid.saveSnapshot(JSON.stringify({ mix: currentMix(), scene: activeScene, preset: activePreset }));
      }
    } catch (_) {}
  } catch (_) {}
}

function visibleSounds() {
  const g = GROUPS.find((x) => x.id === activeGroup) || GROUPS[0];
  if (g.id === "all") return SOUNDS;
  if (g.id === "fav") return SOUNDS.filter((s) => favorites.includes(s.id));
  return SOUNDS.filter((s) => g.ids.includes(s.id));
}

function renderGroups() {
  groupRow.innerHTML = GROUPS.map((g) =>
    `<button class="group-chip${g.id === activeGroup ? " active" : ""}" data-group="${g.id}">${g.name}</button>`
  ).join("");
}

function renderSounds() {
  const list = visibleSounds();
  if (!list.length) {
    grid.innerHTML = `<p class="empty-fav">Toque na estrela de um som para guardá-lo aqui.</p>`;
    return;
  }
  grid.innerHTML = list.map((s) => `
    <article class="sound" data-id="${s.id}">
      <button class="fav${favorites.includes(s.id) ? " on" : ""}" data-fav="${s.id}" aria-label="Favorito">
        <svg viewBox="0 0 24 24" fill="${favorites.includes(s.id) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.6"><path d="M12 4.5 14.4 9l5 .7-3.6 3.5.9 5L12 16.2 7.3 18.2l.9-5L4.6 9.7l5-.7z"/></svg>
      </button>
      ${ICONS[s.icon]}
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <input type="range" min="0" max="100" value="${Math.round(levels[s.id] * 100)}" data-vol="${s.id}" />
    </article>
  `).join("");
}

function allPresets() {
  return customPresets.concat(PRESETS);
}

function renderPresets() {
  const mine = customPresets.map((p) =>
    `<button class="preset custom" data-preset="${p.id}" title="Segure para apagar">${p.name}</button>`
  ).join("");
  const rest = PRESETS.map((p) =>
    `<button class="preset" data-preset="${p.id}">${p.name}</button>`
  ).join("");
  presetRow.innerHTML = mine + rest;
}

function renderScenes() {
  sceneRow.innerHTML = SCENES.map((s) =>
    `<button class="scene-card" data-scene="${s.id}"><i class="mini-scene sc-${s.id}"></i><span>${s.name}</span></button>`
  ).join("");
}

function nativePlaying(on) {
  try {
    if (window.SerenoAndroid && SerenoAndroid.setPlaying) SerenoAndroid.setPlaying(!!on);
  } catch (_) {}
}

function updateCards() {
  document.querySelectorAll(".sound").forEach((el) => {
    const id = el.dataset.id;
    el.classList.toggle("on", levels[id] > 0.01);
    const slider = el.querySelector("input");
    if (slider && Number(slider.value) !== Math.round(levels[id] * 100)) {
      slider.value = Math.round(levels[id] * 100);
    }
  });
  document.querySelectorAll(".preset").forEach((el) => {
    el.classList.toggle("active", el.dataset.preset === activePreset);
  });
  document.querySelectorAll(".scene-card").forEach((el) => {
    el.classList.toggle("active", el.dataset.scene === activeScene);
  });
  document.querySelectorAll(".group-chip").forEach((el) => {
    el.classList.toggle("active", el.dataset.group === activeGroup);
  });
  const on = SOUNDS.filter((s) => levels[s.id] > 0.01).map((s) => s.name);
  if (!playing) nowPlaying.textContent = "Toque para começar a chuva";
  else if (!on.length) nowPlaying.textContent = "Silêncio — escolha um som";
  else nowPlaying.textContent = on.slice(0, 3).join(" · ");

  const rainPower = Math.max(levels.rain || 0, levels.heavy || 0, levels.roof || 0, levels.window || 0, levels.hail || 0, levels.puddle || 0, levels.drizzle || 0, levels.tent || 0);
  const stormPower = Math.max(levels.thunder || 0, levels.closeThunder || 0, levels.lightning || 0, levels.distantThunder || 0);
  SerenoVisual.setIntensity(playing ? 0.2 + rainPower * 0.8 + stormPower * 0.25 : 0.18);
  SerenoVisual.setScene(activeScene);
  updateMediaSession();
  persist();
}

async function start() {
  await AudioEngine.resume();
  playing = true;
  playStartedAt = Date.now();
  playBtn.classList.add("playing");
  applyTone();
  AudioEngine.setMaster(Number(master.value) / 100);
  AudioEngine.setRamp(1);
  Object.entries(levels).forEach(([id, v]) => AudioEngine.set(id, v));
  baseMix = currentMix();
  startKeepalive();
  requestWake();
  nativePlaying(true);
  startLiving();
  bumpIdle();
  updateCards();
}

function pause() {
  playing = false;
  playBtn.classList.remove("playing");
  stopLiving();
  AudioEngine.stopAll();
  AudioEngine.setRamp(1);
  stopKeepalive();
  releaseWake();
  nativePlaying(false);
  document.body.classList.remove("ambient", "locked");
  document.getElementById("wake-banner").hidden = true;
  updateCards();
}

function applyMix(mix, presetId, sceneId) {
  SOUNDS.forEach((s) => { levels[s.id] = mix[s.id] || 0; });
  activePreset = presetId || null;
  if (sceneId) activeScene = sceneId;
  baseMix = currentMix();
  if (playing) SOUNDS.forEach((s) => AudioEngine.set(s.id, levels[s.id]));
  pushHistory();
  renderHistory();
  updateCards();
}

function currentMix() {
  const mix = {};
  SOUNDS.forEach((s) => { if (levels[s.id] > 0.01) mix[s.id] = +levels[s.id].toFixed(2); });
  return mix;
}

function encodeMix(mix, scene) {
  const ids = SOUNDS.map((s) => s.id);
  const parts = Object.keys(mix).map((id) => {
    const i = ids.indexOf(id);
    if (i < 0) return "";
    return i.toString(36) + Math.round(mix[id] * 20).toString(36);
  }).filter(Boolean);
  return btoa(scene + "|" + parts.join(",")).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function decodeMix(raw) {
  try {
    const pad = raw.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (raw.length % 4)) % 4);
    const txt = atob(pad);
    const [scene, rest] = txt.split("|");
    const ids = SOUNDS.map((s) => s.id);
    const mix = {};
    (rest || "").split(",").forEach((p) => {
      if (!p) return;
      const i = parseInt(p[0], 36);
      const v = parseInt(p.slice(1), 36) / 20;
      if (ids[i]) mix[ids[i]] = Math.min(1, Math.max(0, v));
    });
    return { mix, scene: scene || "window" };
  } catch (_) {
    return null;
  }
}

function pushHistory() {
  const mix = currentMix();
  if (!Object.keys(mix).length) return;
  const key = JSON.stringify(mix);
  historyMixes = historyMixes.filter((h) => JSON.stringify(h.mix) !== key);
  historyMixes.unshift({ t: Date.now(), scene: activeScene, mix, name: activePreset ? (allPresets().find((p) => p.id === activePreset) || {}).name || "Mix" : "Mix" });
  historyMixes = historyMixes.slice(0, 8);
}

function renderHistory() {
  const el = document.getElementById("history-list");
  if (!el) return;
  if (!historyMixes.length) {
    el.innerHTML = `<p class="hint">Ainda sem mixes recentes.</p>`;
    return;
  }
  el.innerHTML = historyMixes.map((h, i) => {
    const n = Object.keys(h.mix).length;
    const when = new Date(h.t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return `<button class="hist-item" data-h="${i}"><span>${h.name}</span><small>${n} sons · ${when}</small></button>`;
  }).join("");
}

function applyTone() {
  AudioEngine.setEq(eqLow, eqHigh);
  AudioEngine.setStereo(stereo);
}

function livingTick() {
  if (!playing || !living || !baseMix) return;
  const t = Date.now() / 1000;
  const wave = 0.78 + Math.sin(t / 38) * 0.18 + Math.sin(t / 17) * 0.08;
  ["rain", "heavy", "roof", "window", "drizzle", "tent", "wind", "thunder", "closeThunder", "distantThunder", "lightning", "rumble", "hail"].forEach((id) => {
    if (baseMix[id] == null) return;
    let v = baseMix[id] * wave;
    if (id === "lightning" || id === "closeThunder") v *= 0.7 + Math.sin(t / 11) * 0.3;
    AudioEngine.set(id, Math.max(0, Math.min(1, v)));
    levels[id] = v;
  });
  const rainPower = Math.max(levels.rain || 0, levels.heavy || 0, levels.roof || 0);
  SerenoVisual.setIntensity(0.2 + rainPower * 0.85);
}

function startLiving() {
  stopLiving();
  if (!living) return;
  baseMix = currentMix();
  livingId = setInterval(livingTick, 1200);
}

function stopLiving() {
  if (livingId) clearInterval(livingId);
  livingId = null;
}

function applyRamp() {
  if (!playing || !rampMin) {
    AudioEngine.setRamp(1);
    return;
  }
  const elapsed = Date.now() - playStartedAt;
  const span = rampMin * 60 * 1000;
  const mul = elapsed >= span ? 0.4 : 1 - (elapsed / span) * 0.6;
  AudioEngine.setRamp(mul);
}

function scheduleAlarm() {
  if (alarmId) clearTimeout(alarmId);
  alarmId = null;
  if (!alarmOn) return;
  const ms = msUntilClock(alarmTime);
  alarmId = setTimeout(fireAlarm, ms);
  try {
    if (window.SerenoAndroid && SerenoAndroid.setAlarm) SerenoAndroid.setAlarm(alarmTime, true);
  } catch (_) {}
}

function cancelAlarmNative() {
  try {
    if (window.SerenoAndroid && SerenoAndroid.setAlarm) SerenoAndroid.setAlarm(alarmTime, false);
  } catch (_) {}
}

function fireAlarm() {
  document.body.classList.remove("ambient", "locked");
  document.getElementById("wake-banner").hidden = false;
  applyMix({ rain: 0.55, window: 0.35, brown: 0.22, breeze: 0.18 }, null, "window");
  AudioEngine.setRamp(0.15);
  ensurePlaying();
  const steps = 24;
  let i = 0;
  const tick = setInterval(() => {
    i += 1;
    AudioEngine.setRamp(0.15 + (0.85 * i) / steps);
    if (i >= steps) clearInterval(tick);
  }, Math.max(80, alarmFade / steps));
  toast("Bom dia");
}

function cloudPack() {
  return { favorites, customPresets, historyMixes, eqLow, eqHigh, stereo, living, rampMin, lockAmbient, alarmTime, fadeMs };
}

function applyCloud(data) {
  if (!data) return;
  if (Array.isArray(data.favorites)) favorites = data.favorites.filter((id) => levels[id] !== undefined);
  if (Array.isArray(data.customPresets)) customPresets = data.customPresets;
  if (Array.isArray(data.historyMixes)) historyMixes = data.historyMixes.slice(0, 8);
  if (typeof data.eqLow === "number") eqLow = data.eqLow;
  if (typeof data.eqHigh === "number") eqHigh = data.eqHigh;
  if (typeof data.stereo === "number") stereo = data.stereo;
  if (typeof data.living === "boolean") living = data.living;
  if (typeof data.rampMin === "number") rampMin = data.rampMin;
  if (typeof data.lockAmbient === "boolean") lockAmbient = data.lockAmbient;
  if (data.alarmTime) alarmTime = data.alarmTime;
  renderPresets();
  renderSounds();
  renderHistory();
  fillMore();
  updateCards();
}

function packAccount() {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(cloudPack())))).replace(/=+$/, "");
  } catch (_) {
    return "";
  }
}

function unpackAccount(raw) {
  try {
    const pad = raw + "=".repeat((4 - (raw.length % 4)) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(pad))));
  } catch (_) {
    return null;
  }
}

function accountUrl() {
  const u = new URL(location.href);
  u.search = "";
  u.searchParams.set("acc", packAccount());
  if (syncCode) u.searchParams.set("code", syncCode);
  return u.toString();
}

function newCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

function fillMore() {
  document.getElementById("eq-low").value = String(eqLow);
  document.getElementById("eq-high").value = String(eqHigh);
  document.getElementById("eq-low-val").textContent = (eqLow > 0 ? "+" : "") + eqLow;
  document.getElementById("eq-high-val").textContent = (eqHigh > 0 ? "+" : "") + eqHigh;
  document.getElementById("stereo").value = String(Math.round(stereo * 100));
  document.getElementById("stereo-val").textContent = Math.round(stereo * 100) + "%";
  document.getElementById("living-btn").setAttribute("aria-pressed", living ? "true" : "false");
  document.getElementById("lock-btn").setAttribute("aria-pressed", lockAmbient ? "true" : "false");
  dimBtn.setAttribute("aria-pressed", dimOn ? "true" : "false");
  document.getElementById("alarm-time").value = alarmTime;
  document.querySelectorAll("#alarm-fade .mini").forEach((b) => b.classList.toggle("active", Number(b.dataset.af) === alarmFade));
  document.querySelectorAll("#ramp-opts .mini").forEach((b) => b.classList.toggle("active", Number(b.dataset.ramp) === rampMin));
  document.getElementById("alarm-hint").textContent = alarmOn ? ("Despertar às " + alarmTime) : "Desliga a noite e acorda com chuva suave.";
  document.getElementById("sync-code").value = syncCode;
  document.getElementById("sync-hint").textContent = syncCode ? ("Código: " + syncCode) : "";
}

function ensurePlaying() {
  if (playing) return;
  const any = Object.values(levels).some((v) => v > 0);
  if (!any) applyMix(PRESETS[0].mix, PRESETS[0].id, PRESETS[0].scene);
  start();
}

function bumpIdle() {
  clearTimeout(idleTimer);
  if (!lockAmbient) document.body.classList.remove("ambient", "locked");
  idleTimer = setTimeout(() => {
    if (playing) {
      document.body.classList.add("ambient");
      if (lockAmbient) document.body.classList.add("locked");
    }
  }, 10000);
}

loadState();
untilTime.value = untilTime.value || "07:00";
renderGroups();
renderSounds();
renderPresets();
renderScenes();
renderHistory();
fillMore();
bgBtn.classList.toggle("active", bgKeep);
bgLabel.textContent = bgKeep ? "Ativo" : "Fundo";
document.querySelectorAll("#fade-opts .mini").forEach((b) => b.classList.toggle("active", Number(b.dataset.fade) === fadeMs));
updateCards();
if (alarmOn) scheduleAlarm();
setInterval(applyRamp, 15000);

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (splash) setTimeout(() => splash.classList.add("hide"), 700);
});

const qs = new URLSearchParams(location.search);
const urlPreset = qs.get("preset");
if (urlPreset) {
  const preset = allPresets().find((p) => p.id === urlPreset);
  if (preset) applyMix(preset.mix, preset.id, preset.scene);
}
const urlMix = qs.get("mix");
if (urlMix) {
  const decoded = decodeMix(urlMix);
  if (decoded && Object.keys(decoded.mix).length) applyMix(decoded.mix, null, decoded.scene);
}
const urlAcc = qs.get("acc");
if (urlAcc) {
  const data = unpackAccount(urlAcc);
  if (data) {
    applyCloud(data);
    toast("Conta restaurada neste aparelho");
  }
}
if (qs.get("code")) syncCode = qs.get("code").toUpperCase();
if (qs.get("play") === "1" || qs.get("wake") === "1") {
  window.addEventListener("load", () => {
    if (qs.get("wake") === "1") fireAlarm();
    else ensurePlaying();
  }, { once: true });
}

let deferredPrompt = null;
const installBtn = document.getElementById("install-btn");
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.hidden = false;
});
if (installBtn) {
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
}

groupRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".group-chip");
  if (!btn) return;
  activeGroup = btn.dataset.group;
  renderSounds();
  updateCards();
});

grid.addEventListener("input", (e) => {
  const id = e.target.dataset.vol;
  if (!id) return;
  levels[id] = Number(e.target.value) / 100;
  activePreset = null;
  if (playing) AudioEngine.set(id, levels[id]);
  else start();
  updateCards();
});

grid.addEventListener("click", (e) => {
  const fav = e.target.closest("[data-fav]");
  if (fav) {
    const id = fav.dataset.fav;
    if (favorites.includes(id)) favorites = favorites.filter((x) => x !== id);
    else favorites.push(id);
    renderSounds();
    updateCards();
    return;
  }
  const card = e.target.closest(".sound");
  if (!card || e.target.matches("input")) return;
  const id = card.dataset.id;
  levels[id] = levels[id] > 0.01 ? 0 : 0.65;
  activePreset = null;
  if (playing) AudioEngine.set(id, levels[id]);
  else start();
  updateCards();
});

presetRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".preset");
  if (!btn) return;
  const preset = allPresets().find((p) => p.id === btn.dataset.preset);
  if (!preset) return;
  applyMix(preset.mix, preset.id, preset.scene);
  if (!playing) start();
});

let holdT = null;
presetRow.addEventListener("pointerdown", (e) => {
  const btn = e.target.closest(".preset.custom");
  if (!btn) return;
  holdT = setTimeout(() => {
    customPresets = customPresets.filter((p) => p.id !== btn.dataset.preset);
    if (activePreset === btn.dataset.preset) activePreset = null;
    renderPresets();
    updateCards();
    toast("Mix apagado");
  }, 650);
});
["pointerup", "pointerleave", "pointercancel"].forEach((ev) => {
  presetRow.addEventListener(ev, () => clearTimeout(holdT));
});

sceneRow.addEventListener("click", (e) => {
  const btn = e.target.closest(".scene-card");
  if (!btn) return;
  activeScene = btn.dataset.scene;
  SerenoVisual.setScene(activeScene);
  updateCards();
});

function saveMixNow() {
  const mix = currentMix();
  if (!Object.keys(mix).length) {
    toast("Ligue algum som antes");
    return;
  }
  const n = customPresets.length + 1;
  const item = { id: "c" + Date.now(), name: "Meu mix " + n, scene: activeScene, mix };
  customPresets.unshift(item);
  activePreset = item.id;
  renderPresets();
  updateCards();
  toast("Mix salvo");
}

document.getElementById("save-mix").addEventListener("click", saveMixNow);

playBtn.addEventListener("click", () => {
  if (playing) pause();
  else ensurePlaying();
});

master.addEventListener("input", () => {
  AudioEngine.setMaster(Number(master.value) / 100);
  persist();
});

const TIMER_OPTS = [
  { label: "15 min", ms: 15 * 60 * 1000 },
  { label: "30 min", ms: 30 * 60 * 1000 },
  { label: "45 min", ms: 45 * 60 * 1000 },
  { label: "1 h", ms: 60 * 60 * 1000 },
  { label: "90 min", ms: 90 * 60 * 1000 },
  { label: "2 h", ms: 120 * 60 * 1000 },
  { label: "3 h", ms: 180 * 60 * 1000 },
  { label: "4 h", ms: 240 * 60 * 1000 },
  { label: "8 h", ms: 480 * 60 * 1000 }
];

timerGrid.innerHTML = TIMER_OPTS.map((o, i) =>
  `<button class="timer-opt" data-i="${i}">${o.label}</button>`
).join("");

function toast(msg) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2400);
}

function formatLeft(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function clearTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  timerEnds = 0;
  waking = false;
  timerLabel.textContent = "Timer";
  timerBtn.classList.remove("active");
}

function setTimer(ms) {
  clearTimer();
  timerEnds = Date.now() + ms;
  timerBtn.classList.add("active");
  const tick = () => {
    const left = timerEnds - Date.now();
    if (left <= 0) {
      clearTimer();
      pause();
      nowPlaying.textContent = "Boa noite.";
      updateMediaSession();
      return;
    }
    if (fadeMs > 0 && left <= fadeMs && playing && !waking) {
      waking = true;
      AudioEngine.fadeOutAll(left);
    }
    timerLabel.textContent = formatLeft(left);
  };
  tick();
  timerId = setInterval(tick, 1000);
}

function msUntilClock(hhmm) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  if (target.getTime() <= now.getTime() + 15000) target.setDate(target.getDate() + 1);
  return target.getTime() - now.getTime();
}

timerBtn.addEventListener("click", () => {
  timerSheet.hidden = false;
});
timerSheet.addEventListener("click", (e) => {
  if (e.target === timerSheet) timerSheet.hidden = true;
});
document.getElementById("timer-cancel").addEventListener("click", () => {
  clearTimer();
  timerSheet.hidden = true;
  toast("Timer desligado — a noite toda");
});
timerGrid.addEventListener("click", (e) => {
  const btn = e.target.closest(".timer-opt");
  if (!btn) return;
  setTimer(TIMER_OPTS[Number(btn.dataset.i)].ms);
  timerSheet.hidden = true;
  ensurePlaying();
});
document.getElementById("until-go").addEventListener("click", () => {
  if (!untilTime.value) {
    toast("Escolha um horário");
    return;
  }
  const ms = msUntilClock(untilTime.value);
  setTimer(ms);
  timerSheet.hidden = true;
  ensurePlaying();
  toast("Desliga às " + untilTime.value);
});
document.getElementById("fade-opts").addEventListener("click", (e) => {
  const btn = e.target.closest(".mini");
  if (!btn) return;
  fadeMs = Number(btn.dataset.fade);
  document.querySelectorAll("#fade-opts .mini").forEach((b) => b.classList.toggle("active", b === btn));
  persist();
});

function silentWav() {
  const sampleRate = 8000;
  const seconds = 2;
  const samples = sampleRate * seconds;
  const buffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(buffer);
  const write = (off, str) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)); };
  write(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  write(8, "WAVE");
  write(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, "data");
  view.setUint32(40, samples * 2, true);
  for (let i = 0; i < samples; i++) view.setInt16(44 + i * 2, i % 64 === 0 ? 1 : 0, true);
  return URL.createObjectURL(new Blob([buffer], { type: "audio/wav" }));
}

function startKeepalive() {
  if (!keepalive.src) keepalive.src = silentWav();
  keepalive.volume = 0.01;
  keepalive.play().catch(() => {});
}

function stopKeepalive() {
  keepalive.pause();
}

async function requestWake() {
  if (!bgKeep || !navigator.wakeLock) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {});
  } catch (_) {}
}

function releaseWake() {
  if (wakeLock) {
    wakeLock.release().catch(() => {});
    wakeLock = null;
  }
}

function updateMediaSession() {
  if (!("mediaSession" in navigator)) return;
  const on = SOUNDS.filter((s) => levels[s.id] > 0.01).map((s) => s.name);
  navigator.mediaSession.metadata = new MediaMetadata({
    title: playing ? (on[0] || "Sereno") : "Pausado",
    artist: "Sereno — chuva para dormir",
    album: on.slice(0, 3).join(" · ") || "Noite calma",
    artwork: [
      { src: "assets/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "assets/icons/icon-512.png", sizes: "512x512", type: "image/png" }
    ]
  });
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}

if ("mediaSession" in navigator) {
  navigator.mediaSession.setActionHandler("play", () => ensurePlaying());
  navigator.mediaSession.setActionHandler("pause", () => pause());
  navigator.mediaSession.setActionHandler("stop", () => pause());
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && playing) {
    AudioEngine.resume();
    if (bgKeep) requestWake();
  }
});

["pointerdown", "touchstart", "keydown", "scroll"].forEach((ev) => {
  document.addEventListener(ev, bumpIdle, { passive: true });
});

let unlockHold = null;
document.getElementById("ambient-hit").addEventListener("pointerdown", () => {
  if (!document.body.classList.contains("locked")) {
    document.body.classList.remove("ambient");
    bumpIdle();
    return;
  }
  unlockHold = setTimeout(() => {
    document.body.classList.remove("ambient", "locked");
    bumpIdle();
    toast("Tela destrava");
  }, 2000);
});
document.getElementById("ambient-hit").addEventListener("pointerup", () => clearTimeout(unlockHold));
document.getElementById("ambient-hit").addEventListener("pointerleave", () => clearTimeout(unlockHold));

moreBtn.addEventListener("click", () => {
  moreSheet.hidden = false;
  moreBtn.classList.add("active");
  fillMore();
  renderHistory();
});
moreSheet.addEventListener("click", (e) => {
  if (e.target === moreSheet) {
    moreSheet.hidden = true;
    moreBtn.classList.remove("active");
  }
});
document.getElementById("more-tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".more-tab");
  if (!tab) return;
  document.querySelectorAll(".more-tab").forEach((t) => t.classList.toggle("active", t === tab));
  document.getElementById("tab-night").hidden = tab.dataset.tab !== "night";
  document.getElementById("tab-tone").hidden = tab.dataset.tab !== "tone";
  document.getElementById("tab-mix").hidden = tab.dataset.tab !== "mix";
});

function toggleSwitch(btn, on) {
  btn.setAttribute("aria-pressed", on ? "true" : "false");
}

document.getElementById("eq-low").addEventListener("input", (e) => {
  eqLow = Number(e.target.value);
  document.getElementById("eq-low-val").textContent = (eqLow > 0 ? "+" : "") + eqLow;
  applyTone();
  persist();
});
document.getElementById("eq-high").addEventListener("input", (e) => {
  eqHigh = Number(e.target.value);
  document.getElementById("eq-high-val").textContent = (eqHigh > 0 ? "+" : "") + eqHigh;
  applyTone();
  persist();
});
document.getElementById("stereo").addEventListener("input", (e) => {
  stereo = Number(e.target.value) / 100;
  document.getElementById("stereo-val").textContent = Math.round(stereo * 100) + "%";
  applyTone();
  persist();
});
document.getElementById("living-btn").addEventListener("click", () => {
  living = !living;
  toggleSwitch(document.getElementById("living-btn"), living);
  if (living) startLiving();
  else {
    stopLiving();
    if (baseMix && playing) Object.entries(baseMix).forEach(([id, v]) => { levels[id] = v; AudioEngine.set(id, v); });
  }
  persist();
  toast(living ? "Tempestade viva ligada" : "Tempestade viva desligada");
});
document.getElementById("lock-btn").addEventListener("click", () => {
  lockAmbient = !lockAmbient;
  toggleSwitch(document.getElementById("lock-btn"), lockAmbient);
  persist();
  toast(lockAmbient ? "Ambiente travado — segure 2s para sair" : "Trava desligada");
});
dimBtn.addEventListener("click", () => {
  dimOn = !dimOn;
  document.body.classList.toggle("dim", dimOn);
  toggleSwitch(dimBtn, dimOn);
  persist();
});
document.getElementById("alarm-on").addEventListener("click", () => {
  alarmTime = document.getElementById("alarm-time").value || "07:00";
  alarmOn = true;
  scheduleAlarm();
  fillMore();
  persist();
  toast("Despertar às " + alarmTime);
});
document.getElementById("alarm-off").addEventListener("click", () => {
  alarmOn = false;
  if (alarmId) clearTimeout(alarmId);
  alarmId = null;
  cancelAlarmNative();
  fillMore();
  persist();
  toast("Despertar desligado");
});
document.getElementById("alarm-fade").addEventListener("click", (e) => {
  const btn = e.target.closest(".mini");
  if (!btn) return;
  alarmFade = Number(btn.dataset.af);
  document.querySelectorAll("#alarm-fade .mini").forEach((b) => b.classList.toggle("active", b === btn));
  persist();
});
document.getElementById("ramp-opts").addEventListener("click", (e) => {
  const btn = e.target.closest(".mini");
  if (!btn) return;
  rampMin = Number(btn.dataset.ramp);
  document.querySelectorAll("#ramp-opts .mini").forEach((b) => b.classList.toggle("active", b === btn));
  applyRamp();
  persist();
});
document.getElementById("history-list").addEventListener("click", (e) => {
  const btn = e.target.closest(".hist-item");
  if (!btn) return;
  const h = historyMixes[Number(btn.dataset.h)];
  if (!h) return;
  applyMix(h.mix, null, h.scene);
  moreSheet.hidden = true;
  moreBtn.classList.remove("active");
  ensurePlaying();
});
document.getElementById("share-mix").addEventListener("click", async () => {
  const mix = currentMix();
  if (!Object.keys(mix).length) {
    toast("Ligue algum som antes");
    return;
  }
  const u = new URL(location.href);
  u.search = "";
  u.searchParams.set("mix", encodeMix(mix, activeScene));
  const link = u.toString();
  try {
    if (navigator.share) await navigator.share({ title: "Sereno", text: "Meu mix de chuva", url: link });
    else {
      await navigator.clipboard.writeText(link);
      toast("Link copiado");
    }
  } catch (_) {
    try {
      await navigator.clipboard.writeText(link);
      toast("Link copiado");
    } catch (__) { toast(link); }
  }
});
document.getElementById("save-mix-sheet").addEventListener("click", saveMixNow);
document.getElementById("sync-new").addEventListener("click", async () => {
  syncCode = newCode();
  fillMore();
  persist();
  const link = accountUrl();
  try {
    await navigator.clipboard.writeText(link);
    toast("Código " + syncCode + " · link copiado");
  } catch (_) {
    toast("Código " + syncCode);
  }
});
document.getElementById("sync-apply").addEventListener("click", () => {
  const v = document.getElementById("sync-code").value.trim().toUpperCase();
  if (v.length < 4) {
    toast("Cole o código ou abra o link da conta");
    return;
  }
  syncCode = v;
  persist();
  toast("Código guardado. Abra o mesmo link neste aparelho.");
});
document.getElementById("wake-ok").addEventListener("click", () => {
  document.getElementById("wake-banner").hidden = true;
  pause();
});

bgBtn.addEventListener("click", async () => {
  bgKeep = !bgKeep;
  bgBtn.classList.toggle("active", bgKeep);
  bgLabel.textContent = bgKeep ? "Ativo" : "Fundo";
  persist();
  if (bgKeep) {
    if (playing) {
      startKeepalive();
      await requestWake();
      nativePlaying(true);
    }
    toast("Modo segundo plano ligado.");
  } else {
    releaseWake();
    if (!playing) {
      stopKeepalive();
      nativePlaying(false);
    }
    toast("Modo segundo plano desligado");
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

window.SerenoApp = {
  play: ensurePlaying,
  pause,
  isPlaying() { return playing; },
  wake: fireAlarm
};
