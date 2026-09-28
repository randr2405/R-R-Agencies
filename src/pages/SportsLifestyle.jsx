import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const STORE_URL = 'https://www.randragencies.online'

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
    </div>
  )
}