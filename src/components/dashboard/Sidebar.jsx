import {
  AppleIcon,
  BasketIcon,
  CalendarIcon,
  ChefHatIcon,
  DashboardGridIcon,
  LogoutIcon,
  UserCircleIcon,
} from './DashboardIcons'
import logoWhite from '../../assets/logos/logo-white.png'

const NAV_ITEMS = [
  { id: 'dashboard', Icon: DashboardGridIcon },
  { id: 'recettes', Icon: ChefHatIcon },
  { id: 'ingredients', Icon: AppleIcon },
  { id: 'planning', Icon: CalendarIcon },
  { id: 'courses', Icon: BasketIcon },
  { id: 'profil', Icon: UserCircleIcon },
]

export default function Sidebar({
  activeTab,
  onNavigate,
  onLogout,
  user,
  labels,
  isOpen,
  onClose,
}) {
  return (
    <>
      {isOpen && (
        <div
          className="mp-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside className={`mp-sidebar ${isOpen ? 'mp-sidebar--open' : ''}`}>
        <div className="mp-sidebar-top">
          <button
            type="button"
            className="mp-brand-btn"
            onClick={() => {
              onNavigate('dashboard')
              onClose()
            }}
            aria-label="MiamPlan Dashboard"
          >
            <img
              src={logoWhite}
              alt="MiamPlan"
              className="mp-sidebar-logo-img"
            />
          </button>

          <nav className="mp-nav" aria-label="Navigation principale">
            {NAV_ITEMS.map(({ id, Icon }) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  type="button"
                  className={`mp-nav-item ${isActive ? 'mp-nav-item--active' : ''}`}
                  onClick={() => {
                    onNavigate(id)
                    onClose()
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="mp-nav-icon">
                    <Icon size={20} />
                  </span>
                  <span className="mp-nav-label">{labels.nav[id]}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="mp-sidebar-footer">
          <div className="mp-sidebar-divider" />
          <button
            type="button"
            className="mp-sidebar-user"
            onClick={() => {
              onNavigate('profil')
              onClose()
            }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="mp-sidebar-avatar"
            />
            <div className="mp-sidebar-user-meta">
              <span className="mp-sidebar-user-name">{user.name}</span>
              <span className="mp-sidebar-user-role">{user.role}</span>
            </div>
          </button>

          <div className="mp-sidebar-divider" />
          <button
            type="button"
            className="mp-logout-btn"
            onClick={onLogout}
          >
            <LogoutIcon size={20} />
            <span>{labels.logout}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
