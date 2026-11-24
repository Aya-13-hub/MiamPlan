import React, { useMemo, useState } from "react";
import "./Planning.css";

import logoImg from "./Rectangle 8007 (1).png";
import bellIcon from "./bell 1.png";
import avatarImg from "./Ellipse 151.png";

import couscousImg from "./couscous.png";
import lasagnesImg from "./Lasagnes.png";
import mtewemImg from "./Mtewem.png";
import paellaImg from "./Paella.png";
import pastaImg from "./Pasta.png";
import pizzaPepperoniImg from "./Pizza pepperoni.png";
import poivronFarciImg from "./Poivron farci.png";
import pouletCurryImg from "./Poulet au curry.png";
import ramenImg from "./Ramen.png";
import rechtaImg from "./Rechta.png";
import samosasImg from "./Samosas.png";
import suchiImg from "./Suchi.png";
import tacosImg from "./Tacos.png";
import tortillaImg from "./Tortilla.png";
import deleteTrashIcon from "./Rectangle 8130.png";

import dashboardIcon from "../Ingredients/Rectangle 8042 (1).svg";
import recettesIcon from "../Ingredients/Rectangle 8037.svg";
import ingredientsIcon from "../Ingredients/Rectangle 8039.svg";
import planningIcon from "../Ingredients/Rectangle 8040.svg";
import profilIcon from "../Ingredients/Rectangle 8041.svg";
import logoutIcon from "../Ingredients/Rectangle 8147.svg";

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const INITIAL_MEALS = {
  Dimanche: {
    dejeuner: { tag: "Plat", title: "Mtewem", img: mtewemImg },
    dinner: { tag: "Entrée", title: "Tacos", img: tacosImg },
  },
  Lundi: {
    dejeuner: { tag: "Entrée", title: "Samosas", img: samosasImg },
    dinner: { tag: "Plat", title: "Lasagnes", img: lasagnesImg },
  },
  Mardi: {
    dejeuner: { tag: "Plat", title: "Pasta", img: pastaImg },
    dinner: { tag: "Plat", title: "Ramen", img: ramenImg },
  },
  Mercredi: {
    dejeuner: { tag: "Entrée", title: "Poivron farci", img: poivronFarciImg },
    dinner: { tag: "Plat", title: "Pizza Pepperoni", img: pizzaPepperoniImg },
  },
  Jeudi: {
    dejeuner: { tag: "Plat", title: "Tortilla", img: tortillaImg },
    dinner: { tag: "Plat", title: "Poulet au curry", img: pouletCurryImg },
  },
  Vendredi: {
    dejeuner: { tag: "Plat", title: "Couscous", img: couscousImg },
    dinner: { tag: "Entrée", title: "Sushi", img: suchiImg },
  },
  Samedi: {
    dejeuner: { tag: "Plat", title: "Rechta", img: rechtaImg },
    dinner: { tag: "Plat", title: "Paella", img: paellaImg },
  },
};

const RANDOM_POOL = [
  { tag: "Plat", title: "Mtewem", img: mtewemImg },
  { tag: "Entrée", title: "Tacos", img: tacosImg },
  { tag: "Entrée", title: "Samosas", img: samosasImg },
  { tag: "Plat", title: "Lasagnes", img: lasagnesImg },
  { tag: "Plat", title: "Pasta", img: pastaImg },
  { tag: "Plat", title: "Ramen", img: ramenImg },
  { tag: "Entrée", title: "Poivron farci", img: poivronFarciImg },
  { tag: "Plat", title: "Pizza Pepperoni", img: pizzaPepperoniImg },
  { tag: "Plat", title: "Tortilla", img: tortillaImg },
  { tag: "Plat", title: "Poulet au curry", img: pouletCurryImg },
  { tag: "Plat", title: "Couscous", img: couscousImg },
  { tag: "Entrée", title: "Sushi", img: suchiImg },
  { tag: "Plat", title: "Rechta", img: rechtaImg },
  { tag: "Plat", title: "Paella", img: paellaImg },
];

const EMPTY_RECIPE_FORM = {
  nom: "",
  imagePreview: "",
  types: [],
  temps: "30",
  calories: "1 kcal",
  regimes: [],
  allergies: [],
  methode:
    "1-Préchauffez le four à 240 °C\n2-Mélangez la farine, la levure, le sel et le sucre\n3- ...",
  ingredients: [
    { id: 1, qty: "250", unit: "g", name: "Farine T55" },
    { id: 2, qty: "250", unit: "g", name: "Farine T55" },
    { id: 3, qty: "250", unit: "g", name: "Farine T55" },
  ],
  rating: 0,
  commentaire: "",
};

function CoursesNavIcon() {
  return (
    <svg
      className="mp-plan-nav-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FFFFFF"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 9h14l-1.5 9.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 9Z" />
      <path d="M8.5 9l2.5-4.5M15.5 9L13 4.5M10 13v4M14 13v4" />
    </svg>
  );
}

function RefreshSmallIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B5B2A"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  );
}

function LunchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B5B2A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function DinnerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="#0B5B2A"
      stroke="#0B5B2A"
      strokeWidth="1.5"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B5B2A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0B5B2A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

export default function Planning() {
  const [activeNav, setActiveNav] = useState("planning");
  const [mode, setMode] = useState("aleatoire");
  const [meals, setMeals] = useState(INITIAL_MEALS);
  const [manualMeals, setManualMeals] = useState({});
  const [targetSlot, setTargetSlot] = useState(null); // { day, slot }
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [recipeForm, setRecipeForm] = useState(EMPTY_RECIPE_FORM);
  const [options, setOptions] = useState({
    entree: true,
    plat: true,
    dessert: false,
    vegetarien: false,
  });

  const navItems = useMemo(
    () => [
      { id: "dashboard", label: "Tableau de bord", img: dashboardIcon },
      { id: "recettes", label: "Recettes", img: recettesIcon },
      { id: "ingredients", label: "Ingrédients", img: ingredientsIcon },
      { id: "planning", label: "Planning", img: planningIcon },
      { id: "courses", label: "Liste des courses", customIcon: <CoursesNavIcon /> },
      { id: "profil", label: "Mon profil", img: profilIcon },
    ],
    []
  );

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const replaceMeal = (day, slot) => {
    setMeals((prev) => {
      const currentTitle = prev[day][slot]?.title;
      const candidates = RANDOM_POOL.filter((m) => m.title !== currentTitle);
      const pick =
        candidates[Math.floor(Math.random() * candidates.length)] || RANDOM_POOL[0];
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: { ...pick },
        },
      };
    });
  };

  const regenerateAll = () => {
    const next = {};
    DAYS.forEach((day, idx) => {
      const dItem = RANDOM_POOL[(idx * 2) % RANDOM_POOL.length];
      const nItem = RANDOM_POOL[(idx * 2 + 1) % RANDOM_POOL.length];
      next[day] = {
        dejeuner: { ...dItem },
        dinner: { ...nItem },
      };
    });
    setMeals(next);
  };

  const openAddRecipeForSlot = (day, slot) => {
    setTargetSlot({ day, slot });
    setRecipeForm(EMPTY_RECIPE_FORM);
    setShowAddRecipe(true);
  };

  const toggleArrayField = (field, value) => {
    setRecipeForm((prev) => {
      const exists = prev[field].includes(value);
      return {
        ...prev,
        [field]: exists
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
    });
  };

  const handleImageFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRecipeForm((prev) => ({ ...prev, imagePreview: url }));
  };

  const handleAddIngredientRow = () => {
    setRecipeForm((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { id: Date.now(), qty: "100", unit: "g", name: "" },
      ],
    }));
  };

  const handleIngredientChange = (id, key, val) => {
    setRecipeForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, [key]: val } : ing
      ),
    }));
  };

  const handleDeleteIngredient = (id) => {
    setRecipeForm((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((ing) => ing.id !== id),
    }));
  };

  const handleSaveRecipe = (e) => {
    e.preventDefault();
    if (!targetSlot) return;

    const cleanTitle = recipeForm.nom.trim() || "Nouvelle recette";
    const chosenTag = recipeForm.types[0] || "Plat";
    const chosenImg = recipeForm.imagePreview || mtewemImg;

    setManualMeals((prev) => ({
      ...prev,
      [targetSlot.day]: {
        ...(prev[targetSlot.day] || {}),
        [targetSlot.slot]: {
          tag: chosenTag,
          title: cleanTitle,
          img: chosenImg,
        },
      },
    }));

    setShowAddRecipe(false);
    setTargetSlot(null);
  };

  const handleCancelRecipe = () => {
    setShowAddRecipe(false);
    setTargetSlot(null);
  };

  const handleClearManualMeal = (day, slot) => {
    setManualMeals((prev) => {
      const updatedDay = { ...(prev[day] || {}) };
      delete updatedDay[slot];
      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

  const renderSlotContent = (day, slotKey) => {
    if (mode === "aleatoire") {
      const item = meals[day][slotKey];
      return (
        <div className="mp-plan-meal-card">
          <div className="mp-plan-img-wrap">
            <span className="mp-plan-meal-badge">{item.tag}</span>
            <img src={item.img} alt={item.title} className="mp-plan-meal-img" />
          </div>
          <div className="mp-plan-meal-footer">
            <span className="mp-plan-meal-name">{item.title}</span>
            <button
              type="button"
              className="mp-plan-refresh-btn"
              onClick={() => replaceMeal(day, slotKey)}
              title="Changer le repas"
            >
              <RefreshSmallIcon />
            </button>
          </div>
        </div>
      );
    }

    const manualItem = manualMeals[day]?.[slotKey];
    if (manualItem) {
      return (
        <div className="mp-plan-meal-card">
          <div className="mp-plan-img-wrap">
            <span className="mp-plan-meal-badge">{manualItem.tag}</span>
            <img
              src={manualItem.img}
              alt={manualItem.title}
              className="mp-plan-meal-img"
            />
          </div>
          <div className="mp-plan-meal-footer">
            <span className="mp-plan-meal-name">{manualItem.title}</span>
            <button
              type="button"
              className="mp-plan-refresh-btn"
              onClick={() => handleClearManualMeal(day, slotKey)}
              title="Retirer le repas"
            >
              ✕
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        className="mp-plan-manual-add-card"
        onClick={() => openAddRecipeForSlot(day, slotKey)}
      >
        + Ajouter
      </button>
    );
  };

  return (
    <div className="mp-plan-layout">
      <aside className="mp-plan-sidebar">
        <div>
          <div className="mp-plan-brand-box">
            <img src={logoImg} alt="MiamPlan" className="mp-plan-logo-img" />
          </div>

          <nav className="mp-plan-nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mp-plan-nav-btn ${
                  activeNav === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveNav(item.id);
                  setShowAddRecipe(false);
                }}
              >
                {item.customIcon ? (
                  item.customIcon
                ) : (
                  <img src={item.img} alt="" className="mp-plan-nav-icon" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mp-plan-sidebar-footer">
          <div className="mp-plan-user">
            <img src={avatarImg} alt="Noura BILLALI" className="mp-plan-avatar" />
            <div>
              <div className="mp-plan-user-name">Noura BILLALI</div>
              <div className="mp-plan-user-role">Utilisateur</div>
            </div>
          </div>

          <button type="button" className="mp-plan-logout">
            <img src={logoutIcon} alt="" className="mp-plan-logout-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {showAddRecipe ? (
        <main className="mp-plan-main mp-rec-main">
          <div className="mp-rec-header">
            <div>
              <h1 className="mp-rec-title">Ajouter une recette</h1>
              <p className="mp-rec-subtitle">
                Créez, personnalisez et cuisinez vos plats préférés
              </p>
            </div>

            <button
              type="button"
              className="mp-rec-back-btn"
              onClick={handleCancelRecipe}
            >
              ← Retour aux recettes
            </button>
          </div>

          <form className="mp-rec-form-grid" onSubmit={handleSaveRecipe}>
            <div className="mp-rec-left-col">
              <div
                className="mp-rec-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleImageFile(e.dataTransfer.files?.[0]);
                }}
              >
                {recipeForm.imagePreview ? (
                  <img
                    src={recipeForm.imagePreview}
                    alt="Aperçu"
                    className="mp-rec-preview-img"
                  />
                ) : (
                  <>
                    <div className="mp-rec-drop-icon">🖼️</div>
                    <div className="mp-rec-drop-title">
                      Glissez une image ici
                    </div>
                    <div className="mp-rec-drop-sub">
                      JPG ou PNG, 5 Mo maximum
                    </div>
                  </>
                )}

                <label className="mp-rec-browse-btn">
                  Parcourir
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    hidden
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                  />
                </label>
              </div>

              <div className="mp-rec-field">
                <label className="mp-rec-label">Méthode</label>
                <textarea
                  className="mp-rec-textarea"
                  rows={5}
                  value={recipeForm.methode}
                  onChange={(e) =>
                    setRecipeForm((prev) => ({
                      ...prev,
                      methode: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="mp-rec-rating-box">
                <div className="mp-rec-rating-title">Noter cette recette</div>
                <div className="mp-rec-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`mp-rec-star ${
                        star <= recipeForm.rating ? "active" : ""
                      }`}
                      onClick={() =>
                        setRecipeForm((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>

                <div className="mp-rec-comment-pill">
                  <span>💬</span>
                  <input
                    type="text"
                    placeholder="Votre avis en commentaire"
                    value={recipeForm.commentaire}
                    onChange={(e) =>
                      setRecipeForm((prev) => ({
                        ...prev,
                        commentaire: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mp-rec-right-col">
              <div className="mp-rec-field">
                <label className="mp-rec-label">Nom de la recette</label>
                <input
                  type="text"
                  className="mp-rec-input-pill"
                  value={recipeForm.nom}
                  onChange={(e) =>
                    setRecipeForm((prev) => ({ ...prev, nom: e.target.value }))
                  }
                />
              </div>

              <div className="mp-rec-field">
                <label className="mp-rec-label">Type de plat</label>
                <div className="mp-rec-pills-row">
                  {["Entrée", "Plat", "Dessert", "Végétarien"].map((type) => (
                    <label key={type} className="mp-rec-chip">
                      <input
                        type="checkbox"
                        checked={recipeForm.types.includes(type)}
                        onChange={() => toggleArrayField("types", type)}
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mp-rec-two-cols">
                <div className="mp-rec-field">
                  <label className="mp-rec-label">Temps (min)</label>
                  <input
                    type="text"
                    className="mp-rec-input-pill mp-rec-short-input"
                    value={recipeForm.temps}
                    onChange={(e) =>
                      setRecipeForm((prev) => ({
                        ...prev,
                        temps: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="mp-rec-field">
                  <label className="mp-rec-label">Calories</label>
                  <input
                    type="text"
                    className="mp-rec-input-pill mp-rec-short-input"
                    value={recipeForm.calories}
                    onChange={(e) =>
                      setRecipeForm((prev) => ({
                        ...prev,
                        calories: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="mp-rec-field">
                <label className="mp-rec-label">Régime</label>
                <div className="mp-rec-pills-row">
                  {["Vegan", "Sans Gluten", "Sans Lactose"].map((reg) => (
                    <label key={reg} className="mp-rec-chip">
                      <input
                        type="checkbox"
                        checked={recipeForm.regimes.includes(reg)}
                        onChange={() => toggleArrayField("regimes", reg)}
                      />
                      <span>{reg}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mp-rec-field">
                <label className="mp-rec-label">Allergies</label>
                <div className="mp-rec-pills-row">
                  {["Arachides", "Glutten", "Lait", "Oeuf", "Poisson"].map(
                    (allergy) => (
                      <label key={allergy} className="mp-rec-chip">
                        <input
                          type="checkbox"
                          checked={recipeForm.allergies.includes(allergy)}
                          onChange={() =>
                            toggleArrayField("allergies", allergy)
                          }
                        />
                        <span>{allergy}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="mp-rec-field">
                <label className="mp-rec-label">Ingrédients</label>
                <div className="mp-rec-ing-list">
                  {recipeForm.ingredients.map((ing) => (
                    <div key={ing.id} className="mp-rec-ing-row">
                      <input
                        type="text"
                        className="mp-rec-ing-qty"
                        value={ing.qty}
                        onChange={(e) =>
                          handleIngredientChange(ing.id, "qty", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="mp-rec-ing-unit"
                        value={ing.unit}
                        onChange={(e) =>
                          handleIngredientChange(ing.id, "unit", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        className="mp-rec-ing-name"
                        value={ing.name}
                        onChange={(e) =>
                          handleIngredientChange(ing.id, "name", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        className="mp-rec-ing-del"
                        onClick={() => handleDeleteIngredient(ing.id)}
                        title="Supprimer"
                      >
                        <img src={deleteTrashIcon} alt="Supprimer" className="mp-rec-trash-img" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="mp-rec-add-ing-btn"
                  onClick={handleAddIngredientRow}
                >
                  + Ajouter un ingrédient
                </button>
              </div>

              <div className="mp-rec-footer-actions">
                <button
                  type="button"
                  className="mp-rec-cancel-btn"
                  onClick={handleCancelRecipe}
                >
                  Annuler
                </button>
                <button type="submit" className="mp-rec-save-btn">
                  Enregistrer la recette
                </button>
              </div>
            </div>
          </form>
        </main>
      ) : (
        <main className="mp-plan-main">
          <div className="mp-plan-top-bar">
            <div>
              <h1 className="mp-plan-title">Planning Hebdomadaire</h1>
              <p className="mp-plan-subtitle">
                Visualisez et composez les repas de chaque jour de votre semaine
              </p>
            </div>

            <div className="mp-plan-top-actions">
              <button
                type="button"
                className="mp-plan-bell-btn"
                aria-label="Notifications"
              >
                <img src={bellIcon} alt="" className="mp-plan-bell-icon" />
              </button>
              <img src={avatarImg} alt="Profil" className="mp-plan-top-avatar" />
            </div>
          </div>

          <div className="mp-plan-week-bar">
            <button type="button" className="mp-plan-week-nav">
              &lt; &nbsp; Semaine précédente
            </button>
            <div className="mp-plan-week-label">
              Semaine du 20 - 26 Novembre 2026
            </div>
            <button type="button" className="mp-plan-week-nav">
              Semaine suivante &nbsp; &gt;
            </button>
          </div>

          <div className="mp-plan-mode-switch">
            <button
              type="button"
              className={`mp-plan-mode-btn ${
                mode === "aleatoire" ? "active" : ""
              }`}
              onClick={() => setMode("aleatoire")}
            >
              Planning aléatoire
            </button>
            <button
              type="button"
              className={`mp-plan-mode-btn ${
                mode === "manuel" ? "active" : ""
              }`}
              onClick={() => setMode("manuel")}
            >
              Planning manuel
            </button>
          </div>

          {mode === "aleatoire" && (
            <div className="mp-plan-options-bar">
              <div className="mp-plan-options-left">
                <span className="mp-plan-options-label">Option:</span>

                <label className="mp-plan-check-pill">
                  <input
                    type="checkbox"
                    checked={options.entree}
                    onChange={() => toggleOption("entree")}
                  />
                  <span className="mp-plan-custom-check" />
                  <span>Entrée</span>
                </label>

                <label className="mp-plan-check-pill">
                  <input
                    type="checkbox"
                    checked={options.plat}
                    onChange={() => toggleOption("plat")}
                  />
                  <span className="mp-plan-custom-check" />
                  <span>Plat</span>
                </label>

                <label className="mp-plan-check-pill">
                  <input
                    type="checkbox"
                    checked={options.dessert}
                    onChange={() => toggleOption("dessert")}
                  />
                  <span className="mp-plan-custom-check" />
                  <span>Dessert</span>
                </label>

                <label className="mp-plan-check-pill">
                  <input
                    type="checkbox"
                    checked={options.vegetarien}
                    onChange={() => toggleOption("vegetarien")}
                  />
                  <span className="mp-plan-custom-check" />
                  <span>Végétarien</span>
                </label>
              </div>

              <button
                type="button"
                className="mp-plan-generate-btn"
                onClick={regenerateAll}
              >
                Générer un planning aléatoire
              </button>
            </div>
          )}

          <div className="mp-plan-utility-icons">
            <button type="button" className="mp-plan-util-btn" title="Partager">
              <ShareIcon />
            </button>
            <button
              type="button"
              className="mp-plan-util-btn"
              title="Imprimer"
              onClick={() => window.print()}
            >
              <PrintIcon />
            </button>
          </div>

          <div className="mp-plan-days-grid">
            {DAYS.map((day) => (
              <section key={day} className="mp-plan-day-col">
                <h2 className="mp-plan-day-title">{day}</h2>

                <div className="mp-plan-slot-header">
                  <LunchIcon />
                  <span>Déjeuner</span>
                </div>
                {renderSlotContent(day, "dejeuner")}

                <div className="mp-plan-slot-header">
                  <DinnerIcon />
                  <span>Dinner</span>
                </div>
                {renderSlotContent(day, "dinner")}
              </section>
            ))}
          </div>

          {mode === "aleatoire" && (
            <div className="mp-plan-bottom-bar">
              <button
                type="button"
                className="mp-plan-generate-btn"
                onClick={regenerateAll}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                  <polyline points="21 3 21 9 15 9" />
                </svg>
                <span>Régénérer un planning aléatoire</span>
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}