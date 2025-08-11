"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MultiplierCircle from "./MultiplierCircle";

type ActionType =
  | "HIGH SPEED"
  | "SKILL SLOT"
  | "SPEED MATCHING"
  | "COLLISION"
  | "DRIFTING"
  | "NEAR MISS"
  | "AIR TIME"
  | "XP GAINED";

type XpGainHudProps = {
  isVisible?: boolean;
  action?: ActionType;
  points?: number;
  multiplier?: number;
  progress?: number;
  isCollision?: boolean;
};

const actionColors: Record<ActionType, string> = {
  "HIGH SPEED": "text-blue-400 neon-glow-blue",
  "SKILL SLOT": "text-cyan-400 neon-glow-cyan",
  "SPEED MATCHING": "text-yellow-400 neon-glow-yellow",
  COLLISION: "text-red-500 neon-glow-red",
  DRIFTING: "text-purple-500 neon-glow-purple",
  "NEAR MISS": "text-orange-400 neon-glow-orange",
  "AIR TIME": "text-green-400 neon-glow-green",
  "XP GAINED": "text-white",
};

const XpGainHud = ({
  isVisible = false,
  action = "HIGH SPEED",
  points = 0,
  multiplier = 1,
  progress = 0,
  isCollision = false,
}: XpGainHudProps) => {
  const [displayedPoints, setDisplayedPoints] = useState(0);
  const [prevPoints, setPrevPoints] = useState(0);

  // Ref to store interval ID
  const counterIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Animate points counter with faster ticking
  useEffect(() => {
    // Clear any existing interval first
    if (counterIntervalRef.current) {
      clearInterval(counterIntervalRef.current);
      counterIntervalRef.current = null;
    }

    if (points !== prevPoints) {
      setPrevPoints(points);
      setDisplayedPoints(0);

      // Skip animation for zero points
      if (points === 0) {
        setDisplayedPoints(0);
        return;
      }

      const duration = 800; // Animation duration in ms
      const steps = 20; // Number of steps
      const increment = points / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayedPoints(points);
          clearInterval(interval);
          counterIntervalRef.current = null;
        } else {
          setDisplayedPoints(Math.floor(increment * currentStep));
        }
      }, stepDuration);

      counterIntervalRef.current = interval;
      return () => {
        if (counterIntervalRef.current) {
          clearInterval(counterIntervalRef.current);
          counterIntervalRef.current = null;
        }
      };
    }
  }, [points, prevPoints]);

  const formattedPoints = new Intl.NumberFormat().format(displayedPoints);
  const textColor = isCollision
    ? "text-red-500 neon-glow-red"
    : actionColors[action];
  const scoreColor = isCollision
    ? "text-red-500 neon-glow-red"
    : "text-amber-400 neon-glow-amber";

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`${action}-${points}-${isCollision}`}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 flex items-center bg-black/80 backdrop-blur-sm rounded-lg px-6 py-3 z-50 border border-gray-700/50"
          initial={{ opacity: 0, scale: 0.8, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          {/* Multiplier Circle */}
          <MultiplierCircle
            multiplier={multiplier}
            progress={progress}
            isCollision={isCollision}
          />

          {/* Lightning Icon */}
          <motion.div
            className={`mx-3 ${isCollision ? "text-red-500" : "text-amber-400"}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px ${isCollision ? "#ef4444" : "#f59e0b"})`,
              }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </motion.div>

          {/* Action Name */}
          <div className="relative">
            <motion.h3
              className={`text-xl font-bold ${textColor} tracking-wide`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {action}

              {/* Strikethrough for collision */}
              {isCollision && (
                <motion.div
                  className="absolute inset-0 flex items-center"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div
                    className="h-0.5 w-full bg-red-500"
                    style={{
                      boxShadow: "0 0 8px #ef4444",
                      filter: "drop-shadow(0 0 4px #ef4444)",
                    }}
                  />
                </motion.div>
              )}
            </motion.h3>
          </div>

          {/* Score Counter */}
          <div className="ml-6 relative">
            <motion.h2
              className={`text-2xl font-bold ${scoreColor} tracking-wider`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {formattedPoints} R{/* Strikethrough for collision */}
              {isCollision && (
                <motion.div
                  className="absolute inset-0 flex items-center"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                >
                  <div
                    className="h-0.5 w-full bg-red-500"
                    style={{
                      boxShadow: "0 0 8px #ef4444",
                      filter: "drop-shadow(0 0 4px #ef4444)",
                    }}
                  />
                </motion.div>
              )}
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default XpGainHud;
