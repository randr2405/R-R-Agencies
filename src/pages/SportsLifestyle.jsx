import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const STORE_URL = 'https://www.randragencies.online'
const GALLERY_COUNT = 12

const galleryImages = Array.from({ length: GALLERY_COUNT }, (_, i) => ({
  src: `/sports/product${i + 1}.png`,
  alt: `R&R Sport & Lifestyle product ${i + 1}`,
}))

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

const ticker = ['Own the look', 'Own the moment', 'Men', 'Women', 'Kids', 'Babies', 'Limited editions']

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,800;1,6..96,400;1,6..96,600&family=Jost:wght@300;400;500;600&display=swap');

.sl {
  --black: #000;
  --white: #fff;
  --grey: #f2f2f2;
  --mid: #6a6a6a;
  --line: rgba(0, 0, 0, 0.9);
  background: var(--white);
  color: var(--black);
  font-family: 'Jost', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.65;
  overflow-x: clip;
  min-height: 100vh;
  position: relative;
}
.sl *, .sl *::before, .sl *::after { box-sizing: border-box; }
.sl h1, .sl h2, .sl h3, .sl p, .sl ul, .sl address { margin: 0; padding: 0; }
.sl ul { list-style: none; }
.sl address { font-style: normal; }
.sl a { color: inherit; text-decoration: none; }
.sl a:focus-visible, .sl button:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }

.sl-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70; transform-origin: 0 50%; background: var(--black); mix-blend-mode: difference; }
.sl-back {
  position: fixed; top: 16px; left: 18px; z-index: 60; padding: 8px 16px; font-size: 0.85rem; font-weight: 500;
  background: var(--black); color: var(--white); border: 1px solid var(--white); outline: 1px solid var(--black);
  transition: transform 250ms ease;
}
.sl-back:hover { transform: translateX(-3px); }

.sl-hero {
  position: relative; min-height: 100vh; display: grid; place-items: center; text-align: center;
  padding: 100px 24px 90px; overflow: hidden; isolation: isolate;
}
.sl-hero::before {
  content: ''; position: absolute; inset: 22px; z-index: -1; border: 1px solid var(--black); pointer-events: none;
}
.sl-hero::after {
  content: ''; position: absolute; inset: 30px; z-index: -1; border: 1px solid rgba(0, 0, 0, 0.25); pointer-events: none;
}
.sl-hero-inner { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 720px; }
.sl-logo { width: min(460px, 78vw); height: auto; mix-blend-mode: multiply; }
.sl-tagline { margin-top: 0.6rem; font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: clamp(1.5rem, 3.6vw, 2.4rem); }
.sl-lede { margin-top: 0.8rem; max-width: 34rem; color: var(--mid); font-weight: 300; }
.sl-cta { margin-top: 2rem; display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.sl-btn {
  display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; cursor: pointer;
  font-family: inherit; font-weight: 500; font-size: 0.95rem; letter-spacing: 0.08em; border: 1px solid var(--black);
  transition: background 300ms ease, color 300ms ease, transform 300ms ease;
}
.sl-btn:hover { transform: translateY(-3px); }
.sl-btn-solid { background: var(--black); color: var(--white); }
.sl-btn-solid:hover { background: var(--white); color: var(--black); }
.sl-btn-line { background: transparent; color: var(--black); }
.sl-btn-line:hover { background: var(--black); color: var(--white); }
.sl-dark .sl-btn-solid { background: var(--white); color: var(--black); border-color: var(--white); }
.sl-dark .sl-btn-solid:hover { background: transparent; color: var(--white); }
.sl-scroll { position: absolute; bottom: 40px; left: 50%; translate: -50% 0; font-size: 0.8rem; letter-spacing: 0.2em; color: var(--mid); }

.sl-strip { background: var(--black); color: var(--white); overflow: hidden; }
.sl-strip-track { display: flex; width: max-content; animation: sl-slide 44s linear infinite; }
.sl-strip-item { display: flex; align-items: center; gap: 34px; padding: 16px 0 16px 34px; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 1.5rem; white-space: nowrap; }
.sl-strip-item i { font-style: normal; font-size: 1rem; }
@keyframes sl-slide { to { transform: translateX(-50%); } }

.sl-section { max-width: 1180px; margin: 0 auto; padding: clamp(72px, 10vw, 130px) clamp(20px, 5vw, 64px); }
.sl-head { text-align: center; margin-bottom: 3rem; }
.sl-h2 { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(2.2rem, 5.6vw, 4.2rem); line-height: 1.05; letter-spacing: -0.01em; }
.sl-h2 em { font-weight: 400; }
.sl-sub { margin-top: 0.8rem; color: var(--mid); font-weight: 300; font-size: 1.05rem; }
.sl-dark { background: var(--black); color: var(--white); }
.sl-dark .sl-sub { color: rgba(255, 255, 255, 0.65); }
.sl-grey { background: var(--grey); }
.sl-prose { max-width: 62ch; margin: 0 auto 1.2rem; text-align: center; font-size: 1.12rem; font-weight: 300; }

.sl-range { border-top: 1px solid var(--black); }
.sl-range li { border-bottom: 1px solid var(--black); }
.sl-range a {
  display: flex; justify-content: space-between; align-items: center; padding: 0.35em 0.2em;
  font-family: 'Bodoni Moda', serif; font-weight: 400; font-size: clamp(2.2rem, 7vw, 5rem); line-height: 1.1;
  transition: background 350ms ease, color 350ms ease, padding 350ms ease;
}
.sl-range a span { font-family: 'Jost', sans-serif; font-size: 0.9rem; letter-spacing: 0.1em; opacity: 0; transition: opacity 300ms ease; }
.sl-range a:hover { background: var(--black); color: var(--white); padding: 0.35em 0.6em; }
.sl-range a:hover span { opacity: 1; }

.sl-duo { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--black); }
.sl-founder { padding: clamp(28px, 4vw, 56px); }
.sl-founder + .sl-founder { border-left: 1px solid var(--black); }
.sl-founder:nth-child(2) { background: var(--black); color: var(--white); }
.sl-focus { font-size: 0.85rem; letter-spacing: 0.14em; opacity: 0.65; }
.sl-founder h3 { margin: 0.6rem 0 0.2rem; font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.1; }
.sl-role { font-size: 0.92rem; opacity: 0.7; margin-bottom: 1.2rem; }
.sl-founder p + p { margin-top: 0.9rem; }
.sl-closing { max-width: 62ch; margin: 2.4rem auto 0; text-align: center; font-family: 'Bodoni Moda', serif; font-style: italic; font-size: 1.35rem; line-height: 1.55; }

.sl-group { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(1.6rem, 3vw, 2.2rem); margin: 3rem 0 1.4rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--black); }
.sl-group:first-of-type { margin-top: 0; }
.sl-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.sl-card { padding: 30px; border: 1px solid var(--black); background: var(--white); transition: background 350ms ease, color 350ms ease; }
.sl-card:hover { background: var(--black); color: var(--white); }
.sl-card:hover .sl-tag, .sl-card:hover .sl-feats li::before { color: var(--white); }
.sl-tag { font-size: 0.85rem; letter-spacing: 0.14em; color: var(--mid); }
.sl-card h3 { margin: 0.4rem 0 0.6rem; font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: 1.7rem; line-height: 1.15; }
.sl-feats { margin-top: 1.1rem; }
.sl-feats li { padding: 0.3rem 0; border-top: 1px solid rgba(128, 128, 128, 0.4); }
.sl-feats li::before { content: '—'; margin-right: 0.7rem; }

.sl-masonry { columns: 3; column-gap: 18px; }
.sl-tile {
  display: block; width: 100%; margin: 0 0 18px; padding: 0; border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.05); cursor: zoom-in; break-inside: avoid; overflow: hidden; position: relative;
  transition: border-color 300ms ease;
}
.sl-tile:hover { border-color: var(--white); }
.sl-tile img { display: block; width: 100%; height: auto; filter: grayscale(1) contrast(1.05); transition: filter 500ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1); }
.sl-tile:hover img { filter: grayscale(0); transform: scale(1.05); }
.sl-empty { text-align: center; color: rgba(255, 255, 255, 0.6); }
.sl-lightbox { position: fixed; inset: 0; z-index: 200; display: grid; place-items: center; padding: 24px; background: rgba(0, 0, 0, 0.94); cursor: zoom-out; }
.sl-lightbox img { max-width: min(92vw, 900px); max-height: 86vh; border: 1px solid var(--white); }
.sl-nav { position: absolute; top: 50%; translate: 0 -50%; width: 48px; height: 48px; border: 1px solid var(--white); background: var(--black); color: var(--white); font-size: 1.4rem; cursor: pointer; }
.sl-nav.prev { left: 18px; }
.sl-nav.next { right: 18px; }

.sl-trio { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--black); }
.sl-trio > div { padding: 40px 30px; }
.sl-trio > div + div { border-left: 1px solid var(--black); }
.sl-trio h3 { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: 1.7rem; line-height: 1.15; margin-bottom: 0.7rem; }

.sl-info { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--white); border-left: 1px solid var(--white); }
.sl-info > div { padding: 34px 28px; border-right: 1px solid var(--white); border-bottom: 1px solid var(--white); transition: background 350ms ease, color 350ms ease; }
.sl-info > div:hover { background: var(--white); color: var(--black); }
.sl-info h3 { font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: 1.8rem; margin-bottom: 0.5rem; }
.sl-info p { font-weight: 300; }

.sl-faq { max-width: 780px; margin: 0 auto; border-top: 1px solid var(--black); }
.sl-faq-row { border-bottom: 1px solid var(--black); }
.sl-faq-btn {
  width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; padding: 22px 4px;
  background: none; border: 0; cursor: pointer; text-align: left; color: var(--black);
  font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: clamp(1.15rem, 2.2vw, 1.5rem);
  transition: padding 250ms ease;
}
.sl-faq-btn:hover { padding-left: 14px; }
.sl-faq-btn i { font-style: normal; font-size: 1.8rem; transition: transform 300ms ease; }
.sl-faq-btn[aria-expanded='true'] i { transform: rotate(45deg); }
.sl-faq-body { overflow: hidden; }
.sl-faq-body p { padding: 0 4px 24px; max-width: 44rem; color: var(--mid); font-weight: 300; }

.sl-outro { text-align: center; }
.sl-outro .sl-prose { color: rgba(255, 255, 255, 0.75); }

.sl-contact { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--black); border-left: 1px solid var(--black); }
.sl-contact a { padding: 28px; border-right: 1px solid var(--black); border-bottom: 1px solid var(--black); display: flex; flex-direction: column; gap: 4px; transition: background 300ms ease, color 300ms ease; }
.sl-contact a:hover { background: var(--black); color: var(--white); }
.sl-contact h3 { font-family: 'Bodoni Moda', serif; font-style: italic; font-weight: 400; font-size: 1.5rem; }
.sl-contact span { overflow-wrap: anywhere; }

.sl-footer { background: var(--black); color: rgba(255, 255, 255, 0.75); padding: 34px clamp(20px, 5vw, 64px) 40px; text-align: center; font-size: 0.9rem; }
.sl-footer a { margin: 0 0.7rem; }
.sl-footer a:hover { color: var(--white); text-decoration: underline; }

@media (max-width: 900px) {
  .sl-duo, .sl-cols, .sl-trio, .sl-info, .sl-contact { grid-template-columns: 1fr; }
  .sl-founder + .sl-founder, .sl-trio > div + div { border-left: 0; border-top: 1px solid var(--black); }
  .sl-masonry { columns: 2; }
}
@media (max-width: 520px) { .sl-masonry { columns: 1; } }
@media (prefers-reduced-motion: reduce) {
  .sl *, .sl *::before { transition-duration: 0.01ms !important; }
  .sl-strip-track { animation: none; }
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

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 70])
  return (
    <section className="sl-hero">
      <motion.div className="sl-hero-inner" style={{ y }}>
        <motion.img
          className="sl-logo"
          src="/logos/sports-lifestyle.png"
          alt="R&R Sport & Lifestyle"
          initial={{ opacity: 0, clipPath: 'inset(0 50% 0 50%)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0%)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.p className="sl-tagline" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}>
          Own the look, own the moment
        </motion.p>
        <motion.p className="sl-lede" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
          Sportswear and lifestyle apparel for men, women, kids and babies. Shop online, delivered locally and internationally.
        </motion.p>
        <motion.div className="sl-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.8 }}>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="sl-btn sl-btn-solid">Shop the online store</a>
          <a href="#gallery" className="sl-btn sl-btn-line">See the gallery</a>
        </motion.div>
      </motion.div>
      <motion.div className="sl-scroll" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        scroll ↓
      </motion.div>
    </section>
  )
}

function Strip() {
  const row = [...ticker, ...ticker]
  return (
    <div className="sl-strip" aria-hidden="true">
      <div className="sl-strip-track">
        {[0, 1].map(k => (
          <div className="sl-strip-item" key={k}>
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

function Gallery() {
  const [failed, setFailed] = useState([])
  const [active, setActive] = useState(-1)
  const visible = galleryImages.filter(img => !failed.includes(img.src))

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
      <section className="sl-section">
        <Head title="Our gallery" sub="The latest pieces. Hover for colour, tap to enlarge." />
        {visible.length === 0 && <p className="sl-empty">New product photos are on the way.</p>}
        <div className="sl-masonry">
          {galleryImages.map((img, i) => {
            if (failed.includes(img.src)) return null
            const idx = visible.findIndex(v => v.src === img.src)
            return (
              <motion.button
                type="button"
                className="sl-tile"
                key={img.src}
                aria-label={`Enlarge ${img.alt}`}
                onClick={() => setActive(idx)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              >
                <img src={img.src} alt={img.alt} loading="lazy" onError={() => setFailed(f => [...f, img.src])} />
              </motion.button>
            )
          })}
        </div>
        <AnimatePresence>
          {active >= 0 && visible[active] && (
            <motion.div
              className="sl-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Product photo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActive(-1)}
            >
              <button type="button" className="sl-nav prev" aria-label="Previous photo" onClick={e => { e.stopPropagation(); setActive((active - 1 + visible.length) % visible.length) }}>‹</button>
              <motion.img
                key={visible[active].src}
                src={visible[active].src}
                alt={visible[active].alt}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={e => e.stopPropagation()}
              />
              <button type="button" className="sl-nav next" aria-label="Next photo" onClick={e => { e.stopPropagation(); setActive((active + 1) % visible.length) }}>›</button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
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
              <motion.div
                className="sl-faq-body"
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
  )
}

export default function SportsLifestyle() {
  const rootRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.4 })

  return (
    <div className="sl" ref={rootRef}>
      <style>{STYLES}</style>
      <motion.div className="sl-bar" style={{ scaleX: bar }} />
      <Link to="/" className="sl-back">← Back to hub</Link>

      <main>
        <Hero />
        <Strip />

        <section className="sl-section">
          <Head title="Built for movement, designed for life" sub="Brand philosophy" />
          <Reveal>
            <p className="sl-prose">
              R&R Sports & Lifestyle is our answer to the modern athlete and lifestyle enthusiast who demands more from their
              apparel. We believe that performance wear shouldn't sacrifice style, and street fashion shouldn't compromise on
              functionality.
            </p>
            <p className="sl-prose">
              Every piece in our collection is designed with technical precision and contemporary aesthetics in mind. From the
              gym to the street, our apparel transitions seamlessly through your active lifestyle.
            </p>
          </Reveal>
        </section>

        <div className="sl-grey">
          <section className="sl-section">
            <Head title="Who we dress" sub="Apparel for the whole family, sold online" />
            <Reveal>
              <ul className="sl-range">
                {range.map(r => (
                  <li key={r}>
                    <a href={STORE_URL} target="_blank" rel="noreferrer">
                      {r}
                      <span>Shop now</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        </div>

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
                    <motion.div
                      className="sl-card"
                      key={item.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
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
              <a href="tel:0813365266">
                <h3>Phone</h3>
                <span>081 336 5266</span>
              </a>
              <a href="mailto:info@rragencies.co.za">
                <h3>Email</h3>
                <span>info@rragencies.co.za</span>
              </a>
              <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer">
                <h3>WhatsApp</h3>
                <span>Message us on 081 336 5266</span>
              </a>
              <a href="https://www.instagram.com/randragencies" target="_blank" rel="noreferrer">
                <h3>Instagram</h3>
                <span>@randragencies</span>
              </a>
              <a href="https://www.tiktok.com/@randragencies" target="_blank" rel="noreferrer">
                <h3>TikTok</h3>
                <span>@randragencies</span>
              </a>
              <a href={STORE_URL} target="_blank" rel="noreferrer">
                <h3>Online store</h3>
                <span>www.randragencies.online</span>
              </a>
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