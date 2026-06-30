import { useState, useCallback } from "react";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 60%, 65%)`;
}

export function Avatar({ src, alt, size = 56, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  if (!src || failed) {
    const initials = getInitials(alt.replace(/'s avatar$/, ""));
    const bg = getColorFromString(alt);
    return (
      <div
        className={`rounded-full flex items-center justify-center shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          backgroundColor: bg,
          color: "#0a0a0a",
          fontWeight: 700,
          fontSize: Math.max(12, size * 0.35),
          letterSpacing: "0.05em",
        }}
        aria-label={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={handleError}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
