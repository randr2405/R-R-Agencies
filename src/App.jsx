import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import SiteSolutions from './pages/SiteSolutions'
import Agencies from './pages/Agencies'
import Atelier from './pages/Atelier'
import SportsLifestyle from './pages/SportsLifestyle'
import Astorra from './pages/Astorra'
import './App.css'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/site-solutions" element={<SiteSolutions />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="/sports-lifestyle" element={<SportsLifestyle />} />
        <Route path="/astorra" element={<Astorra />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}