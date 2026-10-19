const AudioEngine = (() => {
  let ctx = null;
  let master = null;
  let compressor = null;
  let started = false;
  const nodes = {};

  const rand = (a, b) => a + Math.random() * (b - a);

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.72;
    compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 2.4;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.25;
    master.connect(compressor);
    compressor.connect(ctx.destination);
  }

  function noiseBuffer(seconds = 2) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      let last = 0;
      for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.4;
      }
    }
    return buffer;
  }

  function whiteBuffer(seconds = 1.5) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  function pinkBuffer(seconds = 2) {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = buffer.getChannelData(c);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + w * 0.0555179;
        b1 = 0.99332 * b1 + w * 0.0750759;
        b2 = 0.96900 * b2 + w * 0.1538520;
        b3 = 0.86650 * b3 + w * 0.3104856;
        b4 = 0.55000 * b4 + w * 0.5329522;
        b5 = -0.7616 * b5 - w * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    }
    return buffer;
  }

  function makeFilter(type, freq, q = 1) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  function loopSource(buffer, rate = 1) {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.playbackRate.value = rate;
    src.start();
    return src;
  }

  function rainLayer({ hp, lp, gain, rate, buffer }) {
    const src = loopSource(buffer, rate);
    const h = makeFilter("highpass", hp, 0.7);
    const l = makeFilter("lowpass", lp, 0.8);
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(h).connect(l).connect(g);
    return { src, g, h, l };
  }

  function createRain() {
    const brown = noiseBuffer(3.2);
    const white = whiteBuffer(2.1);
    const out = ctx.createGain();
    out.gain.value = 0;

    const far = rainLayer({ hp: 180, lp: 1400, gain: 0.55, rate: 0.72, buffer: brown });
    const mid = rainLayer({ hp: 420, lp: 3200, gain: 0.38, rate: 0.95, buffer: white });
    const near = rainLayer({ hp: 900, lp: 7800, gain: 0.16, rate: 1.15, buffer: white });

    far.g.connect(out);
    mid.g.connect(out);
    near.g.connect(out);

    const dripGain = ctx.createGain();
    dripGain.gain.value = 0.22;
    dripGain.connect(out);

    let dripTimer;
    const drip = () => {
      if (!ctx || ctx.state === "closed") return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const f = makeFilter("bandpass", rand(1800, 4200), 6);
      osc.type = "sine";
      osc.frequency.setValueAtTime(rand(520, 980), t);
      osc.frequency.exponentialRampToValueAtTime(rand(180, 360), t + 0.08);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(rand(0.04, 0.12), t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.08, 0.18));
      osc.connect(f).connect(g).connect(dripGain);
      osc.start(t);
      osc.stop(t + 0.2);
      dripTimer = setTimeout(drip, rand(180, 900));
    };
    drip();

    return {
      out,
      stop() { clearTimeout(dripTimer); }
    };
  }

  function createHeavyRain() {
    const brown = noiseBuffer(2.6);
    const white = whiteBuffer(1.8);
    const out = ctx.createGain();
    out.gain.value = 0;
    const body = rainLayer({ hp: 120, lp: 2200, gain: 0.7, rate: 0.85, buffer: brown });
    const splash = rainLayer({ hp: 700, lp: 6500, gain: 0.42, rate: 1.05, buffer: white });
    body.g.connect(out);
    splash.g.connect(out);
    return { out };
  }

  function createRoofRain() {
    const white = whiteBuffer(2);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(white, 1.08);
    const bp = makeFilter("bandpass", 2400, 1.4);
    const hp = makeFilter("highpass", 900, 0.7);
    const g = ctx.createGain();
    g.gain.value = 0.45;
    src.connect(hp).connect(bp).connect(g).connect(out);

    let timer;
    const tap = () => {
      const t = ctx.currentTime;
      const n = ctx.createBufferSource();
      n.buffer = white;
      const f = makeFilter("bandpass", rand(1600, 4800), 8);
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(rand(0.08, 0.22), t);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.03, 0.09));
      n.connect(f).connect(gg).connect(out);
      n.start(t);
      n.stop(t + 0.12);
      timer = setTimeout(tap, rand(40, 160));
    };
    tap();
    return { out, stop() { clearTimeout(timer); } };
  }

  function createWindowRain() {
    const brown = noiseBuffer(3);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.62);
    const lp = makeFilter("lowpass", 900, 0.6);
    const g = ctx.createGain();
    g.gain.value = 0.7;
    src.connect(lp).connect(g).connect(out);
    return { out };
  }

  function createThunder() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const pink = pinkBuffer(4);

    let timer;
    const boom = (strong) => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = pink;
      const lp = makeFilter("lowpass", strong ? 280 : 420, 0.8);
      const hp = makeFilter("highpass", 28, 0.5);
      const g = ctx.createGain();
      const peak = strong ? rand(0.85, 1.15) : rand(0.28, 0.55);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + rand(0.04, 0.12));
      g.gain.exponentialRampToValueAtTime(peak * 0.35, t + rand(0.4, 0.9));
      g.gain.exponentialRampToValueAtTime(0.0001, t + rand(2.2, 4.5));
      src.connect(hp).connect(lp).connect(g).connect(out);
      src.start(t);
      src.stop(t + 5);

      const rumble = ctx.createOscillator();
      const rg = ctx.createGain();
      rumble.type = "sine";
      rumble.frequency.setValueAtTime(rand(28, 46), t);
      rumble.frequency.exponentialRampToValueAtTime(rand(18, 28), t + 2);
      rg.gain.setValueAtTime(0.0001, t);
      rg.gain.exponentialRampToValueAtTime(strong ? 0.35 : 0.12, t + 0.08);
      rg.gain.exponentialRampToValueAtTime(0.0001, t + rand(1.8, 3.4));
      rumble.connect(rg).connect(out);
      rumble.start(t);
      rumble.stop(t + 4);

      if (window.SerenoVisual) window.SerenoVisual.flash(strong ? 0.55 : 0.22);
      timer = setTimeout(() => boom(Math.random() > 0.62), rand(5000, strong ? 16000 : 22000));
    };

    const startLoop = () => {
      timer = setTimeout(() => boom(true), rand(1800, 5000));
    };

    return {
      out,
      startLoop,
      stop() { clearTimeout(timer); }
    };
  }

  function createWind() {
    const brown = noiseBuffer(4);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.45);
    const bp = makeFilter("bandpass", 280, 0.6);
    const g = ctx.createGain();
    g.gain.value = 0.55;
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoG.gain.value = 90;
    lfo.connect(lfoG).connect(bp.frequency);
    lfo.start();
    src.connect(bp).connect(g).connect(out);
    return { out };
  }

  function createFire() {
    const white = whiteBuffer(2.4);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(white, 0.9);
    const bp = makeFilter("bandpass", 420, 0.9);
    const hp = makeFilter("highpass", 180);
    const g = ctx.createGain();
    g.gain.value = 0.4;
    src.connect(hp).connect(bp).connect(g).connect(out);

    let timer;
    const crack = () => {
      const t = ctx.currentTime;
      const n = ctx.createBufferSource();
      n.buffer = white;
      const f = makeFilter("highpass", rand(1500, 4000));
      const gg = ctx.createGain();
      gg.gain.setValueAtTime(rand(0.05, 0.18), t);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.02, 0.08));
      n.connect(f).connect(gg).connect(out);
      n.start(t);
      n.stop(t + 0.1);
      timer = setTimeout(crack, rand(200, 1400));
    };
    crack();
    return { out, stop() { clearTimeout(timer); } };
  }

  function createCrickets() {
    const out = ctx.createGain();
    out.gain.value = 0;
    let running = true;
    const chirp = () => {
      if (!running || !ctx) return;
      const t = ctx.currentTime;
      const bursts = Math.floor(rand(3, 6));
      for (let i = 0; i < bursts; i++) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = makeFilter("bandpass", 4200, 12);
        const st = t + i * 0.07;
        osc.type = "square";
        osc.frequency.value = rand(3800, 4600);
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.035, st + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.05);
        osc.connect(f).connect(g).connect(out);
        osc.start(st);
        osc.stop(st + 0.06);
      }
      setTimeout(chirp, rand(900, 2800));
    };
    chirp();
    return { out, stop() { running = false; } };
  }

  function createWaves() {
    const brown = noiseBuffer(5);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.55);
    const lp = makeFilter("lowpass", 700, 0.7);
    const g = ctx.createGain();
    g.gain.value = 0.2;
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoG.gain.value = 0.28;
    g.gain.value = 0.32;
    lfo.connect(lfoG).connect(g.gain);
    lfo.start();
    src.connect(lp).connect(g).connect(out);
    return { out };
  }

  function createBrownNoise() {
    const brown = noiseBuffer(4);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.5);
    const lp = makeFilter("lowpass", 220, 0.5);
    const g = ctx.createGain();
    g.gain.value = 0.85;
    src.connect(lp).connect(g).connect(out);
    return { out };
  }

  function createCafe() {
    const brown = noiseBuffer(3);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.8);
    const bp = makeFilter("bandpass", 900, 0.5);
    const g = ctx.createGain();
    g.gain.value = 0.22;
    src.connect(bp).connect(g).connect(out);
    return { out };
  }

  function createCloseThunder() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const pink = pinkBuffer(3);
    const white = whiteBuffer(1.2);
    let timer;
    const crack = () => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const crackSrc = ctx.createBufferSource();
      crackSrc.buffer = white;
      const hp = makeFilter("highpass", 1800, 0.8);
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.0001, t);
      cg.gain.exponentialRampToValueAtTime(rand(0.7, 1.2), t + 0.008);
      cg.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.08, 0.18));
      crackSrc.connect(hp).connect(cg).connect(out);
      crackSrc.start(t);
      crackSrc.stop(t + 0.25);

      const boomDelay = rand(0.04, 0.16);
      const src = ctx.createBufferSource();
      src.buffer = pink;
      const lp = makeFilter("lowpass", 220, 0.7);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t + boomDelay);
      g.gain.exponentialRampToValueAtTime(rand(0.9, 1.3), t + boomDelay + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + boomDelay + rand(1.6, 3.2));
      src.connect(lp).connect(g).connect(out);
      src.start(t);
      src.stop(t + 4);

      if (window.SerenoVisual) window.SerenoVisual.flash(rand(0.7, 1));
      timer = setTimeout(crack, rand(4000, 14000));
    };
    return {
      out,
      startLoop() { timer = setTimeout(crack, rand(1200, 3800)); },
      stop() { clearTimeout(timer); }
    };
  }

  function createDistantThunder() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const pink = pinkBuffer(5);
    let timer;
    const roll = () => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = pink;
      src.playbackRate.value = rand(0.55, 0.8);
      const lp = makeFilter("lowpass", rand(140, 220), 0.5);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(rand(0.35, 0.65), t + rand(0.4, 0.9));
      g.gain.exponentialRampToValueAtTime(0.0001, t + rand(3.5, 6.5));
      src.connect(lp).connect(g).connect(out);
      src.start(t);
      src.stop(t + 7);
      if (window.SerenoVisual) window.SerenoVisual.flash(0.12);
      timer = setTimeout(roll, rand(8000, 24000));
    };
    return {
      out,
      startLoop() { timer = setTimeout(roll, rand(2500, 7000)); },
      stop() { clearTimeout(timer); }
    };
  }

  function createRumble() {
    const brown = noiseBuffer(6);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.28);
    const lp = makeFilter("lowpass", 90, 0.4);
    const g = ctx.createGain();
    g.gain.value = 0.7;
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoG.gain.value = 0.22;
    lfo.connect(lfoG).connect(g.gain);
    lfo.start();
    src.connect(lp).connect(g).connect(out);
    return { out };
  }

  function createLightning() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const white = whiteBuffer(0.8);
    let timer;
    const zap = () => {
      if (!ctx) return;
      const t = ctx.currentTime;
      const n = Math.random() > 0.55 ? 2 : 1;
      for (let i = 0; i < n; i++) {
        const st = t + i * rand(0.04, 0.12);
        const src = ctx.createBufferSource();
        src.buffer = white;
        const bp = makeFilter("bandpass", rand(2500, 7000), 4);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(rand(0.45, 0.9), st + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, st + rand(0.03, 0.09));
        src.connect(bp).connect(g).connect(out);
        src.start(st);
        src.stop(st + 0.15);
      }
      if (window.SerenoVisual) window.SerenoVisual.flash(rand(0.85, 1));
      timer = setTimeout(zap, rand(6000, 18000));
    };
    return {
      out,
      startLoop() { timer = setTimeout(zap, rand(2000, 6000)); },
      stop() { clearTimeout(timer); }
    };
  }

  function createHail() {
    const white = whiteBuffer(1.5);
    const out = ctx.createGain();
    out.gain.value = 0;
    let timer;
    const hit = () => {
      const t = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = white;
      const bp = makeFilter("bandpass", rand(2200, 6200), 7);
      const g = ctx.createGain();
      g.gain.setValueAtTime(rand(0.08, 0.22), t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.02, 0.07));
      src.connect(bp).connect(g).connect(out);
      src.start(t);
      src.stop(t + 0.1);
      timer = setTimeout(hit, rand(30, 140));
    };
    hit();
    return { out, stop() { clearTimeout(timer); } };
  }

  function createLeaves() {
    const white = whiteBuffer(2.2);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(white, 1.2);
    const bp = makeFilter("bandpass", 3200, 0.9);
    const g = ctx.createGain();
    g.gain.value = 0.32;
    src.connect(bp).connect(g).connect(out);
    return { out };
  }

  function createPuddle() {
    const brown = noiseBuffer(2.8);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.9);
    const bp = makeFilter("bandpass", 650, 1.1);
    const g = ctx.createGain();
    g.gain.value = 0.4;
    src.connect(bp).connect(g).connect(out);
    let timer;
    const splash = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gg = ctx.createGain();
      const f = makeFilter("lowpass", 900);
      osc.frequency.setValueAtTime(rand(140, 260), t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.18);
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(rand(0.08, 0.18), t + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      osc.connect(f).connect(gg).connect(out);
      osc.start(t);
      osc.stop(t + 0.25);
      timer = setTimeout(splash, rand(400, 1600));
    };
    splash();
    return { out, stop() { clearTimeout(timer); } };
  }

  function createRiver() {
    const brown = noiseBuffer(3.5);
    const white = whiteBuffer(2);
    const out = ctx.createGain();
    out.gain.value = 0;
    const body = rainLayer({ hp: 80, lp: 1100, gain: 0.6, rate: 0.7, buffer: brown });
    const sparkle = rainLayer({ hp: 1200, lp: 5000, gain: 0.18, rate: 1.1, buffer: white });
    body.g.connect(out);
    sparkle.g.connect(out);
    return { out };
  }

  function createOwl() {
    const out = ctx.createGain();
    out.gain.value = 0;
    let running = true;
    const hoot = () => {
      if (!running || !ctx) return;
      const t = ctx.currentTime;
      const notes = [220, 196];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const f = makeFilter("lowpass", 800);
        const st = t + i * 0.42;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, st);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, st + 0.28);
        g.gain.setValueAtTime(0.0001, st);
        g.gain.exponentialRampToValueAtTime(0.12, st + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, st + 0.32);
        osc.connect(f).connect(g).connect(out);
        osc.start(st);
        osc.stop(st + 0.4);
      });
      setTimeout(hoot, rand(8000, 18000));
    };
    hoot();
    return { out, stop() { running = false; } };
  }

  function createForest() {
    const brown = noiseBuffer(4);
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loopSource(brown, 0.4);
    const lp = makeFilter("lowpass", 500, 0.5);
    const g = ctx.createGain();
    g.gain.value = 0.35;
    src.connect(lp).connect(g).connect(out);
    return { out };
  }

  const factories = {
    rain: createRain,
    heavy: createHeavyRain,
    roof: createRoofRain,
    window: createWindowRain,
    thunder: createThunder,
    closeThunder: createCloseThunder,
    distantThunder: createDistantThunder,
    lightning: createLightning,
    rumble: createRumble,
    hail: createHail,
    leaves: createLeaves,
    puddle: createPuddle,
    river: createRiver,
    owl: createOwl,
    forest: createForest,
    wind: createWind,
    fire: createFire,
    crickets: createCrickets,
    waves: createWaves,
    brown: createBrownNoise,
    cafe: createCafe
  };

  function fade(gain, value, ms = 700) {
    const now = ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(Math.max(0.0001, value), now + ms / 1000);
    if (value <= 0) {
      setTimeout(() => { gain.gain.value = 0; }, ms + 20);
    }
  }

  return {
    async resume() {
      ensure();
      if (ctx.state === "suspended") await ctx.resume();
      started = true;
    },
    isReady() { return started && ctx && ctx.state === "running"; },
    setMaster(v) {
      ensure();
      master.gain.value = v;
    },
    set(id, volume) {
      ensure();
      if (!factories[id]) return;
      if (!nodes[id]) {
        const created = factories[id]();
        created.out.connect(master);
        nodes[id] = created;
        if (created.startLoop) created.startLoop();
      }
      fade(nodes[id].out, volume);
    },
    stopAll() {
      Object.keys(nodes).forEach((id) => fade(nodes[id].out, 0, 900));
    },
    fadeOutAll(ms = 20000) {
      Object.keys(nodes).forEach((id) => fade(nodes[id].out, 0, ms));
    },
    getContext() { ensure(); return ctx; }
  };
})();
