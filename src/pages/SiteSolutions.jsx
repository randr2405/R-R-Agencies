import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const NAVY = '#1b3a72'
const NAVY_DEEP = '#0f2450'
const HERO_BG = '#0a1a3c'
const SKY = '#2da8e0'
const SKY_LIGHT = '#8fd3f4'
const SILVER = '#8a8d93'
const MIST = '#f3f8fc'
const INK = '#14203a'

const GLITCH_COLORS = [NAVY, SKY, SILVER]

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('SBDC Building, 2 Columbus Rd, Verulam, KwaZulu-Natal, South Africa')

const stats = [
  { big: '1–2', small: 'weeks for a service website' },
  { big: '2–4', small: 'weeks for an e-commerce store' },
  { big: '24/7', small: 'support, every day' },
  { big: 'SSL', small: 'security on every site we host' },
]

const segments = [
  { level: 1, title: 'Small Businesses', desc: 'Scalable solutions for growing companies.' },
  { level: 2, title: 'Medium Enterprises', desc: 'Robust systems for established operations.' },
  { level: 3, title: 'Large Corporations', desc: 'Enterprise-grade infrastructure at scale.' },
]

const services = [
  { name: 'Web Development', desc: 'Custom websites and web applications built for performance and scale.' },
  { name: 'E-commerce', desc: 'Online stores with secure payments, ready to take real orders.' },
  { name: 'Mobile Applications', desc: 'Native and cross-platform apps designed around how your business actually works.' },
  { name: 'Custom Software', desc: 'Business systems built to fit the way you operate, not the other way round.' },
  { name: 'System Architecture', desc: 'Solid technical foundations that grow with your business instead of breaking under it.' },
  { name: 'Integrations', desc: 'Seamless connections between your tools, data, and third-party services.' },
]

const hosting = [
  { title: 'Hosting', desc: 'Fast, reliable hosting for your website or system, billed monthly.' },
  { title: 'Domains', desc: 'We register and manage your domain name so you never have to chase renewals.' },
  { title: 'Custom business email', desc: 'Professional email addresses on your own domain.' },
  { title: 'SSL security', desc: 'SSL certificates keep your site secure and trusted by visitors and browsers.' },
  { title: 'Support and maintenance plans', desc: 'Monthly plans tailored to what you need, so your site stays secure, fast and up to date.' },
  { title: '24/7 support', desc: 'Real support from the team that built it, not a ticket queue.' },
]

const process = [
  { n: '01', title: 'Discovery', desc: 'We learn your business, your problem, and what success actually looks like.' },
  { n: '02', title: 'Design', desc: 'Architecture and interface planning, so the build starts on solid ground.' },
  { n: '03', title: 'Build', desc: 'Development with regular check-ins, not a black box until the big reveal.' },
  { n: '04', title: 'Launch', desc: 'A controlled, tested rollout, not a risky flip-the-switch moment.' },
  { n: '05', title: 'Support', desc: 'Ongoing hosting, maintenance and support once you are live.' },
]

const pricingSteps = [
  { n: '1', title: 'Free consultation', desc: 'Discuss your project requirements with our team.' },
  { n: '2', title: 'Custom proposal', desc: 'Receive a detailed quote tailored to your needs.' },
  { n: '3', title: 'Flexible payment', desc: 'Pay in installments that work for you.' },
]

const portfolio = [
  {
    name: 'Dirose Enterprise',
    url: 'https://www.diroseenterprise.co.za',
    desc: 'A professional website for an underwear manufacturer, showcasing their range and making it easy for retailers and customers to get in touch.',
  },
  {
    name: 'Distinct Embroidery',
    url: 'https://www.distinctembroidery.co.za',
    desc: 'A website for an embroidery and printing company serving chainstores, presenting their services and 20+ years of experience.',
  },
  {
    name: 'R&R Agencies',
    url: 'https://www.rragencies.co.za',
    desc: 'The main company website covering every division, with a contact form that sends enquiries straight to email.',
  },
  {
    name: 'R&R Sports and Lifestyle',
    url: 'https://www.randragencies.online',
    desc: 'A full e-commerce store for a sport and lifestyle clothing brand, with secure online payments and a WhatsApp chatbot.',
  },
  {
    name: 'Astorra',
    url: 'https://www.astorra.co.za',
    desc: 'A modular business management platform where companies install only the tools they need, from a free tier up to enterprise.',
  },
]

const faqs = [
  {
    q: 'How long does a website take?',
    a: 'A service website usually takes 1 to 2 weeks and an e-commerce store 2 to 4 weeks. Custom software depends on scope, and we agree a timeline with you in your proposal.',
  },
  {
    q: 'What does hosting include?',
    a: 'Hosting, your domain, custom business email and an SSL certificate, all billed monthly.',
  },
  {
    q: 'Do I own my website?',
    a: 'We own the website and its code, unless you and we agree a price for you to purchase the code. Ask us and we will quote it.',
  },
  {
    q: 'What do the monthly support and maintenance plans cover?',
    a: 'Plans are tailored to what you need, so the price varies from client to client. Support is available 24/7.',
  },
  {
    q: 'Can you build custom software, not just websites?',
    a: 'Yes. We build custom business software and apps designed around how your company works.',
  },
  {
    q: 'How does payment work?',
    a: 'Every project gets a custom quote based on your requirements, timeline and scope. We also offer installments so you can spread the cost.',
  },
]

const ticker = ['Websites', 'E-commerce', 'Mobile apps', 'Custom software', 'Hosting', 'Domains', 'Business email', 'SSL', 'Integrations', '24/7 support']

const termLines = [
  { t: '$ discover --business', c: 'cmd' },
  { t: '✓ goals mapped', c: 'ok' },
  { t: '$ build --site', c: 'cmd' },
  { t: '✓ pages compiled', c: 'ok' },
  { t: '$ host --ssl --email', c: 'cmd' },
  { t: '✓ live and secure', c: 'ok' },
  { t: '$ grow', c: 'cmd' },
]

const statusRows = ['Website', 'SSL certificate', 'Business email', 'Domain']

const FALLBACK_RGB = { r: 255, g: 255, b: 255 }

function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const full = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}

const mixRgb = (start, end, factor) => ({
  r: Math.round(start.r + (end.r - start.r) * factor),
  g: Math.round(start.g + (end.g - start.g) * factor),
  b: Math.round(start.b + (end.b - start.b) * factor),
})

const rgbToCss = ({ r, g, b }) => `rgb(${r}, ${g}, ${b})`

function LetterGlitch({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  className = '',
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  backgroundColor = '#000000',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const letters = useRef([])
  const grid = useRef({ columns: 0, rows: 0 })
  const context = useRef(null)
  const lastGlitchTime = useRef(Date.now())
  const lastWidth = useRef(0)

  const lettersAndSymbols = Array.from(characters)
  const fontSize = 16
  const charWidth = 10
  const charHeight = 20

  const bg = hexToRgb(backgroundColor) || { r: 0, g: 0, b: 0 }

  const getRandomChar = () => lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)]
  const getRandomColor = () => glitchColors[Math.floor(Math.random() * glitchColors.length)]
  const getRandomRgb = () => hexToRgb(getRandomColor()) || FALLBACK_RGB

  const calculateGrid = (width, height) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  })

  const initializeLetters = (columns, rows) => {
    grid.current = { columns, rows }
    const totalLetters = columns * rows
    letters.current = Array.from({ length: totalLetters }, () => {
      const rgb = getRandomRgb()
      return {
        char: getRandomChar(),
        rgb,
        fromRgb: rgb,
        targetRgb: getRandomRgb(),
        colorProgress: 1,
      }
    })
  }

  const drawLetters = () => {
    if (!context.current || letters.current.length === 0) return
    const ctx = context.current
    const { width, height } = canvasRef.current.getBoundingClientRect()
    ctx.clearRect(0, 0, width, height)
    ctx.font = `${fontSize}px monospace`
    ctx.textBaseline = 'top'

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth
      const y = Math.floor(index / grid.current.columns) * charHeight
      ctx.fillStyle = rgbToCss(letter.rgb)
      ctx.fillText(letter.char, x, y)
    })
  }

  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const rect = parent.getBoundingClientRect()
    lastWidth.current = rect.width

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height)
    initializeLetters(columns, rows)
    drawLetters()
  }

  const updateLetters = () => {
    if (!letters.current || letters.current.length === 0) return
    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05))

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * letters.current.length)
      if (!letters.current[index]) continue

      letters.current[index].char = getRandomChar()
      letters.current[index].fromRgb = letters.current[index].rgb
      letters.current[index].targetRgb = getRandomRgb()

      if (!smooth) {
        letters.current[index].rgb = letters.current[index].targetRgb
        letters.current[index].colorProgress = 1
      } else {
        letters.current[index].colorProgress = 0
      }
    }
  }

  const handleSmoothTransitions = () => {
    let needsRedraw = false
    letters.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05
        if (letter.colorProgress > 1) letter.colorProgress = 1
        letter.rgb = mixRgb(letter.fromRgb, letter.targetRgb, letter.colorProgress)
        needsRedraw = true
      }
    })
    if (needsRedraw) drawLetters()
  }

  const animateLoop = () => {
    const now = Date.now()
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters()
      drawLetters()
      lastGlitchTime.current = now
    }
    if (smooth) handleSmoothTransitions()
    animationRef.current = requestAnimationFrame(animateLoop)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    context.current = canvas.getContext('2d')
    resizeCanvas()
    animateLoop()

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const parent = canvasRef.current?.parentElement
        if (parent && Math.abs(parent.getBoundingClientRect().width - lastWidth.current) < 1) return
        cancelAnimationFrame(animationRef.current)
        resizeCanvas()
        animateLoop()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
  }, [glitchSpeed, smooth])

  const fill = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor, overflow: 'hidden' }} className={className}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      {outerVignette && (
        <div style={{ ...fill, background: `radial-gradient(circle, rgba(${bg.r},${bg.g},${bg.b},0) 60%, rgba(${bg.r},${bg.g},${bg.b},1) 100%)` }} />
      )}
      {centerVignette && (
        <div style={{ ...fill, background: `radial-gradient(circle, rgba(${bg.r},${bg.g},${bg.b},0.8) 0%, rgba(${bg.r},${bg.g},${bg.b},0) 60%)` }} />
      )}
    </div>
  )
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

.ss {
  --navy: ${NAVY};
  --navy-deep: ${NAVY_DEEP};
  --hero-bg: ${HERO_BG};
  --sky: ${SKY};
  --sky-light: ${SKY_LIGHT};
  --silver: ${SILVER};
  --mist: ${MIST};
  --ink: ${INK};
  --muted: rgba(20, 32, 58, 0.68);
  --muted-light: rgba(232, 242, 252, 0.74);
  background: #fff;
  color: var(--ink);
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  overflow-x: clip;
  min-height: 100vh;
  position: relative;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
.ss *, .ss *::before, .ss *::after { box-sizing: border-box; }
.ss h1, .ss h2, .ss h3, .ss h4, .ss p, .ss ul, .ss address { margin: 0; padding: 0; }
.ss ul { list-style: none; }
.ss address { font-style: normal; }
.ss img { max-width: 100%; }
:where(.ss) a { color: inherit; text-decoration: none; }
.ss a:focus-visible, .ss button:focus-visible { outline: 2px solid var(--sky); outline-offset: 4px; border-radius: 8px; }

.ss-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--navy), var(--sky), var(--sky-light));
  box-shadow: 0 0 14px rgba(45, 168, 224, 0.7);
}
.ss-back {
  position: fixed; top: 14px; left: 16px; z-index: 60; font-weight: 700; font-size: 0.82rem;
  padding: 7px 14px; border-radius: 999px; color: var(--navy);
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(27, 58, 114, 0.28); box-shadow: 0 8px 24px rgba(15, 36, 80, 0.14);
  transition: transform 250ms ease, border-color 250ms ease;
}
.ss-back:hover { transform: translateX(-3px); border-color: var(--sky); }

.ss-rail { position: fixed; right: 16px; top: 16vh; bottom: 16vh; width: 20px; z-index: 50; pointer-events: none; }
.ss-rail svg { position: absolute; inset: 0; width: 20px; height: 100%; overflow: visible; }
.ss-rail-track { stroke: rgba(45, 168, 224, 0.28); stroke-width: 2; stroke-dasharray: 3 8; stroke-linecap: round; }
.ss-rail-live { stroke: var(--sky); stroke-width: 2.5; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(45, 168, 224, 0.9)); }
.ss-needle {
  position: absolute; left: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%;
  background: #fff; box-shadow: 0 0 0 4px rgba(45, 168, 224, 0.3), 0 0 18px 4px rgba(45, 168, 224, 0.8);
}

.ss-hero {
  position: relative; min-height: 100vh; min-height: 100svh; display: grid; align-items: center; overflow: hidden; isolation: isolate;
  padding: 96px clamp(20px, 5vw, 64px) 84px; background: var(--hero-bg); color: #fff;
}
.ss-hero-bg { position: absolute; inset: 0; z-index: -3; overflow: hidden; }
.ss-hero-glow {
  position: absolute; inset: 0; z-index: -2; pointer-events: none;
  background: radial-gradient(560px circle at var(--mx, 70%) var(--my, 40%), rgba(45, 168, 224, 0.34), transparent 70%);
}
.ss-hero-shade {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    linear-gradient(90deg, rgba(10, 26, 60, 0.86) 0%, rgba(10, 26, 60, 0.55) 45%, rgba(10, 26, 60, 0.15) 100%),
    linear-gradient(180deg, rgba(10, 26, 60, 0.35) 0%, transparent 30%, rgba(10, 26, 60, 0.8) 100%);
}
.ss-hero-grid { max-width: 1120px; width: 100%; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: clamp(24px, 5vw, 60px); align-items: center; }
.ss-hero-grid > * { min-width: 0; }
.ss-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky-light); }
.ss-eyebrow::before { content: ''; width: 28px; height: 2px; background: var(--sky); flex: none; }
.ss-title { margin-top: 0.8rem; font-family: 'Sora', sans-serif; font-weight: 800; font-size: clamp(2.4rem, 5.2vw, 4.2rem); line-height: 1.04; letter-spacing: -0.03em; color: #fff; text-shadow: 0 4px 30px rgba(10, 26, 60, 0.6); }
.ss-title span { display: block; background: linear-gradient(100deg, #fff 10%, var(--sky-light) 45%, #b9bec7 90%); background-size: 200% 100%; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: ss-sheen 6s ease-in-out infinite; }
@keyframes ss-sheen { 0%, 100% { background-position: 0% 0; } 50% { background-position: 100% 0; } }
.ss-slogan { margin-top: 1rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1rem, 1.8vw, 1.35rem); color: #fff; }
.ss-slogan b { color: var(--sky); font-weight: 700; }
.ss-lede { margin-top: 0.9rem; max-width: 30rem; font-size: clamp(0.92rem, 1.2vw, 1.02rem); color: rgba(232, 242, 252, 0.85); }
.ss-cta-row { margin-top: 1.7rem; display: flex; gap: 12px; flex-wrap: wrap; }
.ss-btn {
  display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 12px 24px; border-radius: 999px;
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: 1px solid transparent; text-align: center;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, background 250ms ease;
}
.ss-btn:hover { transform: translateY(-3px); }
.ss-btn-sky { background: linear-gradient(120deg, var(--sky), var(--sky-light)); color: var(--navy-deep); box-shadow: 0 10px 30px rgba(45, 168, 224, 0.35); }
.ss-btn-sky:hover { box-shadow: 0 16px 40px rgba(45, 168, 224, 0.5); }
.ss-btn-ghost-light { color: #fff; border-color: rgba(255, 255, 255, 0.5); background: rgba(10, 26, 60, 0.4); }
.ss-btn-ghost-light:hover { background: rgba(255, 255, 255, 0.14); }

.ss-stage { position: relative; justify-self: center; width: 100%; max-width: 400px; display: flex; flex-direction: column; align-items: center; gap: 22px; }
.ss-logo-card {
  position: relative; width: 62%; padding: 14px; border-radius: 26px; background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 30px 80px rgba(3, 10, 30, 0.55);
}
.ss-logo-card::before { content: ''; position: absolute; inset: -12px; z-index: -1; border-radius: 34px; border: 1px dashed rgba(143, 211, 244, 0.6); }
.ss-logo-card img { display: block; width: 100%; height: auto; }
.ss-term {
  position: relative; width: 100%; border-radius: 16px; overflow: hidden;
  background: rgba(6, 14, 36, 0.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(143, 211, 244, 0.4); box-shadow: 0 24px 60px rgba(3, 10, 30, 0.6), 0 0 40px rgba(45, 168, 224, 0.2);
}
.ss-term-bar { display: flex; align-items: center; gap: 6px; padding: 9px 12px; border-bottom: 1px solid rgba(143, 211, 244, 0.2); }
.ss-term-bar i { width: 9px; height: 9px; border-radius: 50%; background: rgba(143, 211, 244, 0.35); flex: none; }
.ss-term-bar i:first-child { background: var(--sky); }
.ss-term-bar span { margin-left: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: var(--muted-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ss-term-body { padding: 12px 14px 14px; min-height: 176px; font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; line-height: 1.75; overflow: hidden; }
.ss-term-body .cmd { color: #fff; }
.ss-term-body .ok { color: var(--sky-light); }
.ss-caret { display: inline-block; width: 7px; height: 13px; margin-left: 2px; vertical-align: -2px; background: var(--sky); animation: ss-blink 1s steps(1) infinite; }
@keyframes ss-blink { 50% { opacity: 0; } }
.ss-scroll { position: absolute; bottom: 18px; left: 50%; translate: -50% 0; color: var(--sky-light); font-weight: 700; font-size: 0.8rem; }

.ss-strip { background: linear-gradient(90deg, var(--navy-deep), var(--navy)); color: #fff; overflow: hidden; border-block: 1px solid rgba(143, 211, 244, 0.25); }
.ss-strip-track { display: flex; width: max-content; animation: ss-slide 40s linear infinite; }
.ss-strip-item { display: flex; align-items: center; gap: 26px; padding: 13px 0 13px 26px; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1rem; white-space: nowrap; }
.ss-strip-item i { font-style: normal; color: var(--sky); font-size: 0.8rem; }
@keyframes ss-slide { to { transform: translateX(-50%); } }

.ss-stats { background: #fff; border-bottom: 1px solid rgba(27, 58, 114, 0.12); }
.ss-stats-in { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
.ss-stat { padding: 26px clamp(14px, 2.4vw, 32px); border-right: 1px solid rgba(27, 58, 114, 0.12); }
.ss-stat:last-child { border-right: 0; }
.ss-stat strong { display: block; font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1.1; color: var(--navy); }
.ss-stat span { color: var(--muted); font-size: 0.85rem; }

.ss-section { max-width: 1120px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(20px, 4.5vw, 56px); }
.ss-h2 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(1.6rem, 3.4vw, 2.4rem); line-height: 1.12; letter-spacing: -0.02em; color: var(--navy); max-width: 20ch; }
.ss-h2::after { content: ''; display: block; margin-top: 0.9rem; width: 64px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--navy), var(--sky)); }
.ss-sub { margin-top: 1rem; color: var(--muted); max-width: 32rem; }
.ss-tint { background: var(--mist); }
.ss-navy { background: linear-gradient(160deg, var(--navy), var(--navy-deep)); color: #fff; position: relative; overflow: hidden; }
.ss-navy::before {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.5;
  background-image: radial-gradient(rgba(143, 211, 244, 0.22) 1px, transparent 1px); background-size: 26px 26px;
  -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, #000, transparent);
  mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, #000, transparent);
}
.ss-navy > * { position: relative; }
.ss-navy .ss-h2 { color: #fff; }
.ss-navy .ss-h2::after { background: linear-gradient(90deg, var(--sky), var(--sky-light)); }
.ss-navy .ss-sub { color: var(--muted-light); }

.ss-spot { position: relative; overflow: hidden; }
.ss-spot::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 300ms ease;
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(45, 168, 224, 0.22), transparent 70%);
}
.ss-spot:hover::after { opacity: 1; }

.ss-serve { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2.2rem; }
.ss-serve-card {
  padding: 24px 22px; border-radius: 20px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14);
  box-shadow: 0 14px 40px rgba(15, 36, 80, 0.06);
  transition: border-color 300ms ease, box-shadow 300ms ease;
}
.ss-serve-card:hover { border-color: var(--sky); box-shadow: 0 22px 50px rgba(45, 168, 224, 0.18); }
.ss-bars { display: flex; align-items: flex-end; gap: 4px; height: 28px; margin-bottom: 1rem; }
.ss-bars i { width: 8px; border-radius: 3px; background: rgba(27, 58, 114, 0.15); transform-origin: bottom; }
.ss-bars i:nth-child(1) { height: 30%; }
.ss-bars i:nth-child(2) { height: 65%; }
.ss-bars i:nth-child(3) { height: 100%; }
.ss-bars i.on { background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-serve-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--navy); }
.ss-serve-card p { margin-top: 0.35rem; color: var(--muted); }

.ss-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2.2rem; perspective: 1000px; }
.ss-service {
  position: relative; padding: 26px 22px 24px 26px; border-radius: 20px; background: #fff; overflow: hidden;
  border: 1px solid rgba(27, 58, 114, 0.14); transform-style: preserve-3d; will-change: transform;
  transition: border-color 300ms ease, box-shadow 300ms ease;
}
.ss-service::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-service::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity 300ms ease;
  background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(45, 168, 224, 0.2), transparent 70%);
}
.ss-service:hover { border-color: var(--sky); box-shadow: 0 26px 50px rgba(45, 168, 224, 0.2); }
.ss-service:hover::after { opacity: 1; }
.ss-service-n { font-family: 'JetBrains Mono', monospace; font-size: 0.72rem; color: var(--sky); }
.ss-service h3 { margin-top: 0.3rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.05rem; color: var(--navy); }
.ss-service p { margin-top: 0.4rem; color: var(--muted); }

.ss-host { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 70px); align-items: start; }
.ss-host > * { min-width: 0; }
.ss-host-head { position: sticky; top: 90px; }
.ss-host-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ss-host-item {
  padding: 20px; border-radius: 18px; background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(143, 211, 244, 0.26);
  transition: border-color 300ms ease, background 300ms ease, transform 300ms ease;
}
.ss-host-item:hover { border-color: var(--sky-light); background: rgba(255, 255, 255, 0.11); transform: translateY(-4px); }
.ss-host-item h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1rem; color: var(--sky-light); }
.ss-host-item p { margin-top: 0.35rem; color: var(--muted-light); font-size: 0.9rem; }
.ss-note { margin-top: 1.1rem; color: var(--muted-light); font-size: 0.88rem; }
.ss-status { margin-top: 1.6rem; max-width: 22rem; border-radius: 16px; background: rgba(6, 14, 36, 0.55); border: 1px solid rgba(143, 211, 244, 0.28); overflow: hidden; }
.ss-status li { display: flex; align-items: center; gap: 12px; padding: 12px 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; border-bottom: 1px solid rgba(143, 211, 244, 0.14); }
.ss-status li:last-child { border-bottom: 0; }
.ss-status em { margin-left: auto; font-style: normal; color: var(--sky-light); }
.ss-pulse { position: relative; width: 8px; height: 8px; border-radius: 50%; background: #5be3a4; flex: none; }
.ss-pulse::after { content: ''; position: absolute; inset: -4px; border-radius: 50%; border: 1px solid #5be3a4; animation: ss-ping 2s ease-out infinite; }
@keyframes ss-ping { from { transform: scale(0.6); opacity: 0.9; } to { transform: scale(1.8); opacity: 0; } }

.ss-process { position: relative; height: 300vh; background: var(--hero-bg); color: #fff; }
.ss-sticky { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 3rem; }
.ss-sticky::before {
  content: ''; position: absolute; inset: 0; opacity: 0.5; pointer-events: none;
  background-image: linear-gradient(rgba(143, 211, 244, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(143, 211, 244, 0.07) 1px, transparent 1px);
  background-size: 44px 44px;
}
.ss-process-head { position: relative; padding: 0 clamp(20px, 5vw, 64px); max-width: 1120px; width: 100%; margin: 0 auto; }
.ss-process-head .ss-h2 { color: #fff; }
.ss-process-head .ss-h2::after { background: linear-gradient(90deg, var(--sky), var(--sky-light)); }
.ss-track-row { position: relative; display: flex; gap: 26px; padding: 0 clamp(20px, 5vw, 64px); width: max-content; }
.ss-track-row::before {
  content: ''; position: absolute; left: 0; right: 0; top: 30px; height: 2px;
  background: repeating-linear-gradient(90deg, rgba(45, 168, 224, 0.8) 0 12px, transparent 12px 20px);
}
.ss-step {
  position: relative; flex: none; width: min(78vw, 340px); padding: 62px 26px 28px; border-radius: 22px;
  background: linear-gradient(160deg, rgba(27, 58, 114, 0.6), rgba(10, 26, 60, 0.5));
  border: 1px solid rgba(143, 211, 244, 0.3); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.ss-step-dot { position: absolute; top: 22px; left: 26px; width: 18px; height: 18px; border-radius: 50%; background: var(--sky-light); box-shadow: 0 0 0 6px rgba(45, 168, 224, 0.2), 0 0 22px rgba(45, 168, 224, 0.9); }
.ss-step-n { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 4.2rem; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(143, 211, 244, 0.7); }
.ss-step h3 { margin: 0.5rem 0 0.4rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.3rem; color: var(--sky-light); }
.ss-step p { color: var(--muted-light); }

.ss-price { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2.2rem; }
.ss-price-card { position: relative; padding: 26px 22px; border-radius: 20px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14); transition: border-color 300ms ease, box-shadow 300ms ease; }
.ss-price-card:hover { border-color: var(--sky); box-shadow: 0 22px 50px rgba(45, 168, 224, 0.18); }
.ss-price-n {
  display: grid; place-items: center; width: 38px; height: 38px; margin-bottom: 0.8rem; border-radius: 50%;
  font-family: 'Sora', sans-serif; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--navy), var(--sky));
}
.ss-price-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--navy); }
.ss-price-card p { margin-top: 0.35rem; color: var(--muted); }
.ss-price-note { margin-top: 1.6rem; max-width: 42rem; color: var(--muted); }

.ss-work { margin-top: 2.2rem; border-top: 1px solid rgba(27, 58, 114, 0.16); }
.ss-work-row {
  position: relative; display: grid; grid-template-columns: 0.9fr 1.6fr auto; gap: 20px; align-items: center; padding: 22px 6px;
  border-bottom: 1px solid rgba(27, 58, 114, 0.16); transition: padding-left 300ms ease, background 300ms ease;
}
.ss-work-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--sky), var(--navy)); transform: scaleY(0); transition: transform 300ms ease; }
.ss-work-row:hover { padding-left: 18px; background: linear-gradient(90deg, rgba(45, 168, 224, 0.1), transparent); }
.ss-work-row:hover::before { transform: scaleY(1); }
.ss-work-row h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1.05rem, 1.8vw, 1.3rem); color: var(--navy); }
.ss-work-row p { color: var(--muted); font-size: 0.92rem; }
.ss-work-arrow { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.88rem; color: var(--sky); white-space: nowrap; transition: transform 300ms ease; }
.ss-work-row:hover .ss-work-arrow { transform: translateX(6px); }

.ss-acc { margin-top: 2.2rem; border-top: 1px solid rgba(27, 58, 114, 0.18); max-width: 780px; }
.ss-acc-row { border-bottom: 1px solid rgba(27, 58, 114, 0.18); }
.ss-acc-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; min-height: 52px; padding: 18px 4px;
  background: none; border: 0; cursor: pointer; text-align: left; color: var(--navy);
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  transition: color 250ms ease, padding 250ms ease;
}
.ss-acc-btn:hover { color: var(--sky); padding-left: 10px; }
.ss-acc-btn i { font-style: normal; font-size: 1.4rem; color: var(--sky); transition: transform 300ms ease; flex: none; }
.ss-acc-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.ss-acc-body { overflow: hidden; }
.ss-acc-body p { padding: 0 4px 20px; max-width: 42rem; color: var(--muted); }

.ss-contact-big { position: relative; }
.ss-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2.2rem; }
.ss-contact-item {
  display: flex; flex-direction: column; gap: 5px; padding: 22px; border-radius: 20px; min-width: 0;
  background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(143, 211, 244, 0.28);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, background 300ms ease;
}
a.ss-contact-item:hover { transform: translateY(-5px); border-color: var(--sky-light); background: rgba(255, 255, 255, 0.12); }
.ss-contact-item h3 { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky-light); }
.ss-contact-item span, .ss-contact-item address { font-size: 0.98rem; overflow-wrap: anywhere; }

.ss-footer { background: var(--navy-deep); color: var(--muted-light); padding: 30px clamp(20px, 4.5vw, 56px) 36px; }
.ss-footer-in { max-width: 1120px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px 28px; font-size: 0.85rem; }
.ss-footer-links { display: flex; flex-wrap: wrap; gap: 8px 22px; }
.ss-footer-links a { overflow-wrap: anywhere; }
.ss-footer-links a:hover { color: var(--sky-light); }

@media (max-width: 1100px) {
  .ss-rail { right: 8px; }
}
@media (max-width: 900px) {
  .ss-rail { display: none; }
  .ss-hero { padding: 88px clamp(18px, 5vw, 40px) 64px; }
  .ss-hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .ss-hero-shade {
    background: linear-gradient(180deg, rgba(10, 26, 60, 0.72) 0%, rgba(10, 26, 60, 0.62) 50%, rgba(10, 26, 60, 0.88) 100%);
  }
  .ss-scroll { display: none; }
  .ss-stage { justify-self: center; max-width: 380px; }
  .ss-host { grid-template-columns: 1fr; }
  .ss-host-head { position: static; }
  .ss-stats-in { grid-template-columns: 1fr 1fr; }
  .ss-stat:nth-child(2) { border-right: 0; }
  .ss-stat:nth-child(-n + 2) { border-bottom: 1px solid rgba(27, 58, 114, 0.12); }
  .ss-serve, .ss-price { grid-template-columns: 1fr; }
  .ss-services, .ss-contact-grid, .ss-host-list { grid-template-columns: 1fr 1fr; }
  .ss-work-row { grid-template-columns: 1fr; gap: 6px; }
  .ss-work-row:hover { padding-left: 6px; }
  .ss-h2 { max-width: 24ch; }
}
@media (max-width: 600px) {
  .ss { font-size: 14.5px; }
  .ss-back { top: 12px; left: 10px; font-size: 0.78rem; padding: 6px 12px; }
  .ss-hero { padding: 84px 18px 52px; }
  .ss-hero-grid { gap: 34px; }
  .ss-eyebrow { font-size: 0.68rem; letter-spacing: 0.12em; }
  .ss-eyebrow::before { width: 20px; }
  .ss-title { font-size: clamp(2.1rem, 11.5vw, 2.9rem); }
  .ss-cta-row { gap: 10px; }
  .ss-cta-row .ss-btn { flex: 1 1 100%; }
  .ss-stage { gap: 20px; max-width: 340px; }
  .ss-logo-card { width: 46%; padding: 10px; border-radius: 20px; }
  .ss-logo-card::before { inset: -9px; border-radius: 28px; }
  .ss-term-body { min-height: 168px; font-size: 0.7rem; padding: 10px 12px 12px; }
  .ss-strip-item { gap: 20px; padding: 11px 0 11px 20px; font-size: 0.9rem; }
  .ss-stat { padding: 20px 14px; }
  .ss-stat span { font-size: 0.8rem; }
  .ss-section { padding: 48px 18px; }
  .ss-services, .ss-contact-grid, .ss-host-list { grid-template-columns: 1fr; }
  .ss-serve, .ss-services, .ss-price, .ss-serve-card, .ss-service { gap: 14px; }
  .ss-serve-card, .ss-price-card { padding: 22px 18px; }
  .ss-service { padding: 22px 18px 20px 22px; }
  .ss-host-item { padding: 18px; }
  .ss-status { max-width: 100%; }
  .ss-sticky { gap: 2rem; }
  .ss-process-head { padding: 0 18px; }
  .ss-track-row { gap: 16px; padding: 0 18px; }
  .ss-step { width: min(80vw, 300px); padding: 56px 20px 24px; }
  .ss-step-dot { left: 20px; }
  .ss-step-n { font-size: 3.4rem; }
  .ss-step h3 { font-size: 1.15rem; }
  .ss-work-row { padding: 18px 2px; }
  .ss-acc-btn { padding: 16px 2px; gap: 14px; }
  .ss-contact-item { padding: 18px; }
  .ss-footer { padding: 26px 18px 30px; }
  .ss-footer-in { flex-direction: column; align-items: flex-start; }
}
@media (max-width: 360px) {
  .ss-stats-in { grid-template-columns: 1fr; }
  .ss-stat { border-right: 0; border-bottom: 1px solid rgba(27, 58, 114, 0.12); }
  .ss-stat:last-child { border-bottom: 0; }
  .ss-title { font-size: 2rem; }
}
@media (max-height: 520px) and (orientation: landscape) {
  .ss-hero { padding-top: 72px; padding-bottom: 40px; }
  .ss-scroll { display: none; }
  .ss-sticky { gap: 1.2rem; }
  .ss-step { padding-top: 52px; padding-bottom: 18px; }
  .ss-step-n { font-size: 2.6rem; }
}
@media (hover: none) {
  .ss-btn:hover, .ss-back:hover, .ss-host-item:hover, a.ss-contact-item:hover { transform: none; }
  .ss-work-row:hover { padding-left: 6px; background: none; }
  .ss-work-row:hover::before { transform: scaleY(0); }
  .ss-work-row:hover .ss-work-arrow { transform: none; }
  .ss-acc-btn:hover { padding-left: 4px; color: var(--navy); }
  .ss-spot:hover::after, .ss-service:hover::after { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .ss *, .ss *::before { transition-duration: 0.01ms !important; }
  .ss-strip-track, .ss-title span, .ss-caret, .ss-pulse::after { animation: none; }
}
`

function useSpotlight(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined
    const onMove = e => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      const el = e.target.closest?.('.ss-hero, .ss-serve-card, .ss-service, .ss-spot')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    root.addEventListener('pointermove', onMove, { passive: true })
    return () => root.removeEventListener('pointermove', onMove)
  }, [ref])
}

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

function ThreadRail() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const h = useTransform(p, v => `${v * 100}%`)
  return (
    <div className="ss-rail" aria-hidden="true">
      <svg preserveAspectRatio="none">
        <defs>
          <mask id="ss-reveal">
            <motion.rect x="0" y="0" width="20" fill="#fff" style={{ height: h }} />
          </mask>
        </defs>
        <line x1="10" y1="0" x2="10" y2="100%" className="ss-rail-track" />
        <line x1="10" y1="0" x2="10" y2="100%" className="ss-rail-live" mask="url(#ss-reveal)" />
      </svg>
      <motion.span className="ss-needle" style={{ top: h }} />
    </div>
  )
}

function Terminal() {
  const [shown, setShown] = useState(0)
  const [chars, setChars] = useState(0)

  useEffect(() => {
    const line = termLines[shown]
    if (!line) {
      const reset = setTimeout(() => {
        setShown(0)
        setChars(0)
      }, 2600)
      return () => clearTimeout(reset)
    }
    if (chars < line.t.length) {
      const t = setTimeout(() => setChars(c => c + 1), line.c === 'cmd' ? 45 : 14)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setShown(s => s + 1)
      setChars(0)
    }, 420)
    return () => clearTimeout(t)
  }, [shown, chars])

  return (
    <motion.div className="ss-term" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
      <div className="ss-term-bar">
        <i /><i /><i />
        <span>site-solutions ~ deploy</span>
      </div>
      <div className="ss-term-body" aria-hidden="true">
        {termLines.slice(0, shown).map((l, i) => (
          <div key={i} className={l.c}>{l.t}</div>
        ))}
        {termLines[shown] && (
          <div className={termLines[shown].c}>
            {termLines[shown].t.slice(0, chars)}
            <span className="ss-caret" />
          </div>
        )}
        {!termLines[shown] && <span className="ss-caret" />}
      </div>
    </motion.div>
  )
}

function Hero() {
  const ref = useRef(null)
  return (
    <section className="ss-hero" ref={ref}>
      <div className="ss-hero-bg" aria-hidden="true">
        <LetterGlitch glitchColors={GLITCH_COLORS} glitchSpeed={50} centerVignette outerVignette={false} smooth backgroundColor={HERO_BG} />
      </div>
      <div className="ss-hero-glow" aria-hidden="true" />
      <div className="ss-hero-shade" aria-hidden="true" />
      <div className="ss-hero-grid">
        <div>
          <motion.span className="ss-eyebrow" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            A division of R&amp;R Agencies
          </motion.span>
          <motion.h1
            className="ss-title"
            initial={{ opacity: 0, y: 34, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            R&amp;R
            <span>Site Solutions</span>
          </motion.h1>
          <motion.p className="ss-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>
            We Build. We Host. <b>You Grow.</b>
          </motion.p>
          <motion.p className="ss-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
            Websites, e-commerce stores, mobile apps and custom software, with hosting, domains, business email and round-the-clock support to keep it all running.
          </motion.p>
          <motion.div className="ss-cta-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.8 }}>
            <a href="mailto:info@rragencies.co.za" className="ss-btn ss-btn-sky">Get a free quote</a>
            <a href="#work" className="ss-btn ss-btn-ghost-light">See our work</a>
          </motion.div>
        </div>
        <div className="ss-stage">
          <motion.div className="ss-logo-card" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <img src="/logos/site-solutions.png" alt="R&R Site Solutions logo" />
          </motion.div>
          <Terminal />
        </div>
      </div>
      <motion.div className="ss-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
}

function Strip() {
  const row = [...ticker, ...ticker]
  return (
    <div className="ss-strip" aria-hidden="true">
      <div className="ss-strip-track">
        {[0, 1].map(k => (
          <div className="ss-strip-item" key={k}>
            {row.map((t, i) => (
              <span key={`${k}-${i}`} style={{ display: 'contents' }}>
                <span>{t}</span>
                <i>✦</i>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function CountUp({ text }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const value = useMotionValue(0)
  const [out, setOut] = useState(text)
  const parts = text.match(/^(\d+)([–/].*)?$/)

  useEffect(() => {
    if (!parts || !inView) return undefined
    const target = parseInt(parts[1], 10)
    const controls = animate(value, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setOut(`${Math.round(v)}${parts[2] || ''}`),
    })
    return () => controls.stop()
  }, [inView])

  return <strong ref={ref}>{parts && !inView ? `0${parts[2] || ''}` : out}</strong>
}

function Stats() {
  return (
    <div className="ss-stats">
      <div className="ss-stats-in">
        {stats.map((s, i) => (
          <motion.div
            className="ss-stat"
            key={s.big}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <CountUp text={s.big} />
            <span>{s.small}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function Serve() {
  return (
    <section className="ss-section">
      <Reveal>
        <h2 className="ss-h2">Who we serve</h2>
      </Reveal>
      <div className="ss-serve">
        {segments.map((s, i) => (
          <motion.div
            className="ss-serve-card ss-spot"
            key={s.title}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="ss-bars" aria-hidden="true">
              {[1, 2, 3].map(n => (
                <motion.i
                  key={n}
                  className={n <= s.level ? 'on' : ''}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + n * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              ))}
            </div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function TiltCard({ children, index }) {
  const ref = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 220, damping: 20 })
  const sy = useSpring(ry, { stiffness: 220, damping: 20 })

  const onMove = e => {
    if (e.pointerType && e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * 10)
    rx.set(-py * 10)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className="ss-service"
      style={{ rotateX: sx, rotateY: sy }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
    >
      {children}
    </motion.div>
  )
}

function Services() {
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">What we build</h2>
        </Reveal>
        <div className="ss-services">
          {services.map((s, i) => (
            <TiltCard key={s.name} index={i}>
              <span className="ss-service-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>
    </div>
  )
}

function Hosting() {
  return (
    <div className="ss-navy">
      <section className="ss-section">
        <div className="ss-host">
          <div className="ss-host-head">
            <Reveal>
              <h2 className="ss-h2">We host it too</h2>
              <p className="ss-sub">Once your site is live, we keep it fast, secure and online, so you can get on with running your business.</p>
              <p className="ss-note">Hosting is billed monthly. Support and maintenance plans are tailored to what you need.</p>
              <ul className="ss-status" aria-hidden="true">
                {statusRows.map(r => (
                  <li key={r}>
                    <span className="ss-pulse" />
                    {r}
                    <em>online</em>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <div className="ss-host-list">
            {hosting.map((h, i) => (
              <motion.div
                className="ss-host-item ss-spot"
                key={h.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: (i % 2) * 0.08 }}
              >
                <h3>{h.title}</h3>
                <p>{h.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Process() {
  const ref = useRef(null)
  const rowRef = useRef(null)
  const [dist, setDist] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])

  useEffect(() => {
    const measure = () => {
      if (rowRef.current) setDist(Math.max(0, rowRef.current.scrollWidth - document.documentElement.clientWidth))
    }
    measure()
    const settle = setTimeout(measure, 400)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    if (document.fonts?.ready) document.fonts.ready.then(measure)
    return () => {
      clearTimeout(settle)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
    }
  }, [])

  return (
    <div className="ss-process" ref={ref}>
      <div className="ss-sticky">
        <div className="ss-process-head">
          <h2 className="ss-h2">Our process</h2>
        </div>
        <motion.div className="ss-track-row" ref={rowRef} style={{ x }}>
          {process.map(s => (
            <div className="ss-step" key={s.n}>
              <span className="ss-step-dot" />
              <div className="ss-step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function Pricing() {
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">Transparent pricing</h2>
          <p className="ss-sub">Every project is unique, so we provide a customised quote based on your requirements, timeline and scope.</p>
        </Reveal>
        <div className="ss-price">
          {pricingSteps.map((s, i) => (
            <motion.div
              className="ss-price-card ss-spot"
              key={s.title}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              <span className="ss-price-n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="ss-price-note">A service website typically takes 1 to 2 weeks and an e-commerce store 2 to 4 weeks.</p>
      </section>
    </div>
  )
}

function Work() {
  return (
    <section className="ss-section" id="work">
      <Reveal>
        <h2 className="ss-h2">Our work</h2>
      </Reveal>
      <div className="ss-work">
        {portfolio.map((p, i) => (
          <motion.a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="ss-work-row"
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
            <span className="ss-work-arrow">Visit site →</span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">Common questions</h2>
        </Reveal>
        <div className="ss-acc">
          {faqs.map((f, i) => (
            <div className="ss-acc-row" key={f.q}>
              <button className="ss-acc-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}
                <i>+</i>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className="ss-acc-body"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Contact() {
  return (
    <div className="ss-navy" id="contact">
      <section className="ss-section ss-contact-big">
        <Reveal>
          <h2 className="ss-h2">Ready to launch your digital future?</h2>
          <div className="ss-cta-row">
            <a href="mailto:info@rragencies.co.za" className="ss-btn ss-btn-sky">Get a free quote</a>
            <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="ss-btn ss-btn-ghost-light">WhatsApp us</a>
          </div>
        </Reveal>
        <div className="ss-contact-grid">
          <a href="tel:0813365266" className="ss-contact-item">
            <h3>Call</h3>
            <span>081 336 5266</span>
          </a>
          <a href="mailto:info@rragencies.co.za" className="ss-contact-item">
            <h3>Email</h3>
            <span>info@rragencies.co.za</span>
          </a>
          <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="ss-contact-item">
            <h3>WhatsApp</h3>
            <span>Message us on 081 336 5266</span>
          </a>
          <div className="ss-contact-item">
            <h3>Support</h3>
            <span>Available 24/7</span>
          </div>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="ss-contact-item">
            <h3>Visit</h3>
            <address>
              SBDC Building, Unit 13<br />
              2 Columbus Rd, Verulam<br />
              KwaZulu-Natal, South Africa
            </address>
          </a>
        </div>
      </section>
    </div>
  )
}

export default function SiteSolutions() {
  const rootRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })
  useSpotlight(rootRef)

  return (
    <div className="ss" ref={rootRef}>
      <style>{STYLES}</style>
      <motion.div className="ss-bar" style={{ scaleX: bar }} />
      <ThreadRail />
      <Link to="/" className="ss-back">← Back to hub</Link>

      <main>
        <Hero />
        <Strip />
        <Stats />
        <Serve />
        <Services />
        <Hosting />
        <Process />
        <Pricing />
        <Work />
        <Faq />
        <Contact />
      </main>

      <footer className="ss-footer">
        <div className="ss-footer-in">
          <span>© 2026 R&amp;R Site Solutions, a division of R&amp;R Agencies. All rights reserved.</span>
          <div className="ss-footer-links">
            <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
            <Link to="/">R&amp;R Agencies</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}