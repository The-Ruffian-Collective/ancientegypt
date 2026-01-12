import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClickableHotspot from '../interactive/ClickableHotspot'
import FunFactPopup from '../interactive/FunFactPopup'
import PyramidBuilder from '../games/PyramidBuilder'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './PyramidLocation.module.css'

const hotspots = [
  {
    id: 'blocks',
    position: { x: 35, y: 45 },
    emoji: '🧱',
    label: 'Stone blocks',
    fact: 'The Great Pyramid has 2 million blocks!',
    factEmoji: '🧱',
  },
  {
    id: 'workers',
    position: { x: 20, y: 70 },
    emoji: '👷',
    label: 'Workers',
    fact: 'Thousands of workers built the pyramids!',
    factEmoji: '👷',
  },
  {
    id: 'tomb',
    position: { x: 50, y: 50 },
    emoji: '⚱️',
    label: 'Peek inside',
    fact: 'Pharaohs were buried with their treasures!',
    factEmoji: '💎',
  },
  {
    id: 'cat',
    position: { x: 70, y: 65 },
    emoji: '🐱',
    label: 'Bastet the cat',
    fact: 'Egyptians loved cats. They were sacred!',
    factEmoji: '🐱',
    isSticker: true,
    stickerId: 'cat',
  },
  {
    id: 'sphinx',
    position: { x: 85, y: 55 },
    emoji: '🦁',
    label: 'The Sphinx',
    fact: 'The Sphinx has a lion body and human head!',
    factEmoji: '🦁',
    isTreasure: true,
    treasureId: 'hiddenSphinx',
  },
]

function PyramidLocation() {
  const [activeFact, setActiveFact] = useState(null)
  const [showGame, setShowGame] = useState(false)
  const { hasTreasure, collectTreasure, hasSticker, collectSticker } = useCollection()
  const { discoverFact, hasDiscoveredFact } = useProgress()

  const handleHotspotClick = (hotspot) => {
    // Record fact discovery
    discoverFact(`pyramid-${hotspot.id}`)

    // Collect sticker if applicable
    if (hotspot.isSticker && hotspot.stickerId && !hasSticker(hotspot.stickerId)) {
      collectSticker(hotspot.stickerId)
    }

    // Collect treasure if applicable
    if (hotspot.isTreasure && hotspot.treasureId && !hasTreasure(hotspot.treasureId)) {
      collectTreasure(hotspot.treasureId)
    }

    // Show the fact popup
    setActiveFact(hotspot)
  }

  return (
    <div className={styles.location}>
      {/* Sky and background */}
      <div className={styles.background}>
        {/* Sun */}
        <motion.div
          className={styles.sun}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Clouds */}
        <motion.div
          className={`${styles.cloud} ${styles.cloud1}`}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className={`${styles.cloud} ${styles.cloud2}`}
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Main pyramid illustration */}
      <div className={styles.pyramidArea}>
        {/* The pyramid itself */}
        <motion.div
          className={styles.pyramid}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.pyramidShape} />

          {/* Entrance to pyramid */}
          <div className={styles.entrance} />
        </motion.div>

        {/* Sand dunes */}
        <div className={styles.sand} />
      </div>

      {/* Interactive hotspots */}
      {hotspots.map((hotspot, index) => (
        <ClickableHotspot
          key={hotspot.id}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => handleHotspotClick(hotspot)}
          discovered={hasDiscoveredFact(`pyramid-${hotspot.id}`)}
          pulseColor={hotspot.isTreasure ? 'gold' : 'terracotta'}
        >
          {hotspot.emoji}
        </ClickableHotspot>
      ))}

      {/* Play Game Button */}
      <motion.button
        className={styles.gameButton}
        onClick={() => setShowGame(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className={styles.gameIcon}>🏗️</span>
        <span className={styles.gameText}>Build a Pyramid!</span>
      </motion.button>

      {/* Fun Fact Popup */}
      <AnimatePresence>
        {activeFact && (
          <FunFactPopup
            fact={activeFact.fact}
            emoji={activeFact.factEmoji}
            onClose={() => setActiveFact(null)}
          />
        )}
      </AnimatePresence>

      {/* Pyramid Builder Game */}
      <AnimatePresence>
        {showGame && (
          <PyramidBuilder onClose={() => setShowGame(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PyramidLocation
