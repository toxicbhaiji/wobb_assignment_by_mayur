import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<{ default: ProfileDetailResponse }>(
  "../assets/data/profiles/*.json",
  { eager: true }
);

/** Build a lookup map keyed by filename (username) for fast access. */
const profileMap = new Map<string, ProfileDetailResponse>();
for (const [path, mod] of Object.entries(profileModules)) {
  const match = path.match(/profiles\/([^/]+)\.json$/);
  if (match) {
    const key = match[1].toLowerCase();
    profileMap.set(key, mod.default);
  }
}

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  return profileMap.get(username.toLowerCase()) ?? null;
}
