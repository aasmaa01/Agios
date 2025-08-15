import React from 'react';
import { Link } from 'react-router-dom';
function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center text-[#2C2C2C] bg-[#FAFFCA] dark:bg-[#2C2C2C] dark:text-[#B9D4AA]">
      <h1 className="mb-6 text-4xl font-extrabold md:text-5xl">
        Tableau de bord <span className="text-[#5A827E] dark:text-[#84AE92]">Échelle des Intérêts</span>
      </h1>

      <p className="max-w-2xl mb-8 text-lg leading-relaxed md:text-xl">
        Gérez et explorez vos données d'une manière simple et intuitive.  
        Ici, vous pouvez consulter vos informations et suivre vos progrès.
      </p>

      <Link to="/explore"
        className="px-6 py-3 text-lg font-semibold text-white transition-colors rounded-full shadow-lg bg-[#5A827E] hover:bg-[#84AE92]"
      >
        Explorer maintenant
      </Link>
    </div>
  );
}

export default Dashboard;
