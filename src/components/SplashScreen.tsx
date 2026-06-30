import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-paper)]"
        >
          <div className="flex flex-col items-center gap-4">
            {/* Animated wordmark */}
            <div className="flex items-center gap-[2px]">
              {"Wobb".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.45,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="font-display text-5xl sm:text-7xl font-bold text-[var(--color-ink)]"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Subtle tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm tracking-[0.3em] uppercase text-[var(--color-ink-subtle)]"
            >
              Creator Search
            </motion.p>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
              className="w-32 h-[2px] bg-[var(--color-line)] origin-left mt-2 overflow-hidden rounded-full"
            >
              <div className="h-full w-full bg-[var(--color-ink)] origin-left" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
