import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './MatchTheGods.module.css'

const godCards = [
  { id: 'ra', emoji: '☀️', name: 'Ra' },
  { id: 'anubis', emoji: '🐕', name: 'Anubis' },
  { id: 'thoth', emoji: '🦅', name: 'Thoth' },
  { id: 'bastet', emoji: '🐱', name: 'Bastet' },
]

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function MatchTheGods({ onClose }) {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedPairs, setMatchedPairs] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [moves, setMoves] = useState(0)

  const { earnBadge, hasBadge, collectTreasure, hasTreasure } = useCollection()
  const { completeGame } = useProgress()

  // Initialize cards
  useEffect(() => {
    const doubled = [...godCards, ...godCards].map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
    }))
    setCards(shuffleArray(doubled))
  }, [])

  const handleCardClick = (card) => {
    // Don't flip if already matched or already flipped or 2 cards are being checked
    if (
      matchedPairs.includes(card.id) ||
      flippedCards.some(c => c.uniqueId === card.uniqueId) ||
      flippedCards.length >= 2
    ) {
      return
    }

    const newFlipped = [...flippedCards, card]
    setFlippedCards(newFlipped)
    setMoves(m => m + 1)

    // Check for match when 2 cards are flipped
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped

      if (first.id === second.id) {
        // Match found!
        const newMatched = [...matchedPairs, first.id]
        setMatchedPairs(newMatched)
        setFlippedCards([])

        // Check for game completion
        if (newMatched.length === godCards.length) {
          setTimeout(() => {
            setIsComplete(true)
            handleGameComplete()
          }, 500)
        }
      } else {
        // No match - flip back after delay
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const handleGameComplete = () => {
    if (!hasBadge('godMatcher')) {
      earnBadge('godMatcher')
    }
    if (!hasTreasure('pharaohRing')) {
      collectTreasure('pharaohRing')
    }
    completeGame('match-gods')
  }

  const handleReset = () => {
    const doubled = [...godCards, ...godCards].map((card, index) => ({
      ...card,
      uniqueId: `${card.id}-${index}`,
    }))
    setCards(shuffleArray(doubled))
    setFlippedCards([])
    setMatchedPairs([])
    setIsComplete(false)
    setMoves(0)
  }

  const isCardFlipped = (card) => {
    return (
      flippedCards.some(c => c.uniqueId === card.uniqueId) ||
      matchedPairs.includes(card.id)
    )
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
          <h2 className={styles.title}>Match the Gods! 🧩</h2>
          <p className={styles.instructions}>Find the matching pairs!</p>
          <p className={styles.moves}>Moves: {moves}</p>
        </header>

        {/* Cards Grid */}
        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <motion.button
              key={card.uniqueId}
              className={`${styles.card} ${isCardFlipped(card) ? styles.flipped : ''} ${matchedPairs.includes(card.id) ? styles.matched : ''}`}
              onClick={() => handleCardClick(card)}
              whileHover={!isCardFlipped(card) ? { scale: 1.05 } : {}}
              whileTap={!isCardFlipped(card) ? { scale: 0.95 } : {}}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <span className={styles.questionMark}>❓</span>
                </div>
                <div className={styles.cardBack}>
                  <span className={styles.cardEmoji}>{card.emoji}</span>
                  <span className={styles.cardName}>{card.name}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

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
              <h3 className={styles.winTitle}>You did it!</h3>
              <p className={styles.winText}>All gods matched in {moves} moves!</p>
              <div className={styles.reward}>
                <span className={styles.rewardIcon}>💍</span>
                <span className={styles.rewardText}>Pharaoh's Ring earned!</span>
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

export default MatchTheGods
