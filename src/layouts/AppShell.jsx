import { useState } from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Header from '../components/dashboard/Header'
import {
  DASHBOARD_USER,
  NOTIFICATIONS_DATA,
  UI_LABELS,
} from '../data/dashboardData'
import '../pages/Dashboard.css'

export default function AppShell({
  activeTab = 'recettes',
  onNavigate,
  onLogout,
  searchQuery = '',
  onSearchChange,
  children,
}) {
  const [localSearch, setLocalSearch] = useState('')
  const [language, setLanguage] = useState('fr')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)

  const labels = UI_LABELS[language]
  const resolvedSearch = onSearchChange ? searchQuery : localSearch
  const handleSearch = (val) => {
    if (onSearchChange) {
      onSearchChange(val)
    } else {
      setLocalSearch(val)
    }
  }

  const handleNavigate = (tab) => {
    if (onNavigate) {
      onNavigate(tab)
    } else if (tab === 'dashboard') {
      window.history.pushState({}, '', '/dashboard')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (tab === 'recettes') {
      window.history.pushState({}, '', '/app/recipes')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (tab === 'planning' || tab === 'ingredients' || tab === 'courses') {
      window.history.pushState({}, '', `/${tab}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (tab === 'profil') {
      window.history.pushState({}, '', '/profil')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (tab === 'home') {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (tab === 'login' || tab === 'register') {
      window.history.pushState({}, '', `/${tab}`)
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  return (
    <div className="mp-dashboard-shell">
      <Sidebar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onLogout={() => setLogoutModalOpen(true)}
        user={DASHBOARD_USER}
        labels={labels}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="mp-main-area">
        <Header
          searchQuery={resolvedSearch}
          onSearchChange={handleSearch}
          language={language}
          onLanguageChange={setLanguage}
          notifications={NOTIFICATIONS_DATA}
          user={DASHBOARD_USER}
          labels={labels}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
        />

        <main className="mp-main-content">{children}</main>
      </div>

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
                Souhaitez-vous quitter votre session MiamPlan ?
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
                    } else {
                      handleNavigate('home')
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
    </div>
  )
}
