import React, { useMemo, useState } from "react";
import "./ListeCourses.css";

import logoImg from "../ListeCourses/Rectangle 8007.png";
import bellIcon from "../ListeCourses/bell 1.png";
import avatarImg from "../ListeCourses/Ellipse 151.png";

import dashboardIcon from "../ListeCourses/Rectangle 8042 (1).svg";
import recettesIcon from "../ListeCourses/Rectangle 8037 (1).svg";
import ingredientsIcon from "../ListeCourses/Rectangle 8039.svg";
import planningIcon from "../ListeCourses/Rectangle 8040.svg";
import profilIcon from "../ListeCourses/Rectangle 8041.svg";
import logoutIcon from "../ListeCourses/Rectangle 8147.svg";

const INITIAL_ITEMS = [
  { id: 1, name: "Quinoa", category: "Céréales", checked: false },
  { id: 2, name: "Avocat", category: "Fruits", checked: true },
  { id: 3, name: "Lentille corail", category: "Légumineuses", checked: false },
  { id: 4, name: "Saumon", category: "Poisson", checked: false },
  { id: 5, name: "Tomates cerises", category: "Légumes", checked: true },
  { id: 6, name: "Riz arborio", category: "Céréales", checked: true },
  { id: 7, name: "Parmesan", category: "Fromage", checked: false },
  { id: 8, name: "Oranges", category: "Fruits", checked: true },
];

const CATEGORIES = [
  "Légumes",
  "Fruits",
  "Céréales",
  "Légumineuses",
  "Poisson",
  "Fromage",
  "Divers",
];

function CoursesNavIcon() {
  return (
    <svg
      className="mp-lc-nav-icon"
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

export default function ListeCourses() {
  const [activeNav, setActiveNav] = useState("courses");
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [quickInput, setQuickInput] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "to_buy" | "bought"

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

  const totalCount = items.length;
  const boughtCount = items.filter((item) => item.checked).length;
  const toBuyCount = totalCount - boughtCount;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((boughtCount / totalCount) * 100);

  const filteredItems = useMemo(() => {
    if (filter === "to_buy") return items.filter((item) => !item.checked);
    if (filter === "bought") return items.filter((item) => item.checked);
    return items;
  }, [items, filter]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCategoryChange = (id, newCategory) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, category: newCategory } : item
      )
    );
  };

  const handleAddQuickItem = (e) => {
    e.preventDefault();
    const cleanName = quickInput.trim();
    if (!cleanName) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: cleanName,
        category: "Divers",
        checked: false,
      },
    ]);
    setQuickInput("");
  };

  return (
    <div className="mp-lc-layout">
      <aside className="mp-lc-sidebar">
        <div>
          <div className="mp-lc-brand-box">
            <img src={logoImg} alt="MiamPlan" className="mp-lc-logo-img" />
          </div>

          <nav className="mp-lc-nav" aria-label="Navigation principale">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mp-lc-nav-btn ${
                  activeNav === item.id ? "active" : ""
                }`}
                onClick={() => setActiveNav(item.id)}
              >
                {item.customIcon ? (
                  item.customIcon
                ) : (
                  <img src={item.img} alt="" className="mp-lc-nav-icon" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mp-lc-sidebar-footer">
          <div className="mp-lc-user">
            <img src={avatarImg} alt="Noura BILLALI" className="mp-lc-avatar" />
            <div>
              <div className="mp-lc-user-name">Noura BILLALI</div>
              <div className="mp-lc-user-role">Utilisateur</div>
            </div>
          </div>

          <button type="button" className="mp-lc-logout">
            <img src={logoutIcon} alt="" className="mp-lc-logout-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      <main className="mp-lc-main">
        <div className="mp-lc-top-bar">
          <div>
            <h1 className="mp-lc-title">Liste des courses</h1>
            <p className="mp-lc-subtitle">
              Générez à partir de vos menus hebdomadaires
            </p>
          </div>

          <div className="mp-lc-top-actions">
            <button
              type="button"
              className="mp-lc-bell-btn"
              aria-label="Notifications"
            >
              <img src={bellIcon} alt="" className="mp-lc-bell-icon" />
            </button>
            <img src={avatarImg} alt="Profil" className="mp-lc-top-avatar" />
          </div>
        </div>

        <section className="mp-lc-progress-card">
          <div className="mp-lc-progress-header">
            <span className="mp-lc-progress-label">
              Progression de vos courses
            </span>
            <span className="mp-lc-progress-value">{progressPercent}%</span>
          </div>

          <div className="mp-lc-progress-track">
            <div
              className="mp-lc-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <form className="mp-lc-quick-form" onSubmit={handleAddQuickItem}>
            <input
              type="text"
              className="mp-lc-quick-input"
              placeholder="Ajouter un article rapide(ex: pommes)..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
            />
            <button type="submit" className="mp-lc-add-btn">
              + Ajouter
            </button>
          </form>
        </section>

        <div className="mp-lc-filters">
          <button
            type="button"
            className={`mp-lc-filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            Tous ({totalCount})
          </button>
          <button
            type="button"
            className={`mp-lc-filter-btn ${
              filter === "to_buy" ? "active" : ""
            }`}
            onClick={() => setFilter("to_buy")}
          >
            A acheter ({toBuyCount})
          </button>
          <button
            type="button"
            className={`mp-lc-filter-btn ${
              filter === "bought" ? "active" : ""
            }`}
            onClick={() => setFilter("bought")}
          >
            Déjà achetés ({boughtCount})
          </button>
        </div>

        <div className="mp-lc-grid">
          {filteredItems.map((item) => (
            <label key={item.id} className="mp-lc-item-card">
              <div className="mp-lc-item-left">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleItem(item.id)}
                />
                <span className="mp-lc-custom-check" />
                <span className="mp-lc-item-name">{item.name}</span>
              </div>

              <select
                className="mp-lc-category-pill mp-lc-category-select"
                value={item.category}
                aria-label={`Catégorie de ${item.name}`}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleCategoryChange(item.id, e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </main>
    </div>
  );
}