import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import GirlsGottaGolfWordmark from "@/components/GirlsGottaGolfWordmark";

const STILLS = [
  { base: "/assets/stills/01-setup", focal: [0.45, 0.82] as [number, number] },
  { base: "/assets/stills/02-fairway", focal: [0.5, 0.2] as [number, number] },
  { base: "/assets/stills/03-green", focal: [0.5, 0.15] as [number, number] },
  { base: "/assets/stills/04-celebration", focal: [0.5, 0.5] as [number, number] },
];

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const LERP = 0.1;
const SEG_COUNT = STILLS.length - 1;

type Beat = { el: string; start: number; end: number };

/**
 * Scroll-driven "play the hole" hero, ported from the original repo's main.js.
 * GSAP is loaded dynamically client-side so SSR isn't poisoned.
 */
export default function GolfJourney() {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    let disposed = false;
    let rafId = 0;
    let cleanup: (() => void) | null = null;

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const obMod = await import("gsap/Observer");
      const gsap = (gsapMod as any).default ?? gsapMod;
      const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
      const Observer = (obMod as any).Observer ?? (obMod as any).default;

      if (disposed) return;

      const canvas = document.getElementById("scene") as HTMLCanvasElement | null;
      const loader = document.getElementById("loader");
      const loaderFill = document.getElementById("loader-fill");
      if (!canvas || !loader || !loaderFill) return;
      const ctx = canvas.getContext("2d")!;

      const BEATS: Beat[] = [
        { el: "beat-title", start: 0.0, end: 0.07 },
        { el: "beat-flight", start: 0.28, end: 0.41 },
        { el: "beat-green", start: 0.61, end: 0.74 },
        { el: "beat-sink", start: 0.94, end: 1.0 },
      ];

      let stillImages: HTMLImageElement[] = [];
      const segments: (HTMLImageElement | null)[][] = [[], [], []];
      let chapterProgress = [0, 1 / 3, 2 / 3, 1];
      let target = 0;
      let current = 0;
      let dpr = 1;

      function loadImage(src: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      async function loadImageAny(base: string) {
        for (const ext of EXTENSIONS) {
          try {
            return await loadImage(`${base}.${ext}`);
          } catch (_) {}
        }
        throw new Error(`Missing image: ${base}`);
      }

      function setProgressBar(frac: number) {
        loaderFill!.style.width = `${Math.round(frac * 100)}%`;
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas!.width = canvas!.clientWidth * dpr;
        canvas!.height = canvas!.clientHeight * dpr;
      }

      function drawCover(img: HTMLImageElement, scale: number, fx: number, fy: number, alpha: number) {
        const cw = canvas!.width;
        const ch = canvas!.height;
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const s = Math.max(cw / iw, ch / ih) * scale;
        const dw = iw * s;
        const dh = ih * s;
        let x = cw / 2 - fx * dw;
        let y = ch / 2 - fy * dh;
        x = Math.min(0, Math.max(cw - dw, x));
        y = Math.min(0, Math.max(ch - dh, y));
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, x, y, dw, dh);
        ctx.globalAlpha = 1;
      }

      function renderStillSegment(seg: number, t: number) {
        const a = STILLS[seg];
        const b = STILLS[seg + 1];
        const easeT = t * t * (3 - 2 * t);
        drawCover(stillImages[seg], 1 + 0.4 * easeT, a.focal[0], a.focal[1], 1);
        if (t > 0.55) {
          const f = (t - 0.55) / 0.45;
          const ef = f * f * (3 - 2 * f);
          drawCover(stillImages[seg + 1], 1.18 - 0.18 * ef, b.focal[0], b.focal[1], ef);
        }
      }

      function segmentAt(p: number): [number, number] {
        for (let s = SEG_COUNT - 1; s >= 0; s--) {
          if (p >= chapterProgress[s]) {
            const span = chapterProgress[s + 1] - chapterProgress[s];
            return [s, Math.min(1, Math.max(0, (p - chapterProgress[s]) / span))];
          }
        }
        return [0, 0];
      }

      function render(p: number) {
        const [seg, t] = segmentAt(p);
        const segFrames = segments[seg];
        if (segFrames.length) {
          const f = t * (segFrames.length - 1);
          const i0 = Math.floor(f);
          const i1 = Math.min(segFrames.length - 1, i0 + 1);
          const mix = f - i0;
          if (segFrames[i0]) {
            drawCover(segFrames[i0]!, 1, 0.5, 0.5, 1);
            if (mix > 0.01 && segFrames[i1]) drawCover(segFrames[i1]!, 1, 0.5, 0.5, mix);
            return;
          }
        }
        if (stillImages.length) renderStillSegment(seg, t);
      }

      function computeBeats() {
        const [, c1, c2] = chapterProgress;
        BEATS[0].start = 0;
        BEATS[0].end = c1 * 0.18;
        BEATS[1].start = c1 - 0.05;
        BEATS[1].end = c1 + 0.08;
        BEATS[2].start = c2 - 0.05;
        BEATS[2].end = c2 + 0.08;
        BEATS[3].start = 0.92;
        BEATS[3].end = 1;
      }

      function updateBeats(p: number) {
        for (const beat of BEATS) {
          const el = document.getElementById(beat.el);
          if (!el) continue;
          const sink = beat.el === "beat-sink";
          const span = beat.end - beat.start;
          const fade = sink ? 0.06 : Math.min(0.25 * span, 0.02);
          let o = 0;
          if (p >= beat.start && p <= beat.end) {
            const inEdge = beat.start <= 0 ? 1 : (p - beat.start) / fade;
            const outEdge = beat.end >= 1 ? 1 : (beat.end - p) / fade;
            o = Math.max(0, Math.min(1, inEdge, outEdge));
          }
          el.style.opacity = String(o);
          if (sink) el.style.transform = `translateY(${(1 - o) * 60}px)`;
        }
      }

      function tick() {
        current += (target - current) * LERP;
        if (Math.abs(target - current) < 0.0004) current = target;
        render(current);
        updateBeats(current);
        document.body.classList.toggle("banner-on", current > 0.985);
        rafId = requestAnimationFrame(tick);
      }

      async function loadAssets() {
        let manifest: any = null;
        try {
          const res = await fetch("/assets/frames/manifest.json", { cache: "no-store" });
          if (res.ok) manifest = await res.json();
        } catch (_) {}

        const segFiles: string[][] = (manifest?.segments || []).map((s: any) => s.files || []);

        const weights: number[] = [];
        for (let s = 0; s < SEG_COUNT; s++) weights.push(segFiles[s]?.length ? 2 : 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        chapterProgress = [0];
        let acc = 0;
        for (const w of weights) {
          acc += w / totalWeight;
          chapterProgress.push(acc);
        }
        chapterProgress[SEG_COUNT] = 1;
        computeBeats();

        const firstSegTotal = segFiles[0]?.length || 0;
        const weight = STILLS.length + firstSegTotal;
        let done = 0;
        const bump = () => setProgressBar(++done / weight);

        const stillsPromise = Promise.all(
          STILLS.map((s) => loadImageAny(s.base).then((img) => (bump(), img)))
        );

        if (firstSegTotal) {
          segments[0] = new Array(firstSegTotal).fill(null);
          await Promise.all(
            segFiles[0].map((f, i) =>
              loadImage(`/assets/frames/${f}`).then((img) => {
                segments[0][i] = img;
                bump();
              })
            )
          );
        }

        stillImages = await stillsPromise;

        for (let s = 1; s < SEG_COUNT; s++) {
          if (!segFiles[s]?.length) continue;
          segments[s] = new Array(segFiles[s].length).fill(null);
          segFiles[s].forEach((f, i) => {
            loadImage(`/assets/frames/${f}`).then((img) => {
              segments[s][i] = img;
            });
          });
        }
      }

      let chapter = 0;
      let paging = false;
      let pageObserver: any = null;
      const scrollProxy = { y: 0 };

      function maxScroll() {
        return document.getElementById("journey")!.offsetHeight - window.innerHeight;
      }

      function goToChapter(i: number) {
        chapter = Math.max(0, Math.min(SEG_COUNT, i));
        const dest = chapterProgress[chapter] * maxScroll();
        const segPx = maxScroll() / SEG_COUNT;
        const duration = Math.min(
          2.6,
          Math.max(0.4, 2.4 * (Math.abs(dest - window.scrollY) / segPx))
        );
        paging = true;
        scrollProxy.y = window.scrollY;
        gsap.to(scrollProxy, {
          y: dest,
          duration,
          ease: "power1.inOut",
          overwrite: true,
          onUpdate: () => window.scrollTo(0, scrollProxy.y),
          onComplete: () => {
            paging = false;
          },
        });
      }

      function leaveJourney() {
        pageObserver?.disable();
        paging = true;
        const dest = Math.min(
          document.getElementById("journey")!.offsetHeight,
          document.documentElement.scrollHeight - window.innerHeight
        );
        scrollProxy.y = window.scrollY;
        gsap.to(scrollProxy, {
          y: dest,
          duration: 1.2,
          ease: "power1.inOut",
          overwrite: true,
          onUpdate: () => window.scrollTo(0, scrollProxy.y),
          onComplete: () => {
            paging = false;
          },
        });
      }

      function initScroll() {
        gsap.registerPlugin(ScrollTrigger, Observer);
        ScrollTrigger.create({
          trigger: "#journey",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self: any) => {
            target = self.progress;
          },
          onEnterBack: () => {
            pageObserver?.enable();
            if (!paging) goToChapter(SEG_COUNT);
          },
          onLeave: () => {
            if (!paging) pageObserver?.disable();
          },
        });

        pageObserver = Observer.create({
          target: window,
          type: "wheel,touch",
          wheelSpeed: -1,
          tolerance: 10,
          preventDefault: true,
          onUp: () => {
            if (paging) return;
            if (chapter >= SEG_COUNT) leaveJourney();
            else goToChapter(chapter + 1);
          },
          onDown: () => {
            if (!paging) goToChapter(chapter - 1);
          },
        });

        const p0 = maxScroll() > 0 ? window.scrollY / maxScroll() : 0;
        chapterProgress.forEach((c, i) => {
          if (Math.abs(c - p0) < Math.abs(chapterProgress[chapter] - p0)) chapter = i;
        });
        if (window.scrollY >= maxScroll() - 2) pageObserver.disable();
      }

      function initFallback() {
        document.body.classList.add("static");
        const fb = document.getElementById("fallback");
        if (!fb) return;
        fb.hidden = false;
        for (const s of STILLS) {
          const img = document.createElement("img");
          img.src = `${s.base}.png`;
          img.onerror = () => {
            img.src = `${s.base}.jpg`;
          };
          img.alt = "";
          fb.appendChild(img);
        }
      }

      async function init() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          initFallback();
          return;
        }
        resize();
        window.addEventListener("resize", resize);
        try {
          await loadAssets();
        } catch (err) {
          const label = loader!.querySelector(".loader-label");
          if (label) label.textContent = "Could not load images";
          console.error(err);
          return;
        }
        if (disposed) return;
        loader!.classList.add("done");
        initScroll();
        rafId = requestAnimationFrame(tick);
      }

      init();

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", resize);
        pageObserver?.kill();
        ScrollTrigger.getAll().forEach((t: any) => t.kill());
        document.body.classList.remove("banner-on", "static");
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <div id="loader">
        <div className="loader-inner">
          <span className="loader-label">Girls Gotta Golf</span>
          <div className="loader-bar">
            <div id="loader-fill" />
          </div>
        </div>
      </div>

      <header id="banner">
        <img src="/assets/stills/logo-green.png" alt="" className="banner-mark" />
        <span className="banner-word">Girls Gotta Golf</span>
        <button className="banner-cta" onClick={() => navigateRef.current({ to: "/join" })}>
          Join the club
        </button>
      </header>

      <main id="journey">
        <div className="stage">
          <canvas id="scene" />

          <div className="beat veil" id="beat-title">
            <p className="kicker">
              A golf club for girls — building careers, friendships, and a better
              weekend plan
            </p>
            <h1>Girls Gotta Golf</h1>
            <div className="divider">
              <span></span>
              <b></b>
              <span></span>
            </div>
            <p className="hint">
              Scroll to tee off <span className="arrow">↓</span>
            </p>
          </div>

          <div className="beat lower" id="beat-flight">
            <p className="kicker">A modern third place for women</p>
            <h2>
              Somewhere active, social, stylish —<br />and grounded in real connections.
            </h2>
          </div>

          <div className="beat lower" id="beat-green">
            <p className="kicker">What to expect</p>
            <ul className="expect">
              <li>Beginner-friendly events</li>
              <li>Practice sessions</li>
              <li>Group play</li>
              <li>Post-golf drinks</li>
            </ul>
          </div>

          <div className="beat" id="beat-sink">
            <img
              src="/assets/stills/logo-cream.png"
              alt="Girls Gotta Golf"
              id="logo-reveal"
            />
            <p className="sink-line">See you on the green.</p>
          </div>

          <div id="fallback" hidden />
        </div>
      </main>
    </>
  );
}
