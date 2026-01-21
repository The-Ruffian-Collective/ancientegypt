import styles from './SandParticles.module.css'

// Generate particle data with varied positions and animation properties
const particles = [
  { id: 1, size: 4, top: 15, delay: 0, duration: 18 },
  { id: 2, size: 3, top: 25, delay: 2, duration: 22 },
  { id: 3, size: 5, top: 40, delay: 5, duration: 20 },
  { id: 4, size: 3, top: 55, delay: 1, duration: 24 },
  { id: 5, size: 4, top: 65, delay: 4, duration: 19 },
  { id: 6, size: 3, top: 75, delay: 7, duration: 21 },
  { id: 7, size: 5, top: 35, delay: 3, duration: 23 },
  { id: 8, size: 4, top: 50, delay: 6, duration: 17 },
]

function SandParticles() {
  return (
    <div className={styles.particleContainer} aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={styles.particle}
          style={{
            '--size': `${particle.size}px`,
            '--top': `${particle.top}%`,
            '--delay': `${particle.delay}s`,
            '--duration': `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

export default SandParticles
