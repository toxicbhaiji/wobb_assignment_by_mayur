import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary, SortOption } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => {
    const raw = item.account.user_profile;
    // YouTube data uses "handle" instead of "username"
    const username = raw.username || (raw as unknown as { handle?: string }).handle || "unknown";
    return {
      ...raw,
      username,
      platform,
    };
  });
}

export function extractProfilesAll(): UserProfileSummary[] {
  return (Object.keys(platformData) as Platform[]).flatMap(extractProfiles);
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return profiles;
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(trimmed);
    const matchFullname = p.fullname.toLowerCase().includes(trimmed);
    return matchUsername || matchFullname;
  });
}

export function sortProfiles(
  profiles: UserProfileSummary[],
  sort: SortOption
): UserProfileSummary[] {
  const sorted = [...profiles];
  switch (sort) {
    case "followers_desc":
      sorted.sort((a, b) => b.followers - a.followers);
      break;
    case "followers_asc":
      sorted.sort((a, b) => a.followers - b.followers);
      break;
    case "engagement_desc":
      sorted.sort((a, b) => (b.engagement_rate || 0) - (a.engagement_rate || 0));
      break;
    case "name_asc":
      sorted.sort((a, b) => a.username.localeCompare(b.username));
      break;
  }
  return sorted;
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  switch (platform) {
    case "instagram":
      return "Instagram";
    case "youtube":
      return "YouTube";
    case "tiktok":
      return "TikTok";
  }
}

export function getSortLabel(sort: SortOption): string {
  switch (sort) {
    case "followers_desc":
      return "Most Followers";
    case "followers_asc":
      return "Fewest Followers";
    case "engagement_desc":
      return "Highest Engagement";
    case "name_asc":
      return "Name A-Z";
  }
}
