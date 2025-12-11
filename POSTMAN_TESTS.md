# Postman Tests for CoursController API

## Base URL
```
http://localhost:8080/api/cours
```

---

## 🔥 Important API Design Notes

### Separation of Concerns: Courses vs Supports

**Key Change:** The API now uses a clean separation between courses and their supporting materials:

1. **GET Courses** - Returns courses **WITHOUT** supports (no circular references, better performance)
   - `GET /api/cours/liste` - All courses (no supports included)
   - `GET /api/cours/{id}` - Single course (no supports included)

2. **GET Supports** - Fetch supports separately by course ID
   - `GET /api/cours/{coursId}/supports` - All supports for a specific course

**Benefits:**
- ✅ No circular reference issues
- ✅ Faster API responses (load only what you need)
- ✅ Clean JSON structure
- ✅ Better frontend data management (fetch course first, then fetch supports if needed)

**Typical Workflow:**
```
1. GET /api/cours/liste          → Get all courses
2. Select a course (e.g., id=5)
3. GET /api/cours/5/supports     → Get supports for that course
```

---

## 📋 Quick Reference: All Available Endpoints

| Method | Endpoint | Description | Includes Supports? |
|--------|----------|-------------|-------------------|
| POST | `/api/cours/publier` | Create course (JSON only) | No |
| POST | `/api/cours/publier/with-files` | Create course with files | No (use GET supports endpoint) |
| PUT | `/api/cours/modifier/{id}` | Update course (JSON only) | No |
| PUT | `/api/cours/modifier/{id}/add-files` | Add files to existing course | No (use GET supports endpoint) |
| POST | `/api/cours/{coursId}/supports` | Add support with JSON (manual URL) | No |
| POST | `/api/cours/{coursId}/supports/upload` | Add support with file upload | No |
| GET | `/api/cours/liste` | Get all courses | ❌ No |
| GET | `/api/cours/{id}` | Get course by ID | ❌ No |
| **GET** | **`/api/cours/{coursId}/supports`** | **Get supports for a course** | ✅ Returns supports only |
| POST | `/api/cours/test-upload` | Test Cloudinary upload | N/A |

---

## 1. Test: Publier un Cours (JSON Only)

**Endpoint:** `POST /api/cours/publier`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "titre": "Introduction à Java",
  "description": "Cours complet pour apprendre les bases de Java"
}
```

**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "titre": "Introduction à Java",
  "description": "Cours complet pour apprendre les bases de Java",
  "createur": {
    "id": 3,
    "nom": "...",
    "email": "..."
  },
  "supports": [],
  "valideParAdmin": null,
  "dateCreation": "2025-12-10T...",
  "dateModification": null
}
```

**Test Script (Postman Tests tab):**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has course id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.exist;
    pm.environment.set("coursId", jsonData.id);
});

pm.test("Course has correct title", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.titre).to.eql("Introduction à Java");
});

pm.test("valideParAdmin is null", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.valideParAdmin).to.be.null;
});

pm.test("createur_id is 3", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.createur.id).to.eql(3);
});
```

---

## 2. Test: Publier un Cours avec Fichiers

**Endpoint:** `POST /api/cours/publier/with-files`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| titre | text | "Spring Boot Avancé" |
| description | text | "Cours avancé sur Spring Boot avec exemples pratiques" |
| files | file | [Select a PDF file] |
| files | file | [Select a video file] |
| typesSupport | text | PDF |
| typesSupport | text | VIDEO |

**Note:** Add multiple `files` and `typesSupport` entries - they should match in order.

**Expected Response:** `200 OK`
```json
{
  "id": 2,
  "titre": "Spring Boot Avancé",
  "description": "Cours avancé sur Spring Boot avec exemples pratiques",
  "createur": {
    "id": 3
  },
  "supports": [
    {
      "id": 1,
      "lien": "https://res.cloudinary.com/...",
      "typeSupport": "PDF"
    },
    {
      "id": 2,
      "lien": "https://res.cloudinary.com/...",
      "typeSupport": "VIDEO"
    }
  ],
  "valideParAdmin": null,
  "dateCreation": "2025-12-10T..."
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Course created with files", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.exist;
    pm.expect(jsonData.supports.length).to.be.above(0);
    pm.environment.set("coursIdWithFiles", jsonData.id);
});

pm.test("Supports have Cloudinary URLs", function () {
    var jsonData = pm.response.json();
    jsonData.supports.forEach(function(support) {
        pm.expect(support.lien).to.include("cloudinary");
    });
});

pm.test("All supports have correct types", function () {
    var jsonData = pm.response.json();
    var types = jsonData.supports.map(s => s.typeSupport);
    pm.expect(types).to.include("PDF");
});
```

---

## 3. Test: Mettre à Jour un Cours (JSON Only)

**Endpoint:** `PUT /api/cours/modifier/{{coursId}}`

**Pre-requisite:** Run test #1 first to set `coursId` in environment.

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "titre": "Introduction à Java - Édition 2025",
  "description": "Cours mis à jour avec les dernières pratiques Java 21"
}
```

**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "titre": "Introduction à Java - Édition 2025",
  "description": "Cours mis à jour avec les dernières pratiques Java 21",
  "valideParAdmin": null,
  "dateModification": "2025-12-10T..."
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Course updated successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.titre).to.include("Édition 2025");
});

pm.test("valideParAdmin reset to null", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.valideParAdmin).to.be.null;
});

pm.test("dateModification is set", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.dateModification).to.exist;
});
```

---

## 4. Test: Ajouter des Fichiers à un Cours Existant

**Endpoint:** `PUT /api/cours/modifier/{{coursId}}/add-files`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| files | file | [Select a document file] |
| typesSupport | text | DOCUMENT |

**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "titre": "Introduction à Java - Édition 2025",
  "supports": [
    {
      "id": 3,
      "lien": "https://res.cloudinary.com/...",
      "typeSupport": "DOCUMENT"
    }
  ]
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("New support added", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.supports.length).to.be.above(0);
});

pm.test("Support has valid Cloudinary URL", function () {
    var jsonData = pm.response.json();
    var lastSupport = jsonData.supports[jsonData.supports.length - 1];
    pm.expect(lastSupport.lien).to.match(/^https:\/\//);
});
```

---

## 5. Test: Ajouter un Support avec JSON

**Endpoint:** `POST /api/cours/{{coursId}}/supports`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "lien": "https://example.com/resource.pdf",
  "typeSupport": "PDF"
}
```

**Expected Response:** `200 OK`
```json
{
  "id": 4,
  "lien": "https://example.com/resource.pdf",
  "typeSupport": "PDF",
  "cours": {
    "id": 1
  }
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Support created with correct link", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.lien).to.eql("https://example.com/resource.pdf");
});

pm.test("Support has correct type", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.typeSupport).to.eql("PDF");
});
```

---

## 6. Test: Ajouter un Support avec Upload de Fichier

**Endpoint:** `POST /api/cours/{{coursId}}/supports/upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| file | file | [Select a file] |
| typeSupport | text | VIDEO |

**Expected Response:** `200 OK`
```json
{
  "id": 5,
  "lien": "https://res.cloudinary.com/...",
  "typeSupport": "VIDEO",
  "cours": {
    "id": 1
  }
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Support uploaded to Cloudinary", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.lien).to.include("cloudinary");
});

pm.test("Support has correct type", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.typeSupport).to.eql("VIDEO");
});
```

---

## 7. Test: Lister Tous les Cours (Sans Supports)

**Endpoint:** `GET /api/cours/liste`

**Headers:** None required

**Expected Response:** `200 OK`
```json
[
  {
    "id": 1,
    "titre": "Introduction à Java - Édition 2025",
    "description": "...",
    "createur": {...},
    "valideParAdmin": null,
    "dateCreation": "2025-12-10T...",
    "dateModification": "2025-12-10T..."
  },
  {
    "id": 2,
    "titre": "Spring Boot Avancé",
    "description": "...",
    "createur": {...},
    "valideParAdmin": null,
    "dateCreation": "2025-12-10T..."
  }
]
```

**Note:** Supports are NOT included in this response to avoid circular references and improve performance.

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("All courses have required fields", function () {
    var jsonData = pm.response.json();
    jsonData.forEach(function(course) {
        pm.expect(course.id).to.exist;
        pm.expect(course.titre).to.exist;
        pm.expect(course.createur).to.exist;
    });
});

pm.test("Courses do NOT include supports", function () {
    var jsonData = pm.response.json();
    jsonData.forEach(function(course) {
        pm.expect(course.supports).to.not.exist;
    });
});

pm.test("Courses have createur_id 3", function () {
    var jsonData = pm.response.json();
    jsonData.forEach(function(course) {
        pm.expect(course.createur.id).to.eql(3);
    });
});
```

---

## 8. Test: Obtenir un Cours par ID (Sans Supports)

**Endpoint:** `GET /api/cours/{{coursId}}`

**Headers:** None required

**Expected Response:** `200 OK`
```json
{
  "id": 1,
  "titre": "Introduction à Java - Édition 2025",
  "description": "Cours mis à jour avec les dernières pratiques Java 21",
  "createur": {
    "id": 3,
    "nom": "...",
    "email": "..."
  },
  "valideParAdmin": null,
  "dateCreation": "2025-12-10T...",
  "dateModification": "2025-12-10T..."
}
```

**Note:** Supports are NOT included. Use the separate endpoint `/api/cours/{coursId}/supports` to fetch supports.

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Course has correct ID", function () {
    var jsonData = pm.response.json();
    var expectedId = parseInt(pm.environment.get("coursId"));
    pm.expect(jsonData.id).to.eql(expectedId);
});

pm.test("Course belongs to createur_id 3", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.createur.id).to.eql(3);
});

pm.test("Course has all required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.titre).to.exist;
    pm.expect(jsonData.dateCreation).to.exist;
});

pm.test("Course does NOT include supports", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.supports).to.not.exist;
});
```

---

## 9. Test: Obtenir les Supports d'un Cours par ID

**Endpoint:** `GET /api/cours/{{coursId}}/supports`

**Headers:** None required

**Pre-requisite:** Run tests that create courses with supports (test #2 or #6)

**Expected Response:** `200 OK`
```json
[
  {
    "id": 1,
    "typeSupport": "PDF",
    "url": "https://res.cloudinary.com/...",
    "fileName": "document.pdf"
  },
  {
    "id": 2,
    "typeSupport": "VIDEO",
    "url": "https://res.cloudinary.com/...",
    "fileName": "video.mp4"
  }
]
```

**Note:** This endpoint returns ONLY the supports for a specific course. The `cours` field is not included to avoid circular references.

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is an array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

pm.test("All supports have required fields", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        jsonData.forEach(function(support) {
            pm.expect(support.id).to.exist;
            pm.expect(support.typeSupport).to.exist;
            pm.expect(support.url).to.exist;
        });
    }
});

pm.test("Supports do NOT include cours object", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        jsonData.forEach(function(support) {
            pm.expect(support.cours).to.not.exist;
        });
    }
});

pm.test("All supports have Cloudinary URLs", function () {
    var jsonData = pm.response.json();
    if (jsonData.length > 0) {
        jsonData.forEach(function(support) {
            pm.expect(support.url).to.match(/^https:\/\//);
        });
    }
});

pm.test("Supports have valid types (PDF, VIDEO, DOCUMENT)", function () {
    var jsonData = pm.response.json();
    var validTypes = ["PDF", "VIDEO", "DOCUMENT"];
    if (jsonData.length > 0) {
        jsonData.forEach(function(support) {
            pm.expect(validTypes).to.include(support.typeSupport);
        });
    }
});
```

---

## 10. Test: Obtenir un Cours Inexistant (404)

**Endpoint:** `GET /api/cours/99999`

**Headers:** None required

**Expected Response:** `404 Not Found`

**Test Script:**
```javascript
pm.test("Status code is 404", function () {
    pm.response.to.have.status(404);
});

pm.test("Response body is empty or null", function () {
    var body = pm.response.text();
    pm.expect(body).to.be.empty;
});
```

---

## 11. Test: Test Upload Cloudinary

**Endpoint:** `POST /api/cours/test-upload`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (form-data):**
| Key | Type | Value |
|-----|------|-------|
| file | file | [Select any file to test] |

**Expected Response:** `200 OK`
```json
{
  "uploadedUrl": "https://res.cloudinary.com/...",
  "fileName": "example.pdf",
  "fileSize": "102400",
  "contentType": "application/pdf",
  "message": "File uploaded successfully. Try accessing this URL in your browser."
}
```

**Test Script:**
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("File uploaded successfully", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.uploadedUrl).to.exist;
    pm.expect(jsonData.uploadedUrl).to.include("cloudinary");
});

pm.test("Response contains file metadata", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.fileName).to.exist;
    pm.expect(jsonData.fileSize).to.exist;
    pm.expect(jsonData.contentType).to.exist;
});

pm.test("Success message is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.message).to.include("successfully");
});

// Optional: Save URL for manual testing
pm.environment.set("testUploadUrl", pm.response.json().uploadedUrl);
```

---

## Environment Variables Setup

Create a Postman environment with these variables:

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| baseUrl | http://localhost:8080 | API base URL |
| coursId | (empty) | Will be set by test #1 |
| coursIdWithFiles | (empty) | Will be set by test #2 |
| testUploadUrl | (empty) | Will be set by test #10 |

---

## Test Execution Order

Run tests in this order for best results:

1. **Test #1** - Create a basic course (sets `coursId`)
2. **Test #7** - List all courses (verify creation)
3. **Test #8** - Get course by ID (verify retrieval)
4. **Test #3** - Update the course (test modification)
5. **Test #4** - Add files to the course (test file upload)
6. **Test #5** - Add support with JSON (test manual link)
7. **Test #6** - Add support with file upload (test Cloudinary)
8. **Test #2** - Create course with files (complete flow)
9. **Test #10** - Test Cloudinary upload (diagnostic)
10. **Test #9** - Test 404 response (error handling)

---

## Common Issues & Troubleshooting

### Issue: 400 Bad Request on JSON endpoints
**Solution:** Verify `Content-Type: application/json` header is set

### Issue: Files not uploading
**Solution:** 
- Check Cloudinary credentials in `application.properties`
- Verify file size is within limits
- Use test endpoint (#10) to diagnose

### Issue: 404 on GET by ID
**Solution:** 
- Ensure course belongs to createur_id = 3
- Check if course ID exists in database

### Issue: 500 Internal Server Error
**Solution:** 
- Check application logs
- Verify database connection
- Ensure Cloudinary service is configured

---

## Valid Resource Types

Based on your `ResourceType` enum:
- `PDF`
- `VIDEO`
- `DOCUMENT`
- `IMAGE`
- `AUDIO`
- `LINK`

Make sure to use these exact values (case-sensitive) when setting `typeSupport`.

---

## Tips for Testing

1. **Use Collection Runner:** Import all tests into a Postman collection and run them in sequence
2. **Environment Variables:** Use variables to avoid hardcoding IDs
3. **Pre-request Scripts:** Add delays between tests if needed
4. **Test Files:** Prepare small test files (< 10MB) for upload tests
5. **Monitor Logs:** Keep an eye on Spring Boot console for detailed error messages

---

## Sample cURL Commands (Alternative to Postman)

### Create Course (JSON)
```bash
curl -X POST http://localhost:8080/api/cours/publier \
  -H "Content-Type: application/json" \
  -d "{\"titre\":\"Test Course\",\"description\":\"Test Description\"}"
```

### Create Course with Files
```bash
curl -X POST http://localhost:8080/api/cours/publier/with-files \
  -F "titre=Test Course" \
  -F "description=Test Description" \
  -F "files=@/path/to/file.pdf" \
  -F "typesSupport=PDF"
```

### Get All Courses
```bash
curl -X GET http://localhost:8080/api/cours/liste
```

### Get Course by ID
```bash
curl -X GET http://localhost:8080/api/cours/1
```

---

**End of Test Documentation**

