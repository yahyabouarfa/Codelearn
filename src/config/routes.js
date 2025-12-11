import { ROUTES } from './constants';

/**
 * Route configuration with role-based access
 */
export const routes = {
  public: [
    { path: ROUTES.HOME, name: 'Accueil' },
    { path: ROUTES.LOGIN, name: 'Connexion' },
    { path: ROUTES.REGISTER, name: 'Inscription' },
    { path: ROUTES.FORGOT_PASSWORD, name: 'Mot de passe oublié' },
  ],
  
  apprenant: [
    { path: ROUTES.APPRENANT_DASHBOARD, name: 'Tableau de bord', icon: 'dashboard' },
    { path: ROUTES.COURSE_CATALOG, name: 'Catalogue des cours', icon: 'book' },
    { path: ROUTES.PROFILE, name: 'Profil', icon: 'user' },
  ],
  
  creator: [
    { path: ROUTES.CREATOR_DASHBOARD, name: 'Tableau de bord', icon: 'dashboard' },
    { path: ROUTES.MY_COURSES, name: 'Mes cours', icon: 'book' },
    { path: ROUTES.CREATE_COURSE, name: 'Créer un cours', icon: 'plus' },
    { path: ROUTES.PROFILE, name: 'Profil', icon: 'user' },
  ],
  
  admin: [
    { path: ROUTES.ADMIN_DASHBOARD, name: 'Tableau de bord', icon: 'dashboard' },
    { path: ROUTES.COURSE_VALIDATION, name: 'Validation des cours', icon: 'check' },
    { path: ROUTES.USER_MANAGEMENT, name: 'Gestion des utilisateurs', icon: 'users' },
    { path: ROUTES.PROFILE, name: 'Profil', icon: 'user' },
  ],
};

export default routes;
