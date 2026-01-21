import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useProgress } from '../../context/ProgressContext'
import { useCollection } from '../../context/CollectionContext'
import { useEffect } from 'react'
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

// Helper function to create curved path between two points
function createCurvedPath(from, to) {
  const controlX = (from.x + to.x) / 2
  const controlY = Math.min(from.y, to.y) - 5
  return `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`
}

// SVG Dune component with wave shapes
function DuneLayer({ layerIndex, mouseX, mouseY }) {
  const parallaxX = useTransform(mouseX, [0, 1], [-5 + layerIndex * 2, 5 - layerIndex * 2])
  const parallaxY = useTransform(mouseY, [0, 1], [-3 + layerIndex, 3 - layerIndex])

  const colors = [
    ['#F4A460', '#DEB887'],
    ['#E8C39E', '#D2B48C'],
    ['#DEB887', '#C8AD7F'],
  ]

  const heights = ['70%', '60%', '50%']
  const widths = ['120%', '110%', '100%']

  return (
    <motion.svg
      className={`${styles.duneSvg} ${styles[`dune${layerIndex + 1}`]}`}
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      style={{ x: parallaxX, y: parallaxY }}
    >
      <defs>
        <linearGradient id={`duneGradient${layerIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[layerIndex][0]} />
          <stop offset="100%" stopColor={colors[layerIndex][1]} />
        </linearGradient>
      </defs>
      <path
        d={
          layerIndex === 0
            ? 'M0,200 Q300,150 600,180 T1200,200 L1200,400 L0,400 Z'
            : layerIndex === 1
            ? 'M0,250 Q400,200 800,230 T1200,250 L1200,400 L0,400 Z'
            : 'M0,280 Q350,240 700,270 T1200,280 L1200,400 L0,400 Z'
        }
        fill={`url(#duneGradient${layerIndex})`}
      />
    </motion.svg>
  )
}

// SVG Palm Tree component
function PalmTree({ className }) {
  return (
    <svg
      className={className}
      width="80"
      height="120"
      viewBox="0 0 80 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <path
        d="M35 60 Q37 75 35 90 Q33 100 35 115"
        stroke="#8B4513"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Palm fronds */}
      <path
        d="M35 60 Q25 40 15 20 Q10 10 5 5"
        stroke="#228B22"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q35 35 35 10 Q35 5 35 0"
        stroke="#228B22"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q45 40 55 20 Q60 10 65 5"
        stroke="#228B22"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q50 50 70 45 Q75 43 80 42"
        stroke="#2E8B57"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M35 60 Q20 50 5 45 Q2 43 0 42"
        stroke="#2E8B57"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Pyramid Silhouette component
function PyramidSilhouette({ className, size = 'medium' }) {
  const sizes = {
    small: { width: 60, height: 50 },
    medium: { width: 80, height: 70 },
    large: { width: 100, height: 90 },
  }

  const { width, height } = sizes[size]

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M${width / 2} 0 L${width} ${height} L0 ${height} Z`}
        fill="rgba(139, 69, 19, 0.3)"
        stroke="rgba(139, 69, 19, 0.5)"
        strokeWidth="1"
      />
      {/* Detail lines */}
      <line
        x1={width / 2}
        y1="0"
        x2={width / 2}
        y2={height}
        stroke="rgba(139, 69, 19, 0.4)"
        strokeWidth="1"
      />
    </svg>
  )
}

function MapView() {
  const navigate = useNavigate()
  const { hasVisited, setCurrentLocation } = useProgress()
  const { progress } = useCollection()

  // Mouse position for parallax effect
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const handleLocationClick = (location) => {
    setCurrentLocation(location.id)
    navigate(location.path)
  }

  return (
    <div className={styles.mapContainer}>
      {/* Papyrus texture overlay */}
      <div className={styles.papyrusTexture} />

      {/* Vignette effect */}
      <div className={styles.vignette} />

      {/* Sky gradient background */}
      <div className={styles.sky} />

      {/* Distant pyramid silhouettes */}
      <div className={styles.horizonPyramids}>
        <PyramidSilhouette className={styles.pyramid1} size="small" />
        <PyramidSilhouette className={styles.pyramid2} size="medium" />
        <PyramidSilhouette className={styles.pyramid3} size="large" />
      </div>

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

      {/* Desert/Ground with SVG dunes */}
      <div className={styles.desert}>
        <DuneLayer layerIndex={0} mouseX={mouseX} mouseY={mouseY} />
        <DuneLayer layerIndex={1} mouseX={mouseX} mouseY={mouseY} />
        <DuneLayer layerIndex={2} mouseX={mouseX} mouseY={mouseY} />

        {/* Nile River */}
        <div className={styles.nile}>
          <motion.div
            className={styles.nileWave}
            animate={{ x: [-20, 20, -20] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Path connections between locations */}
      <svg className={styles.pathConnections} viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <style>
            {`
              @keyframes marchDashes {
                to {
                  stroke-dashoffset: -20;
                }
              }
            `}
          </style>
        </defs>
        {/* Pyramid to Temple */}
        <path
          d={createCurvedPath(
            locations[0].position,
            locations[2].position
          )}
          className={styles.treasurePath}
        />
        {/* Temple to Village */}
        <path
          d={createCurvedPath(
            locations[2].position,
            locations[3].position
          )}
          className={styles.treasurePath}
        />
        {/* Pyramid to Palace */}
        <path
          d={createCurvedPath(
            locations[0].position,
            locations[1].position
          )}
          className={styles.treasurePath}
        />
        {/* Palace to Village */}
        <path
          d={createCurvedPath(
            locations[1].position,
            locations[3].position
          )}
          className={styles.treasurePath}
        />
      </svg>

      {/* Location Cards */}
      <div className={styles.locationsLayer}>
        {locations.map((location, index) => {
          const isVisited = hasVisited(location.id)

          return (
            <motion.button
              key={location.id}
              className={`${styles.locationCard} ${styles[`card_${location.id}`]}`}
              style={{
                left: `${location.position.x}%`,
                top: `${location.position.y}%`,
              }}
              initial={{ scale: 0, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.3 + index * 0.15,
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35), 0 0 25px rgba(218, 165, 32, 0.3)'
              }}
              whileTap={{
                scale: 0.98,
                y: -2
              }}
              onClick={() => handleLocationClick(location)}
            >
              {/* Card Background Pattern */}
              <div className={styles.cardPattern} />

              {/* Parchment Texture Overlay */}
              <div className={styles.cardTexture} />

              {/* Visit Status Badge */}
              {isVisited ? (
                <motion.div
                  className={styles.goldStar}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.5 + index * 0.15 }}
                >
                  <motion.span
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    ⭐
                  </motion.span>
                </motion.div>
              ) : (
                <div className={styles.unvisitedBadge}>?</div>
              )}

              {/* Card Content */}
              <div className={styles.cardContent}>
                {/* Main Emoji Icon */}
                <motion.div
                  className={styles.cardEmoji}
                  animate={isVisited ? {
                    y: [0, -4, 0],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                >
                  {location.emoji}
                </motion.div>

                {/* Location Info */}
                <h3 className={styles.cardTitle}>{location.name}</h3>
                <p className={styles.cardDescription}>{location.description}</p>
              </div>

              {/* Golden Shimmer for Visited Cards */}
              {isVisited && (
                <motion.div
                  className={styles.shimmer}
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorations}>
        {/* SVG Palm trees */}
        <PalmTree className={`${styles.palm} ${styles.palm1}`} />
        <PalmTree className={`${styles.palm} ${styles.palm2}`} />

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

        {/* Floating sand particles */}
        <motion.div
          className={`${styles.sandParticle} ${styles.particle1}`}
          animate={{
            x: [0, 30, 0],
            y: [0, -50, -100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className={`${styles.sandParticle} ${styles.particle2}`}
          animate={{
            x: [0, -20, 0],
            y: [0, -40, -80],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className={`${styles.sandParticle} ${styles.particle3}`}
          animate={{
            x: [0, 25, 0],
            y: [0, -60, -120],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
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
