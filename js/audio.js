const AudioEngine = (() => {
  let ctx = null;
  let master = null;
  let started = false;
  const nodes = {};
  const bufs = {};
  const rand = (a, b) => a + Math.random() * (b - a);

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC({ latencyHint: "playback" });
    master = ctx.createGain();
    master.gain.value = 0.72;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -22;
    comp.knee.value = 20;
    comp.ratio.value = 2;
    comp.attack.value = 0.02;
    comp.release.value = 0.3;
    master.connect(comp);
    comp.connect(ctx.destination);
    makeBufs();
  }

  function makeBufs() {
    const n = Math.floor(ctx.sampleRate * 1.25);
    const brown = ctx.createBuffer(1, n, ctx.sampleRate);
    const white = ctx.createBuffer(1, n, ctx.sampleRate);
    const pink = ctx.createBuffer(1, n, ctx.sampleRate);
    const b = brown.getChannelData(0);
    const w = white.getChannelData(0);
    const p = pink.getChannelData(0);
    let last = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 2 - 1;
      w[i] = x;
      last = (last + 0.02 * x) / 1.02;
      b[i] = last * 3.4;
      b0 = 0.99886 * b0 + x * 0.0555179;
      b1 = 0.99332 * b1 + x * 0.0750759;
      b2 = 0.96900 * b2 + x * 0.1538520;
      b3 = 0.86650 * b3 + x * 0.3104856;
      b4 = 0.55000 * b4 + x * 0.5329522;
      b5 = -0.7616 * b5 - x * 0.0168980;
      p[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + x * 0.5362) * 0.11;
      b6 = x * 0.115926;
    }
    bufs.brown = brown;
    bufs.white = white;
    bufs.pink = pink;
  }

  function filter(type, freq, q = 0.8) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
  }

  function loop(buf, rate) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.playbackRate.value = rate || 1;
    src.start();
    return src;
  }

  function chain(buf, { hp, lp, bp, q, rate, gain, lfoHz, lfoAmt, lfoTarget }) {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(buf, rate || 1);
    let node = src;
    if (hp) { const f = filter("highpass", hp); node.connect(f); node = f; }
    if (lp) { const f = filter("lowpass", lp); node.connect(f); node = f; }
    if (bp) { const f = filter("bandpass", bp, q || 1); node.connect(f); node = f; }
    const g = ctx.createGain();
    g.gain.value = gain == null ? 0.4 : gain;
    node.connect(g);
    g.connect(out);
    if (lfoHz) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = lfoHz;
      lg.gain.value = lfoAmt;
      lfo.connect(lg);
      if (lfoTarget === "filter" && bp) lg.connect(node.frequency);
      else lg.connect(g.gain);
      lfo.start();
    }
    return { out };
  }

  function envGain(dest, peak, attack, hold) {
    const t = ctx.currentTime;
    dest.gain.cancelScheduledValues(t);
    dest.gain.setValueAtTime(0.0001, t);
    dest.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack);
    dest.gain.exponentialRampToValueAtTime(0.0001, t + hold);
  }

  function pulse(out, fire, minMs, maxMs) {
    let id;
    let live = true;
    const tick = () => {
      if (!live) return;
      if (out.gain.value > 0.01) fire();
      id = setTimeout(tick, rand(minMs, maxMs));
    };
    id = setTimeout(tick, rand(minMs, maxMs));
    return () => { live = false; clearTimeout(id); };
  }

  function thunder(kind) {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(bufs.pink, kind === "far" ? 0.55 : kind === "close" ? 0.9 : 0.7);
    const lp = filter("lowpass", kind === "far" ? 160 : kind === "close" ? 240 : 300, 0.7);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    src.connect(lp).connect(env).connect(out);
    const rumble = ctx.createOscillator();
    const rg = ctx.createGain();
    rumble.type = "sine";
    rumble.frequency.value = 32;
    rg.gain.value = 0.0001;
    rumble.connect(rg).connect(out);
    rumble.start();
    const crack = loop(bufs.white, 1);
    const hp = filter("highpass", 2200);
    const cg = ctx.createGain();
    cg.gain.value = 0.0001;
    crack.connect(hp).connect(cg).connect(out);
    const boom = () => {
      const strong = kind !== "far";
      envGain(env, kind === "close" ? 1.1 : kind === "far" ? 0.5 : 0.85, 0.06, rand(2.2, 4));
      envGain(rg, strong ? 0.22 : 0.08, 0.05, 2.4);
      if (kind === "close" || kind === "zap") envGain(cg, 0.55, 0.008, 0.12);
      if (window.SerenoVisual) window.SerenoVisual.flash(kind === "far" ? 0.14 : kind === "zap" ? 0.9 : 0.5);
    };
    const wait = kind === "far" ? [8000, 22000] : kind === "zap" ? [7000, 18000] : [5000, 16000];
    const stop = pulse(out, boom, wait[0], wait[1]);
    return { out, startLoop() { setTimeout(boom, rand(1200, 3500)); }, stop };
  }

  function oscPulse({ type, freq, bp, q, peak, att, dur, min, max }) {
    const out = ctx.createGain();
    out.gain.value = 0;
    const osc = ctx.createOscillator();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    if (bp) {
      const f = filter("bandpass", bp, q || 6);
      osc.connect(f).connect(env).connect(out);
    } else osc.connect(env).connect(out);
    osc.start();
    const stop = pulse(out, () => {
      osc.frequency.setValueAtTime(freq * rand(0.92, 1.08), ctx.currentTime);
      envGain(env, peak, att, dur);
    }, min, max);
    return { out, stop };
  }

  const factories = {
    rain: () => chain(bufs.brown, { hp: 200, lp: 2400, rate: 0.78, gain: 0.62 }),
    drizzle: () => chain(bufs.white, { hp: 1800, lp: 7000, rate: 0.85, gain: 0.22 }),
    heavy: () => chain(bufs.white, { hp: 140, lp: 4200, rate: 0.92, gain: 0.7 }),
    roof: () => chain(bufs.white, { hp: 900, bp: 2400, q: 1.3, rate: 1.05, gain: 0.38, lfoHz: 9, lfoAmt: 0.18 }),
    tent: () => chain(bufs.white, { bp: 1600, q: 1.1, rate: 1, gain: 0.4 }),
    window: () => chain(bufs.brown, { lp: 900, rate: 0.62, gain: 0.7 }),
    gutter: () => chain(bufs.brown, { bp: 480, q: 1.5, rate: 0.95, gain: 0.48 }),
    puddle: () => chain(bufs.brown, { bp: 650, q: 1, rate: 0.9, gain: 0.38 }),
    hail: () => chain(bufs.white, { hp: 1800, bp: 3800, q: 2, rate: 1.1, gain: 0.22, lfoHz: 14, lfoAmt: 0.12 }),
    rumble: () => chain(bufs.brown, { lp: 90, rate: 0.3, gain: 0.7, lfoHz: 0.05, lfoAmt: 0.18 }),
    wind: () => chain(bufs.brown, { bp: 280, q: 0.6, rate: 0.45, gain: 0.5, lfoHz: 0.07, lfoAmt: 70, lfoTarget: "filter" }),
    breeze: () => chain(bufs.brown, { bp: 220, q: 0.5, rate: 0.32, gain: 0.36 }),
    leaves: () => chain(bufs.white, { bp: 3200, q: 0.9, rate: 1.15, gain: 0.28 }),
    river: () => chain(bufs.brown, { hp: 80, lp: 1400, rate: 0.72, gain: 0.55 }),
    waves: () => chain(bufs.brown, { lp: 700, rate: 0.55, gain: 0.34, lfoHz: 0.08, lfoAmt: 0.2 }),
    fire: () => chain(bufs.white, { hp: 180, bp: 420, q: 0.9, rate: 0.9, gain: 0.32, lfoHz: 11, lfoAmt: 0.12 }),
    forest: () => chain(bufs.brown, { lp: 500, rate: 0.4, gain: 0.35 }),
    fan: () => chain(bufs.brown, { bp: 180, q: 0.7, rate: 0.7, gain: 0.5 }),
    train: () => chain(bufs.brown, { lp: 160, rate: 0.35, gain: 0.28, lfoHz: 2.2, lfoAmt: 0.12 }),
    purr: () => chain(bufs.brown, { bp: 90, q: 4, rate: 0.6, gain: 0.4, lfoHz: 26, lfoAmt: 0.12 }),
    snow: () => chain(bufs.white, { lp: 700, rate: 0.4, gain: 0.22 }),
    brown: () => chain(bufs.brown, { lp: 220, rate: 0.5, gain: 0.85 }),
    cafe: () => chain(bufs.brown, { bp: 900, q: 0.5, rate: 0.8, gain: 0.22 }),
    thunder: () => thunder("mid"),
    closeThunder: () => thunder("close"),
    distantThunder: () => thunder("far"),
    lightning: () => thunder("zap"),
    drip: () => oscPulse({ freq: 880, bp: 1800, q: 8, peak: 0.14, att: 0.01, dur: 0.18, min: 800, max: 2200 }),
    crickets: () => oscPulse({ type: "square", freq: 4200, bp: 4200, q: 10, peak: 0.03, att: 0.008, dur: 0.05, min: 900, max: 2600 }),
    owl: () => oscPulse({ freq: 210, lp: 0, peak: 0.1, att: 0.05, dur: 0.35, min: 8000, max: 17000 }),
    frogs: () => oscPulse({ type: "sawtooth", freq: 170, bp: 360, q: 5, peak: 0.07, att: 0.02, dur: 0.14, min: 1600, max: 4000 }),
    chime: () => oscPulse({ freq: 784, peak: 0.08, att: 0.02, dur: 1.6, min: 2800, max: 7000 }),
    clock: () => oscPulse({ freq: 980, peak: 0.07, att: 0.004, dur: 0.05, min: 1000, max: 1000 })
  };

  function fade(gain, value, ms = 500) {
    const now = ctx.currentTime;
    const v = Math.max(0.0001, value);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.linearRampToValueAtTime(value <= 0 ? 0.0001 : v, now + ms / 1000);
    if (value <= 0) setTimeout(() => { if (gain.gain.value < 0.001) gain.gain.value = 0; }, ms + 30);
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
        if (volume <= 0.01) return;
        const created = factories[id]();
        created.out.connect(master);
        nodes[id] = created;
        if (created.startLoop) created.startLoop();
      }
      fade(nodes[id].out, volume);
    },
    stopAll() {
      Object.keys(nodes).forEach((id) => fade(nodes[id].out, 0, 700));
    },
    fadeOutAll(ms = 20000) {
      Object.keys(nodes).forEach((id) => fade(nodes[id].out, 0, ms));
    },
    getContext() { ensure(); return ctx; }
  };
})();
