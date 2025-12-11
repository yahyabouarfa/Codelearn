# CodeLearn Platform – Apprenant Service

Spring Boot backend for course discovery and learning on the CodeLearn platform. The current focus is **Service 2 – Apprenant**, covering course search, course details, secure support access, and module completion tracking.

## What’s Implemented
- REST layer under `/api/apprenant` with search, detail, support access, and completion endpoints.
- DTOs for course summaries/details, supports, modules, access tokens, and progress payloads.
- Service layer (`ApprenantServiceImpl`) that:
  - Normalizes search queries and pages results via `CourseRepo.search`.
  - Only returns courses validated by administrators (`valide_par_admin = true`).
  - Assembles course detail payloads with modules (completion state) and supports (access endpoints) fetched via `SupportPedagogiqueRepo` (JPQL with fetch join).
  - Generates temporary support URLs valid for 30 minutes using a Base64 token appended to the original support URL.
  - Records module completion timestamps in-memory per apprenant.
- Repositories for courses and supports, including eager loading of supports per course and counting supports for catalog displays.
- `SecurityUtils.currentUserId()` stubbed to `1L` to represent the logged-in apprenant across controllers/services.

## API Quickstart
- `GET /api/apprenant/courses?query=&page=&size=` → `Page<CourseSummaryDto>` with `id`, `title`, `description`, `authorName`, `supportsCount`.
- `GET /api/apprenant/courses/{courseId}` → `CourseDetailDto` containing `modules` (one per support with completion flags) and `supports` (includes `accessEndpoint` for downloads/streams).
- `POST /api/apprenant/supports/{supportId}/access` → `SupportAccessDto` with `temporaryUrl` and `expiresAt` (`now + 30m`). Token encodes the target URL, user id, and expiry.
- `POST /api/apprenant/courses/{courseId}/modules/{moduleId}/complete` → `ModuleProgressDto` confirming completion timestamp for the current apprenant.

Notes:
- Every module maps to a `supportpedagogique` row; module ids equal support ids.
- Temporary URLs are generated per request and are not persisted.
- Completion tracking is in-memory; restarting the app clears completion history.
- Only courses where `cours.valide_par_admin = true` are exposed to learners; unvalidated courses are hidden and course detail lookups will 404.
- The course detail payload intentionally omits raw support URLs; use `accessEndpoint` to fetch a per-request `temporaryUrl`.

## Data Model (PostgreSQL)
- `cours` ↔ `Course` (`id`, `titre`, `description`, `createur` FK → `User`).
- `supportpedagogique` ↔ `SupportPedagogique` (`id`, `type_support` enum `ResourceType`, `url`, `cours_id` FK).
- `utilisateur` ↔ `User`; `langagedeprogrammation` ↔ `Language`.
Entity classes keep French table/column mappings via JPA annotations; naming strategy is `PhysicalNamingStrategyStandardImpl`.

## Project Layout
- `src/main/java/ma/fsa/codelearn/api/apprenant/` – REST controller for apprenant endpoints.
- `src/main/java/ma/fsa/codelearn/api/dto/` – DTOs returned by the API.
- `src/main/java/ma/fsa/codelearn/domain/service/` – Apprenant service interface and implementation.
- `src/main/java/ma/fsa/codelearn/repo/` – Spring Data repositories for courses and supports.
- `src/main/java/ma/fsa/codelearn/security/` – Security helper stub.
- Tests live in `src/test/java/ma/fsa/codelearn/**`.

## Run & Test
- Run app: `./mvnw spring-boot:run` (default port `8080`).
- Run tests: `./mvnw test` (covers controller and service flows for Service 2).
- Database: Neon connection tracks the **production** branch (not `development`). Ensure your JDBC URL/credentials target the production branch when running locally or in CI.
- If Neon drops idle connections, consider tuning Hikari (example):
  - `spring.datasource.hikari.max-lifetime=150000`
  - `spring.datasource.hikari.idle-timeout=60000`
  - `spring.datasource.hikari.keepalive-time=45000`
  - `spring.datasource.hikari.connection-test-query=SELECT 1`
  Adjust further if pool warnings persist.

## Sample cURL Calls
```bash
# Search courses
curl "http://localhost:8080/api/apprenant/courses?query=java&page=0&size=5"

# Course details with modules/supports
curl "http://localhost:8080/api/apprenant/courses/1"

# Request secure access to a support (returns temporaryUrl)
curl -X POST "http://localhost:8080/api/apprenant/supports/1/access"

# Mark a module as completed
curl -X POST "http://localhost:8080/api/apprenant/courses/1/modules/10/complete"
```

## Front-End Handoff Tips
- Use the endpoints above; catalog/list view should call `/api/apprenant/courses`, detail view should call `/api/apprenant/courses/{id}`.
- Supports in course details include `accessEndpoint`; POST to it to obtain `temporaryUrl` for download/stream.
- Ensure courses are validated (`valide_par_admin = true`) in the DB; otherwise they won’t appear in listings or detail responses.
