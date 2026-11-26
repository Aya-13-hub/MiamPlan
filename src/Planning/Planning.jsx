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

const MAX_ITEMS_PER_SLOT = 3;
const DEFAULT_COURSE_TAGS = ["Entrée", "Plat", "Dessert"];

const DAYS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

const SLOTS = [
  { key: "dejeuner", label: "Déjeuner" },
  { key: "dinner", label: "Dinner" },
];

const RANDOM_POOL = [
  { tag: "Plat", title: "Mtewem", img: mtewemImg, vegetarian: false },
  { tag: "Entrée", title: "Tacos", img: tacosImg, vegetarian: false },
  { tag: "Entrée", title: "Samosas", img: samosasImg, vegetarian: true },
  { tag: "Plat", title: "Lasagnes", img: lasagnesImg, vegetarian: false },
  { tag: "Plat", title: "Pasta", img: pastaImg, vegetarian: true },
  { tag: "Plat", title: "Ramen", img: ramenImg, vegetarian: false },
  { tag: "Entrée", title: "Poivron farci", img: poivronFarciImg, vegetarian: true },
  { tag: "Plat", title: "Pizza Pepperoni", img: pizzaPepperoniImg, vegetarian: false },
  { tag: "Plat", title: "Tortilla", img: tortillaImg, vegetarian: true },
  { tag: "Plat", title: "Poulet au curry", img: pouletCurryImg, vegetarian: false },
  { tag: "Plat", title: "Couscous", img: couscousImg, vegetarian: false },
  { tag: "Entrée", title: "Sushi", img: suchiImg, vegetarian: false },
  { tag: "Plat", title: "Rechta", img: rechtaImg, vegetarian: false },
  { tag: "Plat", title: "Paella", img: paellaImg, vegetarian: false },
];

function getFilteredPool(opts) {
  const selectedTypes = [];
  if (opts.entree) selectedTypes.push("Entrée");
  if (opts.plat) selectedTypes.push("Plat");
  if (opts.dessert) selectedTypes.push("Dessert");

  let pool = RANDOM_POOL;

  if (selectedTypes.length > 0) {
    const byType = pool.filter((item) => selectedTypes.includes(item.tag));
    if (byType.length > 0) {
      pool = byType;
    }
  }

  if (opts.vegetarien) {
    const byVeg = pool.filter((item) => item.vegetarian);
    if (byVeg.length > 0) {
      pool = byVeg;
    } else {
      const anyVeg = RANDOM_POOL.filter((item) => item.vegetarian);
      if (anyVeg.length > 0) {
        pool = anyVeg;
      }
    }
  }

  return pool.length > 0 ? pool : RANDOM_POOL;
}

function collectRecentTitles(mealsObj) {
  const titles = new Set();
  DAYS.forEach((day) => {
    ["dejeuner", "dinner"].forEach((slot) => {
      const t = mealsObj?.[day]?.[slot]?.title;
      if (t) titles.add(t);
    });
  });
  return titles;
}

function pickCandidateFromPool(pool, recentTitles, avoidRecent, excludeTitle = null) {
  let candidates = pool.filter((m) => m.title !== excludeTitle);
  if (candidates.length === 0) candidates = pool;

  if (avoidRecent && recentTitles.size > 0) {
    const fresh = candidates.filter((m) => !recentTitles.has(m.title));
    if (fresh.length > 0) {
      candidates = fresh;
    }
  }

  return candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
}

function buildWeekMeals(opts, existingMeals = {}, lockedSlots = {}, avoidRecent = false) {
  const pool = getFilteredPool(opts);
  const recentTitles = avoidRecent ? collectRecentTitles(existingMeals) : new Set();
  const usedInCurrentRun = new Set();
  const next = {};

  DAYS.forEach((day, idx) => {
    next[day] = {};
    ["dejeuner", "dinner"].forEach((slot, sIdx) => {
      const slotId = `${day}-${slot}`;
      if (lockedSlots[slotId] && existingMeals?.[day]?.[slot]) {
        next[day][slot] = { ...existingMeals[day][slot] };
        return;
      }

      const combinedRecent = new Set([
        ...(avoidRecent ? recentTitles : []),
        ...(avoidRecent ? usedInCurrentRun : []),
      ]);

      const fallbackItem = pool[(idx * 2 + sIdx) % pool.length];
      const chosen =
        avoidRecent
          ? pickCandidateFromPool(pool, combinedRecent, true, existingMeals?.[day]?.[slot]?.title)
          : fallbackItem;

      usedInCurrentRun.add(chosen.title);
      next[day][slot] = { ...chosen };
    });
  });

  return next;
}

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
      width="14"
      height="14"
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

export default function Planning({ onNavigate, onLogout } = {}) {
  const [activeNav, setActiveNav] = useState("planning");
  const [mode, setMode] = useState("aleatoire");
  const [options, setOptions] = useState({
    entree: true,
    plat: true,
    dessert: false,
    vegetarien: false,
  });
  const [avoidRecent, setAvoidRecent] = useState(false); // SCRUM-62
  const [lockedItems, setLockedItems] = useState({}); // SCRUM-61: { [idOrKey]: true }
  const [menuValidated, setMenuValidated] = useState(false); // SCRUM-63
  const [duplicateMenuKey, setDuplicateMenuKey] = useState(null); // SCRUM-35

  const [meals, setMeals] = useState(() =>
    buildWeekMeals({
      entree: true,
      plat: true,
      dessert: false,
      vegetarien: false,
    })
  );
  const [manualMeals, setManualMeals] = useState({});

  // SCRUM-36: دعم التعديل على عنصر قائم أو إضافة عنصر جديد
  const [targetSlot, setTargetSlot] = useState(null); // { day, slot, editItemId? }
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [recipeForm, setRecipeForm] = useState(EMPTY_RECIPE_FORM);

  const [shareFeedback, setShareFeedback] = useState("");
  const [weekLabel, setWeekLabel] = useState("Semaine du 20 - 26 Novembre 2026");
  const [isEditingWeek, setIsEditingWeek] = useState(false);
  const [weekDraft, setWeekDraft] = useState("Semaine du 20 - 26 Novembre 2026");

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

  const showToast = (msg) => {
    setShareFeedback(msg);
    setTimeout(() => {
      setShareFeedback((current) => (current === msg ? "" : current));
    }, 3000);
  };

  const toggleOption = (key) => {
    setMenuValidated(false);
    setOptions((prev) => {
      const nextOptions = { ...prev, [key]: !prev[key] };
      setMeals((currMeals) =>
        buildWeekMeals(nextOptions, currMeals, lockedItems, avoidRecent)
      );
      return nextOptions;
    });
  };

  const toggleAvoidRecent = () => {
    setAvoidRecent((prev) => {
      const nextAvoid = !prev;
      if (nextAvoid) {
        setMeals((currMeals) =>
          buildWeekMeals(options, currMeals, lockedItems, true)
        );
      }
      return nextAvoid;
    });
  };

  const toggleLock = (lockKey) => {
    setLockedItems((prev) => ({
      ...prev,
      [lockKey]: !prev[lockKey],
    }));
  };

  const startEditingWeek = () => {
    setWeekDraft(weekLabel);
    setIsEditingWeek(true);
  };

  const commitWeekLabel = () => {
    const cleaned = weekDraft.trim();
    if (cleaned) {
      setWeekLabel(cleaned);
      setMenuValidated(false);
    }
    setIsEditingWeek(false);
  };

  const handleWeekKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commitWeekLabel();
    } else if (e.key === "Escape") {
      setIsEditingWeek(false);
    }
  };

  const shiftWeek = (direction) => {
    const match = weekLabel.match(
      /^(.*?)\s*(\d{1,2})\s*-\s*(\d{1,2})\s+([A-Za-zÀ-ÿ]+)\s+(\d{4})$/
    );
    if (!match) {
      startEditingWeek();
      return;
    }

    const [, prefix, startDayStr, endDayStr, monthName, yearStr] = match;
    const startDay = parseInt(startDayStr, 10);
    const endDay = parseInt(endDayStr, 10);
    const delta = direction * 7;

    const nextStart = Math.max(1, Math.min(31, startDay + delta));
    const nextEnd = Math.max(1, Math.min(31, endDay + delta));

    setWeekLabel(`${prefix} ${nextStart} - ${nextEnd} ${monthName} ${yearStr}`.trim());
    setMenuValidated(false);
  };

  // SCRUM-59 + احترام SCRUM-61 (القفل) و SCRUM-62 (تجنب الأطباق الحديثة)
  const replaceMeal = (day, slot) => {
    const lockKey = `random-${day}-${slot}`;
    if (lockedItems[lockKey]) {
      showToast("Ce plat est verrouillé (SCRUM-61).");
      return;
    }

    setMenuValidated(false);
    const pool = getFilteredPool(options);
    setMeals((prev) => {
      const currentTitle = prev[day][slot]?.title;
      const recentTitles = avoidRecent ? collectRecentTitles(prev) : new Set();
      const pick = pickCandidateFromPool(pool, recentTitles, avoidRecent, currentTitle);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [slot]: { ...pick },
        },
      };
    });
  };

  // SCRUM-53 / SCRUM-57 + احترام SCRUM-61 و SCRUM-62
  const regenerateAll = () => {
    setMenuValidated(false);
    setMeals((prev) => buildWeekMeals(options, prev, lockedItems, avoidRecent));
  };

  // SCRUM-63: اعتماد / تثبيت القائمة الحالية
  const handleValidateMenu = () => {
    setMenuValidated(true);
    setDuplicateMenuKey(null);
    showToast("Menu validé avec succès !");
  };

  // فتح نموذج إضافة وصفة جديدة لخانة
  const openAddRecipeForSlot = (day, slot) => {
    const existingList = manualMeals[day]?.[slot] || [];
    const suggestedTag = DEFAULT_COURSE_TAGS[existingList.length] || "Plat";
    setDuplicateMenuKey(null);
    setTargetSlot({ day, slot, editItemId: null });
    setRecipeForm({
      ...EMPTY_RECIPE_FORM,
      types: [suggestedTag],
    });
    setShowAddRecipe(true);
  };

  // SCRUM-36: فتح نموذج تعديل وجبة قائمة بالفعل
  const openEditRecipeItem = (day, slot, item) => {
    setDuplicateMenuKey(null);
    setTargetSlot({ day, slot, editItemId: item.id });
    setRecipeForm({
      ...EMPTY_RECIPE_FORM,
      nom: item.title || "",
      imagePreview: item.img || "",
      types: item.tag ? [item.tag] : ["Plat"],
      temps: item.temps || "30",
      calories: item.calories || "1 kcal",
      regimes: item.regimes || [],
      allergies: item.allergies || [],
      methode: item.methode || EMPTY_RECIPE_FORM.methode,
      ingredients: item.ingredients || EMPTY_RECIPE_FORM.ingredients,
      rating: item.rating || 0,
      commentaire: item.commentaire || "",
    });
    setShowAddRecipe(true);
  };

  // SCRUM-35: تكرار نفس الطبق إلى يوم/وجبة أخرى
  const handleDuplicateItemTo = (sourceItem, targetDay, targetSlotKey) => {
    setMenuValidated(false);
    setDuplicateMenuKey(null);

    if (mode === "aleatoire") {
      const lockKey = `random-${targetDay}-${targetSlotKey}`;
      if (lockedItems[lockKey]) {
        showToast("La case cible est verrouillée.");
        return;
      }
      setMeals((prev) => ({
        ...prev,
        [targetDay]: {
          ...prev[targetDay],
          [targetSlotKey]: {
            tag: sourceItem.tag,
            title: sourceItem.title,
            img: sourceItem.img,
            vegetarian: Boolean(sourceItem.vegetarian),
          },
        },
      }));
      showToast(`"${sourceItem.title}" dupliqué vers ${targetDay} (${targetSlotKey === "dejeuner" ? "Déjeuner" : "Dinner"}).`);
      return;
    }

    setManualMeals((prev) => {
      const list = prev[targetDay]?.[targetSlotKey] || [];
      if (list.length >= MAX_ITEMS_PER_SLOT) {
        showToast(`Maximum ${MAX_ITEMS_PER_SLOT} éléments par repas.`);
        return prev;
      }
      const cloned = {
        ...sourceItem,
        id: Date.now() + Math.floor(Math.random() * 1000),
      };
      return {
        ...prev,
        [targetDay]: {
          ...(prev[targetDay] || {}),
          [targetSlotKey]: [...list, cloned],
        },
      };
    });
    showToast(`"${sourceItem.title}" dupliqué vers ${targetDay} (${targetSlotKey === "dejeuner" ? "Déjeuner" : "Dinner"}).`);
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

    const { day, slot, editItemId } = targetSlot;
    const existingList = manualMeals[day]?.[slot] || [];
    const cleanTitle = recipeForm.nom.trim() || "Nouvelle recette";
    const chosenTag =
      recipeForm.types[0] ||
      DEFAULT_COURSE_TAGS[existingList.length] ||
      "Plat";
    const chosenImg = recipeForm.imagePreview || mtewemImg;

    const payload = {
      tag: chosenTag,
      title: cleanTitle,
      img: chosenImg,
      temps: recipeForm.temps,
      calories: recipeForm.calories,
      regimes: recipeForm.regimes,
      allergies: recipeForm.allergies,
      methode: recipeForm.methode,
      ingredients: recipeForm.ingredients,
      rating: recipeForm.rating,
      commentaire: recipeForm.commentaire,
    };

    setMenuValidated(false);

    if (editItemId) {
      setManualMeals((prev) => {
        const list = prev[day]?.[slot] || [];
        return {
          ...prev,
          [day]: {
            ...(prev[day] || {}),
            [slot]: list.map((item) =>
              item.id === editItemId ? { ...item, ...payload } : item
            ),
          },
        };
      });
    } else {
      if (existingList.length >= MAX_ITEMS_PER_SLOT) {
        setShowAddRecipe(false);
        setTargetSlot(null);
        return;
      }

      setManualMeals((prev) => ({
        ...prev,
        [day]: {
          ...(prev[day] || {}),
          [slot]: [...existingList, { id: Date.now(), ...payload }],
        },
      }));
    }

    setShowAddRecipe(false);
    setTargetSlot(null);
  };

  const handleCancelRecipe = () => {
    setShowAddRecipe(false);
    setTargetSlot(null);
  };

  const handleRemoveManualMealItem = (day, slot, itemId) => {
    const lockKey = `manual-${itemId}`;
    if (lockedItems[lockKey]) {
      showToast("Ce plat est verrouillé (SCRUM-61).");
      return;
    }

    setMenuValidated(false);
    setManualMeals((prev) => {
      const existingList = prev[day]?.[slot] || [];
      const filtered = existingList.filter((item) => item.id !== itemId);
      const updatedDay = { ...(prev[day] || {}) };
      if (filtered.length > 0) {
        updatedDay[slot] = filtered;
      } else {
        delete updatedDay[slot];
      }
      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

  const handleSharePlanning = async () => {
    const summaryLines = DAYS.map((day) => {
      if (mode === "aleatoire") {
        const d = meals[day]?.dejeuner?.title || "-";
        const n = meals[day]?.dinner?.title || "-";
        return `${day}: Déjeuner (${d}) | Dinner (${n})`;
      }
      const dList =
        (manualMeals[day]?.dejeuner || [])
          .map((m) => `${m.tag}: ${m.title}`)
          .join(", ") || "-";
      const nList =
        (manualMeals[day]?.dinner || [])
          .map((m) => `${m.tag}: ${m.title}`)
          .join(", ") || "-";
      return `${day}: Déjeuner [${dList}] | Dinner [${nList}]`;
    });

    const shareText = `Planning Hebdomadaire (${weekLabel}) - MiamPlan:\n${summaryLines.join("\n")}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Planning Hebdomadaire - MiamPlan",
          text: shareText,
          url: window.location.href,
        });
        showToast("Planning partagé avec succès !");
        return;
      }
    } catch (err) {
      if (err?.name === "AbortError") return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        showToast("Planning copié dans le presse-papiers !");
      } else {
        showToast("Partage prêt (lien copié).");
      }
    } catch {
      showToast("Impossible de copier automatiquement le planning.");
    }
  };

  const renderDuplicatePopover = (menuKey, sourceItem) => {
    if (duplicateMenuKey !== menuKey) return null;

    return (
      <div className="mp-plan-dup-popover mp-plan-no-print" onClick={(e) => e.stopPropagation()}>
        <div className="mp-plan-dup-title">Dupliquer vers :</div>
        <div className="mp-plan-dup-grid">
          {DAYS.map((targetDay) => (
            <div key={targetDay} className="mp-plan-dup-day">
              <span className="mp-plan-dup-day-name">{targetDay.slice(0, 3)}</span>
              {SLOTS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className="mp-plan-dup-target-btn"
                  onClick={() => handleDuplicateItemTo(sourceItem, targetDay, s.key)}
                >
                  {s.key === "dejeuner" ? "Déj" : "Din"}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSlotContent = (day, slotKey) => {
    if (mode === "aleatoire") {
      const item = meals[day][slotKey];
      const lockKey = `random-${day}-${slotKey}`;
      const isLocked = Boolean(lockedItems[lockKey]);
      const menuKey = `dup-random-${day}-${slotKey}`;

      return (
        <div className="mp-plan-meal-card">
          <div className="mp-plan-img-wrap">
            <span className="mp-plan-meal-badge">{item.tag}</span>
            <button
              type="button"
              className={`mp-plan-lock-badge mp-plan-no-print ${isLocked ? "locked" : ""}`}
              onClick={() => toggleLock(lockKey)}
              title={isLocked ? "Déverrouiller ce plat" : "Verrouiller ce plat"}
            >
              {isLocked ? "🔒" : "🔓"}
            </button>
            <img src={item.img} alt={item.title} className="mp-plan-meal-img" />
          </div>

          <div className="mp-plan-meal-footer">
            <span className="mp-plan-meal-name">{item.title}</span>
            <div className="mp-plan-card-actions mp-plan-no-print">
              <button
                type="button"
                className="mp-plan-refresh-btn"
                onClick={() =>
                  setDuplicateMenuKey((curr) => (curr === menuKey ? null : menuKey))
                }
                title="Dupliquer ce plat"
              >
                ⧉
              </button>
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
          {renderDuplicatePopover(menuKey, item)}
        </div>
      );
    }

    const manualList = manualMeals[day]?.[slotKey] || [];
    const canAddMore = manualList.length < MAX_ITEMS_PER_SLOT;

    return (
      <div className="mp-plan-manual-stack">
        {manualList.map((manualItem) => {
          const lockKey = `manual-${manualItem.id}`;
          const isLocked = Boolean(lockedItems[lockKey]);
          const menuKey = `dup-manual-${manualItem.id}`;

          return (
            <div key={manualItem.id} className="mp-plan-meal-card">
              <div className="mp-plan-img-wrap">
                <span className="mp-plan-meal-badge">{manualItem.tag}</span>
                <button
                  type="button"
                  className={`mp-plan-lock-badge mp-plan-no-print ${isLocked ? "locked" : ""}`}
                  onClick={() => toggleLock(lockKey)}
                  title={isLocked ? "Déverrouiller ce plat" : "Verrouiller ce plat"}
                >
                  {isLocked ? "🔒" : "🔓"}
                </button>
                <img
                  src={manualItem.img}
                  alt={manualItem.title}
                  className="mp-plan-meal-img"
                />
              </div>

              <div className="mp-plan-meal-footer">
                <span className="mp-plan-meal-name">{manualItem.title}</span>
                <div className="mp-plan-card-actions mp-plan-no-print">
                  <button
                    type="button"
                    className="mp-plan-refresh-btn"
                    onClick={() => openEditRecipeItem(day, slotKey, manualItem)}
                    title="Modifier ce repas"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="mp-plan-refresh-btn"
                    onClick={() =>
                      setDuplicateMenuKey((curr) => (curr === menuKey ? null : menuKey))
                    }
                    title="Dupliquer ce repas"
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    className="mp-plan-refresh-btn"
                    onClick={() =>
                      handleRemoveManualMealItem(day, slotKey, manualItem.id)
                    }
                    title="Retirer cet élément"
                  >
                    ✕
                  </button>
                </div>
              </div>
              {renderDuplicatePopover(menuKey, manualItem)}
            </div>
          );
        })}

        {canAddMore && (
          <button
            type="button"
            className={`mp-plan-manual-add-card mp-plan-no-print ${
              manualList.length > 0 ? "compact" : ""
            }`}
            onClick={() => openAddRecipeForSlot(day, slotKey)}
            title={
              manualList.length === 0
                ? "Ajouter un plat (Entrée, Plat ou Dessert)"
                : "Ajouter un élément supplémentaire (Entrée, Plat ou Dessert)"
            }
          >
            + Ajouter
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="mp-plan-layout" onClick={() => setDuplicateMenuKey(null)}>
      <aside className="mp-plan-sidebar mp-plan-no-print">
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
                  if (onNavigate && item.id !== "planning") {
                    onNavigate(item.id);
                  }
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

          <button
            type="button"
            className="mp-plan-logout"
            onClick={() => {
              if (onLogout) onLogout();
              else if (onNavigate) onNavigate("home");
            }}
          >
            <img src={logoutIcon} alt="" className="mp-plan-logout-icon" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {showAddRecipe ? (
        <main className="mp-plan-main mp-rec-main">
          <div className="mp-rec-header">
            <div>
              <h1 className="mp-rec-title">
                {targetSlot?.editItemId ? "Modifier la recette" : "Ajouter une recette"}
              </h1>
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
                        <img
                          src={deleteTrashIcon}
                          alt="Supprimer"
                          className="mp-rec-trash-img"
                        />
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
                  {targetSlot?.editItemId
                    ? "Mettre à jour"
                    : "Enregistrer la recette"}
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

            <div className="mp-plan-top-actions mp-plan-no-print">
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
            <button
              type="button"
              className="mp-plan-week-nav mp-plan-no-print"
              onClick={() => shiftWeek(-1)}
            >
              &lt; &nbsp; Semaine précédente
            </button>

            {isEditingWeek ? (
              <div className="mp-plan-week-edit-wrap">
                <input
                  type="text"
                  className="mp-plan-week-input"
                  value={weekDraft}
                  autoFocus
                  onChange={(e) => setWeekDraft(e.target.value)}
                  onBlur={commitWeekLabel}
                  onKeyDown={handleWeekKeyDown}
                  placeholder="Ex: Semaine du 27 Nov - 03 Déc 2026"
                />
                <button
                  type="button"
                  className="mp-plan-week-save-btn mp-plan-no-print"
                  onClick={commitWeekLabel}
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="mp-plan-week-label-btn"
                onClick={startEditingWeek}
                title="Cliquez pour modifier la période de la semaine"
              >
                <span>{weekLabel}</span>
                <span className="mp-plan-week-edit-hint mp-plan-no-print">✎</span>
              </button>
            )}

            <button
              type="button"
              className="mp-plan-week-nav mp-plan-no-print"
              onClick={() => shiftWeek(1)}
            >
              Semaine suivante &nbsp; &gt;
            </button>
          </div>

          <div className="mp-plan-mode-switch mp-plan-no-print">
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
            <div className="mp-plan-options-bar mp-plan-no-print">
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

                <label className="mp-plan-check-pill">
                  <input
                    type="checkbox"
                    checked={avoidRecent}
                    onChange={toggleAvoidRecent}
                  />
                  <span className="mp-plan-custom-check" />
                  <span>Éviter récents</span>
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

          {shareFeedback && (
            <div className="mp-plan-toast mp-plan-no-print" role="status">
              {shareFeedback}
            </div>
          )}

          <div className="mp-plan-action-toolbar mp-plan-no-print">
            {menuValidated && (
              <span className="mp-plan-validated-badge">Menu validé ✓</span>
            )}

            <button
              type="button"
              className={`mp-plan-validate-btn ${menuValidated ? "validated" : ""}`}
              onClick={handleValidateMenu}
            >
              {menuValidated ? "Validé ✓" : "Valider le menu"}
            </button>

            <div className="mp-plan-utility-icons">
              <button
                type="button"
                className="mp-plan-util-btn"
                title="Partager"
                onClick={handleSharePlanning}
              >
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
            <div className="mp-plan-bottom-bar mp-plan-no-print">
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