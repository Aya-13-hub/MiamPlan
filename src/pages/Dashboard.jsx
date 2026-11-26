import { useState, useMemo } from 'react'
import heroBanner from '../assets/dashboard/hero-banner.png'
import iconCart from '../assets/dashboard/icon-cart.png'
import Sidebar from '../components/dashboard/Sidebar'
import Header from '../components/dashboard/Header'
import RecipeModal from '../components/dashboard/RecipeModal'
import {
  BasketIcon,
  CalendarCheckIcon,
  CalendarIcon,
  CartOutlineIcon,
  ChefHatIcon,
  ClockIcon,
  FlameIcon,
  MoonIcon,
  RecipeBookIcon,
  UtensilsIcon,
} from '../components/dashboard/DashboardIcons'
import {
  DASHBOARD_STATS,
  DASHBOARD_USER,
  FULL_SHOPPING_ITEMS,
  NOTIFICATIONS_DATA,
  RECOMMENDED_RECIPES,
  STOCK_INGREDIENTS,
  TODAY_MEALS,
  UI_LABELS,
  WEEKLY_PLAN,
} from '../data/dashboardData'
import './Dashboard.css'

const STAT_ICONS = {
  'saved-recipes': RecipeBookIcon,
  'planned-meals': CalendarCheckIcon,
  'shopping-lists': CartOutlineIcon,
  calories: FlameIcon,
}

export default function Dashboard({
  activeTab: externalActiveTab,
  onNavigate: externalOnNavigate,
  onOpenResetPassword,
  onLogout,
}) {
  const [internalTab, setInternalTab] = useState(externalActiveTab || 'dashboard')
  const activeTab = externalActiveTab !== undefined ? externalActiveTab : internalTab

  const onNavigate = (tab) => {
    setInternalTab(tab)
    if (externalOnNavigate) {
      externalOnNavigate(tab)
    }
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [language, setLanguage] = useState('fr')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [shoppingItems, setShoppingItems] = useState(FULL_SHOPPING_ITEMS)
  const [stockItems, setStockItems] = useState(STOCK_INGREDIENTS)
  const [weeklyPlan, setWeeklyPlan] = useState(WEEKLY_PLAN)
  const [toastMessage, setToastMessage] = useState('')
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const [newPlanForm, setNewPlanForm] = useState({
    day: 'Dimanche',
    slot: 'lunch',
    meal: '',
  })

  const labels = UI_LABELS[language]

  const showToast = (msg) => {
    setToastMessage(msg)
    window.clearTimeout(showToast._timer)
    showToast._timer = window.setTimeout(() => setToastMessage(''), 2800)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRecipes = useMemo(() => {
    if (!normalizedQuery) return RECOMMENDED_RECIPES
    return RECOMMENDED_RECIPES.filter((r) => {
      const origin = r.origin[language].toLowerCase()
      const tag = r.tag[language].toLowerCase()
      return (
        r.title.toLowerCase().includes(normalizedQuery) ||
        origin.includes(normalizedQuery) ||
        tag.includes(normalizedQuery)
      )
    })
  }, [normalizedQuery, language])

  const priorityItems = shoppingItems.slice(0, 4)

  const toggleShoppingItem = (id) => {
    setShoppingItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  const handlePlanSubmit = (e) => {
    e.preventDefault()
    if (!newPlanForm.meal.trim()) return
    setWeeklyPlan((prev) =>
      prev.map((row) =>
        row.day === newPlanForm.day
          ? {
              ...row,
              [newPlanForm.slot]: newPlanForm.meal.trim(),
            }
          : row
      )
    )
    showToast(
      language === 'fr'
        ? `Repas ajouté au planning (${newPlanForm.day})`
        : `Meal added to plan (${newPlanForm.day})`
    )
    setNewPlanForm((prev) => ({ ...prev, meal: '' }))
  }

  const cycleStockStatus = (id) => {
    const order = ['En stock', 'Stock faible', 'À acheter']
    setStockItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const nextStatus = order[(order.indexOf(item.status) + 1) % order.length]
        return { ...item, status: nextStatus }
      })
    )
  }

  const renderMainDashboard = () => (
    <>
      {/* Welcome Banner */}
      <section className="mp-hero-card" aria-label="Bienvenue">
        <img
          src={heroBanner}
          alt="Bonjour Noura ! Votre menu de semaine"
          className="mp-hero-img"
        />
        <button
          type="button"
          className="mp-hero-cta"
          onClick={() => onNavigate('planning')}
        >
          {labels.heroCta} <span aria-hidden="true">→</span>
        </button>
      </section>

      {/* Statistics Row */}
      <section className="mp-stats-grid" aria-label="Statistiques">
        {DASHBOARD_STATS.map((stat) => {
          const IconComponent = STAT_ICONS[stat.id]
          return (
            <button
              key={stat.id}
              type="button"
              className="mp-stat-card"
              onClick={() => onNavigate(stat.targetTab)}
            >
              <span className={`mp-stat-icon mp-stat-icon--${stat.tone}`}>
                <IconComponent size={20} />
              </span>
              <div className="mp-stat-info">
                <span className="mp-stat-value">{stat.value}</span>
                <span className="mp-stat-label">{stat.label[language]}</span>
              </div>
            </button>
          )
        })}
      </section>

      {/* Main 2-Column Content */}
      <div className="mp-content-grid">
        {/* Left Column */}
        <div className="mp-left-col">
          {/* Today's Meals */}
          <section className="mp-panel">
            <div className="mp-panel-header">
              <div className="mp-panel-title-wrap">
                <span className="mp-panel-icon">
                  <CalendarIcon size={22} />
                </span>
                <h2 className="mp-panel-title">{labels.todayTitle}</h2>
              </div>
              <button
                type="button"
                className="mp-panel-link"
                onClick={() => onNavigate('planning')}
              >
                {labels.fullPlanning} →
              </button>
            </div>

            <div className="mp-meals-grid">
              {TODAY_MEALS.map((meal) => (
                <article key={meal.id} className="mp-meal-card">
                  <div className="mp-meal-slot">
                    <span className="mp-meal-slot-icon">
                      {meal.slotType === 'lunch' ? (
                        <UtensilsIcon size={16} />
                      ) : (
                        <MoonIcon size={16} />
                      )}
                    </span>
                    <span>{meal.slot[language]}</span>
                  </div>

                  <h3 className="mp-meal-title">{meal.title}</h3>

                  <div className="mp-meal-meta">
                    <span className="mp-meal-time">
                      <ClockIcon size={14} />
                      {meal.duration}
                    </span>
                    <span className="mp-meal-tag">
                      {meal.category[language]}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mp-pill-btn mp-pill-btn--full"
                    onClick={() => setSelectedRecipe(meal)}
                  >
                    {labels.viewRecipe}
                  </button>
                </article>
              ))}
            </div>
          </section>

          {/* Recommended Recipes */}
          <section className="mp-panel">
            <div className="mp-panel-header">
              <div className="mp-panel-title-wrap">
                <span className="mp-panel-icon">
                  <ChefHatIcon size={22} />
                </span>
                <h2 className="mp-panel-title">{labels.recommendedTitle}</h2>
              </div>
              <button
                type="button"
                className="mp-panel-link"
                onClick={() => onNavigate('recettes')}
              >
                {labels.exploreAll} →
              </button>
            </div>

            {filteredRecipes.length === 0 ? (
              <p className="mp-empty-state">{labels.noSearchMatch}</p>
            ) : (
              <div className="mp-recipes-grid">
                {filteredRecipes.map((recipe) => (
                  <article
                    key={recipe.id}
                    className="mp-recipe-card"
                    onClick={() =>
                      externalOnNavigate
                        ? externalOnNavigate(`/app/recipes/${recipe.id}`)
                        : setSelectedRecipe(recipe)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        if (externalOnNavigate) {
                          externalOnNavigate(`/app/recipes/${recipe.id}`)
                        } else {
                          setSelectedRecipe(recipe)
                        }
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={recipe.title}
                  >
                    <div className="mp-recipe-media">
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="mp-recipe-img"
                      />
                      <span className="mp-recipe-origin">
                        {recipe.origin[language]}
                      </span>
                    </div>

                    <div className="mp-recipe-body">
                      <h3 className="mp-recipe-title">{recipe.title}</h3>
                      <div className="mp-recipe-footer">
                        <span className="mp-recipe-chip">
                          <ClockIcon size={12} />
                          {recipe.duration}
                        </span>
                        <span className="mp-recipe-chip mp-recipe-chip--tag">
                          {recipe.tag[language]}
                        </span>
                        <span className="mp-recipe-rating">
                          <span className="mp-star" aria-hidden="true">
                            ★
                          </span>
                          {recipe.rating}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="mp-right-col">
          {/* Shopping List Preview */}
          <section className="mp-panel mp-panel--compact">
            <div className="mp-panel-header">
              <div className="mp-panel-title-wrap">
                <img
                  src={iconCart}
                  alt=""
                  className="mp-cart-icon-img"
                  aria-hidden="true"
                />
                <h2 className="mp-panel-title">{labels.shoppingTitle}</h2>
              </div>
              <button
                type="button"
                className="mp-panel-link"
                onClick={() => onNavigate('courses')}
              >
                {labels.open}
              </button>
            </div>

            <p className="mp-shopping-subtitle">{labels.prioritySubtitle}</p>

            <ul className="mp-shopping-list">
              {priorityItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`mp-shopping-row ${
                      item.checked ? 'mp-shopping-row--checked' : ''
                    }`}
                    onClick={() => toggleShoppingItem(item.id)}
                  >
                    <span className="mp-shopping-name">{item.name}</span>
                    <span className="mp-shopping-qty">{item.quantity}</span>
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="mp-pill-btn mp-pill-btn--full"
              onClick={() => onNavigate('courses')}
            >
              {labels.viewFullList} ({shoppingItems.length})
            </button>
          </section>

          {/* Quick Shortcuts */}
          <section className="mp-panel mp-panel--compact">
            <h2 className="mp-panel-title mp-shortcuts-title">
              {labels.quickShortcuts}
            </h2>

            <div className="mp-shortcuts-stack">
              <button
                type="button"
                className="mp-pill-btn mp-pill-btn--icon"
                onClick={() => onNavigate('planning')}
              >
                <CalendarIcon size={17} />
                <span>{labels.planMeal}</span>
              </button>
              <button
                type="button"
                className="mp-pill-btn mp-pill-btn--icon"
                onClick={() => onNavigate('ingredients')}
              >
                <BasketIcon size={17} />
                <span>{labels.manageStock}</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  )

  const renderRecipesView = () => (
    <section className="mp-panel">
      <div className="mp-panel-header">
        <div className="mp-panel-title-wrap">
          <span className="mp-panel-icon">
            <ChefHatIcon size={22} />
          </span>
          <h2 className="mp-panel-title">{labels.nav.recettes}</h2>
        </div>
        <button
          type="button"
          className="mp-panel-link"
          onClick={() => onNavigate('dashboard')}
        >
          ← {labels.nav.dashboard}
        </button>
      </div>

      {filteredRecipes.length === 0 ? (
        <p className="mp-empty-state">{labels.noSearchMatch}</p>
      ) : (
        <div className="mp-recipes-grid">
          {filteredRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="mp-recipe-card"
              onClick={() => setSelectedRecipe(recipe)}
              tabIndex={0}
              role="button"
            >
              <div className="mp-recipe-media">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="mp-recipe-img"
                />
                <span className="mp-recipe-origin">
                  {recipe.origin[language]}
                </span>
              </div>
              <div className="mp-recipe-body">
                <h3 className="mp-recipe-title">{recipe.title}</h3>
                <div className="mp-recipe-footer">
                  <span className="mp-recipe-chip">
                    <ClockIcon size={12} />
                    {recipe.duration}
                  </span>
                  <span className="mp-recipe-chip mp-recipe-chip--tag">
                    {recipe.tag[language]}
                  </span>
                  <span className="mp-recipe-rating">
                    <span className="mp-star">★</span>
                    {recipe.rating}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )

  const renderIngredientsView = () => (
    <section className="mp-panel">
      <div className="mp-panel-header">
        <div className="mp-panel-title-wrap">
          <span className="mp-panel-icon">
            <BasketIcon size={22} />
          </span>
          <h2 className="mp-panel-title">{labels.nav.ingredients}</h2>
        </div>
        <button
          type="button"
          className="mp-panel-link"
          onClick={() => onNavigate('dashboard')}
        >
          ← {labels.nav.dashboard}
        </button>
      </div>

      <div className="mp-subview-grid">
        {stockItems.map((item) => (
          <div key={item.id} className="mp-stock-card">
            <div>
              <div className="mp-stock-name">{item.name}</div>
              <div className="mp-stock-qty">{item.quantity}</div>
            </div>
            <button
              type="button"
              className={`mp-status-badge ${
                item.status === 'En stock'
                  ? 'mp-status-badge--ok'
                  : item.status === 'Stock faible'
                    ? 'mp-status-badge--warn'
                    : 'mp-status-badge--low'
              }`}
              onClick={() => cycleStockStatus(item.id)}
            >
              {item.status}
            </button>
          </div>
        ))}
      </div>
    </section>
  )

  const renderPlanningView = () => (
    <section className="mp-panel">
      <div className="mp-panel-header">
        <div className="mp-panel-title-wrap">
          <span className="mp-panel-icon">
            <CalendarIcon size={22} />
          </span>
          <h2 className="mp-panel-title">{labels.nav.planning}</h2>
        </div>
        <button
          type="button"
          className="mp-panel-link"
          onClick={() => onNavigate('dashboard')}
        >
          ← {labels.nav.dashboard}
        </button>
      </div>

      <form className="mp-plan-form" onSubmit={handlePlanSubmit}>
        <select
          value={newPlanForm.day}
          onChange={(e) =>
            setNewPlanForm((prev) => ({ ...prev, day: e.target.value }))
          }
          className="mp-form-control"
        >
          {weeklyPlan.map((d) => (
            <option key={d.day} value={d.day}>
              {d.day}
            </option>
          ))}
        </select>
        <select
          value={newPlanForm.slot}
          onChange={(e) =>
            setNewPlanForm((prev) => ({ ...prev, slot: e.target.value }))
          }
          className="mp-form-control"
        >
          <option value="lunch">Déjeuner</option>
          <option value="dinner">Dîner</option>
        </select>
        <input
          type="text"
          className="mp-form-control mp-form-control--grow"
          placeholder="Ex: Bowl Buddha au quinoa"
          value={newPlanForm.meal}
          onChange={(e) =>
            setNewPlanForm((prev) => ({ ...prev, meal: e.target.value }))
          }
        />
        <button type="submit" className="mp-pill-btn">
          + Ajouter
        </button>
      </form>

      <div className="mp-planning-table">
        {weeklyPlan.map((row) => (
          <div key={row.day} className="mp-planning-row">
            <div className="mp-planning-day">{row.day}</div>
            <div className="mp-planning-slot">
              <span className="mp-planning-label">Déjeuner :</span> {row.lunch}
            </div>
            <div className="mp-planning-slot">
              <span className="mp-planning-label">Dîner :</span> {row.dinner}
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  const renderShoppingView = () => (
    <section className="mp-panel">
      <div className="mp-panel-header">
        <div className="mp-panel-title-wrap">
          <img src={iconCart} alt="" className="mp-cart-icon-img" />
          <h2 className="mp-panel-title">
            {labels.shoppingTitle} ({shoppingItems.length})
          </h2>
        </div>
        <button
          type="button"
          className="mp-panel-link"
          onClick={() => onNavigate('dashboard')}
        >
          ← {labels.nav.dashboard}
        </button>
      </div>

      <div className="mp-subview-grid">
        {shoppingItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`mp-shopping-row ${
              item.checked ? 'mp-shopping-row--checked' : ''
            }`}
            onClick={() => toggleShoppingItem(item.id)}
          >
            <span className="mp-shopping-name">
              {item.checked ? '✓ ' : ''}
              {item.name}
            </span>
            <span className="mp-shopping-qty">{item.quantity}</span>
          </button>
        ))}
      </div>
    </section>
  )

  const renderProfileView = () => (
    <section className="mp-panel">
      <div className="mp-panel-header">
        <div className="mp-panel-title-wrap">
          <h2 className="mp-panel-title">{labels.nav.profil}</h2>
        </div>
        <button
          type="button"
          className="mp-panel-link"
          onClick={() => onNavigate('dashboard')}
        >
          ← {labels.nav.dashboard}
        </button>
      </div>

      <div className="mp-profile-card">
        <img
          src={DASHBOARD_USER.avatar}
          alt={DASHBOARD_USER.name}
          className="mp-profile-avatar"
        />
        <div className="mp-profile-details">
          <h3>{DASHBOARD_USER.name}</h3>
          <p>{DASHBOARD_USER.role}</p>
          <p>{DASHBOARD_USER.email}</p>
          <div className="mp-profile-badges">
            <span className="mp-meal-tag">{DASHBOARD_USER.dietPreference}</span>
            <span className="mp-meal-tag">
              Objectif : {DASHBOARD_USER.calorieGoal} kcal / jour
            </span>
          </div>
          <button
            type="button"
            className="mp-pill-btn mp-profile-reset-btn"
            onClick={() => {
              if (onOpenResetPassword) {
                onOpenResetPassword();
              } else {
                window.location.href = '/reset-password';
              }
            }}
          >
            Réinitialiser le mot de passe
          </button>
        </div>
      </div>
    </section>
  )

  return (
    <div className="mp-dashboard-shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        onLogout={() => setLogoutModalOpen(true)}
        user={DASHBOARD_USER}
        labels={labels}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="mp-main-area">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          language={language}
          onLanguageChange={setLanguage}
          notifications={NOTIFICATIONS_DATA}
          user={DASHBOARD_USER}
          labels={labels}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onNavigate={onNavigate}
        />

        <main className="mp-main-content">
          {activeTab === 'dashboard' && renderMainDashboard()}
          {activeTab === 'recettes' && renderRecipesView()}
          {activeTab === 'ingredients' && renderIngredientsView()}
          {activeTab === 'planning' && renderPlanningView()}
          {activeTab === 'courses' && renderShoppingView()}
          {activeTab === 'profil' && renderProfileView()}
        </main>
      </div>

      <RecipeModal
        recipe={selectedRecipe}
        language={language}
        onClose={() => setSelectedRecipe(null)}
        onAddToPlan={() => {
          showToast(
            language === 'fr'
              ? `${selectedRecipe?.title} ajouté à votre planning`
              : `${selectedRecipe?.title} added to your plan`
          )
          onNavigate('planning')
        }}
      />

      {logoutModalOpen && (
        <div
          className="mp-modal-overlay"
          onClick={() => setLogoutModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mp-modal-card mp-modal-card--sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mp-modal-body">
              <h2 className="mp-modal-title">Déconnexion</h2>
              <p className="mp-modal-desc">
                Souhaitez-vous quitter votre session tableau de bord MiamPlan ?
              </p>
              <div className="mp-modal-actions">
                <button
                  type="button"
                  className="mp-btn mp-btn--outline"
                  onClick={() => setLogoutModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="mp-btn mp-btn--primary"
                  onClick={() => {
                    setLogoutModalOpen(false)
                    if (onLogout) {
                      onLogout()
                    } else if (externalOnNavigate) {
                      externalOnNavigate('home')
                    } else {
                      window.location.href = '/'
                    }
                  }}
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="mp-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  )
}
