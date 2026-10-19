const SOUNDS = [
  { id: "rain", name: "Chuva suave", desc: "Garoa constante", icon: "cloud" },
  { id: "heavy", name: "Temporal", desc: "Chuva forte", icon: "storm" },
  { id: "roof", name: "No telhado", desc: "Gotas no zinco", icon: "roof" },
  { id: "window", name: "Na janela", desc: "Chuva abafada", icon: "window" },
  { id: "puddle", name: "Poças", desc: "Gotas na calçada", icon: "drop" },
  { id: "hail", name: "Granizo", desc: "Pedras no telhado", icon: "hail" },
  { id: "thunder", name: "Trovões", desc: "Tempestade média", icon: "bolt" },
  { id: "closeThunder", name: "Trovoada perto", desc: "Estalo e estrondo", icon: "bolt2" },
  { id: "distantThunder", name: "Trovoada longe", desc: "Rolar no horizonte", icon: "cloud2" },
  { id: "lightning", name: "Raios", desc: "Clarões secos", icon: "zap" },
  { id: "rumble", name: "Ribombar", desc: "Grave contínuo", icon: "wave2" },
  { id: "wind", name: "Vento", desc: "Brisa noturna", icon: "wind" },
  { id: "leaves", name: "Folhas", desc: "Vento nas árvores", icon: "leaf" },
  { id: "river", name: "Riacho", desc: "Água correndo", icon: "wave" },
  { id: "waves", name: "Ondas", desc: "Mar distante", icon: "wave" },
  { id: "fire", name: "Lareira", desc: "Lenha crepitando", icon: "fire" },
  { id: "crickets", name: "Grilos", desc: "Noite no campo", icon: "bug" },
  { id: "owl", name: "Coruja", desc: "Floresta tarde", icon: "owl" },
  { id: "forest", name: "Mata", desc: "Noite úmida", icon: "tree" },
  { id: "brown", name: "Ruído marrom", desc: "Fundo profundo", icon: "wave2" },
  { id: "cafe", name: "Café silencioso", desc: "Murmúrio suave", icon: "cup" }
];

const PRESETS = [
  { id: "sleep", name: "Pegar no sono", mix: { rain: 0.7, window: 0.35, brown: 0.25 } },
  { id: "storm", name: "Tempestade", mix: { heavy: 0.75, thunder: 0.55, closeThunder: 0.4, lightning: 0.35, wind: 0.4 } },
  { id: "farstorm", name: "Temporal longe", mix: { rain: 0.55, distantThunder: 0.7, rumble: 0.45, window: 0.3 } },
  { id: "close", name: "Tempestade na janela", mix: { heavy: 0.7, closeThunder: 0.8, lightning: 0.55, hail: 0.25, roof: 0.4 } },
  { id: "roof", name: "Noite no sótão", mix: { roof: 0.85, thunder: 0.25, wind: 0.2 } },
  { id: "cabin", name: "Cabana", mix: { rain: 0.45, fire: 0.7, wind: 0.25, window: 0.3 } },
  { id: "field", name: "Campo", mix: { rain: 0.35, crickets: 0.5, owl: 0.35, wind: 0.2, forest: 0.25 } },
  { id: "forestn", name: "Floresta", mix: { forest: 0.55, leaves: 0.45, owl: 0.4, rain: 0.3, river: 0.35 } },
  { id: "coast", name: "Costa", mix: { waves: 0.7, rain: 0.35, wind: 0.45 } },
  { id: "street", name: "Rua molhada", mix: { heavy: 0.5, puddle: 0.65, distantThunder: 0.3, wind: 0.2 } },
  { id: "deep", name: "Sono profundo", mix: { brown: 0.7, window: 0.5, rain: 0.25, rumble: 0.15 } },
  { id: "focus", name: "Ler e dormir", mix: { cafe: 0.35, rain: 0.55, brown: 0.2 } }
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
  tree: '<svg class="sound-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22v-6"/><path d="M12 16 7 10h10L12 16z"/><path d="M12 11 8 6h8l-4 5z"/></svg>'
};

const levels = Object.fromEntries(SOUNDS.map((s) => [s.id, 0]));
let playing = false;
let activePreset = null;
let timerId = null;
let timerEnds = 0;
let fadeMs = 60000;
let waking = false;
let wakeLock = null;
let bgKeep = false;

const grid = document.getElementById("sound-grid");
const presetRow = document.getElementById("preset-row");
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

function renderSounds() {
  grid.innerHTML = SOUNDS.map((s) => `
    <article class="sound" data-id="${s.id}">
      ${ICONS[s.icon]}
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <input type="range" min="0" max="100" value="${Math.round(levels[s.id] * 100)}" data-vol="${s.id}" />
    </article>
  `).join("");
}

function renderPresets() {
  presetRow.innerHTML = PRESETS.map((p) =>
    `<button class="preset" data-preset="${p.id}">${p.name}</button>`
  ).join("");
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
  const on = SOUNDS.filter((s) => levels[s.id] > 0.01).map((s) => s.name);
  if (!playing) nowPlaying.textContent = "Toque para começar a chuva";
  else if (!on.length) nowPlaying.textContent = "Silêncio — escolha um som";
  else nowPlaying.textContent = on.slice(0, 3).join(" · ");

  const rainPower = Math.max(levels.rain || 0, levels.heavy || 0, levels.roof || 0, levels.window || 0, levels.hail || 0, levels.puddle || 0);
  const stormPower = Math.max(levels.thunder || 0, levels.closeThunder || 0, levels.lightning || 0, levels.distantThunder || 0);
  SerenoVisual.setIntensity(playing ? 0.2 + rainPower * 0.8 + stormPower * 0.25 : 0.18);
  updateMediaSession();
}

async function start() {
  await AudioEngine.resume();
  playing = true;
  playBtn.classList.add("playing");
  Object.entries(levels).forEach(([id, v]) => AudioEngine.set(id, v));
  startKeepalive();
  requestWake();
  updateCards();
}

function pause() {
  playing = false;
  playBtn.classList.remove("playing");
  AudioEngine.stopAll();
  stopKeepalive();
  releaseWake();
  updateCards();
}

function applyMix(mix, presetId) {
  SOUNDS.forEach((s) => { levels[s.id] = mix[s.id] || 0; });
  activePreset = presetId || null;
  if (playing) {
    SOUNDS.forEach((s) => AudioEngine.set(s.id, levels[s.id]));
  }
  updateCards();
}

renderSounds();
renderPresets();
updateCards();
untilTime.value = "07:00";

window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (splash) setTimeout(() => splash.classList.add("hide"), 700);
});

const urlPreset = new URLSearchParams(location.search).get("preset");
if (urlPreset) {
  const preset = PRESETS.find((p) => p.id === urlPreset);
  if (preset) applyMix(preset.mix, preset.id);
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
  const preset = PRESETS.find((p) => p.id === btn.dataset.preset);
  applyMix(preset.mix, preset.id);
  if (!playing) start();
});

playBtn.addEventListener("click", () => {
  if (playing) pause();
  else {
    const any = Object.values(levels).some((v) => v > 0);
    if (!any) applyMix(PRESETS[0].mix, PRESETS[0].id);
    start();
  }
});

master.addEventListener("input", () => {
  AudioEngine.setMaster(Number(master.value) / 100);
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

function ensurePlaying() {
  if (playing) return;
  const any = Object.values(levels).some((v) => v > 0);
  if (!any) applyMix(PRESETS[0].mix, PRESETS[0].id);
  start();
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
});

dimBtn.addEventListener("click", () => {
  document.body.classList.toggle("dim");
  dimBtn.classList.toggle("active");
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

bgBtn.addEventListener("click", async () => {
  bgKeep = !bgKeep;
  bgBtn.classList.toggle("active", bgKeep);
  bgLabel.textContent = bgKeep ? "Ativo" : "Fundo";
  if (bgKeep) {
    if (playing) {
      startKeepalive();
      await requestWake();
    }
    toast("Modo segundo plano ligado. Mantenha o app aberto ou na tela de bloqueio.");
  } else {
    releaseWake();
    if (!playing) stopKeepalive();
    toast("Modo segundo plano desligado");
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
