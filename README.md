# Wobb Creator Search

A modern web application for searching and managing influencer/creator profiles across Instagram, YouTube, and TikTok platforms.

## What Changed

### 1. Bug Fixes
- **profileLoader.ts**: Fixed the async `import.meta.glob` to use eager loading with a fast lookup map, eliminating race conditions and failed profile loads.
- **formatFollowers**: Fixed edge cases where `0`, `undefined`, or `null` values would produce incorrect output (e.g. `"0.0K"`).
- **AddToListButton**: Fixed stale closure bug where toast messages showed incorrect add/remove state.
- **ProfileDetailPage**: Fixed hooks order violation — `useMemo` was called conditionally after early returns.
- **Broken profile images**: Added a smart `Avatar` component with initials fallback and colored backgrounds when external image URLs fail.
- **Back button resets platform**: Store `platform` and `search` in URL query params so browser back preserves the user's platform filter and search query.
- **Missing profile details**: Gracefully fall back to search data for profiles that lack detail JSON files, instead of showing a raw error page.
- **YouTube profile navigation**: Fixed `username` mapping for YouTube profiles which use `handle` instead of `username` in the source data.
- **Mobile list drawer spam**: Removed the auto-open drawer behavior when adding a profile, preventing the list from popping up repeatedly on mobile.
- **List dropdown staying open**: The create-list form inside the dropdown now closes the dropdown after submission.

### 2. UI/UX Redesign
- Complete black & white dark theme with subtle gray surfaces, replacing the original light SaaS gradient design.
- Modern card hover effects with lift animation and subtle border glow.
- Framer Motion entrance animations for cards, stats, and page transitions.
- Responsive layout with mobile-first design — works on all screen sizes.
- Glassmorphism header with backdrop blur.
- Custom scrollbar, selection styling, and reduced-motion support.
- **Animated splash screen**: "Wobb" wordmark with staggered letter animation, progress bar, and smooth fade-out on first load.
- **About Me page**: A dedicated profile page for Mayur Dimri showcasing education, projects, and contact information.

### 3. State Management (Zustand)
- Migrated from a flat array to a **named lists** architecture.
- Users can create, rename, delete, and switch between multiple shortlists.
- Zustand `persist` middleware keeps lists in `localStorage` with automatic rehydration.
- Active list selector in the sidebar panel with inline list management.

### 4. "Add to List" Feature
- Compact `+` button on profile cards and full dropdown button on detail pages.
- Dropdown to choose which list to add to, or create a new list on the fly.
- Duplicate prevention — same profile can't be added twice to the same list.
- Toast notifications for add, remove, create, rename, and delete actions.
- Profile removal from list via sidebar X button.
- "Clear all" to empty the active list.

### 5. Sorting
- Added sort dropdown on Search page: Most Followers, Fewest Followers, Highest Engagement, Name A-Z.

### 6. Profile Detail Enhancements
- Similar creators section with quick navigation links.
- Top tags section extracted from profile data.
- Location, age group, and language metadata display.
- Skeleton loading state for detail page.

### 7. Performance Optimizations
- `memo()` on `ProfileCard` to prevent unnecessary re-renders during search typing.
- `useCallback` for event handlers and navigation.
- `useMemo` in `useProfiles` hook for expensive filtering + sorting.
- Eager JSON loading via `import.meta.glob(..., { eager: true })` eliminates async waterfalls.
- Profile ID → data lookup map for instant shortlist resolution.

### 8. Code Quality
- Strong TypeScript types throughout (no `any` except for raw JSON edge cases).
- Atomic component structure with clear separation of concerns.
- Custom hooks (`useProfiles`) for data logic.
- Consistent naming and folder structure.
- Proper ARIA labels, keyboard navigation, and focus states.

## Libraries Added

| Library | Purpose |
|---------|---------|
| `zustand` | State management (was already present, extended for named lists) |
| `framer-motion` | Animations (card entrance, page transitions, drawer) |
| `@tanstack/react-query` | Query client provider (ready for future API integration) |
| `tailwind-merge` | Utility for merging Tailwind classes |
| `clsx` | Conditional class composition |
| `lucide-react` | Icons (already present) |
| `sonner` | Toast notifications (already present) |
| `react-router-dom` | Routing (already present) |

## Assumptions
- Data is static JSON loaded at build time; no live API integration.
- Profile detail pages rely on JSON files in `src/assets/data/profiles/` matching the username.
- Creator pictures are external URLs (imgp.sptds.icu proxy) and may break if the service is unavailable.
- Platform information for shortlist items is derived from the search data the profile came from.

## Trade-offs
- **No virtualized list**: With ~100 creators per platform, standard DOM rendering is fast enough. React Window could be added if scaling to thousands.
- **Single chunk bundle**: The app is small enough for one JS file; code-splitting by route could reduce initial load.
- **No backend**: Lists persist only in localStorage. A real backend would be needed for multi-device sync.
- **No image optimization**: External avatar URLs are used directly. A CDN or image proxy would improve reliability.

## Remaining Improvements
- Add CSV/JSON export for shortlists.
- Add comparison mode to view multiple creator stats side-by-side.
- Add chart visualization for historical follower/engagement trends (stat_history data already available).
- Add dark/light mode toggle (currently hardcoded dark).
- Add unit tests with Vitest + React Testing Library.
- Add E2E tests with Playwright.

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Production build         |
| `npm run lint` | Run ESLint               |
