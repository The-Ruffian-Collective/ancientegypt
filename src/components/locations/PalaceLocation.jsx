import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClickableHotspot from '../interactive/ClickableHotspot'
import FunFactPopup from '../interactive/FunFactPopup'
import MatchTheGods from '../games/MatchTheGods'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './PalaceLocation.module.css'

const gods = [
  { id: 'ra', name: 'Ra', emoji: '☀️', fact: 'Ra is the sun god. He sails across the sky!', position: { x: 25, y: 45 } },
  { id: 'anubis', name: 'Anubis', emoji: '🐕', fact: 'Anubis has a jackal head. He guards tombs!', position: { x: 45, y: 50 } },
  { id: 'thoth', name: 'Thoth', emoji: '🦅', fact: 'Thoth is the god of writing and wisdom!', position: { x: 65, y: 45 } },
  { id: 'bastet', name: 'Bastet', emoji: '🐱', fact: 'Bastet is the cat goddess. Meow!', position: { x: 80, y: 55 } },
]

const hotspots = [
  {
    id: 'crown',
    position: { x: 50, y: 25 },
    emoji: '👑',
    label: 'Royal Crown',
    fact: 'Pharaohs wore special crowns called nemes!',
    factEmoji: '👑',
  },
  {
    id: 'ankh',
    position: { x: 15, y: 60 },
    emoji: '☥',
    label: 'Ankh Symbol',
    fact: 'The ankh means eternal life!',
    factEmoji: '☥',
    isSticker: true,
    stickerId: 'ankh',
  },
  {
    id: 'feast',
    position: { x: 85, y: 75 },
    emoji: '🍇',
    label: 'Royal Feast',
    fact: 'Pharaohs ate grapes, figs, and honey!',
    factEmoji: '🍯',
  },
]

function PalaceLocation() {
  const [activeFact, setActiveFact] = useState(null)
  const [showGame, setShowGame] = useState(false)
  const { collectSticker, hasSticker, collectTreasure, hasTreasure } = useCollection()
  const { discoverFact, hasDiscoveredFact } = useProgress()

  const handleHotspotClick = (hotspot) => {
    discoverFact(`palace-${hotspot.id}`)

    if (hotspot.isSticker && hotspot.stickerId && !hasSticker(hotspot.stickerId)) {
      collectSticker(hotspot.stickerId)
    }

    setActiveFact(hotspot)
  }

  const handleGodClick = (god) => {
    discoverFact(`palace-god-${god.id}`)
    setActiveFact({
      id: god.id,
      fact: god.fact,
      factEmoji: god.emoji,
    })
  }

  return (
    <div className={styles.location}>
      {/* Background */}
      <div className={styles.background}>
        {/* Decorative columns */}
        <div className={`${styles.column} ${styles.column1}`} />
        <div className={`${styles.column} ${styles.column2}`} />
        <div className={`${styles.column} ${styles.column3}`} />
      </div>

      {/* Palace floor */}
      <div className={styles.floor}>
        {/* Throne */}
        <motion.div
          className={styles.throne}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className={styles.throneEmoji}>🪑</span>
        </motion.div>
      </div>

      {/* Egyptian Gods */}
      <div className={styles.godsRow}>
        {gods.map((god, index) => (
          <motion.button
            key={god.id}
            className={styles.godButton}
            style={{
              left: `${god.position.x}%`,
              top: `${god.position.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGodClick(god)}
          >
            <span className={styles.godEmoji}>{god.emoji}</span>
            <span className={styles.godName}>{god.name}</span>
            {hasDiscoveredFact(`palace-god-${god.id}`) && (
              <span className={styles.godCheck}>✓</span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Other hotspots */}
      {hotspots.map((hotspot) => (
        <ClickableHotspot
          key={hotspot.id}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => handleHotspotClick(hotspot)}
          discovered={hasDiscoveredFact(`palace-${hotspot.id}`)}
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
        <span className={styles.gameIcon}>🧩</span>
        <span className={styles.gameText}>Match the Gods!</span>
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

      {/* Match the Gods Game */}
      <AnimatePresence>
        {showGame && (
          <MatchTheGods onClose={() => setShowGame(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PalaceLocation
