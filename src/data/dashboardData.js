import recipeSalade from '../assets/dashboard/recipe-salade.png'
import recipePasta from '../assets/dashboard/recipe-pasta.png'
import recipePaella from '../assets/dashboard/recipe-paella.png'
import recipeDumplings from '../assets/dashboard/recipe-dumplings.png'
import avatarNoura from '../assets/dashboard/avatar-noura.png'

export const DASHBOARD_USER = {
  name: 'Noura BILLALI',
  firstName: 'Noura',
  role: 'Utilisateur',
  email: 'noura.billali@miamplan.fr',
  avatar: avatarNoura,
  calorieGoal: 1900,
  dietPreference: 'Équilibré & Méditerranéen',
}

export const DASHBOARD_STATS = [
  {
    id: 'saved-recipes',
    value: 48,
    label: { fr: 'Recettes sauvegardées', en: 'Saved recipes' },
    tone: 'sage',
    targetTab: 'recettes',
  },
  {
    id: 'planned-meals',
    value: 14,
    label: { fr: 'Repas planifiés', en: 'Planned meals' },
    tone: 'sage',
    targetTab: 'planning',
  },
  {
    id: 'shopping-lists',
    value: 7,
    label: { fr: 'Courses générées', en: 'Lists generated' },
    tone: 'amber',
    targetTab: 'courses',
  },
  {
    id: 'calories',
    value: 1850,
    label: { fr: 'Calories moy / jour', en: 'Avg calories / day' },
    tone: 'coral',
    targetTab: 'planning',
  },
]

export const TODAY_MEALS = [
  {
    id: 'meal-lunch',
    slot: { fr: 'DÉJEUNER', en: 'LUNCH' },
    slotType: 'lunch',
    title: 'Bowl Buddha au quinoa',
    duration: '25 min',
    category: { fr: 'Végétarien', en: 'Vegetarian' },
    calories: '520 kcal',
    servings: 2,
    image: recipeSalade,
    description:
      'Un bol complet et coloré à base de quinoa, légumes croquants, avocat et sauce tahini citronnée.',
    ingredients: [
      '150 g de quinoa',
      '200 g de tomates cerises',
      '1 avocat mûr',
      '100 g de pois chiches rôtis',
      '1 c. à s. de tahini & jus de citron',
    ],
    steps: [
      'Rincer et cuire le quinoa dans deux fois son volume d’eau pendant 12 minutes.',
      'Couper les tomates cerises, le concombre et l’avocat en tranches.',
      'Disposer les ingrédients harmonieusement dans un bol et arroser de sauce tahini.',
    ],
  },
  {
    id: 'meal-dinner',
    slot: { fr: 'DÎNER', en: 'DINNER' },
    slotType: 'dinner',
    title: 'Dumplings',
    duration: '45 min',
    category: { fr: 'Japonais', en: 'Japanese' },
    calories: '480 kcal',
    servings: 2,
    image: recipeDumplings,
    description:
      'Raviolis japonais dorés à la poêle, garnis de légumes croquants, gingembre frais et sauce soja sésame.',
    ingredients: [
      '12 feuilles à gyoza',
      '180 g de chou chinois émincé',
      '100 g de champignons shiitake',
      '1 c. à c. de gingembre râpé',
      'Sauce soja & graines de sésame',
    ],
    steps: [
      'Faire revenir le chou, les champignons et le gingembre pendant 5 minutes.',
      'Garnir chaque feuille de farce et replier les bords en petits plis.',
      'Dorer à la poêle 3 minutes puis cuire à couvert avec un fond d’eau 4 minutes.',
    ],
  },
]

export const RECOMMENDED_RECIPES = [
  {
    id: 'salade',
    title: 'Salade',
    origin: { fr: 'Méditerranéenne', en: 'Mediterranean' },
    duration: '15 min',
    tag: { fr: 'Salade', en: 'Salad' },
    rating: '4.8',
    calories: '380 kcal',
    servings: 2,
    image: recipeSalade,
    description:
      'Salade grecque fraîche avec tomates cerises rouges et jaunes, concombre, olives kalamata, oignon rouge et feta aux herbes.',
    ingredients: [
      '250 g de tomates cerises',
      '1/2 concombre',
      '100 g de feta émiettée',
      '60 g d’olives noires',
      'Huile d’olive & origan',
    ],
    steps: [
      'Laver et couper les tomates cerises et le concombre.',
      'Émincer finement l’oignon rouge et mélanger avec la laitue.',
      'Ajouter la feta, les olives et assaisonner d’huile d’olive et d’origan.',
    ],
  },
  {
    id: 'pasta',
    title: 'Pasta',
    origin: { fr: 'Italien', en: 'Italian' },
    duration: '25 min',
    tag: { fr: 'Pâtes', en: 'Pasta' },
    rating: '4.7',
    calories: '610 kcal',
    servings: 2,
    image: recipePasta,
    description:
      'Tagliatelles crémeuses au parmesan, ail confit, poivre concassé et persil frais ciselé.',
    ingredients: [
      '220 g de tagliatelles fraîches',
      '150 ml de crème légère',
      '50 g de parmesan râpé',
      '1 gousse d’ail',
      'Persil plat & poivre noir',
    ],
    steps: [
      'Cuire les tagliatelles al dente dans une grande casserole d’eau salée.',
      'Faire infuser l’ail dans la crème à feu doux et incorporer le parmesan.',
      'Mélanger les pâtes avec la sauce et parsemer de persil frais.',
    ],
  },
  {
    id: 'paella',
    title: 'Paella',
    origin: { fr: 'Espagnol', en: 'Spanish' },
    duration: '40 min',
    tag: { fr: 'Plat', en: 'Main dish' },
    rating: '4.9',
    calories: '640 kcal',
    servings: 4,
    image: recipePaella,
    description:
      'Poêlée espagnole parfumée au safran, crevettes, calamars, poivrons doux et rondelles de citron.',
    ingredients: [
      '280 g de riz rond',
      '250 g de crevettes entières',
      '150 g d’anneaux de calamar',
      '1 dose de safran & laurier',
      '750 ml de bouillon de légumes',
    ],
    steps: [
      'Saisir les fruits de mer et les réserver.',
      'Nacrer le riz avec les épices et verser le bouillon chaud safrané.',
      'Laisser mijoter 18 minutes puis déposer crevettes, calamars et citron.',
    ],
  },
  {
    id: 'dumplings',
    title: 'Dumplings',
    origin: { fr: 'Japonais', en: 'Japanese' },
    duration: '45 min',
    tag: { fr: 'Asiatique', en: 'Asian' },
    rating: '4.8',
    calories: '480 kcal',
    servings: 2,
    image: recipeDumplings,
    description:
      'Gyozas croustillants servis avec une sauce soja sésame légèrement pimentée et ciboulette fraîche.',
    ingredients: [
      '12 pâtes à dumplings',
      '200 g de farce légumes & tofu',
      '1 c. à s. d’huile de sésame',
      'Ciboulette ciselée',
      'Sauce soja sucrée-salée',
    ],
    steps: [
      'Façonner les dumplings avec la farce assaisonnée.',
      'Saisir à l’huile de sésame puis cuire à la vapeur 4 minutes.',
      'Servir chaud avec le bol de sauce au centre.',
    ],
  },
]

export const SHOPPING_PRIORITY_ITEMS = [
  { id: 'shop-1', name: 'Quinoa', quantity: '300 g', category: 'Céréales', checked: false },
  { id: 'shop-2', name: 'Tomates cerises', quantity: '500 g', category: 'Légumes', checked: false },
  { id: 'shop-3', name: 'Saumon', quantity: '600 g', category: 'Poisson', checked: false },
  { id: 'shop-4', name: 'Lait de coco', quantity: '400 ml', category: 'Épicerie', checked: false },
]

export const FULL_SHOPPING_ITEMS = [
  ...SHOPPING_PRIORITY_ITEMS,
  { id: 'shop-5', name: 'Avocats', quantity: '3 pièces', category: 'Légumes', checked: false },
  { id: 'shop-6', name: 'Feta AOP', quantity: '200 g', category: 'Crémerie', checked: true },
  { id: 'shop-7', name: 'Concombre', quantity: '2 pièces', category: 'Légumes', checked: false },
  { id: 'shop-8', name: 'Tagliatelles', quantity: '500 g', category: 'Épicerie', checked: false },
  { id: 'shop-9', name: 'Parmesan râpé', quantity: '150 g', category: 'Crémerie', checked: true },
  { id: 'shop-10', name: 'Crevettes', quantity: '400 g', category: 'Poisson', checked: false },
]

export const STOCK_INGREDIENTS = [
  { id: 'ing-1', name: 'Riz basmati', quantity: '800 g', status: 'En stock' },
  { id: 'ing-2', name: 'Huile d’olive vierge', quantity: '750 ml', status: 'En stock' },
  { id: 'ing-3', name: 'Pois chiches', quantity: '400 g', status: 'En stock' },
  { id: 'ing-4', name: 'Quinoa', quantity: '80 g', status: 'Stock faible' },
  { id: 'ing-5', name: 'Safran en filaments', quantity: '2 g', status: 'En stock' },
  { id: 'ing-6', name: 'Tomates cerises', quantity: '0 g', status: 'À acheter' },
]

export const WEEKLY_PLAN = [
  { day: 'Lundi', lunch: 'Salade Méditerranéenne', dinner: 'Pasta crémeuse' },
  { day: 'Mardi', lunch: 'Bowl Quinoa & Avocat', dinner: 'Saumon rôti & légumes' },
  { day: 'Mercredi', lunch: 'Wrap poulet grillé', dinner: 'Soupe miso & tofu' },
  { day: 'Jeudi', lunch: 'Salade Niçoise', dinner: 'Paella aux fruits de mer' },
  { day: 'Vendredi', lunch: 'Pasta pesto basilic', dinner: 'Curry coco légumes' },
  { day: 'Samedi', lunch: 'Brunch avocat & œufs', dinner: 'Gratin de courgettes' },
  { day: 'Dimanche', lunch: 'Bowl Buddha au quinoa', dinner: 'Dumplings' },
]

export const NOTIFICATIONS_DATA = [
  {
    id: 'n1',
    title: 'Menu de la semaine prêt',
    detail: '14 repas équilibrés ont été planifiés pour cette semaine.',
    time: 'Il y a 15 min',
  },
  {
    id: 'n2',
    title: 'Liste de courses mise à jour',
    detail: '4 articles prioritaires ajoutés pour vos repas du dimanche.',
    time: 'Il y a 1 h',
  },
  {
    id: 'n3',
    title: 'Stock faible : Quinoa',
    detail: 'Il vous reste 80 g en réserve, 300 g recommandés.',
    time: 'Aujourd’hui',
  },
]

export const UI_LABELS = {
  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      recettes: 'Recettes',
      ingredients: 'Ingrédients',
      planning: 'Planning',
      courses: 'Liste des courses',
      profil: 'Mon profil',
    },
    logout: 'Déconnexion',
    searchPlaceholder: 'Recherche une recette',
    modeDay: 'MODE JOUR',
    modeNight: 'MODE NUIT',
    heroCta: 'Voir mon planning',
    todayTitle: 'Repas du jour - Dimanche',
    fullPlanning: 'Planning Complet',
    viewRecipe: 'Voir la recette',
    recommendedTitle: 'Recettes recommandées',
    exploreAll: 'Explorer tout',
    shoppingTitle: 'Liste de courses',
    open: 'Ouvrir',
    prioritySubtitle: 'Articles à acheter en priorité:',
    viewFullList: 'Voir la liste complète',
    quickShortcuts: 'Raccourcis rapides',
    planMeal: 'Planifier un nouveau repas',
    manageStock: 'Gérer mes ingrédients en stock',
    noSearchMatch: 'Aucune recette trouvée pour cette recherche.',
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      recettes: 'Recipes',
      ingredients: 'Ingredients',
      planning: 'Meal Plan',
      courses: 'Shopping List',
      profil: 'My Profile',
    },
    logout: 'Log out',
    searchPlaceholder: 'Search a recipe',
    modeDay: 'DAY MODE',
    modeNight: 'NIGHT MODE',
    heroCta: 'View my meal plan',
    todayTitle: "Today's Meals - Sunday",
    fullPlanning: 'Full Meal Plan',
    viewRecipe: 'View recipe',
    recommendedTitle: 'Recommended Recipes',
    exploreAll: 'Explore all',
    shoppingTitle: 'Shopping List',
    open: 'Open',
    prioritySubtitle: 'Priority items to buy:',
    viewFullList: 'View full list',
    quickShortcuts: 'Quick Actions',
    planMeal: 'Plan a new meal',
    manageStock: 'Manage stock ingredients',
    noSearchMatch: 'No recipes match your search.',
  },
}
