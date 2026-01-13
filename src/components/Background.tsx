import React from 'react';
import { motion } from 'framer-motion';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
      {/* Primary Green Blob (Top Left) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4], // Increased opacity significantly
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00E272]/30 rounded-full blur-[120px]"
      />

      {/* Secondary Emerald Blob (Bottom Right) */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3], // Increased opacity significantly
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-emerald-900/40 rounded-full blur-[150px]"
      />
      
      {/* Accent Teal Blob (Center-ish) */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3], // Increased opacity significantly
          x: [0, 30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-[30%] right-[30%] w-[50%] h-[50%] bg-teal-900/30 rounded-full blur-[100px]"
      />
      
      {/* Noise Overlay (Optional, for texture) */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
    </div>
  );
};
