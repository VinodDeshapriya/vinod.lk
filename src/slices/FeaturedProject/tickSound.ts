/**
 * A soft mechanical "tick" for the project dial, made on the fly with the
 * Web Audio API (no audio file to load). One tick plays for every ruler mark
 * the marker passes, spaced to follow the marker's ease-out glide.
 */
type Engine = { ctx: AudioContext; buffer: AudioBuffer; input: AudioNode };
let engine: Engine | null = null;

/** Call from a click / key / touch handler: browsers only allow audio after a gesture. */
export function prepareTick() {
  if (typeof window === "undefined" || !("AudioContext" in window)) return;
  try {
    if (!engine) {
      const ctx = new AudioContext({ latencyHint: "interactive" });
      // 8 ms burst of noise with a fast attack and a steep decay.
      const len = Math.ceil(0.008 * ctx.sampleRate);
      const data = new Float32Array(len);
      let seed = 731;
      for (let i = 0; i < len; i++) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        const noise = (seed / 0xffffffff) * 2 - 1;
        const attack = Math.min(1, i / (0.001 * ctx.sampleRate));
        data[i] = noise * attack * (1 - i / (len - 1)) ** 3;
      }
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      buffer.getChannelData(0).set(data);
      const hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 700;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 4200;
      lp.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.value = 0.05;
      hp.connect(lp).connect(gain).connect(ctx.destination);
      engine = { ctx, buffer, input: hp };
    }
    if (engine.ctx.state === "suspended") engine.ctx.resume().catch(() => {});
  } catch {
    engine = null;
  }
}

let live: AudioBufferSourceNode[] = [];

/** Play `marks` ticks over `durationMs`, slowing down like an ease-out. */
export function playTicks(marks: number, durationMs = 500) {
  if (!engine || engine.ctx.state !== "running" || document.hidden || marks < 1) return;
  live.forEach((s) => {
    try {
      s.stop();
    } catch {}
  });
  live = [];
  const n = Math.min(marks, 40);
  const now = engine.ctx.currentTime;
  for (let k = 1; k <= n; k++) {
    const f = k / n; // share of the distance covered
    const t = (1 - Math.pow(1 - f, 1 / 4)) * (durationMs / 1000); // inverse ease-out-quart
    const src = engine.ctx.createBufferSource();
    src.buffer = engine.buffer;
    src.connect(engine.input);
    src.onended = () => src.disconnect();
    src.start(now + t);
    live.push(src);
  }
}
