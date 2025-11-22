// src/App.jsx - FINAL REVISION FOR PRECISE VISIBILITY

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './components/home';
import CurtainLoader from './components/CurtainLoader';
import LightRays from './components/LightRays';
import CountUp from './components/CountUp';
import './App.css'; 

function App() {
  // State 1: Tracks if the count up animation is done
  const [countUpComplete, setCountUpComplete] = useState(false);
  // State 2: Tracks if the GSAP curtain animation is done
  const [gsapComplete, setGsapComplete] = useState(false);

  // Function to call when the CountUp component finishes
  const handleCountUpEnd = () => {
    // Stage 1 -> Stage 2: CountUp finishes, CurtainLoader starts
    setCountUpComplete(true); 
  };

  // Function to call when the CurtainLoader animation finishes
  const handleGsapEnd = () => {
    // Stage 2 -> Stage 3: CurtainLoader finishes, LightRays and Home Page appear
    setGsapComplete(true);
  };
  
  // The Home page and LightRays are visible only in the final stage (Stage 3)
  const showContent = gsapComplete;

  return (
    <Router>
      
      {/* 1. Light Rays: Only render when GSAP curtain is complete (Stage 3) */}
      {showContent && (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}> 
          <LightRays
            raysOrigin="top-center"
            raysColor="#fefefeff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={2}
            followMouse={true}
            mouseInfluence={1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>
      )}
      
      {/* 2. CountUp: Only render if not complete (Stage 1) */}
      {!countUpComplete && (
        <CountUp
          from={0}
          to={100}
          duration={3} 
          className="count-up-text"
          onEnd={handleCountUpEnd} // Triggers Stage 2
        />
      )}
      
      {/* 3. CurtainLoader: Only render if CountUp is done, but GSAP is not yet done (Stage 2) */}
      {countUpComplete && !gsapComplete && (
        <CurtainLoader onComplete={handleGsapEnd} /> // Triggers Stage 3
      )}
      
      {/* 4. Main Content: Visible only after all animations are complete (Stage 3) */}
      <main style={{ opacity: showContent ? 1 : 0, transition: 'opacity 0.5s', pointerEvents: showContent ? 'auto' : 'none' }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      
    </Router>
  );
}

export default App;