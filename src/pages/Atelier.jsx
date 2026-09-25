import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const nailServices = [
  { name: 'Rubber Base Gel Set', price: 'R270' },
  { name: 'Acrylic Overlay', price: 'R295' },
  { name: 'Temperature Change (Mood) Gel Set', price: 'R300' },
  { name: 'Magnetic / Cat Eye Gel Set', price: 'R300' },
  { name: 'Gel Toes', price: 'R180' },
  { name: 'Fill / Rebalance (Hands)', price: 'From R180' },
  { name: 'Tips Add-On', price: 'R50' },
  { name: 'Soak-Off (Hands)', price: 'R50' },
  { name: 'Soak-Off (Toes)', price: 'R30' },
  { name: 'Nail Repair', price: 'Complimentary' },
  { name: 'Buff & Shine', price: 'R80' },
]

const manicures = [
  { name: 'Basic Manicure', desc: 'Shape, cuticle care, buff, finished with gel polish', price: 'R150' },
  { name: 'Luxury Manicure', desc: 'Soak, scrub, massage, cuticle care, finished with gel polish', price: 'R250' },
]

const pedicures = [
  { name: 'Basic Pedicure', desc: 'Soak, nail shape, cuticle care, buff, finished with gel polish', price: 'R210' },
  { name: 'Luxury Pedicure', desc: 'Soak, scrub, massage, cuticle care, finished with gel polish', price: 'R300' },
]

const combos = [
  { name: 'Basic Manicure + Basic Pedicure', desc: 'Shape, cuticle care, buff, gel polish on hands and feet', price: 'R320' },
  { name: 'Luxury Manicure + Luxury Pedicure', desc: 'Soak, scrub, massage, cuticle care, gel polish on hands and feet', price: 'R500' },
  { name: 'Rubber Base Gel Set + Gel Toes', desc: 'Rubber base gel set on hands, gel polish on toes', price: 'R380' },
  { name: 'Acrylic Overlay + Gel Toes', desc: 'Acrylic overlay on hands, gel polish on toes', price: 'R420' },
]

const addOns = [
  { name: 'Rhinestone', price: '50c each' },
  { name: 'Chrome', price: 'R5 per nail' },
  { name: 'Foil', price: 'R5 per nail' },
  { name: 'Blooming Gel', price: 'R5 per nail' },
  { name: 'Spider Gel', price: 'R5 per nail' },
  { name: 'Ombre', price: 'R5 per nail' },
  { name: 'Marble Nail Art', price: 'R3 per nail' },
  { name: 'Intricate Design', price: 'R10 per nail' },
  { name: 'Extra Length', price: 'R50' },
]

function MenuGroup({ title, items, index }) {
  return (
    <motion.div
      className="atelier-group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
    >
      <h3>{title}</h3>
      <div className="atelier-items">
        {items.map((item) => (
          <div className="atelier-item" key={item.name}>
            <div>
              <span className="atelier-item-name">{item.name}</span>
              {item.desc && <span className="atelier-item-desc">{item.desc}</span>}
            </div>
            <span className="atelier-item-price">{item.price}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function Atelier() {
  return (
    <div className="atelier-scroll">
      <Link to="/" className="back-link back-link-fixed atelier-back">← Back to hub</Link>

      <section className="atelier-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          R&R Atelier
        </motion.h1>
        <motion.p
          className="atelier-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          Your Beauty. Our Craft.
        </motion.p>
        <motion.div
          className="scroll-hint atelier-hint"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          scroll ↓
        </motion.div>
      </section>

      <section className="atelier-menu">
        <MenuGroup title="Nail Services" items={nailServices} index={0} />
        <MenuGroup title="Manicures" items={manicures} index={1} />
        <MenuGroup title="Pedicures" items={pedicures} index={2} />
        <MenuGroup title="Combos" items={combos} index={3} />
        <MenuGroup title="Add-Ons" items={addOns} index={4} />
      </section>

      <section className="atelier-book">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Book Your Appointment
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Shop 7, The Quartz, 45 Zenith Dr, uMhlanga, 4319 — Inside Bivash Hair and Beauty
        </motion.p>
        <motion.div
          className="atelier-cta-group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a href="tel:0813365266" className="atelier-cta">Call 081 336 5266</a>
          <a href="https://wa.me/27813365266" target="_blank" rel="noreferrer" className="atelier-cta atelier-cta-alt">
            WhatsApp Us
          </a>
        </motion.div>
      </section>
    </div>
  )
}