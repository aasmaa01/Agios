import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext'; // Assuming you have a ThemeContext set up  
import Button from '../ui/Button'; // Importing the Button component
import { Settings } from 'lucide-react'; // Importing the Settings icon




const ConfigurationTable = ({ taux, setTaux, frais, setFrais, tvaRate, setTvaRate, selectedQuarter, alert, setAlert }) => {
  const { theme } = useTheme();
  const [showConfig, setShowConfig] = useState(false);
  
  const handleTauxChange = (newTaux) => {
    setAlert({
      type: 'warning',
      message: 'Vous modifiez le taux d\'intérêt pour ce trimestre.'
    });
    setTaux(newTaux);
  };
  
  const handleFraisChange = (newFrais) => {
    setAlert({
      type: 'warning',
      message: 'Vous modifiez les frais pour ce trimestre.'
    });
    setFrais(newFrais);
  };
  
  if (!showConfig) {
    return (
      <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-4`}>
        <Button 
          variant="secondary" 
          onClick={() => setShowConfig(true)}
          className="flex items-center"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configuration du Trimestre
        </Button>
      </div>
    );
  }
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
          Configuration du Trimestre {selectedQuarter}
        </h3>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => setShowConfig(false)}
        >
          Masquer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Taux d'Intérêt (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={taux}
            onChange={(e) => handleTauxChange(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark' 
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Frais Trimestre (DZD)
          </label>
          <input
            type="number"
            step="0.01"
            value={frais}
            onChange={(e) => handleFraisChange(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark' 
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Taux TVA (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={tvaRate}
            onChange={(e) => setTvaRate(parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark' 
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default  ConfigurationTable;