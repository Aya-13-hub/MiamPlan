import { useState } from "react";
import "./home.css";

/* ── Inline SVG Icons (Zero external dependencies) ── */
const MenuIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const ArrowRightIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

const ClockIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

const HeartIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const StarIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MailIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const SendIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
  </svg>
);

/* ── recipe data ── */
const recipes = [
  {
    id: 1,
    name: "Salade",
    time: "10 min",
    likes: "1.2k",
    rating: "4.8",
    image: "/assets/recipes/salade.png",
    tags: ["Végétarien", "Healthy"],
  },
  {
    id: 2,
    name: "Pasta",
    time: "25 min",
    likes: "1.1k",
    rating: "4.6",
    image: "/assets/recipes/pasta.png",
    tags: ["Italien"],
  },
  {
    id: 3,
    name: "Paella",
    time: "45 min",
    likes: "980",
    rating: "4.7",
    image: "/assets/recipes/paella.png",
    tags: ["Espagnole"],
  },
  {
    id: 4,
    name: "Dumplings",
    time: "30 min",
    likes: "1.5k",
    rating: "4.9",
    image: "/assets/recipes/dumplings.png",
    tags: ["Asiatique"],
  },
];

/* ════════════════════════════════════════════════════════════════
   Home Page
   ════════════════════════════════════════════════════════════════ */
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="home-page">
      {/* ═══════════ NAVBAR ═══════════ */}
      <header className="navbar">
        <a href="#accueil" className="navbar-logo" onClick={closeMenu}>
          <img src="/assets/logos/logo-green.png" alt="MiamPlan" />
        </a>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <XIcon size={26} /> : <MenuIcon size={26} />}
        </button>

        <nav className={`nav-links${menuOpen ? " open" : ""}`}>
          <a href="#accueil" className="active" onClick={closeMenu}>
            Accueil
          </a>
          <a href="#fonctions" onClick={closeMenu}>
            Fonctions
          </a>
          <a href="#recettes" onClick={closeMenu}>
            Recettes
          </a>

          {/* connexion/inscription inside mobile menu */}
          <div className="mobile-auth">
            <a href="/login" className="btn-connexion">
              Connexion
            </a>
            <a href="/register" className="btn-inscription">
              Inscription
            </a>
          </div>
        </nav>

        <div className="auth-buttons">
          <a href="/login" className="btn-connexion">
            Connexion
          </a>
          <a href="/register" className="btn-inscription">
            Inscription
          </a>
        </div>
      </header>

      <main>
        {/* ═══════════ HERO ═══════════ */}
        <section className="hero" id="accueil">
          <div className="hero-content">
            <h1>
              Planifier vos repas,
              <br />
              <span className="hero-italic">savourer la vie</span>
            </h1>

            <p className="hero-description">
              Créez un menu équilibré et découvrez des centaines de recettes
              adaptées à votre goût, le tout en un seul endroit.
            </p>

            <div className="hero-features">
              <div className="hero-feature">
                <div className="hero-feature-bar" />
                <div>
                  <strong>Recettes</strong>
                  <span>1 000+ recettes disponibles.</span>
                </div>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-bar" />
                <div>
                  <strong>Planification</strong>
                  <span>Organisez vos repas facilement.</span>
                </div>
              </div>

              <div className="hero-feature">
                <div className="hero-feature-bar" />
                <div>
                  <strong>Liste des courses</strong>
                  <span>Générez vos courses automatiquement.</span>
                </div>
              </div>
            </div>

            <div className="hero-actions">
              <a href="#fonctions" className="btn-primary">
                Commencer gratuitement
                <ArrowRightIcon size={18} />
              </a>
              <a href="/login" className="btn-link">
                J&apos;ai déjà un compte
              </a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <img
                src="/assets/hero/hero-bowl.jpg"
                alt="Bowl au quinoa"
                className="hero-image"
              />
            </div>

            {/* floating badges */}
            <div className="badge badge-top">
              <span className="badge-label">REPAS DU JOUR</span>
              <span className="badge-value">Bowl au quinoa</span>
            </div>

            <div className="badge badge-bottom-left">
              <span className="badge-rating">4.9 / 5</span>
              <span className="badge-users">2000+ UTILISATEURS</span>
            </div>

            <div className="badge badge-bottom-right">
              <ClockIcon size={15} />
              <span>Prêt en 20 min</span>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS BAR ═══════════ */}
        <section className="stats-bar">
          <div className="stat">
            <strong>2000+</strong>
            <span>Utilisateurs actifs</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <strong>1000+</strong>
            <span>recettes disponible.</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <strong>4.9&nbsp;★</strong>
            <span>Note moyenne</span>
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section className="features-section" id="fonctions">
          <span className="section-tag">Pourquoi MiamPlan ?</span>

          <h2 className="features-title">
            Tout ce dont vous avez besoin,{" "}
            <strong>
              réuni
              <br />
              en un seul endroit
            </strong>
          </h2>

          <p className="section-subtitle">
            De la planification à l&apos;assiette, nous simplifions chaque étape
            de votre quotidien culinaire
          </p>

          <div className="features-grid">
            <article className="feature-card">
              <img
                src="/assets/icons/icon-planification.png"
                alt=""
                className="feature-icon"
              />
              <h3>Planification hebdomadaire</h3>
              <p>
                Organisez vos repas pour toute la semaine en quelques clics.
                Notre interface intuitive vous guide pas à pas pour un planning
                équilibré et savoureux.
              </p>
            </article>

            <article className="feature-card">
              <img
                src="/assets/icons/icon-menus.png"
                alt=""
                className="feature-icon"
              />
              <h3>Menus personnalisés</h3>
              <p>
                Adaptez vos menus selon vos préférences et objectifs
                nutritionnels. Chaque plan est unique, comme vous.
              </p>
            </article>

            <article className="feature-card">
              <img
                src="/assets/icons/icon-courses.png"
                alt=""
                className="feature-icon"
              />
              <h3>Listes des courses</h3>
              <p>
                Générez automatiquement votre liste de courses à partir de vos
                menus planifiés. Plus les oublis et les allers-retours au
                supermarché.
              </p>
            </article>
          </div>
        </section>

        {/* ═══════════ RECIPES ═══════════ */}
        <section className="recipes-section" id="recettes">
          <div className="recipes-header">
            <div>
              <span className="section-tag">Nos recettes</span>
              <h2 className="recipes-title">Inspirations de la semaine</h2>
            </div>
            <a href="#recettes" className="btn-primary btn-sm">
              Découvrir notre application
              <ArrowRightIcon size={16} />
            </a>
          </div>

          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <article className="recipe-card" key={recipe.id}>
                <div className="recipe-image">
                  <img src={recipe.image} alt={recipe.name} />
                  <div className="recipe-tags">
                    {recipe.tags.map((tag) => (
                      <span className="recipe-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="recipe-body">
                  <h3>{recipe.name}</h3>
                  <div className="recipe-stats">
                    <span>
                      <ClockIcon size={14} />
                      {recipe.time}
                    </span>
                    <span>
                      <HeartIcon size={14} />
                      {recipe.likes}
                    </span>
                    <span>
                      <StarIcon size={14} />
                      {recipe.rating}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src="/assets/logos/logo-white.png"
              alt="MiamPlan"
              className="footer-logo"
            />
            <p>
              Planifiez vos repas, simplifiez votre vie.{" "}
              <strong>Manger bien n&apos;a jamais été aussi facile.</strong>
            </p>
            <div className="footer-social">
              <a href="mailto:contact@miamplan.com" aria-label="Email">
                <MailIcon size={18} />
              </a>
              <a href="#" aria-label="Message">
                <SendIcon size={18} />
              </a>
            </div>
          </div>

          <nav className="footer-nav">
            <a href="#accueil">Accueil</a>
            <a href="#fonctions">Fonctions</a>
            <a href="#recettes">Recettes</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© MiamPlan. Tous les droits réservés.</span>
          <div className="footer-legal">
            <a href="#">Conditions</a>
            <a href="#">Confidentialité</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
