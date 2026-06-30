import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import type { Platform, SortOption } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { ListDrawer } from "@/components/ListDrawer";
import { useProfiles } from "@/hooks/useProfiles";
import { getPlatformLabel } from "@/utils/dataHelpers";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPlatform = (searchParams.get("platform") as Platform) || "instagram";
  const initialSearch = searchParams.get("search") || "";
  const initialSort = (searchParams.get("sort") as SortOption) || "followers_desc";

  const [platform, setPlatform] = useState<Platform>(initialPlatform);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sort, setSort] = useState<SortOption>(initialSort);

  // Sync state to URL whenever it changes
  useEffect(() => {
    const params: Record<string, string> = {};
    if (platform !== "instagram") params.platform = platform;
    if (searchQuery.trim()) params.search = searchQuery.trim();
    if (sort !== "followers_desc") params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [platform, searchQuery, sort, setSearchParams]);

  const filtered = useProfiles(platform, searchQuery, sort);

  const handleProfileClick = useCallback(() => {
    // Navigation handled in ProfileCard
  }, []);

  const handlePlatformChange = useCallback((p: Platform) => {
    setPlatform(p);
    setSearchQuery("");
  }, []);

  return (
    <Layout
      title="Find your next creator"
      subtitle="Search Instagram, YouTube and TikTok talent, then build a shortlist to share with your team."
    >
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 md:gap-8 items-start">
        <div className="min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-4 sm:p-6 mb-5 sm:mb-6 shadow-soft"
          >
            <PlatformFilter
              selected={platform}
              onChange={handlePlatformChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sort={sort}
              onSortChange={setSort}
            />

            <p className="text-sm mt-4" style={{ color: "var(--color-ink-muted)" }}>
              Showing{" "}
              <span className="font-mono font-semibold text-[var(--color-ink)]">
                {filtered.length}
              </span>{" "}
              creators on{" "}
              <span className="font-semibold text-[var(--color-ink)]">
                {getPlatformLabel(platform)}
              </span>
            </p>
          </motion.div>

          <ProfileList
            profiles={filtered}
            platform={platform}
            onProfileClick={handleProfileClick}
          />
        </div>

        <ListDrawer />
      </div>
    </Layout>
  );
}
