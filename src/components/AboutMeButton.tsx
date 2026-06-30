import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutMeButton() {
  return (
    <Link
      to="/about"
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 sm:px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-soft transition-default hover:border-[var(--color-line-hover)] active:scale-95"
    >
      <User size={16} style={{ color: "var(--color-ink-muted)" }} />
      <span className="hidden sm:inline">About Me</span>
    </Link>
  );
}
