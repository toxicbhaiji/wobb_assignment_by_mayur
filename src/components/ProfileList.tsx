import { Frown } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  onProfileClick: (username: string) => void;
}

export function ProfileList({ profiles, platform, onProfileClick }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 sm:py-20 text-center bg-[var(--color-surface)] rounded-2xl border border-dashed border-[var(--color-line)]">
        <div className="h-12 w-12 rounded-full bg-[var(--color-surface-raised)] grid place-items-center">
          <Frown size={24} style={{ color: "var(--color-ink-subtle)" }} />
        </div>
        <p className="text-[var(--color-ink)] font-medium">No creators match that search</p>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          Try a different name or username.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {profiles.map((profile, i) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          onProfileClick={onProfileClick}
          index={i}
        />
      ))}
    </div>
  );
}
