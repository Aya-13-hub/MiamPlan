import React, { useEffect, useMemo, useState } from 'react';
import './AdminDashboard.css';
import logo from './logo.png';
import logoBlanc from './logo-blanc.png';
import salad from './salad.png';
import topVector from './Vector.png';

/* ---------- Données de démonstration (à remplacer par l'API Django) ---------- */
const INITIAL_USERS = [
  { id: 1, name: 'Aya Benali', email: 'aya@example.com', role: 'Utilisateur', status: 'actif', joined: '2026-09-02', menus: 14 },
  { id: 2, name: 'Karim Haddad', email: 'karim@example.com', role: 'Utilisateur', status: 'actif', joined: '2026-09-15', menus: 8 },
  { id: 3, name: 'Sara Mansouri', email: 'sara@example.com', role: 'Utilisateur', status: 'suspendu', joined: '2026-10-01', menus: 3 },
  { id: 4, name: 'Yacine Brahimi', email: 'yacine@example.com', role: 'Administrateur', status: 'actif', joined: '2026-08-20', menus: 21 },
  { id: 5, name: 'Nadia Cherif', email: 'nadia@example.com', role: 'Utilisateur', status: 'actif', joined: '2026-11-05', menus: 5 },
];

const INITIAL_RECIPES = [
  { id: 1, name: 'Salade méditerranéenne', category: 'Entrée', time: 15, planned: 27, published: true, image: null },
  { id: 2, name: 'Soupe de légumes', category: 'Entrée', time: 25, planned: 18, published: true, image: null },
  { id: 3, name: 'Bowl Buddha au quinoa', category: 'Plat', time: 35, planned: 42, published: true, image: null },
  { id: 4, name: 'Dumplings', category: 'Plat', time: 45, planned: 31, published: true, image: null },
  { id: 5, name: 'Paella', category: 'Plat', time: 60, planned: 19, published: true, image: null },
  { id: 6, name: 'Tiramisu', category: 'Dessert', time: 30, planned: 22, published: true, image: null },
  { id: 7, name: 'Salade de fruits', category: 'Dessert', time: 10, planned: 12, published: true, image: null },
];

const INITIAL_INGREDIENTS = [
  { id: 1, name: 'Quinoa', stock: 300, unit: 'g' },
  { id: 2, name: 'Tomates cerises', stock: 500, unit: 'g' },
  { id: 3, name: 'Saumon', stock: 0, unit: 'g' },
  { id: 4, name: 'Lait de coco', stock: 800, unit: 'ml' },
];

// Photos réelles : déposez vos images dans src/recipes/ (ex. paella.jpg, tiramisu.webp).
// Le nom du fichier doit correspondre au nom de la recette (sans accents, en minuscules, avec des tirets).
const RECIPE_PHOTOS = import.meta.glob('./recipes/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });
const slugify = (text) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const PHOTO_BY_SLUG = Object.fromEntries(
  Object.entries(RECIPE_PHOTOS).map(([path, url]) => [slugify(path.split('/').pop().replace(/\.[^.]+$/, '')), url])
);
// photo choisie par l'admin > photo du dossier src/recipes > image par défaut
const photoFor = (recipe) => recipe.image || PHOTO_BY_SLUG[slugify(recipe.name)] || salad;

// Identifiants admin de démonstration (à remplacer par la vérification Django : is_staff)
const ADMIN_EMAIL = 'admin@miamplan.com';
const ADMIN_PASSWORD = 'admin123';

const CATEGORIES = ['Entrée', 'Plat', 'Dessert'];

const ICONS = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  recipes: 'M6 14a4 4 0 01-1-7.9A5 5 0 0115 5a4 4 0 013 8.1V19H6v-5z',
  ingredients: 'M12 3c-4 3-6 7-6 11a6 6 0 0012 0c0-4-2-8-6-11z',
  users: 'M17 20h5v-2a4 4 0 00-5-3.9M9 11a4 4 0 100-8 4 4 0 000 8zm-7 9v-1a5 5 0 015-5h4a5 5 0 015 5v1',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.4-3a7.4 7.4 0 00-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 00-2-1.2L14.5 3h-4l-.4 2.6a7 7 0 00-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 000 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 002 1.2l.4 2.6h4l.4-2.6a7 7 0 002-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z',
  search: 'M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z',
  bell: 'M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  logout: 'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  book: 'M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3V4zM8 4v13',
  calendar: 'M4 7h16v13H4zM4 11h16M8 3v4M16 3v4',
  cart: 'M3 4h2l2.4 10h9.2L19 7H6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z',
  plus: 'M12 5v14M5 12h14',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  lock: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
};

const NAV = [
  { key: 'dashboard', label: 'Tableau de bord' },
  { key: 'recipes', label: 'Recettes' },
  { key: 'ingredients', label: 'Ingrédients' },
  { key: 'users', label: 'Utilisateurs' },
  { key: 'settings', label: 'Paramètres' },
];

function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

/* ---------- Connexion administrateur ---------- */
function AdminLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pass) {
      setError("Renseignez l'adresse e-mail et le mot de passe.");
      return;
    }
    // TODO : remplacer par POST /api/admin/login/ (Django) qui vérifie is_staff
    if (email.trim().toLowerCase() !== ADMIN_EMAIL || pass !== ADMIN_PASSWORD) {
      setError('Identifiants incorrects ou compte non autorisé.');
      return;
    }
    setError('');
    onSuccess();
  };

  const features = [
    { icon: 'recipes', text: 'Ajoutez et organisez les recettes' },
    { icon: 'ingredients', text: 'Suivez les stocks d\'ingrédients' },
    { icon: 'users', text: 'Gérez les comptes des utilisateurs' },
  ];

  return (
    <div className="adm-login-page">
      <img src={topVector} alt="" className="adm-login-vector" />

      <div className="adm-login-left">
        <img src={logo} alt="MiamPlan" className="adm-login-logo" />
        <h1>Espace administrateur</h1>
        <p>Gérez les repas, les ingrédients et les utilisateurs de MiamPlan.</p>
        <ul className="adm-login-features">
          {features.map((f) => (
            <li key={f.text}><span><Icon name={f.icon} size={16} /></span>{f.text}</li>
          ))}
        </ul>
        <img src={salad} alt="" className="adm-login-salad" />
      </div>

      <div className="adm-login-right">
        <form className="adm-login-card" onSubmit={submit} autoComplete="off">
          <h2>Connexion administrateur</h2>
          <p className="adm-login-sub">Réservé à l'équipe MiamPlan.</p>

          <div className="adm-login-field">
            <span className="adm-login-icon"><Icon name="mail" size={17} /></span>
            <input type="email" placeholder="Adresse e-mail" value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="adm-login-field">
            <span className="adm-login-icon"><Icon name="lock" size={17} /></span>
            <input type={show ? 'text' : 'password'} placeholder="Mot de passe" value={pass}
              autoComplete="new-password" onChange={(e) => setPass(e.target.value)} />
            <button type="button" className="adm-login-eye" onClick={() => setShow(!show)}
              aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              <Icon name="eye" size={18} />
            </button>
          </div>

          {error && <p className="adm-error">{error}</p>}

          <button type="submit" className="adm-green-btn adm-login-submit">
            <Icon name="logout" size={18} /> Se connecter
          </button>
          <button type="button" className="adm-link" onClick={onBack}>← Retour</button>
        </form>
      </div>
    </div>
  );
}

/* ---------- Tableau de bord ---------- */
function Overview({ users, recipes, ingredients, go }) {
  const published = recipes.filter((r) => r.published).length;
  const totalMenus = users.reduce((s, u) => s + u.menus, 0);
  const top = [...recipes].sort((a, b) => b.planned - a.planned).slice(0, 4);
  const recent = [...users].sort((a, b) => b.joined.localeCompare(a.joined)).slice(0, 4);
  const lowStock = ingredients.filter((i) => i.stock === 0);

  const stats = [
    { icon: 'users', value: users.length, label: 'Utilisateurs inscrits', tone: 'green' },
    { icon: 'book', value: published, label: 'Recettes publiées', tone: 'green' },
    { icon: 'calendar', value: totalMenus, label: 'Menus planifiés', tone: 'orange' },
    { icon: 'cart', value: lowStock.length, label: 'Ingrédients en rupture', tone: 'red' },
  ];

  return (
    <>
      <div className="adm-hero">
        <div className="adm-hero-text">
          <h2>Bonjour Administrateur !</h2>
          <p>Gérez les recettes, les ingrédients et les comptes de MiamPlan.</p>
          <button className="adm-hero-btn" onClick={() => go('recipes')}>Gérer les recettes →</button>
        </div>
        <img src={salad} alt="" className="adm-hero-img" />
      </div>

      <div className="adm-stats">
        {stats.map((s) => (
          <div className="adm-stat" key={s.label}>
            <span className={`adm-stat-icon ${s.tone}`}><Icon name={s.icon} /></span>
            <div>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-grid">
        <div className="adm-col">
          <section className="adm-panel">
            <div className="adm-panel-head">
              <h3>Recettes les plus planifiées</h3>
              <button className="adm-link" onClick={() => go('recipes')}>Voir tout →</button>
            </div>
            <div className="adm-mini-cards">
              {top.map((r) => (
                <div className="adm-mini-card" key={r.id}>
                  <img src={photoFor(r)} alt="" />
                  <strong>{r.name}</strong>
                  <span>{r.planned} fois</span>
                </div>
              ))}
            </div>
          </section>

          <section className="adm-panel">
            <div className="adm-panel-head">
              <h3>Dernières inscriptions</h3>
              <button className="adm-link" onClick={() => go('users')}>Voir tout →</button>
            </div>
            <table className="adm-table">
              <thead><tr><th>Nom</th><th>E-mail</th><th>Inscrit le</th></tr></thead>
              <tbody>
                {recent.map((u) => (
                  <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.joined}</td></tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <div className="adm-col">
          <section className="adm-panel">
            <div className="adm-panel-head">
              <h3>Ingrédients en rupture</h3>
              <button className="adm-link" onClick={() => go('ingredients')}>Ouvrir</button>
            </div>
            {lowStock.length === 0 && <p className="adm-muted">Aucune rupture de stock.</p>}
            {lowStock.map((i) => (
              <div className="adm-pill-row" key={i.id}><span>{i.name}</span><span>0 {i.unit}</span></div>
            ))}
          </section>

          <section className="adm-panel">
            <h3>Raccourcis rapides</h3>
            <div className="adm-shortcuts">
              <button className="adm-green-btn" onClick={() => go('recipes')}><Icon name="plus" size={16} /> Ajouter une recette</button>
              <button className="adm-green-btn" onClick={() => go('ingredients')}><Icon name="plus" size={16} /> Ajouter un ingrédient</button>
              <button className="adm-green-btn" onClick={() => go('users')}><Icon name="users" size={16} /> Gérer les utilisateurs</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

/* ---------- Recettes ---------- */
function Recipes({ recipes, setRecipes, query, notify, ask }) {
  const empty = { name: '', category: CATEGORIES[1], time: '', image: null };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('Tous');

  const list = recipes.filter(
    (r) => r.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'Tous' || r.category === filter)
  );
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const reset = () => { setForm(empty); setEditingId(null); };

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      notify('error', "Échec : le fichier choisi n'est pas une image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify('error', 'Échec : la photo est trop lourde (2 Mo maximum).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: reader.result }));
    reader.onerror = () => notify('error', 'Échec : impossible de lire la photo.');
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name || !form.time || Number(form.time) <= 0) {
      notify('error', 'Échec : indiquez un nom et une durée de préparation en minutes.');
      return;
    }
    if (recipes.some((r) => r.name.toLowerCase() === name.toLowerCase() && r.id !== editingId)) {
      notify('error', `Échec : la recette « ${name} » existe déjà.`);
      return;
    }
    const data = { name, category: form.category, time: Number(form.time), image: form.image };
    if (editingId) {
      setRecipes(recipes.map((r) => (r.id === editingId ? { ...r, ...data } : r)));
      notify('success', `Recette « ${name} » modifiée avec succès.`);
    } else {
      setRecipes([...recipes, { id: Date.now(), planned: 0, published: true, ...data }]);
      notify('success', `Recette « ${name} » ajoutée avec succès.`);
    }
    reset();
  };

  const edit = (r) => {
    setEditingId(r.id);
    setForm({ name: r.name, category: r.category, time: String(r.time), image: r.image });
  };

  const togglePublish = (r) => {
    setRecipes(recipes.map((x) => (x.id === r.id ? { ...x, published: !x.published } : x)));
    notify('success', r.published ? `Recette « ${r.name} » masquée.` : `Recette « ${r.name} » publiée.`);
  };

  const remove = (r) =>
    ask({
      title: 'Supprimer la recette',
      message: `Voulez-vous vraiment supprimer « ${r.name} » ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      danger: true,
      onConfirm: () => {
        setRecipes(recipes.filter((x) => x.id !== r.id));
        notify('success', `Recette « ${r.name} » supprimée avec succès.`);
      },
    });

  return (
    <>
      <section className="adm-panel">
        <h3>{editingId ? 'Modifier la recette' : 'Ajouter une recette'}</h3>
        <form className="adm-form-row" onSubmit={submit}>
          <input className="adm-input" placeholder="Nom de la recette" value={form.name} onChange={set('name')} />
          <select className="adm-input" value={form.category} onChange={set('category')}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="adm-input" type="number" min="1" placeholder="Durée (min)" value={form.time} onChange={set('time')} />
          <label className="adm-file">
            <input type="file" accept="image/*" onChange={onFile} />
            <span>{form.image ? 'Changer la photo' : 'Choisir une photo'}</span>
          </label>
          <button type="submit" className="adm-green-btn">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
          {editingId && <button type="button" className="adm-btn" onClick={reset}>Annuler</button>}
        </form>
        {form.image && (
          <div className="adm-preview">
            <img src={form.image} alt="Aperçu de la photo choisie" />
            <button type="button" className="adm-btn" onClick={() => setForm({ ...form, image: null })}>Retirer la photo</button>
          </div>
        )}
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <h3>Catalogue ({list.length})</h3>
          <div className="adm-tabs">
            {['Tous', ...CATEGORIES].map((c) => (
              <button key={c} className={`adm-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>
        {list.length === 0 && <p className="adm-muted">Aucune recette ne correspond à cette recherche.</p>}
        <div className="adm-recipe-grid">
          {list.map((r) => (
            <article className={`adm-recipe ${r.published ? '' : 'hidden'}`} key={r.id}>
              <img src={photoFor(r)} alt={r.name} />
              <h4>{r.name}</h4>
              <div className="adm-recipe-meta">
                <span className="adm-chip">{r.category}</span>
                <span>{r.time} min</span>
                {!r.published && <span className="adm-chip off">Masquée</span>}
              </div>
              <div className="adm-actions">
                <button className="adm-btn" onClick={() => edit(r)}>Modifier</button>
                <button className="adm-btn" onClick={() => togglePublish(r)}>{r.published ? 'Masquer' : 'Publier'}</button>
                <button className="adm-btn adm-btn-danger-outline" onClick={() => remove(r)}>Supprimer</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

/* ---------- Ingrédients ---------- */
function Ingredients({ ingredients, setIngredients, query, notify, ask }) {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('g');

  const list = ingredients.filter((i) => i.name.toLowerCase().includes(query.toLowerCase()));

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n || stock === '' || Number(stock) < 0) {
      notify('error', 'Échec : indiquez un nom et une quantité en stock.');
      return;
    }
    if (ingredients.some((i) => i.name.toLowerCase() === n.toLowerCase())) {
      notify('error', `Échec : l'ingrédient « ${n} » existe déjà.`);
      return;
    }
    setIngredients([...ingredients, { id: Date.now(), name: n, stock: Number(stock), unit }]);
    notify('success', `Ingrédient « ${n} » ajouté avec succès.`);
    setName(''); setStock('');
  };

  const remove = (i) =>
    ask({
      title: "Supprimer l'ingrédient",
      message: `Voulez-vous vraiment supprimer « ${i.name} » ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      danger: true,
      onConfirm: () => {
        setIngredients(ingredients.filter((x) => x.id !== i.id));
        notify('success', `Ingrédient « ${i.name} » supprimé avec succès.`);
      },
    });

  return (
    <>
      <section className="adm-panel">
        <h3>Ajouter un ingrédient</h3>
        <form className="adm-form-row" onSubmit={submit}>
          <input className="adm-input" placeholder="Nom de l'ingrédient" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="adm-input" type="number" min="0" placeholder="Quantité" value={stock} onChange={(e) => setStock(e.target.value)} />
          <select className="adm-input" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {['g', 'kg', 'ml', 'l', 'pièce'].map((u) => <option key={u}>{u}</option>)}
          </select>
          <button type="submit" className="adm-green-btn">Ajouter</button>
        </form>
      </section>

      <section className="adm-panel">
        <h3>Ingrédients ({list.length})</h3>
        <div className="adm-table-scroll">
          <table className="adm-table">
            <thead><tr><th>Ingrédient</th><th>Stock</th><th>État</th><th>Actions</th></tr></thead>
            <tbody>
              {list.length === 0 && <tr><td colSpan="4" className="adm-empty">Aucun ingrédient ne correspond à cette recherche.</td></tr>}
              {list.map((i) => (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>
                    <input className="adm-input adm-stock" type="number" min="0" value={i.stock}
                      onChange={(e) => setIngredients(ingredients.map((x) => (x.id === i.id ? { ...x, stock: Math.max(0, Number(e.target.value)) } : x)))} />
                    {' '}{i.unit}
                  </td>
                  <td><span className={`adm-badge ${i.stock > 0 ? 'adm-badge-actif' : 'adm-badge-suspendu'}`}>{i.stock > 0 ? 'En stock' : 'Rupture'}</span></td>
                  <td className="adm-actions">
                    <button className="adm-btn adm-btn-danger-outline" onClick={() => remove(i)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

/* ---------- Utilisateurs ---------- */
function Users({ users, setUsers, query, notify, ask }) {
  const emptyUser = { name: '', email: '', role: 'Utilisateur', password: '' };
  const [form, setForm] = useState(emptyUser);
  const setField = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const addUser = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    if (!name || !email || !form.password) {
      notify('error', 'Échec : renseignez le nom, l\'e-mail et le mot de passe.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notify('error', "Échec : l'adresse e-mail n'est pas valide.");
      return;
    }
    if (form.password.length < 6) {
      notify('error', 'Échec : le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email)) {
      notify('error', `Échec : un compte existe déjà avec l'adresse ${email}.`);
      return;
    }
    // TODO : POST /api/admin/users/ (Django) avec le mot de passe
    setUsers([...users, { id: Date.now(), name, email, role: form.role, status: 'actif', joined: new Date().toISOString().slice(0, 10), menus: 0 }]);
    notify('success', `Utilisateur ${name} ajouté avec succès.`);
    setForm(emptyUser);
  };

  const list = useMemo(() => {
    const s = query.trim().toLowerCase();
    return users.filter((u) => !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }, [users, query]);

  const activeAdmins = users.filter((u) => u.role === 'Administrateur' && u.status === 'actif').length;
  const isLastAdmin = (u) => u.role === 'Administrateur' && u.status === 'actif' && activeAdmins <= 1;
  const patch = (id, changes) => setUsers(users.map((u) => (u.id === id ? { ...u, ...changes } : u)));

  const toggleStatus = (u) => {
    if (u.status === 'actif' && isLastAdmin(u)) {
      notify('error', "Échec : impossible de suspendre le dernier administrateur actif.");
      return;
    }
    patch(u.id, { status: u.status === 'actif' ? 'suspendu' : 'actif' });
    notify('success', u.status === 'actif' ? `Compte de ${u.name} suspendu.` : `Compte de ${u.name} réactivé.`);
  };

  const toggleRole = (u) => {
    if (u.role === 'Administrateur' && isLastAdmin(u)) {
      notify('error', "Échec : au moins un administrateur actif est requis.");
      return;
    }
    patch(u.id, { role: u.role === 'Administrateur' ? 'Utilisateur' : 'Administrateur' });
    notify('success', u.role === 'Administrateur' ? `${u.name} n'est plus administrateur.` : `${u.name} est maintenant administrateur.`);
  };

  const remove = (u) => {
    if (isLastAdmin(u)) {
      notify('error', 'Échec : impossible de supprimer le dernier administrateur actif.');
      return;
    }
    ask({
      title: "Supprimer l'utilisateur",
      message: `Voulez-vous vraiment supprimer le compte de ${u.name} (${u.email}) ? Cette action est irréversible.`,
      confirmLabel: 'Supprimer',
      danger: true,
      onConfirm: () => {
        setUsers(users.filter((x) => x.id !== u.id));
        notify('success', `Compte de ${u.name} supprimé avec succès.`);
      },
    });
  };

  return (
    <>
    <section className="adm-panel">
      <h3>Ajouter un utilisateur</h3>
      <form className="adm-form-row adm-user-form" onSubmit={addUser} autoComplete="off">
        <input className="adm-input" placeholder="Nom et prénom" value={form.name} onChange={setField('name')} />
        <input className="adm-input" type="email" placeholder="Adresse e-mail" value={form.email} onChange={setField('email')} />
        <input className="adm-input" type="password" placeholder="Mot de passe (6 caractères min.)" autoComplete="new-password" value={form.password} onChange={setField('password')} />
        <select className="adm-input" value={form.role} onChange={setField('role')}>
          <option>Utilisateur</option>
          <option>Administrateur</option>
        </select>
        <button type="submit" className="adm-green-btn">Ajouter</button>
      </form>
    </section>

    <section className="adm-panel">
      <h3>Utilisateurs ({list.length})</h3>
      <div className="adm-table-scroll">
        <table className="adm-table">
          <thead><tr><th>Nom</th><th>E-mail</th><th>Rôle</th><th>Statut</th><th>Menus</th><th>Actions</th></tr></thead>
          <tbody>
            {list.length === 0 && <tr><td colSpan="6" className="adm-empty">Aucun utilisateur ne correspond à cette recherche.</td></tr>}
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td><span className={`adm-badge adm-badge-${u.status}`}>{u.status}</span></td>
                <td>{u.menus}</td>
                <td className="adm-actions">
                  <button className="adm-btn" onClick={() => toggleStatus(u)}>{u.status === 'actif' ? 'Suspendre' : 'Réactiver'}</button>
                  <button className="adm-btn" onClick={() => toggleRole(u)}>{u.role === 'Administrateur' ? 'Retirer admin' : 'Nommer admin'}</button>
                  <button className="adm-btn adm-btn-danger-outline" onClick={() => remove(u)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </>
  );
}

/* ---------- Paramètres ---------- */
function Settings({ notify }) {
  const [registration, setRegistration] = useState(true);
  const [google, setGoogle] = useState(true);

  return (
    <section className="adm-panel">
      <h3>Paramètres de l'application</h3>
      <label className="adm-switch-row"><input type="checkbox" checked={registration} onChange={(e) => setRegistration(e.target.checked)} /> Autoriser les nouvelles inscriptions</label>
      <label className="adm-switch-row"><input type="checkbox" checked={google} onChange={(e) => setGoogle(e.target.checked)} /> Autoriser la connexion avec Google</label>
      <button className="adm-green-btn" onClick={() => notify('success', 'Paramètres enregistrés avec succès.')}>Enregistrer les paramètres</button>
    </section>
  );
}

/* ---------- Composant principal ---------- */
export default function AdminDashboard({ onLogout }) {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState(INITIAL_USERS);
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [toast, setToast] = useState(null);   // { id, type: 'success' | 'error', text }
  const [dialog, setDialog] = useState(null); // { title, message, confirmLabel, danger, onConfirm }

  const notify = (type, text) => setToast({ id: Date.now(), type, text });
  const ask = (cfg) => setDialog(cfg);

  // le message disparaît seul après 4 secondes
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} onBack={onLogout} />;

  const go = (key) => { setTab(key); setQuery(''); };
  const searchable = ['recipes', 'ingredients', 'users'].includes(tab);
  const placeholders = { recipes: 'Rechercher une recette', ingredients: 'Rechercher un ingrédient', users: 'Rechercher un utilisateur' };

  const confirmLogout = () =>
    ask({
      title: 'Se déconnecter',
      message: "Voulez-vous vraiment vous déconnecter de l'espace administrateur ?",
      confirmLabel: 'Se déconnecter',
      danger: false,
      onConfirm: onLogout,
    });

  const runDialog = () => {
    const action = dialog.onConfirm;
    setDialog(null);
    action();
  };

  return (
    <div className={`adm-layout ${dark ? 'dark' : ''}`}>
      <aside className="adm-sidebar">
        <img src={logoBlanc} alt="MiamPlan" className="adm-logo" />
        <nav>
          {NAV.map((n) => (
            <button key={n.key} className={`adm-nav-item ${tab === n.key ? 'active' : ''}`} onClick={() => go(n.key)}>
              <Icon name={n.key} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="adm-profile">
          <span className="adm-avatar">AD</span>
          <div><strong>Administrateur</strong><span>Admin</span></div>
        </div>
        <button className="adm-nav-item adm-logout" onClick={confirmLogout}><Icon name="logout" /> Déconnexion</button>
      </aside>

      <main className="adm-main">
        <header className="adm-topbar">
          <label className="adm-search">
            <Icon name="search" />
            <input
              placeholder={searchable ? placeholders[tab] : 'Recherche disponible dans Recettes, Ingrédients et Utilisateurs'}
              value={query} onChange={(e) => setQuery(e.target.value)} disabled={!searchable} />
          </label>
          <button className="adm-mode" onClick={() => setDark(!dark)} aria-label="Changer de mode">
            <span>{dark ? 'Mode nuit' : 'Mode jour'}</span>
            <Icon name={dark ? 'moon' : 'sun'} size={16} />
          </button>
          <button className="adm-bell" aria-label="Notifications"><Icon name="bell" size={20} /></button>
          <span className="adm-avatar">AD</span>
        </header>

        {tab === 'dashboard' && <Overview users={users} recipes={recipes} ingredients={ingredients} go={go} />}
        {tab === 'recipes' && <Recipes recipes={recipes} setRecipes={setRecipes} query={query} notify={notify} ask={ask} />}
        {tab === 'ingredients' && <Ingredients ingredients={ingredients} setIngredients={setIngredients} query={query} notify={notify} ask={ask} />}
        {tab === 'users' && <Users users={users} setUsers={setUsers} query={query} notify={notify} ask={ask} />}
        {tab === 'settings' && <Settings notify={notify} />}
      </main>

      {toast && (
        <div key={toast.id} className={`adm-toast ${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
          <span>{toast.text}</span>
          <button onClick={() => setToast(null)} aria-label="Fermer le message">×</button>
        </div>
      )}

      {dialog && (
        <div className="adm-overlay" onClick={() => setDialog(null)}>
          <div className="adm-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            <div className="adm-dialog-actions">
              <button className="adm-btn" onClick={() => setDialog(null)}>Annuler</button>
              <button className={dialog.danger ? 'adm-btn adm-btn-danger' : 'adm-green-btn'} onClick={runDialog}>
                {dialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}