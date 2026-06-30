import { useState, useRef, useEffect, useCallback } from "react";
import { Check, Plus, ListPlus } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import type { UserProfileSummary } from "@/types";
import { useProfileStore } from "@/store/profileStore";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  /** "compact" is used on cards, "full" on the profile detail page. */
  variant?: "compact" | "full";
  className?: string;
}

export function AddToListButton({
  profile,
  variant = "compact",
  className,
}: AddToListButtonProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isSelected = useProfileStore((state) => state.isSelected(profile.user_id));
  const toggleProfile = useProfileStore((state) => state.toggleProfile);
  const lists = useProfileStore((state) => state.lists);
  const activeListId = useProfileStore((state) => state.activeListId);
  const createList = useProfileStore((state) => state.createList);
  const setActiveList = useProfileStore((state) => state.setActiveList);

  const activeList = lists.find((l) => l.id === (activeListId || lists[0]?.id));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setNewListName("");
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const result = toggleProfile(profile);
      if (result.added) {
        toast.success(`Added @${profile.username} to ${result.listName}`, {
          description: "View your list in the sidebar.",
        });
      } else {
        toast.info(`Removed @${profile.username} from ${result.listName}`);
      }
    },
    [toggleProfile, profile]
  );

  const handleCreateList = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newListName.trim();
      if (!trimmed) return;
      createList(trimmed);
      setNewListName("");
      setDropdownOpen(false);
      toast.success(`Created list "${trimmed}"`);
    },
    [newListName, createList]
  );

  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-default cursor-pointer select-none";

  if (variant === "full") {
    return (
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setDropdownOpen((v) => !v);
          }}
          className={clsx(
            base,
            "px-5 py-2.5 rounded-full text-sm active:scale-95",
            isSelected
              ? "bg-[var(--color-surface-raised)] text-[var(--color-ink)] border border-[var(--color-line)] hover:bg-[var(--color-surface-elevated)]"
              : "bg-[var(--color-ink)] text-[var(--color-paper)] border border-transparent hover:bg-[var(--color-signal-dark)]",
            className
          )}
        >
          {isSelected ? <Check size={16} /> : <Plus size={16} />}
          {isSelected ? `In ${activeList?.name}` : "Add to list"}
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-2 z-20 w-64 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-[var(--color-line)]">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
                Choose list
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto py-1">
              {lists.map((list) => (
                <button
                  key={list.id}
                  type="button"
                  onClick={() => {
                    setActiveList(list.id);
                    setDropdownOpen(false);
                    toast.success(`Switched to ${list.name}`);
                  }}
                  className={clsx(
                    "w-full text-left px-3 py-2 text-sm transition-default flex items-center justify-between",
                    activeListId === list.id || (!activeListId && list.id === lists[0]?.id)
                      ? "text-[var(--color-ink)] bg-[var(--color-surface-raised)]"
                      : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]"
                  )}
                >
                  <span className="truncate">{list.name}</span>
                  <span className="text-xs text-[var(--color-ink-subtle)]">{list.profileIds.length}</span>
                </button>
              ))}
            </div>
            <form onSubmit={handleCreateList} className="px-3 py-2 border-t border-[var(--color-line)]">
              <input
                ref={inputRef}
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name"
                className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] outline-none focus:border-[var(--color-line-hover)]"
              />
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isSelected ? `Remove @${profile.username} from list` : `Add @${profile.username} to list`}
      title={isSelected ? "Remove from list" : "Add to list"}
      className={clsx(
        base,
        "h-9 w-9 rounded-full border text-sm shrink-0 active:scale-90",
        isSelected
          ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]"
          : "bg-[var(--color-surface)] text-[var(--color-ink)] border-[var(--color-line)] hover:border-[var(--color-line-hover)] hover:bg-[var(--color-surface-raised)]",
        className
      )}
    >
      {isSelected ? <Check size={16} /> : <ListPlus size={16} />}
    </button>
  );
}
