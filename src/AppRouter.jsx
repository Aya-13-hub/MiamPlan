import { useState, useEffect } from 'react'
import Home from './pages/home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Recipes from './pages/Recipes.jsx'
import RecipeDetails from './pages/RecipeDetails.jsx'
import AddRecipe from './pages/AddRecipe.jsx'
import AppAuth from './App.jsx'
import Planning from './Planning/Planning.jsx'
import PreviewIngredients from './PreviewIngredients.jsx'
import ListeCourses from './ListeCourses/ListeCourses.jsx'
import { RECIPES_DATA } from './data/recipesData.js'

function parseRoute(pathOverride = null) {
  if (typeof window === 'undefined') return { name: 'home' }

  let rawPath = pathOverride
  if (!rawPath) {
    const hash = window.location.hash.replace('#', '').trim()
    // Only treat hash as a route when it starts with '/' (e.g. #/dashboard);
    // section anchors on Home (#accueil, #fonctions, #recettes) stay on pathname.
    rawPath = hash.startsWith('/') ? hash : window.location.pathname
  }

  const path = rawPath.replace(/\/+$/, '') || '/'
  const lower = path.toLowerCase()

  if (
    lower === '/app/recipes/add' ||
    lower === '/recipes/add' ||
    lower === '/recettes/add'
  ) {
    return { name: 'recipe-add' }
  }
  if (lower.startsWith('/app/recipes/')) {
    const id = decodeURIComponent(path.slice('/app/recipes/'.length))
    return { name: 'recipe-details', id }
  }
  if (lower.startsWith('/recipes/')) {
    const id = decodeURIComponent(path.slice('/recipes/'.length))
    return { name: 'recipe-details', id }
  }
  if (lower === '/app/recipes' || lower === '/recipes' || lower === '/recettes') {
    return { name: 'recipes' }
  }
  if (lower === '/dashboard' || lower === '/app/dashboard') {
    return { name: 'dashboard', tab: 'dashboard' }
  }
  if (
    lower === '/profil' ||
    lower === '/profile' ||
    lower === '/app/profil' ||
    lower === '/app/profile'
  ) {
    return { name: 'dashboard', tab: 'profil' }
  }
  if (lower === '/login' || lower === '/auth' || lower === '/connexion') {
    return { name: 'login' }
  }
  if (lower === '/register' || lower === '/signup' || lower === '/inscription') {
    return { name: 'register' }
  }
  if (lower === '/reset-password') {
    return { name: 'reset-password' }
  }
  if (lower === '/planning' || lower === '/app/planning') {
    return { name: 'planning' }
  }
  if (lower === '/ingredients' || lower === '/app/ingredients') {
    return { name: 'ingredients' }
  }
  if (
    lower === '/courses' ||
    lower === '/listecourses' ||
    lower === '/app/shopping' ||
    lower === '/app/courses' ||
    lower === '/shopping-list'
  ) {
    return { name: 'courses' }
  }

  return { name: 'home' }
}

function resolvePath(to) {
  if (!to || to === 'home' || to === '/' || to === '/home' || to === '/accueil') {
    return '/'
  }
  const lower = String(to).toLowerCase()
  if (lower === 'dashboard' || lower === '/dashboard' || lower === '/app/dashboard') {
    return '/dashboard'
  }
  if (
    lower === 'profil' ||
    lower === '/profil' ||
    lower === 'profile' ||
    lower === '/profile' ||
    lower === '/app/profil' ||
    lower === '/app/profile'
  ) {
    return '/profil'
  }
  if (lower === 'recettes' || lower === '/app/recipes' || lower === '/recipes') {
    return '/app/recipes'
  }
  if (lower === 'recipe-add' || lower === '/app/recipes/add' || lower === '/recipes/add') {
    return '/app/recipes/add'
  }
  if (lower.startsWith('/app/recipes/')) {
    return to
  }
  if (lower.startsWith('/recipes/')) {
    return `/app${to}`
  }
  if (lower === 'login' || lower === 'auth' || lower === '/login' || lower === '/auth') {
    return '/login'
  }
  if (lower === 'register' || lower === 'signup' || lower === '/register') {
    return '/register'
  }
  if (lower === 'reset-password' || lower === '/reset-password') {
    return '/reset-password'
  }
  if (lower === 'planning' || lower === '/planning' || lower === '/app/planning') {
    return '/planning'
  }
  if (lower === 'ingredients' || lower === '/ingredients' || lower === '/app/ingredients') {
    return '/ingredients'
  }
  if (
    lower === 'courses' ||
    lower === '/courses' ||
    lower === '/listecourses' ||
    lower === '/app/shopping'
  ) {
    return '/courses'
  }
  return to.startsWith('/') ? to : `/${to}`
}

export default function AppRouter() {
  const [route, setRoute] = useState(() => parseRoute())
  const [recipes, setRecipes] = useState(RECIPES_DATA)

  useEffect(() => {
    const handleUrlChange = () => {
      setRoute(parseRoute())
    }
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  const navigate = (to) => {
    const targetPath = resolvePath(to)
    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({}, '', targetPath)
    }
    setRoute(parseRoute(targetPath))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleFavorite = (recipeId) => {
    setRecipes((prev) =>
      prev.map((r) =>
        String(r.id) === String(recipeId)
          ? { ...r, isFavorite: !r.isFavorite }
          : r
      )
    )
  }

  const handleAddRecipe = (newRecipe) => {
    setRecipes((prev) => [newRecipe, ...prev])
  }

  if (route.name === 'recipes') {
    return (
      <Recipes
        recipes={recipes}
        onToggleFavorite={toggleFavorite}
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  if (route.name === 'recipe-add') {
    return (
      <AddRecipe
        onAddRecipe={handleAddRecipe}
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  if (route.name === 'recipe-details') {
    return (
      <RecipeDetails
        recipeId={route.id}
        recipes={recipes}
        onToggleFavorite={toggleFavorite}
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  if (route.name === 'dashboard') {
    return (
      <Dashboard
        activeTab={route.tab || 'dashboard'}
        onNavigate={(tab) => navigate(tab)}
        onLogout={() => navigate('home')}
        onOpenResetPassword={() => navigate('reset-password')}
      />
    )
  }

  if (
    route.name === 'login' ||
    route.name === 'register' ||
    route.name === 'reset-password'
  ) {
    return (
      <div>
        <div
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 9999,
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('home')}
            style={{
              padding: '7px 15px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1.5px solid #4caf50',
              color: '#2e7d32',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            ← Retour à l&apos;accueil
          </button>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            style={{
              padding: '7px 15px',
              borderRadius: '20px',
              background: '#4caf50',
              border: 'none',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            Tableau de bord →
          </button>
        </div>
        <AppAuth
          key={route.name}
          initialIsLogin={route.name !== 'register'}
          initialScreen={route.name === 'reset-password' ? 'reset' : 'auth'}
          onAuthSuccess={() => navigate('dashboard')}
          onModeChange={(mode) => navigate(mode)}
        />
      </div>
    )
  }

  if (route.name === 'planning') {
    return (
      <Planning
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  if (route.name === 'ingredients') {
    return (
      <PreviewIngredients
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  if (route.name === 'courses') {
    return (
      <ListeCourses
        onNavigate={navigate}
        onLogout={() => navigate('home')}
      />
    )
  }

  return <Home onNavigate={navigate} />
}
