import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface PetalConfig {
  id: number;
  startX: number; // percentage (0 - 100)
  size: number; // in px
  duration: number; // seconds
  delay: number; // seconds
  swayX: number; // sway amplitude in px
  rotateDir: number; // -1 or 1
  opacity: number;
  petalType: number; // 0, 1, or 2 for slight shape variations
}

export const FallingPetals: React.FC = () => {
  // Generate a stable set of 18 falling petals
  const petals = useMemo<PetalConfig[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      startX: (i * 5.8) + (Math.sin(i * 1.5) * 3), // distributed across the viewport
      size: 14 + (i % 5) * 3, // 14px to 26px
      duration: 11 + (i % 6) * 1.8, // 11s to 20s for varied float speed
      delay: (i * 0.75) % 10, // staggered start so petals are present immediately
      swayX: 30 + (i % 4) * 20, // 30px to 90px sway
      rotateDir: i % 2 === 0 ? 1 : -1,
      opacity: 0.35 + (i % 3) * 0.12, // 0.35 to 0.59 soft opacity
      petalType: i % 3,
    }));
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((p) => {
        const sway1 = p.swayX * p.rotateDir;
        const sway2 = -p.swayX * 0.7 * p.rotateDir;
        const sway3 = p.swayX * 0.5 * p.rotateDir;

        return (
          <motion.div
            key={p.id}
            initial={{
              y: '-6vh',
              x: 0,
              rotateZ: 0,
              rotateY: 0,
              opacity: 0,
            }}
            animate={{
              y: '106vh',
              x: [0, sway1, sway2, sway3, 0],
              rotateZ: [0, 180 * p.rotateDir, 360 * p.rotateDir],
              rotateY: [0, 180, 360],
              opacity: [0, p.opacity, p.opacity * 0.9, p.opacity * 0.8, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              left: `${p.startX}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
            }}
          >
            {/* Organic SVG Rose Petal */}
            <svg
              viewBox="0 0 30 40"
              className="w-full h-full drop-shadow-xs"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(225, 29, 72, 0.08))' }}
            >
              <defs>
                <linearGradient id={`petal-grad-${p.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fecdd3" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#fda4af" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.75" />
                </linearGradient>
              </defs>
              <path
                d="M 15 2 C 7 2 2 12 3 24 C 4 33 11 38 15 38 C 19 38 26 33 27 24 C 28 12 23 2 15 2 Z"
                fill={`url(#petal-grad-${p.id})`}
              />
              {/* Petal spine line */}
              <path
                d="M 15 6 Q 16 20 15 34"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="0.75"
                fill="none"
              />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};
