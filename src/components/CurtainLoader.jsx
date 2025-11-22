// src/components/CurtainLoader.jsx

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// Define the number of blocks you want
const NUMBER_OF_BLOCKS = 10; 

// The duration of the block movement animation
const ANIMATION_DURATION = 1

// The delay between the start of each block's animation (stagger)
const STAGGER_DELAY = 0.1; 

function CurtainLoader({ onComplete }) {
  const containerRef = useRef(null);

  useEffect(() => {
    // 1. Get all the block elements inside the container
    const blocks = containerRef.current.children;

    // 2. Use GSAP to animate the blocks
    gsap.to(blocks, {
      y: '-100%', // Move blocks upwards completely off-screen
      duration: ANIMATION_DURATION,
      ease: 'power3.inOut',
      stagger: STAGGER_DELAY, // Animate them one after the other
      delay: 0.5, // Optional: wait a moment before starting the animation
      onComplete: () => {
        // 3. Call the callback function passed from App.jsx to reveal the content
        if (onComplete) {
          onComplete();
        }
      },
    });
  }, [onComplete]);

  // Create an array to easily render the vertical blocks
  const blockElements = Array.from({ length: NUMBER_OF_BLOCKS }, (_, index) => (
    <div
      key={index}
      style={{
        width: `${100 / NUMBER_OF_BLOCKS}%`,
        height: '100%',
        backgroundColor: '#000000', // Set your desired color
        position: 'relative',
        zIndex: 1000, // Ensure blocks are on top of everything
      }}
    />
  ));

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        overflow: 'hidden',
        zIndex: 9999, // Ensure the entire container is above all content
        pointerEvents: 'none', // Allow clicks/interaction through the container once blocks are gone
      }}
    >
      {blockElements}
    </div>
  );
}

export default CurtainLoader;