import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const segments = [
  { icon: '🏢', title: 'Small Businesses', desc: 'Scalable solutions for growing companies' },
  { icon: '🏭', title: 'Medium Enterprises', desc: 'Robust systems for established operations' },
  { icon: '🌐', title: 'Large Corporations', desc: 'Enterprise-grade infrastructure at scale' },
]

const services = [
  { name: 'Web Development', desc: 'Custom websites and web applications built for performance and scale.' },
  { name: 'Mobile Applications', desc: 'Native and cross-platform apps designed around how your business actually works.' },
  { name: 'System Architecture', desc: 'Solid technical foundations that grow with your business instead of breaking under it.' },
  { name: 'Integrations', desc: 'Seamless connections between your tools, data, and third-party services.' },
  { name: 'Maintenance', desc: 'Ongoing upkeep so your systems stay secure, fast, and up to date.' },
  { name: 'Dedicated Support', desc: 'Real support from the team that built it — not a ticket queue.' },
]

const process = [
  { n: '01', title: 'Discovery', desc: 'We learn your business, your problem, and what success actually looks like.' },
  { n: '02', title: 'Design', desc: 'Architecture and interface planning, so the build starts on solid ground.' },
  { n: '03', title: 'Build', desc: 'Development with regular check-ins, not a black box until the big reveal.' },
  { n: '04', title: 'Launch', desc: 'A controlled, tested rollout — not a risky flip-the-switch moment.' },
  { n: '05', title: 'Support', desc: "Ongoing maintenance and support once you're live." },
]

const pricingSteps = [
  { icon: '📋', title: 'Free Consultation', desc: 'Discuss your project requirements with our team' },
  { icon: '💡', title: 'Custom Proposal', desc: 'Receive a detailed quote tailored to your needs' },
  { icon: '🤝', title: 'Flexible Terms', desc: 'Payment plans and milestones that work for you' },
]

const portfolio = [
  { name: 'Dirose Enterprise', url: 'https://www.diroseenterprise.co.za' },
  { name: 'Distinct Embroidery', url: 'https://www.distinctembroidery.co.za' },
  { name: 'R&R Agencies', url: 'https://www.rragencies.co.za' },
  { name: 'R&R Agencies (alt)', url: 'https://www.randragencies.online' },
  { name: 'Astorra', url: 'https://www.astorra.co.za' },
]

function ProcessSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="how-it-works" ref={ref}>
      <div className="how-sticky">
        {process.map((step, i) => {
          const segment = 1 / process.length
          const start = i * segment
          const end = start + segment
          const opacity = useTransform(scrollYProgress, [start, start + segment * 0.2, end - segment * 0.2, end], [0, 1, 1, 0])
          const y = useTransform(scrollYProgress, [start, end], [40, -40])
          return (
            <motion.div className="how-step" style={{ opacity, y }} key={step.n}>
              <span className="how-step-number">{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default function SiteSolutions() {
  return (
    <div className="astorra-scroll">
      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>

      <section className="astorra-hero">
        <motion.h1
          className="sitesol-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Site Solutions
        </motion.h1>
        <motion.p className="astorra-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
          Complete IT Development Solutions
        </motion.p>
        <motion.p className="astorra-lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          Web development, mobile applications, system architecture, seamless integrations,
          ongoing maintenance, and dedicated support services.
        </motion.p>
        <motion.div className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          scroll ↓
        </motion.div>
      </section>

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Who We Serve
        </motion.h2>
        <div className="segment-grid">
          {segments.map((s, i) => (
            <motion.div
              className="segment-card"
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="segment-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          What We Do
        </motion.h2>
        <div className="module-list">
          {services.map((item, i) => (
            <motion.div
              className="module-row"
              key={item.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div>
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Our Process
        </motion.h2>
      </section>
      <ProcessSection />

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Transparent Pricing
        </motion.h2>
        <p className="sitesol-pricing-lede">
          Every project is unique. We provide customized quotes based on your specific
          requirements, timeline, and scope.
        </p>
        <div className="segment-grid">
          {pricingSteps.map((s, i) => (
            <motion.div
              className="segment-card"
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="segment-icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Our Work
        </motion.h2>
        <div className="portfolio-list">
          {portfolio.map((p, i) => (
            <motion.a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="portfolio-link"
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span>{p.name}</span>
              <span className="portfolio-arrow">→</span>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="astorra-outro sitesol-contact">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Ready to Launch Your Digital Future?
        </motion.h2>
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
          <div className="contact-item">
            <span>📍</span><strong>LOCATION</strong><span>Durban, SA</span>
          </div>
        </motion.div>
      </section>
    </div>
  )
}