import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const GOLD = '#E0A93B'
const BLUE = '#3D6BFF'
const GOLD_LIGHT = '#F0C15A'

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('SBDC Building, 2 Columbus Rd, Verulam, KwaZulu-Natal, South Africa')

const galleryImages = Array.from({ length: 10 }, (_, i) => ({
  src: `/gallery/gallery${i + 1}.png`,
  alt: `R&R Agencies work ${i + 1}`,
}))

const steps = [
  { n: '01', title: 'Consultation', desc: 'We discuss your project requirements, timeline, and budget to ensure alignment.' },
  { n: '02', title: 'Design & Sampling', desc: 'Our team prepares designs and samples for your approval before production.' },
  { n: '03', title: 'Production', desc: 'Once approved, we begin production with rigorous quality control throughout.' },
  { n: '04', title: 'Delivery', desc: 'Final inspection and timely delivery to meet your deadline.' },
]

const whyUs = [
  { title: 'All three methods, one roof', desc: 'Embroidery, DTF, and vinyl in-house — no outsourcing between suppliers or juggling multiple vendors for one order.' },
  { title: 'Real production capacity', desc: 'Multi-head commercial embroidery machines built for volume, not a home setup.' },
  { title: 'No surprises', desc: 'Every order goes through design and sampling for your approval before production begins.' },
  { title: 'Trusted by corporate clients', desc: 'We work with chainstores and corporate clients on an ongoing basis — client details kept confidential by agreement.' },
  { title: 'No order too small', desc: 'Low minimum order quantities — from a single unit to full bulk runs.' },
]

const services = [
  {
    id: 'embroidery',
    name: 'Premium Embroidery',
    tagline: 'Professional embroidery services for all textile applications',
    color: GOLD,
    features: [
      'Multi-head commercial embroidery machines',
      'Custom digitizing and design services',
      'Thread matching and color consultation',
      'Quality control and inspection',
      'Fast turnaround for urgent orders',
      'Bulk pricing for large orders',
    ],
    typesLabel: 'Types of Embroidery',
    types: ['Normal embroidery', 'HD (3D) embroidery', 'Fringing', 'Metallic (lurex)', 'Appliqué', 'Window appliqué', 'Printed appliqué', 'Sequins'],
  },
  {
    id: 'dtf',
    name: 'DTF Printing',
    tagline: 'Direct-to-film transfers for vibrant, durable prints',
    color: BLUE,
    features: ['Full-color high-resolution printing', 'Excellent wash durability', 'Works on various fabric types', 'Quick production times'],
    typesLabel: 'Applications',
    types: ['Photo-realistic graphics', 'Gradient and complex designs', 'Promotional t-shirts', 'Event merchandise', 'Fashion and streetwear'],
  },
  {
    id: 'vinyl',
    name: 'Vinyl Solutions',
    tagline: 'Precision vinyl cutting and heat transfer applications',
    color: GOLD_LIGHT,
    features: ['Heat transfer vinyl (HTV)', 'Multiple finish options (matte, gloss, metallic)', 'Custom cutting and weeding', 'Professional application services'],
    typesLabel: 'Best For',
    types: ['Number and name personalization', 'Logo placement and branding', 'Single-color designs', 'Text-based graphics', 'Simple shape cutouts', 'Heat-sealed patches'],
  },
]

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Pinyon+Script&display=swap');

.rr {
  --gold: ${GOLD};
  --gold-light: ${GOLD_LIGHT};
  --blue: ${BLUE};
  --ink: #0a0a12;
  --ink-2: #12121e;
  --cream: #f3ead6;
  --muted: rgba(243, 234, 214, 0.66);
  background: var(--ink);
  color: var(--cream);
  font-family: 'Manrope', system-ui, sans-serif;
  line-height: 1.6;
  overflow-x: clip;
  min-height: 100vh;
}
.rr *, .rr *::before, .rr *::after { box-sizing: border-box; }
.rr h1, .rr h2, .rr h3, .rr h4, .rr p, .rr ul { margin: 0; padding: 0; }
.rr ul { list-style: none; }
.rr a { color: inherit; text-decoration: none; }
.rr a:focus-visible, .rr button:focus-visible { outline: 2px solid var(--gold-light); outline-offset: 4px; border-radius: 6px; }

.rr-progress {
  position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 60;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  box-shadow: 0 0 14px rgba(240, 193, 90, 0.8);
}

.rr-back {
  position: fixed; top: 18px; left: 22px; z-index: 55; font-weight: 700; font-size: 0.92rem;
  padding: 8px 16px; border-radius: 999px;
  background: rgba(10, 10, 18, 0.6); backdrop-filter: blur(10px);
  border: 1px dashed rgba(224, 169, 59, 0.5);
  transition: border-color 250ms ease, transform 250ms ease;
}
.rr-back:hover { border-color: var(--gold-light); transform: translateX(-3px); }

.rr-rail { position: fixed; right: 18px; top: 14vh; bottom: 14vh; width: 24px; z-index: 50; pointer-events: none; }
.rr-rail svg { position: absolute; inset: 0; width: 24px; height: 100%; overflow: visible; }
.rr-track { stroke: rgba(224, 169, 59, 0.18); stroke-width: 2; stroke-dasharray: 9 7; stroke-linecap: round; }
.rr-live { stroke: var(--gold-light); stroke-width: 2.5; stroke-dasharray: 9 7; stroke-linecap: round; filter: drop-shadow(0 0 6px rgba(240, 193, 90, 0.7)); }
.rr-needle {
  position: absolute; left: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%;
  background: #fff6d8; box-shadow: 0 0 0 4px rgba(240, 193, 90, 0.25), 0 0 20px 5px rgba(240, 193, 90, 0.8);
}
@media (max-width: 900px) { .rr-rail { display: none; } }

.rr-hero {
  position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center;
  padding: 110px 24px 80px; overflow: hidden; isolation: isolate;
  background:
    radial-gradient(520px circle at var(--mx, 50%) var(--my, 40%), rgba(240, 193, 90, 0.2), transparent 70%),
    repeating-linear-gradient(0deg, rgba(224, 169, 59, 0.07) 0 1px, transparent 1px 9px),
    repeating-linear-gradient(90deg, rgba(224, 169, 59, 0.07) 0 1px, transparent 1px 9px),
    var(--ink);
}
.rr-hero::after {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: linear-gradient(to bottom, transparent 60%, var(--ink) 100%);
}
.rr-hero-inner { width: min(1000px, 100%); }
.rr-title { width: 100%; height: auto; overflow: visible; }
.rr-title text {
  font-family: 'Pinyon Script', cursive; font-size: 158px; text-anchor: middle;
  fill: rgba(240, 193, 90, 0); stroke: var(--gold-light); stroke-width: 1.6;
  stroke-dasharray: 7 6;
  animation: rr-run 2.4s linear infinite, rr-fill 1.4s ease 1.6s forwards;
  filter: drop-shadow(0 0 18px rgba(224, 169, 59, 0.45));
}
@keyframes rr-run { to { stroke-dashoffset: -26; } }
@keyframes rr-fill { to { fill: rgba(240, 193, 90, 0.95); stroke-dasharray: none; } }
.rr-slogan { margin-top: 0.4rem; font-weight: 800; font-size: clamp(1.05rem, 2.2vw, 1.5rem); letter-spacing: 0.06em; color: #a9bcff; }
.rr-lede { margin: 1rem auto 0; max-width: 34rem; font-size: clamp(1.02rem, 1.8vw, 1.25rem); color: var(--cream); font-weight: 500; }
.rr-cta-row { margin-top: 2.2rem; display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.rr-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 14px 28px; border-radius: 999px;
  font-weight: 800; font-size: 1rem; cursor: pointer; border: 0; font-family: inherit;
  transition: transform 250ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 250ms ease;
}
.rr-btn-gold { background: linear-gradient(100deg, var(--gold), var(--gold-light)); color: #1a1204; box-shadow: 0 8px 30px rgba(224, 169, 59, 0.3); }
.rr-btn-line { background: transparent; color: var(--cream); border: 1px dashed rgba(240, 193, 90, 0.7); }
.rr-btn:hover { transform: translateY(-3px); }
.rr-btn-gold:hover { box-shadow: 0 14px 40px rgba(224, 169, 59, 0.5); }
.rr-scroll { position: absolute; bottom: 26px; left: 50%; translate: -50% 0; color: var(--gold-light); font-weight: 700; font-size: 0.9rem; }

.rr-section { padding: clamp(80px, 12vw, 150px) clamp(20px, 6vw, 80px); max-width: 1240px; margin: 0 auto; }
.rr-h2 { font-size: clamp(2rem, 5vw, 3.6rem); line-height: 1.08; font-weight: 800; letter-spacing: -0.02em; max-width: 16ch; }
.rr-h2::after {
  content: ''; display: block; margin-top: 1.1rem; width: 180px; height: 3px;
  background: repeating-linear-gradient(90deg, var(--gold-light) 0 11px, transparent 11px 19px);
}

.rr-process { position: relative; height: 320vh; }
.rr-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; gap: 3rem; }
.rr-process-head { padding: 0 clamp(20px, 6vw, 80px); max-width: 1240px; width: 100%; margin: 0 auto; }
.rr-track-row { position: relative; display: flex; gap: 28px; padding: 0 clamp(20px, 6vw, 80px); width: max-content; }
.rr-track-row::before {
  content: ''; position: absolute; left: 0; right: 0; top: 30px; height: 2px;
  background: repeating-linear-gradient(90deg, rgba(240, 193, 90, 0.7) 0 12px, transparent 12px 20px);
}
.rr-step {
  position: relative; width: min(78vw, 400px); padding: 64px 28px 30px; border-radius: 22px;
  background: linear-gradient(160deg, var(--ink-2), rgba(18, 18, 30, 0.4));
  border: 1px dashed rgba(224, 169, 59, 0.35);
}
.rr-step-dot { position: absolute; top: 22px; left: 28px; width: 18px; height: 18px; border-radius: 50%; background: var(--gold-light); box-shadow: 0 0 0 6px rgba(240, 193, 90, 0.18), 0 0 22px rgba(240, 193, 90, 0.8); }
.rr-step-n {
  font-size: 5.5rem; font-weight: 800; line-height: 1; color: transparent;
  -webkit-text-stroke: 1.5px rgba(240, 193, 90, 0.75);
}
.rr-step h3 { margin: 0.6rem 0 0.5rem; font-size: 1.5rem; color: var(--gold-light); }
.rr-step p { color: var(--muted); }

.rr-services { display: grid; grid-template-columns: 0.9fr 1.6fr; gap: clamp(24px, 5vw, 70px); margin-top: 3.2rem; align-items: start; }
.rr-tabs { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 100px; }
.rr-tab {
  text-align: left; cursor: pointer; font-family: inherit; color: var(--cream);
  padding: 20px 22px; border-radius: 18px; background: rgba(18, 18, 30, 0.6);
  border: 1px dashed rgba(243, 234, 214, 0.2);
  transition: border-color 300ms ease, background 300ms ease, transform 300ms ease;
}
.rr-tab strong { display: block; font-size: 1.2rem; }
.rr-tab span { font-size: 0.9rem; color: var(--muted); }
.rr-tab:hover { transform: translateX(6px); }
.rr-tab[aria-selected='true'] { border: 1px solid var(--accent); background: color-mix(in srgb, var(--accent) 12%, var(--ink-2)); box-shadow: 0 0 40px color-mix(in srgb, var(--accent) 22%, transparent); }
.rr-panel {
  padding: clamp(24px, 4vw, 48px); border-radius: 28px; min-height: 420px;
  background: radial-gradient(500px circle at var(--mx, 70%) var(--my, 0%), color-mix(in srgb, var(--accent) 16%, transparent), transparent 65%), var(--ink-2);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  border-left: 3px dashed var(--accent);
}
.rr-panel h3 { font-size: clamp(1.7rem, 3.4vw, 2.5rem); color: var(--accent); line-height: 1.1; }
.rr-panel > p { margin-top: 0.7rem; color: var(--muted); }
.rr-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 2rem; }
.rr-cols h4 { font-size: 0.95rem; margin-bottom: 0.9rem; color: var(--cream); }
.rr-features li { padding: 9px 0 9px 22px; position: relative; border-bottom: 1px dashed rgba(243, 234, 214, 0.12); }
.rr-features li::before { content: ''; position: absolute; left: 0; top: 19px; width: 10px; height: 2px; background: var(--accent); }
.rr-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.rr-chips li {
  padding: 8px 14px; border-radius: 999px; font-size: 0.92rem; font-weight: 500;
  border: 1px dashed color-mix(in srgb, var(--accent) 70%, transparent);
  transition: background 250ms ease, transform 250ms ease;
}
.rr-chips li:hover { background: color-mix(in srgb, var(--accent) 22%, transparent); transform: translateY(-2px); }

.rr-why { display: grid; grid-template-columns: repeat(6, 1fr); gap: 18px; margin-top: 3.2rem; }
.rr-why-card {
  grid-column: span 2; position: relative; padding: 30px 26px; border-radius: 22px; overflow: hidden;
  background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(240, 193, 90, 0.16), transparent 65%), var(--ink-2);
  border: 1px dashed rgba(224, 169, 59, 0.3);
  transition: border-color 300ms ease, transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
}
.rr-why-card:nth-child(1) { grid-column: span 4; }
.rr-why-card:nth-child(4) { grid-column: span 3; }
.rr-why-card:nth-child(5) { grid-column: span 3; }
.rr-why-card:hover { border-color: var(--gold-light); transform: translateY(-5px); }
.rr-why-card h3 { color: var(--gold-light); font-size: 1.3rem; margin-bottom: 0.6rem; }
.rr-why-card p { color: var(--muted); }

.rr-gallery-wrap { overflow: hidden; margin-top: 3rem; cursor: grab; }
.rr-gallery-wrap:active { cursor: grabbing; }
.rr-gallery { display: flex; gap: 18px; width: max-content; padding: 6px 0; }
.rr-photo {
  width: clamp(220px, 28vw, 340px); aspect-ratio: 4 / 5; border-radius: 20px; overflow: hidden; flex: none;
  border: 1px solid rgba(224, 169, 59, 0.3); background: var(--ink-2); padding: 0; cursor: pointer;
}
.rr-photo:nth-child(even) { margin-top: 36px; }
.rr-photo img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1); }
.rr-photo:hover img { transform: scale(1.06); }
.rr-hint { margin-top: 1.6rem; color: var(--muted); font-size: 0.95rem; }
.rr-lightbox { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; background: rgba(6, 6, 12, 0.88); backdrop-filter: blur(8px); cursor: zoom-out; padding: 24px; }
.rr-lightbox img { max-width: min(92vw, 900px); max-height: 86vh; border-radius: 22px; border: 1px solid rgba(240, 193, 90, 0.5); box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7); }

.rr-contact { text-align: center; padding-bottom: 140px; }
.rr-contact .rr-h2 { margin: 0 auto; max-width: 18ch; }
.rr-contact .rr-h2::after { margin-left: auto; margin-right: auto; }
.rr-contact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 3rem; text-align: left; }
.rr-contact-item {
  display: flex; flex-direction: column; gap: 6px; padding: 28px; border-radius: 22px; position: relative; overflow: hidden;
  background: radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(240, 193, 90, 0.18), transparent 65%), var(--ink-2);
  border: 1px dashed rgba(224, 169, 59, 0.4);
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease;
}
.rr-contact-item:hover { transform: translateY(-6px); border-color: var(--gold-light); }
.rr-contact-item .ic { font-size: 1.8rem; }
.rr-contact-item strong { color: var(--gold); letter-spacing: 0.1em; font-size: 0.85rem; }
.rr-contact-item span { font-weight: 500; }

@media (max-width: 900px) {
  .rr-services { grid-template-columns: 1fr; }
  .rr-tabs { position: static; }
  .rr-cols { grid-template-columns: 1fr; }
  .rr-why { grid-template-columns: 1fr; }
  .rr-why-card, .rr-why-card:nth-child(n) { grid-column: auto; }
  .rr-contact-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .rr-title text { animation: none; fill: rgba(240, 193, 90, 0.95); stroke-dasharray: none; }
  .rr *, .rr *::before { transition-duration: 0.01ms !important; }
}
`

function useSpotlight(ref) {
  useEffect(() => {
    const root = ref.current
    if (!root) return undefined
    const onMove = e => {
      const el = e.target.closest?.('.rr-hero, .rr-panel, .rr-why-card, .rr-contact-item')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    root.addEventListener('pointermove', onMove, { passive: true })
    return () => root.removeEventListener('pointermove', onMove)
  }, [ref])
}

function ThreadRail() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const h = useTransform(p, v => `${v * 100}%`)
  return (
    <>
      <motion.div className="rr-progress" style={{ scaleX: p }} />
      <div className="rr-rail" aria-hidden="true">
        <svg preserveAspectRatio="none">
          <defs>
            <mask id="rr-reveal">
              <motion.rect x="0" y="0" width="24" fill="#fff" style={{ height: h }} />
            </mask>
          </defs>
          <line x1="12" y1="0" x2="12" y2="100%" className="rr-track" />
          <line x1="12" y1="0" x2="12" y2="100%" className="rr-live" mask="url(#rr-reveal)" />
        </svg>
        <motion.span className="rr-needle" style={{ top: h }} />
      </div>
    </>
  )
}

function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
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
    <section className="rr-hero">
      <div className="rr-hero-inner">
        <svg className="rr-title" viewBox="0 0 900 230" role="img" aria-label="R&R Agencies">
          <text x="450" y="160">R&amp;R Agencies</text>
        </svg>
        <motion.p className="rr-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}>
          Embroidery, DTF & Vinyl Services
        </motion.p>
        <motion.p className="rr-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}>
          Expert embroidery, DTF printing, and vinyl solutions for chainstores and corporate clients.
        </motion.p>
        <motion.div className="rr-cta-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }}>
          <a href="mailto:info@rragencies.co.za" className="rr-btn rr-btn-gold">Request a quote</a>
          <a href="#services" className="rr-btn rr-btn-line">See what we make</a>
        </motion.div>
      </div>
      <motion.div className="rr-scroll" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
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
      if (rowRef.current) setDist(Math.max(0, rowRef.current.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="rr-process" ref={ref}>
      <div className="rr-sticky">
        <div className="rr-process-head">
          <h2 className="rr-h2">From concept to completion</h2>
        </div>
        <motion.div className="rr-track-row" ref={rowRef} style={{ x }}>
          {steps.map(s => (
            <div className="rr-step" key={s.n}>
              <span className="rr-step-dot" />
              <div className="rr-step-n">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function Services() {
  const [active, setActive] = useState(0)
  const s = services[active]
  return (
    <section className="rr-section" id="services">
      <Reveal>
        <h2 className="rr-h2">Three ways to put your brand on fabric</h2>
      </Reveal>
      <div className="rr-services">
        <div className="rr-tabs" role="tablist">
          {services.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={i === active}
              className="rr-tab"
              style={{ '--accent': item.color }}
              onClick={() => setActive(i)}
            >
              <strong>{item.name}</strong>
              <span>{item.tagline}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            className="rr-panel"
            style={{ '--accent': s.color }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
          >
            <h3>{s.name}</h3>
            <p>{s.tagline}</p>
            <div className="rr-cols">
              <div>
                <h4>Features & Capabilities</h4>
                <ul className="rr-features">
                  {s.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4>{s.typesLabel}</h4>
                <ul className="rr-chips">
                  {s.types.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="rr-section">
      <Reveal>
        <h2 className="rr-h2">Why choose us</h2>
      </Reveal>
      <div className="rr-why">
        {whyUs.map((w, i) => (
          <motion.div
            className="rr-why-card"
            key={w.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
          >
            <h3>{w.title}</h3>
            <p>{w.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function Gallery() {
  const wrapRef = useRef(null)
  const rowRef = useRef(null)
  const [limit, setLimit] = useState(0)
  const [open, setOpen] = useState(null)
  const dragged = useRef(false)

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current && rowRef.current) setLimit(Math.max(0, rowRef.current.scrollWidth - wrapRef.current.clientWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (open === null) return undefined
    const onKey = e => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section className="rr-section">
      <Reveal>
        <h2 className="rr-h2">Our work</h2>
      </Reveal>
      <div className="rr-gallery-wrap" ref={wrapRef}>
        <motion.div
          className="rr-gallery"
          ref={rowRef}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          onDragStart={() => (dragged.current = true)}
          onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
        >
          {galleryImages.map((img, i) => (
            <button key={img.src} className="rr-photo" aria-label={`Enlarge ${img.alt}`} onClick={() => !dragged.current && setOpen(i)}>
              <img src={img.src} alt={img.alt} draggable={false} loading="lazy" />
            </button>
          ))}
        </motion.div>
      </div>
      <p className="rr-hint">Drag to explore, tap a photo to enlarge</p>
      <AnimatePresence>
        {open !== null && (
          <motion.div className="rr-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <motion.img
              src={galleryImages[open].src}
              alt={galleryImages[open].alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Contact() {
  return (
    <section className="rr-section rr-contact">
      <Reveal>
        <h2 className="rr-h2">Let's stitch something together</h2>
      </Reveal>
      <div className="rr-contact-grid">
        <a href="tel:0813365266" className="rr-contact-item">
          <span className="ic">📞</span>
          <strong>CALL</strong>
          <span>081 336 5266</span>
        </a>
        <a href="mailto:info@rragencies.co.za" className="rr-contact-item">
          <span className="ic">✉️</span>
          <strong>EMAIL</strong>
          <span>info@rragencies.co.za</span>
        </a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer" className="rr-contact-item">
          <span className="ic">📍</span>
          <strong>VISIT</strong>
          <span>
            SBDC Building, Unit 13<br />
            2 Columbus Rd, Verulam<br />
            KwaZulu-Natal, South Africa
          </span>
        </a>
      </div>
    </section>
  )
}

export default function Agencies() {
  const rootRef = useRef(null)
  useSpotlight(rootRef)

  return (
    <div className="rr" ref={rootRef}>
      <style>{STYLES}</style>
      <ThreadRail />
      <Link to="/" className="rr-back">← Back to hub</Link>
      <Hero />
      <Process />
      <Services />
      <WhyUs />
      <Gallery />
      <Contact />
    </div>
  )
}