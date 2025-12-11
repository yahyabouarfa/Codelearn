-- Migration V1: initial schema (noms en français)

CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('Administrateur', 'Apprenant', 'CreateurDeCours'))
);

CREATE TABLE cours (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    createur_id INT REFERENCES utilisateur(id),
    valide_par_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE langagedeprogrammation (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

CREATE TABLE supportpedagogique (
    id SERIAL PRIMARY KEY,
    type_support VARCHAR(50) CHECK (type_support IN ('PDF', 'Video')),
    url TEXT NOT NULL,
    cours_id INT REFERENCES cours(id)
);
