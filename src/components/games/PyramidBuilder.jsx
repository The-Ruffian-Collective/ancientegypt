import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './PyramidBuilder.module.css'

// Pyramid structure: 3 levels (bottom: 3 blocks, middle: 2, top: 1)
const pyramidStructure = [
  { level: 0, slots: 3 }, // Bottom row
  { level: 1, slots: 2 }, // Middle row
  { level: 2, slots: 1 }, // Top
]

const totalBlocks = 6
const blockEmojis = ['🧱', '🪨', '📦', '🟫', '🟨', '🟧']

function PyramidBuilder({ onClose }) {
  const [placedBlocks, setPlacedBlocks] = useState([])
  const [availableBlocks, setAvailableBlocks] = useState(
    Array.from({ length: totalBlocks }, (_, i) => ({
      id: i,
      emoji: blockEmojis[i % blockEmojis.length],
    }))
  )
  const [isComplete, setIsComplete] = useState(false)
  const [draggingBlock, setDraggingBlock] = useState(null)
  const gameAreaRef = useRef(null)

  const { earnBadge, hasBadge, collectTreasure, hasTreasure } = useCollection()
  const { completeGame, hasCompletedGame } = useProgress()

  // Calculate which slot a position corresponds to
  const getSlotForPosition = (x, y, gameRect) => {
    const relX = (x - gameRect.left) / gameRect.width
    const relY = (y - gameRect.top) / gameRect.height

    // Check each level from bottom to top
    for (let level = 0; level < pyramidStructure.length; level++) {
      const levelInfo = pyramidStructure[level]
      const levelY = 0.7 - level * 0.2

      // Check if Y is within this level's row
      if (relY > levelY - 0.1 && relY < levelY + 0.1) {
        const slotWidth = 0.15
        const levelWidth = levelInfo.slots * slotWidth
        const startX = 0.5 - levelWidth / 2

        for (let slot = 0; slot < levelInfo.slots; slot++) {
          const slotX = startX + slot * slotWidth + slotWidth / 2
          if (Math.abs(relX - slotX) < slotWidth / 2) {
            return { level, slot }
          }
        }
      }
    }
    return null
  }

  // Check if a slot is already filled
  const isSlotFilled = (level, slot) => {
    return placedBlocks.some(b => b.level === level && b.slot === slot)
  }

  // Check if block can be placed (must have support from below)
  const canPlaceBlock = (level, slot) => {
    if (level === 0) return true // Bottom row always OK

    // Check if blocks below support this position
    if (level === 1) {
      // Middle row needs two blocks below it
      return isSlotFilled(0, slot) && isSlotFilled(0, slot + 1)
    }
    if (level === 2) {
      // Top needs both middle blocks
      return isSlotFilled(1, 0) && isSlotFilled(1, 1)
    }
    return false
  }

  const handleDragEnd = (block, info) => {
    if (!gameAreaRef.current) return

    const gameRect = gameAreaRef.current.getBoundingClientRect()
    const dropPos = getSlotForPosition(info.point.x, info.point.y, gameRect)

    if (dropPos && !isSlotFilled(dropPos.level, dropPos.slot) && canPlaceBlock(dropPos.level, dropPos.slot)) {
      // Place the block
      const newPlaced = [...placedBlocks, { ...block, ...dropPos }]
      setPlacedBlocks(newPlaced)
      setAvailableBlocks(availableBlocks.filter(b => b.id !== block.id))

      // Check for completion
      if (newPlaced.length === totalBlocks) {
        setIsComplete(true)
        handleGameComplete()
      }
    }

    setDraggingBlock(null)
  }

  const handleGameComplete = () => {
    // Award badge
    if (!hasBadge('pyramidBuilder')) {
      earnBadge('pyramidBuilder')
    }

    // Award treasure
    if (!hasTreasure('goldenScarab')) {
      collectTreasure('goldenScarab')
    }

    // Mark game as complete
    if (!hasCompletedGame('pyramid-builder')) {
      completeGame('pyramid-builder')
    }
  }

  const handleReset = () => {
    setPlacedBlocks([])
    setAvailableBlocks(
      Array.from({ length: totalBlocks }, (_, i) => ({
        id: i,
        emoji: blockEmojis[i % blockEmojis.length],
      }))
    )
    setIsComplete(false)
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.gameContainer}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.title}>Build a Pyramid! 🏗️</h2>
          <p className={styles.instructions}>
            Drag the blocks to build your pyramid!
          </p>
        </header>

        {/* Game Area */}
        <div className={styles.gameArea} ref={gameAreaRef}>
          {/* Pyramid slots */}
          <div className={styles.pyramidSlots}>
            {pyramidStructure.map((levelInfo, levelIndex) => (
              <div
                key={levelIndex}
                className={styles.level}
                style={{ '--slots': levelInfo.slots }}
              >
                {Array.from({ length: levelInfo.slots }, (_, slotIndex) => {
                  const placedBlock = placedBlocks.find(
                    b => b.level === levelIndex && b.slot === slotIndex
                  )
                  const canPlace = canPlaceBlock(levelIndex, slotIndex) && !placedBlock

                  return (
                    <div
                      key={slotIndex}
                      className={`${styles.slot} ${canPlace ? styles.available : ''} ${placedBlock ? styles.filled : ''}`}
                    >
                      {placedBlock && (
                        <motion.span
                          className={styles.placedBlock}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          {placedBlock.emoji}
                        </motion.span>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Sand base */}
          <div className={styles.sandBase} />
        </div>

        {/* Available blocks */}
        {!isComplete && (
          <div className={styles.blocksArea}>
            <p className={styles.blocksLabel}>Your blocks:</p>
            <div className={styles.blocksTray}>
              {availableBlocks.map((block) => (
                <motion.div
                  key={block.id}
                  className={styles.draggableBlock}
                  drag
                  dragSnapToOrigin
                  onDragStart={() => setDraggingBlock(block.id)}
                  onDragEnd={(_, info) => handleDragEnd(block, info)}
                  whileDrag={{ scale: 1.2, zIndex: 100 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {block.emoji}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completion celebration */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className={styles.celebration}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <span className={styles.trophy}>🎉</span>
              <h3 className={styles.winTitle}>Amazing!</h3>
              <p className={styles.winText}>You built a pyramid!</p>
              <div className={styles.reward}>
                <span className={styles.rewardIcon}>🪲</span>
                <span className={styles.rewardText}>Golden Scarab earned!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className={styles.buttons}>
          {isComplete ? (
            <>
              <motion.button
                className={styles.resetButton}
                onClick={handleReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
              <motion.button
                className={styles.closeButton}
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Done!
              </motion.button>
            </>
          ) : (
            <motion.button
              className={styles.backButton}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PyramidBuilder
