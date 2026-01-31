import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import Button from '../ui/Button'; // Assuming you have a Button component


const QuarterForm = ({ onQuarterSubmit }) => {
  const { theme } = useTheme();
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onQuarterSubmit(selectedQuarter);
  };
  
  const quarters = [
    { value: 'Q1', label: 'Q1 2025 (01/01 au 31/03)', end: '31/03/2025' },
    { value: 'Q2', label: 'Q2 2025 (01/04 au 30/06)', end: '30/06/2025' },
    { value: 'Q3', label: 'Q3 2025 (01/07 au 30/09)', end: '30/09/2025' },
    { value: 'Q4', label: 'Q4 2025 (01/10 au 31/12)', end: '31/12/2025' }
  ];
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-6 max-w-md mx-auto`}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
        Sélection du Trimestre
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
            Trimestre
          </label>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
              theme === 'dark' 
                ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {quarters.map(quarter => (
              <option key={quarter.value} value={quarter.value}>
                {quarter.label}
              </option>
            ))}
          </select>
        </div>
        
        <Button type="submit" className="w-full">
          Sélectionner le Trimestre
        </Button>
      </form>
    </div>
  );
};


export default QuarterForm;