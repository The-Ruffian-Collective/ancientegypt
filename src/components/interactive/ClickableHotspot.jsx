import { motion } from 'framer-motion'
import styles from './ClickableHotspot.module.css'

function ClickableHotspot({
  position,
  size = { width: 60, height: 60 },
  onClick,
  children,
  label,
  pulseColor = 'gold',
  discovered = false,
}) {
  return (
    <motion.button
      className={styles.hotspot}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: size.width,
        height: size.height,
      }}
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      aria-label={label}
    >
      {/* Content (emoji or icon) */}
      <motion.div
        className={styles.content}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
        {discovered && <span className={styles.checkmark}>✓</span>}
      </motion.div>

      {/* Pulse ring */}
      {!discovered && (
        <motion.div
          className={`${styles.pulse} ${styles[pulseColor]}`}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      )}

      {/* Label tooltip */}
      {label && (
        <span className={styles.tooltip}>{label}</span>
      )}
    </motion.button>
  )
}

export default ClickableHotspot
