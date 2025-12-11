# Creator Frontend - README API Integration Complete

## Updated: December 10, 2025

All Creator frontend components have been updated to match the exact API specification from the Backend README.md.

---

## API Changes Summary

### Field Name Updates

| Old Field Name | New Field Name | Location |
|----------------|----------------|----------|
| `valide` | `valideParAdmin` | Course object |
| `supportsPedagogiques` | `supports` | Course object |
| `type` | `typeSupport` | Support object |
| `titre` | `fileName` (for display) | Support object |

### Status Values (valideParAdmin)

- `null` → 🟡 **Pending Validation**
- `true` → 🟢 **Approved**
- `false` → 🔴 **Rejected**

---

## Updated Files

### 1. CreateurService.js (`src/services/CreateurService.js`)

**Complete rewrite** to match Backend README API specification:

✅ **Endpoints Implemented:**
- `GET /api/cours/liste` - Get all courses
- `GET /api/cours/{id}` - Get course by ID
- `POST /api/cours/publier` - Create course (JSON only)
- `POST /api/cours/publier/with-files` - Create course with files
- `PUT /api/cours/modifier/{id}` - Update course (resets validation)
- `PUT /api/cours/modifier/{id}/add-files` - Add files to course
- `POST /api/cours/{coursId}/supports` - Add support (JSON/external link)
- `POST /api/cours/{coursId}/supports/upload` - Upload single support
- `POST /api/cours/test-upload` - Test file upload

**Key Features:**
- Hardcoded `createur_id = 3` (backend constraint)
- Progress callback support for file uploads
- Circular reference cleanup in responses
- Proper error handling

---

### 2. MyCourses.jsx (`src/pages/Creator/MyCourses.jsx`)

**Updated to use README API response structure:**

✅ **Changes:**
- Uses `getMyCourses()` to fetch creator's courses
- Field mapping: `valideParAdmin` instead of `valide`
- Field mapping: `supports` instead of `supportsPedagogiques`
- Field mapping: `typeSupport` instead of `type`
- Field mapping: `fileName` for display instead of `titre`
- Status badges match README spec (🟡/🟢/🔴)
- Support icons: 📄 PDF | 🎥 VIDEO | 🖼️ IMAGE | 📃 DOCUMENT

**UI Components:**
- Stats cards: Total, Approved, Pending, Rejected
- Filter tabs by validation status
- Expandable course rows showing supports
- Direct Cloudinary URL links (secure_url)

---

### 3. CreateCourse.jsx (`src/pages/Creator/CreateCourse.jsx`)

**Already correctly implemented:**

✅ **Features:**
- Uses `createCourse()` for courses without files
- Uses `createCourseWithFiles()` for courses with files
- Multi-file upload with type selection (PDF/VIDEO/IMAGE/DOCUMENT)
- Progress bar during upload
- Form validation with Formik + Yup
- Auto-detection of file types

**Form Fields:**
- `titre` (required, 5-200 chars)
- `description` (required, 20-5000 chars)
- Optional file uploads with type selection

---

### 4. CoursesList.jsx (`src/pages/Admin/CoursesList.jsx`)

**Updated field names:**

✅ **Changes:**
- Field mapping: `supports` instead of `supportsPedagogiques`
- Field mapping: `typeSupport` instead of `type`
- Field mapping: `fileName` for display
- Added DOCUMENT support type with purple icon

**Features:**
- Shows all courses from all creators
- Expandable rows to view supports
- Validation status badges
- Direct links to Cloudinary files

---

## API Response Structure

### Course Object
```json
{
  "id": 1,
  "titre": "Spring Boot Course",
  "description": "Learn Spring Boot",
  "createur": {
    "id": 3,
    "nom": "John",
    "email": "john@example.com"
  },
  "supports": [
    {
      "id": 1,
      "typeSupport": "PDF",
      "url": "https://res.cloudinary.com/.../file.pdf",
      "fileName": "lecture1.pdf"
    }
  ],
  "valideParAdmin": null,
  "dateCreation": "2025-12-10T10:00:00",
  "dateModification": null
}
```

---

## Testing Checklist

### Creator Pages
- [ ] Navigate to `/creator/courses` - See list of creator's courses
- [ ] Click "Créer un cours" - Navigate to create page
- [ ] Create course without files - Should show "Pending Validation"
- [ ] Create course with files (PDF/Video) - Should upload to Cloudinary
- [ ] Expand course row - Should show all supports with working links
- [ ] Filter by status (All/Approved/Pending/Rejected) - Should filter correctly
- [ ] Click "Ouvrir" on support - Should open Cloudinary URL in new tab

### Admin Pages
- [ ] Navigate to `/admin/courses` - See all courses from all creators
- [ ] Expand course row - Should show all supports
- [ ] Verify stats cards show correct counts
- [ ] Verify support links work

---

## Backend Configuration

**Required in application.properties:**
```properties
# PostgreSQL Database
spring.datasource.url=jdbc:postgresql://ep-spring-cell-ab4f8r2p-pooler.eu-west-2.aws.neon.tech/neondb?user=neondb_owner&password=npg_2qUsuybN9fJB&sslmode=require

# Cloudinary
cloudinary.cloud_name=dtjgiksss
cloudinary.api_key=952467319343213
cloudinary.api_secret=tRSCwYzpPgadGWvmzr2EuRIgOMg

# Server
server.port=8084
```

**Frontend API Client (`apiClient.js`):**
```javascript
const createurApi = axios.create({
  baseURL: 'http://192.168.0.173:8084/api'
});
```

---

## Important Notes

### ⚠️ Backend Constraints
1. **Hardcoded Creator ID**: All operations use `createur_id = 3`
2. **Validation Reset**: Modifying a course resets `valideParAdmin` to `NULL`
3. **No Authentication**: JWT not yet integrated
4. **CORS Enabled**: Backend accepts requests from any origin

### 📁 File Upload
- **Max Size**: 50MB per file
- **Supported Types**: PDF, VIDEO, IMAGE, DOCUMENT
- **Storage**: Cloudinary (secure URLs)
- **Multiple Files**: Supported via `with-files` endpoint

### 🔄 Validation Workflow
1. Course created → `valideParAdmin = NULL` (Pending)
2. Admin validates → `valideParAdmin = true` (Approved)
3. Admin rejects → `valideParAdmin = false` (Rejected)
4. Creator modifies → `valideParAdmin = NULL` (Reset to Pending)

---

## Next Steps

### Recommended Enhancements
1. ✅ Integrate JWT authentication to get real `createur_id`
2. ✅ Add course editing functionality
3. ✅ Add support deletion
4. ✅ Add pagination for large course lists
5. ✅ Add search and filter by title/description
6. ✅ Add date formatting (dateCreation, dateModification)

---

## Support

For issues or questions about the Creator frontend:
- Check console logs for API call details
- Verify backend is running on port 8084
- Check Cloudinary configuration
- Ensure CORS is properly configured

**Last Updated:** December 10, 2025
**Version:** 2.0.0 (README API Compliant)
