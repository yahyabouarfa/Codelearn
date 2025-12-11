import * as Yup from 'yup';

/**
 * Common validation schemas and functions
 */

/**
 * Email validation
 */
export const emailValidation = Yup.string()
  .email('Adresse email invalide')
  .required('L\'email est requis');

/**
 * Password validation
 */
export const passwordValidation = Yup.string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
  )
  .required('Le mot de passe est requis');

/**
 * Login validation schema
 */
export const loginValidationSchema = Yup.object({
  email: emailValidation,
  password: Yup.string().required('Le mot de passe est requis'),
});

/**
 * Registration validation schema
 */
export const registerValidationSchema = Yup.object({
  nom: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  prenom: Yup.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .required('Le prénom est requis'),
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
  role: Yup.string()
    .oneOf(['Apprenant', 'CreateurDeCours'], 'Rôle invalide')
    .required('Le rôle est requis'),
});

/**
 * Course creation validation schema
 */
export const courseValidationSchema = Yup.object({
  titre: Yup.string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .required('Le titre est requis'),
  description: Yup.string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description ne peut pas dépasser 2000 caractères')
    .required('La description est requise'),
  language: Yup.string()
    .required('Le langage de programmation est requis'),
  modules: Yup.array()
    .of(
      Yup.object({
        titre: Yup.string().required('Le titre du module est requis'),
        description: Yup.string().required('La description du module est requise'),
        ordre: Yup.number().required('L\'ordre du module est requis'),
      })
    )
    .min(1, 'Au moins un module est requis'),
});

/**
 * Module validation schema
 */
export const moduleValidationSchema = Yup.object({
  titre: Yup.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .required('Le titre est requis'),
  description: Yup.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .required('La description est requise'),
  ordre: Yup.number()
    .min(0, 'L\'ordre doit être un nombre positif')
    .required('L\'ordre est requis'),
});

/**
 * Support upload validation schema
 */
export const supportValidationSchema = Yup.object({
  titre: Yup.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères')
    .required('Le titre est requis'),
  type: Yup.string()
    .oneOf(['PDF', 'VIDEO'], 'Type de support invalide')
    .required('Le type est requis'),
  file: Yup.mixed()
    .required('Le fichier est requis')
    .test('fileSize', 'Le fichier est trop volumineux (max 100 MB)', (value) => {
      if (!value) return true;
      return value.size <= 100 * 1024 * 1024; // 100 MB
    })
    .test('fileType', 'Type de fichier non supporté', function(value) {
      if (!value) return true;
      const { type } = this.parent;
      
      if (type === 'PDF') {
        return value.type === 'application/pdf';
      } else if (type === 'VIDEO') {
        return ['video/mp4', 'video/mpeg', 'video/quicktime'].includes(value.type);
      }
      
      return true;
    }),
});

/**
 * Profile update validation schema
 */
export const profileValidationSchema = Yup.object({
  nom: Yup.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .required('Le nom est requis'),
  prenom: Yup.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .required('Le prénom est requis'),
  email: emailValidation,
});

/**
 * Password change validation schema
 */
export const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Le mot de passe actuel est requis'),
  newPassword: passwordValidation,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise'),
});

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate file type
 * @param {File} file
 * @param {Array} allowedTypes
 * @returns {boolean}
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file
 * @param {number} maxSizeMB
 * @returns {boolean}
 */
export const isValidFileSize = (file, maxSizeMB) => {
  if (!file) return false;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validators = {
  emailValidation,
  passwordValidation,
  loginValidationSchema,
  registerValidationSchema,
  courseValidationSchema,
  moduleValidationSchema,
  supportValidationSchema,
  profileValidationSchema,
  changePasswordValidationSchema,
  isValidEmail,
  isValidFileType,
  isValidFileSize,
};

export default validators;
