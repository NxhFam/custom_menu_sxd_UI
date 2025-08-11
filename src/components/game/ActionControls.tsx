"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type ActionType =
  | "HIGH SPEED"
  | "SKILL SLOT"
  | "SPEED MATCHING"
  | "COLLISION"
  | "DRIFTING"
  | "NEAR MISS"
  | "AIR TIME"
  | "XP GAINED";

interface ActionButtonProps {
  label: ActionType;
  color: string;
  glowClass: string;
  onClick: (action: ActionType) => void;
}

const ActionButton = ({ label, color, glowClass, onClick }: ActionButtonProps) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -2 }} 
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button
        variant="outline"
        className={`h-12 px-4 font-bold text-white border-2 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-sm hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-200 ${glowClass}`}
        style={{
          borderColor: color,
          boxShadow: `0 0 15px ${color}40, inset 0 1px 0 rgba(255,255,255,0.1)`,
          fontFamily: 'Rajdhani, sans-serif',
          letterSpacing: '0.5px'
        }}
        onClick={() => onClick(label)}
      >
        {label}
      </Button>
    </motion.div>
  );
};

interface ActionControlsProps {
  onActionTriggered?: (action: ActionType, points: number) => void;
}

const ActionControls = ({
  onActionTriggered = () => {},
}: ActionControlsProps) => {
  // Define action colors and glow classes
  const actionData = {
    "HIGH SPEED": { 
      color: "#60a5fa", 
      glowClass: "hover:shadow-blue-400/50",
      points: 1000 
    },
    "SKILL SLOT": { 
      color: "#06b6d4", 
      glowClass: "hover:shadow-cyan-400/50",
      points: 750 
    },
    "SPEED MATCHING": { 
      color: "#eab308", 
      glowClass: "hover:shadow-yellow-400/50",
      points: 500 
    },
    COLLISION: { 
      color: "#ef4444", 
      glowClass: "hover:shadow-red-500/50",
      points: 0 
    },
    DRIFTING: { 
      color: "#a855f7", 
      glowClass: "hover:shadow-purple-500/50",
      points: 1200 
    },
    "NEAR MISS": { 
      color: "#f97316", 
      glowClass: "hover:shadow-orange-400/50",
      points: 800 
    },
    "AIR TIME": { 
      color: "#22c55e", 
      glowClass: "hover:shadow-green-400/50",
      points: 1500 
    },
    "XP GAINED": { 
      color: "#ffffff", 
      glowClass: "hover:shadow-white/50",
      points: 300 
    },
  };

  const handleActionClick = (action: ActionType) => {
    const data = actionData[action];
    onActionTriggered(action, data.points);
  };

  return (
    <motion.div 
      className="fixed bottom-6 left-0 right-0 bg-black/70 backdrop-blur-md py-4 px-6 border-t border-gray-700/50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
        {(Object.keys(actionData) as ActionType[]).map((action, index) => (
          <motion.div
            key={action}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <ActionButton
              label={action}
              color={actionData[action].color}
              glowClass={actionData[action].glowClass}
              onClick={handleActionClick}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Instructions */}
      <motion.p 
        className="text-center text-gray-400 text-sm mt-3 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ fontFamily: 'Rajdhani, sans-serif' }}
      >
        Click actions to trigger XP gains • Chain actions to build multiplier • Avoid collisions!
      </motion.p>
    </motion.div>
  );
};

export default ActionControls;