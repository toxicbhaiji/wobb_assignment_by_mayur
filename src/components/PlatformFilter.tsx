import { Instagram, Music2, Search, Youtube, ArrowUpDown } from "lucide-react";
import clsx from "clsx";
import type { Platform, SortOption } from "@/types";
import { PLATFORMS, getPlatformLabel, getSortLabel } from "@/utils/dataHelpers";
import { useState, useRef, useEffect } from "react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const PLATFORM_ICONS: Record<Platform, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
  tiktok: Music2,
};

const SORT_OPTIONS: SortOption[] = [
  "followers_desc",
  "followers_asc",
  "engagement_desc",
  "name_asc",
];

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
  sort,
  onSortChange,
}: PlatformFilterProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Platform tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {PLATFORMS.map((p) => {
          const Icon = PLATFORM_ICONS[p];
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-pressed={isActive}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-default border shrink-0 select-none",
                isActive
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-transparent"
                  : "bg-[var(--color-surface)] text-[var(--color-ink-muted)] border-[var(--color-line)] hover:border-[var(--color-line-hover)] hover:text-[var(--color-ink)]"
              )}
            >
              <Icon size={16} />
              {getPlatformLabel(p)}
            </button>
          );
        })}
      </div>

      {/* Search + Sort row */}
      <div className="flex gap-2 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-ink-subtle)" }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by username or name"
            className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] outline-none transition-default focus:border-[var(--color-line-hover)] focus:ring-2 focus:ring-[var(--color-signal-soft)]"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative shrink-0" ref={sortRef}>
          <button
            type="button"
            onClick={() => setSortOpen(!sortOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] text-sm text-[var(--color-ink-muted)] transition-default hover:border-[var(--color-line-hover)] hover:text-[var(--color-ink)]"
            aria-label="Sort options"
            aria-expanded={sortOpen}
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">{getSortLabel(sort)}</span>
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-20 w-48 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft-lg overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onSortChange(opt);
                    setSortOpen(false);
                  }}
                  className={clsx(
                    "w-full text-left px-4 py-2.5 text-sm transition-default",
                    sort === opt
                      ? "text-[var(--color-ink)] bg-[var(--color-surface-raised)]"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]"
                  )}
                >
                  {getSortLabel(opt)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
