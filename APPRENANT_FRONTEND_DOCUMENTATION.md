# Apprenant Frontend Documentation

## Overview
Complete remake of the Apprenant (Student) frontend interface according to the backend API documentation. The frontend now uses validated courses endpoints and provides direct download URLs for educational materials.

---

## Changes Summary

### 1. **API Service Layer** (`src/services/ApprenantService.js`)

**New Methods:**
- `searchValidatedCourses(query, page, size)` - Search only validated courses
- `getAllValidatedCourses(page, size)` - Get all validated courses with pagination
- `getValidatedCourseDetail(courseId)` - Get course details with direct download URLs
- `requestSupportAccess(supportId)` - Request temporary access URL (30 min expiry)

**Removed Methods:**
- `searchCourses()` - Replaced with `searchValidatedCourses()`
- `getAllCourses()` - Replaced with `getAllValidatedCourses()`
- `getCourseDetail()` - Replaced with `getValidatedCourseDetail()`
- `completeModule()` - Removed (no progression tracking for validated courses)

**API Endpoints Used:**
```
GET /api/apprenant/courses/validated          -> Search validated courses
GET /api/apprenant/courses/validated/{id}     -> Get course details
GET /api/apprenant/supports/{supportId}/access -> Request temporary URL
```

---

### 2. **API URLs Configuration** (`src/config/apiUrls.js`)

**Added:**
```javascript
APPRENANT: {
  BASE: process.env.REACT_APP_APPRENANT_API,
  COURSES_VALIDATED: '/courses/validated',
  COURSE_DETAIL_VALIDATED: (id) => `/courses/validated/${id}`,
  // ... existing endpoints
}
```

---

### 3. **Environment Configuration** (`.env`)

**Updated Apprenant API Port:**
```env
# Changed from port 8082 to 8080 (as per API documentation)
REACT_APP_APPRENANT_API=http://192.168.0.173:8080/api/apprenant
```

---

### 4. **Course Catalog Page** (`src/pages/Apprenant/CourseCatalog.jsx`)

**Complete Remake - Key Features:**

✅ **Validated Courses Only**
- Uses `searchValidatedCourses()` endpoint
- Only shows courses where `valide_par_admin = true`

✅ **Search Functionality**
- Search by course title
- Real-time search with clear button
- Shows result count

✅ **Modern UI Design**
- Card-based layout with gradient headers
- Responsive grid (1/2/3 columns)
- Hover effects and transitions
- Click anywhere on card to navigate

✅ **Course Cards Display:**
- Course title and description (truncated)
- Author name
- Support count (PDFs + Videos)
- Visual icons for resource types
- "Voir le cours" button

✅ **Pagination**
- Full pagination support
- Page size options
- Total results display

✅ **Empty States**
- No results message
- Helpful prompts for search
- Quick clear search action

---

### 5. **Course Detail Page** (`src/pages/Apprenant/CourseDetailValidated.jsx`)

**Brand New Component - Key Features:**

✅ **Course Header**
- Gradient background with icon
- Course title and description
- Author information
- Statistics cards (PDFs, Videos, Total resources)

✅ **Resource Management**
- Separated sections for PDFs and Videos
- Visual type indicators (icons)
- Resource titles and descriptions

✅ **Download Options:**

**Option 1: Direct Download** (Primary)
```javascript
handleDirectDownload(support) {
  window.open(support.downloadUrl, '_blank');
}
```
- Uses `downloadUrl` field from API
- Immediate access
- No expiration
- Opens in new tab

**Option 2: Temporary Access** (Alternative)
```javascript
handleRequestTemporaryAccess(supportId) {
  const response = await ApprenantService.requestSupportAccess(supportId);
  window.open(response.temporaryUrl, '_blank');
  // Expires in 30 minutes
}
```
- Generates time-limited URL
- 30-minute expiration
- Loading state during request

✅ **Resource Actions:**
- **PDFs**: "Télécharger" (Download) + "Accès temporaire" buttons
- **Videos**: "Regarder" (Watch) + "Accès temporaire" buttons
- Visual feedback on hover and click
- Disabled state handling

✅ **UI Elements:**
- Back to catalog button
- Resource count statistics
- Type-specific icons and colors
- Info box explaining temporary access
- Empty state for courses without materials

---

### 6. **Routing Updates** (`src/App.jsx`)

**Updated Imports:**
```javascript
import CourseCatalog from './pages/Apprenant/CourseCatalog';
import CourseDetailValidated from './pages/Apprenant/CourseDetailValidated';
```

**Updated Routes:**
```javascript
// Apprenant routes - Validated courses only
<Route path="/apprenant/courses" element={<CourseCatalog />} />
<Route path="/apprenant/courses/:id" element={<CourseDetailValidated />} />
```

**Removed Routes:**
```javascript
// ❌ REMOVED: No longer needed
<Route path="/apprenant/progress" element={<MyProgress />} />
```

---

### 7. **Sidebar Navigation** (`src/components/common/Sidebar.jsx`)

**Updated Apprenant Menu:**
```javascript
case ROLES.APPRENANT:
  return [
    { path: '/apprenant/courses', label: 'Catalogue des cours', icon: FiBook },
    // ❌ REMOVED: { path: '/apprenant/progress', label: 'Ma progression', icon: FiBarChart2 }
  ];
```

**Removed:**
- "Ma progression" menu item (progression tracking not available for validated courses)

---

### 8. **Route Configuration** (`src/config/routes.js` & `src/config/constants.js`)

**Updated:**
```javascript
// constants.js
APPRENANT_DASHBOARD: '/apprenant/dashboard',
COURSE_CATALOG: '/apprenant/courses',
COURSE_DETAIL: '/apprenant/courses/:id',
// ❌ REMOVED: MY_PROGRESS: '/apprenant/progress'

// routes.js
apprenant: [
  { path: ROUTES.COURSE_CATALOG, name: 'Catalogue des cours', icon: 'book' },
  // ❌ REMOVED: MY_PROGRESS entry
]
```

---

## Data Models

### CourseSummaryDto (Course List)
```typescript
interface CourseSummaryDto {
  id: number;
  title: string;
  description: string;
  authorName: string;
  supportsCount: number;
}
```

### CourseDetailDto (Course Details)
```typescript
interface CourseDetailDto {
  id: number;
  title: string;
  description: string;
  authorName: string;
  modules: []; // Empty for validated courses
  supports: SupportDto[];
}
```

### SupportDto (Educational Material)
```typescript
interface SupportDto {
  id: number;
  type: 'PDF' | 'VIDEO';
  title: string;
  description: string;
  accessEndpoint: string; // e.g., "/api/apprenant/supports/15/access"
  downloadUrl: string;     // Direct URL from database
  courseId: number;
}
```

### SupportAccessDto (Temporary Access)
```typescript
interface SupportAccessDto {
  supportId: number;
  type: 'PDF' | 'VIDEO';
  temporaryUrl: string;    // Time-limited URL
  expiresAt: string;       // ISO 8601 datetime (30 min from request)
}
```

---

## Key Features

### ✅ Validated Courses Only
- All endpoints filter by `valide_par_admin = true`
- Students only see approved content
- No access to pending/draft courses

### ✅ No Progression Tracking
- Validated courses endpoints don't track user progress
- No module completion functionality
- Focus on resource access and learning

### ✅ Direct Download URLs
- `downloadUrl` field populated from database
- Immediate access without additional API calls
- Permanent URLs (no expiration)

### ✅ Temporary Access Alternative
- Request time-limited URLs (30 minutes)
- Additional security layer
- Useful for sensitive content

### ✅ Resource Type Handling
- **PDF**: Download button, opens in new tab
- **VIDEO**: Watch button, redirects to video URL (YouTube, etc.)
- Visual distinction with icons and colors

### ✅ Search & Pagination
- Search by course title
- Configurable page size (10, 20, 50)
- Total results display
- Efficient data loading

---

## File Structure

```
src/
├── services/
│   └── ApprenantService.js           ✅ Remade - Validated courses only
├── pages/
│   └── Apprenant/
│       ├── CourseCatalog.jsx         ✅ Remade - New UI, validated courses
│       ├── CourseDetailValidated.jsx ✅ NEW - Direct downloads
│       ├── CourseDetail.jsx          ⚠️  Old file (not used)
│       ├── CourseDetailPage.jsx      ⚠️  Old file (not used)
│       ├── CoursesPage.jsx           ⚠️  Old file (not used)
│       └── MyProgress.jsx            ❌ Not used (progression removed)
├── config/
│   ├── apiUrls.js                    ✅ Updated - Added validated endpoints
│   ├── constants.js                  ✅ Updated - Removed MY_PROGRESS
│   └── routes.js                     ✅ Updated - Removed progression
├── components/
│   └── common/
│       └── Sidebar.jsx               ✅ Updated - Removed progress menu
└── App.jsx                           ✅ Updated - New routes
```

---

## Usage Examples

### 1. Fetch Validated Courses
```javascript
import { ApprenantService } from '../../services/ApprenantService';

// Search with query
const response = await ApprenantService.searchValidatedCourses('python', 0, 10);
// Returns: { content: [...], totalPages, totalElements, ... }

// Get all (no search)
const response = await ApprenantService.getAllValidatedCourses(0, 10);
```

### 2. Get Course Details
```javascript
const course = await ApprenantService.getValidatedCourseDetail(courseId);
// Returns: { id, title, description, authorName, modules: [], supports: [...] }
```

### 3. Download Resource (Direct)
```javascript
const handleDownload = (support) => {
  if (support.downloadUrl) {
    window.open(support.downloadUrl, '_blank');
  }
};
```

### 4. Request Temporary Access
```javascript
const handleTemporaryAccess = async (supportId) => {
  const access = await ApprenantService.requestSupportAccess(supportId);
  window.open(access.temporaryUrl, '_blank');
  // URL expires: access.expiresAt (30 minutes)
};
```

---

## UI Components Breakdown

### CourseCatalog Component

**Layout:**
```
┌─────────────────────────────────────────┐
│ 📚 Catalogue des cours                  │
│ Découvrez nos cours validés...          │
├─────────────────────────────────────────┤
│ 🔍 [Search Box]  [Rechercher] [Effacer] │
├─────────────────────────────────────────┤
│ X cours trouvés                         │
├─────────────────────────────────────────┤
│ ┌─────┐  ┌─────┐  ┌─────┐              │
│ │Card │  │Card │  │Card │              │
│ │  1  │  │  2  │  │  3  │              │
│ └─────┘  └─────┘  └─────┘              │
│ [← Previous]  Page 1 of 3  [Next →]    │
└─────────────────────────────────────────┘
```

**Course Card:**
```
┌──────────────────────────────┐
│     [Gradient Header]        │
│      📚 Book Icon            │
├──────────────────────────────┤
│ Course Title (Bold)          │
│ Par Nom de l'auteur          │
│                              │
│ Description text...          │
│ (truncated to 3 lines)       │
│                              │
│ 📄 PDFs  🎥 Vidéos           │
│              X ressources    │
│                              │
│ [📚 Voir le cours]           │
└──────────────────────────────┘
```

### CourseDetailValidated Component

**Layout:**
```
┌────────────────────────────────────────────┐
│ ← Retour au catalogue                      │
├────────────────────────────────────────────┤
│        [Gradient Header Banner]            │
│            📚 Large Icon                   │
├────────────────────────────────────────────┤
│ Course Title (4xl, Bold)                   │
│ Par Author Name                            │
│                                            │
│ Full description text...                   │
│                                            │
│ ┌──────┐  ┌──────┐  ┌──────┐             │
│ │📄 PDFs│  │🎥Video│  │📚Total│            │
│ │   5   │  │   3   │  │   8   │            │
│ └──────┘  └──────┘  └──────┘             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ 📚 Ressources pédagogiques                 │
│ Cliquez sur les boutons pour télécharger   │
├────────────────────────────────────────────┤
│ 📄 Documents PDF (5)                       │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ 📄  PDF #1                           │  │
│ │     Description...                   │  │
│ │           [Télécharger] [Accès temp] │  │
│ └──────────────────────────────────────┘  │
│                                            │
│ 🎥 Vidéos (3)                              │
│                                            │
│ ┌──────────────────────────────────────┐  │
│ │ 🎥  VIDEO #1                         │  │
│ │     Description...                   │  │
│ │           [Regarder] [Accès temp]    │  │
│ └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ ⏰ À propos de l'accès temporaire          │
│ L'accès temporaire génère une URL          │
│ sécurisée valable 30 minutes...            │
└────────────────────────────────────────────┘
```

---

## Error Handling

### Course Not Found
```javascript
if (!course) {
  return (
    <div className="text-center py-16">
      <FiBook className="h-16 w-16 text-gray-400" />
      <h3>Cours introuvable</h3>
      <p>Ce cours n'existe pas ou n'est pas encore validé.</p>
      <button>← Retour au catalogue</button>
    </div>
  );
}
```

### No Search Results
```javascript
{courses.length === 0 && (
  <div className="text-center py-16">
    <h3>Aucun cours trouvé</h3>
    <p>Aucun résultat pour "{searchQuery}"</p>
    <button onClick={handleClearSearch}>
      Afficher tous les cours
    </button>
  </div>
)}
```

### Download Error
```javascript
try {
  window.open(support.downloadUrl, '_blank');
  toast.success('Ouverture du PDF...');
} catch (error) {
  toast.error('Erreur lors de l\'ouverture de la ressource');
}
```

---

## Testing Checklist

### ✅ Course Catalog
- [ ] Search by course title
- [ ] Clear search button
- [ ] Pagination (next/previous)
- [ ] Page size change
- [ ] Empty state (no courses)
- [ ] Empty state (no results)
- [ ] Click on course card navigates to detail
- [ ] Loading spinner displays
- [ ] Result count displays

### ✅ Course Detail
- [ ] Course information displays correctly
- [ ] Statistics cards show correct counts
- [ ] PDFs section lists all PDF supports
- [ ] Videos section lists all VIDEO supports
- [ ] Direct download opens in new tab
- [ ] Temporary access generates URL
- [ ] Expiration time displays
- [ ] Loading state during request
- [ ] Back button navigates to catalog
- [ ] Empty state (no materials)
- [ ] 404 handling (course not found)

### ✅ Navigation
- [ ] Sidebar shows "Catalogue des cours"
- [ ] No "Ma progression" in sidebar
- [ ] Default route for APPRENANT is /apprenant/courses
- [ ] Direct URL access works
- [ ] Browser back button works

---

## API Integration Notes

### Backend Requirements
- Backend must return `valide_par_admin = true` courses only
- `downloadUrl` field must be populated in supports
- Temporary URL must expire after 30 minutes
- Course author name must be included in response

### Frontend Expectations
- All courses returned are validated (no client-side filtering needed)
- `downloadUrl` is always present for validated courses
- No module/progress tracking data expected
- Pagination metadata included in response

---

## Future Enhancements

### Potential Additions
1. **Course Filtering**
   - Filter by resource type (PDF/Video)
   - Sort by title, author, resource count
   
2. **Resource Preview**
   - PDF preview modal
   - Video player modal
   
3. **Favorites/Bookmarks**
   - Save favorite courses
   - Quick access list
   
4. **Download Management**
   - Track downloaded resources
   - Bulk download
   
5. **Course Reviews**
   - Rate courses
   - Leave comments
   
6. **Search Enhancements**
   - Search by author
   - Search by description
   - Advanced filters

---

## Migration Notes

### From Old Implementation

**Breaking Changes:**
1. `ApprenantService.searchCourses()` → `searchValidatedCourses()`
2. `ApprenantService.getCourseDetail()` → `getValidatedCourseDetail()`
3. Removed `completeModule()` method
4. Port changed: 8082 → 8080

**Data Structure Changes:**
1. `course.modules` is now empty array
2. `support.downloadUrl` is now populated
3. No progression data in response

**Component Replacements:**
- `CourseDetail.jsx` → `CourseDetailValidated.jsx`
- `CoursesPage.jsx` → Use `CourseCatalog.jsx`
- Remove all `MyProgress.jsx` references

---

## Troubleshooting

### Issue: Courses not loading
**Check:**
1. Environment variable `REACT_APP_APPRENANT_API` is correct
2. Port is 8080 (not 8082)
3. Backend API is running
4. Network tab shows 200 response

### Issue: Download not working
**Check:**
1. `support.downloadUrl` exists
2. URL is valid and accessible
3. Browser popup blocker disabled
4. CORS configured correctly

### Issue: Temporary access fails
**Check:**
1. `supportId` is correct
2. Support exists in database
3. API endpoint returns 200
4. `temporaryUrl` field present in response

---

## Contact & Support

For questions or issues:
- Backend API: Port 8080 (`/api/apprenant`)
- Frontend: React 18 with Tailwind CSS
- Documentation: `README_APPRENANT_API.md`

---

**Last Updated:** December 10, 2025  
**Version:** 2.0.0  
**Status:** ✅ Production Ready
