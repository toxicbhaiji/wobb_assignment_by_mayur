import { useState, useCallback, useMemo } from "react";
import { Trash2, X, Users2, ListPlus, ChevronDown, Pencil, Trash } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";
import { formatFollowers } from "@/utils/formatters";
import { extractProfilesAll } from "@/utils/dataHelpers";
import type { UserProfileSummary } from "@/types";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { toast } from "sonner";
import { Avatar } from "./Avatar";

interface SelectedProfilesProps {
  onClose?: () => void;
}

export function SelectedProfiles({ onClose }: SelectedProfilesProps) {
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [listMenuOpen, setListMenuOpen] = useState(false);

  const lists = useProfileStore((state) => state.lists);
  const activeListId = useProfileStore((state) => state.activeListId);
  const setActiveList = useProfileStore((state) => state.setActiveList);
  const createList = useProfileStore((state) => state.createList);
  const deleteList = useProfileStore((state) => state.deleteList);
  const renameList = useProfileStore((state) => state.renameList);
  const removeProfile = useProfileStore((state) => state.removeProfile);
  const clearAll = useProfileStore((state) => state.clearAll);
  const getActiveListProfileIds = useProfileStore((state) => state.getActiveListProfileIds);

  const profileIds = getActiveListProfileIds();

  const allProfiles = useMemo(() => extractProfilesAll(), []);

  const activeProfiles: UserProfileSummary[] = useMemo(() => {
    const set = new Set(profileIds);
    return allProfiles.filter((p) => set.has(p.user_id));
  }, [profileIds, allProfiles]);

  const activeList = lists.find((l) => l.id === (activeListId || lists[0]?.id));

  const handleCreateList = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newListName.trim()) return;
      createList(newListName.trim());
      setNewListName("");
      toast.success(`Created list "${newListName.trim()}"`);
    },
    [newListName, createList]
  );

  const handleDeleteList = useCallback(
    (id: string, name: string) => {
      deleteList(id);
      toast.info(`Deleted list "${name}"`);
    },
    [deleteList]
  );

  const handleRename = useCallback(
    (id: string) => {
      if (editingName.trim()) {
        renameList(id, editingName.trim());
        toast.success(`Renamed list to "${editingName.trim()}"`);
      }
      setEditingListId(null);
      setEditingName("");
    },
    [editingName, renameList]
  );

  const handleProfileClick = useCallback(
    (username: string, platform: string) => {
      onClose?.();
      navigate(`/profile/${username}?platform=${platform}`);
    },
    [navigate, onClose]
  );

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-line)] p-4 sm:p-5 shadow-soft h-full md:h-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[var(--color-ink)]">
            Your list
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-subtle)" }}>
            {activeProfiles.length === 0
              ? "Nobody shortlisted yet"
              : `${activeProfiles.length} creator${activeProfiles.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {activeProfiles.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-ink-subtle)] hover:text-[var(--color-danger)] transition-default px-2 py-1.5 rounded-lg hover:bg-[var(--color-danger-soft)]"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close list"
              className="md:hidden h-9 w-9 grid place-items-center rounded-full text-[var(--color-ink-subtle)] hover:bg-[var(--color-surface-raised)] transition-default"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* List selector */}
      <div className="mb-3 relative">
        <button
          type="button"
          onClick={() => setListMenuOpen((v) => !v)}
          className="w-full flex items-center justify-between rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-raised)] px-3 py-2 text-sm text-[var(--color-ink)] transition-default hover:border-[var(--color-line-hover)]"
        >
          <span className="truncate">{activeList?.name}</span>
          <ChevronDown size={14} style={{ color: "var(--color-ink-subtle)" }} />
        </button>

        {listMenuOpen && (
          <div className="absolute z-10 top-full mt-1 left-0 right-0 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-soft-lg overflow-hidden">
            {lists.map((list) => (
              <div
                key={list.id}
                className={clsx(
                  "flex items-center justify-between px-3 py-2 text-sm transition-default",
                  activeListId === list.id || (!activeListId && list.id === lists[0]?.id)
                    ? "text-[var(--color-ink)] bg-[var(--color-surface-raised)]"
                    : "text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]"
                )}
              >
                {editingListId === list.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleRename(list.id);
                    }}
                    className="flex-1 flex items-center gap-1"
                  >
                    <input
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 rounded border border-[var(--color-line)] bg-[var(--color-surface-raised)] px-2 py-1 text-sm text-[var(--color-ink)] outline-none"
                    />
                  </form>
                ) : (
                  <button
                    type="button"
                    className="flex-1 text-left truncate"
                    onClick={() => {
                      setActiveList(list.id);
                      setListMenuOpen(false);
                    }}
                  >
                    {list.name} ({list.profileIds.length})
                  </button>
                )}
                {lists.length > 1 && (
                  <div className="flex items-center gap-0.5 ml-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingListId(list.id);
                        setEditingName(list.name);
                      }}
                      className="p-1 rounded text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-elevated)] transition-default"
                      aria-label={`Rename ${list.name}`}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id, list.name);
                        setListMenuOpen(false);
                      }}
                      className="p-1 rounded text-[var(--color-ink-subtle)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] transition-default"
                      aria-label={`Delete ${list.name}`}
                    >
                      <Trash size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <form onSubmit={handleCreateList} className="px-3 py-2 border-t border-[var(--color-line)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="New list"
                  className="flex-1 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-raised)] px-2.5 py-1.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-subtle)] outline-none focus:border-[var(--color-line-hover)]"
                />
                <button
                  type="submit"
                  disabled={!newListName.trim()}
                  className="h-9 w-9 grid place-items-center rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] disabled:opacity-30 transition-default"
                  aria-label="Create new list"
                >
                  <ListPlus size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Profile list */}
      {activeProfiles.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface-raised)]">
          <div className="h-11 w-11 rounded-full bg-[var(--color-surface-elevated)] grid place-items-center mb-3">
            <Users2 size={20} style={{ color: "var(--color-ink-muted)" }} />
          </div>
          <p className="text-sm max-w-[220px]" style={{ color: "var(--color-ink-muted)" }}>
            Tap <span className="font-semibold text-[var(--color-ink)]">+</span> on any creator
            to add them here.
          </p>
        </div>
      ) : (
        <ul className="space-y-2 flex-1 overflow-y-auto -mx-1 px-1 md:max-h-[60vh] min-h-0">
          {activeProfiles.map((profile) => (
            <li
              key={profile.user_id}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-line)] p-2.5 transition-default hover:border-[var(--color-line-hover)] hover:bg-[var(--color-surface-raised)] cursor-pointer"
              onClick={() => handleProfileClick(profile.username, profile.platform || "instagram")}
            >
              <Avatar
                src={profile.picture}
                alt={`${profile.fullname}'s avatar`}
                size={40}
                className="ring-1 ring-[var(--color-line)]"
              />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-ink)] truncate">
                  @{profile.username}
                </p>
                <p className="text-xs font-mono" style={{ color: "var(--color-ink-subtle)" }}>
                  {formatFollowers(profile.followers)} followers
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProfile(profile.user_id);
                }}
                aria-label={`Remove @${profile.username} from list`}
                className="h-8 w-8 grid place-items-center rounded-full text-[var(--color-ink-subtle)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] transition-default shrink-0"
              >
                <X size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
