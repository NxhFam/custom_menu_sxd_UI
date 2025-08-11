"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MultiplierCircleProps {
  multiplier?: number;
  progress?: number;
  isActive?: boolean;
  isCollision?: boolean;
  onLevelUp?: () => void;
}

const MultiplierCircle = ({
  multiplier = 1,
  progress = 0,
  isActive = true,
  isCollision = false,
  onLevelUp = () => {},
}: MultiplierCircleProps) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [prevMultiplier, setPrevMultiplier] = useState(multiplier);

  // Ref to store timer ID
  const levelUpTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Handle level up animation when multiplier increases
  useEffect(() => {
    // Clear any existing timer first
    if (levelUpTimerRef.current) {
      clearTimeout(levelUpTimerRef.current);
      levelUpTimerRef.current = null;
    }

    if (multiplier > prevMultiplier && !isCollision) {
      setIsLevelingUp(true);
      onLevelUp();

      const timer = setTimeout(() => {
        setIsLevelingUp(false);
      }, 600);

      levelUpTimerRef.current = timer;
      setPrevMultiplier(multiplier);

      return () => {
        if (levelUpTimerRef.current) {
          clearTimeout(levelUpTimerRef.current);
          levelUpTimerRef.current = null;
        }
      };
    }

    setPrevMultiplier(multiplier);
  }, [multiplier, prevMultiplier, isCollision, onLevelUp]);

  // Calculate stroke properties for progress arc
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  // Determine arc color based on state
  const getArcColor = () => {
    if (isCollision) return "#ef4444"; // Red for collision
    if (!isActive && progress > 0) return "#f97316"; // Orange for draining
    return "#f59e0b"; // Amber for active
  };

  return (
    <div className="relative w-[50px] h-[50px] flex items-center justify-center">
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-black/60 border border-gray-600/50"></div>

      {/* Progress arc */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="25"
          cy="25"
          r={radius}
          fill="transparent"
          stroke={getArcColor()}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            strokeDasharray,
            strokeDashoffset,
            transition: "stroke-dashoffset 0.4s ease, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${getArcColor()})`,
          }}
        />
      </svg>

      {/* Multiplier text */}
      <motion.div
        className="z-10 text-lg font-bold"
        animate={isLevelingUp ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <span
          className={`${isCollision ? "text-red-500 neon-glow-red" : "text-white"} tracking-wider`}
          style={{
            fontFamily: "Rajdhani, sans-serif",
            textShadow: isCollision
              ? undefined
              : "0 0 8px rgba(255, 255, 255, 0.8)",
          }}
        >
          {isCollision ? "0X" : `${multiplier}X`}
        </span>
      </motion.div>

      {/* Level up explosion animation */}
      {isLevelingUp && (
        <>
          {/* Main explosion */}
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/30"
            initial={{ opacity: 0.8, scale: 0.8 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Secondary ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-amber-400"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              boxShadow: "0 0 20px #f59e0b",
            }}
          />

          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0,
                x: Math.cos((i * Math.PI * 2) / 8) * 40,
                y: Math.sin((i * Math.PI * 2) / 8) * 40,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default MultiplierCircle;
