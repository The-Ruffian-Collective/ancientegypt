import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './SailTheNile.module.css'

const GAME_WIDTH = 300
const GAME_HEIGHT = 400
const BOAT_SIZE = 50
const COLLECTIBLE_SIZE = 35
const GAME_DURATION = 30 // seconds

function SailTheNile({ onClose }) {
  const [gameState, setGameState] = useState('ready') // ready, playing, complete
  const [boatX, setBoatX] = useState(GAME_WIDTH / 2 - BOAT_SIZE / 2)
  const [collectibles, setCollectibles] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const gameAreaRef = useRef(null)
  const touchStartRef = useRef(null)

  const { earnBadge, collectTreasure, hasTreasure } = useCollection()
  const { completeGame } = useProgress()

  // Spawn collectibles
  useEffect(() => {
    if (gameState !== 'playing') return

    const spawnInterval = setInterval(() => {
      const newCollectible = {
        id: Date.now(),
        x: Math.random() * (GAME_WIDTH - COLLECTIBLE_SIZE),
        y: -COLLECTIBLE_SIZE,
        type: Math.random() > 0.3 ? 'lotus' : 'hippo',
      }
      setCollectibles(prev => [...prev, newCollectible])
    }, 1200)

    return () => clearInterval(spawnInterval)
  }, [gameState])

  // Move collectibles down
  useEffect(() => {
    if (gameState !== 'playing') return

    const moveInterval = setInterval(() => {
      setCollectibles(prev => {
        return prev
          .map(c => ({ ...c, y: c.y + 4 }))
          .filter(c => c.y < GAME_HEIGHT)
      })
    }, 50)

    return () => clearInterval(moveInterval)
  }, [gameState])

  // Check collisions
  useEffect(() => {
    if (gameState !== 'playing') return

    const boatRect = {
      left: boatX,
      right: boatX + BOAT_SIZE,
      top: GAME_HEIGHT - BOAT_SIZE - 10,
      bottom: GAME_HEIGHT - 10,
    }

    setCollectibles(prev => {
      const remaining = []
      for (const c of prev) {
        const collectibleRect = {
          left: c.x,
          right: c.x + COLLECTIBLE_SIZE,
          top: c.y,
          bottom: c.y + COLLECTIBLE_SIZE,
        }

        const collision =
          boatRect.left < collectibleRect.right &&
          boatRect.right > collectibleRect.left &&
          boatRect.top < collectibleRect.bottom &&
          boatRect.bottom > collectibleRect.top

        if (collision) {
          if (c.type === 'lotus') {
            setScore(s => s + 1)
          }
          // Hippos just give a friendly bump - no penalty
        } else {
          remaining.push(c)
        }
      }
      return remaining
    })
  }, [boatX, collectibles, gameState])

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setGameState('complete')
          handleGameComplete()
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  const handleGameComplete = () => {
    earnBadge('riverSailor')
    if (!hasTreasure('nilePearl')) {
      collectTreasure('nilePearl')
    }
    completeGame('sail-nile')
  }

  const handleStart = () => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setCollectibles([])
    setBoatX(GAME_WIDTH / 2 - BOAT_SIZE / 2)
  }

  const handleReset = () => {
    setGameState('ready')
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setCollectibles([])
  }

  // Touch/mouse controls
  const handleMove = useCallback((clientX) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return

    const rect = gameAreaRef.current.getBoundingClientRect()
    const x = clientX - rect.left - BOAT_SIZE / 2
    const clampedX = Math.max(0, Math.min(GAME_WIDTH - BOAT_SIZE, x))
    setBoatX(clampedX)
  }, [gameState])

  const handleTouchMove = (e) => {
    e.preventDefault()
    handleMove(e.touches[0].clientX)
  }

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return
    handleMove(e.clientX)
  }

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setBoatX(x => Math.max(0, x - 20))
      } else if (e.key === 'ArrowRight') {
        setBoatX(x => Math.min(GAME_WIDTH - BOAT_SIZE, x + 20))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

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
          <h2 className={styles.title}>Sail the Nile! ⛵</h2>
          {gameState === 'playing' && (
            <div className={styles.stats}>
              <span className={styles.score}>🪷 {score}</span>
              <span className={styles.timer}>⏱️ {timeLeft}s</span>
            </div>
          )}
        </header>

        {/* Game Area */}
        <div
          ref={gameAreaRef}
          className={styles.gameArea}
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onMouseDown={(e) => handleMove(e.clientX)}
        >
          {/* Water background */}
          <div className={styles.water}>
            <motion.div
              className={styles.waves}
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          {/* Ready screen */}
          {gameState === 'ready' && (
            <div className={styles.readyScreen}>
              <p className={styles.readyText}>Collect lotus flowers! 🪷</p>
              <p className={styles.readySubtext}>
                Move the boat left and right
              </p>
              <motion.button
                className={styles.startButton}
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start!
              </motion.button>
            </div>
          )}

          {/* Collectibles */}
          {gameState === 'playing' && collectibles.map(c => (
            <motion.div
              key={c.id}
              className={styles.collectible}
              style={{
                left: c.x,
                top: c.y,
                width: COLLECTIBLE_SIZE,
                height: COLLECTIBLE_SIZE,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              {c.type === 'lotus' ? '🪷' : '🦛'}
            </motion.div>
          ))}

          {/* Boat */}
          {gameState === 'playing' && (
            <motion.div
              className={styles.boat}
              style={{
                left: boatX,
                bottom: 10,
                width: BOAT_SIZE,
                height: BOAT_SIZE,
              }}
              animate={{
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ⛵
            </motion.div>
          )}

          {/* Complete screen */}
          {gameState === 'complete' && (
            <motion.div
              className={styles.completeScreen}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className={styles.trophy}>🎉</span>
              <h3 className={styles.completeTitle}>Great sailing!</h3>
              <p className={styles.completeScore}>
                You collected {score} lotus flowers!
              </p>
              <div className={styles.reward}>
                <span className={styles.rewardIcon}>🦪</span>
                <span className={styles.rewardText}>Nile Pearl earned!</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        {gameState === 'playing' && (
          <p className={styles.instructions}>
            👆 Touch & drag or use arrow keys
          </p>
        )}

        {/* Buttons */}
        <div className={styles.buttons}>
          {gameState === 'complete' ? (
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

export default SailTheNile
