import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
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

    const dpr = window.devicePixelRatio || 1
    const rect = parent.getBoundingClientRect()

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

  const animate = () => {
    const now = Date.now()
    if (now - lastGlitchTime.current >= glitchSpeed) {
      updateLetters()
      drawLetters()
      lastGlitchTime.current = now
    }
    if (smooth) handleSmoothTransitions()
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    context.current = canvas.getContext('2d')
    resizeCanvas()
    animate()

    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        cancelAnimationFrame(animationRef.current)
        resizeCanvas()
        animate()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

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
}
.ss *, .ss *::before, .ss *::after { box-sizing: border-box; }
.ss h1, .ss h2, .ss h3, .ss h4, .ss p, .ss ul, .ss address { margin: 0; padding: 0; }
.ss ul { list-style: none; }
.ss address { font-style: normal; }
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
  background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(14px);
  border: 1px solid rgba(27, 58, 114, 0.28); box-shadow: 0 8px 24px rgba(15, 36, 80, 0.14);
  transition: transform 250ms ease, border-color 250ms ease;
}
.ss-back:hover { transform: translateX(-3px); border-color: var(--sky); }

.ss-hero {
  position: relative; min-height: 100vh; display: grid; align-items: center; overflow: hidden; isolation: isolate;
  padding: 96px clamp(20px, 5vw, 64px) 72px; background: var(--hero-bg); color: #fff;
}
.ss-hero-bg { position: absolute; inset: 0; z-index: -2; overflow: hidden; }
.ss-hero-shade {
  position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background:
    linear-gradient(90deg, rgba(10, 26, 60, 0.82) 0%, rgba(10, 26, 60, 0.55) 45%, rgba(10, 26, 60, 0.15) 100%),
    linear-gradient(180deg, rgba(10, 26, 60, 0.35) 0%, transparent 30%, rgba(10, 26, 60, 0.75) 100%);
}
.ss-hero-grid { max-width: 1120px; width: 100%; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; gap: clamp(24px, 5vw, 60px); align-items: center; }
.ss-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky-light); }
.ss-eyebrow::before { content: ''; width: 28px; height: 2px; background: var(--sky); }
.ss-title { margin-top: 0.8rem; font-family: 'Sora', sans-serif; font-weight: 800; font-size: clamp(2.4rem, 5.2vw, 4.2rem); line-height: 1.04; letter-spacing: -0.03em; color: #fff; text-shadow: 0 4px 30px rgba(10, 26, 60, 0.6); }
.ss-title span { display: block; color: #b9bec7; }
.ss-slogan { margin-top: 1rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1rem, 1.8vw, 1.35rem); color: #fff; }
.ss-slogan b { color: var(--sky); font-weight: 700; }
.ss-lede { margin-top: 0.9rem; max-width: 30rem; font-size: clamp(0.92rem, 1.2vw, 1.02rem); color: rgba(232, 242, 252, 0.85); }
.ss-cta-row { margin-top: 1.7rem; display: flex; gap: 12px; flex-wrap: wrap; }
.ss-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: 999px;
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: 1px solid transparent;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease, background 250ms ease;
}
.ss-btn:hover { transform: translateY(-3px); }
.ss-btn-sky { background: linear-gradient(120deg, var(--sky), var(--sky-light)); color: var(--navy-deep); box-shadow: 0 10px 30px rgba(45, 168, 224, 0.35); }
.ss-btn-sky:hover { box-shadow: 0 16px 40px rgba(45, 168, 224, 0.5); }
.ss-btn-ghost-light { color: #fff; border-color: rgba(255, 255, 255, 0.5); background: rgba(10, 26, 60, 0.4); }
.ss-btn-ghost-light:hover { background: rgba(255, 255, 255, 0.14); }
.ss-logo-card {
  position: relative; justify-self: center; width: 100%; max-width: 340px; padding: 18px; border-radius: 28px; background: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4); box-shadow: 0 30px 80px rgba(3, 10, 30, 0.55);
}
.ss-logo-card::before {
  content: ''; position: absolute; inset: -12px; z-index: -1; border-radius: 36px;
  border: 1px dashed rgba(143, 211, 244, 0.6);
}
.ss-logo-card img { display: block; width: 100%; height: auto; }
.ss-scroll { position: absolute; bottom: 18px; left: 50%; translate: -50% 0; color: var(--sky-light); font-weight: 700; font-size: 0.8rem; }

.ss-stats { background: #fff; border-bottom: 1px solid rgba(27, 58, 114, 0.12); }
.ss-stats-in { max-width: 1120px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); }
.ss-stat { padding: 24px clamp(14px, 2.4vw, 32px); border-right: 1px solid rgba(27, 58, 114, 0.12); }
.ss-stat:last-child { border-right: 0; }
.ss-stat strong { display: block; font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(1.5rem, 3vw, 2.1rem); line-height: 1.1; color: var(--navy); }
.ss-stat span { color: var(--muted); font-size: 0.85rem; }

.ss-section { max-width: 1120px; margin: 0 auto; padding: clamp(56px, 8vw, 96px) clamp(20px, 4.5vw, 56px); }
.ss-h2 { font-family: 'Sora', sans-serif; font-weight: 700; font-size: clamp(1.6rem, 3.4vw, 2.4rem); line-height: 1.12; letter-spacing: -0.02em; color: var(--navy); max-width: 20ch; }
.ss-h2::after { content: ''; display: block; margin-top: 0.9rem; width: 64px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, var(--navy), var(--sky)); }
.ss-sub { margin-top: 1rem; color: var(--muted); max-width: 32rem; }
.ss-tint { background: var(--mist); }
.ss-navy { background: linear-gradient(160deg, var(--navy), var(--navy-deep)); color: #fff; position: relative; overflow: hidden; }
.ss-navy .ss-h2 { color: #fff; }
.ss-navy .ss-h2::after { background: linear-gradient(90deg, var(--sky), var(--sky-light)); }
.ss-navy .ss-sub { color: var(--muted-light); }

.ss-serve { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2.2rem; }
.ss-serve-card {
  padding: 24px 22px; border-radius: 20px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14);
  box-shadow: 0 14px 40px rgba(15, 36, 80, 0.06);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease;
}
.ss-serve-card:hover { transform: translateY(-5px); border-color: var(--sky); box-shadow: 0 22px 50px rgba(45, 168, 224, 0.18); }
.ss-bars { display: flex; align-items: flex-end; gap: 4px; height: 28px; margin-bottom: 1rem; }
.ss-bars i { width: 8px; border-radius: 3px; background: rgba(27, 58, 114, 0.15); }
.ss-bars i:nth-child(1) { height: 30%; }
.ss-bars i:nth-child(2) { height: 65%; }
.ss-bars i:nth-child(3) { height: 100%; }
.ss-bars i.on { background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-serve-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--navy); }
.ss-serve-card p { margin-top: 0.35rem; color: var(--muted); }

.ss-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2.2rem; }
.ss-service {
  position: relative; padding: 24px 22px 22px; border-radius: 20px; background: #fff; overflow: hidden;
  border: 1px solid rgba(27, 58, 114, 0.14);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease;
}
.ss-service::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: linear-gradient(180deg, var(--sky), var(--navy)); }
.ss-service:hover { transform: translateY(-4px); border-color: var(--sky); }
.ss-service h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.05rem; color: var(--navy); }
.ss-service p { margin-top: 0.4rem; color: var(--muted); }

.ss-host { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(24px, 5vw, 70px); align-items: start; }
.ss-host-head { position: sticky; top: 90px; }
.ss-host-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ss-host-item {
  padding: 20px; border-radius: 18px; background: rgba(255, 255, 255, 0.07); backdrop-filter: blur(10px);
  border: 1px solid rgba(143, 211, 244, 0.26);
  transition: border-color 300ms ease, background 300ms ease, transform 300ms ease;
}
.ss-host-item:hover { border-color: var(--sky-light); background: rgba(255, 255, 255, 0.11); transform: translateY(-4px); }
.ss-host-item h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1rem; color: var(--sky-light); }
.ss-host-item p { margin-top: 0.35rem; color: var(--muted-light); font-size: 0.9rem; }
.ss-note { margin-top: 1.1rem; color: var(--muted-light); font-size: 0.88rem; }

.ss-steps { position: relative; display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-top: 2.6rem; }
.ss-steps::before {
  content: ''; position: absolute; left: 0; right: 0; top: 21px; height: 2px;
  background: repeating-linear-gradient(90deg, rgba(45, 168, 224, 0.7) 0 10px, transparent 10px 18px);
}
.ss-step { position: relative; padding-top: 56px; }
.ss-step-dot {
  position: absolute; top: 9px; left: 0; width: 26px; height: 26px; border-radius: 50%; background: #fff;
  border: 3px solid var(--sky); box-shadow: 0 0 0 5px rgba(45, 168, 224, 0.15);
}
.ss-step-n { font-family: 'Sora', sans-serif; font-weight: 800; font-size: 2rem; line-height: 1; color: transparent; -webkit-text-stroke: 1.5px rgba(27, 58, 114, 0.5); }
.ss-step h3 { margin-top: 0.4rem; font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1rem; color: var(--navy); }
.ss-step p { margin-top: 0.3rem; color: var(--muted); font-size: 0.9rem; }

.ss-price { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 2.2rem; }
.ss-price-card { position: relative; padding: 26px 22px; border-radius: 20px; background: #fff; border: 1px solid rgba(27, 58, 114, 0.14); }
.ss-price-n {
  display: grid; place-items: center; width: 38px; height: 38px; margin-bottom: 0.8rem; border-radius: 50%;
  font-family: 'Sora', sans-serif; font-weight: 700; color: #fff; background: linear-gradient(135deg, var(--navy), var(--sky));
}
.ss-price-card h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 1.1rem; color: var(--navy); }
.ss-price-card p { margin-top: 0.35rem; color: var(--muted); }
.ss-price-note { margin-top: 1.6rem; max-width: 42rem; color: var(--muted); }

.ss-work { margin-top: 2.2rem; border-top: 1px solid rgba(27, 58, 114, 0.16); }
.ss-work-row {
  display: grid; grid-template-columns: 0.9fr 1.6fr auto; gap: 20px; align-items: center; padding: 20px 6px;
  border-bottom: 1px solid rgba(27, 58, 114, 0.16); transition: padding-left 300ms ease, background 300ms ease;
}
.ss-work-row:hover { padding-left: 16px; background: linear-gradient(90deg, rgba(45, 168, 224, 0.08), transparent); }
.ss-work-row h3 { font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(1.05rem, 1.8vw, 1.3rem); color: var(--navy); }
.ss-work-row p { color: var(--muted); font-size: 0.92rem; }
.ss-work-arrow { font-family: 'Sora', sans-serif; font-weight: 600; font-size: 0.88rem; color: var(--sky); white-space: nowrap; }

.ss-acc { margin-top: 2.2rem; border-top: 1px solid rgba(27, 58, 114, 0.18); max-width: 780px; }
.ss-acc-row { border-bottom: 1px solid rgba(27, 58, 114, 0.18); }
.ss-acc-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 18px 4px;
  background: none; border: 0; cursor: pointer; text-align: left; color: var(--navy);
  font-family: 'Sora', sans-serif; font-weight: 600; font-size: clamp(0.95rem, 1.6vw, 1.1rem);
  transition: color 250ms ease, padding 250ms ease;
}
.ss-acc-btn:hover { color: var(--sky); padding-left: 10px; }
.ss-acc-btn i { font-style: normal; font-size: 1.4rem; color: var(--sky); transition: transform 300ms ease; }
.ss-acc-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.ss-acc-body { overflow: hidden; }
.ss-acc-body p { padding: 0 4px 20px; max-width: 42rem; color: var(--muted); }

.ss-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 2.2rem; }
.ss-contact-item {
  display: flex; flex-direction: column; gap: 5px; padding: 22px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(143, 211, 244, 0.28);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, background 300ms ease;
}
a.ss-contact-item:hover { transform: translateY(-5px); border-color: var(--sky-light); background: rgba(255, 255, 255, 0.12); }
.ss-contact-item h3 { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sky-light); }
.ss-contact-item span, .ss-contact-item address { font-size: 0.98rem; overflow-wrap: anywhere; }

.ss-footer { background: var(--navy-deep); color: var(--muted-light); padding: 30px clamp(20px, 4.5vw, 56px) 36px; }
.ss-footer-in { max-width: 1120px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px 28px; font-size: 0.85rem; }
.ss-footer-links { display: flex; flex-wrap: wrap; gap: 8px 22px; }
.ss-footer-links a:hover { color: var(--sky-light); }

@media (max-width: 900px) {
  .ss-hero-grid, .ss-host { grid-template-columns: 1fr; }
  .ss-logo-card { max-width: 280px; justify-self: start; }
  .ss-host-head { position: static; }
  .ss-stats-in { grid-template-columns: 1fr 1fr; }
  .ss-stat:nth-child(2) { border-right: 0; }
  .ss-stat:nth-child(-n + 2) { border-bottom: 1px solid rgba(27, 58, 114, 0.12); }
  .ss-serve, .ss-services, .ss-price, .ss-contact-grid { grid-template-columns: 1fr; }
  .ss-host-list { grid-template-columns: 1fr; }
  .ss-steps { grid-template-columns: 1fr; gap: 22px; }
  .ss-steps::before { left: 12px; right: auto; top: 0; bottom: 0; width: 2px; height: auto; background: repeating-linear-gradient(180deg, rgba(45, 168, 224, 0.7) 0 10px, transparent 10px 18px); }
  .ss-step { padding: 0 0 0 48px; }
  .ss-step-dot { top: 2px; }
  .ss-work-row { grid-template-columns: 1fr; gap: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .ss *, .ss *::before { transition-duration: 0.01ms !important; }
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

function Hero() {
  return (
    <section className="ss-hero">
      <div className="ss-hero-bg" aria-hidden="true">
        <LetterGlitch
          glitchColors={GLITCH_COLORS}
          glitchSpeed={50}
          centerVignette
          outerVignette={false}
          smooth
          backgroundColor={HERO_BG}
        />
      </div>
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
        <motion.div className="ss-logo-card" initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <img src="/logos/site-solutions.png" alt="R&R Site Solutions logo" />
        </motion.div>
      </div>
      <motion.div className="ss-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
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
            <strong>{s.big}</strong>
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
            className="ss-serve-card"
            key={s.title}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div className="ss-bars" aria-hidden="true">
              {[1, 2, 3].map(n => (
                <i key={n} className={n <= s.level ? 'on' : ''} />
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

function Services() {
  return (
    <div className="ss-tint">
      <section className="ss-section">
        <Reveal>
          <h2 className="ss-h2">What we build</h2>
        </Reveal>
        <div className="ss-services">
          {services.map((s, i) => (
            <motion.div
              className="ss-service"
              key={s.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08 }}
            >
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </motion.div>
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
            </Reveal>
          </div>
          <div className="ss-host-list">
            {hosting.map((h, i) => (
              <motion.div
                className="ss-host-item"
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
  return (
    <section className="ss-section">
      <Reveal>
        <h2 className="ss-h2">Our process</h2>
      </Reveal>
      <div className="ss-steps">
        {process.map((s, i) => (
          <motion.div
            className="ss-step"
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
          >
            <span className="ss-step-dot" />
            <div className="ss-step-n">{s.n}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
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
              className="ss-price-card"
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
      <section className="ss-section">
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
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  return (
    <div className="ss">
      <style>{STYLES}</style>
      <motion.div className="ss-bar" style={{ scaleX: bar }} />
      <Link to="/" className="ss-back">← Back to hub</Link>

      <main>
        <Hero />
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