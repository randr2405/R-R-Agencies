import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Renderer, Program, Mesh, Triangle } from 'ogl'

const STORE_URL = 'https://www.randragencies.online'
const GALLERY_COUNT = 16

const galleryImages = Array.from({ length: GALLERY_COUNT }, (_, i) => ({
  src: encodeURI(`/sports/product1 (${i + 1}).jpg`),
  alt: `R&R Sport & Lifestyle product ${i + 1}`,
}))

const statement =
  "R&R Sports & Lifestyle is our answer to the modern athlete and lifestyle enthusiast who demands more from their apparel. We believe that performance wear shouldn't sacrifice style, and street fashion shouldn't compromise on functionality."

const LF_MAX_COLORS = 8
const LF_COLORS = ['#ffffff', '#c4c4c4', '#7d7d7d']

const lfHexToRGB = hex => {
  const c = hex.replace('#', '').padEnd(6, '0')
  return [parseInt(c.slice(0, 2), 16) / 255, parseInt(c.slice(2, 4), 16) / 255, parseInt(c.slice(4, 6), 16) / 255]
}

const lfPrepColors = input => {
  const base = (input && input.length ? input : LF_COLORS).slice(0, LF_MAX_COLORS)
  const count = base.length
  const arr = []
  for (let i = 0; i < LF_MAX_COLORS; i++) arr.push(lfHexToRGB(base[Math.min(i, base.length - 1)]))
  const avg = [0, 0, 0]
  for (let i = 0; i < count; i++) {
    avg[0] += arr[i][0]
    avg[1] += arr[i][1]
    avg[2] += arr[i][2]
  }
  return { arr, count, avg: avg.map(v => v / count) }
}

const lfVertex = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const lfFragment = `
precision highp float;

uniform vec3  iResolution;
uniform vec2  iMouse;
uniform float iTime;

uniform vec3  uColor0;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform vec3  uColor7;
uniform int   uColorCount;

uniform vec3  uBgColor;
uniform vec3  uMouseColor;
uniform float uSpeed;
uniform int   uStreakCount;
uniform float uStreakWidth;
uniform float uStreakLength;
uniform float uGlow;
uniform float uDensity;
uniform float uTwinkle;
uniform float uZoom;
uniform float uBgGlow;
uniform float uOpacity;
uniform float uMouseEnabled;
uniform float uMouseStrength;
uniform float uMouseRadius;
uniform float uLightMode;

varying vec2 vUv;

vec3 palette(float h) {
  int count = uColorCount;
  if (count < 1) count = 1;
  int idx = int(floor(clamp(h, 0.0, 0.999999) * float(count)));
  if (idx <= 0) return uColor0;
  if (idx == 1) return uColor1;
  if (idx == 2) return uColor2;
  if (idx == 3) return uColor3;
  if (idx == 4) return uColor4;
  if (idx == 5) return uColor5;
  if (idx == 6) return uColor6;
  return uColor7;
}

vec3 tanhv(vec3 x) {
  vec3 e = exp(-2.0 * x);
  return (1.0 - e) / (1.0 + e);
}

vec2 sceneC(vec2 frag, vec2 r) {
  vec2 P = (frag + frag - r) / r.x;
  float z = 0.0;
  float d = 1e3;
  vec4 O = vec4(0.0);
  for (int k = 0; k < 39; k++) {
    if (d <= 1e-4) break;
    O = z * normalize(vec4(P, uZoom, 0.0)) - vec4(0.0, 4.0, 1.0, 0.0) / 4.5;
    d = 1.0 - sqrt(length(O * O));
    z += d;
  }
  return vec2(O.x, atan(O.z, O.y));
}

void mainImage(out vec4 o, vec2 C) {
  vec2 r = iResolution.xy;
  vec2 uv0 = (C + C - r) / r.x;
  float T = 0.1 * iTime * uSpeed + 9.0;
  float angRings = max(1.0, floor(6.28318530718 * max(uDensity, 0.05) + 0.5));
  vec2 Y = vec2(5e-3, 6.28318530718 / angRings);

  vec2 c0 = sceneC(C, r);
  vec2 cdx = sceneC(C + vec2(1.0, 0.0), r);
  vec2 cdy = sceneC(C + vec2(0.0, 1.0), r);
  vec2 dCx = cdx - c0;
  vec2 dCy = cdy - c0;
  dCx.y -= 6.28318530718 * floor(dCx.y / 6.28318530718 + 0.5);
  dCy.y -= 6.28318530718 * floor(dCy.y / 6.28318530718 + 0.5);
  vec2 fw = abs(dCx) + abs(dCy);
  C = c0;

  vec2 P = vec2(2.0, 1.0) * uv0 - (r / r.x) * vec2(0.0, 1.0);
  vec4 O = uLightMode > 0.5
    ? vec4(0.0)
    : vec4(uBgColor * 90.0 * uBgGlow / (1e3 * dot(P, P) + 6.0), 0.0);

  float mGlow = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mN = (iMouse + iMouse - r) / r.x;
    float md = length(uv0 - mN);
    mGlow = exp(-md * md / max(uMouseRadius * uMouseRadius, 1e-4)) * uMouseStrength;
    O.rgb += uMouseColor * mGlow * 0.25;
  }

  float zr = 5e-4 * uStreakWidth;
  vec2 rr = vec2(max(length(fw), 1e-5));
  float tail = 19.0 / max(uStreakLength, 0.05);

  for (int m = 0; m < 16; m++) {
    if (m >= uStreakCount) break;
    float jf = float(m) + 1.0;
    float ic = fract(sin(dot(vec2(jf, floor(C.x / Y.x + 0.5)), vec2(7.0, 11.0)) * 73.0));
    vec2 Pp = C - (T + T * ic) * vec2(0.0, 1.0);
    Pp -= floor(Pp / Y + 0.5) * Y;
    float h = fract(8663.0 * ic);
    vec3 col = palette(h);
    float weight = mix(1.5, 1.0 + sin(T + 7.0 * h + 4.0), uTwinkle);
    weight *= (1.0 + mGlow * 2.0);
    vec2 inner = vec2(length(max(Pp, vec2(-1.0, 0.0))), length(Pp) - zr) - zr;
    vec2 sm = vec2(1.0) - smoothstep(-rr, rr, inner);
    O.rgb += dot(sm, vec2(exp(tail * Pp.y), 3.0)) * col * weight;
    C.x += Y.x / 8.0;
  }

  vec3 colr = sqrt(tanhv(max(O.rgb * uGlow - vec3(0.04, 0.08, 0.02), 0.0)));
  if (uLightMode > 0.5) {
    float peak = max(colr.r, max(colr.g, colr.b));
    float coverage = smoothstep(0.035, 0.58, peak) * uOpacity;
    vec3 chroma = clamp(colr / max(peak, 1e-4), 0.0, 1.0);
    chroma = pow(chroma, vec3(1.35));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 1e-4);
    o = vec4(mix(vec3(1.0), chroma, coverage * 0.94), 1.0);
  } else {
    o = vec4(colr, uOpacity);
  }
}

void main() {
  vec4 color;
  mainImage(color, vUv * iResolution.xy);
  gl_FragColor = color;
}
`

function Lightfall({
  colors = LF_COLORS,
  backgroundColor = '#000000',
  speed = 0.5,
  streakCount = 2,
  streakWidth = 1,
  streakLength = 1,
  glow = 1,
  density = 0.6,
  twinkle = 1,
  zoom = 3,
  backgroundGlow = 0.3,
  opacity = 1,
  mouseInteraction = true,
  mouseStrength = 0.5,
  mouseRadius = 1,
  mouseDampening = 0.15,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, antialias: true })
    const gl = renderer.gl
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const { arr, count, avg } = lfPrepColors(colors)
    const uniforms = {
      iResolution: { value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1] },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uColor0: { value: arr[0] },
      uColor1: { value: arr[1] },
      uColor2: { value: arr[2] },
      uColor3: { value: arr[3] },
      uColor4: { value: arr[4] },
      uColor5: { value: arr[5] },
      uColor6: { value: arr[6] },
      uColor7: { value: arr[7] },
      uColorCount: { value: count },
      uBgColor: { value: lfHexToRGB(backgroundColor) },
      uMouseColor: { value: avg },
      uSpeed: { value: speed },
      uStreakCount: { value: Math.max(1, Math.min(16, Math.round(streakCount))) },
      uStreakWidth: { value: streakWidth },
      uStreakLength: { value: streakLength },
      uGlow: { value: glow },
      uDensity: { value: density },
      uTwinkle: { value: twinkle },
      uZoom: { value: zoom },
      uBgGlow: { value: backgroundGlow },
      uOpacity: { value: opacity },
      uMouseEnabled: { value: mouseInteraction ? 1 : 0 },
      uMouseStrength: { value: mouseStrength },
      uMouseRadius: { value: mouseRadius },
      uLightMode: { value: 0 },
    }

    const program = new Program(gl, { vertex: lfVertex, fragment: lfFragment, uniforms })
    const geometry = new Triangle(gl)
    const mesh = new Mesh(gl, { geometry, program })

    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(rect.width, rect.height)
      uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight, 1]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const target = [0, 0]
    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect()
      const scale = renderer.dpr || 1
      target[0] = (e.clientX - rect.left) * scale
      target[1] = (rect.height - (e.clientY - rect.top)) * scale
      if (mouseDampening <= 0) uniforms.iMouse.value = [target[0], target[1]]
    }
    if (mouseInteraction) window.addEventListener('pointermove', onPointerMove, { passive: true })

    let raf = 0
    let last = 0
    const loop = t => {
      raf = requestAnimationFrame(loop)
      uniforms.iTime.value = t * 0.001
      if (mouseDampening > 0) {
        if (!last) last = t
        const dt = (t - last) / 1000
        last = t
        const factor = Math.min(1, 1 - Math.exp(-dt / Math.max(1e-4, mouseDampening)))
        const cur = uniforms.iMouse.value
        cur[0] += (target[0] - cur[0]) * factor
        cur[1] += (target[1] - cur[1]) * factor
      }
      renderer.render({ scene: mesh })
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      if (mouseInteraction) window.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
      if (canvas.parentElement === container) container.removeChild(canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [colors, backgroundColor, speed, streakCount, streakWidth, streakLength, glow, density, twinkle, zoom, backgroundGlow, opacity, mouseInteraction, mouseStrength, mouseRadius, mouseDampening])

  return <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }} />
}

const founders = [
  {
    focus: 'Sports & Performance',
    name: 'Romario Govender',
    role: 'Co-Founder • Athletic Excellence',
    paragraphs: [
      'A true athlete at heart, Romario has excelled in nearly every sport imaginable. As a semi-professional golfer, he brings an elite athlete\'s perspective to performance wear.',
      'His deep understanding of what athletes need—from moisture-wicking technology to ergonomic design—ensures every sportswear piece performs at the highest level.',
    ],
  },
  {
    focus: 'Lifestyle & Luxury',
    name: 'Rhea Jugernath',
    role: 'Co-Founder • Style & Sophistication',
    paragraphs: [
      'With a passion for fashion and an eye for luxury, Rhea brings the lifestyle element that elevates our brand beyond performance wear.',
      'Her expertise in contemporary design and premium materials ensures our lifestyle and luxury collections embody sophistication, comfort, and timeless style.',
    ],
  },
]

const range = ['Men', 'Women', 'Kids', 'Babies', 'Kids\' underwear']

const collections = [
  {
    group: 'Sportswear',
    items: [
      {
        tag: 'Performance',
        title: 'Active Performance Line',
        desc: 'Technical sportswear engineered for peak performance. Moisture-wicking fabrics, strategic ventilation, and ergonomic design for serious athletes.',
        features: ['Moisture-wicking technology', 'Strategic mesh panels', 'Ergonomic fit'],
      },
      {
        tag: 'Training',
        title: 'Training Essentials',
        desc: 'Versatile pieces designed for any workout. From HIIT to yoga, our training collection moves with you.',
        features: ['Flexible movement', 'Breathable fabrics', 'Durable construction'],
      },
    ],
  },
  {
    group: 'Lifestyle & Luxury',
    items: [
      {
        tag: 'Lifestyle',
        title: 'Urban Lifestyle',
        desc: 'Contemporary streetwear with athletic DNA. Comfort and style for everyday wear that transitions from day to night.',
        features: ['Modern aesthetics', 'Comfortable fits', 'Versatile styling'],
      },
      {
        tag: 'Luxury',
        title: 'Premium Collection',
        desc: 'Exclusive pieces crafted from the finest materials. Limited runs that combine luxury aesthetics with everyday functionality.',
        features: ['Premium materials', 'Refined details', 'Exclusive designs'],
      },
    ],
  },
]

const differentiators = [
  {
    title: 'Premium Fabrics',
    desc: 'We source only the finest technical fabrics from trusted suppliers. Each material is selected for its specific performance characteristics and durability.',
  },
  {
    title: 'Contemporary Design',
    desc: 'Our in-house design team creates original collections that blend athletic functionality with street-style aesthetics. Never basic, always authentic.',
  },
  {
    title: 'Limited Edition Exclusivity',
    desc: 'Every garment is produced in limited quantities. Once a design sells out, we never reproduce it again - making each piece truly exclusive and collectible.',
  },
]

const shopInfo = [
  { title: 'Delivery', desc: 'We deliver locally and internationally. The Courier Guy is built into our online store, so your shipping cost is worked out automatically as soon as you enter your address.' },
  { title: 'Free shipping', desc: 'Spend over a set amount and your shipping is on us.' },
  { title: 'Returns', desc: 'Not right? Return your order within 14 days.' },
  { title: 'Exchanges', desc: 'Need a different size or style? Exchange within 30 days.' },
  { title: 'Secure payment', desc: 'Pay online through PayFast at checkout.' },
  { title: 'Support 24/7', desc: 'You deal directly with us, the founders, any time of day.' },
]

const faqs = [
  { q: 'Do you deliver internationally?', a: 'Yes. We deliver locally and internationally, and the shipping cost is calculated automatically at checkout once you enter your address.' },
  { q: 'How is shipping calculated?', a: 'The Courier Guy is integrated directly into our online store. Enter your address and the cost is worked out for you.' },
  { q: 'Is there free shipping?', a: 'Yes, on orders over a certain amount.' },
  { q: 'What is your returns and exchange policy?', a: 'You can return an item within 14 days and exchange within 30 days.' },
  { q: 'How do I pay?', a: 'Online payments are processed securely through PayFast.' },
  { q: 'Who do I contact for help?', a: 'Message or call us directly. Support is available 24/7.' },
]


const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,800;1,6..96,400;1,6..96,600&family=Jost:wght@300;400;500;600&display=swap');

.sl {
  --black: #000;
  --white: #fff;
  --grey: #ececec;
  --mid: #6a6a6a;
  background: var(--white);
  color: var(--black);
  font-family: 'Jost', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.65;
  overflow-x: clip;
  min-height: 100vh;
  position: relative;
}
.sl *, .sl *::before, .sl *::after { box-sizing: border-box; }
.sl h1, .sl h2, .sl h3, .sl p, .sl ul, .sl address { margin: 0; padding: 0; }
.sl ul { list-style: none; }
.sl address { font-style: normal; }
:where(.sl) a { color: inherit; text-decoration: none; }
.sl a:focus-visible, .sl button:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
.sl h1, .sl h2, .sl h3, .sl-tagline, .sl-strip-item, .sl-closing, .sl-faq-btn, .sl-word-big { font-variation-settings: 'opsz' 28; }

.sl-cursor { position: fixed; top: 0; left: 0; z-index: 300; width: 16px; height: 16px; margin: -8px 0 0 -8px; border-radius: 50%; background: #fff; mix-blend-mode: difference; pointer-events: none; }
@media (pointer: coarse) { .sl-cursor { display: none; } }

.sl-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%; background: var(--white); mix-blend-mode: difference; }
.sl-back {
  position: fixed; top: 16px; left: 18px; z-index: 60; padding: 8px 16px; font-size: 0.82rem; font-weight: 500;
  background: var(--black); color: var(--white); border: 1px solid var(--white); box-shadow: 0 0 0 1px var(--black);
  transition: transform 250ms ease;
}
.sl-back:hover { transform: translateX(-3px); }

.sl-curtain { position: fixed; inset: 0; z-index: 400; pointer-events: none; }
.sl-curtain-half { position: absolute; left: 0; right: 0; height: 50.5%; background: var(--black); }
.sl-curtain-half.top { top: 0; }
.sl-curtain-half.bottom { bottom: 0; }
.sl-curtain-word { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; color: var(--white); font-family: 'Bodoni Moda', serif; font-style: italic; font-size: clamp(2.4rem, 8vw, 5rem); letter-spacing: 0.04em; }

.sl-hero { position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center; padding: 90px 24px 90px; overflow: hidden; isolation: isolate; perspective: 900px; background: var(--black); color: var(--white); }
.sl-hero-bg { position: absolute; inset: 0; z-index: -2; }
.sl-hero-shade { position: absolute; inset: 0; z-index: -1; pointer-events: none; background: radial-gradient(ellipse 55% 50% at 50% 46%, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.25) 70%, transparent 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.35), transparent 30%, rgba(0, 0, 0, 0.7) 100%); }
.sl-hero::before { content: ''; position: absolute; inset: 22px; z-index: 0; border: 1px solid rgba(255, 255, 255, 0.85); pointer-events: none; }
.sl-hero::after { content: ''; position: absolute; inset: 30px; z-index: 0; border: 1px solid rgba(255, 255, 255, 0.28); pointer-events: none; }
.sl-hero-inner { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 720px; }
.sl-logo-wrap { transform-style: preserve-3d; }
.sl-logo { display: block; width: min(340px, 70vw); height: auto;  }
.sl-tagline { margin-top: 0.4rem; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: clamp(1.2rem, 2.4vw, 1.6rem); }
.sl-lede { margin-top: 0.7rem; max-width: 32rem; color: rgba(255, 255, 255, 0.78); font-weight: 300; }
.sl-cta { margin-top: 1.8rem; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.sl-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 26px; cursor: pointer;
  font-family: inherit; font-weight: 500; font-size: 0.88rem; letter-spacing: 0.08em; border: 1px solid var(--black);
  transition: background 300ms ease, color 300ms ease, transform 300ms ease;
}
.sl-btn:hover { transform: translateY(-3px); }
.sl-btn-solid { background: var(--black); color: var(--white); }
.sl-btn-solid:hover { background: var(--white); color: var(--black); }
.sl-btn-line { background: transparent; color: var(--black); }
.sl-btn-line:hover { background: var(--black); color: var(--white); }
.sl-dark .sl-btn-solid { background: var(--white); color: var(--black); border-color: var(--white); }
.sl-dark .sl-btn-solid:hover { background: transparent; color: var(--white); }

.sl-hero .sl-btn { border-color: var(--white); }
.sl-hero .sl-btn-solid { background: var(--white); color: var(--black); }
.sl-hero .sl-btn-solid:hover { background: transparent; color: var(--white); }
.sl-hero .sl-btn-line { color: var(--white); }
.sl-hero .sl-btn-line:hover { background: var(--white); color: var(--black); }

.sl-badge { position: absolute; right: clamp(24px, 6vw, 90px); top: 130px; width: clamp(96px, 13vw, 150px); height: auto; animation: sl-spin 22s linear infinite; }
.sl-badge text { font-family: 'Jost', sans-serif; font-weight: 500; font-size: 15.5px; letter-spacing: 0.22em; fill: currentColor; }
.sl-badge-star { font-size: 30px; }
@keyframes sl-spin { to { transform: rotate(360deg); } }
.sl-hero-scroll { position: absolute; bottom: 40px; left: 50%; translate: -50% 0; font-size: 0.75rem; letter-spacing: 0.2em; color: rgba(255, 255, 255, 0.6); }

.sl-section { max-width: 1180px; margin: 0 auto; padding: clamp(56px, 7vw, 88px) clamp(20px, 5vw, 64px); }
.sl-head { text-align: center; margin-bottom: 2.2rem; }
.sl-h2 { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(1.7rem, 3.4vw, 2.6rem); line-height: 1.12; letter-spacing: -0.01em; }
.sl-sub { margin-top: 0.8rem; color: var(--mid); font-weight: 300; font-size: 0.95rem; }
.sl-dark { background: var(--black); color: var(--white); }
.sl-dark .sl-sub { color: rgba(255, 255, 255, 0.65); }
.sl-grey { background: var(--grey); }
.sl-prose { max-width: 62ch; margin: 0 auto 1.2rem; text-align: center; font-size: 1rem; font-weight: 300; }

.sl-reveal { max-width: 900px; margin: 0 auto; text-align: center; font-family: 'Bodoni Moda', serif; font-size: clamp(1.35rem, 2.9vw, 2.1rem); line-height: 1.4; }
.sl-reveal span { display: inline-block; margin-right: 0.28em; }

.sl-stack { padding-bottom: 20px; }
.sl-stack-card {
  position: sticky; height: min(58vh, 420px); margin-bottom: 26px; display: flex; flex-direction: column; justify-content: space-between;
  padding: clamp(22px, 3vw, 40px); border: 1px solid var(--black); overflow: hidden;
}
.sl-stack-card.light { background: var(--white); color: var(--black); }
.sl-stack-card.dark { background: var(--black); color: var(--white); border-color: var(--white); box-shadow: 0 0 0 1px var(--black); }
.sl-stack-top { display: flex; justify-content: space-between; font-size: 0.8rem; letter-spacing: 0.16em; opacity: 0.7; }
.sl-word-big { font-family: 'Bodoni Moda', serif; font-weight: 400; font-size: clamp(2.4rem, 7vw, 5rem); line-height: 1; }
.sl-stack-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; }
.sl-stack-card .sl-btn { border-color: currentColor; background: transparent; color: inherit; }
.sl-stack-card .sl-btn:hover { background: currentColor; }
.sl-stack-card .sl-btn:hover span { color: var(--white); mix-blend-mode: difference; }

.sl-duo { display: flex; border: 1px solid var(--black); min-height: 460px; }
.sl-founder { flex: 1; padding: clamp(24px, 3vw, 40px); transition: flex 700ms cubic-bezier(0.22, 1, 0.36, 1), background 500ms ease, color 500ms ease; overflow: hidden; }
.sl-founder + .sl-founder { border-left: 1px solid var(--black); }
.sl-founder:nth-child(2) { background: var(--black); color: var(--white); }
.sl-duo:hover .sl-founder { flex: 0.72; }
.sl-duo .sl-founder:hover { flex: 1.5; }
.sl-focus { font-size: 0.82rem; letter-spacing: 0.14em; opacity: 0.65; }
.sl-founder h3 { margin: 0.6rem 0 0.2rem; font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: clamp(1.5rem, 2.4vw, 2rem); line-height: 1.15; }
.sl-role { font-size: 0.9rem; opacity: 0.7; margin-bottom: 1.1rem; }
.sl-founder p + p { margin-top: 0.9rem; }
.sl-closing { max-width: 62ch; margin: 2.2rem auto 0; text-align: center; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 1.1rem; line-height: 1.6; }

.sl-group { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(1.25rem, 2vw, 1.6rem); margin: 2.4rem 0 1.2rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--black); }
.sl-group:first-of-type { margin-top: 0; }
.sl-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.sl-card { position: relative; padding: 26px; border: 1px solid var(--black); background: var(--white); overflow: hidden; isolation: isolate; transition: color 400ms ease; }
.sl-card::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--black); transform: translateY(101%); transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1); }
.sl-card:hover { color: var(--white); }
.sl-card:hover::before { transform: translateY(0); }
.sl-tag { font-size: 0.82rem; letter-spacing: 0.14em; opacity: 0.6; }
.sl-card h3 { margin: 0.4rem 0 0.6rem; font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: 1.3rem; line-height: 1.2; }
.sl-feats { margin-top: 1.1rem; }
.sl-feats li { padding: 0.3rem 0; border-top: 1px solid rgba(128, 128, 128, 0.4); }
.sl-feats li::before { content: '—'; margin-right: 0.7rem; }

.sl-lookbook { overflow: hidden; cursor: grab; padding: 30px 0 40px; }
.sl-lookbook:active { cursor: grabbing; }
.sl-rail { display: flex; gap: 26px; width: max-content; padding: 0 clamp(20px, 5vw, 64px); align-items: center; }
.sl-tile { flex: none; width: clamp(200px, 24vw, 280px); margin: 0; padding: 0; border: 1px solid rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.05); cursor: inherit; overflow: hidden; position: relative; transition: border-color 300ms ease; }
.sl-tile:nth-child(odd) { rotate: -2deg; margin-top: 30px; }
.sl-tile:nth-child(even) { rotate: 2deg; margin-bottom: 30px; }
.sl-tile:hover { border-color: var(--white); }
.sl-tile img { display: block; width: 100%; height: auto; pointer-events: none; filter: grayscale(1) contrast(1.05); transition: filter 500ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1); }
.sl-tile:hover img { filter: grayscale(0); transform: scale(1.05); }
.sl-hint { text-align: center; margin-top: 0.6rem; font-size: 0.85rem; letter-spacing: 0.14em; color: rgba(255, 255, 255, 0.6); }
.sl-empty { text-align: center; color: rgba(255, 255, 255, 0.6); }
.sl-lightbox { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 24px; background: rgba(0, 0, 0, 0.94); cursor: zoom-out; }
.sl-lightbox img { max-width: min(92vw, 900px); max-height: 86vh; border: 1px solid var(--white); }
.sl-nav { position: absolute; top: 50%; translate: 0 -50%; width: 48px; height: 48px; border: 1px solid var(--white); background: var(--black); color: var(--white); font-size: 1.4rem; cursor: pointer; }
.sl-nav.prev { left: 18px; }
.sl-nav.next { right: 18px; }

.sl-trio { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--black); }
.sl-trio > div { padding: 30px 26px; }
.sl-trio > div + div { border-left: 1px solid var(--black); }
.sl-trio h3 { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: 1.3rem; line-height: 1.2; margin-bottom: 0.6rem; }

.sl-info { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--white); border-left: 1px solid var(--white); }
.sl-info > div { padding: 26px 24px; border-right: 1px solid var(--white); border-bottom: 1px solid var(--white); transition: background 350ms ease, color 350ms ease; }
.sl-info > div:hover { background: var(--white); color: var(--black); }
.sl-info h3 { font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: 1.4rem; margin-bottom: 0.4rem; }
.sl-info p { font-weight: 300; }

.sl-faq { max-width: 780px; margin: 0 auto; border-top: 1px solid var(--black); }
.sl-faq-row { border-bottom: 1px solid var(--black); }
.sl-faq-btn { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 4px; background: none; border: 0; cursor: pointer; text-align: left; color: var(--black); font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(1rem, 1.6vw, 1.15rem); transition: padding 250ms ease; }
.sl-faq-btn:hover { padding-left: 14px; }
.sl-faq-btn i { font-style: normal; font-size: 1.8rem; transition: transform 300ms ease; }
.sl-faq-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.sl-faq-body { overflow: hidden; }
.sl-faq-body p { padding: 0 4px 24px; max-width: 44rem; color: var(--mid); font-weight: 300; }

.sl-outro { position: relative; text-align: center; overflow: hidden; }
.sl-outro .sl-prose { color: rgba(255, 255, 255, 0.75); }
.sl-outro .sl-badge { position: absolute; left: 50%; top: 50%; width: min(440px, 80vw); margin: calc(min(440px, 80vw) / -2) 0 0 calc(min(440px, 80vw) / -2); opacity: 0.16; animation-duration: 36s; }
.sl-outro .sl-section { position: relative; }

.sl-contact { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--black); border-left: 1px solid var(--black); }
.sl-contact a { padding: 22px; border-right: 1px solid var(--black); border-bottom: 1px solid var(--black); display: flex; flex-direction: column; gap: 4px; transition: background 300ms ease, color 300ms ease; }
.sl-contact a:hover { background: var(--black); color: var(--white); }
.sl-contact h3 { font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: 1.25rem; }
.sl-contact span { overflow-wrap: anywhere; }

.sl-footer { background: var(--black); color: rgba(255, 255, 255, 0.75); padding: 34px clamp(20px, 5vw, 64px) 40px; text-align: center; font-size: 0.9rem; }
.sl-footer a { margin: 0 0.7rem; }
.sl-footer a:hover { color: var(--white); text-decoration: underline; }

@media (max-width: 900px) {
  .sl-duo { flex-direction: column; min-height: 0; }
  .sl-duo:hover .sl-founder, .sl-duo .sl-founder:hover { flex: 1; }
  .sl-cols, .sl-trio, .sl-info, .sl-contact { grid-template-columns: 1fr; }
  .sl-founder + .sl-founder, .sl-trio > div + div { border-left: 0; border-top: 1px solid var(--black); }
  .sl-badge { top: 84px; right: 18px; }
  .sl-stack-card { position: relative; top: auto !important; height: 260px; }
}
@media (prefers-reduced-motion: reduce) {
  .sl *, .sl *::before { transition-duration: 0.01ms !important; }
  .sl-strip-track, .sl-badge { animation: none; }
}
`

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Head({ title, sub }) {
  return (
    <Reveal>
      <div className="sl-head">
        <h2 className="sl-h2">{title}</h2>
        {sub && <p className="sl-sub">{sub}</p>}
      </div>
    </Reveal>
  )
}

function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 })
  const [big, setBig] = useState(false)

  useEffect(() => {
    const move = e => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    const over = e => setBig(!!e.target.closest?.('a, button'))
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [x, y])

  return <motion.div className="sl-cursor" style={{ x: sx, y: sy }} animate={{ scale: big ? 3.6 : 1 }} transition={{ duration: 0.25 }} aria-hidden="true" />
}

function Curtain() {
  return (
    <motion.div className="sl-curtain" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }} aria-hidden="true">
      <motion.div className="sl-curtain-word" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.5, times: [0, 0.3, 0.75, 1] }}>
        R&amp;R
      </motion.div>
      <motion.div className="sl-curtain-half top" initial={{ y: 0 }} animate={{ y: '-101%' }} transition={{ delay: 1.3, duration: 0.9, ease: [0.76, 0, 0.24, 1] }} />
      <motion.div className="sl-curtain-half bottom" initial={{ y: 0 }} animate={{ y: '101%' }} transition={{ delay: 1.3, duration: 0.9, ease: [0.76, 0, 0.24, 1] }} />
    </motion.div>
  )
}

function Badge({ id, text }) {
  const path = 'M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0'
  return (
    <svg className="sl-badge" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id={id} d={path} />
      </defs>
      <text>
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      <text className="sl-badge-star" x="100" y="112" textAnchor="middle">✦</text>
    </svg>
  )
}

function Hero() {
  const wrapRef = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 18 })
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 70])

  const onMove = e => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section className="sl-hero" onPointerMove={onMove}>
      <div className="sl-hero-bg" aria-hidden="true">
        <Lightfall />
      </div>
      <div className="sl-hero-shade" aria-hidden="true" />
      <Badge id="sl-badge-hero" text="OWN THE LOOK ✦ OWN THE MOMENT ✦ " />
      <motion.div className="sl-hero-inner" style={{ y }}>
        <motion.div className="sl-logo-wrap" ref={wrapRef} style={{ rotateX: rx, rotateY: ry }}>
          <motion.img
            className="sl-logo"
            src="/logos/sports-lifestyle-white.png"
            alt="R&R Sport & Lifestyle"
            initial={{ opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
            transition={{ delay: 2, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
        <motion.p className="sl-tagline" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.8, duration: 0.8 }}>
          Own the look, own the moment
        </motion.p>
        <motion.p className="sl-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3, duration: 0.8 }}>
          Sportswear and lifestyle apparel for men, women, kids and babies. Shop online, delivered locally and internationally.
        </motion.p>
        <motion.div className="sl-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.2, duration: 0.8 }}>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="sl-btn sl-btn-solid">Shop the online store</a>
          <a href="#gallery" className="sl-btn sl-btn-line">See the gallery</a>
        </motion.div>
      </motion.div>
      <div className="sl-hero-scroll" aria-hidden="true">scroll ↓</div>
    </section>
  )
}

function Word({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  return <motion.span style={{ opacity }}>{word}</motion.span>
}

function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = statement.split(' ')
  return (
    <section className="sl-section">
      <Head title="Built for movement, designed for life" sub="Brand philosophy" />
      <p className="sl-reveal" ref={ref}>
        {words.map((w, i) => (
          <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]} />
        ))}
      </p>
      <Reveal>
        <p className="sl-prose" style={{ marginTop: '2rem' }}>
          Every piece in our collection is designed with technical precision and contemporary aesthetics in mind. From the
          gym to the street, our apparel transitions seamlessly through your active lifestyle.
        </p>
      </Reveal>
    </section>
  )
}

function RangeStack() {
  return (
    <div className="sl-grey">
      <section className="sl-section">
        <Head title="Who we dress" sub="Apparel for the whole family, sold online" />
        <div className="sl-stack">
          {range.map((r, i) => (
            <div className={`sl-stack-card ${i % 2 ? 'dark' : 'light'}`} key={r} style={{ top: 78 + i * 16 }}>
              <div className="sl-stack-top">
                <span>R&amp;R SPORT &amp; LIFESTYLE</span>
                <span>ONLINE</span>
              </div>
              <div className="sl-word-big">{r}</div>
              <div className="sl-stack-foot">
                <span>Delivered locally and internationally</span>
                <a href={STORE_URL} target="_blank" rel="noreferrer" className="sl-btn"><span>Shop {r}</span></a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Gallery() {
  const [failed, setFailed] = useState([])
  const [active, setActive] = useState(-1)
  const [limit, setLimit] = useState(0)
  const railRef = useRef(null)
  const wrapRef = useRef(null)
  const dragged = useRef(false)
  const visible = galleryImages.filter(img => !failed.includes(img.src))

  useEffect(() => {
    const measure = () => {
      if (railRef.current && wrapRef.current) setLimit(Math.max(0, railRef.current.scrollWidth - wrapRef.current.clientWidth))
    }
    measure()
    const t = setTimeout(measure, 800)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [failed])

  useEffect(() => {
    if (active < 0) return undefined
    const onKey = e => {
      if (e.key === 'Escape') setActive(-1)
      if (e.key === 'ArrowRight') setActive(a => (a + 1) % visible.length)
      if (e.key === 'ArrowLeft') setActive(a => (a - 1 + visible.length) % visible.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, visible.length])

  return (
    <div className="sl-dark" id="gallery">
      <section className="sl-section" style={{ paddingBottom: 0 }}>
        <Head title="Our gallery" sub="The latest pieces" />
      </section>
      {visible.length === 0 && <p className="sl-empty">New product photos are on the way.</p>}
      <div className="sl-lookbook" ref={wrapRef}>
        <motion.div className="sl-rail" ref={railRef} drag="x" dragConstraints={{ left: -limit, right: 0 }} dragElastic={0.12} onDragStart={() => { dragged.current = true }} onDragEnd={() => { setTimeout(() => { dragged.current = false }, 60) }}>
          {galleryImages.map(img => {
            if (failed.includes(img.src)) return null
            const idx = visible.findIndex(v => v.src === img.src)
            return (
              <button
                type="button"
                className="sl-tile"
                key={img.src}
                aria-label={`Enlarge ${img.alt}`}
                onClick={() => { if (!dragged.current) setActive(idx) }}
              >
                <img src={img.src} alt={img.alt} draggable={false} onError={() => setFailed(f => [...f, img.src])} />
              </button>
            )
          })}
        </motion.div>
      </div>
      <p className="sl-hint" style={{ paddingBottom: 60 }}>DRAG TO EXPLORE · HOVER FOR COLOUR · TAP TO ENLARGE</p>
      <AnimatePresence>
        {active >= 0 && visible[active] && (
          <motion.div className="sl-lightbox" role="dialog" aria-modal="true" aria-label="Product photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(-1)}>
            <button type="button" className="sl-nav prev" aria-label="Previous photo" onClick={e => { e.stopPropagation(); setActive((active - 1 + visible.length) % visible.length) }}>‹</button>
            <motion.img key={visible[active].src} src={visible[active].src} alt={visible[active].alt} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} onClick={e => e.stopPropagation()} />
            <button type="button" className="sl-nav next" aria-label="Next photo" onClick={e => { e.stopPropagation(); setActive((active + 1) % visible.length) }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="sl-faq">
      {faqs.map((f, i) => (
        <div className="sl-faq-row" key={f.q}>
          <button type="button" className="sl-faq-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {f.q}
            <i>+</i>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div className="sl-faq-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                <p>{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export default function SportsLifestyle() {
  const [intro, setIntro] = useState(true)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  useEffect(() => {
    const t = setTimeout(() => setIntro(false), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="sl">
      <style>{STYLES}</style>
      <Cursor />
      {intro && <Curtain />}
      <motion.div className="sl-bar" style={{ scaleX: bar }} />
      <Link to="/" className="sl-back">← Back to hub</Link>

      <main>
        <Hero />
        <Statement />
        <RangeStack />

        <section className="sl-section">
          <Head title="Where sport meets style" sub="Our story" />
          <Reveal>
            <p className="sl-prose">
              R&R Sports & Lifestyle was born from the perfect fusion of athletic excellence and lifestyle sophistication. Two
              founders, two passions, one extraordinary brand.
            </p>
          </Reveal>
          <Reveal>
            <div className="sl-duo">
              {founders.map(f => (
                <div className="sl-founder" key={f.name}>
                  <p className="sl-focus">{f.focus}</p>
                  <h3>{f.name}</h3>
                  <p className="sl-role">{f.role}</p>
                  {f.paragraphs.map(p => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <p className="sl-closing">
              Together, Romario and Rhea created R&R Sports & Lifestyle — a brand where athletic performance meets everyday
              elegance, where functionality embraces fashion, and where every piece tells the story of two passions perfectly
              combined.
            </p>
          </Reveal>
        </section>

        <div className="sl-grey">
          <section className="sl-section">
            <Head title="Our collections" sub="Designed for every aspect of your active life" />
            {collections.map(c => (
              <div key={c.group}>
                <h3 className="sl-group">{c.group}</h3>
                <div className="sl-cols">
                  {c.items.map((item, i) => (
                    <motion.div className="sl-card" key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                      <p className="sl-tag">{item.tag}</p>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                      <ul className="sl-feats">
                        {item.features.map(feature => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </div>

        <Gallery />

        <section className="sl-section">
          <Head title="What sets us apart" sub="Quality in every detail" />
          <Reveal>
            <div className="sl-trio">
              {differentiators.map(d => (
                <div key={d.title}>
                  <h3>{d.title}</h3>
                  <p>{d.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <div className="sl-dark">
          <section className="sl-section">
            <Head title="Shopping with us" sub="Delivery, returns and payment" />
            <Reveal>
              <div className="sl-info">
                {shopInfo.map(s => (
                  <div key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        </div>

        <section className="sl-section">
          <Head title="Common questions" sub="Quick answers before you order" />
          <Reveal>
            <Faq />
          </Reveal>
        </section>

        <div className="sl-dark sl-outro">
          <Badge id="sl-badge-outro" text="R&R SPORT & LIFESTYLE ✦ SHOP ONLINE ✦ " />
          <section className="sl-section">
            <Head title="Experience the R&R difference" />
            <Reveal>
              <p className="sl-prose">
                Discover our latest collections and elevate your athletic wardrobe with pieces designed for performance, style,
                and exclusivity.
              </p>
              <div className="sl-cta">
                <a href={STORE_URL} target="_blank" rel="noreferrer" className="sl-btn sl-btn-solid">Shop the online store</a>
              </div>
            </Reveal>
          </section>
        </div>

        <section className="sl-section" id="contact">
          <Head title="Get in touch" sub="Online only. Support is available 24/7." />
          <Reveal>
            <div className="sl-contact">
              <a href="tel:0813365266"><h3>Phone</h3><span>081 336 5266</span></a>
              <a href="mailto:info@rragencies.co.za"><h3>Email</h3><span>info@rragencies.co.za</span></a>
              <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer"><h3>WhatsApp</h3><span>Message us on 081 336 5266</span></a>
              <a href="https://www.instagram.com/randragencies" target="_blank" rel="noreferrer"><h3>Instagram</h3><span>@randragencies</span></a>
              <a href="https://www.tiktok.com/@randragencies" target="_blank" rel="noreferrer"><h3>TikTok</h3><span>@randragencies</span></a>
              <a href={STORE_URL} target="_blank" rel="noreferrer"><h3>Online store</h3><span>www.randragencies.online</span></a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="sl-footer">
        <span>© 2026 R&R Sport & Lifestyle, a brand of R&R Agencies. All rights reserved.</span>
        <div style={{ marginTop: '0.6rem' }}>
          <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
          <Link to="/">R&R Agencies</Link>
        </div>
      </footer>
    </div>
  )
}