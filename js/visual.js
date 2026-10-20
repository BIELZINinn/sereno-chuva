const SerenoVisual = (() => {
  const canvas = document.getElementById("rain-canvas");
  const lightning = document.getElementById("lightning");
  const ctx = canvas.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = 1, t = 0;
  let intensity = 0.35;
  let scene = "window";
  let drops = [];
  let sparks = [];
  let flakes = [];
  let leaves = [];
  let embers = [];
  let bolts = [];
  let stars = [];

  const palettes = {
    window: ["#071018", "#0d1a2a", "#152033"],
    storm: ["#05070c", "#0a1220", "#1a2436"],
    cabin: ["#120b08", "#1c120c", "#2a1a10"],
    forest: ["#06110c", "#0b1c14", "#12301e"],
    ocean: ["#061018", "#0a1c28", "#123040"],
    street: ["#0a0c12", "#141822", "#1c2430"],
    tent: ["#100c08", "#1a140e", "#24180f"],
    snow: ["#0b121c", "#152030", "#243044"]
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    spawnStars();
  }

  function spawnStars() {
    stars = Array.from({ length: 28 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h * 0.55,
      r: Math.random() * 1.4 + 0.3,
      a: Math.random()
    }));
  }

  function spawnDrop() {
    return {
      x: Math.random() * (w + 40) - 20,
      y: Math.random() * -h,
      len: 8 + Math.random() * 18,
      speed: 7 + Math.random() * 16,
      alpha: 0.12 + Math.random() * 0.3,
      thick: Math.random() > 0.85 ? 1.5 : 0.7
    };
  }

  function bg(cols) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, cols[0]);
    g.addColorStop(0.45, cols[1]);
    g.addColorStop(1, cols[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStars(alpha) {
    for (const s of stars) {
      const tw = 0.35 + Math.sin(t * 0.002 + s.a * 8) * 0.35;
      ctx.fillStyle = `rgba(220,230,245,${tw * alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMoon(x, y, r) {
    ctx.fillStyle = "rgba(232, 214, 170, .85)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x + r * 0.38, y - r * 0.18, r * 0.82, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function drawCloud(x, y, s, a) {
    ctx.fillStyle = `rgba(160,180,205,${a})`;
    ctx.beginPath();
    ctx.ellipse(x, y, s * 1.6, s * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(x - s, y + 4, s * 0.9, s * 0.55, 0, 0, Math.PI * 2);
    ctx.ellipse(x + s, y + 6, s, s * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawRain() {
    const target = Math.floor(18 + intensity * 90);
    while (drops.length < target) drops.push(spawnDrop());
    if (drops.length > target + 30) drops.length = target;
    ctx.lineCap = "round";
    for (const d of drops) {
      d.y += d.speed * (0.65 + intensity);
      d.x += scene === "storm" ? 1.2 : 0.35;
      ctx.strokeStyle = `rgba(190,214,235,${d.alpha * (0.4 + intensity * 0.75)})`;
      ctx.lineWidth = d.thick;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - (scene === "storm" ? 4 : 1.2), d.y + d.len);
      ctx.stroke();
      if (d.y > h + 20) {
        d.y = -20;
        d.x = Math.random() * w;
      }
    }
  }

  function drawWindow() {
    const m = Math.min(w * 0.08, 36);
    ctx.fillStyle = "rgba(8,10,14,.55)";
    ctx.fillRect(0, 0, w, m);
    ctx.fillRect(0, h - m * 1.6, w, m * 1.6);
    ctx.fillRect(0, 0, m, h);
    ctx.fillRect(w - m, 0, m, h);
    ctx.fillStyle = "rgba(180,196,214,.12)";
    ctx.fillRect(w / 2 - 5, m, 10, h - m * 2.6);
    ctx.fillRect(m, h * 0.46, w - m * 2, 8);
    ctx.strokeStyle = "rgba(201,184,150,.18)";
    ctx.lineWidth = 3;
    ctx.strokeRect(m, m, w - m * 2, h - m * 2.6);
  }

  function drawCabin() {
    const floor = h * 0.72;
    ctx.fillStyle = "#1a120c";
    ctx.fillRect(0, floor, w, h - floor);
    const wx = w * 0.18, wy = h * 0.18, ww = w * 0.38, wh = h * 0.38;
    ctx.fillStyle = "rgba(90,140,180,.18)";
    ctx.fillRect(wx, wy, ww, wh);
    ctx.strokeStyle = "rgba(90,70,50,.7)";
    ctx.lineWidth = 8;
    ctx.strokeRect(wx, wy, ww, wh);
    ctx.beginPath();
    ctx.moveTo(wx + ww / 2, wy);
    ctx.lineTo(wx + ww / 2, wy + wh);
    ctx.moveTo(wx, wy + wh / 2);
    ctx.lineTo(wx + ww, wy + wh / 2);
    ctx.stroke();
    const fx = w * 0.68, fy = h * 0.62, fw = Math.min(140, w * 0.22);
    ctx.fillStyle = "#2a1a12";
    ctx.fillRect(fx, fy, fw, h * 0.18);
    ctx.fillStyle = `rgba(255,140,40,${0.45 + Math.sin(t * 0.02) * 0.2})`;
    ctx.beginPath();
    ctx.moveTo(fx + fw * 0.2, fy + 40);
    ctx.quadraticCurveTo(fx + fw * 0.5, fy - 30 - Math.sin(t * 0.03) * 10, fx + fw * 0.8, fy + 40);
    ctx.fill();
    while (embers.length < 8) {
      embers.push({ x: fx + fw * 0.5, y: fy, vx: (Math.random() - 0.5) * 0.6, vy: -1 - Math.random(), a: 1 });
    }
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x += e.vx;
      e.y += e.vy;
      e.a -= 0.012;
      ctx.fillStyle = `rgba(255,160,60,${Math.max(0, e.a)})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 2, 0, Math.PI * 2);
      ctx.fill();
      if (e.a <= 0) embers.splice(i, 1);
    }
  }

  function drawForest() {
    ctx.fillStyle = "#08160f";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 18) {
      const y = h * 0.62 + Math.sin(x * 0.02 + t * 0.001) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.fill();
    for (let i = 0; i < 9; i++) {
      const x = (i + 0.3) * (w / 9);
      const th = 80 + (i % 3) * 40;
      ctx.fillStyle = "rgba(6,18,12,.85)";
      ctx.beginPath();
      ctx.moveTo(x, h * 0.78);
      ctx.lineTo(x - 28, h * 0.78 - th);
      ctx.lineTo(x + 28, h * 0.78 - th);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x - 4, h * 0.78 - 8, 8, 40);
    }
    if (Math.random() < 0.018) {
      leaves.push({ x: Math.random() * w, y: -10, vx: 0.4 + Math.random(), vy: 0.6 + Math.random(), r: 3 + Math.random() * 4 });
    }
    ctx.fillStyle = "rgba(120,160,90,.55)";
    for (let i = leaves.length - 1; i >= 0; i--) {
      const L = leaves[i];
      L.x += L.vx + Math.sin(t * 0.01 + i) * 0.4;
      L.y += L.vy;
      ctx.beginPath();
      ctx.ellipse(L.x, L.y, L.r, L.r * 0.5, t * 0.01, 0, Math.PI * 2);
      ctx.fill();
      if (L.y > h) leaves.splice(i, 1);
    }
  }

  function drawOcean() {
    const base = h * 0.58;
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      const amp = 10 + layer * 8;
      const speed = 0.0014 + layer * 0.0006;
      for (let x = 0; x <= w; x += 16) {
        const y = base + layer * 22 + Math.sin(x * 0.018 + t * speed) * amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = `rgba(${20 + layer * 20},${50 + layer * 25},${70 + layer * 20},${0.45})`;
      ctx.fill();
    }
  }

  function drawStreet() {
    ctx.fillStyle = "#10141c";
    ctx.fillRect(0, h * 0.7, w, h * 0.3);
    ctx.fillStyle = "rgba(255,210,120,.08)";
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.7);
    ctx.lineTo(w * 0.05, h);
    ctx.lineTo(w * 0.35, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1a222e";
    ctx.fillRect(w * 0.58, h * 0.28, w * 0.28, h * 0.42);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const on = Math.sin(t * 0.001 + r * c) > 0.2;
        ctx.fillStyle = on ? "rgba(255,210,140,.35)" : "rgba(40,50,70,.5)";
        ctx.fillRect(w * 0.62 + c * 28, h * 0.34 + r * 36, 16, 18);
      }
    }
    if (Math.random() < 0.05) {
      sparks.push({ x: Math.random() * w, y: h * 0.7, life: 1 });
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.life -= 0.04;
      ctx.fillStyle = `rgba(180,210,230,${s.life * 0.5})`;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, 6, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      if (s.life <= 0) sparks.splice(i, 1);
    }
  }

  function drawTent() {
    ctx.fillStyle = "rgba(40,28,16,.85)";
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.12);
    ctx.lineTo(w * 0.08, h * 0.82);
    ctx.lineTo(w * 0.92, h * 0.82);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillRect(w * 0.18, h * 0.22, w * 0.64, h * 0.52);
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "rgba(201,184,150,.25)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.12);
    ctx.lineTo(w * 0.08, h * 0.82);
    ctx.lineTo(w * 0.92, h * 0.82);
    ctx.closePath();
    ctx.stroke();
  }

  function drawSnow() {
    while (flakes.length < 36) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * 2.4,
        vy: 0.4 + Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.4
      });
    }
    ctx.fillStyle = "rgba(230,238,248,.8)";
    for (const f of flakes) {
      f.y += f.vy;
      f.x += f.vx + Math.sin(t * 0.002 + f.y * 0.02) * 0.3;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fill();
      if (f.y > h) { f.y = -6; f.x = Math.random() * w; }
    }
  }

  function drawBolts() {
    for (let i = bolts.length - 1; i >= 0; i--) {
      const b = bolts[i];
      b.life -= 0.08;
      ctx.strokeStyle = `rgba(230,240,255,${Math.max(0, b.life)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(b.pts[0].x, b.pts[0].y);
      b.pts.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
      if (b.life <= 0) bolts.splice(i, 1);
    }
  }

  function makeBolt() {
    const pts = [{ x: Math.random() * w * 0.8 + w * 0.1, y: 0 }];
    let y = 0;
    while (y < h * 0.7) {
      const last = pts[pts.length - 1];
      y += 18 + Math.random() * 28;
      pts.push({ x: last.x + (Math.random() - 0.5) * 50, y });
    }
    bolts.push({ pts, life: 1 });
  }

  let frame = 0;
  function tick() {
    t += 16;
    frame++;
    if (frame % 2 === 1) {
      requestAnimationFrame(tick);
      return;
    }
    const cols = palettes[scene] || palettes.window;
    bg(cols);
    if (scene === "snow" || scene === "forest" || scene === "ocean") drawStars(0.55);
    if (scene === "window" || scene === "snow") drawMoon(w * 0.78, h * 0.16, 28);
    if (scene !== "cabin" && scene !== "tent") {
      drawCloud((t * 0.01) % (w + 200) - 80, h * 0.16, 46, 0.18);
      drawCloud((t * 0.007 + 200) % (w + 240) - 100, h * 0.22, 38, 0.12);
    }
    if (scene === "cabin") drawCabin();
    if (scene === "forest") drawForest();
    if (scene === "ocean") drawOcean();
    if (scene === "street") drawStreet();
    if (scene === "tent") drawTent();
    if (scene === "snow") drawSnow();
    if (scene !== "snow") drawRain();
    drawBolts();
    if (scene === "window") drawWindow();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();

  return {
    setIntensity(v) { intensity = Math.max(0.08, Math.min(1, v)); },
    setScene(id) {
      scene = id || "window";
      document.body.dataset.scene = scene;
    },
    scene() { return scene; },
    flash(power = 0.4) {
      lightning.style.transition = "opacity 40ms linear";
      lightning.style.opacity = String(power);
      if (power > 0.45) makeBolt();
      setTimeout(() => {
        lightning.style.transition = "opacity 180ms ease-out";
        lightning.style.opacity = "0";
      }, 60);
      if (power > 0.4) {
        setTimeout(() => {
          lightning.style.transition = "opacity 30ms linear";
          lightning.style.opacity = String(power * 0.45);
          setTimeout(() => {
            lightning.style.transition = "opacity 500ms ease-out";
            lightning.style.opacity = "0";
          }, 50);
        }, 140);
      }
    }
  };
})();
window.SerenoVisual = SerenoVisual;
