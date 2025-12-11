# Repository Guidelines – CodeLearn Platform

## 🧭 Project Overview
This repository hosts the **CodeLearn Platform**, a Spring Boot web application designed for online course management.  
It supports three main roles:
- **Administrateur** – supervises users and validates content.
- **Apprenant** – searches, views, and consumes learning materials.
- **Créateur de Cours** – creates and manages courses and supports.

The current development focus is **Service 2 – Apprenant**, which implements:n
- Search and list of validated courses.
- View course details and associated supports.
- Secure access to supports (PDF/video) via temporary URLs.
- Mark module completion and track learner progression.

---

## 🏗️ Project Structure & Naming Conventions
```
src/
 ├── main/java/ma/fsa/codelearn/
 │    ├── api/                   → REST controllers and DTOs
 │    │    ├── apprenant/        → Apprenant-specific endpoints
 │    │    └── dto/              → Data Transfer Objects (CourseDto, SupportAccessDto, etc.)
 │    ├── domain/
 │    │    ├── service/          → Business interfaces
 │    │    └── service/impl/     → Service implementations
 │    │    └── entity classes    → Course, Utilisateur, SupportPedagogique, LangageDeProgrammation, etc.
 │    ├── repo/                  → Spring Data JPA repositories
 │    └── security/              → Security utilities (e.g., SecurityUtils)
 │
 ├── main/resources/
 │    ├── application.properties
 │    ├── static/                → frontend assets
 │    └── templates/             → Thymeleaf templates (if any)
 └── test/java/ma/fsa/codelearn/ → JUnit tests
```

### Naming Rules
- Classes: `UpperCamelCase`
- DTOs: end with `Dto`
- Services: `SomethingService` + `SomethingServiceImpl`
- Repositories: `SomethingRepo`
- Controllers: plural REST resources (e.g., `ApprenantController`)

---

## 🧩 Database Mapping
The application is built on a PostgreSQL schema:

| Table | Entity | Notes |
|-------|---------|-------|
| **Utilisateur** | `User` | Fields: `id`, `nom`, `email`, `motDePasse`, `role` (`Administrateur`, `Apprenant`, `CreateurDeCours`) |
| **Cours** | `Course` | Fields: `id`, `titre`, `description`, `createur` (FK → `User`) |
| **LangageDeProgrammation** | `Language` | Fields: `id`, `nom` |
| **SupportPedagogique** | `SupportPedagogique` | Fields: `id`, `typeSupport` (`PDF`, `Video`), `url`, `cours` (FK → `Course`) |

> `Role` is an **enum**, not a table.  
> Entity and field names are in English but mapped with `@Table` / `@Column` to the French DB schema.

---

## ⚙️ Build & Run
- **Run app:** `./mvnw spring-boot:run`
- **Build jar:** `./mvnw clean package`
- **Run tests:** `./mvnw test`
- Default port: `8080`

---

## 🧪 Testing Guidelines
- Framework: JUnit + Spring Boot Test.
- Place tests under `src/test/java/ma/fsa/codelearn/`.
- Required coverage:
    - `ApprenantServiceImpl` (search, detail, access, complete)
    - `ApprenantController` endpoints.
- Name test files `*Test.java`.

---

## 🧱 Git & Branch Workflow
- **Branch naming:** `feature/<short-name>` → e.g., `feature/apprenant-service`
- **Commit messages:** follow Conventional Commits:
    - `feat:` new feature
    - `fix:` bug fix
    - `refactor:` internal refactor
    - `docs:` documentation changes
- **Pull requests:** include description, screenshots (Postman/cURL), and referenced issues.

---

## 🧰 Guardrails for Codex
- ✅ Can **create/modify** files only in:
    - `api/`, `api/apprenant/`, `api/dto/`
    - `domain/service/`, `domain/service/impl/`
    - `repo/`, `security/`
- ⚠️ Must **ask before** editing:
    - JPA entities, `application.properties`, or existing DB schema.
- ✅ Must respect:
    - existing annotations (`@Entity`, `@Table`, `@Column`).
    - existing class names and packages.
- 🚫 Do not introduce frameworks beyond Spring Boot + Lombok + JPA.
- ✅ Should run `/review` before large edits to verify consistency.
- ✅ Should follow the database mapping rules above.
- ✅ Should document new endpoints with example requests/responses.

---

## 💡 Example Dev Commands
```bash
# Start development server
./mvnw spring-boot:run

# Test Apprenant search endpoint
curl "http://localhost:8080/api/apprenant/courses"

# Access a support
curl -X POST "http://localhost:8080/api/apprenant/supports/1/access"
```

---

## 🧭 Current Objective for Codex
Implement **Service 2 – Apprenant**, consisting of:
1. `ApprenantService` and `ApprenantServiceImpl`
2. `ApprenantController`
3. DTOs for course summaries, course details, modules, and supports
4. Repositories for `Course` and `SupportPedagogique`
5. Mock `SecurityUtils.currentUserId()` to return `1L`
6. Temporary URL generation for support access (`expiresAt = now + 30m`)
7. Keep entities untouched and mapped to the provided SQL schema.

### ✅ Service 2 – Backend Status (2025‑11‑18)

- **Security & Identity**
  - `SecurityUtils.currentUserId()` returns `1L` to represent the connected Apprenant everywhere (controllers + services).
  - Hibernate naming strategy locked to `PhysicalNamingStrategyStandardImpl` so table names stay `cours`, `supportpedagogique`, etc. (no snake_case drift).

- **DTOs**
  - `CourseSummaryDto`, `CourseDetailDto`, `SupportDto`, `ModuleDto`, `SupportAccessDto`, `ModuleProgressDto`.
  - Course detail payloads now carry `modules` (mirrors supports, includes completion status/timestamp) plus `supports` with `accessEndpoint` fields for front-end routing.

- **ApprenantServiceImpl**
  - Search trims queries and pages via `CourseRepo.search`.
  - Detail flow resolves modules/supports and annotates completion status using an in-memory `completionStore`.
  - `requestSupportAccess` builds Base64 token URLs valid for 30 minutes; response returns type + expiry.
  - `completeModule(courseId, moduleId, apprenantId)` validates module-to-course relationship, records completion timestamp, and surfaces it via `ModuleProgressDto`.

- **Controller (`/api/apprenant` endpoints)**
  - `GET /courses?query=&page=&size=` → `Page<CourseSummaryDto>`
  - `GET /courses/{courseId}` → `CourseDetailDto` (modules + supports)
  - `POST /supports/{supportId}/access` → `SupportAccessDto` (temporary URL)
  - `POST /courses/{courseId}/modules/{moduleId}/complete` → `ModuleProgressDto`
  - Each endpoint documented inline with curl samples + JSON snippets for quick reference when building the front end or Postman scripts.

- **Repositories**
  - `CourseRepo.search` native query supports nullable `query`.
  - `SupportPedagogiqueRepo` exposes `findByCoursIdOrderByIdAsc`, `countByCoursId`, and `findById`.

- **Testing**
  - `ApprenantServiceImplTest` (Mockito) covers search, secure support access, completion recording, and validation errors.
  - `ApprenantControllerTest` (`@WebMvcTest`) verifies every endpoint, including completion and support access, via MockMvc JSON assertions.
  - `./mvnw test` succeeds (requires `JAVA_HOME` set locally).

### 🚀 Front-End Handoff Notes

Use the following flow when wiring the UI:
1. **Catalog/Search page** → call `GET /api/apprenant/courses` with optional `query`, show `supportsCount` to indicate module volume.
2. **Course detail view** → call `GET /api/apprenant/courses/{courseId}`; render `modules` list (shows `completed` flag and `completedAt`). Use each support’s `accessEndpoint` to know which button triggers secure download.
3. **Support download** → when learner clicks “Access,” issue `POST` to the given endpoint; response contains `temporaryUrl` for immediate download/iframe.
4. **Module completion** → after the learner finishes a module, call `POST /api/apprenant/courses/{courseId}/modules/{moduleId}/complete`; update UI using the returned timestamp.

Remember: every `{moduleId}` equals the corresponding `supportpedagogique.id`, so module/support IDs are interchangeable.

---

*(End of AGENTS.md)*
