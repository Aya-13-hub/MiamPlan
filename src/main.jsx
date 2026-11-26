import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

/*
  Pages du site (une page = une adresse) :
    /        → accueil            (src/pages/home.jsx)
    /login   → connexion / inscription / mot de passe oublié / espace admin (src/App.jsx)
  Chaque page est chargée séparément, donc App.css et home.css ne se mélangent pas.
  Autres pages à tester (remplacer le chargement ci-dessous) :
    ./PreviewIngredients.jsx, ./Planning/Planning.jsx, ./ListeCourses/ListeCourses.jsx
*/
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const isLoginPage = path === '/login'

const loadPage = isLoginPage ? import('./App.jsx') : import('./pages/home.jsx')

// Sur l'accueil : relie les boutons de la page à la page /login
function linkHomeButtons() {
  document.addEventListener('click', (event) => {
    const el = event.target.closest('a, button')
    if (!el) return
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase()

    let target = null
    if (text === 'connexion' || text.includes('déjà un compte')) {
      target = '/login'
    } else if (text === 'inscription' || text.startsWith('commencer gratuitement')) {
      target = '/login?mode=signup'
    }

    if (target) {
      event.preventDefault()
      window.location.assign(target)
    }
  })
}

loadPage.then(({ default: Page }) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
  if (!isLoginPage) linkHomeButtons()
})