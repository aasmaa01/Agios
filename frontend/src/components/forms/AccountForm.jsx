import React from 'react'
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button';


const AccountForm = ({ onAccountSubmit }) => {
  const { theme } = useTheme();
  const [numeroCompte, setNumeroCompte] = useState('');
  const [raisonSociale, setRaisonSociale] = useState('');
  const [showRaisonSociale, setShowRaisonSociale] = useState(false);
  const [accounts] = useState({}); // Simulated accounts storage
  const [numeroError]= useState('Something’s wrong here.');

  
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (numeroCompte.trim()) {
      if (accounts[numeroCompte]) {
        onAccountSubmit({
          numeroCompte,
          raisonSociale: accounts[numeroCompte].raisonSociale
        });
      } else {
        setShowRaisonSociale(true);
      }
    }
  };
  
  const handleNewAccount = (e) => {
    e.preventDefault();
    if (numeroCompte.trim() && raisonSociale.trim()) {
      accounts[numeroCompte] = { raisonSociale };
      onAccountSubmit({ numeroCompte, raisonSociale });
    }
  };
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-6 max-w-md mx-auto`}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
        Connexion au Compte
      </h2>
      
      <form onSubmit={showRaisonSociale ? handleNewAccount : handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Numéro de Compte
          </label>
          <input
            type="text"
            value={numeroCompte}
            onChange={(e) => setNumeroCompte(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark' 
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Entrez votre numéro de compte"
            required
            disabled={showRaisonSociale}
          />
          {/*
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Password 
          </label>
          <input 
            type="password" 
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark'
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`} 
            
            placeholder="Entrez votre mot de passe"
            required
          /> */}
        </div>
        
        {showRaisonSociale && (
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
              Raison Sociale
            </label>
            <input
              type="text"
              value={raisonSociale}
              onChange={(e) => setRaisonSociale(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
                theme === 'dark' 
                  ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Nom du client ou de l'entreprise"
              required
            />
          </div>
        )}
        
        <Button type="submit" className="w-full">
          {showRaisonSociale ? 'Créer le Compte' : 'Se Connecter'}
        </Button>
        
        {showRaisonSociale && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => {
              setShowRaisonSociale(false);
              setRaisonSociale('');
            }}
            className="w-full"
          >
            Retour
          </Button>
        )}
      </form>
    </div>
  );
};

export default AccountForm