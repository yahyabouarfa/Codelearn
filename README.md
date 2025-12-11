# Plateforme de Cours - Backend API

A Spring Boot REST API for managing online courses with file upload capabilities (Cloudinary integration).

## 📋 Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Setup & Configuration](#setup--configuration)
- [Frontend Integration Guide](#frontend-integration-guide)

---

## 🛠 Tech Stack

- **Java 17**
- **Spring Boot 3.3.4**
- **PostgreSQL** (Neon Database)
- **Cloudinary** (File Storage)
- **Spring Security** (CORS Configuration)
- **Hibernate/JPA**
- **Lombok**

---

## ✨ Features

✅ **Course Management**
- Create courses with title and description
- Upload multiple support materials (PDF, Video, Images, etc.)
- Update course information
- Add files to existing courses
- Auto-validation workflow (`valide_par_admin` field)

✅ **File Upload**
- Upload to Cloudinary
- Support for any file type (auto-detection)
- Secure URLs stored in database
- Multiple files per course

✅ **CORS Configuration**
- Frontend access from any origin
- Pre-configured for local development

✅ **Timestamp Tracking**
- `date_creation` - Auto-set on course creation
- `date_modification` - Auto-updated on modification

---

## 🗄 Database Schema

### **Course Table** (`cours`)
```sql
id                BIGINT PRIMARY KEY AUTO_INCREMENT
titre             VARCHAR(255) NOT NULL
description       TEXT
createur_id       BIGINT (FK → utilisateur.id)
valide_par_admin  BOOLEAN NULL (default: NULL)
date_creation     TIMESTAMP NOT NULL
date_modification TIMESTAMP NULL
```

**Business Logic:**
- `valide_par_admin = NULL` on creation
- `valide_par_admin = NULL` when course is modified (reset validation)

### **Support Pedagogique Table** (`supportpedagogique`)
```sql
id           BIGINT PRIMARY KEY AUTO_INCREMENT
cours_id     BIGINT (FK → cours.id)
type_support VARCHAR(50) (PDF, VIDEO, IMAGE, etc.)
url          VARCHAR(500) NOT NULL
file_name    VARCHAR(255)
```

### **Utilisateur Table** (`utilisateur`)
```sql
id    BIGINT PRIMARY KEY AUTO_INCREMENT
nom   VARCHAR(255)
email VARCHAR(255) UNIQUE
role  VARCHAR(50) (CREATOR, ADMIN, STUDENT)
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:8084/api/cours`

### **Course Management**

#### 1️⃣ Create Course (JSON Only)
```http
POST /api/cours/publier
Content-Type: application/json

{
  "titre": "Introduction to Spring Boot",
  "description": "Learn Spring Boot from scratch"
}
```

**Response:**
```json
{
  "id": 1,
  "titre": "Introduction to Spring Boot",
  "description": "Learn Spring Boot from scratch",
  "createur": { "id": 3, "nom": "John Doe", ... },
  "supports": [],
  "valideParAdmin": null,
  "dateCreation": "2025-12-10T10:30:00",
  "dateModification": null
}
```

---

#### 2️⃣ Create Course with Files
```http
POST /api/cours/publier/with-files
Content-Type: multipart/form-data

Form Data:
- titre: "Advanced Java"
- description: "Master Java concepts"
- files[]: file1.pdf
- files[]: video.mp4
- typesSupport[]: "PDF"
- typesSupport[]: "VIDEO"
```

**Response:** Course object with uploaded supports

---

#### 3️⃣ Update Course (JSON Only)
```http
PUT /api/cours/modifier/{id}
Content-Type: application/json

{
  "titre": "Updated Title",
  "description": "Updated description"
}
```

**Note:** `valide_par_admin` is reset to `NULL` on update

---

#### 4️⃣ Add Files to Existing Course
```http
PUT /api/cours/modifier/{id}/add-files
Content-Type: multipart/form-data

Form Data:
- files[]: newfile.pdf
- typesSupport[]: "PDF"
```

---

#### 5️⃣ Get All Courses
```http
GET /api/cours/liste
```

**Response:**
```json
[
  {
    "id": 1,
    "titre": "Spring Boot Course",
    "description": "Learn Spring Boot",
    "createur": { "id": 3, "nom": "John", "email": "john@example.com" },
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
]
```

---

#### 6️⃣ Get Course by ID
```http
GET /api/cours/{id}
```

**Response:** Single course object (no filters applied)

---

### **Support Material Management**

#### 7️⃣ Add Support Material (JSON)
```http
POST /api/cours/{coursId}/supports
Content-Type: application/json

{
  "typeSupport": "PDF",
  "lienRessource": "https://example.com/file.pdf"
}
```

---

#### 8️⃣ Upload Support Material
```http
POST /api/cours/{coursId}/supports/upload
Content-Type: multipart/form-data

Form Data:
- file: document.pdf
- typeSupport: "PDF"
```

**Response:**
```json
{
  "id": 5,
  "typeSupport": "PDF",
  "url": "https://res.cloudinary.com/dtjgiksss/raw/upload/v1234567890/document.pdf",
  "fileName": "document.pdf",
  "cours": { "id": 1, "titre": "..." }
}
```

---

#### 9️⃣ Test File Upload
```http
POST /api/cours/test-upload
Content-Type: multipart/form-data

Form Data:
- file: testfile.png
```

**Response:**
```json
{
  "uploadedUrl": "https://res.cloudinary.com/.../testfile.png",
  "fileName": "testfile.png",
  "fileSize": "524288",
  "contentType": "image/png",
  "message": "File uploaded successfully. Try accessing this URL in your browser."
}
```

---

## ⚙️ Setup & Configuration

### **1. Clone Repository**
```bash
git clone <repository-url>
cd CréateurDeCours
```

### **2. Configure Database**

Edit `src/main/resources/application.properties`:

```properties
# PostgreSQL Configuration (Neon DB)
spring.datasource.url=jdbc:postgresql://ep-spring-cell-ab4f8r2p-pooler.eu-west-2.aws.neon.tech/neondb?user=neondb_owner&password=npg_2qUsuybN9fJB&sslmode=require
spring.datasource.username=neondb_owner
spring.datasource.password=npg_2qUsuybN9fJB
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Port
server.port=8084
```

### **3. Configure Cloudinary**

Add to `application.properties`:

```properties
# Cloudinary Configuration
cloudinary.cloud_name=dtjgiksss
cloudinary.api_key=952467319343213
cloudinary.api_secret=tRSCwYzpPgadGWvmzr2EuRIgOMg
```

**OR** use environment variable:
```bash
export CLOUDINARY_URL=cloudinary://952467319343213:tRSCwYzpPgadGWvmzr2EuRIgOMg@dtjgiksss
```

### **4. Run Application**

**Option A - Maven:**
```bash
./mvnw spring-boot:run
```

**Option B - Windows Batch:**
```bash
start.bat
```

**Option C - IDE:**
Run `PlateformeCoursApplication.java`

### **5. Verify Server**
```
Server running at: http://localhost:8084
Test endpoint: http://localhost:8084/api/cours/liste
```

---

## 🎨 Frontend Integration Guide

### **Course List Page Design**

#### **UI Components to Display:**

```jsx
// Example Course Card
{
  id: 1,
  titre: "Spring Boot Mastery",
  description: "Complete guide to Spring Boot development...",
  createur: {
    nom: "John Doe",
    email: "john@example.com"
  },
  supports: [
    { typeSupport: "PDF", fileName: "lecture1.pdf", url: "..." },
    { typeSupport: "VIDEO", fileName: "intro.mp4", url: "..." }
  ],
  valideParAdmin: null,  // Show "Pending Validation" badge
  dateCreation: "2025-12-10T10:00:00"
}
```

#### **Recommended Display Layout:**

```
┌─────────────────────────────────────────────────┐
│  📘 Spring Boot Mastery          🟡 Pending     │
│  by John Doe                                    │
│  ───────────────────────────────────────────    │
│  Complete guide to Spring Boot development...   │
│                                                 │
│  📎 2 Supports: 📄 PDF | 🎥 VIDEO               │
│  📅 Created: Dec 10, 2025                       │
│                                                 │
│  [View Details]  [Edit]  [Add Files]           │
└─────────────────────────────────────────────────┘
```

#### **Status Badges:**
- `valideParAdmin === null` → 🟡 **Pending Validation**
- `valideParAdmin === true` → 🟢 **Approved**
- `valideParAdmin === false` → 🔴 **Rejected**

#### **Support Material Icons:**
- `PDF` → 📄
- `VIDEO` → 🎥
- `IMAGE` → 🖼️
- `DOCUMENT` → 📃

---

### **API Integration Examples**

#### **Fetch All Courses**
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8084/api/cours';

const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/liste`);
    return response.data; // Array of courses
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
};
```

#### **Create Course with Files**
```javascript
const createCourse = async (title, description, files) => {
  const formData = new FormData();
  formData.append('titre', title);
  formData.append('description', description);
  
  files.forEach(file => {
    formData.append('files', file);
    formData.append('typesSupport', 'PDF'); // or detect from file type
  });

  try {
    const response = await axios.post(
      `${API_URL}/publier/with-files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
  }
};
```

#### **Add Files to Existing Course**
```javascript
const addFilesToCourse = async (courseId, files) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('files', file);
    formData.append('typesSupport', 'VIDEO');
  });

  try {
    const response = await axios.put(
      `${API_URL}/modifier/${courseId}/add-files`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding files:', error);
  }
};
```

---

### **Frontend Page Structure**

#### **1. Course List Page (`/courses`)**
- Display all courses in grid/list view
- Show course title, description, creator, status badge
- Filter by validation status
- Search by title
- Sort by date created

#### **2. Course Details Page (`/courses/:id`)**
- Full course information
- List all support materials with download links
- Edit button (if creator)
- Validation status

#### **3. Create Course Page (`/courses/create`)**
- Form: Title, Description
- File upload (drag & drop)
- Multiple file support
- File type selection

#### **4. Edit Course Page (`/courses/edit/:id`)**
- Pre-filled form
- Add more files option
- Shows existing supports

---

## 🔐 CORS Configuration

The backend allows all origins for development:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("*")
                .allowedHeaders("*");
    }
}
```

**Frontend can access from:**
- `http://localhost:3000` (React)
- `http://localhost:4200` (Angular)
- `http://localhost:5173` (Vite)
- Any other origin

---

## 📝 Notes

### **Current Implementation:**
- `createur_id` is hardcoded to `3` for all operations
- JWT authentication service runs on port `8081` (not yet integrated)
- File upload supports: PDF, VIDEO, IMAGE, DOCUMENT

### **Future Enhancements:**
- Integrate JWT authentication to get `createur_id` from token
- Add admin endpoints for course validation
- Implement course deletion
- Add pagination for course list
- Add search and filter functionality

---

## 🐛 Common Issues

### **Issue 1: Database Connection Error**
```
Error: Driver org.postgresql.Driver claims to not accept jdbcUrl
```
**Solution:** Fix database URL format in `application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://host/db?user=xxx&password=xxx&sslmode=require
```

### **Issue 2: Cloudinary Upload Fails**
**Solution:** Verify Cloudinary credentials in `CloudinaryConfig.java`

### **Issue 3: CORS Errors**
**Solution:** Check `CorsConfig.java` is present and `@Configuration` is added

### **Issue 4: File URL Not Working**
**Solution:** Ensure using `secure_url` from Cloudinary response (already implemented)

---

## 📞 Support

For issues or questions, contact the development team.

---

**Last Updated:** December 10, 2025  
**Version:** 1.0.0

