# Eilidh's Egyptian Adventure 🏛️

An interactive educational web app about Ancient Egypt, designed for a 7-year-old explorer.

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-pink)

## Features

**4 Explorable Locations**
- **The Golden Pyramid** - Learn how pyramids were built, peek inside tombs
- **Pharaoh's Palace** - Meet friendly Egyptian gods (Ra, Anubis, Thoth, Bastet)
- **Hieroglyphics Temple** - See your name written in ancient symbols!
- **Nile Village** - Discover daily life, fishing, and friendly hippos

**4 Mini-Games**
- 🏗️ **Pyramid Builder** - Drag and drop blocks to build a pyramid
- 🧩 **Match the Gods** - Memory matching game with Egyptian deities
- 📝 **Symbol Stamp** - Spell words using hieroglyphic symbols
- ⛵ **Sail the Nile** - Navigate a boat and collect lotus flowers

**Collectibles System**
- 17 items to discover (treasures, badges, stickers)
- Progress saved automatically
- Treasure chest collection book

## Design Philosophy

- **No failure states** - Games celebrate attempts, never punish
- **Short text** - 6-8 words per fact for emerging readers
- **Large tap targets** - Touch-friendly for iPad use
- **Soft animations** - Bouncy, whimsical, never jarring
- **Safe exploration** - No external links, fully offline-capable

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) to explore.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Framer Motion** - Animations
- **CSS Modules** - Scoped styling
- **localStorage** - Progress persistence

## Project Structure

```
src/
├── components/
│   ├── collection/      # TreasureChest, CollectionBook
│   ├── games/           # PyramidBuilder, MatchTheGods, SymbolStamp, SailTheNile
│   ├── hieroglyphics/   # NameInHieroglyphics
│   ├── interactive/     # ClickableHotspot, FunFactPopup
│   ├── layout/          # MapView, LocationWrapper
│   └── locations/       # Pyramid, Palace, Temple, Village
├── context/             # CollectionContext, ProgressContext
├── data/                # hieroglyphics.js
└── index.css            # Global styles & Egyptian theme
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | `#F4A460` | Primary accents, buttons |
| Sand | `#FFF8DC` | Backgrounds, papyrus |
| Nile Blue | `#87CEEB` | Sky, water elements |
| Nile Teal | `#20B2AA` | River, highlights |
| Terracotta | `#E07850` | Text accents, warmth |

## Deployment

Configured for Netlify deployment. Connect your GitHub repo and it will auto-deploy on push.

Build settings (auto-detected from `netlify.toml`):
- **Build command:** `npm run build`
- **Publish directory:** `dist`

## License

MIT

---

*Built with love for Eilidh* ✨
