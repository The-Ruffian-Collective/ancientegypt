import { createContext, useContext, useReducer, useEffect } from 'react'

const CollectionContext = createContext(null)

const STORAGE_KEY = 'eilidh-egypt-collection'

const initialState = {
  treasures: {
    goldenScarab: { found: false, name: 'Golden Scarab', location: 'pyramid' },
    pharaohRing: { found: false, name: "Pharaoh's Ring", location: 'palace' },
    magicAmulet: { found: false, name: 'Magic Amulet', location: 'temple' },
    nilePearl: { found: false, name: 'Nile Pearl', location: 'village' },
    hiddenSphinx: { found: false, name: 'Hidden Sphinx', location: 'map' },
  },
  badges: {
    pyramidBuilder: { earned: false, name: 'Pyramid Builder', game: 'pyramid-builder' },
    godMatcher: { earned: false, name: 'God Matcher', game: 'match-gods' },
    scribeStamp: { earned: false, name: "Scribe's Stamp", game: 'symbol-stamp' },
    riverSailor: { earned: false, name: 'River Sailor', game: 'sail-nile' },
  },
  stickers: {
    cat: { found: false, name: 'Bastet Cat', locations: ['palace', 'village'] },
    lotus: { found: false, name: 'Lotus Flower', locations: ['village'] },
    eyeOfHorus: { found: false, name: 'Eye of Horus', locations: ['temple'] },
    ankh: { found: false, name: 'Ankh Symbol', locations: ['palace'] },
    crocodile: { found: false, name: 'Friendly Crocodile', locations: ['village'] },
    ibis: { found: false, name: 'Ibis Bird', locations: ['temple'] },
    sunDisc: { found: false, name: 'Sun Disc', locations: ['map'] },
    papyrus: { found: false, name: 'Papyrus Plant', locations: ['village'] },
  },
}

function calculateTotals(state) {
  const treasureCount = Object.values(state.treasures).filter(t => t.found).length
  const badgeCount = Object.values(state.badges).filter(b => b.earned).length
  const stickerCount = Object.values(state.stickers).filter(s => s.found).length

  return {
    found: treasureCount + badgeCount + stickerCount,
    total: Object.keys(state.treasures).length +
           Object.keys(state.badges).length +
           Object.keys(state.stickers).length,
  }
}

function collectionReducer(state, action) {
  switch (action.type) {
    case 'COLLECT_TREASURE': {
      const { id } = action.payload
      if (!state.treasures[id]) return state
      return {
        ...state,
        treasures: {
          ...state.treasures,
          [id]: { ...state.treasures[id], found: true },
        },
      }
    }
    case 'EARN_BADGE': {
      const { id } = action.payload
      if (!state.badges[id]) return state
      return {
        ...state,
        badges: {
          ...state.badges,
          [id]: { ...state.badges[id], earned: true },
        },
      }
    }
    case 'COLLECT_STICKER': {
      const { id } = action.payload
      if (!state.stickers[id]) return state
      return {
        ...state,
        stickers: {
          ...state.stickers,
          [id]: { ...state.stickers[id], found: true },
        },
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

export function CollectionProvider({ children }) {
  const [state, dispatch] = useReducer(collectionReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_SAVED', payload: parsed })
      }
    } catch (e) {
      console.warn('Could not load saved collection:', e)
    }
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Could not save collection:', e)
    }
  }, [state])

  const totals = calculateTotals(state)

  const value = {
    ...state,
    totalFound: totals.found,
    totalPossible: totals.total,
    progress: Math.round((totals.found / totals.total) * 100),
    collectTreasure: (id) => dispatch({ type: 'COLLECT_TREASURE', payload: { id } }),
    earnBadge: (id) => dispatch({ type: 'EARN_BADGE', payload: { id } }),
    collectSticker: (id) => dispatch({ type: 'COLLECT_STICKER', payload: { id } }),
    hasTreasure: (id) => state.treasures[id]?.found || false,
    hasBadge: (id) => state.badges[id]?.earned || false,
    hasSticker: (id) => state.stickers[id]?.found || false,
    reset: () => dispatch({ type: 'RESET' }),
  }

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider')
  }
  return context
}

export default CollectionContext
