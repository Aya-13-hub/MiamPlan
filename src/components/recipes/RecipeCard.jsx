import { useState } from 'react'
import {
  ClockIcon,
  HeartIcon,
  StarIcon,
  UsersIcon,
} from '../dashboard/DashboardIcons'
import './RecipeCard.css'

export default function RecipeCard({ recipe, onSelect, onToggleFavorite }) {
  const [localLiked, setLocalLiked] = useState(Boolean(recipe?.isFavorite))

  if (!recipe) return null

  const isLiked =
    typeof recipe.isFavorite === 'boolean' && onToggleFavorite
      ? recipe.isFavorite
      : localLiked

  const totalTime = (Number(recipe.prepTime) || 0) + (Number(recipe.cookTime) || 0)

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(recipe)
    } else {
      window.history.pushState({}, '', `/app/recipes/${recipe.id}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const handleFavClick = (e) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(recipe.id)
    } else {
      setLocalLiked((prev) => !prev)
    }
  }

  return (
    <article
      className="mp-rcard"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={recipe.title}
    >
      <div className="mp-rcard__image-wrap">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="mp-rcard__image"
          loading="lazy"
        />

        <span className="mp-rcard__category">{recipe.category}</span>

        <button
          type="button"
          className={`mp-rcard__fav ${isLiked ? 'mp-rcard__fav--active' : ''}`}
          aria-label={isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={isLiked}
          onClick={handleFavClick}
        >
          <HeartIcon size={17} filled={isLiked} />
        </button>
      </div>

      <div className="mp-rcard__body">
        <h3 className="mp-rcard__title">{recipe.title}</h3>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mp-rcard__tags">
            {recipe.tags.map((tag) => (
              <span key={tag} className="mp-rcard__tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mp-rcard__meta">
          <span className="mp-rcard__meta-item">
            <ClockIcon size={14} />
            <span>{totalTime} min</span>
          </span>
          <span className="mp-rcard__meta-item">
            <UsersIcon size={14} />
            <span>{recipe.servings} pers.</span>
          </span>
          <span className="mp-rcard__meta-item mp-rcard__rating">
            <StarIcon size={14} />
            <span>{recipe.rating}</span>
          </span>
        </div>
      </div>
    </article>
  )
}
