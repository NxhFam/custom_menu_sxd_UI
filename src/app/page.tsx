"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XpGainHud from "@/components/game/XpGainHud";
import ActionControls from "@/components/game/ActionControls";

type ActionType =
  | "HIGH SPEED"
  | "SKILL SLOT"
  | "SPEED MATCHING"
  | "COLLISION"
  | "DRIFTING"
  | "NEAR MISS"
  | "AIR TIME"
  | "XP GAINED";

// Action types with their corresponding points
const actionPoints = {
  "HIGH SPEED": 1000,
  "SKILL SLOT": 750,
  "SPEED MATCHING": 500,
  COLLISION: 0,
  DRIFTING: 1200,
  "NEAR MISS": 800,
  "AIR TIME": 1500,
  "XP GAINED": 300,
};

export default function Home() {
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCollision, setIsCollision] = useState(false);
  const [comboActive, setComboActive] = useState(false);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Use ref for timers to avoid dependency issues
  const inactivityTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset the combo after inactivity
  useEffect(() => {
    if (comboActive && !isCollision) {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set new inactivity timer
      const timer = setTimeout(() => {
        // Batch reset combo state updates together
        setComboActive(false);
        setCurrentAction(null);
        setMultiplier(1);
        setProgress(0);
        setScore(0);
        setIsActive(false);
        setInactivityTimer(null);
      }, 3000); // 3 seconds of inactivity

      // Store timer ID in both ref and state
      inactivityTimerRef.current = timer;
      setInactivityTimer(timer);
    }

    // Cleanup function
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [comboActive, isCollision]); // Remove inactivityTimer from dependencies

  // Handle action button clicks
  const handleAction = (actionType: ActionType, points: number) => {
    // Clear any existing inactivity timer
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      setInactivityTimer(null);
    }

    // Handle collision separately
    if (actionType === "COLLISION") {
      // Batch state updates together for collision
      setIsCollision(true);
      setCurrentAction(actionType);
      setIsActive(true);
      setComboActive(true);
      setScore(0);

      // Reset collision state after delay
      const collisionTimer = setTimeout(() => {
        // Batch state updates together for reset
        setIsCollision(false);
        setCurrentAction(null);
        setMultiplier(1);
        setProgress(0);
        setScore(0);
        setIsActive(false);
        setComboActive(false);
      }, 1500);

      return;
    }

    // Regular action handling
    const earnedPoints = points * multiplier;
    let newMultiplier = multiplier;
    let newProgress = progress + 0.15; // Each action adds 15% progress

    // Check if progress completes to update multiplier
    if (newProgress >= 1) {
      newMultiplier = Math.min(multiplier + 1, 10); // Cap at 10x
      newProgress = 0; // Reset progress
    }

    // Batch all state updates together to prevent render issues
    setIsCollision(false);
    setCurrentAction(actionType);
    setIsActive(true);
    setComboActive(true);
    setScore(earnedPoints);
    setTotalScore((prev) => prev + earnedPoints);
    setProgress(newProgress);
    setMultiplier(newMultiplier);

    // Hide the HUD after 2 seconds if no other action is triggered
    const hideTimer = setTimeout(() => {
      setIsActive(false);
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black relative overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Persistent total XP counter */}
      <motion.div
        className="absolute top-6 right-6 text-white text-2xl font-bold z-40"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontFamily: "Rajdhani, sans-serif",
          textShadow: "0 0 15px rgba(255, 165, 0, 0.8)",
        }}
      >
        <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-400/30">
          TOTAL: {totalScore.toLocaleString()} R
        </div>
      </motion.div>

      {/* Combo indicator */}
      {comboActive && !isCollision && (
        <motion.div
          className="absolute top-6 left-6 text-amber-400 font-bold z-40"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          style={{ fontFamily: "Rajdhani, sans-serif" }}
        >
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-amber-400/30">
            COMBO: {multiplier}X
          </div>
        </motion.div>
      )}

      {/* XP Gain HUD */}
      <div className="flex-1 flex items-start justify-center pt-20">
        <XpGainHud
          isVisible={isActive}
          action={currentAction || "HIGH SPEED"}
          points={score}
          multiplier={multiplier}
          progress={progress}
          isCollision={isCollision}
        />
      </div>

      {/* Action Controls */}
      <ActionControls onActionTriggered={handleAction} />
    </main>
  );
}
