import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

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
    color: '#FF4D8D',
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
    color: '#4DA6FF',
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
    color: '#4DFFB0',
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
            {service.features.map((f) => <li key={f}>{f}</li>)}
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
            {service.types.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

export default function Agencies() {
  return (
    <div className="astorra-scroll">
      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>

      <section className="astorra-hero">
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
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Our Process — From Concept to Completion
        </motion.h2>
      </section>
      <ProcessSection />

      <section className="astorra-section why-us">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.5 }}>
          Why Choose Us
        </motion.h2>
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

      {services.map((s, i) => <ServiceSection service={s} index={i} key={s.id} />)}
    </div>
  )

  
}

