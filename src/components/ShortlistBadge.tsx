import { ListChecks } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { useMemo } from "react";

/** Header trigger showing how many creators are shortlisted; opens the list drawer. */
export function ShortlistBadge() {
  const lists = useProfileStore((state) => state.lists);
  const activeListId = useProfileStore((state) => state.activeListId);
  const openList = useProfileStore((state) => state.openList);

  const count = useMemo(() => {
    const listId = activeListId || lists[0]?.id;
    const list = lists.find((l) => l.id === listId);
    return list?.profileIds.length || 0;
  }, [lists, activeListId]);

  return (
    <button
      type="button"
      onClick={openList}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 sm:px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-soft transition-default hover:border-[var(--color-line-hover)] active:scale-95"
    >
      <ListChecks size={16} style={{ color: "var(--color-ink-muted)" }} />
      <span className="hidden sm:inline">My list</span>
      <span
        className={
          count > 0
            ? "inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1.5 rounded-full bg-[var(--color-ink)] text-[var(--color-paper)] text-xs font-mono font-bold"
            : "inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1.5 rounded-full bg-[var(--color-surface-raised)] text-[var(--color-ink-subtle)] text-xs font-mono font-bold"
        }
      >
        {count}
      </span>
    </button>
  );
}
