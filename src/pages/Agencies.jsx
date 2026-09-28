import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useGesture } from '@use-gesture/react'

const GOLD = '#E0A93B'
const BLUE = '#3D6BFF'
const GOLD_LIGHT = '#F0C15A'
const GALLERY_BACKGROUND = '#0a0a12'

const galleryImages = [
  { src: '/gallery/gallery1.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery2.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery3.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery4.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery5.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery6.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery7.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery8.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery9.png', alt: 'R&R Agencies work' },
  { src: '/gallery/gallery10.png', alt: 'R&R Agencies work' },
]

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('SBDC Building, 2 Columbus Rd, Verulam, KwaZulu-Natal, South Africa')

const process = [
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
    features: [
      'Full-color high-resolution printing',
      'Excellent wash durability',
      'Works on various fabric types',
      'Quick production times',
    ],
    typesLabel: 'Applications',
    types: ['Photo-realistic graphics', 'Gradient and complex designs', 'Promotional t-shirts', 'Event merchandise', 'Fashion and streetwear'],
  },
  {
    id: 'vinyl',
    name: 'Vinyl Solutions',
    tagline: 'Precision vinyl cutting and heat transfer applications',
    color: GOLD_LIGHT,
    features: [
      'Heat transfer vinyl (HTV)',
      'Multiple finish options (matte, gloss, metallic)',
      'Custom cutting and weeding',
      'Professional application services',
    ],
    typesLabel: 'Best For',
    types: ['Number and name personalization', 'Logo placement and branding', 'Single-color designs', 'Text-based graphics', 'Simple shape cutouts', 'Heat-sealed patches'],
  },
]

const PAGE_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap');

.agencies-page {
  overflow-x: clip;
  max-width: 100%;
}

.agencies-page .astorra-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background: ${GALLERY_BACKGROUND};
}

.agencies-hero-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.agencies-hero-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 70% 62% at 50% 48%, rgba(10, 10, 18, 0.88), rgba(10, 10, 18, 0.55) 55%, transparent 85%),
    linear-gradient(to bottom, transparent 55%, ${GALLERY_BACKGROUND} 100%);
}

.agencies-page .agencies-title {
  font-family: 'Pinyon Script', 'Snell Roundhand', 'Apple Chancery', cursive;
  font-weight: 400;
  font-size: clamp(3.6rem, 11vw, 8.5rem);
  line-height: 1.1;
  letter-spacing: 0.01em;
  background: linear-gradient(100deg, #b8801f 0%, #f5d98a 45%, ${GOLD} 60%, #b8801f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  -webkit-text-stroke: 2px #d9a238;
  filter: drop-shadow(0 3px 22px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 3px rgba(0, 0, 0, 0.8));
}

.agencies-page .astorra-slogan {
  color: #a9bcff;
  font-size: clamp(1.15rem, 2.4vw, 1.7rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.95), 0 0 3px rgba(0, 0, 0, 0.9);
}

.agencies-page .astorra-lede {
  color: #ffffff;
  font-size: clamp(1.1rem, 2vw, 1.45rem);
  font-weight: 600;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.95), 0 0 3px rgba(0, 0, 0, 0.9);
}

.agencies-page .back-link {
  font-weight: 600;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
}

.agencies-page .scroll-hint {
  color: ${GOLD_LIGHT};
  font-weight: 700;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.95);
}

.agencies-page .how-step-number {
  color: ${GOLD};
}

.agencies-page .why-us .module-row h3 {
  color: ${GOLD_LIGHT};
}

.agencies-page .contact-item strong {
  color: ${GOLD};
}

.agencies-gallery {
  position: relative;
  width: 100%;
  max-width: 1200px;
  height: min(78vh, 820px);
  min-height: 480px;
  margin: 2rem auto 0;
  border-radius: 28px;
  overflow: hidden;
  contain: paint;
  isolation: isolate;
  border: 1px solid rgba(224, 169, 59, 0.3);
  box-shadow: 0 0 90px rgba(61, 107, 255, 0.14);
}

.agencies-gallery .sphere-root {
  overflow: hidden;
}

.agencies-gallery-note {
  text-align: center;
  opacity: 0.6;
  margin: 1rem auto 0;
  font-size: 0.95rem;
}

body.dg-scroll-lock {
  overflow: hidden;
}

.shape-waves {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.shape-waves__canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.shape-waves[data-ready='true'] .shape-waves__canvas {
  opacity: 1;
}
`

const EXPERIENCE_STYLES = `
.stitch-rail {
  position: fixed;
  left: 14px;
  top: 12vh;
  bottom: 12vh;
  width: 24px;
  z-index: 40;
  pointer-events: none;
}
.stitch-rail svg { position: absolute; inset: 0; height: 100%; overflow: visible; }
.stitch-track { stroke: rgba(224, 169, 59, 0.16); stroke-width: 2; stroke-dasharray: 9 7; stroke-linecap: round; }
.stitch-live {
  stroke: #F0C15A;
  stroke-width: 2.5;
  stroke-dasharray: 9 7;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px rgba(240, 193, 90, 0.7));
}
.stitch-needle {
  position: absolute;
  left: 50%;
  width: 9px;
  height: 9px;
  margin: -4px 0 0 -4.5px;
  border-radius: 50%;
  background: #fff6d8;
  box-shadow: 0 0 0 4px rgba(240, 193, 90, 0.25), 0 0 18px 4px rgba(240, 193, 90, 0.8);
}
@media (max-width: 900px) { .stitch-rail { display: none; } }

.agencies-page .agencies-title {
  background-size: 220% 100%;
  animation: title-sheen 7s ease-in-out infinite;
}
@keyframes title-sheen {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.agencies-page .astorra-section h2,
.agencies-page .agencies-service h2 {
  position: relative;
  padding-bottom: 0.9rem;
}
.agencies-page .astorra-section h2::after,
.agencies-page .agencies-service h2::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: min(220px, 40%);
  height: 2px;
  background: repeating-linear-gradient(90deg, var(--accent, #E0A93B) 0 10px, transparent 10px 17px);
  opacity: 0.85;
}
.agencies-page .astorra-section > h2:only-child::after { left: 50%; transform: translateX(-50%); }

.agencies-page .agencies-service,
.agencies-page .why-us .module-row,
.agencies-page .contact-item {
  position: relative;
  isolation: isolate;
  transition: transform 350ms cubic-bezier(0.22, 1, 0.36, 1), border-color 350ms ease;
}
.agencies-page .agencies-service::before,
.agencies-page .why-us .module-row::before,
.agencies-page .contact-item::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 350ms ease;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--accent, #E0A93B) 16%, transparent), transparent 65%);
}
.agencies-page .agencies-service:hover::before,
.agencies-page .why-us .module-row:hover::before,
.agencies-page .contact-item:hover::before { opacity: 1; }

.agencies-page .why-us .module-row,
.agencies-page .contact-item {
  border: 1px dashed rgba(224, 169, 59, 0.28);
  border-radius: 18px;
}
.agencies-page .why-us .module-row:hover,
.agencies-page .contact-item:hover {
  border-color: rgba(240, 193, 90, 0.75);
  transform: translateY(-4px);
}

.agencies-page .agencies-service {
  border-radius: 24px;
  background-image: repeating-linear-gradient(180deg, var(--accent) 0 12px, transparent 12px 20px);
  background-size: 2px 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
}
.agencies-page .service-list li {
  transition: transform 250ms ease, color 250ms ease;
}
.agencies-page .service-list li:hover { transform: translateX(6px); color: var(--accent); }

.agencies-page .how-step-number { text-shadow: 0 0 40px rgba(224, 169, 59, 0.55); }

.agencies-page a:focus-visible { outline: 2px solid #F0C15A; outline-offset: 4px; border-radius: 6px; }
@media (prefers-reduced-motion: reduce) {
  .agencies-page .agencies-title { animation: none; }
  .agencies-page * { transition-duration: 0.01ms !important; }
}
`

const DOME_STYLES = `
.sphere-root {
  position: relative;
  width: 100%;
  height: 100%;
  --radius: 520px;
  --viewer-pad: 72px;
  --circ: calc(var(--radius) * 3.14);
  --rot-y: calc((360deg / var(--segments-x)) / 2);
  --rot-x: calc((360deg / var(--segments-y)) / 2);
  --item-width: calc(var(--circ) / var(--segments-x));
  --item-height: calc(var(--circ) / var(--segments-y));
}

.sphere-root * {
  box-sizing: border-box;
}

.sphere,
.item,
.item__image {
  transform-style: preserve-3d;
}

main.sphere-main {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  background: var(--overlay-blur-color, #120f17);
}

.stage {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  perspective: calc(var(--radius) * 2);
  perspective-origin: 50% 50%;
  contain: layout paint size;
}

.sphere {
  transform: translateZ(calc(var(--radius) * -1));
  will-change: transform;
}

.overlay,
.overlay--blur {
  position: absolute;
  inset: 0;
  margin: auto;
  z-index: 3;
  pointer-events: none;
}

.overlay {
  background-image: radial-gradient(rgba(235, 235, 235, 0) 65%, var(--overlay-blur-color, #120F17) 100%);
}

.overlay--blur {
  -webkit-mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%);
  mask-image: radial-gradient(rgba(235, 235, 235, 0) 70%, var(--overlay-blur-color, #120F17) 90%);
  backdrop-filter: blur(3px);
}

.item {
  width: calc(var(--item-width) * var(--item-size-x));
  height: calc(var(--item-height) * var(--item-size-y));
  position: absolute;
  top: -999px;
  bottom: -999px;
  left: -999px;
  right: -999px;
  margin: auto;
  transform-origin: 50% 50%;
  backface-visibility: hidden;
  transition: transform 300ms;
  transform: rotateY(calc(var(--rot-y) * (var(--offset-x) + ((var(--item-size-x) - 1) / 2)) + var(--rot-y-delta, 0deg)))
    rotateX(calc(var(--rot-x) * (var(--offset-y) - ((var(--item-size-y) - 1) / 2)) + var(--rot-x-delta, 0deg)))
    translateZ(var(--radius));
}

.item__image {
  position: absolute;
  display: block;
  inset: 10px;
  border-radius: var(--tile-radius, 12px);
  background: var(--overlay-blur-color, #120f17);
  overflow: hidden;
  backface-visibility: hidden;
  transition: transform 300ms;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}

.item__image:focus {
  outline: none;
}

.item__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  backface-visibility: hidden;
  filter: var(--image-filter, none);
}

.viewer {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--viewer-pad);
}

.viewer .frame {
  height: 100%;
  aspect-ratio: 1;
  border-radius: var(--enlarge-radius, 32px);
  display: flex;
}

@media (max-aspect-ratio: 1/1) {
  .viewer .frame {
    height: auto;
    width: 100%;
  }
}

.viewer .scrim {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: none;
  opacity: 0;
  transition: opacity 500ms ease;
  backdrop-filter: blur(3px);
}

.sphere-root[data-enlarging='true'] .viewer .scrim {
  opacity: 1;
  pointer-events: all;
}

.viewer .enlarge {
  position: absolute;
  z-index: 30;
  border-radius: var(--enlarge-radius, 32px);
  overflow: hidden;
  transition:
    transform 500ms ease,
    opacity 500ms ease;
  transform-origin: top left;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.viewer .enlarge img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: var(--image-filter, none);
}

.sphere-root .enlarge-closing img {
  filter: var(--image-filter, none);
}

.edge-fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 5;
  pointer-events: none;
  background: linear-gradient(to bottom, transparent, var(--overlay-blur-color, #120F17));
}

.edge-fade--top {
  top: 0;
  transform: rotate(180deg);
}

.edge-fade--bottom {
  bottom: 0;
}
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

const SHAPE_MODES = { mixed: 0, squares: 1, circles: 2, triangles: 3 }
const MAX_DPR = 2
const NOISE_CELLS = 32
const TIME_RATE = 0.1
const SIMULATION_STEP = 1 / 60
const WAVE_SPEED = 0.42
const WAVE_FRICTION = 0.94
const WAVE_DECAY = 0.972
const SETTLED_THRESHOLD = 0.01
const INTRO_BAND = 0.2
const INTRO_WARP = 0.3
const INTRO_JITTER = 0.16
const INTRO_END = 1 + INTRO_WARP + INTRO_JITTER + INTRO_BAND

const WAVES_VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const WAVES_FRAGMENT = `
precision highp float;

uniform vec2 uRes;
uniform vec2 uOrigin;
uniform vec2 uGrid;
uniform vec2 uDrift;
uniform float uCell;
uniform float uDot;
uniform float uMode;
uniform float uTime;
uniform float uNoiseScale;
uniform float uBright;
uniform float uContrast;
uniform float uFade;
uniform float uIntro;
uniform vec3 uColor;
uniform vec3 uHover;
uniform vec3 uBg;
uniform sampler2D uCharges;

const vec2 SEED = vec2(12.9898, 78.233);

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fadeCurve(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 f = fadeCurve(Pf0);
  vec4 nz = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), f.z);
  vec2 ny = mix(nz.xy, nz.zw, f.y);
  return 2.2 * mix(ny.x, ny.y, f.x);
}

float fbm(vec3 p) {
  float total = 0.0;
  float amplitude = 1.0;
  float weight = 0.0;
  float frequency = 1.0;
  for (int i = 0; i < 2; i++) {
    total += amplitude * cnoise(p * frequency);
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return total / weight;
}

float sdTriangle(vec2 point, vec2 q) {
  vec2 p = vec2(abs(point.x), point.y);
  vec2 a = p - q * clamp(dot(p, q) / dot(q, q), 0.0, 1.0);
  vec2 b = p - q * vec2(clamp(p.x / q.x, 0.0, 1.0), 1.0);
  float s = -sign(q.y);
  vec2 d = min(vec2(dot(a, a), s * (p.x * q.y - p.y * q.x)), vec2(dot(b, b), s * (p.y - q.y)));
  return -sqrt(d.x) * sign(d.y);
}

float shapeDistance(vec2 p, float shape, float c) {
  if (shape < 0.5) return max(abs(p.x), abs(p.y)) - c;
  if (shape < 1.5) return length(p) - c;
  return sdTriangle(vec2(p.x, p.y + c), vec2(c, 2.0 * c));
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 pixel = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 uv = pixel / uRes;
  vec2 cell = floor((pixel - uOrigin) / uCell);

  if (cell.y < 0.0 || cell.y >= uGrid.y || cell.x < 0.0 || cell.x >= uGrid.x) {
    gl_FragColor = vec4(uBg, 1.0);
    return;
  }

  vec2 center = uOrigin + (cell + 0.5) * uCell;
  vec2 local = (pixel - center) / (uCell * 0.5);
  vec2 cellUv = center / uRes;

  float level = 1.0;
  if (uFade > 0.0) {
    vec2 q = abs(uv * 2.0 - 1.0);
    float radius = pow(pow(q.x, 2.5) + pow(q.y, 2.5), 1.0 / 2.5) / pow(2.0, 1.0 / 2.5);
    level = 1.0 - smoothstep(max(0.0, 1.0 - uFade * 2.2), 1.0, radius);
  }

  float noise = fbm(vec3((center + uDrift) / uNoiseScale + SEED, uTime));
  float tone = clamp((noise * 0.5 + 0.5 - uBright) * uContrast + 0.5, 0.0, 1.0);
  float band = floor(min(tone, 0.999999) * 3.0);

  float charge = texture2D(uCharges, (cell + 0.5) / uGrid).r;
  float stepped = mod(band + floor(clamp(charge, 0.0, 0.999) * 3.0), 3.0);

  float shape = 2.0 - stepped;
  float size = uDot;
  if (uMode > 0.5) {
    shape = uMode - 1.0;
    size = uDot * mix(0.45, 1.0, stepped / 2.0);
  }

  float front = 0.0;
  if (uIntro < ${INTRO_END.toFixed(2)}) {
    float radial = length((center - uRes * 0.5) / (uRes * 0.5)) * 0.70710678;
    float warp = cnoise(vec3(cellUv * vec2(3.2, 2.4) + SEED, 4.7)) * ${INTRO_WARP.toFixed(2)};
    float jitter = hash21(cell) * ${INTRO_JITTER.toFixed(2)};
    float spread = radial + warp + jitter + ${INTRO_WARP.toFixed(2)};
    float ib = ${INTRO_BAND.toFixed(2)} * (0.6 + 0.8 * hash21(cell + vec2(17.0, 9.0)));
    float t = clamp((uIntro - spread) / ib, 0.0, 1.0);
    if (t <= 0.0) {
      gl_FragColor = vec4(uBg, 1.0);
      return;
    }
    float back = t - 1.0;
    size = max(size * (1.0 + 2.70158 * back * back * back + 1.70158 * back * back), 0.02);
    front = 1.0 - smoothstep(0.0, 1.0, abs(uIntro - spread) / ib);
  }

  float aa = 2.0 / uCell;
  float coverage = smoothstep(aa, -aa, shapeDistance(local, shape, size));
  vec3 tint = mix(uColor, uHover, max(smoothstep(0.15, 0.85, charge), front * 0.35));
  gl_FragColor = vec4(mix(uBg, tint, coverage * level), 1.0);
}
`

const parseColor = (value, fallback) => {
  const source = typeof value === 'string' ? value.trim() : ''
  const match = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(source) || /^#?([\da-f]{6})$/i.exec(fallback)
  let hex = match[1]
  if (hex.length === 3) hex = hex.replace(/./g, char => char + char)
  return [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
}

function ShapeWaves({
  shapes = 'mixed',
  cellSize = 10,
  dotSize = 0.75,
  color = '#929292',
  hoverColor = '#ffffff',
  backgroundColor = '#000000',
  speed = 1,
  scale = 1,
  contrast = 1,
  brightness = 0.4,
  fade = 0.25,
  interactive = true,
  splashRadius = 40,
  splashStrength = 0.4,
  intro = true,
  introDuration = 1.6,
}) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)
  const settingsRef = useRef(null)

  settingsRef.current = {
    shapes,
    cellSize: Math.max(2, cellSize),
    dotSize: Math.min(1, Math.max(0.1, dotSize)),
    color,
    hoverColor,
    backgroundColor,
    speed,
    scale: Math.max(0.05, scale),
    contrast,
    brightness,
    fade,
    interactive,
    splashRadius,
    splashStrength,
    intro,
    introDuration: Math.max(0.1, introDuration),
  }

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return undefined

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      console.error('ShapeWaves: WebGL is not available')
      return undefined
    }

    const compile = (type, source) => {
      const shader = gl.createShader(type)
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('ShapeWaves shader error:', gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, WAVES_VERTEX)
    const fs = compile(gl.FRAGMENT_SHADER, WAVES_FRAGMENT)
    if (!vs || !fs) return undefined

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('ShapeWaves link error:', gl.getProgramInfoLog(program))
      return undefined
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const positionLocation = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const loc = {}
    ;[
      'uRes', 'uOrigin', 'uGrid', 'uDrift', 'uCell', 'uDot', 'uMode', 'uTime', 'uNoiseScale',
      'uBright', 'uContrast', 'uFade', 'uIntro', 'uColor', 'uHover', 'uBg', 'uCharges',
    ].forEach(name => {
      loc[name] = gl.getUniformLocation(program, name)
    })

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.uniform1i(loc.uCharges, 0)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    let disposed = false
    let frameId = 0
    let lastFrameTime = 0
    let time = 0
    let dpr = 1
    let width = 1
    let height = 1
    let visible = true
    let presented = false
    let cols = 1
    let rows = 1
    let cellPx = 10
    let gridOrigin = [0, 0]
    let charges = new Float32Array(1)
    let heights = new Float32Array(1)
    let previousHeights = new Float32Array(1)
    let bytes = new Uint8Array(1)
    let simulationBacklog = 0
    let chargesActive = false
    let textureDirty = true
    let introStart = 0
    let introProgress = INTRO_END
    let introPending = settingsRef.current.intro && !reduceMotion.matches
    const pointer = { x: 0, y: 0, at: 0, inside: false }

    const configureGrid = () => {
      const settings = settingsRef.current
      const nextCols = Math.max(1, Math.round(width / (settings.cellSize * dpr)))
      cellPx = width / nextCols
      const nextRows = Math.max(1, Math.floor(height / cellPx))
      gridOrigin = [0, (height - nextRows * cellPx) / 2]
      if (nextCols === cols && nextRows === rows && charges.length === cols * rows) return
      cols = nextCols
      rows = nextRows
      charges = new Float32Array(cols * rows)
      heights = new Float32Array(cols * rows)
      previousHeights = new Float32Array(cols * rows)
      bytes = new Uint8Array(cols * rows)
      chargesActive = false
      textureDirty = true
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = Math.max(1, Math.round(root.clientWidth * dpr))
      height = Math.max(1, Math.round(root.clientHeight * dpr))
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      configureGrid()
    }

    const splash = (x, y, strength) => {
      const settings = settingsRef.current
      const sigma = Math.max(0.5, ((settings.splashRadius * dpr) / cellPx) * 0.5)
      const reach = Math.ceil(sigma * 2.5)
      const centerCol = (x * dpr - gridOrigin[0]) / cellPx - 0.5
      const centerRow = (y * dpr - gridOrigin[1]) / cellPx - 0.5
      const minRow = Math.max(0, Math.floor(centerRow - reach))
      const maxRow = Math.min(rows - 1, Math.ceil(centerRow + reach))
      const minCol = Math.max(0, Math.floor(centerCol - reach))
      const maxCol = Math.min(cols - 1, Math.ceil(centerCol + reach))
      for (let row = minRow; row <= maxRow; row++) {
        const dy = row - centerRow
        for (let col = minCol; col <= maxCol; col++) {
          const dx = col - centerCol
          const bump = strength * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma))
          const index = row * cols + col
          heights[index] = Math.min(1.2, heights[index] + bump)
        }
      }
      chargesActive = true
    }

    const onPointerMove = event => {
      if (!settingsRef.current.interactive) return
      const bounds = root.getBoundingClientRect()
      const now = performance.now()
      const x = event.clientX - bounds.left
      const y = event.clientY - bounds.top
      const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height
      if (inside) {
        const elapsed = pointer.inside ? Math.max(8, now - pointer.at) : 16
        const travelled = pointer.inside ? Math.hypot(x - pointer.x, y - pointer.y) : 0
        const velocity = (travelled / elapsed) * 1000
        splash(x, y, Math.min(1, 0.22 + velocity * 0.0006) * settingsRef.current.splashStrength)
      }
      pointer.x = x
      pointer.y = y
      pointer.at = now
      pointer.inside = inside
    }

    const stepRipples = () => {
      const lastCol = cols - 1
      const lastRow = rows - 1
      let peak = 0
      for (let row = 0; row < rows; row++) {
        const up = (row === 0 ? row : row - 1) * cols
        const down = (row === lastRow ? row : row + 1) * cols
        const base = row * cols
        for (let col = 0; col < cols; col++) {
          const index = base + col
          const left = base + (col === 0 ? col : col - 1)
          const right = base + (col === lastCol ? col : col + 1)
          const height = heights[index]
          const laplacian = heights[left] + heights[right] + heights[up + col] + heights[down + col] - 4 * height
          const velocity = (height - previousHeights[index]) * WAVE_FRICTION
          const next = (height + velocity + WAVE_SPEED * laplacian) * WAVE_DECAY
          previousHeights[index] = next
          const charge = Math.min(1, Math.max(0, next))
          charges[index] = charge
          if (charge > peak) peak = charge
        }
      }
      const swap = heights
      heights = previousHeights
      previousHeights = swap
      return peak
    }

    const updateCharges = deltaSeconds => {
      if (!chargesActive) return
      simulationBacklog = Math.min(simulationBacklog + deltaSeconds, SIMULATION_STEP * 4)
      let peak = 1
      while (simulationBacklog >= SIMULATION_STEP) {
        simulationBacklog -= SIMULATION_STEP
        peak = stepRipples()
      }
      if (peak < SETTLED_THRESHOLD) {
        heights.fill(0)
        previousHeights.fill(0)
        charges.fill(0)
        chargesActive = false
      }
      textureDirty = true
    }

    const uploadCharges = () => {
      for (let i = 0; i < charges.length; i++) bytes[i] = Math.round(charges[i] * 255)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, cols, rows, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bytes)
      textureDirty = false
    }

    const render = now => {
      frameId = 0
      if (disposed) return
      const settings = settingsRef.current
      const deltaSeconds = lastFrameTime ? Math.min(0.1, (now - lastFrameTime) / 1000) : 0
      lastFrameTime = now
      const animating = !document.hidden && settings.speed > 0 && !reduceMotion.matches
      if (animating) time += deltaSeconds * TIME_RATE * settings.speed

      updateCharges(deltaSeconds)
      if (textureDirty) uploadCharges()

      if (introPending) {
        introPending = false
        introStart = now
        introProgress = 0
      }
      const introPlaying = introProgress < INTRO_END
      if (introPlaying) {
        introProgress = Math.min(INTRO_END, ((now - introStart) / 1000 / settings.introDuration) * INTRO_END)
      }

      const mode = SHAPE_MODES[settings.shapes] ?? 0
      gl.uniform2f(loc.uRes, width, height)
      gl.uniform2f(loc.uOrigin, gridOrigin[0], gridOrigin[1])
      gl.uniform2f(loc.uGrid, cols, rows)
      gl.uniform2f(loc.uDrift, 0, 0)
      gl.uniform1f(loc.uCell, cellPx)
      gl.uniform1f(loc.uDot, settings.dotSize)
      gl.uniform1f(loc.uMode, mode)
      gl.uniform1f(loc.uTime, time)
      gl.uniform1f(loc.uNoiseScale, NOISE_CELLS * cellPx * settings.scale)
      gl.uniform1f(loc.uBright, 0.5 - (settings.brightness - 0.5) * 0.4)
      gl.uniform1f(loc.uContrast, 2.8 * settings.contrast)
      gl.uniform1f(loc.uFade, settings.fade)
      gl.uniform1f(loc.uIntro, introProgress)
      gl.uniform3fv(loc.uColor, parseColor(settings.color, '#929292'))
      gl.uniform3fv(loc.uHover, parseColor(settings.hoverColor, '#ffffff'))
      gl.uniform3fv(loc.uBg, parseColor(settings.backgroundColor, '#000000'))
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      if (!presented) {
        presented = true
        setReady(true)
      }
      if (visible && (animating || chargesActive || introPlaying)) frameId = requestAnimationFrame(render)
      else lastFrameTime = 0
    }

    const wake = () => {
      if (disposed || frameId) return
      frameId = requestAnimationFrame(render)
    }

    const resizeObserver = new ResizeObserver(() => {
      resize()
      wake()
    })
    resizeObserver.observe(root)

    const visibilityObserver = new IntersectionObserver(
      entries => {
        visible = entries.some(entry => entry.isIntersecting)
        if (visible) wake()
      },
      { threshold: 0 }
    )
    visibilityObserver.observe(root)

    const onPointerWake = event => {
      onPointerMove(event)
      if (chargesActive) wake()
    }

    document.addEventListener('visibilitychange', wake)
    window.addEventListener('pointermove', onPointerWake, { passive: true })

    resize()
    wake()

    return () => {
      disposed = true
      if (frameId) cancelAnimationFrame(frameId)
      document.removeEventListener('visibilitychange', wake)
      window.removeEventListener('pointermove', onPointerWake)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return (
    <div ref={rootRef} className="shape-waves" data-ready={ready} style={{ backgroundColor }} aria-hidden="true">
      <canvas ref={canvasRef} className="shape-waves__canvas" />
    </div>
  )
}

function StitchThread() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 })
  const maskHeight = useTransform(p, v => `${v * 100}%`)
  const needleTop = useTransform(p, v => `${v * 100}%`)

  return (
    <div className="stitch-rail" aria-hidden="true">
      <svg width="24" height="100%" preserveAspectRatio="none">
        <defs>
          <mask id="stitch-reveal">
            <motion.rect x="0" y="0" width="24" style={{ height: maskHeight }} fill="#fff" />
          </mask>
        </defs>
        <line x1="12" y1="0" x2="12" y2="100%" className="stitch-track" />
        <line x1="12" y1="0" x2="12" y2="100%" className="stitch-live" mask="url(#stitch-reveal)" />
      </svg>
      <motion.span className="stitch-needle" style={{ top: needleTop }} />
    </div>
  )
}

function useSpotlight(selector = '.agencies-service, .module-row, .contact-item') {
  useEffect(() => {
    const onMove = e => {
      const card = e.target.closest?.(selector)
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [selector])
}

function SectionHeading({ children }) {
  return (
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  )
}

function ProcessStep({ step, index, total, progress }) {
  const segment = 1 / total
  const start = index * segment
  const end = start + segment
  const opacity = useTransform(progress, [start, start + segment * 0.2, end - segment * 0.2, end], [0, 1, 1, 0])
  const y = useTransform(progress, [start, end], [40, -40])

  return (
    <motion.div className="how-step" style={{ opacity, y }}>
      <span className="how-step-number">{step.n}</span>
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
    </motion.div>
  )
}

function ProcessSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="how-it-works" ref={ref}>
      <div className="how-sticky">
        {process.map((step, i) => (
          <ProcessStep key={step.n} step={step} index={i} total={process.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

function ServiceSection({ service, index }) {
  return (
    <section className="agencies-service" style={{ '--accent': service.color }}>
      <motion.div
        className="service-tag"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        Service {index + 1} of 3
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {service.name}
      </motion.h2>
      <motion.p
        className="service-tagline"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        {service.tagline}
      </motion.p>

      <div className="service-columns">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h4>Features & Capabilities</h4>
          <ul className="service-list">
            {service.features.map(f => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h4>{service.typesLabel}</h4>
          <ul className="service-list">
            {service.types.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default function Agencies() {
  useSpotlight()

  return (
    <div className="astorra-scroll agencies-page">
      <style>{PAGE_STYLES + DOME_STYLES + EXPERIENCE_STYLES}</style>

      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>
      <StitchThread />

      <section className="astorra-hero">
        <div className="agencies-hero-bg">
          <ShapeWaves
            shapes="mixed"
            cellSize={12}
            dotSize={0.7}
            color="#6e5a26"
            hoverColor={GOLD_LIGHT}
            backgroundColor={GALLERY_BACKGROUND}
            speed={1}
            scale={1.2}
            contrast={1.2}
            brightness={0.5}
            fade={0.2}
            interactive
            splashRadius={50}
            splashStrength={0.4}
            intro
            introDuration={1.8}
          />
          <div className="agencies-hero-fade" />
        </div>
        <motion.h1
          className="agencies-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          R&R Agencies
        </motion.h1>
        <motion.p className="astorra-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
          Embroidery, DTF & Vinyl Services
        </motion.p>
        <motion.p className="astorra-lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          Expert embroidery, DTF printing, and vinyl solutions for chainstores and corporate clients.
        </motion.p>
        <motion.div className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          scroll ↓
        </motion.div>
      </section>

      <section className="astorra-section">
        <SectionHeading>Our Process — From Concept to Completion</SectionHeading>
      </section>
      <ProcessSection />

      <section className="astorra-section why-us">
        <SectionHeading>Why Choose Us</SectionHeading>
        <div className="module-list">
          {whyUs.map((item, i) => (
            <motion.div
              className="module-row"
              key={item.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {services.map((s, i) => (
        <ServiceSection service={s} index={i} key={s.id} />
      ))}

      <section className="astorra-section">
        <SectionHeading>Our Work</SectionHeading>
        <motion.div
          className="agencies-gallery"
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
            overlayBlurColor={GALLERY_BACKGROUND}
            grayscale={false}
          />
        </motion.div>
        <p className="agencies-gallery-note">Drag to explore, tap a photo to enlarge</p>
      </section>

      <section className="astorra-outro sitesol-contact">
        <SectionHeading>Get in Touch</SectionHeading>
        <motion.div
          className="contact-grid"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <a href="tel:0813365266" className="contact-item">
            <span>📞</span><strong>CALL</strong><span>081 336 5266</span>
          </a>
          <a href="mailto:info@rragencies.co.za" className="contact-item">
            <span>✉️</span><strong>EMAIL</strong><span>info@rragencies.co.za</span>
          </a>
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="contact-item">
            <span>📍</span><strong>VISIT</strong>
            <span>
              SBDC Building, Unit 13<br />
              2 Columbus Rd, Verulam<br />
              KwaZulu-Natal, South Africa
            </span>
          </a>
        </motion.div>
      </section>
    </div>
  )
}