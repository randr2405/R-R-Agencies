import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STORE_URL = 'https://www.randragencies.online'

const GALLERY_COUNT = 12

const galleryImages = Array.from({ length: GALLERY_COUNT }, (_, i) => ({
  src: `/sports/product${i + 1}.png`,
  alt: `R&R Sports & Lifestyle product ${i + 1}`,
}))

const STYLES = `
.sports-title {
  font-size: clamp(2.5rem, 7vw, 5rem);
  font-weight: 900;
  margin: 0;
  color: #4DFFB0;
  text-align: center;
}

.sports-prose {
  max-width: 64ch;
  margin: 0 auto 1.25rem;
  line-height: 1.7;
  opacity: 0.85;
  text-align: center;
}

.sports-subhead {
  text-align: center;
  opacity: 0.7;
  margin: 0 auto 2rem;
}

.sports-group {
  text-align: center;
  margin: 2.5rem 0 1.25rem;
}

.card-tag {
  font-size: 0.85rem;
  opacity: 0.6;
  margin: 0 0 0.5rem;
}

.check-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  text-align: left;
}

.check-list li {
  padding: 0.25rem 0;
  opacity: 0.9;
}

.check-list li::before {
  content: '✓';
  color: #4DFFB0;
  margin-right: 0.6rem;
}

.shop-button {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 1rem 2.2rem;
  border-radius: 999px;
  background: #4DFFB0;
  color: #07070d;
  font-weight: 800;
  text-decoration: none;
}

.shop-button:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 3px;
}

.shop-button-line {
  background: transparent;
  color: inherit;
  border: 1px solid rgba(77, 255, 176, 0.7);
  margin-left: 0.8rem;
}

.range-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 760px;
}

.range-chips li {
  padding: 0.7rem 1.3rem;
  border-radius: 999px;
  font-weight: 700;
  border: 1px solid rgba(77, 255, 176, 0.45);
  background: rgba(77, 255, 176, 0.06);
}

.sg-masonry {
  columns: 3;
  column-gap: 16px;
  max-width: 1100px;
  margin: 2rem auto 0;
}

.sg-tile {
  display: block;
  width: 100%;
  margin: 0 0 16px;
  padding: 0;
  border: 1px solid rgba(77, 255, 176, 0.25);
  border-radius: 18px;
  overflow: hidden;
  cursor: zoom-in;
  background: rgba(255, 255, 255, 0.04);
  break-inside: avoid;
  position: relative;
  transition: border-color 300ms ease, box-shadow 300ms ease;
}

.sg-tile:hover {
  border-color: #4DFFB0;
  box-shadow: 0 0 34px rgba(77, 255, 176, 0.25);
}

.sg-tile:focus-visible {
  outline: 2px solid #4DFFB0;
  outline-offset: 3px;
}

.sg-tile img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.sg-tile:hover img {
  transform: scale(1.05);
}

.sg-empty {
  text-align: center;
  opacity: 0.6;
  margin-top: 2rem;
}

.sg-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(4, 4, 10, 0.92);
  backdrop-filter: blur(8px);
  cursor: zoom-out;
}

.sg-lightbox img {
  max-width: min(92vw, 900px);
  max-height: 86vh;
  border-radius: 20px;
  border: 1px solid rgba(77, 255, 176, 0.5);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.7);
}

.sg-nav {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(77, 255, 176, 0.6);
  background: rgba(7, 7, 13, 0.8);
  color: #4DFFB0;
  font-size: 1.3rem;
  cursor: pointer;
}

.sg-nav.prev { left: 18px; }
.sg-nav.next { right: 18px; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
}

.info-card {
  padding: 1.6rem;
  border-radius: 20px;
  border: 1px solid rgba(77, 255, 176, 0.25);
  background: rgba(255, 255, 255, 0.04);
}

.info-card h3 {
  margin: 0 0 0.5rem;
  color: #4DFFB0;
}

.info-card p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.85;
}

.faq-list {
  max-width: 760px;
  margin: 0 auto;
  border-top: 1px solid rgba(77, 255, 176, 0.25);
}

.faq-row {
  border-bottom: 1px solid rgba(77, 255, 176, 0.25);
}

.faq-btn {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 1.1rem 0.2rem;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
}

.faq-btn:focus-visible {
  outline: 2px solid #4DFFB0;
  outline-offset: 2px;
}

.faq-btn i {
  font-style: normal;
  font-size: 1.4rem;
  color: #4DFFB0;
  transition: transform 300ms ease;
}

.faq-btn[aria-expanded='true'] i { transform: rotate(45deg); }

.faq-body { overflow: hidden; }

.faq-body p {
  margin: 0;
  padding: 0 0.2rem 1.2rem;
  line-height: 1.7;
  opacity: 0.85;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  max-width: 1000px;
  margin: 2rem auto 0;
  text-align: left;
}

.contact-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 1.3rem;
  border-radius: 18px;
  border: 1px solid rgba(77, 255, 176, 0.25);
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  text-decoration: none;
  transition: border-color 300ms ease, transform 300ms ease;
}

a.contact-item:hover {
  border-color: #4DFFB0;
  transform: translateY(-4px);
}

a.contact-item:focus-visible {
  outline: 2px solid #4DFFB0;
  outline-offset: 3px;
}

.contact-item h3 {
  margin: 0;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4DFFB0;
}

.contact-item span {
  overflow-wrap: anywhere;
}

.sports-footer {
  padding: 2rem 1.5rem 2.5rem;
  text-align: center;
  font-size: 0.88rem;
  opacity: 0.7;
}

.sports-footer a {
  color: inherit;
  margin: 0 0.6rem;
}

@media (max-width: 900px) {
  .sg-masonry { columns: 2; }
  .info-grid, .contact-grid { grid-template-columns: 1fr; }
}

@media (max-width: 520px) {
  .sg-masonry { columns: 1; }
  .shop-button-line { margin-left: 0; }
}
`

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
    icon: '🧵',
    title: 'Premium Fabrics',
    desc: 'We source only the finest technical fabrics from trusted suppliers. Each material is selected for its specific performance characteristics and durability.',
  },
  {
    icon: '🎨',
    title: 'Contemporary Design',
    desc: 'Our in-house design team creates original collections that blend athletic functionality with street-style aesthetics. Never basic, always authentic.',
  },
  {
    icon: '✨',
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
    <section className="astorra-section" id="gallery">
      <SectionHeading>Our Gallery</SectionHeading>
      <p className="sports-subhead">A look at the latest pieces. Tap a photo to enlarge.</p>
      {visible.length === 0 && <p className="sg-empty">New product photos are on the way.</p>}
      <div className="sg-masonry">
        {galleryImages.map((img, i) => {
          if (failed.includes(img.src)) return null
          const idx = visible.findIndex(v => v.src === img.src)
          return (
            <motion.button
              type="button"
              className="sg-tile"
              key={img.src}
              aria-label={`Enlarge ${img.alt}`}
              onClick={() => setActive(idx)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
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
            className="sg-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Product photo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(-1)}
          >
            <button type="button" className="sg-nav prev" aria-label="Previous photo" onClick={e => { e.stopPropagation(); setActive((active - 1 + visible.length) % visible.length) }}>‹</button>
            <motion.img
              key={visible[active].src}
              src={visible[active].src}
              alt={visible[active].alt}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            />
            <button type="button" className="sg-nav next" aria-label="Next photo" onClick={e => { e.stopPropagation(); setActive((active + 1) % visible.length) }}>›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div className="faq-row" key={f.q}>
          <button type="button" className="faq-btn" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {f.q}
            <i>+</i>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                className="faq-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
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
  return (
    <div className="astorra-scroll">
      <style>{STYLES}</style>
      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>

      <section className="astorra-hero">
        <motion.p className="astorra-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          Our Brand
        </motion.p>
        <motion.h1
          className="sports-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          R&R Sports & Lifestyle
        </motion.h1>
        <motion.p className="astorra-lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          Own the look, own the moment
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="shop-button">Shop the online store</a>
          <a href="#gallery" className="shop-button shop-button-line">See the gallery</a>
        </motion.div>
        <motion.div className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          scroll ↓
        </motion.div>
      </section>

      <section className="astorra-section">
        <SectionHeading>Brand Philosophy</SectionHeading>
        <p className="sports-subhead">Built for Movement, Designed for Life</p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <p className="sports-prose">
            R&R Sports & Lifestyle is our answer to the modern athlete and lifestyle enthusiast who demands more from their
            apparel. We believe that performance wear shouldn't sacrifice style, and street fashion shouldn't compromise on
            functionality.
          </p>
          <p className="sports-prose">
            Every piece in our collection is designed with technical precision and contemporary aesthetics in mind. From the
            gym to the street, our apparel transitions seamlessly through your active lifestyle.
          </p>
        </motion.div>
      </section>

      <section className="astorra-section">
        <SectionHeading>Who We Dress</SectionHeading>
        <p className="sports-subhead">Apparel for the whole family, sold online</p>
        <ul className="range-chips">
          {range.map(r => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="astorra-section">
        <SectionHeading>Our Story</SectionHeading>
        <p className="sports-subhead">Where Sport Meets Style</p>
        <p className="sports-prose">
          R&R Sports & Lifestyle was born from the perfect fusion of athletic excellence and lifestyle sophistication. Two
          founders, two passions, one extraordinary brand.
        </p>
        <div className="segment-grid">
          {founders.map((f, i) => (
            <motion.div
              className="segment-card"
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="card-tag">{f.focus}</p>
              <h3>{f.name}</h3>
              <p className="card-tag">{f.role}</p>
              {f.paragraphs.map(p => (
                <p key={p}>{p}</p>
              ))}
            </motion.div>
          ))}
        </div>
        <p className="sports-prose" style={{ marginTop: '2rem' }}>
          Together, Romario and Rhea created R&R Sports & Lifestyle — a brand where athletic performance meets everyday
          elegance, where functionality embraces fashion, and where every piece tells the story of two passions perfectly
          combined.
        </p>
      </section>

      <section className="astorra-section">
        <SectionHeading>Our Collections</SectionHeading>
        <p className="sports-subhead">Designed for Every Aspect of Your Active Life</p>
        {collections.map(c => (
          <div key={c.group}>
            <h3 className="sports-group">{c.group}</h3>
            <div className="segment-grid">
              {c.items.map((item, i) => (
                <motion.div
                  className="segment-card"
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <p className="card-tag">{item.tag}</p>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <ul className="check-list">
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

      <Gallery />

      <section className="astorra-section">
        <SectionHeading>What Sets Us Apart</SectionHeading>
        <p className="sports-subhead">Quality in Every Detail</p>
        <div className="segment-grid">
          {differentiators.map((d, i) => (
            <motion.div
              className="segment-card"
              key={d.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="segment-icon">{d.icon}</span>
              <h3>{d.title}</h3>
              <p>{d.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-section">
        <SectionHeading>Shopping With Us</SectionHeading>
        <p className="sports-subhead">Delivery, returns and payment</p>
        <div className="info-grid">
          {shopInfo.map((s, i) => (
            <motion.div
              className="info-card"
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-section">
        <SectionHeading>Common Questions</SectionHeading>
        <p className="sports-subhead">Quick answers before you order</p>
        <Faq />
      </section>

      <section className="astorra-outro">
        <SectionHeading>Experience the R&R Difference</SectionHeading>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ textAlign: 'center' }}
        >
          <p className="sports-prose">
            Discover our latest collections and elevate your athletic wardrobe with pieces designed for performance, style,
            and exclusivity.
          </p>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="shop-button">
            Shop the online store
          </a>
        </motion.div>
      </section>

      <section className="astorra-section" id="contact">
        <SectionHeading>Get in Touch</SectionHeading>
        <p className="sports-subhead">R&R Sports & Lifestyle is online only. Support is available 24/7.</p>
        <div className="contact-grid">
          <a href="tel:0813365266" className="contact-item">
            <h3>Phone</h3>
            <span>081 336 5266</span>
          </a>
          <a href="mailto:info@rragencies.co.za" className="contact-item">
            <h3>Email</h3>
            <span>info@rragencies.co.za</span>
          </a>
          <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="contact-item">
            <h3>WhatsApp</h3>
            <span>Message us on 081 336 5266</span>
          </a>
          <a href="https://www.instagram.com/randragencies" target="_blank" rel="noreferrer" className="contact-item">
            <h3>Instagram</h3>
            <span>@randragencies</span>
          </a>
          <a href="https://www.tiktok.com/@randragencies" target="_blank" rel="noreferrer" className="contact-item">
            <h3>TikTok</h3>
            <span>@randragencies</span>
          </a>
          <a href={STORE_URL} target="_blank" rel="noreferrer" className="contact-item">
            <h3>Online store</h3>
            <span>www.randragencies.online</span>
          </a>
        </div>
      </section>

      <footer className="sports-footer">
        <span>© 2026 R&R Sports & Lifestyle, a brand of R&R Agencies. All rights reserved.</span>
        <div style={{ marginTop: '0.6rem' }}>
          <a href="mailto:info@rragencies.co.za">info@rragencies.co.za</a>
          <Link to="/">R&R Agencies</Link>
        </div>
      </footer>
    </div>
  )
}