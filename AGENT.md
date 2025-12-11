AGENT.md — CodeLearn Frontend Development Guide (Codex Edition)
Version: 2025-01 — Polished, Extended, Fully Compatible
1. Project Context
Workspace & Path Rules

Frontend root (React + Vite):
/mnt/c/Users/omari/projects/codelearn_front

Backend root (Spring Boot — STRICTLY OFF LIMITS):
codelearn_back/ or learncode/ depending on local structure.
❗ Codex MUST NEVER modify, read, or suggest edits inside the backend folder.

Backend API Host

Local API base URL: http://localhost:8080

Apprenant routes exposed under: /api/apprenant/

Roles in Platform

Frontend implements UI for the Apprenant role:

List + search courses

View course details

Access supports (PDF/Video)

Complete modules

View learning progress

Backend already supports:

Course search

Course detail

Support access (temporary URL)

Module completion tracking

2. Hard Rules (Mandatory for Codex)
🔒 ABSOLUTE RESTRICTION

Codex must NOT modify anything inside the backend:

Entities

Services

Repositories

Controllers

application.properties

DTOs in backend

pom.xml

Database schema

If Codex receives a request involving backend changes, it MUST answer:

“🚫 Modification forbidden by AGENT.md: backend is off-limits.”

📁 Allowed Frontend Technologies

Codex may ONLY use:

React 18

Vite

TypeScript

Tailwind CSS

React Router v6

Axios

LocalStorage / SessionStorage

Heroicons (optional, no extra UI libs)

❌ Forbidden unless user explicitly asks:

Redux

Zustand

Material UI / Chakra

Bootstrap

Next.js

Server-side rendering

Any authentication library

3. Required Project Structure

Codex must always respect this structure and create missing folders as needed:

codelearn_front/
 ├── src/
 │   ├── api/
 │   │     └── http.ts                 → Axios instance
 │   ├── components/
 │   │     ├── layout/
 │   │     │     └── AppLayout.tsx     → Sidebar + header layout
 │   │     └── ui/                     → Reusable UI widgets
 │   ├── pages/
 │   │     ├── CoursesPage.tsx         → Course search/list page
 │   │     └── CourseDetailPage.tsx    → Course detail + modules/supports
 │   ├── types/
 │   │     └── api.ts                  → Frontend DTO typings
 │   ├── App.tsx                       → Router
 │   ├── main.tsx
 │   └── index.css                     → Tailwind styles
 ├── vite.config.ts
 ├── tsconfig.json
 ├── package.json
 └── .env.development

Structure Rules

1 component per file

Components use functional React + hooks

File names use camelCase

Pages live in /pages

Layouts in /components/layout

Reusable UI in /components/ui

4. API Rules
🟦 Axios Instance (shared)

File: /src/api/http.ts

Rules:

Must always use baseURL: import.meta.env.VITE_API_BASE_URL

Must include 5s timeout

No direct fetch() usage unless user explicitly asks

All API calls must use this shared instance

🌍 Environment Variables

.env.development must include:

VITE_API_BASE_URL=/api/apprenant

🔁 Vite Proxy (important)

vite.config.ts must proxy:

/api → http://localhost:8080


This eliminates CORS issues during local development.

5. DTO Contracts (Strict)

Codex must not alter the shape unless user explicitly requests.

CourseSummaryDto
{
  id: number;
  title: string;
  description: string;
  authorName: string;
  supportsCount: number;
}

CourseDetailDto
{
  id: number;
  title: string;
  description: string;
  authorName: string;
  supports: SupportDto[];
  modules: ModuleDto[];
}

ModuleDto
{
  id: number;
  title: string;
  type: "PDF" | "VIDEO" | "Video";
  completed: boolean;
  completedAt?: string;
}

SupportDto
{
  id: number;
  title: string;
  description: string;
  type: "PDF" | "VIDEO" | "Video";
  accessEndpoint: string;
  courseId: number;
}

SupportAccessDto
{
  supportId: number;
  temporaryUrl: string;
  expiresAt: string;
}

ModuleProgressDto
{
  courseId: number;
  moduleId: number;
  apprenantId: number;
  completedAt: string;
}

6. Page-Level UI Requirements
CoursesPage

Search input

Debounced query updates

Grid of course cards

Show: title, author, description, supportsCount

Click → navigate to /courses/:id

Show empty & error states

CourseDetailPage

Header: title, author

Module/support list

Support card must include:

icon based on type

description

“Access” button → calls /supports/{id}/access, opens new tab

“Complete Module” button

Completed modules show:

green checkmark

completion timestamp

7. Layout & Design Rules
Global Style System

Tailwind only

Neutral palette: slate/gray

Primary color: blue-600

Secondary: blue-500 hover

Modern dashboard look

Layout (AppLayout.tsx)

Sidebar with:

Courses

My Progress

Responsive: collapses on mobile

Header includes search/personalization components

8. Router Rules

React Router v6 routing:

"/" → CoursesPage
"/courses/:courseId" → CourseDetailPage


All pages must be wrapped by <AppLayout> from components/layout.

9. User Identity Rules

No real authentication

Apprenant is always id = 1

This must NOT be hardcoded in API URLs

Use backend’s default apprenant ID internally

10. High-Impact UI Enhancements (Suggested)

Codex may implement these without asking if they stay inside frontend rules:

Course sorting (A-Z, newest, most modules)

Per-course progress badge (“3/8 completed”)

Inline completion feedback (checkmark + toast)

Mobile-friendly sticky course header

More informative empty/error states

11. Testing Rules (Optional)

Only implement tests (Vitest/RTL) if explicitly requested.
Default behavior: no tests.

12. Commands (Frontend)

From project root codelearn_front:

npm install
npm run dev


Backend must be running at:

http://localhost:8080

13. “Ask Before Acting” Conditions

Codex must ALWAYS ask before making changes to:

Backend files

DTO shapes

Folder structure

Adding new libraries

Changing API endpoints

Modifying routing structure

14. Main Objective

Codex must:

Build a clean, modern, maintainable frontend

Implement all Apprenant flows

Follow strict placement rules

Keep backend untouched

Maintain TypeScript type safety

Use Axios + Vite proxy properly

Respect all UI/UX requirements

15. Codex Work Log

- Established Vite + React 18 + TS + Tailwind baseline (package configs, entry files, Tailwind wiring).
- Added shared infrastructure: Axios instance (src/api/http.ts) now env-driven with 5s timeout, DTO typings (src/types/api.ts), helper hooks/utils, UI primitives (buttons, cards, badges, search input, loading/empty states, icons).
- Configured Vite proxy (/api → http://localhost:8080) and .env.development (VITE_API_BASE_URL=/api/apprenant) to avoid CORS during dev; default API base remains http://localhost:8080/api/apprenant.
- Implemented AppLayout with responsive sidebar/header; router for "/" and "/courses/:courseId".
- Built CoursesPage (search with debounce, pagination, error/empty handling, sorting control, refreshed gradient cards).
- Built CourseDetailPage (hero stats, modules/supports lists, support access, module completion with inline success/info/error toasts, mobile sticky summary bar, improved support/module cards).
- Added shared Toast component, tightened layout polish (gradient background, stronger card styling), and aligned API client to env-driven base with timeout.
- **[2025-11-30] COMPLETE FRONTEND REDESIGN:**
  - **Design System Overhaul:** Extended tailwind.config.ts with comprehensive color palette (primary indigo, secondary purple, accent emerald, warm orange), typography scale (8 sizes with line-heights), custom spacing, shadow levels (sm/md/lg/xl/2xl + glow variants), animation keyframes (fade/slide/scale/shimmer/float), transitions (200-400ms).
  - **Global Styles Enhanced:** Added CSS variables for gradients, custom scrollbar styling (gradient thumb), selection colors, focus-visible outlines, utility classes (card-hover, gradient-text, shimmer-effect, glass-effect), shake/confetti animations.
  - **New UI Components Created:**
    - Avatar: Multiple sizes (sm/md/lg/xl), gradient backgrounds, status indicators (online/offline/away), initials generation
    - Skeleton: Multiple variants (text/circular/rectangular/rounded), shimmer animation, compound patterns (SkeletonCard, SkeletonText)
    - ProgressBar: Linear and circular variants, 4 color schemes, animated transitions, percentage labels
    - Tooltip: 4 positions (top/bottom/left/right), delay control, fade animations, arrow indicators
    - Dropdown: Click-outside detection, alignment options, compound components (DropdownItem, DropdownDivider), icon support
    - Tabs: 3 variants (underline/pills/bordered), badge support, smooth transitions, TabPanel wrapper
  - **Redesigned Core Components:**
    - Button: 6 variants (primary/secondary/ghost/success/danger/outline), 4 sizes, icon support (left/right), loading states, active scale animation, gradient backgrounds
    - Card: 4 variants (elevated/flat/bordered/gradient), hover effects with lift, configurable padding, onClick support
    - Badge: 7 variants, 3 sizes, 2 shapes (pill/square), icon/dot support, ring insets
  - **Toast System Reimagined:** Context-based ToastProvider with useToast hook, positioned top-right stack (max 3 visible), auto-dismiss with custom duration, 4 tones (success/error/info/warning), slide-in animations, icon indicators, dismissible
  - **AppLayout Transformation:**
    - Replaced sidebar with modern top navigation bar (logo + brand, centered nav links, right-aligned user menu)
    - Added breadcrumb navigation with dynamic path generation
    - User dropdown menu with Avatar, profile/settings/logout options
    - Mobile: collapsible menu + bottom tab navigation
    - Notification bell with badge indicator
    - Search shortcut button (⌘K hint)
    - Gradient brand logo, glass-effect navbar, smooth transitions
  - **CoursesPage Overhaul:**
    - Immersive animated gradient hero section with search bar, dynamic course count
    - Filter chips system (All/In Progress/Completed) with color-coded states
    - View mode toggle (grid/list) with icons
    - Enhanced sort dropdown with emoji icons
    - Course cards with thumbnail placeholders, author avatars, hover 3D lift effects, progress indicators
    - Skeleton loading states (6 cards)
    - Improved pagination with page count display
  - **CourseDetailPage Reimagined:**
    - Immersive hero with course thumbnail, gradient background, author avatar, quick stats cards (modules/resources/completion)
    - Tabbed interface with 4 tabs (Overview/Content/Resources/Progress) using pills variant
    - Overview tab: About section + progress visualization with circular progress bars
    - Content tab: Enhanced module list with numbered badges, completion animations, progress tracking
    - Resources tab: Support items with type-colored badges and access buttons
    - Progress tab: Timeline view of completed modules with timestamps, animated success indicators
    - Achievement badges for milestones (first module, 50%, 100% completion)
    - Toast notifications integrated (success confetti for completions, error feedback, info for access)
  - **Component Updates:**
    - ModuleItem: Numbered badges, completion checkmarks with scale-in animation, enhanced hover states, type icons
    - SupportItem: Type-colored badges (video=primary, pdf=success), improved descriptions, access icons
    - CourseCard: Thumbnail placeholders, author avatars, progress rings, hover animations, gradient overlays
  - **Build Status:** ✅ Successful compilation, no TypeScript errors, optimized production bundle (260KB JS, 39KB CSS)

