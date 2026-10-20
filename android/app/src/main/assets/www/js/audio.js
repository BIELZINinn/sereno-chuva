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
    comp.threshold.value = -18;
    comp.knee.value = 24;
    comp.ratio.value = 2.2;
    comp.attack.value = 0.012;
    comp.release.value = 0.28;
    master.connect(comp);
    comp.connect(ctx.destination);
    makeBufs();
  }

  function makeBufs() {
    const n = Math.floor(ctx.sampleRate * 2);
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
      b[i] = last * 3.5;
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

  function lfo(hz, amt, dest) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = hz;
    g.gain.value = amt;
    o.connect(g);
    g.connect(dest);
    o.start();
    return o;
  }

  function chain(buf, opt) {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(buf, opt.rate || 1);
    let node = src;
    let bpNode = null;
    if (opt.hp) { const f = filter("highpass", opt.hp, opt.hpQ || 0.7); node.connect(f); node = f; }
    if (opt.lp) { const f = filter("lowpass", opt.lp, opt.lpQ || 0.8); node.connect(f); node = f; }
    if (opt.bp) {
      bpNode = filter("bandpass", opt.bp, opt.q || 1);
      node.connect(bpNode);
      node = bpNode;
    }
    const g = ctx.createGain();
    g.gain.value = opt.gain == null ? 0.4 : opt.gain;
    node.connect(g);
    g.connect(out);
    if (opt.lfoHz) {
      if (opt.lfoTarget === "filter" && bpNode) lfo(opt.lfoHz, opt.lfoAmt, bpNode.frequency);
      else lfo(opt.lfoHz, opt.lfoAmt, g.gain);
    }
    return { out };
  }

  function mix(specs) {
    const out = ctx.createGain();
    out.gain.value = 0;
    specs.forEach((s) => {
      const c = chain(s.buf, s);
      c.out.gain.value = 1;
      c.out.connect(out);
    });
    return { out };
  }

  function envGain(dest, peak, attack, hold) {
    const t = ctx.currentTime;
    const p = Math.max(0.0002, peak);
    dest.gain.cancelScheduledValues(t);
    dest.gain.setValueAtTime(0.0001, t);
    dest.gain.exponentialRampToValueAtTime(p, t + Math.max(0.004, attack));
    dest.gain.exponentialRampToValueAtTime(0.0001, t + hold);
  }

  function pulse(out, fire, minMs, maxMs) {
    let live = true;
    let id;
    const tick = () => {
      if (!live) return;
      if (out.gain.value > 0.012) fire();
      id = setTimeout(tick, rand(minMs, maxMs));
    };
    id = setTimeout(tick, rand(minMs * 0.35, maxMs * 0.55));
    return () => { live = false; clearTimeout(id); };
  }

  function flash(power) {
    if (window.SerenoVisual) window.SerenoVisual.flash(power);
  }

  function thunderVoice(kind) {
    const out = ctx.createGain();
    out.gain.value = 0;

    const bodySrc = loop(bufs.pink, kind === "far" ? 0.42 : 0.62);
    const bodyLp = filter("lowpass", kind === "far" ? 140 : kind === "close" ? 380 : 260, 0.7);
    const bodyHp = filter("highpass", kind === "far" ? 28 : 40, 0.6);
    const bodyEnv = ctx.createGain();
    bodyEnv.gain.value = 0.0001;
    bodySrc.connect(bodyHp).connect(bodyLp).connect(bodyEnv).connect(out);

    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = kind === "far" ? 28 : kind === "close" ? 42 : 34;
    const subEnv = ctx.createGain();
    subEnv.gain.value = 0.0001;
    sub.connect(subEnv).connect(out);
    sub.start();

    const crackSrc = loop(bufs.white, 1.05);
    const crackHp = filter("highpass", kind === "zap" ? 1800 : 900, 0.8);
    const crackBp = filter("bandpass", kind === "zap" ? 4200 : 2400, kind === "zap" ? 1.6 : 0.9);
    const crackEnv = ctx.createGain();
    crackEnv.gain.value = 0.0001;
    crackSrc.connect(crackHp).connect(crackBp).connect(crackEnv).connect(out);

    const snapSrc = loop(bufs.white, 1.4);
    const snapHp = filter("highpass", 5000, 0.7);
    const snapEnv = ctx.createGain();
    snapEnv.gain.value = 0.0001;
    snapSrc.connect(snapHp).connect(snapEnv).connect(out);

    const boom = () => {
      const t = ctx.currentTime;
      if (kind === "zap") {
        const n = 1 + Math.floor(rand(0, 3));
        for (let i = 0; i < n; i++) {
          const at = t + i * rand(0.018, 0.07);
          crackEnv.gain.setValueAtTime(0.0001, at);
          crackEnv.gain.exponentialRampToValueAtTime(rand(0.45, 0.85), at + 0.004);
          crackEnv.gain.exponentialRampToValueAtTime(0.0001, at + rand(0.03, 0.09));
          snapEnv.gain.setValueAtTime(0.0001, at);
          snapEnv.gain.exponentialRampToValueAtTime(rand(0.25, 0.55), at + 0.002);
          snapEnv.gain.exponentialRampToValueAtTime(0.0001, at + rand(0.012, 0.03));
        }
        if (Math.random() > 0.45) {
          bodyEnv.gain.setValueAtTime(0.0001, t + 0.04);
          bodyEnv.gain.exponentialRampToValueAtTime(0.12, t + 0.08);
          bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
        }
        flash(rand(0.75, 1));
        return;
      }

      if (kind === "close") {
        snapEnv.gain.setValueAtTime(0.0001, t);
        snapEnv.gain.exponentialRampToValueAtTime(0.7, t + 0.003);
        snapEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
        crackEnv.gain.setValueAtTime(0.0001, t);
        crackEnv.gain.exponentialRampToValueAtTime(0.9, t + 0.008);
        crackEnv.gain.exponentialRampToValueAtTime(0.12, t + 0.12);
        crackEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        bodyEnv.gain.setValueAtTime(0.0001, t + 0.02);
        bodyEnv.gain.exponentialRampToValueAtTime(1.05, t + 0.08);
        bodyEnv.gain.exponentialRampToValueAtTime(0.35, t + 0.9);
        bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + rand(2.8, 4.6));
        sub.frequency.setValueAtTime(58, t);
        sub.frequency.exponentialRampToValueAtTime(26, t + 1.8);
        subEnv.gain.setValueAtTime(0.0001, t + 0.04);
        subEnv.gain.exponentialRampToValueAtTime(0.38, t + 0.12);
        subEnv.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
        flash(0.62);
        return;
      }

      if (kind === "far") {
        bodyLp.frequency.setValueAtTime(90, t);
        bodyLp.frequency.linearRampToValueAtTime(160, t + 0.8);
        bodyLp.frequency.linearRampToValueAtTime(70, t + 4);
        bodyEnv.gain.setValueAtTime(0.0001, t);
        bodyEnv.gain.exponentialRampToValueAtTime(0.55, t + rand(0.35, 0.7));
        bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + rand(4.5, 7.5));
        sub.frequency.setValueAtTime(32, t);
        sub.frequency.exponentialRampToValueAtTime(22, t + 3);
        subEnv.gain.setValueAtTime(0.0001, t + 0.2);
        subEnv.gain.exponentialRampToValueAtTime(0.16, t + 0.7);
        subEnv.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
        flash(0.12);
        return;
      }

      if (Math.random() > 0.35) {
        crackEnv.gain.setValueAtTime(0.0001, t);
        crackEnv.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
        crackEnv.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      }
      bodyEnv.gain.setValueAtTime(0.0001, t);
      bodyEnv.gain.exponentialRampToValueAtTime(0.85, t + 0.12);
      bodyEnv.gain.exponentialRampToValueAtTime(0.28, t + 1.1);
      bodyEnv.gain.exponentialRampToValueAtTime(0.0001, t + rand(3.2, 5.4));
      sub.frequency.setValueAtTime(48, t);
      sub.frequency.exponentialRampToValueAtTime(24, t + 2.2);
      subEnv.gain.setValueAtTime(0.0001, t + 0.06);
      subEnv.gain.exponentialRampToValueAtTime(0.24, t + 0.2);
      subEnv.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      flash(0.38);
    };

    const wait = kind === "far" ? [10000, 26000]
      : kind === "zap" ? [7000, 20000]
      : kind === "close" ? [8000, 20000]
      : [7000, 18000];
    const stop = pulse(out, boom, wait[0], wait[1]);
    return { out, startLoop() { setTimeout(boom, rand(900, 2800)); }, stop };
  }

  function noiseHit({ hp, bp, q, peak, att, dur, min, max, rate }) {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(bufs.white, rate || 1);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    let node = src;
    if (hp) { const f = filter("highpass", hp); node.connect(f); node = f; }
    if (bp) { const f = filter("bandpass", bp, q || 4); node.connect(f); node = f; }
    node.connect(env).connect(out);
    const stop = pulse(out, () => envGain(env, peak, att, dur), min, max);
    return { out, stop };
  }

  function dripVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(bufs.white, 0.9);
    const bp = filter("bandpass", 1400, 8);
    const lp = filter("lowpass", 4200);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    src.connect(bp).connect(lp).connect(env).connect(out);
    const stop = pulse(out, () => {
      const t = ctx.currentTime;
      const f = rand(1100, 1900);
      bp.frequency.setValueAtTime(f, t);
      bp.frequency.exponentialRampToValueAtTime(f * 0.55, t + 0.16);
      envGain(env, rand(0.12, 0.2), 0.004, rand(0.12, 0.22));
    }, 900, 2400);
    return { out, stop };
  }

  function cricketVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 4800;
    const bp = filter("bandpass", 4800, 14);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    osc.connect(bp).connect(env).connect(out);
    osc.start();
    const chirp = () => {
      const t = ctx.currentTime;
      const f = rand(4300, 5400);
      osc.frequency.setValueAtTime(f, t);
      const n = 4 + Math.floor(rand(0, 4));
      for (let i = 0; i < n; i++) {
        const at = t + i * 0.032;
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(0.045, at + 0.006);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 0.022);
      }
    };
    const stop = pulse(out, chirp, 1400, 3200);
    return { out, stop };
  }

  function owlVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 320;
    const lp = filter("lowpass", 900);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    osc.connect(lp).connect(env).connect(out);
    osc.start();
    const hoot = () => {
      const t = ctx.currentTime;
      [0, 0.55].forEach((off, i) => {
        const at = t + off;
        const a = i === 0 ? 340 : 300;
        osc.frequency.setValueAtTime(a, at);
        osc.frequency.exponentialRampToValueAtTime(a * 0.78, at + 0.38);
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(0.11, at + 0.06);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 0.42);
      });
    };
    const stop = pulse(out, hoot, 9000, 18000);
    return { out, stop };
  }

  function frogVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 280;
    const bp = filter("bandpass", 420, 3.5);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    osc.connect(bp).connect(env).connect(out);
    osc.start();
    const ribbit = () => {
      const t = ctx.currentTime;
      const n = 2 + Math.floor(rand(0, 3));
      for (let i = 0; i < n; i++) {
        const at = t + i * 0.16;
        osc.frequency.setValueAtTime(rand(360, 460), at);
        osc.frequency.exponentialRampToValueAtTime(rand(160, 220), at + 0.11);
        env.gain.setValueAtTime(0.0001, at);
        env.gain.exponentialRampToValueAtTime(0.09, at + 0.02);
        env.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
      }
    };
    const stop = pulse(out, ribbit, 1800, 4200);
    return { out, stop };
  }

  function chimeVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const partials = [523, 784, 1046].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.0001;
      o.connect(g).connect(out);
      o.start();
      return { o, g, f };
    });
    const stop = pulse(out, () => {
      const t = ctx.currentTime;
      const det = rand(0.98, 1.03);
      partials.forEach((p, i) => {
        p.o.frequency.setValueAtTime(p.f * det, t);
        p.g.gain.setValueAtTime(0.0001, t);
        p.g.gain.exponentialRampToValueAtTime(0.07 / (i + 1), t + 0.02);
        p.g.gain.exponentialRampToValueAtTime(0.0001, t + rand(1.4, 2.4));
      });
    }, 3200, 8000);
    return { out, stop };
  }

  function clockVoice() {
    const out = ctx.createGain();
    out.gain.value = 0;
    const src = loop(bufs.white, 1);
    const bp = filter("bandpass", 1800, 6);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    src.connect(bp).connect(env).connect(out);
    let tock = false;
    const stop = pulse(out, () => {
      tock = !tock;
      bp.frequency.setValueAtTime(tock ? 1400 : 2100, ctx.currentTime);
      envGain(env, tock ? 0.055 : 0.07, 0.0015, 0.028);
    }, 1000, 1000);
    return { out, stop };
  }

  function fireVoice() {
    const base = chain(bufs.pink, { hp: 90, bp: 380, q: 0.8, rate: 0.85, gain: 0.28, lfoHz: 9, lfoAmt: 0.08 });
    const out = ctx.createGain();
    out.gain.value = 0;
    base.out.gain.value = 1;
    base.out.connect(out);
    const src = loop(bufs.white, 1.2);
    const hp = filter("highpass", 1800);
    const env = ctx.createGain();
    env.gain.value = 0.0001;
    src.connect(hp).connect(env).connect(out);
    const stop = pulse(out, () => envGain(env, rand(0.08, 0.22), 0.003, rand(0.04, 0.12)), 180, 700);
    return { out, stop };
  }

  function hailVoice() {
    return noiseHit({ hp: 2200, bp: 5000, q: 2.2, peak: 0.2, att: 0.002, dur: 0.045, min: 70, max: 220, rate: 1.2 });
  }

  const factories = {
    rain: () => mix([
      { buf: bufs.brown, hp: 180, lp: 2200, rate: 0.72, gain: 0.5 },
      { buf: bufs.white, hp: 1200, lp: 6500, rate: 0.95, gain: 0.16, lfoHz: 0.11, lfoAmt: 0.05 }
    ]),
    drizzle: () => mix([
      { buf: bufs.white, hp: 2400, lp: 7800, rate: 0.8, gain: 0.14 },
      { buf: bufs.pink, hp: 900, lp: 2800, rate: 0.55, gain: 0.08 }
    ]),
    heavy: () => mix([
      { buf: bufs.white, hp: 120, lp: 3800, rate: 0.88, gain: 0.55 },
      { buf: bufs.brown, lp: 280, rate: 0.5, gain: 0.35 },
      { buf: bufs.white, hp: 2800, lp: 8000, rate: 1.05, gain: 0.12 }
    ]),
    roof: () => mix([
      { buf: bufs.white, hp: 700, bp: 2100, q: 1.4, rate: 1.02, gain: 0.32, lfoHz: 7, lfoAmt: 0.1 },
      { buf: bufs.pink, hp: 400, lp: 1600, rate: 0.8, gain: 0.18 }
    ]),
    tent: () => mix([
      { buf: bufs.white, bp: 1450, q: 1.2, rate: 0.95, gain: 0.34 },
      { buf: bufs.brown, lp: 500, rate: 0.6, gain: 0.16 }
    ]),
    window: () => mix([
      { buf: bufs.brown, lp: 780, rate: 0.55, gain: 0.62 },
      { buf: bufs.pink, hp: 200, lp: 1400, rate: 0.7, gain: 0.18 }
    ]),
    gutter: () => mix([
      { buf: bufs.brown, bp: 420, q: 1.8, rate: 0.92, gain: 0.4, lfoHz: 0.22, lfoAmt: 0.08 },
      { buf: bufs.pink, hp: 200, lp: 900, rate: 0.7, gain: 0.2 }
    ]),
    puddle: () => mix([
      { buf: bufs.brown, bp: 620, q: 1.1, rate: 0.85, gain: 0.28 },
      { buf: bufs.white, hp: 1600, lp: 5000, rate: 0.9, gain: 0.08 }
    ]),
    hail: () => hailVoice(),
    rumble: () => chain(bufs.brown, { lp: 78, rate: 0.28, gain: 0.72, lfoHz: 0.04, lfoAmt: 0.16 }),
    wind: () => mix([
      { buf: bufs.brown, bp: 240, q: 0.55, rate: 0.42, gain: 0.42, lfoHz: 0.06, lfoAmt: 90, lfoTarget: "filter" },
      { buf: bufs.pink, hp: 600, lp: 2400, rate: 0.7, gain: 0.1, lfoHz: 0.08, lfoAmt: 0.04 }
    ]),
    breeze: () => chain(bufs.brown, { bp: 190, q: 0.45, rate: 0.3, gain: 0.32, lfoHz: 0.05, lfoAmt: 0.08 }),
    leaves: () => chain(bufs.white, { bp: 2800, q: 0.85, rate: 1.08, gain: 0.22, lfoHz: 0.14, lfoAmt: 0.08 }),
    river: () => mix([
      { buf: bufs.brown, hp: 70, lp: 1100, rate: 0.68, gain: 0.42 },
      { buf: bufs.white, hp: 900, lp: 3600, rate: 0.9, gain: 0.1 }
    ]),
    waves: () => chain(bufs.brown, { lp: 620, rate: 0.48, gain: 0.38, lfoHz: 0.07, lfoAmt: 0.18 }),
    fire: () => fireVoice(),
    forest: () => chain(bufs.brown, { lp: 420, rate: 0.38, gain: 0.32, lfoHz: 0.03, lfoAmt: 0.06 }),
    fan: () => chain(bufs.brown, { bp: 165, q: 0.85, rate: 0.68, gain: 0.48, lfoHz: 0.4, lfoAmt: 0.04 }),
    train: () => chain(bufs.brown, { lp: 150, rate: 0.32, gain: 0.3, lfoHz: 2.4, lfoAmt: 0.1 }),
    purr: () => chain(bufs.brown, { bp: 85, q: 3.2, rate: 0.55, gain: 0.36, lfoHz: 24, lfoAmt: 0.14 }),
    snow: () => chain(bufs.white, { lp: 520, rate: 0.32, gain: 0.18 }),
    brown: () => chain(bufs.brown, { lp: 200, rate: 0.48, gain: 0.82 }),
    cafe: () => chain(bufs.pink, { bp: 780, q: 0.45, rate: 0.75, gain: 0.18, lfoHz: 0.2, lfoAmt: 0.04 }),
    thunder: () => thunderVoice("mid"),
    closeThunder: () => thunderVoice("close"),
    distantThunder: () => thunderVoice("far"),
    lightning: () => thunderVoice("zap"),
    drip: () => dripVoice(),
    crickets: () => cricketVoice(),
    owl: () => owlVoice(),
    frogs: () => frogVoice(),
    chime: () => chimeVoice(),
    clock: () => clockVoice()
  };

  function fade(gain, value, ms = 500) {
    const now = ctx.currentTime;
    const v = Math.max(0.0001, value);
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.linearRampToValueAtTime(value <= 0 ? 0.0001 : v, now + ms / 1000);
    if (value <= 0) setTimeout(() => { if (gain.gain.value < 0.001) gain.gain.value = 0; }, ms + 40);
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
