import { BadgeCheck } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
  size?: number;
}

export function VerifiedBadge({ verified, size = 16 }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <BadgeCheck
      aria-label="Verified account"
      className="shrink-0"
      size={size}
      strokeWidth={2.5}
      style={{ color: "var(--color-ink)" }}
    />
  );
}
