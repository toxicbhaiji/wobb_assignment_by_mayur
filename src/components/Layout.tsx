import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { motion } from "framer-motion";
import { ShortlistBadge } from "./ShortlistBadge";
import { AboutMeButton } from "./AboutMeButton";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
}

export function Layout({ children, title, subtitle, showBadge = true }: LayoutProps) {
  const location = useLocation();
  const isAboutPage = location.pathname === "/about";

  return (
    <div className="min-h-screen bg-[var(--color-paper)] relative overflow-x-clip">
      <Toaster position="bottom-center" richColors />

      <header className="sticky top-0 z-30 glass border-b border-[var(--color-line)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-ink)] shrink-0"
          >
            Wobb
          </Link>

          <div className="flex items-center gap-2">
            {showBadge && !isAboutPage && <ShortlistBadge />}
            <AboutMeButton />
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="mb-6 sm:mb-8"
          >
            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--color-ink)] tracking-tight leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[var(--color-ink-muted)] mt-2.5 text-sm sm:text-base max-w-2xl">
                {subtitle}
              </p>
            )}
          </motion.div>
        )}

        {children}
      </main>
    </div>
  );
}
