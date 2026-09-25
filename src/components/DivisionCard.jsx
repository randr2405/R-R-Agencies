import { motion } from 'framer-motion'

export default function DivisionCard({ division, x, y, delay, onClick }) {
  return (
    <motion.button
      className="division-node"
      style={{ '--accent': division.color }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ x, y, opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="division-name">{division.name}</span>
      <span className="division-short">{division.short}</span>
    </motion.button>
  )
}