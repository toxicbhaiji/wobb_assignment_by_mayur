# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Wobb Creator Search

### 1.2 Application Description
A web application for searching and managing influencer/creator profiles across Instagram, YouTube, and TikTok platforms. Users can search creators, view detailed profiles, and organize them into custom named lists for campaign management.

## 2. Users and Usage Scenarios

### 2.1 Target Users
- Marketing professionals managing influencer campaigns
- Brand managers seeking creator partnerships
- Agency teams organizing creator databases

### 2.2 Core Usage Scenarios
- Search creators by username or full name across multiple platforms
- Filter and sort creators by platform, followers, engagement metrics
- View detailed creator statistics and profile information
- Organize creators into custom named lists for different campaigns
- Manage shortlisted creators with add/remove operations

## 3. Page Structure and Functionality

### 3.1 Page Hierarchy

```
Wobb Creator Search
├── Search Page (/)
│   ├── Header (with list count badge)
│   ├── Search & Filter Section
│   ├── Creator Cards Grid
│   └── List Panel/Drawer (Desktop: sidebar, Mobile: drawer)
└── Profile Detail Page (/profile/:username?platform=X)
    ├── Header (with list count badge)
    ├── Profile Information Section
    ├── Stats Grid
    └── List Panel/Drawer (Desktop: sidebar, Mobile: drawer)
```

### 3.2 Search Page (/)

#### 3.2.1 Header
- Display application branding
- Show list count badge indicating number of shortlisted profiles
- Mobile: badge triggers list drawer when clicked

#### 3.2.2 Search & Filter Section
- **Search Input**: Real-time search by username or full name
- **Platform Filter**: Filter by Instagram, YouTube, TikTok, or All platforms
- **Sort Options**: Sort by followers (high to low), engagement rate (high to low), or name (A-Z)

#### 3.2.3 Creator Cards Grid
- Display creator cards in responsive grid layout
- Each card shows:
  - Avatar image
  - Username
  - Verified badge (if applicable)
  - Follower count (formatted: 1.2M, 850K, etc.)
  - Engagement rate percentage
  - Platform badge
  - Add to List button
- Click card to navigate to profile detail page
- Hover effects with animations

#### 3.2.4 Add to List Functionality
- User can create custom named lists (e.g., \"Campaign Q3\", \"Travel Creators\")
- Select active list from dropdown or create new list
- Add button adds current profile to selected list
- Prevent duplicate entries in same list
- Show toast notification on successful add or duplicate attempt
- Update list count badge in header

#### 3.2.5 List Panel (Desktop) / List Drawer (Mobile)
- **Desktop**: Sticky sidebar panel always visible on right side
- **Mobile**: Slide-over drawer triggered by header badge
- Display all profiles in current active list:
  - Avatar
  - Username
  - Follower count
  - Remove button per profile
- List management actions:
  - Switch between named lists
  - Remove individual profiles from list
  - Clear all profiles from current list
  - Create new named list
- Lists persist after page refresh

### 3.3 Profile Detail Page (/profile/:username?platform=X)

#### 3.3.1 Header
- Same as Search Page header with list count badge

#### 3.3.2 Profile Information Section
- Large avatar image
- Username
- Verified badge (if applicable)
- Platform badge
- Bio/description text
- External profile link (opens in new tab)
- Add to List button

#### 3.3.3 Stats Grid
- Display key metrics in grid layout:
  - Total followers
  - Engagement rate percentage
  - Total engagements
  - Total posts
  - Average likes per post
  - Average comments per post
  - Average views per post (if applicable)
- Format numbers with appropriate units (K, M)

#### 3.3.4 List Panel/Drawer
- Same functionality as Search Page list panel/drawer

## 4. Business Rules and Logic

### 4.1 Search and Filter Logic
- Search matches against username and full name fields
- Search is case-insensitive
- Platform filter applies to search results
- Sort order applies after search and filter
- Empty search shows all creators

### 4.2 List Management Logic
- Each named list is independent
- One list is active at a time
- Adding profile to list:
  - Check if profile already exists in selected list
  - If exists, show toast notification and do not add
  - If not exists, add to list and show success toast
- Removing profile from list:
  - Remove only from current active list
  - Show confirmation toast
- Clearing list:
  - Remove all profiles from current active list
  - Show confirmation toast
- List data persists in browser storage

### 4.3 Navigation Logic
- Clicking creator card navigates to profile detail page with username and platform parameters
- Profile detail page loads data based on username and platform query parameter
- Back navigation returns to search page with preserved search/filter state

### 4.4 Data Loading Logic
- Search page loads creator data from local JSON files:
  - src/assets/data/search/instagram.json
  - src/assets/data/search/youtube.json
  - src/assets/data/search/tiktok.json
- Profile detail page loads data from src/assets/data/profiles/ directory
- Data loading uses proper import patterns

### 4.5 Follower Count Formatting
- Numbers >= 1,000,000: format as X.XM (e.g., 1.2M)
- Numbers >= 1,000: format as X.XK (e.g., 850K)
- Numbers < 1,000: display as-is
- Handle edge cases: 0 displays as \"0\", undefined/null displays as \"N/A\"

## 5. Exceptions and Edge Cases

| Scenario | Handling |
|----------|----------|
| No search results | Display \"No creators found\" message |
| Profile data not found | Display error message on detail page |
| Duplicate add to list | Show toast: \"Creator already in this list\" |
| Empty list | Display \"No creators in this list yet\" message |
| Invalid profile URL parameter | Redirect to search page or show 404 |
| Data loading failure | Show error toast and retry option |
| Zero followers | Display \"0\" instead of error |
| Missing engagement rate | Display \"N/A\" |
| Long bio text | Truncate with \"Read more\" expansion |
| Slow network | Show loading skeleton states |

## 6. Acceptance Criteria

1. User opens application and sees search page with creator cards from all platforms
2. User enters search term and sees filtered results in real-time
3. User selects platform filter and sees only creators from that platform
4. User clicks creator card and navigates to profile detail page showing full stats
5. User creates new named list (e.g., \"Summer Campaign\") and adds creator to list
6. User sees list count badge update in header and opens list panel showing added creator
7. User removes creator from list and sees list count decrease
8. User refreshes page and sees lists persist with all previously added creators

## 7. Features Not Included in This Release

- User authentication and login system
- Backend API integration for live data
- Export lists to CSV or other formats
- Share lists with other users
- Advanced analytics and reporting
- Creator comparison features
- Email notifications
- Bulk operations on multiple creators
- List collaboration features
- Creator contact information management
- Campaign tracking and ROI metrics
- Integration with social media APIs for real-time data
- Creator outreach and messaging
- Payment and contract management
- Multi-language support
- Dark mode toggle
- Custom dashboard views
- Saved search queries
- Creator recommendations based on preferences