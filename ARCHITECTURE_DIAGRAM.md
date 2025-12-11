# 📐 Frontend Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐       │
│  │  Course List     │  Click       │ Course Details   │       │
│  │  Component       │─────────────▶│  Component       │       │
│  │                  │              │                  │       │
│  │  - All Courses   │              │  - Course Info   │       │
│  │  - Grid Layout   │              │  - Supports List │       │
│  │  - Status Badge  │              │  - Download Btns │       │
│  └──────────────────┘              └──────────────────┘       │
│           │                                  │                  │
└───────────┼──────────────────────────────────┼─────────────────┘
            │                                  │
            │                                  │
┌───────────▼──────────────────────────────────▼─────────────────┐
│                     API SERVICE LAYER                           │
│                   (courseService.js)                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  getAllCourses()      → GET /api/cours/liste            │  │
│  │  getCourseById(id)    → GET /api/cours/{id}             │  │
│  │  getCourseSupports(id)→ GET /api/cours/{id}/supports    │  │
│  │  createCourse()       → POST /api/cours/publier         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    SPRING BOOT BACKEND                          │
│                  (localhost:8080)                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              CoursController                             │ │
│  │  @GetMapping("/liste")           → getAllCours()        │ │
│  │  @GetMapping("/{id}")            → getCoursById()       │ │
│  │  @GetMapping("/{id}/supports")   → getSupportsByCoursId()│ │
│  └──────────────────────────────────────────────────────────┘ │
│                           │                                     │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │              CoursService                                 │ │
│  │  - getAllCours()                                          │ │
│  │  - getCoursById()                                         │ │
│  │  - getSupportsByCoursId()                                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                     │
│  ┌────────────────────────▼──────────────────────────────────┐ │
│  │          Repositories (JPA)                               │ │
│  │  - CoursRepository                                        │ │
│  │  - SupportPedagogiqueRepository                           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       DATABASE                                  │
│                                                                 │
│  ┌──────────────┐              ┌──────────────────┐           │
│  │   Cours      │              │ SupportPedagogique│           │
│  │              │              │                   │           │
│  │  id          │◀─────────────│  id               │           │
│  │  titre       │  OneToMany   │  typeSupport      │           │
│  │  description │              │  url              │           │
│  │  createur_id │              │  fileName         │           │
│  │  ...         │              │  cours_id (FK)    │           │
│  └──────────────┘              └──────────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow - Course List Page

```
┌──────────┐
│  User    │
│  Opens   │
│  App     │
└────┬─────┘
     │
     ▼
┌────────────────────────────────────────┐
│  CourseList Component Loads            │
│  useEffect() runs                      │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  courseService.getAllCourses()         │
│  GET /api/cours/liste                  │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  Backend: CoursController.getAllCours()│
│  Returns: List<Course> (NO supports)   │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  Frontend Receives Data                │
│  [                                     │
│    { id: 1, titre: "Java", ... },     │
│    { id: 2, titre: "Python", ... }    │
│  ]                                     │
└────┬───────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│  Render Course Cards                   │
│  - Display title                       │
│  - Display description                 │
│  - Display creator name                │
│  - Display status badge                │
│  - Add click handler                   │
└────────────────────────────────────────┘
```

---

## Data Flow - Course Details Page

```
┌──────────┐
│  User    │
│  Clicks  │
│  Course  │
└────┬─────┘
     │
     ▼
┌────────────────────────────────────────┐
│  Navigate to /course/5                 │
│  CourseDetails Component Loads         │
└────┬───────────────────────────────────┘
     │
     ├────────────────┬──────────────────┐
     │                │                  │
     ▼                ▼                  │
┌─────────────┐  ┌─────────────────┐   │
│ GET Course  │  │ GET Supports    │   │
│ Info        │  │                 │   │
│             │  │ (loads          │   │
│ GET /api/   │  │  separately)    │   │
│ cours/5     │  │                 │   │
│             │  │ GET /api/cours/ │   │
│             │  │ 5/supports      │   │
└─────┬───────┘  └────────┬────────┘   │
      │                   │             │
      │  Parallel Calls   │             │
      └─────────┬─────────┘             │
                │                       │
                ▼                       │
┌────────────────────────────────────┐ │
│  Backend Processes Both Requests   │ │
│                                    │ │
│  1. CoursController.getCoursById() │ │
│     Returns: Course object         │ │
│                                    │ │
│  2. CoursController.getSupports()  │ │
│     Returns: List<Support>         │ │
└────────────┬───────────────────────┘ │
             │                         │
             ▼                         │
┌─────────────────────────────────────┤
│  Frontend Receives Both Responses   │
│                                     │
│  Course: {                          │
│    id: 5,                           │
│    titre: "Java Basics",            │
│    description: "...",              │
│    createur: {...}                  │
│  }                                  │
│                                     │
│  Supports: [                        │
│    { id: 1, typeSupport: "PDF"...},│
│    { id: 2, typeSupport: "VIDEO"...}│
│  ]                                  │
└─────────┬───────────────────────────┘
          │
          ▼
┌─────────────────────────────────────┐
│  Render Course Details Page         │
│  ┌───────────────────────────────┐  │
│  │ Course Title                  │  │
│  │ Status Badge                  │  │
│  ├───────────────────────────────┤  │
│  │ Creator Info                  │  │
│  │ Creation Date                 │  │
│  ├───────────────────────────────┤  │
│  │ Description                   │  │
│  ├───────────────────────────────┤  │
│  │ Supports Section:             │  │
│  │ ┌──────────────────────────┐  │  │
│  │ │ 📄 Document.pdf  [Download]│  │
│  │ └──────────────────────────┘  │  │
│  │ ┌──────────────────────────┐  │  │
│  │ │ 🎥 Video.mp4     [Watch]  │  │
│  │ └──────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Component Hierarchy

```
App.js
│
├── Navbar
│   └── Logo: "🎓 Course Platform"
│
├── Routes
│   │
│   ├── Route: "/" 
│   │   └── CourseList Component
│   │       │
│   │       ├── Header
│   │       │   ├── Title: "📚 Available Courses"
│   │       │   └── Create Button
│   │       │
│   │       └── Courses Grid
│   │           ├── CourseCard 1
│   │           │   ├── Title
│   │           │   ├── Status Badge
│   │           │   ├── Description
│   │           │   └── Metadata (creator, date)
│   │           │
│   │           ├── CourseCard 2
│   │           └── CourseCard N...
│   │
│   └── Route: "/course/:id"
│       └── CourseDetails Component
│           │
│           ├── Back Button
│           │
│           ├── Course Header Section
│           │   ├── Title
│           │   ├── Status Badge
│           │   └── Metadata Grid
│           │
│           ├── Description Section
│           │   └── Full Description
│           │
│           ├── Supports Section
│           │   ├── Section Title
│           │   └── Supports Grid
│           │       ├── SupportCard 1
│           │       │   ├── Icon
│           │       │   ├── File Name
│           │       │   ├── Type Badge
│           │       │   └── Download Button
│           │       │
│           │       ├── SupportCard 2
│           │       └── SupportCard N...
│           │
│           └── Action Buttons
│               ├── Edit Course
│               └── Add Material
│
└── Footer
    └── Copyright Info
```

---

## State Management Flow

```
┌─────────────────────────────────────────────────┐
│           CourseList Component State            │
│                                                 │
│  ┌────────────────────────────────────────┐   │
│  │  courses: []          ← API Response    │   │
│  │  loading: true/false  ← Loading State   │   │
│  │  error: null/string   ← Error Message   │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  State Changes:                                 │
│  1. Initial: loading=true, courses=[]          │
│  2. Success: loading=false, courses=[...]      │
│  3. Error:   loading=false, error="..."        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│         CourseDetails Component State           │
│                                                 │
│  ┌────────────────────────────────────────┐   │
│  │  course: null         ← API Response    │   │
│  │  supports: []         ← API Response    │   │
│  │  loadingCourse: bool  ← Loading State   │   │
│  │  loadingSupports: bool← Loading State   │   │
│  │  error: null/string   ← Error Message   │   │
│  └────────────────────────────────────────┘   │
│                                                 │
│  State Changes:                                 │
│  1. Initial: both loading=true                 │
│  2. Course loads: loadingCourse=false          │
│  3. Supports load: loadingSupports=false       │
│  4. Both complete: show full page              │
└─────────────────────────────────────────────────┘
```

---

## API Response Structure

### GET /api/cours/liste

```json
[
  {
    "id": 1,
    "titre": "Introduction à Java",
    "description": "Cours complet Java",
    "createur": {
      "id": 3,
      "nom": "John Doe",
      "email": "john@example.com"
    },
    "valideParAdmin": true,
    "dateCreation": "2025-12-11T10:00:00",
    "dateModification": null
  }
]
```
**Note:** No `supports` field! ✅

---

### GET /api/cours/1

```json
{
  "id": 1,
  "titre": "Introduction à Java",
  "description": "Cours complet Java",
  "createur": {
    "id": 3,
    "nom": "John Doe",
    "email": "john@example.com"
  },
  "valideParAdmin": true,
  "dateCreation": "2025-12-11T10:00:00",
  "dateModification": "2025-12-11T15:30:00"
}
```
**Note:** No `supports` field! ✅

---

### GET /api/cours/1/supports

```json
[
  {
    "id": 1,
    "typeSupport": "PDF",
    "url": "https://res.cloudinary.com/.../doc.pdf",
    "fileName": "Introduction.pdf"
  },
  {
    "id": 2,
    "typeSupport": "VIDEO",
    "url": "https://res.cloudinary.com/.../video.mp4",
    "fileName": "Tutorial.mp4"
  }
]
```
**Note:** No `cours` field! ✅

---

## File Structure Reference

```
course-platform/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── services/
│   │   └── courseService.js       ← API calls
│   │
│   ├── components/
│   │   ├── CourseList.js          ← List view
│   │   ├── CourseList.css         ← List styles
│   │   ├── CourseDetails.js       ← Details view
│   │   └── CourseDetails.css      ← Details styles
│   │
│   ├── App.js                     ← Router setup
│   ├── App.css                    ← Global styles
│   └── index.js                   ← Entry point
│
├── package.json
└── README.md
```

---

## Workflow Summary

1. **User opens app** → See course list (fast, no supports loaded)
2. **User clicks course** → Navigate to details page
3. **Details page loads** → Fetch course info + supports in parallel
4. **User sees course** → Full details + downloadable materials
5. **User clicks back** → Return to course list (cached/refetched)

---

## Performance Benefits

| Old Approach (with supports) | New Approach (separated) |
|------------------------------|--------------------------|
| ❌ Heavy API response         | ✅ Lightweight response   |
| ❌ Circular reference issues  | ✅ Clean JSON structure   |
| ❌ Slow page load            | ✅ Fast page load        |
| ❌ Unnecessary data loading  | ✅ Load only when needed |
| ❌ Large bundle transfer     | ✅ Optimized transfer    |

---

## Key Advantages

1. **Separation of Concerns** ✅
   - Courses and supports are independent
   - Easier to maintain and extend

2. **Better Performance** ✅
   - Course list loads instantly
   - Supports load only when needed

3. **No Circular References** ✅
   - Course doesn't include supports
   - Support doesn't include course

4. **Scalability** ✅
   - Can add pagination easily
   - Can cache courses separately
   - Can lazy-load supports

5. **Better UX** ✅
   - Fast initial load
   - Progressive data loading
   - Clear loading states

---

**This architecture provides a solid foundation for building a modern, performant course platform! 🚀**

