import { useState } from 'react'
import { motion } from 'framer-motion'
import { eilidhHieroglyphics, nameToHieroglyphics } from '../../data/hieroglyphics'
import { useCollection } from '../../context/CollectionContext'
import styles from './NameInHieroglyphics.module.css'

function NameInHieroglyphics({ onClose }) {
  const [customName, setCustomName] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const { collectTreasure, hasTreasure } = useCollection()

  // Collect treasure when viewing this feature
  if (!hasTreasure('magicAmulet')) {
    collectTreasure('magicAmulet')
  }

  const customHieroglyphics = customName ? nameToHieroglyphics(customName) : []

  const displayName = showCustom && customName ? customName : 'Eilidh'
  const displayHieroglyphics = showCustom && customName ? customHieroglyphics : eilidhHieroglyphics

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.container}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>

        {/* Title */}
        <motion.h2
          className={styles.title}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          ✨ {displayName}'s Name ✨
        </motion.h2>

        <p className={styles.subtitle}>Written in Ancient Egyptian!</p>

        {/* Hieroglyphics Display */}
        <motion.div
          className={styles.hieroglyphicsDisplay}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.symbolsRow}>
            {displayHieroglyphics.map((item, index) => (
              <motion.div
                key={`${item.letter}-${index}`}
                className={styles.symbolCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <span className={styles.symbol}>{item.emoji}</span>
                <span className={styles.letter}>{item.letter}</span>
              </motion.div>
            ))}
          </div>

          {/* Hieroglyphic symbols below */}
          <div className={styles.actualSymbols}>
            {displayHieroglyphics.map((item, index) => (
              <span key={`symbol-${index}`} className={styles.hieroglyph}>
                {item.symbol}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Symbol explanations */}
        <div className={styles.explanations}>
          <h3 className={styles.explanationTitle}>Each picture makes a sound!</h3>
          <div className={styles.explanationGrid}>
            {displayHieroglyphics.slice(0, 4).map((item, index) => (
              <div key={index} className={styles.explanationItem}>
                <span className={styles.expEmoji}>{item.emoji}</span>
                <span className={styles.expText}>
                  {item.name} = "{item.sound}"
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Try another name section */}
        <div className={styles.tryAnother}>
          <p className={styles.tryText}>Try another name:</p>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={styles.nameInput}
              placeholder="Type a name..."
              value={customName}
              onChange={(e) => setCustomName(e.target.value.slice(0, 12))}
              maxLength={12}
            />
            <button
              className={styles.showButton}
              onClick={() => setShowCustom(customName.length > 0)}
              disabled={!customName}
            >
              Show!
            </button>
          </div>
          {showCustom && customName && (
            <button
              className={styles.backToEilidh}
              onClick={() => {
                setShowCustom(false)
                setCustomName('')
              }}
            >
              ← Back to Eilidh
            </button>
          )}
        </div>

        {/* Reward notice */}
        <motion.div
          className={styles.reward}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <span className={styles.rewardIcon}>🔮</span>
          <span className={styles.rewardText}>Magic Amulet collected!</span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default NameInHieroglyphics
