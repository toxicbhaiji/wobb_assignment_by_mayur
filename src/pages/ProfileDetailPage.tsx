import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, MapPin, Calendar } from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { AddToListButton } from "@/components/AddToListButton";
import { Avatar } from "@/components/Avatar";
import { ListDrawer } from "@/components/ListDrawer";
import type { FullUserProfile, ProfileDetailResponse, UserProfileSummary } from "@/types";
import { formatEngagementRate, formatFollowers, formatNumber } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { extractProfilesAll } from "@/utils/dataHelpers";

interface Stat {
  label: string;
  value: string;
}

function buildStats(user: FullUserProfile): Stat[] {
  const stats: Stat[] = [
    { label: "Followers", value: formatFollowers(user.followers) },
    { label: "Engagement rate", value: formatEngagementRate(user.engagement_rate) },
  ];

  if (user.engagements !== undefined) {
    stats.push({ label: "Engagements", value: formatFollowers(user.engagements) });
  }
  if (user.posts_count !== undefined) {
    stats.push({ label: "Posts", value: formatNumber(user.posts_count) });
  }
  if (user.avg_likes !== undefined) {
    stats.push({ label: "Avg. likes", value: formatFollowers(user.avg_likes) });
  }
  if (user.avg_comments !== undefined) {
    stats.push({ label: "Avg. comments", value: formatFollowers(user.avg_comments) });
  }
  if (user.avg_views !== undefined && user.avg_views > 0) {
    stats.push({ label: "Avg. views", value: formatFollowers(user.avg_views) });
  }
  if (user.avg_shares !== undefined) {
    stats.push({ label: "Avg. shares", value: formatNumber(user.avg_shares) });
  }
  if (user.total_likes !== undefined) {
    stats.push({ label: "Total likes", value: formatFollowers(user.total_likes) });
  }

  return stats;
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";

  const [result, setResult] = useState<{
    username: string;
    status: "ready" | "error";
    data: ProfileDetailResponse | null;
  } | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (cancelled) return;
      setResult({ username, status: data ? "ready" : "error", data });
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  // Fallback: look up basic data from search JSON if detail JSON is missing
  const fallbackProfile: UserProfileSummary | null = (() => {
    if (!username) return null;
    const all = extractProfilesAll();
    return all.find((p) => p.username.toLowerCase() === username.toLowerCase()) || null;
  })();

  const isLoading = !result || result.username !== username;
  const status: "loading" | "ready" | "error" = isLoading ? "loading" : result.status;
  const profileData = isLoading ? null : result.data;

  const hasDetail = status === "ready" && !!profileData;
  const hasFallback = !!fallbackProfile;

  if (!username) {
    return (
      <Layout showBadge={false}>
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-lg text-[var(--color-ink-muted)] mb-4">Invalid profile</p>
          <Link to="/" className="text-sm font-medium text-[var(--color-ink)] underline">
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  if (status === "loading") {
    return (
      <Layout title={`@${username}`}>
        <div className="max-w-2xl mx-auto bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-5 sm:p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-5 w-1/2 skeleton rounded" />
              <div className="h-4 w-1/3 skeleton rounded" />
              <div className="h-20 w-full skeleton rounded mt-4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // No detail JSON AND no fallback from search data
  if (!hasDetail && !hasFallback) {
    return (
      <Layout title={`@${username}`}>
        <div className="max-w-xl mx-auto text-center py-20">
          <p className="text-[var(--color-danger)] mb-4">
            Could not load profile details for @{username}.
          </p>
          <Link to="/" className="text-sm font-medium text-[var(--color-ink)] underline">
            Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  // Build user object: prefer full detail, fall back to search data
  const user: FullUserProfile = hasDetail
    ? profileData!.data.user_profile
    : (fallbackProfile as FullUserProfile);

  const stats = buildStats(user);

  // Detail-only sections
  const rawSimilar = hasDetail
    ? (profileData!.data as { similar_users?: Array<{ user_id: string; username: string; picture: string; followers: number; fullname: string; url: string; is_verified: boolean }> }).similar_users
    : undefined;
  const similarUsers = (rawSimilar || []).slice(0, 6);
  const tags = (user.relevant_tags || []).slice(0, 12);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-2xl mx-auto"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] mb-5 sm:mb-6 transition-default"
        >
          <ArrowLeft size={15} />
          Back to search
        </Link>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-5 sm:p-8 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
            <Avatar
              src={user.picture}
              alt={`${user.fullname || username}'s avatar`}
              size={96}
              className="ring-2 ring-[var(--color-line)] border border-[var(--color-line)]"
            />

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
                  @{user.username}
                </h2>
                <VerifiedBadge verified={user.is_verified} size={20} />
                <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-muted)] bg-[var(--color-surface-raised)] px-2 py-0.5 rounded-full ml-1 border border-[var(--color-line)]">
                  {platform}
                </span>
              </div>

              <p className="text-[var(--color-ink-muted)] mt-0.5">{user.fullname}</p>

              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-ink-subtle)] flex-wrap">
                {user.geo?.country && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {user.geo.country.name}
                  </span>
                )}
                {user.age_group && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {user.age_group}
                  </span>
                )}
                {user.language && (
                  <span className="inline-flex items-center gap-1">{user.language.name}</span>
                )}
              </div>

              {user.description && (
                <p className="mt-3 text-sm text-[var(--color-ink)] leading-relaxed">
                  {user.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-5 flex-wrap">
                <AddToListButton profile={user} variant="full" />

                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-default"
                  >
                    View on platform
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-7 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-xl border border-[var(--color-line)] p-3 sm:p-3.5 bg-[var(--color-surface-raised)]"
              >
                <div className="text-xs text-[var(--color-ink-subtle)]">{stat.label}</div>
                <div className="font-mono text-base sm:text-lg font-semibold text-[var(--color-ink)] mt-0.5">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-6 sm:mt-7">
              <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-2">Top tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag.tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border border-[var(--color-line)] bg-[var(--color-surface-raised)] text-[var(--color-ink-muted)]"
                  >
                    #{tag.tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar users */}
        {similarUsers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-3">Similar creators</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {similarUsers.map((u: { user_id: string; username: string; picture: string; followers: number; fullname: string; url: string; is_verified: boolean }) => (
                <Link
                  key={u.user_id}
                  to={`/profile/${u.username}?platform=${platform}`}
                  className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 transition-default hover:border-[var(--color-line-hover)] hover:bg-[var(--color-surface-raised)]"
                >
                  <Avatar src={u.picture} alt={`${u.fullname}'s avatar`} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--color-ink)] truncate">@{u.username}</p>
                    <p className="text-xs text-[var(--color-ink-subtle)]">{formatFollowers(u.followers)} followers</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      <ListDrawer />
    </Layout>
  );
}
