// Hieroglyphic letter mappings
// Using simplified phonetic representations

export const letterToSymbol = {
  a: { symbol: '𓄿', name: 'vulture', sound: 'ah' },
  b: { symbol: '𓃀', name: 'foot', sound: 'b' },
  c: { symbol: '𓎡', name: 'basket', sound: 'k' },
  d: { symbol: '𓂧', name: 'hand', sound: 'd' },
  e: { symbol: '𓇋', name: 'reed', sound: 'ee' },
  f: { symbol: '𓆑', name: 'viper', sound: 'f' },
  g: { symbol: '𓎼', name: 'jar stand', sound: 'g' },
  h: { symbol: '𓉔', name: 'shelter', sound: 'h' },
  i: { symbol: '𓇋', name: 'reed', sound: 'ee' },
  j: { symbol: '𓆓', name: 'snake', sound: 'j' },
  k: { symbol: '𓎡', name: 'basket', sound: 'k' },
  l: { symbol: '𓃭', name: 'lion', sound: 'l' },
  m: { symbol: '𓅓', name: 'owl', sound: 'm' },
  n: { symbol: '𓈖', name: 'water', sound: 'n' },
  o: { symbol: '𓍯', name: 'lasso', sound: 'oh' },
  p: { symbol: '𓊪', name: 'stool', sound: 'p' },
  q: { symbol: '𓏘', name: 'hill', sound: 'q' },
  r: { symbol: '𓂋', name: 'mouth', sound: 'r' },
  s: { symbol: '𓋴', name: 'cloth', sound: 's' },
  t: { symbol: '𓏏', name: 'bread', sound: 't' },
  u: { symbol: '𓅱', name: 'quail', sound: 'oo' },
  v: { symbol: '𓆑', name: 'viper', sound: 'v' },
  w: { symbol: '𓅱', name: 'quail', sound: 'w' },
  x: { symbol: '𓎡𓋴', name: 'basket+cloth', sound: 'ks' },
  y: { symbol: '𓇋𓇋', name: 'two reeds', sound: 'y' },
  z: { symbol: '𓊃', name: 'door bolt', sound: 'z' },
}

// Fallback emoji representations for systems that don't support hieroglyphic unicode
export const letterToEmoji = {
  a: '🦅',  // vulture
  b: '🦶',  // foot
  c: '🧺',  // basket
  d: '✋',  // hand
  e: '🌾',  // reed
  f: '🐍',  // viper
  g: '🏺',  // jar
  h: '🏠',  // shelter
  i: '🌾',  // reed
  j: '🐍',  // snake
  k: '🧺',  // basket
  l: '🦁',  // lion
  m: '🦉',  // owl
  n: '🌊',  // water
  o: '➰',  // lasso
  p: '🪑',  // stool
  q: '⛰️',  // hill
  r: '👄',  // mouth
  s: '🧣',  // cloth
  t: '🍞',  // bread
  u: '🐦',  // quail
  v: '🐍',  // viper
  w: '🐦',  // quail
  x: '❌',  // cross
  y: '🌾🌾', // two reeds
  z: '🔒',  // door bolt
}

/**
 * Convert a name to hieroglyphic representation
 * @param {string} name - The name to convert
 * @returns {Array} Array of { letter, symbol, emoji, name, sound }
 */
export function nameToHieroglyphics(name) {
  return name.toLowerCase().split('').filter(char => /[a-z]/.test(char)).map(letter => ({
    letter: letter.toUpperCase(),
    symbol: letterToSymbol[letter]?.symbol || '?',
    emoji: letterToEmoji[letter] || '❓',
    name: letterToSymbol[letter]?.name || 'unknown',
    sound: letterToSymbol[letter]?.sound || letter,
  }))
}

// Pre-computed Eilidh's name for the app
export const eilidhHieroglyphics = nameToHieroglyphics('eilidh')

// Special symbols
export const specialSymbols = {
  ankh: { symbol: '☥', emoji: '☥', name: 'Ankh', meaning: 'Life' },
  eyeOfHorus: { symbol: '𓂀', emoji: '👁️', name: 'Eye of Horus', meaning: 'Protection' },
  scarab: { symbol: '𓆣', emoji: '🪲', name: 'Scarab', meaning: 'Rebirth' },
  sun: { symbol: '𓇳', emoji: '☀️', name: 'Sun Disc', meaning: 'Ra the Sun God' },
}
