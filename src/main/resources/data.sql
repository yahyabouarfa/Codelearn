-- Seed data for local development (idempotent)
-- Creates a course creator user, two validated courses, and supports for each.
-- Safe to commit; uses WHERE NOT EXISTS checks so repeated startups won't duplicate data.

-- 1) Creator user (create if missing)
INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role)
SELECT 'Createur', '', 'creator@example.com', 'secret', 'CreateurDeCours'
WHERE NOT EXISTS (SELECT 1 FROM utilisateur u WHERE u.email = 'creator@example.com');

-- 2) Validated courses (link to the creator by email)
INSERT INTO cours (titre, description, createur_id, valide_par_admin)
SELECT 'Java Basics', 'Intro Java course', u.id, true
FROM utilisateur u
WHERE u.email = 'creator@example.com'
  AND NOT EXISTS (SELECT 1 FROM cours c WHERE c.titre = 'Java Basics');

INSERT INTO cours (titre, description, createur_id, valide_par_admin)
SELECT 'HTML & CSS', 'Build static pages', u.id, true
FROM utilisateur u
WHERE u.email = 'creator@example.com'
  AND NOT EXISTS (SELECT 1 FROM cours c WHERE c.titre = 'HTML & CSS');

-- 3) Supports for each course (reference courses by title)
INSERT INTO supportpedagogique (type_support, url, cours_id)
SELECT 'PDF', 'https://cdn.example.com/java/basics.pdf', c.id
FROM cours c
WHERE c.titre = 'Java Basics'
  AND NOT EXISTS (SELECT 1 FROM supportpedagogique s WHERE s.url = 'https://cdn.example.com/java/basics.pdf');

INSERT INTO supportpedagogique (type_support, url, cours_id)
SELECT 'Video', 'https://cdn.example.com/java/basics.mp4', c.id
FROM cours c
WHERE c.titre = 'Java Basics'
  AND NOT EXISTS (SELECT 1 FROM supportpedagogique s WHERE s.url = 'https://cdn.example.com/java/basics.mp4');

INSERT INTO supportpedagogique (type_support, url, cours_id)
SELECT 'PDF', 'https://cdn.example.com/html/css-guide.pdf', c.id
FROM cours c
WHERE c.titre = 'HTML & CSS'
  AND NOT EXISTS (SELECT 1 FROM supportpedagogique s WHERE s.url = 'https://cdn.example.com/html/css-guide.pdf');

INSERT INTO supportpedagogique (type_support, url, cours_id)
SELECT 'Video', 'https://cdn.example.com/html/intro.mp4', c.id
FROM cours c
WHERE c.titre = 'HTML & CSS'
  AND NOT EXISTS (SELECT 1 FROM supportpedagogique s WHERE s.url = 'https://cdn.example.com/html/intro.mp4');

-- Helpful notes:
-- - To connect to the production Neon DB (one-off), use the psql URL you provided.
-- - To test locally after starting the app, call:
--   GET http://localhost:8080/api/apprenant/courses
--   GET http://localhost:8080/api/apprenant/courses/<courseId>
-- The application will only show validated courses (valide_par_admin = true).

