import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

const howItWorks = [
  { n: '01', title: 'Tell us about your business', desc: 'A short set of guided questions — industry, team size, and how you operate day to day. No long sign-up form.' },
  { n: '02', title: 'Astorra builds the workspace', desc: 'Only the modules your business actually needs are installed automatically and configured — nothing extra.' },
  { n: '03', title: 'One dashboard, everything in view', desc: "Installed modules and notifications live on a single dashboard. No jumping between five different logins." },
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
  { tier: 'Free', price: 'R0/pm', modules: 'Up to 2 modules', ai: 'Not included' },
  { tier: 'Starter', price: 'R249/pm', modules: 'Up to 5 modules', ai: 'AI included (5 req/mo)' },
  { tier: 'Professional', price: 'R799/pm', modules: 'Up to 10 modules', ai: 'AI included (30 req/mo)' },
  { tier: 'Enterprise', price: 'R1 499/pm', modules: 'Unlimited modules', ai: 'Unlimited AI included' },
]

const competitors = [
  { name: 'magWork', note: 'Closest direct competitor. Same modular pitch — but still requires browsing and picking modules manually. Astorra\'s AI Builder recommends and installs the exact set from one plain-language description.' },
  { name: 'Odoo', note: 'Most feature-complete platform on the market, but a real learning curve for non-technical users. Astorra trades raw breadth for a guided onboarding that lands on a working workspace in minutes.' },
  { name: 'Zoho One', note: 'Affordable, but no PayFast-native billing or SARS-specific payroll. Astorra is built ZAR-first and SA-compliant from day one.' },
  { name: 'Cerva', note: 'A strong SA-native competitor, but accounting-and-payroll first with extras bolted on. Astorra is operations-first — Jobs, Bookings, Assets, Leave — which fits service and trades businesses better.' },
]

function HowItWorksSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section className="how-it-works" ref={ref}>
      <div className="how-sticky">
        {howItWorks.map((step, i) => {
          const segment = 1 / howItWorks.length
          const start = i * segment
          const end = start + segment
          const opacity = useTransform(
            scrollYProgress,
            [start, start + segment * 0.2, end - segment * 0.2, end],
            [0, 1, 1, 0]
          )
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

function ModulesSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-72%'])

  return (
    <section className="modules-scroll" ref={ref}>
      <div className="modules-sticky">
        <h2 className="modules-heading">14 modules. Install only what you need.</h2>
        <motion.div className="modules-track" style={{ x }}>
          {modules.map((m) => (
            <div className="module-card" key={m.name}>
              <h3>{m.name}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default function Astorra() {
  return (
    <div className="astorra-scroll">
      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>

      <section className="astorra-hero">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Astorra
        </motion.h1>
        <motion.p className="astorra-slogan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.7 }}>
          One platform. Your way.
        </motion.p>
        <motion.p className="astorra-lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
          Businesses don't buy software — they buy relief from disconnected, manual,
          wasted-time operations. Astorra brings everything together in one intelligent,
          modular platform that adapts to the way each business works.
        </motion.p>
        <motion.div className="scroll-hint" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          scroll ↓
        </motion.div>
      </section>

      <HowItWorksSection />
      <ModulesSection />

      <section className="astorra-section astorra-pricing">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Pricing
        </motion.h2>
        <div className="pricing-grid">
          {pricing.map((p, i) => (
            <motion.div
              className="pricing-card"
              key={p.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3>{p.tier}</h3>
              <p className="pricing-price">{p.price}</p>
              <p>{p.modules}</p>
              <p className="pricing-ai">{p.ai}</p>
            </motion.div>
          ))}
        </div>
        <p className="pricing-note">
          Need something custom? Astorra also builds fully custom software as an IT company
          in its own right — get in touch to scope a solution outside the standard tiers.
        </p>
      </section>

      <section className="astorra-section">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          How Astorra compares
        </motion.h2>
        <div className="module-list">
          {competitors.map((c, i) => (
            <motion.div
              className="module-row"
              key={c.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div>
                <h3>{c.name}</h3>
                <p>{c.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="astorra-outro">
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6 }}>
          Astorra is owned and operated by R&R Agencies.<br />
          081 336 5266 · info@rragencies.co.za
        </motion.p>
      </section>
    </div>
  )
}