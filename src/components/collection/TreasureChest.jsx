import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollection } from '../../context/CollectionContext'
import CollectionBook from './CollectionBook'
import styles from './TreasureChest.module.css'

function TreasureChest() {
  const [isOpen, setIsOpen] = useState(false)
  const { totalFound, totalPossible } = useCollection()

  return (
    <>
      {/* Floating Treasure Chest Button */}
      <motion.button
        className={styles.chestButton}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label={`Open treasure chest. ${totalFound} of ${totalPossible} items collected.`}
      >
        <span className={styles.chestIcon}>🪙</span>
        {totalFound > 0 && (
          <motion.span
            className={styles.badge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            {totalFound}
          </motion.span>
        )}

        {/* Sparkle effect */}
        <motion.span
          className={styles.sparkle}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ✨
        </motion.span>
      </motion.button>

      {/* Collection Book Modal */}
      <AnimatePresence>
        {isOpen && (
          <CollectionBook onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default TreasureChest
