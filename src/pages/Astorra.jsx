import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const moduleGroups = [
  {
    label: 'Sales',
    items: [
      { name: 'Customers', letter: 'C', desc: 'One record per customer, feeding everything else' },
      { name: 'Quotes', letter: 'Q', desc: 'Create and send quotes to customers, ready to convert' },
      { name: 'Jobs', letter: 'J', desc: 'Track the actual work between accepted quote and getting paid' },
      { name: 'Invoices', letter: 'I', desc: "Convert quotes to invoices, track what's paid" },
    ],
  },
  {
    label: 'Money',
    items: [
      { name: 'Expenses', letter: 'E', desc: 'Log what you spend, attach receipts, see profit at a glance' },
      { name: 'Purchase Orders / Suppliers', letter: 'P', desc: 'Track what you owe suppliers, order due dates, and goods received' },
      { name: 'Payroll', letter: '$', desc: 'Run payroll, calculate PAYE/UIF automatically, and generate payslips' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { name: 'Inventory', letter: 'S', desc: 'Stock levels that stay accurate on their own' },
      { name: 'Assets', letter: 'A', desc: 'Track equipment and gear — who has it, where it is, when it needs servicing' },
      { name: 'Staff / HR', letter: 'H', desc: 'Records and basics, without a separate system' },
      { name: 'Leave Management', letter: 'L', desc: 'Staff request leave, you approve it, and it feeds Payroll automatically' },
      { name: 'Bookings', letter: 'B', desc: 'Scheduling that updates the whole business' },
    ],
  },
  {
    label: 'Insight',
    items: [
      { name: 'Reports', letter: 'R', desc: 'Revenue, top customers, and overdue tracking at a glance' },
      { name: 'Documents', letter: 'D', desc: 'Secure file storage for contracts and paperwork' },
    ],
  },
]

function ModuleRow({ item, index }) {
  const fromLeft = index % 2 === 0
  return (
    <motion.div
      className="module-row"
      initial={{ opacity: 0, x: fromLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <span className="module-letter">{item.letter}</span>
      <div>
        <h3>{item.name}</h3>
        <p>{item.desc}</p>
      </div>
    </motion.div>
  )
}

export default function Astorra() {
  return (
    <div className="astorra-scroll">
      <Link to="/" className="back-link back-link-fixed">← Back to hub</Link>

      <section className="astorra-hero">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Astorra
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A B2B SaaS platform built for South African SMEs — everything a growing
          business needs to run operations in one place.
        </motion.p>
        <motion.div
          className="scroll-hint"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          scroll ↓
        </motion.div>
      </section>

      {moduleGroups.map((group) => (
        <section className="astorra-section" key={group.label}>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            {group.label}
          </motion.h2>
          <div className="module-list">
            {group.items.map((item, i) => (
              <ModuleRow item={item} index={i} key={item.name} />
            ))}
          </div>
        </section>
      ))}

      <section className="astorra-outro">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
        >
          Built on React, Firebase, and Supabase — designed and maintained in-house by R&R.
        </motion.p>
      </section>
    </div>
  )
}