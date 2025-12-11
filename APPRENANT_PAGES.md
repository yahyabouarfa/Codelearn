# Pages Apprenant - Architecture et Fonctionnalités

## Vue d'ensemble

Les pages Apprenant permettent aux utilisateurs d'explorer, de consulter et de suivre des cours de programmation. L'architecture est conçue pour être performante, réactive et maintenable.

## Structure des Pages

### 1. CoursesPage (Liste des Cours)

**Fichier:** `src/pages/Apprenant/CoursesPage.jsx`

#### Fonctionnalités

- **Recherche avec Debounce**: 
  - Délai de 500ms pour éviter les requêtes excessives
  - Réinitialisation de la pagination lors d'une nouvelle recherche
  
- **Filtres et Tri**:
  - Tri par titre, date, popularité
  - Filtres extensibles (peut ajouter langue, niveau, etc.)
  
- **Modes d'Affichage**:
  - Mode Grille: Cards avec images et informations principales
  - Mode Liste: Vue compacte avec plus de détails
  
- **Pagination**:
  - Navigation page par page
  - Affichage du nombre total de résultats
  - Scroll automatique en haut de page lors du changement
  
- **États**:
  - Loading: Spinner pendant le chargement
  - Empty: Message quand aucun cours n'est trouvé
  - Error: Gestion des erreurs avec bouton de retry

#### Composants Utilisés

- `CourseCard`: Affiche les informations d'un cours
- `LoadingState`: Indicateur de chargement
- `EmptyState`: État vide avec message personnalisé

#### Hooks Personnalisés

```javascript
const useDebounce = (value, delay) => {
  // Retarde la mise à jour de la valeur
  // Évite les appels API excessifs pendant la saisie
}
```

#### État Local

```javascript
const [courses, setCourses] = useState([]);           // Liste des cours
const [loading, setLoading] = useState(true);          // État de chargement
const [error, setError] = useState(null);              // Erreur éventuelle
const [searchQuery, setSearchQuery] = useState('');    // Terme de recherche
const [sortBy, setSortBy] = useState('title');         // Critère de tri
const [viewMode, setViewMode] = useState('grid');      // Mode d'affichage
const [page, setPage] = useState(0);                   // Page courante
const [totalPages, setTotalPages] = useState(0);       // Nombre total de pages
```

#### Flux de Données

```
User Input (Search) 
  → Debounce (500ms) 
  → Reset Page to 0
  → fetchCourses()
  → ApprenantService.searchCourses()
  → Update State
  → Re-render
```

---

### 2. CourseDetailPage (Détails d'un Cours)

**Fichier:** `src/pages/Apprenant/CourseDetailPage.jsx`

#### Fonctionnalités

- **Affichage Détaillé**:
  - Titre, description, créateur
  - Barre de progression globale
  - Statistiques (modules, supports)
  
- **Liste des Modules**:
  - Affichage séquentiel avec numéros
  - Statut de complétion visuel
  - Bouton "Marquer complété" pour chaque module
  - État de chargement individuel
  
- **Supports Pédagogiques**:
  - Liste des ressources disponibles
  - Bouton d'accès avec génération d'URL temporaire
  - Icônes selon le type (PDF, vidéo, etc.)
  - Ouverture dans nouvel onglet
  
- **Calcul de Progression**:
  - Pourcentage basé sur modules complétés
  - Mise à jour en temps réel
  - Barre de progression visuelle

#### Composants Utilisés

- `ModuleItem`: Affiche un module avec son statut
- `SupportItem`: Affiche un support avec bouton d'accès
- `LoadingState`: Indicateur de chargement

#### État Local

```javascript
const [course, setCourse] = useState(null);                  // Détails du cours
const [loading, setLoading] = useState(true);                // Chargement initial
const [error, setError] = useState(null);                    // Erreur éventuelle
const [completingModule, setCompletingModule] = useState(null);  // Module en cours de complétion
const [accessingSupport, setAccessingSupport] = useState(null);  // Support en cours d'accès
```

#### Actions Utilisateur

##### Complétion de Module

```javascript
handleCompleteModule(moduleId)
  → setCompletingModule(moduleId)
  → ApprenantService.completeModule(courseId, moduleId)
  → Update Local State (mark as completed)
  → Update Progress Bar
  → Show Success Toast
  → setCompletingModule(null)
```

##### Accès à un Support

```javascript
handleAccessSupport(supportId)
  → setAccessingSupport(supportId)
  → ApprenantService.requestSupportAccess(supportId)
  → Get Temporary URL (expires in 30 min)
  → Open in New Tab
  → Show Success Toast
  → setAccessingSupport(null)
```

---

## Composants UI Réutilisables

### CourseCard

**Fichier:** `src/components/ui/CourseCard.jsx`

Affiche les informations d'un cours dans un format compact.

**Props:**
- `course`: Objet cours avec titre, description, modules, etc.
- `onClick`: Fonction appelée lors du clic sur la carte
- `viewMode`: 'grid' ou 'list'

**Features:**
- Deux modes d'affichage (grille/liste)
- Icônes pour les statistiques
- Bouton d'action visible au survol
- Troncature du texte (line-clamp)

---

### ModuleItem

**Fichier:** `src/components/ui/ModuleItem.jsx`

Affiche un module avec son statut de complétion.

**Props:**
- `module`: Objet module avec id, titre, description, completed
- `index`: Index du module dans la liste
- `onComplete`: Fonction pour marquer comme complété
- `isCompleting`: Boolean indiquant si le module est en cours de complétion

**Features:**
- Icône de statut (checkmark si complété)
- Badge "Complété" avec couleur
- Bouton de complétion avec état de chargement
- Style différent selon l'état

---

### SupportItem

**Fichier:** `src/components/ui/SupportItem.jsx`

Affiche un support pédagogique avec bouton d'accès.

**Props:**
- `support`: Objet support avec id, nom, type, description
- `onAccess`: Fonction pour demander l'accès
- `isAccessing`: Boolean indiquant si l'accès est en cours

**Features:**
- Icône selon le type de fichier
- Badge du type de support
- Bouton d'accès avec état de chargement
- Description tronquée

---

### LoadingState

**Fichier:** `src/components/ui/LoadingState.jsx`

Indicateur de chargement avec spinner animé.

**Props:**
- `message`: Texte à afficher (optionnel)

**Features:**
- Spinner CSS animé
- Message personnalisable
- Centré verticalement et horizontalement

---

### EmptyState

**Fichier:** `src/components/ui/EmptyState.jsx`

État vide avec message personnalisé.

**Props:**
- `title`: Titre principal
- `description`: Description (optionnel)
- `icon`: Composant d'icône (par défaut: FiInbox)

**Features:**
- Icône dans un cercle gris
- Message centré
- Personnalisable

---

## Gestion des États

### États de Chargement

1. **Initial Loading**: Spinner plein écran
2. **Pagination Loading**: Overlay semi-transparent
3. **Action Loading**: Spinner sur le bouton concerné (module, support)

### États d'Erreur

1. **Network Error**: Message avec bouton "Réessayer"
2. **404 Not Found**: Message "Cours introuvable"
3. **API Error**: Toast notification rouge

### États Vides

1. **No Courses**: "Aucun cours trouvé"
2. **No Search Results**: "Essayez de modifier votre recherche"
3. **No Modules**: "Aucun module disponible"
4. **No Supports**: "Aucun support disponible"

---

## Performance et Optimisations

### Debouncing

La recherche utilise un délai de 500ms pour éviter les appels API excessifs:

```javascript
const debouncedSearch = useDebounce(searchQuery, 500);

useEffect(() => {
  fetchCourses();
}, [debouncedSearch, page]);
```

### useCallback

Les fonctions de fetch utilisent `useCallback` pour éviter les re-créations:

```javascript
const fetchCourses = useCallback(async () => {
  // ...
}, [debouncedSearch, page, pageSize]);
```

### Mise à Jour Optimiste

Lors de la complétion d'un module, l'état local est mis à jour immédiatement:

```javascript
setCourse((prev) => ({
  ...prev,
  modules: prev.modules.map((module) =>
    module.id === moduleId
      ? { ...module, completed: true }
      : module
  ),
}));
```

---

## Navigation

### Routes

- `/apprenant/courses` → Liste des cours
- `/apprenant/courses/:id` → Détails d'un cours
- `/apprenant/progress` → Progression de l'utilisateur

### Liens et Redirections

```javascript
// Navigation vers le détail
navigate(`/apprenant/courses/${courseId}`);

// Retour à la liste
navigate('/apprenant/courses');
```

---

## Notifications

Les notifications utilisent `react-hot-toast`:

### Types de Notifications

- **Success** (vert): Action réussie
- **Error** (rouge): Erreur
- **Loading** (bleu): En cours

### Exemples

```javascript
toast.success('Module marqué comme complété !');
toast.error('Erreur lors du chargement du cours');
```

---

## Responsive Design

### Breakpoints Tailwind

- **Mobile**: `< 768px` → 1 colonne
- **Tablet**: `768px - 1024px` → 2 colonnes
- **Desktop**: `> 1024px` → 3 colonnes

### Adaptations Mobiles

- Grille de cours: 1 colonne sur mobile, 2-3 sur desktop
- Barre de recherche: Verticale sur mobile, horizontale sur desktop
- Sidebar: Menu hamburger sur mobile, fixe sur desktop

---

## Tests et Validation

### Points de Test

1. **Recherche**: Vérifier le debounce et la pagination
2. **Complétion**: Vérifier la mise à jour de l'état et de la progression
3. **Accès Support**: Vérifier l'ouverture de l'URL temporaire
4. **États Vides**: Vérifier l'affichage des messages appropriés
5. **Erreurs**: Vérifier la gestion et l'affichage des erreurs

### Scénarios de Test

```
Scenario: Recherche de cours
  Given je suis sur la page des cours
  When je tape "Python" dans la recherche
  Then je vois les résultats après 500ms
  And la page est réinitialisée à 0

Scenario: Complétion de module
  Given je consulte un cours
  When je clique sur "Marquer complété"
  Then le module est marqué comme complété
  And la barre de progression est mise à jour
  And je vois une notification de succès

Scenario: Accès à un support
  Given je consulte un cours
  When je clique sur "Accéder" sur un support
  Then une URL temporaire est générée
  And le support s'ouvre dans un nouvel onglet
```

---

## Évolutions Futures

### Fonctionnalités Potentielles

1. **Filtres Avancés**:
   - Par langue de programmation
   - Par niveau (débutant, intermédiaire, avancé)
   - Par créateur

2. **Favoris**:
   - Ajouter des cours aux favoris
   - Page dédiée aux cours favoris

3. **Notes et Avis**:
   - Système de notation des cours
   - Commentaires et avis

4. **Certificats**:
   - Génération de certificat à la fin d'un cours
   - Téléchargement PDF

5. **Progression Détaillée**:
   - Graphiques de progression
   - Temps passé sur chaque module
   - Statistiques d'apprentissage

6. **Mode Hors-ligne**:
   - Cache des cours consultés
   - Accès hors-ligne aux supports

7. **Notifications Push**:
   - Nouveaux cours disponibles
   - Rappels de reprise de cours

---

## Maintenance

### Bonnes Pratiques

1. **Garder les Composants Petits**: Un composant = une responsabilité
2. **Extraire la Logique**: Hooks personnalisés pour la logique réutilisable
3. **Gérer les Erreurs**: Toujours avoir un fallback en cas d'erreur
4. **Optimiser les Performances**: Debouncing, memoization, lazy loading
5. **Documenter le Code**: Commentaires pour les parties complexes

### Dépendances Clés

- `react-router-dom`: Navigation
- `axios`: Appels API
- `react-hot-toast`: Notifications
- `react-icons`: Icônes
- `tailwindcss`: Styling
