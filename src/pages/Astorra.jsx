import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'

const IRIS_COLOR = [0.5, 0.6, 0.8]

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`

function Iridescence({ color = [1, 1, 1], speed = 1.0, amplitude = 0.1, mouseReact = true }) {
  const ctnDom = useRef(null)
  const mousePos = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    if (!ctnDom.current) return undefined
    const ctn = ctnDom.current
    const renderer = new Renderer()
    const gl = renderer.gl
    gl.clearColor(1, 1, 1, 1)
    let program

    function resize() {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight)
      if (program) {
        program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
      }
    }
    window.addEventListener('resize', resize, false)
    window.addEventListener('orientationchange', resize, false)
    resize()

    const geometry = new Triangle(gl)
    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(...color) },
        uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
        uMouse: { value: new Float32Array([mousePos.current.x, mousePos.current.y]) },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    let animateId
    function update(t) {
      animateId = requestAnimationFrame(update)
      program.uniforms.uTime.value = t * 0.001
      renderer.render({ scene: mesh })
    }
    animateId = requestAnimationFrame(update)
    ctn.appendChild(gl.canvas)

    function handleMouseMove(e) {
      const rect = ctn.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = 1.0 - (e.clientY - rect.top) / rect.height
      mousePos.current = { x, y }
      program.uniforms.uMouse.value[0] = x
      program.uniforms.uMouse.value[1] = y
    }
    if (mouseReact) window.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animateId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
      if (mouseReact) window.removeEventListener('mousemove', handleMouseMove)
      ctn.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [color, speed, amplitude, mouseReact])

  return <div ref={ctnDom} className="as-iris" />
}

const howItWorks = [
  { n: '01', title: 'Tell us about your business', desc: 'A short set of guided questions — industry, team size, and how you operate day to day. No long sign-up form.' },
  { n: '02', title: 'Astorra builds the workspace', desc: 'Only the modules your business actually needs are installed automatically and configured — nothing extra.' },
  { n: '03', title: 'One dashboard, everything in view', desc: 'Installed modules and notifications live on a single dashboard. No jumping between five different logins.' },
  { n: '04', title: 'The marketplace', desc: 'Browse and install more modules any time, grouped like an app store — Sales, Finance, Operations, HR.' },
  { n: '05', title: 'The AI Builder', desc: 'Describe a need in plain language — "we hire out equipment" — and the AI recommends the exact modules to solve it.' },
  { n: '06', title: 'Built to scale', desc: 'Pricing scales from a free tier for one person up to enterprise running the full platform.' },
]

const modules = [
  { name: 'Customers', desc: 'One shared record per customer feeding Quotes, Invoices and Bookings — full history and outstanding balance at a glance.' },
  { name: 'Quotes', desc: 'Build quotes with line items, email them as a branded PDF, and convert an accepted quote to an invoice in one click.' },
  { name: 'Jobs', desc: 'Track the work between an accepted quote and getting paid — task checklists, staff assignment, automatic overdue flags.' },
  { name: 'Invoices', desc: 'Auto status tracking (unpaid/paid/overdue), secure "Pay Now" links, no login needed for the customer to pay.' },
  { name: 'Expenses', desc: 'Log spend with category, VAT and receipts. Recurring costs log themselves. Net profit shown against Invoices.' },
  { name: 'Inventory', desc: 'Per-item low-stock thresholds with automatic alerts the moment stock drops — plus bulk import/export.' },
  { name: 'Staff / HR', desc: 'Records, automatic tenure calculation, emergency contacts, bulk status updates.' },
  { name: 'Leave', desc: 'Requests, approvals, and a shared monthly calendar so overlapping absences are visible before sign-off.' },
  { name: 'Bookings', desc: 'Shared calendar with automatic double-booking warnings and reminders 24–48 hours before a booking.' },
  { name: 'Assets', desc: 'Track equipment and vehicles by status, assignment and maintenance schedule, with automatic overdue flags.' },
  { name: 'Purchase Orders', desc: 'Track what you owe suppliers, flag overdue deliveries, and update Inventory automatically on receipt.' },
  { name: 'Payroll', desc: 'Pay runs for hourly and salaried staff with automatic PAYE/UIF calculated against SARS tax brackets.' },
  { name: 'Reports', desc: 'Revenue over time, top 5 customers, overdue aging buckets, and staff headcount — one dashboard, one time-range toggle.' },
  { name: 'Documents', desc: 'Drag-and-drop secure file storage with in-browser preview — contracts and paperwork off email attachments.' },
]

const pricing = [
  { tier: 'Free', price: 'R0', modules: 'Up to 2 modules', ai: 'Not included', max: 2 },
  { tier: 'Starter', price: 'R249', modules: 'Up to 5 modules', ai: 'AI included (5 req/mo)', max: 5 },
  { tier: 'Professional', price: 'R799', modules: 'Up to 10 modules', ai: 'AI included (30 req/mo)', max: 10 },
  { tier: 'Enterprise', price: 'R1 499', modules: 'Unlimited modules', ai: 'Unlimited AI included', max: 99 },
]

const competitors = [
  { name: 'magWork', note: "Closest direct competitor. Same modular pitch — but still requires browsing and picking modules manually. Astorra's AI Builder recommends and installs the exact set from one plain-language description." },
  { name: 'Odoo', note: 'Most feature-complete platform on the market, but a real learning curve for non-technical users. Astorra trades raw breadth for a guided onboarding that lands on a working workspace in minutes.' },
  { name: 'Zoho One', note: 'Affordable, but no PayFast-native billing or SARS-specific payroll. Astorra is built ZAR-first and SA-compliant from day one.' },
  { name: 'Cerva', note: 'A strong SA-native competitor, but accounting-and-payroll first with extras bolted on. Astorra is operations-first — Jobs, Bookings, Assets, Leave — which fits service and trades businesses better.' },
]

const CIRC = 2 * Math.PI * 52

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&display=swap');

.as {
  --violet: #9d6bff;
  --blue: #3b8cff;
  --cyan: #22d9e6;
  --ink: #05050f;
  --glass: rgba(12, 12, 32, 0.55);
  --line: rgba(255, 255, 255, 0.14);
  --muted: rgba(235, 238, 255, 0.7);
  position: relative;
  color: #fff;
  font-family: 'Outfit', system-ui, sans-serif;
  line-height: 1.6;
  overflow-x: clip;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--ink);
}
.as *, .as *::before, .as *::after { box-sizing: border-box; }
.as h1, .as h2, .as h3, .as p, .as ul { margin: 0; padding: 0; }
.as a { color: inherit; text-decoration: none; }
.as a:focus-visible, .as button:focus-visible { outline: 2px solid var(--cyan); outline-offset: 4px; border-radius: 8px; }

.as-hero-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.as-iris { width: 100%; height: 100%; }
.as-iris canvas { display: block; width: 100% !important; height: 100% !important; }
.as-veil {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 70% 55% at 50% 45%, rgba(5, 5, 15, 0.45), rgba(5, 5, 15, 0.1) 80%),
    linear-gradient(to bottom, rgba(5, 5, 15, 0.3) 0%, rgba(5, 5, 15, 0.1) 45%, var(--ink) 100%);
}
.as-main { position: relative; z-index: 1; }

.as-bar {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--violet), var(--blue), var(--cyan));
  box-shadow: 0 0 16px rgba(59, 140, 255, 0.9);
}
.as-back {
  position: fixed; top: 18px; left: 22px; z-index: 60; font-weight: 500; font-size: 0.92rem;
  padding: 9px 18px; border-radius: 999px; background: var(--glass); backdrop-filter: blur(14px);
  border: 1px solid var(--line); transition: transform 250ms ease, border-color 250ms ease;
}
.as-back:hover { transform: translateX(-3px); border-color: var(--cyan); }

.as-hero { min-height: 100vh; min-height: 100dvh; display: grid; place-items: center; text-align: center; padding: 120px 24px 90px; position: relative; overflow: hidden; }
.as-hero-content { position: relative; z-index: 1; }
.as-wordmark {
  font-size: clamp(2.6rem, 10.5vw, 8.6rem); font-weight: 300; letter-spacing: 0.34em; margin-right: -0.34em;
  line-height: 1.1; text-transform: uppercase;
  background: linear-gradient(180deg, #fff 30%, #c9d6ff 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 40px rgba(157, 107, 255, 0.55));
}
.as-slogan { margin-top: 1.4rem; font-size: clamp(1.2rem, 2.6vw, 1.9rem); font-weight: 400; }
.as-slogan .c { color: var(--cyan); }
.as-slogan .v { color: var(--violet); }
.as-lede { margin: 1.6rem auto 0; max-width: 40rem; font-size: clamp(1rem, 1.7vw, 1.2rem); color: var(--muted); font-weight: 300; }
.as-btn {
  display: inline-flex; margin-top: 2.4rem; padding: 15px 34px; border-radius: 999px; font-weight: 600; font-size: 1rem;
  color: #fff; border: 0; cursor: pointer; font-family: inherit;
  background: linear-gradient(100deg, var(--violet), var(--blue) 55%, var(--cyan));
  box-shadow: 0 10px 40px rgba(59, 140, 255, 0.4);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease;
}
.as-btn:hover { transform: translateY(-4px) scale(1.03); box-shadow: 0 18px 60px rgba(34, 217, 230, 0.45); }
.as-scroll { position: absolute; z-index: 1; bottom: 28px; left: 50%; translate: -50% 0; color: var(--muted); font-size: 0.9rem; }

.as-section { max-width: 1240px; margin: 0 auto; padding: clamp(80px, 11vw, 140px) clamp(20px, 5vw, 64px); }
.as-h2 { font-size: clamp(2rem, 4.8vw, 3.5rem); font-weight: 300; line-height: 1.1; letter-spacing: -0.01em; max-width: 18ch; }
.as-h2 b { font-weight: 600; background: linear-gradient(100deg, var(--violet), var(--cyan)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.as-sub { margin-top: 1rem; color: var(--muted); max-width: 32rem; font-weight: 300; }

.as-how { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(28px, 6vw, 90px); align-items: start; }
.as-how-head { position: sticky; top: 130px; }
.as-steps { position: relative; display: flex; flex-direction: column; gap: 22px; padding-left: 46px; }
.as-steps::before {
  content: ''; position: absolute; left: 13px; top: 10px; bottom: 10px; width: 2px;
  background: linear-gradient(to bottom, var(--violet), var(--blue), var(--cyan));
  box-shadow: 0 0 16px rgba(59, 140, 255, 0.7);
}
.as-step {
  position: relative; padding: 26px 28px; border-radius: 24px; background: var(--glass); backdrop-filter: blur(18px);
  border: 1px solid var(--line); transition: border-color 300ms ease, transform 300ms ease;
}
.as-step:hover { border-color: rgba(34, 217, 230, 0.6); transform: translateX(6px); }
.as-step::before {
  content: ''; position: absolute; left: -41px; top: 32px; width: 14px; height: 14px; border-radius: 50%;
  background: #fff; box-shadow: 0 0 0 5px rgba(157, 107, 255, 0.35), 0 0 20px var(--cyan);
}
.as-step-n { font-size: 0.9rem; font-weight: 600; color: var(--cyan); letter-spacing: 0.15em; }
.as-step h3 { margin: 0.3rem 0 0.4rem; font-size: 1.35rem; font-weight: 500; }
.as-step p { color: var(--muted); font-weight: 300; }

.as-build { display: grid; grid-template-columns: 1.7fr 1fr; gap: 26px; margin-top: 3rem; align-items: start; }
.as-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 14px; }
.as-tile {
  text-align: left; cursor: pointer; font-family: inherit; color: #fff; padding: 18px 18px 16px; border-radius: 20px;
  background: var(--glass); backdrop-filter: blur(16px); border: 1px solid var(--line); position: relative; overflow: hidden;
  min-height: 150px; display: flex; flex-direction: column; gap: 6px;
  transition: border-color 300ms ease, background 300ms ease;
  -webkit-tap-highlight-color: transparent;
}
.as-tile strong { font-size: 1.1rem; font-weight: 500; }
.as-tile span { font-size: 0.82rem; color: var(--muted); font-weight: 300; line-height: 1.45; }
.as-tile:hover { border-color: rgba(157, 107, 255, 0.8); }
.as-tile[aria-pressed='true'] {
  border-color: var(--cyan);
  background: linear-gradient(150deg, rgba(157, 107, 255, 0.28), rgba(34, 217, 230, 0.16)), var(--glass);
  box-shadow: 0 0 34px rgba(34, 217, 230, 0.22);
}
.as-tick {
  position: absolute; top: 14px; right: 14px; width: 22px; height: 22px; border-radius: 50%;
  border: 1px solid var(--line); display: grid; place-items: center; font-size: 0.8rem; color: #04121a;
}
.as-tile[aria-pressed='true'] .as-tick { background: var(--cyan); border-color: var(--cyan); }
.as-panel {
  position: sticky; top: 100px; padding: 28px; border-radius: 28px; text-align: center;
  background: var(--glass); backdrop-filter: blur(22px); border: 1px solid var(--line);
}
.as-ring { position: relative; width: 150px; height: 150px; margin: 0 auto 1rem; }
.as-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.as-ring .n { position: absolute; inset: 0; display: grid; place-items: center; font-size: 2.6rem; font-weight: 300; }
.as-ring .n small { display: block; font-size: 0.75rem; color: var(--muted); margin-top: -14px; }
.as-plan { font-size: 1.5rem; font-weight: 500; background: linear-gradient(100deg, var(--violet), var(--cyan)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.as-plan-sub { color: var(--muted); font-size: 0.92rem; margin-top: 2px; font-weight: 300; }
.as-installed { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-top: 1.2rem; min-height: 32px; }
.as-installed li { list-style: none; padding: 5px 12px; border-radius: 999px; font-size: 0.82rem; background: rgba(157, 107, 255, 0.22); border: 1px solid rgba(157, 107, 255, 0.5); }
.as-empty { color: var(--muted); font-size: 0.9rem; font-weight: 300; }

.as-price { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 3rem; }
.as-card {
  position: relative; padding: 30px 24px; border-radius: 26px; background: var(--glass); backdrop-filter: blur(18px);
  border: 1px solid var(--line); display: flex; flex-direction: column; gap: 6px;
  transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1), border-color 400ms ease, box-shadow 400ms ease;
}
.as-card h3 { font-size: 1.1rem; font-weight: 500; color: var(--muted); }
.as-card .p { font-size: 2.5rem; font-weight: 300; line-height: 1.1; }
.as-card .p small { font-size: 0.9rem; color: var(--muted); }
.as-card p { font-weight: 300; color: var(--muted); }
.as-card[data-hot='true'] {
  transform: translateY(-10px); border-color: var(--cyan);
  background: linear-gradient(160deg, rgba(157, 107, 255, 0.3), rgba(34, 217, 230, 0.14)), var(--glass);
  box-shadow: 0 0 60px rgba(59, 140, 255, 0.35);
}
.as-flag { position: absolute; top: -13px; left: 24px; padding: 4px 14px; border-radius: 999px; font-size: 0.78rem; font-weight: 600; background: var(--cyan); color: #04121a; }
.as-note { margin-top: 2.2rem; max-width: 46rem; color: var(--muted); font-weight: 300; }

.as-acc { margin-top: 3rem; border-top: 1px solid var(--line); }
.as-acc-row { border-bottom: 1px solid var(--line); }
.as-acc-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 26px 4px;
  background: none; border: 0; color: #fff; font-family: inherit; font-size: clamp(1.5rem, 3.4vw, 2.4rem); font-weight: 300; cursor: pointer; text-align: left;
  transition: color 250ms ease, padding 250ms ease;
}
.as-acc-btn:hover { color: var(--cyan); padding-left: 14px; }
.as-acc-btn i { font-style: normal; font-size: 1.8rem; color: var(--violet); transition: transform 300ms ease; }
.as-acc-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.as-acc-body { overflow: hidden; }
.as-acc-body p { padding: 0 4px 28px; max-width: 46rem; color: var(--muted); font-weight: 300; font-size: 1.05rem; }

.as-contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 3rem; max-width: 820px; }
.as-contact-item {
  padding: 26px 28px; border-radius: 24px; background: var(--glass); backdrop-filter: blur(18px);
  border: 1px solid var(--line); transition: border-color 300ms ease, transform 300ms ease;
}
.as-contact-item:hover { border-color: rgba(34, 217, 230, 0.6); transform: translateY(-3px); }
.as-contact-item h3 { font-size: 0.85rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cyan); margin-bottom: 0.5rem; }
.as-contact-item p, .as-contact-item a { font-weight: 300; font-size: 1.05rem; color: #fff; font-style: normal; overflow-wrap: anywhere; }
.as-contact-item address { font-style: normal; font-weight: 300; font-size: 1.05rem; line-height: 1.6; }
.as-contact-item a:hover { color: var(--cyan); }

.as-footer { border-top: 1px solid var(--line); padding: 40px clamp(20px, 5vw, 64px) 48px; }
.as-footer-in { max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px 32px; color: var(--muted); font-weight: 300; font-size: 0.92rem; }
.as-footer-links { display: flex; flex-wrap: wrap; gap: 8px 24px; }
.as-footer-links a:hover { color: var(--cyan); }

@media (max-width: 900px) {
  .as-how, .as-build { grid-template-columns: 1fr; }
  .as-how-head { position: static; }
  .as-price { grid-template-columns: 1fr 1fr; }

  .as-step, .as-tile, .as-card, .as-contact-item { backdrop-filter: none; -webkit-backdrop-filter: none; background: rgba(14, 14, 36, 0.8); }

  .as-panel {
    order: -1; position: sticky; top: 62px; z-index: 20;
    display: grid; grid-template-columns: 72px 1fr; column-gap: 16px; align-items: center; text-align: left;
    padding: 12px 18px; border-radius: 20px;
    background: rgba(8, 8, 24, 0.94); backdrop-filter: none; -webkit-backdrop-filter: none;
  }
  .as-ring { grid-row: 1 / 3; width: 72px; height: 72px; margin: 0; }
  .as-ring .n { font-size: 1.5rem; }
  .as-ring .n small { font-size: 0.6rem; margin-top: -8px; }
  .as-plan { font-size: 1.15rem; align-self: end; }
  .as-plan-sub { font-size: 0.82rem; align-self: start; }
  .as-installed { display: none; }
}
@media (max-width: 560px) {
  .as-back { top: 12px; left: 12px; padding: 7px 14px; font-size: 0.82rem; }
  .as-hero { padding: 100px 20px 80px; }
  .as-section { padding-top: 64px; padding-bottom: 64px; }
  .as-btn { width: 100%; justify-content: center; }

  .as-steps { padding-left: 32px; gap: 16px; }
  .as-steps::before { left: 7px; }
  .as-step { padding: 20px 20px; border-radius: 20px; }
  .as-step::before { left: -31px; top: 26px; width: 12px; height: 12px; }
  .as-step:hover { transform: none; }

  .as-tiles { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .as-tile { min-height: 0; padding: 14px 14px 14px; border-radius: 16px; }
  .as-tile strong { font-size: 1rem; padding-right: 26px; }
  .as-tile span { font-size: 0.76rem; }
  .as-tick { top: 12px; right: 10px; width: 20px; height: 20px; }

  .as-price { grid-template-columns: 1fr; }
  .as-card { padding: 26px 22px; }
  .as-card[data-hot='true'] { transform: none; }
  .as-flag { top: -12px; }

  .as-acc-btn { padding: 20px 2px; }
  .as-acc-body p { font-size: 1rem; }

  .as-contact-grid { grid-template-columns: 1fr; }
  .as-contact-item { padding: 22px; }
  .as-footer-in { flex-direction: column; align-items: flex-start; }
}
@media (prefers-reduced-motion: reduce) { .as *, .as *::before { transition-duration: 0.01ms !important; } }
`

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Builder({ picked, setPicked }) {
  const count = picked.length
  const plan = count === 0 ? null : pricing.find(p => count <= p.max)
  const toggle = name => setPicked(list => (list.includes(name) ? list.filter(n => n !== name) : [...list, name]))

  return (
    <section className="as-section" id="build">
      <Reveal>
        <h2 className="as-h2">14 modules. <b>Install only what you need.</b></h2>
        <p className="as-sub">Tap modules to build your workspace and see which plan fits.</p>
      </Reveal>
      <div className="as-build">
        <div className="as-tiles">
          {modules.map(m => {
            const on = picked.includes(m.name)
            return (
              <motion.button
                key={m.name}
                className="as-tile"
                aria-pressed={on}
                onClick={() => toggle(m.name)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <span className="as-tick">{on ? '✓' : ''}</span>
                <strong>{m.name}</strong>
                <span>{m.desc}</span>
              </motion.button>
            )
          })}
        </div>
        <div className="as-panel">
          <div className="as-ring">
            <svg viewBox="0 0 120 120">
              <defs>
                <linearGradient id="as-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#9d6bff" />
                  <stop offset="100%" stopColor="#22d9e6" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <motion.circle
                cx="60" cy="60" r="52" fill="none" stroke="url(#as-grad)" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC * (1 - count / modules.length) }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </svg>
            <div className="n"><div>{count}<small>of 14</small></div></div>
          </div>
          <p className="as-plan">{plan ? plan.tier : 'Your workspace'}</p>
          <p className="as-plan-sub">{plan ? `${plan.price}/pm · ${plan.modules}` : 'Nothing installed yet'}</p>
          <ul className="as-installed">
            <AnimatePresence>
              {picked.map(n => (
                <motion.li key={n} layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
                  {n}
                </motion.li>
              ))}
            </AnimatePresence>
            {count === 0 && <span className="as-empty">Pick a module to begin</span>}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Pricing({ picked }) {
  const count = picked.length
  const hot = count === 0 ? null : pricing.find(p => count <= p.max)?.tier
  return (
    <section className="as-section">
      <Reveal>
        <h2 className="as-h2">Pricing that <b>scales with you</b></h2>
      </Reveal>
      <div className="as-price">
        {pricing.map((p, i) => (
          <motion.div
            className="as-card"
            key={p.tier}
            data-hot={hot === p.tier}
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            {hot === p.tier && <span className="as-flag">Fits your workspace</span>}
            <h3>{p.tier}</h3>
            <div className="p">{p.price}<small>/pm</small></div>
            <p>{p.modules}</p>
            <p>{p.ai}</p>
          </motion.div>
        ))}
      </div>
      <p className="as-note">
        Need something custom? Astorra also builds fully custom software as an IT company in its own right — get in touch to scope a solution outside the standard tiers.
      </p>
    </section>
  )
}

function Compare() {
  const [open, setOpen] = useState(0)
  return (
    <section className="as-section">
      <Reveal>
        <h2 className="as-h2">How Astorra <b>compares</b></h2>
      </Reveal>
      <div className="as-acc">
        {competitors.map((c, i) => (
          <div className="as-acc-row" key={c.name}>
            <button className="as-acc-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              {c.name}
              <i>+</i>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className="as-acc-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p>{c.note}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="as-section" id="contact">
      <Reveal>
        <h2 className="as-h2">Get in <b>touch</b></h2>
        <p className="as-sub">Astorra is owned and operated by R&R Agencies.</p>
      </Reveal>
      <div className="as-contact-grid">
        <div className="as-contact-item">
          <h3>Phone</h3>
          <a href="tel:0813365266">081 336 5266</a>
        </div>
        <div className="as-contact-item">
          <h3>Email</h3>
          <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
        </div>
        <div className="as-contact-item">
          <h3>Support</h3>
          <p>Available 24/7</p>
        </div>
        <div className="as-contact-item">
          <h3>Location</h3>
          <address>
            SBDC Building<br />
            2 Columbus Rd, Verulam<br />
            Unit 13<br />
            KwaZulu-Natal, South Africa
          </address>
        </div>
        <div className="as-contact-item">
          <h3>Website</h3>
          <a href="https://www.astorra.co.za" target="_blank" rel="noopener noreferrer">www.astorra.co.za</a>
        </div>
        <div className="as-contact-item">
          <h3>Get started</h3>
          <a href="https://www.astorra.co.za/auth" target="_blank" rel="noopener noreferrer">Sign up or log in</a>
        </div>
      </div>
    </section>
  )
}

export default function Astorra() {
  const [picked, setPicked] = useState([])
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  return (
    <div className="as">
      <style>{STYLES}</style>
      <motion.div className="as-bar" style={{ scaleX: bar }} />
      <Link to="/" className="as-back">← Back to hub</Link>

      <main className="as-main">
        <section className="as-hero">
          <div className="as-hero-bg" aria-hidden="true">
            <Iridescence color={IRIS_COLOR} mouseReact amplitude={0.1} speed={1} />
            <div className="as-veil" />
          </div>
          <div className="as-hero-content">
            <motion.h1 className="as-wordmark" initial={{ opacity: 0, y: 30, filter: 'blur(14px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
              Astorra
            </motion.h1>
            <motion.p className="as-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}>
              One platform. <span className="c">Your</span> <span className="v">way.</span>
            </motion.p>
            <motion.p className="as-lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}>
              Businesses don't buy software — they buy relief from disconnected, manual, wasted-time operations. Astorra brings everything together in one intelligent, modular platform that adapts to the way each business works.
            </motion.p>
            <motion.a href="https://www.astorra.co.za/auth" target="_blank" rel="noopener noreferrer" className="as-btn" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
              Build your workspace
            </motion.a>
          </div>
          <motion.div className="as-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>scroll ↓</motion.div>
        </section>

        <section className="as-section">
          <div className="as-how">
            <div className="as-how-head">
              <Reveal>
                <h2 className="as-h2">Up and running <b>in minutes</b></h2>
                <p className="as-sub">Six steps from a few questions to a workspace that fits.</p>
              </Reveal>
            </div>
            <div className="as-steps">
              {howItWorks.map(s => (
                <motion.div
                  className="as-step"
                  key={s.n}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="as-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Builder picked={picked} setPicked={setPicked} />
        <Pricing picked={picked} />
        <Compare />
        <Contact />
      </main>

      <footer className="as-footer">
        <div className="as-footer-in">
          <span>© 2026 R&R Agencies (trading as Astorra). All rights reserved.</span>
          <div className="as-footer-links">
            <a href="https://www.astorra.co.za" target="_blank" rel="noopener noreferrer">www.astorra.co.za</a>
            <a href="https://www.astorra.co.za/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <a href="https://www.astorra.co.za/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}