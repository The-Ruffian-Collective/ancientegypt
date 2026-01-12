import { createContext, useContext, useReducer, useEffect } from 'react'

const ProgressContext = createContext(null)

const STORAGE_KEY = 'eilidh-egypt-progress'

const initialState = {
  locationsVisited: [],
  gamesCompleted: [],
  factsDiscovered: [],
  currentLocation: null,
}

function progressReducer(state, action) {
  switch (action.type) {
    case 'VISIT_LOCATION': {
      const { location } = action.payload
      if (state.locationsVisited.includes(location)) return state
      return {
        ...state,
        locationsVisited: [...state.locationsVisited, location],
      }
    }
    case 'COMPLETE_GAME': {
      const { game } = action.payload
      if (state.gamesCompleted.includes(game)) return state
      return {
        ...state,
        gamesCompleted: [...state.gamesCompleted, game],
      }
    }
    case 'DISCOVER_FACT': {
      const { factId } = action.payload
      if (state.factsDiscovered.includes(factId)) return state
      return {
        ...state,
        factsDiscovered: [...state.factsDiscovered, factId],
      }
    }
    case 'SET_CURRENT_LOCATION': {
      return {
        ...state,
        currentLocation: action.payload.location,
      }
    }
    case 'LOAD_SAVED': {
      return action.payload
    }
    case 'RESET': {
      return initialState
    }
    default:
      return state
  }
}

export function ProgressProvider({ children }) {
  const [state, dispatch] = useReducer(progressReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_SAVED', payload: parsed })
      }
    } catch (e) {
      console.warn('Could not load saved progress:', e)
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Could not save progress:', e)
    }
  }, [state])

  const value = {
    ...state,
    visitLocation: (location) => dispatch({ type: 'VISIT_LOCATION', payload: { location } }),
    completeGame: (game) => dispatch({ type: 'COMPLETE_GAME', payload: { game } }),
    discoverFact: (factId) => dispatch({ type: 'DISCOVER_FACT', payload: { factId } }),
    setCurrentLocation: (location) => dispatch({ type: 'SET_CURRENT_LOCATION', payload: { location } }),
    hasVisited: (location) => state.locationsVisited.includes(location),
    hasCompletedGame: (game) => state.gamesCompleted.includes(game),
    hasDiscoveredFact: (factId) => state.factsDiscovered.includes(factId),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export default ProgressContext
