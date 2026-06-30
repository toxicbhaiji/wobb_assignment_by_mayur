export function formatFollowers(count: number | undefined | null): string {
  if (count === undefined || count === null) return "N/A";
  if (count === 0) return "0";
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined || rate === null) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return "N/A";
  return value.toLocaleString();
}
