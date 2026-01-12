import { motion } from 'framer-motion'
import styles from './FunFactPopup.module.css'

function FunFactPopup({ fact, emoji, onClose }) {
  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.popup}
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fun emoji at top */}
        <motion.div
          className={styles.emoji}
          animate={{
            rotate: [-5, 5, -5],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {emoji || '✨'}
        </motion.div>

        {/* Fact text */}
        <p className={styles.factText}>{fact}</p>

        {/* Decorative stars */}
        <div className={styles.stars}>
          <span>⭐</span>
          <span>⭐</span>
          <span>⭐</span>
        </div>

        {/* Close button */}
        <motion.button
          className={styles.closeButton}
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cool!
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default FunFactPopup
