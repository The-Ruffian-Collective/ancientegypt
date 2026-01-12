import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useProgress } from '../../context/ProgressContext'
import styles from './LocationWrapper.module.css'

function LocationWrapper({ title, children }) {
  const navigate = useNavigate()
  const { visitLocation, currentLocation } = useProgress()

  // Mark location as visited when component mounts
  useEffect(() => {
    if (currentLocation) {
      visitLocation(currentLocation)
    }
  }, [currentLocation, visitLocation])

  const handleBack = () => {
    navigate('/')
  }

  return (
    <motion.div
      className={styles.locationWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header with back button and title */}
      <motion.header
        className={styles.header}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 100 }}
      >
        <button
          className={styles.backButton}
          onClick={handleBack}
          aria-label="Back to map"
        >
          <span className={styles.backArrow}>←</span>
          <span className={styles.backText}>Map</span>
        </button>

        <h1 className={styles.title}>{title}</h1>

        {/* Spacer for centering */}
        <div className={styles.spacer} />
      </motion.header>

      {/* Main content area */}
      <motion.main
        className={styles.content}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
      >
        {children}
      </motion.main>
    </motion.div>
  )
}

export default LocationWrapper
