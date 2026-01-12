import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClickableHotspot from '../interactive/ClickableHotspot'
import FunFactPopup from '../interactive/FunFactPopup'
import NameInHieroglyphics from '../hieroglyphics/NameInHieroglyphics'
import SymbolStamp from '../games/SymbolStamp'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './TempleLocation.module.css'

const hotspots = [
  {
    id: 'scribe',
    position: { x: 20, y: 55 },
    emoji: '📝',
    label: 'Scribe',
    fact: 'Scribes went to school for many years!',
    factEmoji: '📜',
  },
  {
    id: 'papyrus',
    position: { x: 80, y: 60 },
    emoji: '📜',
    label: 'Papyrus',
    fact: 'Papyrus paper was made from river plants!',
    factEmoji: '🌿',
  },
  {
    id: 'inkpot',
    position: { x: 30, y: 75 },
    emoji: '🖋️',
    label: 'Ink pot',
    fact: 'Scribes wrote with brushes and black ink!',
    factEmoji: '🖌️',
  },
  {
    id: 'eyeOfHorus',
    position: { x: 70, y: 30 },
    emoji: '👁️',
    label: 'Eye of Horus',
    fact: 'The Eye of Horus means protection!',
    factEmoji: '👁️',
    isSticker: true,
    stickerId: 'eyeOfHorus',
  },
  {
    id: 'ibis',
    position: { x: 85, y: 45 },
    emoji: '🦩',
    label: 'Ibis bird',
    fact: 'Thoth the wisdom god has an ibis head!',
    factEmoji: '🦩',
    isSticker: true,
    stickerId: 'ibis',
  },
]

function TempleLocation() {
  const [activeFact, setActiveFact] = useState(null)
  const [showNameFeature, setShowNameFeature] = useState(false)
  const [showGame, setShowGame] = useState(false)
  const { collectSticker, hasSticker, collectTreasure, hasTreasure } = useCollection()
  const { discoverFact, hasDiscoveredFact } = useProgress()

  const handleHotspotClick = (hotspot) => {
    discoverFact(`temple-${hotspot.id}`)

    if (hotspot.isSticker && hotspot.stickerId && !hasSticker(hotspot.stickerId)) {
      collectSticker(hotspot.stickerId)
    }

    if (hotspot.isTreasure && hotspot.treasureId && !hasTreasure(hotspot.treasureId)) {
      collectTreasure(hotspot.treasureId)
    }

    setActiveFact(hotspot)
  }

  return (
    <div className={styles.location}>
      {/* Temple background */}
      <div className={styles.background}>
        {/* Temple wall with hieroglyphics */}
        <div className={styles.wall}>
          {/* Decorative hieroglyphics on wall */}
          <div className={styles.wallSymbols}>
            <span>𓀀</span>
            <span>𓃀</span>
            <span>𓄿</span>
            <span>𓆑</span>
            <span>𓇋</span>
            <span>𓉔</span>
            <span>𓊪</span>
            <span>𓋴</span>
          </div>
        </div>
      </div>

      {/* Temple floor */}
      <div className={styles.floor} />

      {/* Main attraction - Eilidh's Name in Hieroglyphics */}
      <motion.button
        className={styles.nameFeature}
        onClick={() => setShowNameFeature(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className={styles.nameGlow}
          animate={{
            boxShadow: [
              '0 0 20px rgba(255, 215, 0, 0.3)',
              '0 0 40px rgba(255, 215, 0, 0.6)',
              '0 0 20px rgba(255, 215, 0, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className={styles.nameTitle}>✨ Your Name! ✨</span>
        <div className={styles.namePreview}>
          <span className={styles.hieroglyphPreview}>𓇋𓇋𓃭𓇋𓂧𓉔</span>
        </div>
        <span className={styles.nameCta}>Tap to see Eilidh's name!</span>
      </motion.button>

      {/* Interactive hotspots */}
      {hotspots.map((hotspot) => (
        <ClickableHotspot
          key={hotspot.id}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => handleHotspotClick(hotspot)}
          discovered={hasDiscoveredFact(`temple-${hotspot.id}`)}
          pulseColor="gold"
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
        <span className={styles.gameIcon}>📝</span>
        <span className={styles.gameText}>Symbol Stamp!</span>
      </motion.button>

      {/* Name in Hieroglyphics Feature */}
      <AnimatePresence>
        {showNameFeature && (
          <NameInHieroglyphics onClose={() => setShowNameFeature(false)} />
        )}
      </AnimatePresence>

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

      {/* Symbol Stamp Game */}
      <AnimatePresence>
        {showGame && (
          <SymbolStamp onClose={() => setShowGame(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default TempleLocation
