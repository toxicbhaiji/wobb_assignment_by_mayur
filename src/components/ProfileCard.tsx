import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { AddToListButton } from "./AddToListButton";
import { Avatar } from "./Avatar";
import { formatFollowers } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  onProfileClick?: (username: string) => void;
  index?: number;
}

function ProfileCardImpl({ profile, platform, onProfileClick, index = 0 }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    onProfileClick?.(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  }, [navigate, onProfileClick, profile.username, platform]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.4, 0, 0.2, 1] }}
      className="min-w-0"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group relative bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-4 sm:p-5 cursor-pointer card-hover focus:outline-none focus:ring-2 focus:ring-[var(--color-line-hover)]"
        style={{ overflowAnchor: "none" }}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <Avatar
              src={profile.picture}
              alt={`${profile.fullname}'s avatar`}
              size={56}
              className="ring-2 ring-[var(--color-line)] group-hover:ring-[var(--color-line-hover)] transition-default"
            />
            {/* Platform badge on avatar */}
            <span className="absolute -bottom-0.5 -right-0.5 text-[9px] font-bold uppercase tracking-wider bg-[var(--color-surface-raised)] text-[var(--color-ink-muted)] px-1.5 py-px rounded border border-[var(--color-line)]">
              {platform === "youtube" ? "YT" : platform === "tiktok" ? "TT" : "IG"}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-semibold text-[var(--color-ink)] truncate text-sm sm:text-base">
                @{profile.username}
              </h2>
              <VerifiedBadge verified={profile.is_verified} />
            </div>

            <p className="text-sm truncate" style={{ color: "var(--color-ink-muted)" }}>
              {profile.fullname}
            </p>

            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-mono" style={{ color: "var(--color-ink-subtle)" }}>
              <Users size={13} />
              <span className="font-semibold text-[var(--color-ink)]">
                {formatFollowers(profile.followers)}
              </span>
              <span>followers</span>
            </div>

            {profile.engagement_rate !== undefined && (
              <div className="mt-1 text-xs font-mono" style={{ color: "var(--color-ink-subtle)" }}>
                {(profile.engagement_rate * 100).toFixed(2)}% engagement
              </div>
            )}
          </div>

          <AddToListButton profile={profile} variant="compact" />
        </div>
      </div>
    </motion.div>
  );
}

// Memoize to prevent re-renders during search typing
export const ProfileCard = memo(ProfileCardImpl);
