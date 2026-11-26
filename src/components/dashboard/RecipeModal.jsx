import { ClockIcon } from './DashboardIcons'

export default function RecipeModal({ recipe, language, onClose, onAddToPlan }) {
  if (!recipe) return null

  const categoryLabel =
    recipe.origin?.[language] ||
    recipe.category?.[language] ||
    recipe.tag?.[language] ||
    ''

  return (
    <div
      className="mp-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="mp-recipe-modal-title"
    >
      <div className="mp-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="mp-modal-media">
          <img src={recipe.image} alt={recipe.title} className="mp-modal-img" />
          {categoryLabel && <span className="mp-modal-badge">{categoryLabel}</span>}
          <button
            type="button"
            className="mp-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="mp-modal-body">
          <div className="mp-modal-header-row">
            <h2 id="mp-recipe-modal-title" className="mp-modal-title">
              {recipe.title}
            </h2>
            {recipe.rating && <span className="mp-modal-rating">★ {recipe.rating}</span>}
          </div>

          <div className="mp-modal-meta">
            <span className="mp-modal-meta-chip">
              <ClockIcon size={14} /> {recipe.duration}
            </span>
            {recipe.calories && (
              <span className="mp-modal-meta-chip">{recipe.calories}</span>
            )}
            {recipe.servings && (
              <span className="mp-modal-meta-chip">{recipe.servings} pers.</span>
            )}
          </div>

          <p className="mp-modal-desc">{recipe.description}</p>

          <div className="mp-modal-cols">
            <div>
              <h3 className="mp-modal-subtitle">
                {language === 'fr' ? 'Ingrédients' : 'Ingredients'}
              </h3>
              <ul className="mp-modal-list">
                {recipe.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mp-modal-subtitle">
                {language === 'fr' ? 'Préparation' : 'Preparation'}
              </h3>
              <ol className="mp-modal-steps">
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mp-modal-actions">
            <button
              type="button"
              className="mp-btn mp-btn--outline"
              onClick={onClose}
            >
              {language === 'fr' ? 'Fermer' : 'Close'}
            </button>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              onClick={() => {
                onAddToPlan()
                onClose()
              }}
            >
              {language === 'fr' ? 'Planifier ce repas →' : 'Plan this meal →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
