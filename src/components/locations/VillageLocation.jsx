import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ClickableHotspot from '../interactive/ClickableHotspot'
import FunFactPopup from '../interactive/FunFactPopup'
import SailTheNile from '../games/SailTheNile'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './VillageLocation.module.css'

const hotspots = [
  {
    id: 'fisherman',
    position: { x: 75, y: 45 },
    emoji: '🎣',
    label: 'Fishing',
    fact: 'Egyptians caught fish from the Nile river!',
    factEmoji: '🐟',
  },
  {
    id: 'crops',
    position: { x: 20, y: 60 },
    emoji: '🌾',
    label: 'Crops',
    fact: 'The Nile floods helped crops grow!',
    factEmoji: '🌾',
  },
  {
    id: 'toys',
    position: { x: 35, y: 70 },
    emoji: '🎯',
    label: 'Toys',
    fact: 'Egyptian kids played with balls and dolls!',
    factEmoji: '🪀',
  },
  {
    id: 'cat',
    position: { x: 55, y: 75 },
    emoji: '🐱',
    label: 'Pet cat',
    fact: 'Every Egyptian family had pet cats!',
    factEmoji: '🐱',
    isSticker: true,
    stickerId: 'cat',
  },
  {
    id: 'hippo',
    position: { x: 85, y: 60 },
    emoji: '🦛',
    label: 'Hippo',
    fact: 'Hippos lived in the Nile. They are big!',
    factEmoji: '🦛',
  },
  {
    id: 'croc',
    position: { x: 90, y: 75 },
    emoji: '🐊',
    label: 'Crocodile',
    fact: 'Crocodiles swam in the Nile river!',
    factEmoji: '🐊',
    isSticker: true,
    stickerId: 'crocodile',
  },
  {
    id: 'lotus',
    position: { x: 70, y: 70 },
    emoji: '🪷',
    label: 'Lotus flower',
    fact: 'Lotus flowers float on the Nile!',
    factEmoji: '🪷',
    isSticker: true,
    stickerId: 'lotus',
  },
  {
    id: 'papyrus',
    position: { x: 60, y: 55 },
    emoji: '🌿',
    label: 'Papyrus plant',
    fact: 'Papyrus plants grew by the river!',
    factEmoji: '🌿',
    isSticker: true,
    stickerId: 'papyrus',
  },
]

function VillageLocation() {
  const [activeFact, setActiveFact] = useState(null)
  const [showGame, setShowGame] = useState(false)
  const { collectSticker, hasSticker, collectTreasure, hasTreasure } = useCollection()
  const { discoverFact, hasDiscoveredFact } = useProgress()

  const handleHotspotClick = (hotspot) => {
    discoverFact(`village-${hotspot.id}`)

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
      {/* Sky */}
      <div className={styles.sky}>
        <motion.div
          className={styles.sun}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Nile River */}
      <div className={styles.river}>
        <motion.div
          className={styles.riverWaves}
          animate={{ x: [-30, 30, -30] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating boat */}
        <motion.div
          className={styles.boat}
          animate={{
            y: [0, -5, 0],
            rotate: [-2, 2, -2],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          ⛵
        </motion.div>
      </div>

      {/* Land / Village */}
      <div className={styles.land}>
        {/* Houses */}
        <div className={styles.houses}>
          <div className={styles.house}>🏠</div>
          <div className={styles.house}>🏠</div>
          <div className={styles.house}>🏠</div>
        </div>
      </div>

      {/* Interactive hotspots */}
      {hotspots.map((hotspot) => (
        <ClickableHotspot
          key={hotspot.id}
          position={hotspot.position}
          label={hotspot.label}
          onClick={() => handleHotspotClick(hotspot)}
          discovered={hasDiscoveredFact(`village-${hotspot.id}`)}
          pulseColor="blue"
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
        <span className={styles.gameIcon}>⛵</span>
        <span className={styles.gameText}>Sail the Nile!</span>
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

      {/* Sail the Nile Game */}
      <AnimatePresence>
        {showGame && (
          <SailTheNile onClose={() => setShowGame(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default VillageLocation
