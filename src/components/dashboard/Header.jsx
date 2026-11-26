import { useState, useRef, useEffect } from 'react'
import {
  BellIcon,
  MenuIcon,
  SearchIcon,
} from './DashboardIcons'

export default function Header({
  searchQuery,
  onSearchChange,
  language,
  onLanguageChange,
  notifications,
  user,
  labels,
  onOpenMenu,
  onNavigate,
}) {
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  return (
    <header className="mp-header">
      <div className="mp-header-left">
        <button
          type="button"
          className="mp-menu-toggle"
          onClick={onOpenMenu}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon size={22} />
        </button>

        <div className="mp-search-wrap">
          <span className="mp-search-icon">
            <SearchIcon size={18} />
          </span>
          <input
            type="search"
            className="mp-search-input"
            placeholder={labels.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={labels.searchPlaceholder}
          />
        </div>
      </div>

      <div className="mp-header-actions">
        <div className="mp-lang-switch" role="group" aria-label="Langue">
          <button
            type="button"
            className={`mp-lang-btn ${language === 'fr' ? 'mp-lang-btn--active' : ''}`}
            onClick={() => onLanguageChange('fr')}
          >
            FR
          </button>
          <button
            type="button"
            className={`mp-lang-btn ${language === 'en' ? 'mp-lang-btn--active' : ''}`}
            onClick={() => onLanguageChange('en')}
          >
            EN
          </button>
        </div>

        <div className="mp-notif-wrap" ref={notifRef}>
          <button
            type="button"
            className="mp-notif-btn"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <BellIcon size={21} />
            <span className="mp-notif-dot" aria-hidden="true" />
          </button>

          {notifOpen && (
            <div className="mp-notif-popover" role="dialog" aria-label="Notifications">
              <div className="mp-notif-header">Notifications</div>
              <ul className="mp-notif-list">
                {notifications.map((item) => (
                  <li key={item.id} className="mp-notif-item">
                    <div className="mp-notif-title">{item.title}</div>
                    <div className="mp-notif-detail">{item.detail}</div>
                    <div className="mp-notif-time">{item.time}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="button"
          className="mp-header-avatar-btn"
          onClick={() => onNavigate('profil')}
          aria-label={user.name}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="mp-header-avatar"
          />
        </button>
      </div>
    </header>
  )
}
