-- Migration V2: Allow null values for valide_par_admin to represent pending status
-- null = pending (awaiting validation)
-- false = rejected
-- true = approved/validated

ALTER TABLE cours ALTER COLUMN valide_par_admin DROP DEFAULT;
ALTER TABLE cours ALTER COLUMN valide_par_admin SET DEFAULT NULL;

-- Update existing records with false to null to represent pending status
UPDATE cours SET valide_par_admin = NULL WHERE valide_par_admin = FALSE;

-- Remove username column from utilisateur table as it's no longer used
ALTER TABLE utilisateur DROP COLUMN IF EXISTS username;

