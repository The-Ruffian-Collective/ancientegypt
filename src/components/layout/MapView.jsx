import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgress } from '../../context/ProgressContext'
import { useCollection } from '../../context/CollectionContext'
import styles from './MapView.module.css'

const locations = [
  {
    id: 'pyramid',
    name: 'The Golden Pyramid',
    path: '/pyramid',
    position: { x: 25, y: 55 },
    emoji: '🏛️',
    description: 'Explore the ancient tomb!',
  },
  {
    id: 'palace',
    name: "Pharaoh's Palace",
    path: '/palace',
    position: { x: 70, y: 35 },
    emoji: '👑',
    description: 'Meet the Egyptian gods!',
  },
  {
    id: 'temple',
    name: 'Hieroglyphics Temple',
    path: '/temple',
    position: { x: 55, y: 65 },
    emoji: '📜',
    description: 'See your name in symbols!',
  },
  {
    id: 'village',
    name: 'Nile Village',
    path: '/village',
    position: { x: 75, y: 70 },
    emoji: '🌊',
    description: 'Sail the magical river!',
  },
]

function MapView() {
  const navigate = useNavigate()
  const { hasVisited, setCurrentLocation } = useProgress()
  const { progress } = useCollection()

  const handleLocationClick = (location) => {
    setCurrentLocation(location.id)
    navigate(location.path)
  }

  return (
    <div className={styles.mapContainer}>
      {/* Sky gradient background */}
      <div className={styles.sky} />

      {/* Title Banner */}
      <motion.header
        className={styles.header}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <h1 className={styles.title}>
          <span className={styles.titleSmall}>Welcome to</span>
          Eilidh's Egyptian Adventure
        </h1>
        {progress > 0 && (
          <div className={styles.progressBadge}>
            {progress}% Explorer
          </div>
        )}
      </motion.header>

      {/* Decorative Sun */}
      <motion.div
        className={styles.sun}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Desert/Ground */}
      <div className={styles.desert}>
        {/* Sand dunes */}
        <div className={styles.dune1} />
        <div className={styles.dune2} />
        <div className={styles.dune3} />

        {/* Nile River */}
        <div className={styles.nile}>
          <motion.div
            className={styles.nileWave}
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Location Hotspots */}
      <div className={styles.locationsLayer}>
        {locations.map((location, index) => (
          <motion.button
            key={location.id}
            className={styles.locationButton}
            style={{
              left: `${location.position.x}%`,
              top: `${location.position.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2 + index * 0.1,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleLocationClick(location)}
          >
            <motion.div
              className={styles.locationIcon}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.3,
              }}
            >
              <span className={styles.emoji}>{location.emoji}</span>
              {hasVisited(location.id) && (
                <span className={styles.visitedCheck}>✓</span>
              )}
            </motion.div>
            <div className={styles.locationLabel}>
              <span className={styles.locationName}>{location.name}</span>
              <span className={styles.locationDesc}>{location.description}</span>
            </div>

            {/* Glowing pulse effect */}
            <motion.div
              className={styles.pulseRing}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorations}>
        {/* Palm trees */}
        <div className={`${styles.palm} ${styles.palm1}`}>🌴</div>
        <div className={`${styles.palm} ${styles.palm2}`}>🌴</div>

        {/* Camel */}
        <motion.div
          className={styles.camel}
          animate={{ x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🐪
        </motion.div>

        {/* Birds */}
        <motion.div
          className={styles.bird}
          animate={{
            x: [0, 100, 200],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
          🐦
        </motion.div>
      </div>

      {/* Instruction hint */}
      <motion.p
        className={styles.hint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Tap a place to explore!
      </motion.p>
    </div>
  )
}

export default MapView
