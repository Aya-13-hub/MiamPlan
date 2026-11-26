import { useState } from 'react'
import AppShell from '../layouts/AppShell'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ImagePlusIcon,
  PlusIcon,
  SaveIcon,
  TrashIcon,
  XIcon,
} from '../components/dashboard/DashboardIcons'
import { CATEGORIES_DATA, DEFAULT_RECIPE_IMAGE } from '../data/recipesData'
import './Recipes.css'

const DIETARY_OPTIONS = [
  'Végétarien',
  'Vegan',
  'Sans gluten',
  'Sans lactose',
  'Halal',
]
const DIFFICULTY_OPTIONS = ['Facile', 'Moyen', 'Difficile']

export default function AddRecipe({ onAddRecipe, onNavigate, onLogout }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    calories: '',
    difficulty: 'Facile',
    tags: [],
    description: '',
    ingredients: [{ name: '', quantity: '', unit: '' }],
    steps: [''],
  })

  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)

  const goTo = (path) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      window.history.pushState({}, '', path)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const updateIngredient = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.ingredients]
      updated[idx] = { ...updated[idx], [field]: value }
      return { ...prev, ingredients: updated }
    })
    setErrors((prev) => ({ ...prev, ingredients: undefined }))
  }

  const addIngredient = () => {
    setForm((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }],
    }))
  }

  const removeIngredient = (idx) => {
    setForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== idx),
    }))
  }

  const updateStep = (idx, value) => {
    setForm((prev) => {
      const updated = [...prev.steps]
      updated[idx] = value
      return { ...prev, steps: updated }
    })
    setErrors((prev) => ({ ...prev, steps: undefined }))
  }

  const addStep = () => {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ''] }))
  }

  const removeStep = (idx) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx),
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Le nom est requis.'
    if (!form.category) errs.category = 'Choisissez une catégorie.'
    if (!form.prepTime) errs.prepTime = 'Durée de préparation requise.'
    if (!form.servings) errs.servings = 'Nombre de portions requis.'
    if (form.ingredients.some((i) => !i.name.trim())) {
      errs.ingredients = 'Tous les ingrédients doivent avoir un nom.'
    }
    if (form.steps.some((s) => !s.trim())) {
      errs.steps = 'Toutes les étapes doivent être renseignées.'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const newRecipe = {
      id: Date.now(),
      slug: `recipe-${Date.now()}`,
      title: form.title.trim(),
      category: form.category,
      prepTime: Number(form.prepTime) || 0,
      cookTime: Number(form.cookTime) || 0,
      servings: Number(form.servings) || 1,
      calories: form.calories ? Number(form.calories) : 420,
      rating: 5.0,
      isFavorite: false,
      difficulty: form.difficulty,
      tags: form.tags,
      description:
        form.description.trim() ||
        `Recette maison : ${form.title.trim()} (${form.category}).`,
      image: imagePreview || DEFAULT_RECIPE_IMAGE,
      ingredients: form.ingredients.map((i) => ({
        name: i.name.trim(),
        quantity: i.quantity || '',
        unit: i.unit.trim(),
      })),
      steps: form.steps.map((s) => s.trim()),
    }

    onAddRecipe?.(newRecipe)
    setSaved(true)
    window.setTimeout(() => goTo('/app/recipes'), 1400)
  }

  if (saved) {
    return (
      <AppShell activeTab="recettes" onNavigate={onNavigate} onLogout={onLogout}>
        <div className="mp-saved-banner">
          <CheckCircleIcon size={54} />
          <h2 className="mp-rpage-title">Recette enregistrée !</h2>
          <p className="mp-rpage-subtitle">Redirection vers vos recettes…</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell activeTab="recettes" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="mp-add-recipe-page">
        <button
          type="button"
          className="mp-back-link"
          onClick={() => goTo('/app/recipes')}
        >
          <ArrowLeftIcon size={16} />
          <span>Retour aux recettes</span>
        </button>

        <div className="mp-rpage-header">
          <div>
            <h1 className="mp-rpage-title">Ajouter une recette</h1>
            <p className="mp-rpage-subtitle">
              Créez, personnalisez et cuisinez vos plats préférés. Les champs
              marqués * sont obligatoires.
            </p>
          </div>
          <div className="mp-rpage-actions">
            <button
              type="button"
              className="mp-rbtn mp-rbtn--ghost"
              onClick={() => goTo('/app/recipes')}
            >
              <XIcon size={16} />
              <span>Annuler</span>
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulaire d'ajout de recette"
        >
          <div className="mp-add-form-grid">
            {/* Left Column */}
            <div className="mp-add-col">
              <div className="mp-rwidget">
                <h2 className="mp-rwidget-title">
                  Photo de la recette{' '}
                  <span className="mp-rwidget-meta">(facultatif)</span>
                </h2>
                <label className="mp-upload-zone" htmlFor="mp-recipe-image">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Aperçu de la recette"
                      className="mp-upload-preview"
                    />
                  ) : (
                    <>
                      <ImagePlusIcon size={34} />
                      <span>Cliquez pour choisir une image</span>
                      <span className="mp-rwidget-meta">JPG, PNG, WEBP</span>
                    </>
                  )}
                </label>
                <input
                  id="mp-recipe-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
              </div>

              <div className="mp-rwidget">
                <h2 className="mp-rwidget-title">Informations générales</h2>

                <div className="mp-form-group">
                  <label className="mp-form-label" htmlFor="mp-recipe-title">
                    Nom de la recette <span className="mp-form-req">*</span>
                  </label>
                  <input
                    id="mp-recipe-title"
                    type="text"
                    className={`mp-input ${errors.title ? 'mp-input--error' : ''}`}
                    placeholder="Ex : Pizza Pepperoni"
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    aria-required="true"
                  />
                  {errors.title && (
                    <span className="mp-form-error" role="alert">
                      {errors.title}
                    </span>
                  )}
                </div>

                <div className="mp-form-group">
                  <label className="mp-form-label" htmlFor="mp-recipe-category">
                    Catégorie <span className="mp-form-req">*</span>
                  </label>
                  <select
                    id="mp-recipe-category"
                    className={`mp-select ${
                      errors.category ? 'mp-input--error' : ''
                    }`}
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    aria-required="true"
                  >
                    <option value="">— Choisir une catégorie —</option>
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="mp-form-error" role="alert">
                      {errors.category}
                    </span>
                  )}
                </div>

                <div className="mp-form-group">
                  <label className="mp-form-label" htmlFor="mp-recipe-desc">
                    Description{' '}
                    <span className="mp-rwidget-meta">(facultatif)</span>
                  </label>
                  <textarea
                    id="mp-recipe-desc"
                    rows={2}
                    className="mp-textarea"
                    placeholder="Décrivez brièvement votre plat…"
                    value={form.description}
                    onChange={(e) => setField('description', e.target.value)}
                  />
                </div>

                <div className="mp-form-2col">
                  <div className="mp-form-group">
                    <label className="mp-form-label" htmlFor="mp-recipe-prep">
                      Préparation (min) <span className="mp-form-req">*</span>
                    </label>
                    <input
                      id="mp-recipe-prep"
                      type="number"
                      min="0"
                      className={`mp-input ${
                        errors.prepTime ? 'mp-input--error' : ''
                      }`}
                      placeholder="15"
                      value={form.prepTime}
                      onChange={(e) => setField('prepTime', e.target.value)}
                      aria-required="true"
                    />
                    {errors.prepTime && (
                      <span className="mp-form-error" role="alert">
                        {errors.prepTime}
                      </span>
                    )}
                  </div>

                  <div className="mp-form-group">
                    <label className="mp-form-label" htmlFor="mp-recipe-cook">
                      Cuisson (min)
                    </label>
                    <input
                      id="mp-recipe-cook"
                      type="number"
                      min="0"
                      className="mp-input"
                      placeholder="30"
                      value={form.cookTime}
                      onChange={(e) => setField('cookTime', e.target.value)}
                    />
                  </div>

                  <div className="mp-form-group">
                    <label className="mp-form-label" htmlFor="mp-recipe-servings">
                      Portions <span className="mp-form-req">*</span>
                    </label>
                    <input
                      id="mp-recipe-servings"
                      type="number"
                      min="1"
                      className={`mp-input ${
                        errors.servings ? 'mp-input--error' : ''
                      }`}
                      placeholder="4"
                      value={form.servings}
                      onChange={(e) => setField('servings', e.target.value)}
                      aria-required="true"
                    />
                    {errors.servings && (
                      <span className="mp-form-error" role="alert">
                        {errors.servings}
                      </span>
                    )}
                  </div>

                  <div className="mp-form-group">
                    <label className="mp-form-label" htmlFor="mp-recipe-cal">
                      Calories (kcal)
                    </label>
                    <input
                      id="mp-recipe-cal"
                      type="number"
                      min="0"
                      className="mp-input"
                      placeholder="450"
                      value={form.calories}
                      onChange={(e) => setField('calories', e.target.value)}
                    />
                  </div>
                </div>

                <div className="mp-form-group">
                  <span className="mp-form-label">Difficulté</span>
                  <div className="mp-rfilter-pills">
                    {DIFFICULTY_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`mp-rpill ${
                          form.difficulty === d ? 'mp-rpill--active' : ''
                        }`}
                        onClick={() => setField('difficulty', d)}
                        aria-pressed={form.difficulty === d}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mp-form-group">
                  <span className="mp-form-label">
                    Régimes & allergènes{' '}
                    <span className="mp-rwidget-meta">(facultatif)</span>
                  </span>
                  <div className="mp-rfilter-pills">
                    {DIETARY_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`mp-rpill ${
                          form.tags.includes(tag) ? 'mp-rpill--active' : ''
                        }`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={form.tags.includes(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="mp-add-col">
              <div className="mp-rwidget">
                <div className="mp-rwidget-header">
                  <h2 className="mp-rwidget-title">
                    Ingrédients <span className="mp-form-req">*</span>
                  </h2>
                  <span className="mp-rwidget-meta">
                    {form.ingredients.length} article(s)
                  </span>
                </div>
                {errors.ingredients && (
                  <span className="mp-form-error" role="alert">
                    {errors.ingredients}
                  </span>
                )}

                {form.ingredients.map((ing, idx) => (
                  <div key={idx} className="mp-add-ing-row">
                    <input
                      type="text"
                      className="mp-input"
                      placeholder="Nom de l'ingrédient"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(idx, 'name', e.target.value)
                      }
                      aria-label={`Ingrédient ${idx + 1} nom`}
                    />
                    <input
                      type="number"
                      min="0"
                      className="mp-input"
                      placeholder="Qté"
                      value={ing.quantity}
                      onChange={(e) =>
                        updateIngredient(idx, 'quantity', e.target.value)
                      }
                      aria-label={`Ingrédient ${idx + 1} quantité`}
                    />
                    <input
                      type="text"
                      className="mp-input"
                      placeholder="Unité"
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(idx, 'unit', e.target.value)
                      }
                      aria-label={`Ingrédient ${idx + 1} unité`}
                    />
                    <button
                      type="button"
                      className="mp-rbtn mp-rbtn--ghost mp-rbtn--icon"
                      onClick={() => removeIngredient(idx)}
                      disabled={form.ingredients.length === 1}
                      aria-label={`Supprimer l'ingrédient ${idx + 1}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="mp-rbtn mp-rbtn--secondary mp-rbtn--sm"
                  onClick={addIngredient}
                >
                  <PlusIcon size={14} />
                  <span>Ajouter un ingrédient</span>
                </button>
              </div>

              <div className="mp-rwidget">
                <div className="mp-rwidget-header">
                  <h2 className="mp-rwidget-title">
                    Étapes de préparation <span className="mp-form-req">*</span>
                  </h2>
                  <span className="mp-rwidget-meta">
                    {form.steps.length} étape(s)
                  </span>
                </div>
                {errors.steps && (
                  <span className="mp-form-error" role="alert">
                    {errors.steps}
                  </span>
                )}

                {form.steps.map((step, idx) => (
                  <div key={idx} className="mp-add-step-row">
                    <span className="mp-add-step-badge" aria-hidden="true">
                      {idx + 1}
                    </span>
                    <textarea
                      rows={2}
                      className="mp-textarea"
                      placeholder={`Étape ${idx + 1}…`}
                      value={step}
                      onChange={(e) => updateStep(idx, e.target.value)}
                      aria-label={`Étape ${idx + 1}`}
                    />
                    <button
                      type="button"
                      className="mp-rbtn mp-rbtn--ghost mp-rbtn--icon"
                      onClick={() => removeStep(idx)}
                      disabled={form.steps.length === 1}
                      aria-label={`Supprimer l'étape ${idx + 1}`}
                    >
                      <TrashIcon size={15} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="mp-rbtn mp-rbtn--secondary mp-rbtn--sm"
                  onClick={addStep}
                >
                  <PlusIcon size={14} />
                  <span>Ajouter une étape</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mp-add-actions">
            <button
              type="button"
              className="mp-rbtn mp-rbtn--ghost"
              onClick={() => goTo('/app/recipes')}
            >
              Annuler
            </button>
            <button type="submit" className="mp-rbtn mp-rbtn--primary">
              <SaveIcon size={16} />
              <span>Enregistrer la recette</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
