"use client";
import React from "react";
import { motion } from "framer-motion";

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            transition: {
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            },
          }}
          className="absolute h-0.5 w-20 bg-gradient-to-r from-cyan-500 to-indigo-500"
          style={{
            transform: `rotate(${Math.random() * 360}deg)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}