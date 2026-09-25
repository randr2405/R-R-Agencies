import { motion } from 'framer-motion'

export default function DivisionCard({ division, x, y, delay, onClick }) {
  return (
    <motion.button
      className="division-node"
      style={{ '--accent': division.color }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: [x, x, x + Math.sin(delay) * 6, x],
        y: [y, y - 6, y, y],
        opacity: 1,
        scale: 1,
      }}
      transition={{
        x: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
        opacity: { duration: 0.7, delay },
        scale: { duration: 0.7, delay, ease: 'backOut' },
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
    >
      <span className="division-name">{division.name}</span>
      <span className="division-short">{division.short}</span>
    </motion.button>
  )
}