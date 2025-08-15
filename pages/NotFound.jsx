
// NotFound.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from '../../../context/ThemeContext.jsx';

function NotFound() {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`page-container ${darkMode ? "dark" : ""}`}>
      <h1 className="page-title page-title-large">
        Page Non Trouvée
      </h1>
      <p className="page-description">
        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" className="btn-primary">
        Retour à l'Accueil
      </Link>
    </div>
  );
}

export default NotFound;
