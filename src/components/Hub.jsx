import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DivisionCard from './DivisionCard'

const divisions = [
  { name: 'R&R Agencies', short: 'Branding & Custom', path: '/agencies', color: '#FF4D8D', angle: 0 },
  { name: 'Site Solutions', short: 'Web, App & Software', path: '/site-solutions', color: '#4DA6FF', angle: 72 },
  { name: 'Astorra', short: 'Business Software', path: '/astorra', color: '#7B61FF', angle: 144 },
  { name: 'R&R Atelier', short: 'Nails', path: '/atelier', color: '#FF9F4D', angle: 216 },
  { name: 'Sports & Lifestyle', short: 'Clothing Brand', path: '/sports-lifestyle', color: '#4DFFB0', angle: 288 },
]

const RADIUS = 260

export default function Hub() {
  const navigate = useNavigate()

  return (
    <div className="hub-container">
      <motion.div
        className="hub-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        R&R
      </motion.div>

      {divisions.map((division, i) => {
        const rad = (division.angle * Math.PI) / 180
        const x = Math.cos(rad) * RADIUS
        const y = Math.sin(rad) * RADIUS

        return (
          <DivisionCard
            key={division.path}
            division={division}
            x={x}
            y={y}
            delay={0.2 + i * 0.15}
            onClick={() => navigate(division.path)}
          />
        )
      })}
    </div>
  )
}