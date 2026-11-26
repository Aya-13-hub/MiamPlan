import { useState, useMemo } from 'react'
import AppShell from '../layouts/AppShell'
import RecipeCard from '../components/recipes/RecipeCard'
import { PlusIcon, SearchIcon } from '../components/dashboard/DashboardIcons'
import { CATEGORIES_DATA, RECIPES_DATA } from '../data/recipesData'
import './Recipes.css'

export default function Recipes({
  recipes = RECIPES_DATA,
  onToggleFavorite,
  onNavigate,
  onLogout,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        !normalizedQuery ||
        recipe.title.toLowerCase().includes(normalizedQuery) ||
        recipe.category.toLowerCase().includes(normalizedQuery)
      const matchesCategory =
        selectedCategory === 'Tous' || recipe.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [recipes, normalizedQuery, selectedCategory])

  const goTo = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <AppShell
      activeTab="recettes"
      onNavigate={onNavigate}
      onLogout={onLogout}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <div className="mp-recipes-page">
        {/* Page Header */}
        <div className="mp-rpage-header">
          <div>
            <h1 className="mp-rpage-title">Recettes</h1>
            <p className="mp-rpage-subtitle">
              Explorez, personnalisez et cuisinez vos plats préférés (
              {filteredRecipes.length} recette
              {filteredRecipes.length !== 1 ? 's' : ''})
            </p>
          </div>
          <div className="mp-rpage-actions">
            <button
              type="button"
              className="mp-rbtn mp-rbtn--primary"
              onClick={() => goTo('/app/recipes/add')}
            >
              <PlusIcon size={16} />
              <span>Ajouter une recette</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filters */}
        <div className="mp-rfilter-bar">
          <div className="mp-rsearch-box">
            <span className="mp-rsearch-icon" aria-hidden="true">
              <SearchIcon size={16} />
            </span>
            <input
              type="search"
              className="mp-rsearch-input"
              placeholder="Rechercher par nom ou catégorie…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher une recette par nom ou catégorie"
            />
          </div>

          <div
            className="mp-rfilter-pills"
            role="group"
            aria-label="Filtrer par catégorie"
          >
            <button
              type="button"
              className={`mp-rpill ${
                selectedCategory === 'Tous' ? 'mp-rpill--active' : ''
              }`}
              onClick={() => setSelectedCategory('Tous')}
              aria-pressed={selectedCategory === 'Tous'}
            >
              Tous
            </button>
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`mp-rpill ${
                  selectedCategory === cat.name ? 'mp-rpill--active' : ''
                }`}
                onClick={() => setSelectedCategory(cat.name)}
                aria-pressed={selectedCategory === cat.name}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid or Empty State */}
        {filteredRecipes.length > 0 ? (
          <div className="mp-rcatalog-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onSelect={() => goTo(`/app/recipes/${recipe.id}`)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="mp-rempty">
            <p className="mp-rempty__text">
              Aucune recette trouvée pour votre recherche.
            </p>
            <button
              type="button"
              className="mp-rbtn mp-rbtn--secondary mp-rbtn--sm"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('Tous')
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}
