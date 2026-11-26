import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/home.jsx'
/*import App from './App.jsx'*/
/*import App from './PreviewIngredients.jsx'*/
/*import App from './Planning/Planning.jsx'*/
/*import App from './ListeCourses/ListeCourses.jsx'*/


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
