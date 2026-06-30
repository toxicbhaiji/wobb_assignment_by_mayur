import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, ShortList } from "@/types";

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

interface ProfileStore {
  lists: ShortList[];
  activeListId: string | null;
  createList: (name: string) => string;
  deleteList: (id: string) => void;
  renameList: (id: string, name: string) => void;
  setActiveList: (id: string | null) => void;
  addProfile: (profile: UserProfileSummary) => { added: boolean; listName: string };
  removeProfile: (userId: string) => void;
  toggleProfile: (profile: UserProfileSummary) => { added: boolean; listName: string };
  isSelected: (userId: string) => boolean;
  clearAll: () => void;
  moveProfile: (profileId: string, fromListId: string, toListId: string) => void;
  getActiveListProfileIds: () => string[];

  isListOpen: boolean;
  openList: () => void;
  closeList: () => void;
  toggleList: () => void;
}

const DEFAULT_LIST_NAME = "My Shortlist";

function createDefaultList(): ShortList {
  return {
    id: generateId(),
    name: DEFAULT_LIST_NAME,
    createdAt: Date.now(),
    profileIds: [],
  };
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      lists: [createDefaultList()],
      activeListId: null,

      createList: (name) => {
        const id = generateId();
        const trimmed = name.trim() || DEFAULT_LIST_NAME;
        set((state) => ({
          lists: [...state.lists, { id, name: trimmed, createdAt: Date.now(), profileIds: [] }],
          activeListId: id,
        }));
        return id;
      },

      deleteList: (id) =>
        set((state) => {
          const remaining = state.lists.filter((l) => l.id !== id);
          if (remaining.length === 0) remaining.push(createDefaultList());
          return {
            lists: remaining,
            activeListId: state.activeListId === id ? remaining[0].id : state.activeListId,
          };
        }),

      renameList: (id, name) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === id ? { ...l, name: name.trim() || l.name } : l
          ),
        })),

      setActiveList: (id) => set({ activeListId: id }),

      addProfile: (profile) => {
        const state = get();
        const listId = state.activeListId || state.lists[0].id;
        const list = state.lists.find((l) => l.id === listId);
        if (!list) return { added: false, listName: "" };
        if (list.profileIds.includes(profile.user_id)) {
          return { added: false, listName: list.name };
        }
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === listId ? { ...l, profileIds: [...l.profileIds, profile.user_id] } : l
          ),
          activeListId: listId,
        }));
        return { added: true, listName: list.name };
      },

      removeProfile: (userId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            state.activeListId && l.id === state.activeListId
              ? { ...l, profileIds: l.profileIds.filter((id) => id !== userId) }
              : l
          ),
        })),

      toggleProfile: (profile) => {
        const state = get();
        const listId = state.activeListId || state.lists[0].id;
        const list = state.lists.find((l) => l.id === listId);
        if (!list) return { added: false, listName: "" };
        const exists = list.profileIds.includes(profile.user_id);
        if (exists) {
          get().removeProfile(profile.user_id);
          return { added: false, listName: list.name };
        }
        return get().addProfile(profile);
      },

      isSelected: (userId) => {
        const state = get();
        const listId = state.activeListId || state.lists[0].id;
        const list = state.lists.find((l) => l.id === listId);
        return list ? list.profileIds.includes(userId) : false;
      },

      getActiveListProfileIds: () => {
        const state = get();
        const listId = state.activeListId || state.lists[0]?.id;
        const list = state.lists.find((l) => l.id === listId);
        return list?.profileIds || [];
      },

      clearAll: () =>
        set((state) => ({
          lists: state.lists.map((l) =>
            state.activeListId && l.id === state.activeListId ? { ...l, profileIds: [] } : l
          ),
        })),

      moveProfile: (profileId, fromListId, toListId) =>
        set((state) => ({
          lists: state.lists.map((l) => {
            if (l.id === fromListId) {
              return { ...l, profileIds: l.profileIds.filter((id) => id !== profileId) };
            }
            if (l.id === toListId && !l.profileIds.includes(profileId)) {
              return { ...l, profileIds: [...l.profileIds, profileId] };
            }
            return l;
          }),
        })),

      isListOpen: false,
      openList: () => set({ isListOpen: true }),
      closeList: () => set({ isListOpen: false }),
      toggleList: () => set((state) => ({ isListOpen: !state.isListOpen })),
    }),
    {
      name: "wobb-lists-v2",
      partialize: (state) => ({ lists: state.lists, activeListId: state.activeListId }),
    }
  )
);
