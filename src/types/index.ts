export type Platform = "instagram" | "youtube" | "tiktok";

export interface UserProfileSummary {
  user_id: string;
  username: string;
  url: string;
  picture: string;
  fullname: string;
  is_verified: boolean;
  followers: number;
  engagements?: number;
  engagement_rate?: number;
  handle?: string;
  avg_views?: number;
  /** Platform this profile belongs to (set when extracted from search data) */
  platform?: Platform;
}

export interface SearchAccount {
  account: {
    user_profile: UserProfileSummary;
    audience_source: string;
  };
}

export interface SearchData {
  total: number;
  accounts: SearchAccount[];
}

export interface StatHistoryEntry {
  month: string;
  followers: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_views?: number;
  avg_shares?: number;
}

export interface GeoCountry {
  id: number;
  name: string;
  code: string;
}

export interface RelevantTag {
  tag: string;
  distance: number;
  freq: number;
}

export interface SimilarUser {
  user_id: string;
  username: string;
  picture: string;
  followers: number;
  fullname: string;
  url: string;
  is_verified: boolean;
  engagements?: number;
}

export interface FullUserProfile extends UserProfileSummary {
  type?: string;
  description?: string;
  is_business?: boolean;
  is_hidden?: boolean;
  posts_count?: number;
  avg_likes?: number;
  avg_comments?: number;
  avg_reels_plays?: number;
  avg_shares?: number;
  avg_saves?: number;
  total_likes?: number;
  gender?: string;
  age_group?: string;
  language?: { code: string; name: string };
  geo?: { country: GeoCountry };
  stat_history?: StatHistoryEntry[];
  relevant_tags?: RelevantTag[];
}

export interface ProfileDetailResponse {
  cached?: boolean;
  data: {
    success: boolean;
    user_profile: FullUserProfile;
  };
}

/** A named shortlist that holds profile references */
export interface ShortList {
  id: string;
  name: string;
  createdAt: number;
  profileIds: string[];
}

export type SortOption = "followers_desc" | "followers_asc" | "engagement_desc" | "name_asc";
