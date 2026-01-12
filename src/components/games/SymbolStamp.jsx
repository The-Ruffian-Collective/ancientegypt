import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { letterToEmoji } from '../../data/hieroglyphics'
import { useCollection } from '../../context/CollectionContext'
import { useProgress } from '../../context/ProgressContext'
import styles from './SymbolStamp.module.css'

const words = [
  { word: 'CAT', hint: 'Meow!' },
  { word: 'SUN', hint: 'It shines!' },
  { word: 'BIRD', hint: 'It flies!' },
]

function SymbolStamp({ onClose }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [placedSymbols, setPlacedSymbols] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { earnBadge, hasBadge, collectTreasure, hasTreasure } = useCollection()
  const { completeGame } = useProgress()

  const currentWord = words[currentWordIndex]
  const targetLetters = currentWord.word.split('')

  // Get available symbols (all letters in the word plus some distractors)
  const getAvailableSymbols = () => {
    const wordLetters = targetLetters.map(l => l.toLowerCase())
    const distractors = ['m', 'n', 'p', 'r'].filter(l => !wordLetters.includes(l))
    const allLetters = [...new Set([...wordLetters, ...distractors.slice(0, 2)])]

    return allLetters.map(letter => ({
      letter: letter.toUpperCase(),
      emoji: letterToEmoji[letter],
    }))
  }

  const availableSymbols = getAvailableSymbols()

  const handleSymbolClick = (symbol) => {
    if (placedSymbols.length >= targetLetters.length) return

    const expectedLetter = targetLetters[placedSymbols.length]
    const newPlaced = [...placedSymbols, { ...symbol, correct: symbol.letter === expectedLetter }]
    setPlacedSymbols(newPlaced)

    // Check if word is complete
    if (newPlaced.length === targetLetters.length) {
      const allCorrect = newPlaced.every(s => s.correct)
      if (allCorrect) {
        setShowSuccess(true)
        setTimeout(() => {
          if (currentWordIndex < words.length - 1) {
            setCurrentWordIndex(currentWordIndex + 1)
            setPlacedSymbols([])
            setShowSuccess(false)
          } else {
            setIsComplete(true)
            handleGameComplete()
          }
        }, 1500)
      } else {
        // Wrong - shake and reset
        setTimeout(() => {
          setPlacedSymbols([])
        }, 1000)
      }
    }
  }

  const handleGameComplete = () => {
    if (!hasBadge('scribeStamp')) {
      earnBadge('scribeStamp')
    }
    completeGame('symbol-stamp')
  }

  const handleReset = () => {
    setCurrentWordIndex(0)
    setPlacedSymbols([])
    setIsComplete(false)
    setShowSuccess(false)
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
          <h2 className={styles.title}>Symbol Stamp! 📝</h2>
          <p className={styles.instructions}>
            Spell the word with symbols!
          </p>
          <p className={styles.progress}>
            Word {currentWordIndex + 1} of {words.length}
          </p>
        </header>

        {/* Word to spell */}
        <div className={styles.wordArea}>
          <div className={styles.targetWord}>
            <span className={styles.wordText}>{currentWord.word}</span>
            <span className={styles.hint}>({currentWord.hint})</span>
          </div>

          {/* Papyrus with slots */}
          <div className={styles.papyrus}>
            {targetLetters.map((letter, index) => (
              <div
                key={index}
                className={`${styles.slot} ${placedSymbols[index]?.correct === false ? styles.wrong : ''} ${placedSymbols[index]?.correct === true ? styles.correct : ''}`}
              >
                {placedSymbols[index] ? (
                  <motion.span
                    className={styles.placedSymbol}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    {placedSymbols[index].emoji}
                  </motion.span>
                ) : (
                  <span className={styles.letterHint}>{letter}</span>
                )}
              </div>
            ))}
          </div>

          {/* Success message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className={styles.successMessage}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                ✨ Correct! ✨
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available symbols */}
        {!isComplete && (
          <div className={styles.symbolsArea}>
            <p className={styles.symbolsLabel}>Tap a symbol:</p>
            <div className={styles.symbolsGrid}>
              {availableSymbols.map((symbol, index) => (
                <motion.button
                  key={symbol.letter}
                  className={styles.symbolButton}
                  onClick={() => handleSymbolClick(symbol)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={placedSymbols.length >= targetLetters.length}
                >
                  <span className={styles.symbolEmoji}>{symbol.emoji}</span>
                  <span className={styles.symbolLetter}>{symbol.letter}</span>
                </motion.button>
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
              <h3 className={styles.winTitle}>Amazing Scribe!</h3>
              <p className={styles.winText}>You spelled all the words!</p>
              <div className={styles.reward}>
                <span className={styles.rewardIcon}>📝</span>
                <span className={styles.rewardText}>Scribe's Stamp earned!</span>
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

export default SymbolStamp
