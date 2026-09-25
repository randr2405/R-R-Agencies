import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

export default function PageWrapper({ title, children }) {
  const location = useLocation()
  const color = location.state?.color || '#7B61FF'

  return (
    <motion.div
      className="division-page"
      style={{ '--accent': color }}
      initial={{ clipPath: 'circle(0% at 50% 50%)' }}
      animate={{ clipPath: 'circle(150% at 50% 50%)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      <Link to="/" className="back-link">← Back to hub</Link>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {title}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}