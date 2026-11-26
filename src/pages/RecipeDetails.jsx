import { useState } from 'react'
import AppShell from '../layouts/AppShell'
import {
  ArrowLeftIcon,
  BasketIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  ShareIcon,
  UsersIcon,
} from '../components/dashboard/DashboardIcons'
import { RECIPES_DATA } from '../data/recipesData'
import './Recipes.css'

export default function RecipeDetails({
  recipeId,
  recipes = RECIPES_DATA,
  onToggleFavorite,
  onNavigate,
  onLogout,
}) {
  const recipe = recipes.find(
    (r) => String(r.id) === String(recipeId) || r.slug === String(recipeId)
  )

  const [localFavorite, setLocalFavorite] = useState(Boolean(recipe?.isFavorite))
  const [addedToCart, setAddedToCart] = useState(false)
  const [checkedIngredients, setCheckedIngredients] = useState({})
  const [shareCopied, setShareCopied] = useState(false)

  const goTo = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  if (!recipe) {
    return (
      <AppShell activeTab="recettes" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="mp-rempty">
          <h2 className="mp-rpage-title">Recette introuvable</h2>
          <p className="mp-rempty__text">
            La recette demandée n’existe pas ou a été supprimée.
          </p>
          <button
            type="button"
            className="mp-rbtn mp-rbtn--primary"
            onClick={() => goTo('/app/recipes')}
          >
            <ArrowLeftIcon size={16} />
            <span>Retour aux recettes</span>
          </button>
        </div>
      </AppShell>
    )
  }

  const isFavorite =
    typeof recipe.isFavorite === 'boolean' && onToggleFavorite
      ? recipe.isFavorite
      : localFavorite

  const handleToggleFav = () => {
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id)
    } else {
      setLocalFavorite((prev) => !prev)
    }
  }

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const handleAddToShopping = () => {
    setAddedToCart(true)
    window.setTimeout(() => setAddedToCart(false), 2500)
  }

  const handleShare = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
    setShareCopied(true)
    window.setTimeout(() => setShareCopied(false), 2000)
  }

  return (
    <AppShell activeTab="recettes" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="mp-recipe-details-page">
        {/* Back Breadcrumb */}
        <button
          type="button"
          className="mp-back-link"
          onClick={() => goTo('/app/recipes')}
        >
          <ArrowLeftIcon size={16} />
          <span>Retour au catalogue de recettes</span>
        </button>

        {/* Recipe Hero Card */}
        <section className="mp-rdetails-hero">
          <div className="mp-rdetails-media">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="mp-rdetails-img"
            />
            <span className="mp-rdetails-cat-badge">{recipe.category}</span>
          </div>

          <div className="mp-rdetails-info">
            <div className="mp-rdetails-toprow">
              <div className="mp-rdetails-tags">
                {recipe.difficulty && (
                  <span className="mp-rdetails-tag">{recipe.difficulty}</span>
                )}
                {recipe.tags?.map((tag) => (
                  <span key={tag} className="mp-rdetails-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mp-rpage-actions">
                <button
                  type="button"
                  className="mp-rbtn mp-rbtn--ghost mp-rbtn--icon"
                  onClick={handleToggleFav}
                  aria-label="Ajouter aux favoris"
                  aria-pressed={isFavorite}
                  style={{ color: isFavorite ? '#e05252' : undefined }}
                >
                  <HeartIcon size={19} filled={isFavorite} />
                </button>
                <button
                  type="button"
                  className="mp-rbtn mp-rbtn--ghost mp-rbtn--icon"
                  onClick={handleShare}
                  aria-label="Partager la recette"
                  title={shareCopied ? 'Lien copié !' : 'Partager'}
                >
                  {shareCopied ? <CheckIcon size={18} /> : <ShareIcon size={18} />}
                </button>
              </div>
            </div>

            <h1 className="mp-rdetails-title">{recipe.title}</h1>
            {recipe.description && (
              <p className="mp-rdetails-desc">{recipe.description}</p>
            )}

            {/* Quick Specs */}
            <div className="mp-rdetails-specs">
              <div className="mp-rspec-item">
                <span className="mp-rspec-label">Préparation</span>
                <span className="mp-rspec-val">
                  <ClockIcon size={15} /> {recipe.prepTime || 0} min
                </span>
              </div>
              <div className="mp-rspec-item">
                <span className="mp-rspec-label">Cuisson</span>
                <span className="mp-rspec-val">
                  <ClockIcon size={15} /> {recipe.cookTime || 0} min
                </span>
              </div>
              <div className="mp-rspec-item">
                <span className="mp-rspec-label">Portions</span>
                <span className="mp-rspec-val">
                  <UsersIcon size={15} /> {recipe.servings || 1} pers.
                </span>
              </div>
              {recipe.calories ? (
                <div className="mp-rspec-item">
                  <span className="mp-rspec-label">Calories</span>
                  <span className="mp-rspec-val">
                    <FlameIcon size={16} /> {recipe.calories} kcal
                  </span>
                </div>
              ) : (
                <div className="mp-rspec-item">
                  <span className="mp-rspec-label">Note</span>
                  <span className="mp-rspec-val">★ {recipe.rating || '4.8'}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mp-rdetails-actions">
              <button
                type="button"
                className="mp-rbtn mp-rbtn--primary"
                onClick={() => goTo('planning')}
              >
                <CalendarIcon size={17} />
                <span>Planifier ce repas</span>
              </button>
              <button
                type="button"
                className={`mp-rbtn ${
                  addedToCart ? 'mp-rbtn--sage' : 'mp-rbtn--secondary'
                }`}
                onClick={handleAddToShopping}
              >
                {addedToCart ? <CheckIcon size={17} /> : <BasketIcon size={17} />}
                <span>
                  {addedToCart
                    ? 'Ajouté à la liste !'
                    : 'Ajouter ingrédients à la liste'}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Two Columns: Ingredients & Preparation Steps */}
        <div className="mp-rdetails-grid">
          <section className="mp-rwidget">
            <div className="mp-rwidget-header">
              <h2 className="mp-rwidget-title">Ingrédients nécessaires</h2>
              <span className="mp-rwidget-meta">
                {recipe.ingredients?.length || 0} article
                {(recipe.ingredients?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>

            <p className="mp-ring-hint">
              Cochez les ingrédients que vous avez déjà :
            </p>

            <ul className="mp-ring-list">
              {recipe.ingredients?.map((ing, idx) => (
                <li
                  key={`${ing.name}-${idx}`}
                  className={`mp-ring-row ${
                    checkedIngredients[idx] ? 'mp-ring-row--checked' : ''
                  }`}
                  onClick={() => toggleIngredient(idx)}
                >
                  <div className="mp-ring-left">
                    <input
                      type="checkbox"
                      checked={!!checkedIngredients[idx]}
                      onChange={() => {}}
                      aria-label={ing.name}
                    />
                    <span>{ing.name}</span>
                  </div>
                  {(ing.quantity || ing.unit) && (
                    <span className="mp-ring-qty">
                      {ing.quantity} {ing.unit}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="mp-rwidget">
            <div className="mp-rwidget-header">
              <h2 className="mp-rwidget-title">Étapes de préparation</h2>
              <span className="mp-rwidget-meta">
                {recipe.steps?.length || 0} étape
                {(recipe.steps?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>

            <ol className="mp-rsteps-list">
              {recipe.steps?.map((step, idx) => (
                <li key={idx} className="mp-rstep-item">
                  <span className="mp-rstep-num" aria-hidden="true">
                    {idx + 1}
                  </span>
                  <p className="mp-rstep-text">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </AppShell>
  )
}
