import React, { useState, useEffect } from 'react';
import laundromatNight from '../assets/laundromat-vibe.jpg';
import { audioSynth } from '../utils/audioSynth';

interface SceneProps {
  isPlaying: boolean;
  onOpenBoard: () => void;
}

export const Scene: React.FC<SceneProps> = ({
  onOpenBoard,
}) => {
  // Individual flicker state
  const [flickerAll, setFlickerAll] = useState(false);

  // Spontaneous random neon flicker (Vintage 1994 authentic atmosphere)
  useEffect(() => {
    const triggerRandomFlicker = () => {
      audioSynth.playNeonBallastHum(true);
      setFlickerAll(true);
      setTimeout(() => setFlickerAll(false), 200 + Math.random() * 400);
    };

    // Random interval between 15s and 35s
    const scheduleNextFlicker = () => {
      const delay = 15000 + Math.random() * 20000;
      return setTimeout(() => {
        triggerRandomFlicker();
        timerId = scheduleNextFlicker();
      }, delay);
    };

    let timerId = scheduleNextFlicker();
    return () => clearTimeout(timerId);
  }, []);

  // Handlers for user interactions (Zero bounding box, pure exploration)
  const handleNeonClick = () => {
    audioSynth.playNeonBallastHum();
    setFlickerAll(true);
    setTimeout(() => setFlickerAll(false), 600);
  };

  const handlePacManClick = () => {
    audioSynth.playPacManArcade();
  };

  const handleWasherClick = () => {
    audioSynth.playWasherDrumSpin();
  };

  const handleLampClick = () => {
    audioSynth.playLampSwitch();
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden select-none">
      {/* 1. The Canonical Single 1994 Midnight Laundromat & Arcade Illustration */}
      <img
        src={laundromatNight}
        alt="24/7 Laundromat & Arcade 1994"
        className={`absolute inset-0 size-full object-cover object-center ${
          flickerAll ? 'brightness-125 saturate-150' : ''
        }`}
      />

      {/* 
        ========================================================================
        4. PRECISELY MAPPED ZERO-BOUNDING-BOX INTERACTIVE HOTSPOTS
        ========================================================================
        Completely invisible, no tooltips, no borders, pure immersive exploration!
      */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Hotspot 1: Pac-Man Arcade Cabinet (Left Edge) */}
        <button
          onClick={handlePacManClick}
          className="pointer-events-auto absolute left-[0%] top-[42%] w-[15%] h-[56%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Pac-Man Arcade Cabinet"
        />

        {/* Hotspot 2: 'WASH DRY FOLD' Neon Sign (Left Wall) */}
        <button
          onClick={handleNeonClick}
          className="pointer-events-auto absolute left-[19%] top-[17%] w-[10%] h-[28%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Wash Dry Fold Neon Sign"
        />

        {/* Hotspot 3: 'LAUNDROMAT OPEN 24 HOURS' Neon Sign (Above Glass Door) */}
        <button
          onClick={handleNeonClick}
          className="pointer-events-auto absolute left-[38%] top-[35%] w-[12%] h-[9%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Door Neon Sign"
        />

        {/* Hotspot 4: 'Laundry Today Or Naked ♡' Pink Neon Sign (Right Wall) */}
        <button
          onClick={handleNeonClick}
          className="pointer-events-auto absolute left-[70%] top-[13%] w-[15%] h-[21%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Laundry Today Or Naked Neon Sign"
        />

        {/* Hotspot 5: Cozy Floor Lamp (Next to Couch) */}
        <button
          onClick={handleLampClick}
          className="pointer-events-auto absolute left-[15%] top-[49%] w-[9%] h-[28%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Floor Lamp"
        />

        {/* Hotspot 6: The 'Lost Sock' Cork Notice Board (Exact boundary with flyers) */}
        <button
          onClick={onOpenBoard}
          className="pointer-events-auto absolute left-[78%] top-[33%] w-[17%] h-[35%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Lost Sock Bulletin Board"
        />

        {/* Hotspot 7: Speed Queen Washing Machine Drum (Right side) */}
        <button
          onClick={handleWasherClick}
          className="pointer-events-auto absolute left-[73.5%] top-[46%] w-[9%] h-[22%] bg-transparent border-none outline-none cursor-pointer"
          title=""
          aria-label="Washing Machine Drum"
        />

      </div>

      {/* 5. Delicate Cinematic Vignette */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
    </div>
  );
};






