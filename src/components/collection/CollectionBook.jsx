import { motion } from 'framer-motion'
import { useCollection } from '../../context/CollectionContext'
import styles from './CollectionBook.module.css'

const treasureEmojis = {
  goldenScarab: '🪲',
  pharaohRing: '💍',
  magicAmulet: '🔮',
  nilePearl: '🦪',
  hiddenSphinx: '🦁',
}

const badgeEmojis = {
  pyramidBuilder: '🏗️',
  godMatcher: '🧩',
  scribeStamp: '📝',
  riverSailor: '⛵',
}

const stickerEmojis = {
  cat: '🐱',
  lotus: '🪷',
  eyeOfHorus: '👁️',
  ankh: '☥',
  crocodile: '🐊',
  ibis: '🦩',
  sunDisc: '☀️',
  papyrus: '🌿',
}

function CollectionBook({ onClose }) {
  const {
    treasures,
    badges,
    stickers,
    totalFound,
    totalPossible,
    progress,
  } = useCollection()

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.book}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close collection"
        >
          ✕
        </button>

        {/* Header */}
        <header className={styles.header}>
          <h2 className={styles.title}>Eilidh's Treasures</h2>
          <div className={styles.progressBar}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <p className={styles.progressText}>
            {totalFound} of {totalPossible} collected!
          </p>
        </header>

        {/* Treasures Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>✨</span> Treasures
          </h3>
          <div className={styles.grid}>
            {Object.entries(treasures).map(([id, treasure]) => (
              <motion.div
                key={id}
                className={`${styles.item} ${treasure.found ? styles.found : styles.notFound}`}
                whileHover={treasure.found ? { scale: 1.1, rotate: 5 } : {}}
              >
                <span className={styles.itemIcon}>
                  {treasure.found ? treasureEmojis[id] : '❓'}
                </span>
                <span className={styles.itemName}>
                  {treasure.found ? treasure.name : '???'}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Badges Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>🏆</span> Badges
          </h3>
          <div className={styles.grid}>
            {Object.entries(badges).map(([id, badge]) => (
              <motion.div
                key={id}
                className={`${styles.item} ${badge.earned ? styles.found : styles.notFound}`}
                whileHover={badge.earned ? { scale: 1.1, rotate: 5 } : {}}
              >
                <span className={styles.itemIcon}>
                  {badge.earned ? badgeEmojis[id] : '🔒'}
                </span>
                <span className={styles.itemName}>
                  {badge.earned ? badge.name : '???'}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stickers Section */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>⭐</span> Stickers
          </h3>
          <div className={styles.grid}>
            {Object.entries(stickers).map(([id, sticker]) => (
              <motion.div
                key={id}
                className={`${styles.item} ${styles.sticker} ${sticker.found ? styles.found : styles.notFound}`}
                whileHover={sticker.found ? { scale: 1.1 } : {}}
              >
                <span className={styles.stickerIcon}>
                  {sticker.found ? stickerEmojis[id] : '?'}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Completion Message */}
        {progress === 100 && (
          <motion.div
            className={styles.completion}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            🎉 Amazing Explorer! You found everything! 🎉
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CollectionBook
