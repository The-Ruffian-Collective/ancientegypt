import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import MapView from './components/layout/MapView'
import LocationWrapper from './components/layout/LocationWrapper'
import PyramidLocation from './components/locations/PyramidLocation'
import PalaceLocation from './components/locations/PalaceLocation'
import TempleLocation from './components/locations/TempleLocation'
import VillageLocation from './components/locations/VillageLocation'
import TreasureChest from './components/collection/TreasureChest'

function App() {
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MapView />} />
          <Route path="/pyramid" element={
            <LocationWrapper title="The Golden Pyramid">
              <PyramidLocation />
            </LocationWrapper>
          } />
          <Route path="/palace" element={
            <LocationWrapper title="The Pharaoh's Palace">
              <PalaceLocation />
            </LocationWrapper>
          } />
          <Route path="/temple" element={
            <LocationWrapper title="The Hieroglyphics Temple">
              <TempleLocation />
            </LocationWrapper>
          } />
          <Route path="/village" element={
            <LocationWrapper title="The Nile Village">
              <VillageLocation />
            </LocationWrapper>
          } />
        </Routes>
      </AnimatePresence>
      <TreasureChest />
    </div>
  )
}

export default App
