import React, { useMemo, useState } from "react";
import "./Ingredients.css";

import logoImg from "./Rectangle 8007.png";
import dashboardIcon from "./Rectangle 8042 (1).svg";
import recettesIcon from "./Rectangle 8037.svg";
import ingredientsIcon from "./Rectangle 8039.svg";
import planningIcon from "./Rectangle 8040.svg";
import profilIcon from "./Rectangle 8041.svg";

import avatarImg from "./Ellipse 150.png";
import logoutIcon from "./Rectangle 8147.svg";
import checkTotalIcon from "./Rectangle 8144.png";
import checkStockIcon from "./Rectangle 8143.png";
import alertOutIcon from "./Rectangle 8145.png";

const CATEGORIES = [
  "Tous",
  "Céréales",
  "Fruits",
  "Légumes",
  "Légumineuses",
  "Epicerie",
  "Poisson",
  "Fromage",
  "Produits laitiers",
];

const INITIAL_INGREDIENTS = [
  { id: 1, name: "Quinoa", category: "Céréales", status: "En stock" },
  { id: 2, name: "Avocat", category: "Fruits", status: "Epuisé" },
  { id: 3, name: "Lentille corail", category: "Légumineuses", status: "En stock" },
  { id: 4, name: "Saumon", category: "Poisson", status: "En stock" },
  { id: 5, name: "Tomates cerises", category: "Légumes", status: "Epuisé" },
  { id: 6, name: "Riz arborio", category: "Céréales", status: "Epuisé" },
  { id: 7, name: "Parmesan", category: "Fromage", status: "En stock" },
  { id: 8, name: "Oranges", category: "Fruits", status: "Epuisé" },
  { id: 9, name: "Carottes", category: "Légumes", status: "En stock" },
];

function CoursesIcon() {
  return (
    <svg
      className="mp-ing-nav-icon"
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

export default function Ingredients({ onNavigate, onLogout } = {}) {
  const [activeNav, setActiveNav] = useState("ingredients");
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [shoppingList, setShoppingList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Légumes");
  const [newStatus, setNewStatus] = useState("En stock");

  const stats = useMemo(() => {
    const total = ingredients.length;
    const inStock = ingredients.filter((i) => i.status === "En stock").length;
    const outOfStock = ingredients.filter((i) => i.status === "Epuisé").length;
    return { total, inStock, outOfStock };
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ingredients.filter((item) => {
      const matchCat =
        selectedCategory === "Tous" || item.category === selectedCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [ingredients, selectedCategory, searchQuery]);

  const toggleStatus = (id) => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "En stock" ? "Epuisé" : "En stock",
            }
          : item
      )
    );
  };

  const handleAddToCourses = (item) => {
    setShoppingList((prev) =>
      prev.some((x) => x.id === item.id) ? prev : [...prev, item]
    );
  };

  const handleCreateIngredient = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIngredients((prev) => [
      {
        id: Date.now(),
        name: newName.trim(),
        category: newCategory,
        status: newStatus,
      },
      ...prev,
    ]);
    setNewName("");
    setIsModalOpen(false);
  };

  const navItems = [
    { id: "dashboard", label: "Tableau de bord", img: dashboardIcon },
    { id: "recettes", label: "Recettes", img: recettesIcon },
    { id: "ingredients", label: "Ingrédients", img: ingredientsIcon },
    { id: "planning", label: "Planning", img: planningIcon },
    { id: "courses", label: "Liste des courses", customIcon: <CoursesIcon /> },
    { id: "profil", label: "Mon profil", img: profilIcon },
  ];

  return (
    <div className="mp-ing-layout">
      <aside className="mp-ing-sidebar">
        <div>
          <div className="mp-ing-brand-box">
            <img src={logoImg} alt="MiamPlan" className="mp-ing-logo-img" />
          </div>

          <nav className="mp-ing-nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mp-ing-nav-btn ${
                  activeNav === item.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveNav(item.id);
                  if (onNavigate && item.id !== "ingredients") {
                    onNavigate(item.id);
                  }
                }}
              >
                {item.customIcon ? (
                  item.customIcon
                ) : (
                  <img src={item.img} alt="" className="mp-ing-nav-icon" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mp-ing-sidebar-footer">
          <div className="mp-ing-user">
            <img src={avatarImg} alt="Noura BILLALI" className="mp-ing-avatar" />
            <div>
              <div className="mp-ing-user-name">Noura BILLALI</div>
              <div className="mp-ing-user-role">Utilisateur</div>
            </div>
          </div>

          <button
            type="button"
            className="mp-ing-logout"
            onClick={() => {
              if (onLogout) onLogout();
              else if (onNavigate) onNavigate("home");
            }}
          >
            <img src={logoutIcon} alt="" className="mp-ing-logout-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="mp-ing-main">
        <div className="mp-ing-header">
          <div>
            <h1 className="mp-ing-title">Ingrédients & Placards</h1>
            <p className="mp-ing-subtitle">
              Suivez les stocks de vos placards et évitez le gaspillage alimentaire
            </p>
          </div>

          <button
            type="button"
            className="mp-ing-add-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + Ajouter un ingrédient
          </button>
        </div>

        <div className="mp-ing-stats">
          <div className="mp-ing-stat-card">
            <img src={checkTotalIcon} alt="" className="mp-ing-stat-icon" />
            <div>
              <div className="mp-ing-stat-number">{stats.total}</div>
              <div className="mp-ing-stat-label">Ingrédients répertoriés</div>
            </div>
          </div>

          <div className="mp-ing-stat-card">
            <img src={checkStockIcon} alt="" className="mp-ing-stat-icon" />
            <div>
              <div className="mp-ing-stat-number">{stats.inStock}</div>
              <div className="mp-ing-stat-label">En stock actuellement</div>
            </div>
          </div>

          <div className="mp-ing-stat-card">
            <img src={alertOutIcon} alt="" className="mp-ing-stat-icon" />
            <div>
              <div className="mp-ing-stat-number">{stats.outOfStock}</div>
              <div className="mp-ing-stat-label">Stock épuisé</div>
            </div>
          </div>
        </div>

        <div className="mp-ing-toolbar">
          <input
            type="text"
            className="mp-ing-search"
            placeholder="Rechercher par nom ou ingrédient"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`mp-ing-filter ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mp-ing-table-wrap">
          <table className="mp-ing-table">
            <thead>
              <tr>
                <th>Ingrédient</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIngredients.map((item) => {
                const isInStock = item.status === "En stock";
                const addedToList = shoppingList.some((x) => x.id === item.id);

                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <span className="mp-ing-cat-badge">{item.category}</span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`mp-ing-status-btn ${
                          isInStock ? "en-stock" : "epuise"
                        }`}
                        onClick={() => toggleStatus(item.id)}
                        title="Cliquer pour changer le statut"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="mp-ing-action-btn"
                        onClick={() => handleAddToCourses(item)}
                      >
                        {addedToList ? "✓ Ajouté aux courses" : "+ Ajouter aux courses"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div
          className="mp-ing-modal-backdrop"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="mp-ing-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="mp-ing-modal-title">Ajouter un ingrédient</h2>
            <form className="mp-ing-form" onSubmit={handleCreateIngredient}>
              <label className="mp-ing-field">
                Nom de l'ingrédient
                <input
                  type="text"
                  className="mp-ing-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Pommes de terre"
                  required
                />
              </label>

              <label className="mp-ing-field">
                Catégorie
                <select
                  className="mp-ing-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== "Tous").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mp-ing-field">
                Statut
                <select
                  className="mp-ing-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="En stock">En stock</option>
                  <option value="Epuisé">Epuisé</option>
                </select>
              </label>

              <div className="mp-ing-modal-actions">
                <button
                  type="button"
                  className="mp-ing-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="mp-ing-add-btn">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}