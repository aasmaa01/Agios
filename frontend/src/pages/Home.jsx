// Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../../context/ThemeContext.jsx';

function Home() {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className={`page-container ${darkMode ? "dark" : ""}`}>
      <h1 className="page-title page-title-large">
        Bienvenue sur <span className="page-subtitle">Échelle des Intérêts</span>
      </h1>
      <Link to="/dashboard" className="btn-primary">
        Accéder au Dashboard
      </Link>
    </div>
  );
}

export default Home;