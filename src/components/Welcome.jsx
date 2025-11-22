// src/components/Welcome.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export default function Welcome() {
  const navigate = useNavigate(); // Hook for navigation
  const nameRef = useRef(null);
  const professionRef = useRef(null);
  const enterBtnRef = useRef(null);

  useEffect(() => {
    // GSAP Animation Timeline for sequential entry
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // 1. Animate the name
    tl.fromTo(nameRef.current, 
      { opacity: 0, y: 50 }, 
      { opacity: 1, y: 0, duration: 1.2, delay: 0.5 }
    );

    // 2. Animate the profession (after the name, with a slight overlap)
    tl.fromTo(professionRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8 }, 
      "-=0.7" // Start 0.7 seconds before the previous animation ends
    );

    // 3. Animate the button (after profession)
    tl.fromTo(enterBtnRef.current, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 1, scale: 1, duration: 0.6 }, 
      "-=0.4" // Start 0.4 seconds before the previous animation ends
    );

    // Add hover effect for the button using GSAP (optional, but nice)
    gsap.to(enterBtnRef.current, { 
      '--btn-arrow-x': '10px', // Custom CSS variable for arrow movement
      duration: 0.3, 
      ease: "power2.out", 
      paused: true, // Start paused
      onComplete: () => gsap.to(enterBtnRef.current, { // Reset on leave
        '--btn-arrow-x': '0px', 
        duration: 0.3, 
        ease: "power2.out" 
      })
    });

  }, []); // Run once on component mount

  const handleEnterClick = () => {
    // Add a quick exit animation before navigating
    gsap.to(".welcome-container", {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => navigate('/home') // Navigate after animation
    });
  };

  return (
    // Main container for the welcome page, full screen and centered
    <div className="
        welcome-container 
        fixed inset-0 flex flex-col items-center justify-center 
        bg-black text-off-white font-body p-4 
        z-10  
    ">
      {/* Uzair Baig - Heading */}
      <h1 
        ref={nameRef} 
        className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold text-off-white mb-4 text-center leading-tight"
        style={{ opacity: 0 }} // Start invisible for animation
      >
        Raheem Baig
      </h1>

      {/* FULL STACK DEVELOPER - Subtitle */}
      <p 
        ref={professionRef} 
        className="text-lg md:text-xl lg:text-2xl tracking-widest uppercase text-gray-400 font-body mb-10 text-center"
        style={{ opacity: 0 }} // Start invisible for animation
      >
        Full Stack Developer
      </p>

      {/* ENTER Button */}
      <button 
        ref={enterBtnRef}
        onClick={handleEnterClick}
        onMouseEnter={() => gsap.to(enterBtnRef.current, { '--btn-arrow-x': '10px', duration: 0.3, ease: "power2.out" })}
        onMouseLeave={() => gsap.to(enterBtnRef.current, { '--btn-arrow-x': '0px', duration: 0.3, ease: "power2.out" })}
        className="
          relative px-8 py-3 text-off-white border border-gray-600 rounded-md 
          text-lg uppercase tracking-widest overflow-hidden 
          hover:border-off-white transition-colors duration-300 font-body
          flex items-center space-x-2
          group
        "
        style={{ opacity: 0, 
                 '--btn-arrow-x': '0px' // Initialize custom property for arrow
        }} 
      >
        <span>Enter</span>
        {/* Arrow icon using a pseudo-element or SVG for animation */}
        <span 
          className="relative block transform transition-transform duration-300 
                     after:content-['→'] after:absolute after:left-0 after:top-0 after:translate-x-[var(--btn-arrow-x)]"
        >
          &nbsp;
        </span>
      </button>
    </div>
  );
}