import { useMemo } from "react";
import type { Platform, UserProfileSummary, SortOption } from "@/types";
import { extractProfiles, filterProfiles, sortProfiles } from "@/utils/dataHelpers";

export function useProfiles(
  platform: Platform,
  query: string,
  sort: SortOption
): UserProfileSummary[] {
  return useMemo(() => {
    const all = extractProfiles(platform);
    const filtered = filterProfiles(all, query);
    return sortProfiles(filtered, sort);
  }, [platform, query, sort]);
}
