const SerenoVisual = (() => {
  const canvas = document.getElementById("rain-canvas");
  const lightning = document.getElementById("lightning");
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0, dpr = 1;
  let drops = [];
  let intensity = 0.35;
  let raf = 0;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(n) {
    for (let i = 0; i < n; i++) {
      drops.push({
        x: Math.random() * w,
        y: Math.random() * -h,
        len: 8 + Math.random() * 16,
        speed: 7 + Math.random() * 14,
        alpha: 0.12 + Math.random() * 0.28,
        thick: Math.random() > 0.85 ? 1.4 : 0.7
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, w, h);
    const target = Math.floor(70 + intensity * 220);
    if (drops.length < target) spawn(12);
    if (drops.length > target + 40) drops.length = target;

    ctx.lineCap = "round";
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      d.y += d.speed * (0.7 + intensity);
      d.x += 0.35;
      ctx.strokeStyle = `rgba(190, 214, 235, ${d.alpha * (0.45 + intensity * 0.7)})`;
      ctx.lineWidth = d.thick;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 1.2, d.y + d.len);
      ctx.stroke();
      if (d.y > h + 20) {
        d.y = -20;
        d.x = Math.random() * w;
      }
    }
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  tick();

  return {
    setIntensity(v) { intensity = Math.max(0.12, Math.min(1, v)); },
    flash(power = 0.4) {
      lightning.style.transition = "opacity 40ms linear";
      lightning.style.opacity = String(power);
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
