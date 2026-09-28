import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useGesture } from '@use-gesture/react'

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

const DOME_STYLES = `
.rr-dome {
  position: relative; width: 100%; max-width: 1200px; height: min(78vh, 820px); min-height: 480px;
  margin: 3rem auto 0; border-radius: 28px; overflow: hidden; contain: paint; isolation: isolate;
  border: 1px dashed rgba(224, 169, 59, 0.45); box-shadow: 0 0 90px rgba(61, 107, 255, 0.14);
}
.rr-dome .sphere-root { overflow: hidden; }
body.dg-scroll-lock { overflow: hidden; }
.sphere-root {
  position: relative; width: 100%; height: 100%;
  --radius: 520px; --viewer-pad: 72px; --circ: calc(var(--radius) * 3.14);
  --rot-y: calc((360deg / var(--segments-x)) / 2);
  --rot-x: calc((360deg / var(--segments-y)) / 2);
  --item-width: calc(var(--circ) / var(--segments-x));
  --item-height: calc(var(--circ) / var(--segments-y));
}
.sphere-root * { box-sizing: border-box; }
.sphere, .item, .item__image { transform-style: preserve-3d; }
main.sphere-main {
  position: absolute; inset: 0; display: grid; place-items: center; overflow: hidden;
  touch-action: none; user-select: none; -webkit-user-select: none;
  background: var(--overlay-blur-color, #120f17);
}
.stage {
  width: 100%; height: 100%; display: grid; place-items: center;
  perspective: calc(var(--radius) * 2); perspective-origin: 50% 50%; contain: layout paint size;
}
.sphere { transform: translateZ(calc(var(--radius) * -1)); will-change: transform; }
.overlay, .overlay--blur { position: absolute; inset: 0; margin: auto; z-index: 3; pointer-events: none; }
.overlay { background-image: radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, #120F17) 100%); }
.overlay--blur {
  -webkit-mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%);
  mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%);
  backdrop-filter: blur(3px);
}
.item {
  width: calc(var(--item-width) * var(--item-size-x)); height: calc(var(--item-height) * var(--item-size-y));
  position: absolute; top: -999px; bottom: -999px; left: -999px; right: -999px; margin: auto;
  transform-origin: 50% 50%; backface-visibility: hidden; transition: transform 300ms;
  transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg)))
    rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg)))
    translateZ(var(--radius));
}
.item__image {
  position: absolute; display: block; inset: 10px; border-radius: var(--tile-radius, 12px);
  background: var(--overlay-blur-color, #120f17); overflow: hidden; backface-visibility: hidden;
  transition: transform 300ms; cursor: pointer; -webkit-tap-highlight-color: transparent;
  touch-action: manipulation; pointer-events: auto; -webkit-transform: translateZ(0); transform: translateZ(0);
}
.item__image:focus { outline: none; }
.item__image img {
  width: 100%; height: 100%; object-fit: cover; pointer-events: none;
  backface-visibility: hidden; filter: var(--image-filter, none);
}
.viewer {
  position: absolute; inset: 0; z-index: 20; pointer-events: none; display: flex;
  align-items: center; justify-content: center; padding: var(--viewer-pad);
}
.viewer .frame { height: 100%; aspect-ratio: 1; border-radius: var(--enlarge-radius, 32px); display: flex; }
@media (max-aspect-ratio: 1/1) { .viewer .frame { height: auto; width: 100%; } }
.viewer .scrim {
  position: absolute; inset: 0; z-index: 10; background: rgba(0, 0, 0, 0.4); pointer-events: none;
  opacity: 0; transition: opacity 500ms ease; backdrop-filter: blur(3px);
}
.sphere-root[data-enlarging='true'] .viewer .scrim { opacity: 1; pointer-events: all; }
.viewer .enlarge {
  position: absolute; z-index: 30; border-radius: var(--enlarge-radius, 32px); overflow: hidden;
  transition: transform 500ms ease, opacity 500ms ease; transform-origin: top left;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}
.viewer .enlarge img { width: 100%; height: 100%; object-fit: cover; filter: var(--image-filter, none); }
.sphere-root .enlarge-closing img { filter: var(--image-filter, none); }
.edge-fade {
  position: absolute; left: 0; right: 0; height: 120px; z-index: 5; pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--overlay-blur-color, #120F17));
}
.edge-fade--top { top: 0; transform: rotate(180deg); }
.edge-fade--bottom { bottom: 0; }
`

const DEFAULTS = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
}

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)
const normalizeAngle = d => ((d % 360) + 360) % 360
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360
  return a - 180
}
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`)
  const n = attr == null ? NaN : parseFloat(attr)
  return Number.isFinite(n) ? n : fallback
}

function buildItems(pool, seg) {
  const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2)
  const evenYs = [-4, -2, 0, 2, 4]
  const oddYs = [-3, -1, 1, 3, 5]

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }))
  })

  const totalSlots = coords.length
  if (pool.length === 0) {
    return coords.map(c => ({ ...c, src: '', alt: '' }))
  }

  const normalizedImages = pool.map(image => {
    if (typeof image === 'string') {
      return { src: image, alt: '' }
    }
    return { src: image.src || '', alt: image.alt || '' }
  })

  const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length])

  for (let i = 1; i < usedImages.length; i++) {
    if (usedImages[i].src === usedImages[i - 1].src) {
      for (let j = i + 1; j < usedImages.length; j++) {
        if (usedImages[j].src !== usedImages[i].src) {
          const tmp = usedImages[i]
          usedImages[i] = usedImages[j]
          usedImages[j] = tmp
          break
        }
      }
    }
  }

  return coords.map((c, i) => ({
    ...c,
    src: usedImages[i].src,
    alt: usedImages[i].alt,
  }))
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
  const unit = 360 / segments / 2
  const rotateY = unit * (offsetX + (sizeX - 1) / 2)
  const rotateX = unit * (offsetY - (sizeY - 1) / 2)
  return { rotateX, rotateY }
}

function DomeGallery({
  images = [],
  fit = 0.5,
  fitBasis = 'auto',
  minRadius = 600,
  maxRadius = Infinity,
  padFactor = 0.25,
  overlayBlurColor = '#120F17',
  maxVerticalRotationDeg = DEFAULTS.maxVerticalRotationDeg,
  dragSensitivity = DEFAULTS.dragSensitivity,
  enlargeTransitionMs = DEFAULTS.enlargeTransitionMs,
  segments = DEFAULTS.segments,
  dragDampening = 2,
  openedImageWidth = '400px',
  openedImageHeight = '400px',
  imageBorderRadius = '30px',
  openedImageBorderRadius = '30px',
  grayscale = true,
}) {
  const rootRef = useRef(null)
  const mainRef = useRef(null)
  const sphereRef = useRef(null)
  const frameRef = useRef(null)
  const viewerRef = useRef(null)
  const scrimRef = useRef(null)
  const focusedElRef = useRef(null)
  const originalTilePositionRef = useRef(null)

  const rotationRef = useRef({ x: 0, y: 0 })
  const startRotRef = useRef({ x: 0, y: 0 })
  const startPosRef = useRef(null)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const inertiaRAF = useRef(null)
  const openingRef = useRef(false)
  const openStartedAtRef = useRef(0)
  const lastDragEndAt = useRef(0)

  const scrollLockedRef = useRef(false)
  const lockScroll = useCallback(() => {
    if (scrollLockedRef.current) return
    scrollLockedRef.current = true
    document.body.classList.add('dg-scroll-lock')
  }, [])
  const unlockScroll = useCallback(() => {
    if (!scrollLockedRef.current) return
    if (rootRef.current?.getAttribute('data-enlarging') === 'true') return
    scrollLockedRef.current = false
    document.body.classList.remove('dg-scroll-lock')
  }, [])

  const items = useMemo(() => buildItems(images, segments), [images, segments])

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current
    if (el) {
      el.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`
    }
  }

  const lockedRadiusRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect
      const w = Math.max(1, cr.width),
        h = Math.max(1, cr.height)
      const minDim = Math.min(w, h),
        maxDim = Math.max(w, h),
        aspect = w / h
      let basis
      switch (fitBasis) {
        case 'min':
          basis = minDim
          break
        case 'max':
          basis = maxDim
          break
        case 'width':
          basis = w
          break
        case 'height':
          basis = h
          break
        default:
          basis = aspect >= 1.3 ? w : minDim
      }
      let radius = basis * fit
      const heightGuard = h * 1.35
      radius = Math.min(radius, heightGuard)
      radius = clamp(radius, minRadius, maxRadius)
      lockedRadiusRef.current = Math.round(radius)

      const viewerPad = Math.max(8, Math.round(minDim * padFactor))
      root.style.setProperty('--radius', `${lockedRadiusRef.current}px`)
      root.style.setProperty('--viewer-pad', `${viewerPad}px`)
      root.style.setProperty('--overlay-blur-color', overlayBlurColor)
      root.style.setProperty('--tile-radius', imageBorderRadius)
      root.style.setProperty('--enlarge-radius', openedImageBorderRadius)
      root.style.setProperty('--image-filter', grayscale ? 'grayscale(1)' : 'none')
      applyTransform(rotationRef.current.x, rotationRef.current.y)

      const enlargedOverlay = viewerRef.current?.querySelector('.enlarge')
      if (enlargedOverlay && frameRef.current && mainRef.current) {
        const frameR = frameRef.current.getBoundingClientRect()
        const mainR = mainRef.current.getBoundingClientRect()

        const hasCustomSize = openedImageWidth && openedImageHeight
        if (hasCustomSize) {
          const tempDiv = document.createElement('div')
          tempDiv.style.cssText = `position: absolute; width: ${openedImageWidth}; height: ${openedImageHeight}; visibility: hidden;`
          document.body.appendChild(tempDiv)
          const tempRect = tempDiv.getBoundingClientRect()
          document.body.removeChild(tempDiv)

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2

          enlargedOverlay.style.left = `${centeredLeft}px`
          enlargedOverlay.style.top = `${centeredTop}px`
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`
          enlargedOverlay.style.width = `${frameR.width}px`
          enlargedOverlay.style.height = `${frameR.height}px`
        }
      }
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [
    fit,
    fitBasis,
    minRadius,
    maxRadius,
    padFactor,
    overlayBlurColor,
    grayscale,
    imageBorderRadius,
    openedImageBorderRadius,
    openedImageWidth,
    openedImageHeight,
  ])

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y)
  }, [])

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current)
      inertiaRAF.current = null
    }
  }, [])

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4
      let vX = clamp(vx, -MAX_V, MAX_V) * 80
      let vY = clamp(vy, -MAX_V, MAX_V) * 80
      let frames = 0
      const d = clamp(dragDampening ?? 0.6, 0, 1)
      const frictionMul = 0.94 + 0.055 * d
      const stopThreshold = 0.015 - 0.01 * d
      const maxFrames = Math.round(90 + 270 * d)
      const step = () => {
        vX *= frictionMul
        vY *= frictionMul
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null
          return
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null
          return
        }
        const nextX = clamp(rotationRef.current.x - vY / 200, -maxVerticalRotationDeg, maxVerticalRotationDeg)
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200)
        rotationRef.current = { x: nextX, y: nextY }
        applyTransform(nextX, nextY)
        inertiaRAF.current = requestAnimationFrame(step)
      }
      stopInertia()
      inertiaRAF.current = requestAnimationFrame(step)
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  )

  useGesture(
    {
      onDragStart: ({ event }) => {
        if (focusedElRef.current) return
        stopInertia()
        const evt = event
        draggingRef.current = true
        movedRef.current = false
        startRotRef.current = { ...rotationRef.current }
        startPosRef.current = { x: evt.clientX, y: evt.clientY }
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (focusedElRef.current || !draggingRef.current || !startPosRef.current) return
        const evt = event
        const dxTotal = evt.clientX - startPosRef.current.x
        const dyTotal = evt.clientY - startPosRef.current.y
        if (!movedRef.current) {
          const dist2 = dxTotal * dxTotal + dyTotal * dyTotal
          if (dist2 > 16) movedRef.current = true
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        )
        const nextY = wrapAngleSigned(startRotRef.current.y + dxTotal / dragSensitivity)
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY }
          applyTransform(nextX, nextY)
        }
        if (last) {
          draggingRef.current = false
          let [vMagX, vMagY] = velocity
          const [dirX, dirY] = direction
          let vx = vMagX * dirX
          let vy = vMagY * dirY
          if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001 && Array.isArray(movement)) {
            const [mx, my] = movement
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2)
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2)
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) startInertia(vx, vy)
          if (movedRef.current) lastDragEndAt.current = performance.now()
          movedRef.current = false
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  )

  useEffect(() => {
    const scrim = scrimRef.current
    if (!scrim) return
    const close = () => {
      if (performance.now() - openStartedAtRef.current < 250) return
      const el = focusedElRef.current
      if (!el) return
      const parent = el.parentElement
      const overlay = viewerRef.current?.querySelector('.enlarge')
      if (!overlay) return
      const refDiv = parent.querySelector('.item__image--reference')
      const originalPos = originalTilePositionRef.current
      if (!originalPos) {
        overlay.remove()
        if (refDiv) refDiv.remove()
        parent.style.setProperty('--rot-y-delta', '0deg')
        parent.style.setProperty('--rot-x-delta', '0deg')
        el.style.visibility = ''
        el.style.zIndex = 0
        focusedElRef.current = null
        rootRef.current?.removeAttribute('data-enlarging')
        openingRef.current = false
        unlockScroll()
        return
      }
      const currentRect = overlay.getBoundingClientRect()
      const rootRect = rootRef.current.getBoundingClientRect()
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height,
      }
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height,
      }
      const animatingOverlay = document.createElement('div')
      animatingOverlay.className = 'enlarge-closing'
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`
      const originalImg = overlay.querySelector('img')
      if (originalImg) {
        const img = originalImg.cloneNode()
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;'
        animatingOverlay.appendChild(img)
      }
      overlay.remove()
      rootRef.current.appendChild(animatingOverlay)
      void animatingOverlay.getBoundingClientRect()
      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px'
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px'
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px'
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px'
        animatingOverlay.style.opacity = '0'
      })
      const cleanup = () => {
        animatingOverlay.remove()
        originalTilePositionRef.current = null
        if (refDiv) refDiv.remove()
        parent.style.transition = 'none'
        el.style.transition = 'none'
        parent.style.setProperty('--rot-y-delta', '0deg')
        parent.style.setProperty('--rot-x-delta', '0deg')
        requestAnimationFrame(() => {
          el.style.visibility = ''
          el.style.opacity = '0'
          el.style.zIndex = 0
          focusedElRef.current = null
          rootRef.current?.removeAttribute('data-enlarging')
          requestAnimationFrame(() => {
            parent.style.transition = ''
            el.style.transition = 'opacity 300ms ease-out'
            requestAnimationFrame(() => {
              el.style.opacity = '1'
              setTimeout(() => {
                el.style.transition = ''
                el.style.opacity = ''
                openingRef.current = false
                if (!draggingRef.current && rootRef.current?.getAttribute('data-enlarging') !== 'true')
                  document.body.classList.remove('dg-scroll-lock')
              }, 300)
            })
          })
        })
      }
      animatingOverlay.addEventListener('transitionend', cleanup, { once: true })
    }
    scrim.addEventListener('click', close)
    const onKey = e => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      scrim.removeEventListener('click', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [enlargeTransitionMs, unlockScroll])

  const openItemFromElement = useCallback(
    el => {
      if (openingRef.current) return
      openingRef.current = true
      openStartedAtRef.current = performance.now()
      lockScroll()
      const parent = el.parentElement
      focusedElRef.current = el
      el.setAttribute('data-focused', 'true')
      const offsetX = getDataNumber(parent, 'offsetX', 0)
      const offsetY = getDataNumber(parent, 'offsetY', 0)
      const sizeX = getDataNumber(parent, 'sizeX', 2)
      const sizeY = getDataNumber(parent, 'sizeY', 2)
      const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments)
      const parentY = normalizeAngle(parentRot.rotateY)
      const globalY = normalizeAngle(rotationRef.current.y)
      let rotY = -(parentY + globalY) % 360
      if (rotY < -180) rotY += 360
      const rotX = -parentRot.rotateX - rotationRef.current.x
      parent.style.setProperty('--rot-y-delta', `${rotY}deg`)
      parent.style.setProperty('--rot-x-delta', `${rotX}deg`)
      const refDiv = document.createElement('div')
      refDiv.className = 'item__image item__image--reference'
      refDiv.style.opacity = '0'
      refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`
      parent.appendChild(refDiv)

      void refDiv.offsetHeight

      const tileR = refDiv.getBoundingClientRect()
      const mainR = mainRef.current?.getBoundingClientRect()
      const frameR = frameRef.current?.getBoundingClientRect()

      if (!mainR || !frameR || tileR.width <= 0 || tileR.height <= 0) {
        openingRef.current = false
        focusedElRef.current = null
        parent.removeChild(refDiv)
        unlockScroll()
        return
      }

      originalTilePositionRef.current = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height }
      el.style.visibility = 'hidden'
      el.style.zIndex = 0
      const overlay = document.createElement('div')
      overlay.className = 'enlarge'
      overlay.style.position = 'absolute'
      overlay.style.left = frameR.left - mainR.left + 'px'
      overlay.style.top = frameR.top - mainR.top + 'px'
      overlay.style.width = frameR.width + 'px'
      overlay.style.height = frameR.height + 'px'
      overlay.style.opacity = '0'
      overlay.style.zIndex = '30'
      overlay.style.willChange = 'transform, opacity'
      overlay.style.transformOrigin = 'top left'
      overlay.style.transition = `transform ${enlargeTransitionMs}ms ease, opacity ${enlargeTransitionMs}ms ease`
      const rawSrc = parent.dataset.src || el.querySelector('img')?.src || ''
      const img = document.createElement('img')
      img.src = rawSrc
      overlay.appendChild(img)
      viewerRef.current.appendChild(overlay)
      const tx0 = tileR.left - frameR.left
      const ty0 = tileR.top - frameR.top
      const sx0 = tileR.width / frameR.width
      const sy0 = tileR.height / frameR.height

      const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1
      const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1

      overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`

      setTimeout(() => {
        if (!overlay.parentElement) return
        overlay.style.opacity = '1'
        overlay.style.transform = 'translate(0px, 0px) scale(1, 1)'
        rootRef.current?.setAttribute('data-enlarging', 'true')
      }, 16)

      const wantsResize = openedImageWidth || openedImageHeight
      if (wantsResize) {
        const onFirstEnd = ev => {
          if (ev.propertyName !== 'transform') return
          overlay.removeEventListener('transitionend', onFirstEnd)
          const prevTransition = overlay.style.transition
          overlay.style.transition = 'none'
          const tempWidth = openedImageWidth || `${frameR.width}px`
          const tempHeight = openedImageHeight || `${frameR.height}px`
          overlay.style.width = tempWidth
          overlay.style.height = tempHeight
          const newRect = overlay.getBoundingClientRect()
          overlay.style.width = frameR.width + 'px'
          overlay.style.height = frameR.height + 'px'
          void overlay.offsetWidth
          overlay.style.transition = `left ${enlargeTransitionMs}ms ease, top ${enlargeTransitionMs}ms ease, width ${enlargeTransitionMs}ms ease, height ${enlargeTransitionMs}ms ease`
          const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2
          const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2
          requestAnimationFrame(() => {
            overlay.style.left = `${centeredLeft}px`
            overlay.style.top = `${centeredTop}px`
            overlay.style.width = tempWidth
            overlay.style.height = tempHeight
          })
          const cleanupSecond = () => {
            overlay.removeEventListener('transitionend', cleanupSecond)
            overlay.style.transition = prevTransition
          }
          overlay.addEventListener('transitionend', cleanupSecond, { once: true })
        }
        overlay.addEventListener('transitionend', onFirstEnd)
      }
    },
    [enlargeTransitionMs, lockScroll, openedImageHeight, openedImageWidth, segments, unlockScroll]
  )

  const onTileClick = useCallback(
    e => {
      if (draggingRef.current) return
      if (movedRef.current) return
      if (performance.now() - lastDragEndAt.current < 80) return
      if (openingRef.current) return
      openItemFromElement(e.currentTarget)
    },
    [openItemFromElement]
  )

  const onTilePointerUp = useCallback(
    e => {
      if (e.pointerType !== 'touch') return
      if (draggingRef.current) return
      if (movedRef.current) return
      if (performance.now() - lastDragEndAt.current < 80) return
      if (openingRef.current) return
      openItemFromElement(e.currentTarget)
    },
    [openItemFromElement]
  )

  useEffect(() => {
    return () => {
      document.body.classList.remove('dg-scroll-lock')
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="sphere-root"
      style={{
        ['--segments-x']: segments,
        ['--segments-y']: segments,
        ['--overlay-blur-color']: overlayBlurColor,
        ['--tile-radius']: imageBorderRadius,
        ['--enlarge-radius']: openedImageBorderRadius,
        ['--image-filter']: grayscale ? 'grayscale(1)' : 'none',
      }}
    >
      <main ref={mainRef} className="sphere-main">
        <div className="stage">
          <div ref={sphereRef} className="sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="item"
                data-src={it.src}
                data-offset-x={it.x}
                data-offset-y={it.y}
                data-size-x={it.sizeX}
                data-size-y={it.sizeY}
                style={{
                  ['--offset-x']: it.x,
                  ['--offset-y']: it.y,
                  ['--item-size-x']: it.sizeX,
                  ['--item-size-y']: it.sizeY,
                }}
              >
                <div
                  className="item__image"
                  role="button"
                  tabIndex={0}
                  aria-label={it.alt || 'Open image'}
                  onClick={onTileClick}
                  onPointerUp={onTilePointerUp}
                >
                  <img src={it.src} draggable={false} alt={it.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="overlay" />
        <div className="overlay overlay--blur" />
        <div className="edge-fade edge-fade--top" />
        <div className="edge-fade edge-fade--bottom" />

        <div className="viewer" ref={viewerRef}>
          <div ref={scrimRef} className="scrim" />
          <div ref={frameRef} className="frame" />
        </div>
      </main>
    </div>
  )
}

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
  return (
    <section className="rr-section">
      <Reveal>
        <h2 className="rr-h2">Our work</h2>
      </Reveal>
      <motion.div
        className="rr-dome"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <DomeGallery
          images={galleryImages}
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          overlayBlurColor="#0a0a12"
          grayscale={false}
        />
      </motion.div>
      <p className="rr-hint">Drag to explore, tap a photo to enlarge</p>
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
      <style>{STYLES + DOME_STYLES}</style>
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