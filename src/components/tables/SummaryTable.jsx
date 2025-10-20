import React from 'react';
import {useTheme}  from '../../../context/ThemeContext'; // Importing the ThemeContext
import { formatCurrency, formatDate, parseDate } from '/utils/format.js';
const SummaryTable = ({ movements, frais, tvaRate }) => {
  const { theme } = useTheme();
  
  // Calculer les totaux
  const interetsTotal = movements.reduce((sum, m) => sum + (m.interet || 0), 0);
  const tvaInterets = (interetsTotal * tvaRate) / 100;
  const tvaFrais = (frais * tvaRate) / 100;
  const agios = interetsTotal + tvaInterets + frais + tvaFrais;
  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
        Récapitulatif des Intérêts et Agios
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-[#5A827E]' : 'bg-[#5A827E]'} text-white`}>
              <th className="px-4 py-3 text-sm font-medium text-left">Description</th>
              <th className="px-4 py-3 text-sm font-medium text-right">Montant (DZD)</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
                Intérêts totaux
              </td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
                {formatCurrency(interetsTotal)}
              </td>
            </tr>
            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
                TVA sur intérêts ({tvaRate}%)
              </td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
                {formatCurrency(tvaInterets)}
              </td>
            </tr>
            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
                Frais du trimestre
              </td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
                {formatCurrency(frais)}
              </td>
            </tr>
            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <td className={`px-4 py-3 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
                TVA sur frais ({tvaRate}%)
              </td>
              <td className={`px-4 py-3 text-sm text-right font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
                {formatCurrency(tvaFrais)}
              </td>
            </tr>
            <tr className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} font-bold`}>
              <td className={`px-4 py-4 text-base ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
                AGIOS TOTAL
              </td>
              <td className={`px-4 py-4 text-base text-right ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
                {formatCurrency(agios)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Détails supplémentaires */}
      <div className={`mt-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <div>
            <span className={`${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-600'}`}>Nombre de mouvements:</span>
            <span className={`ml-2 font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
              {movements.length}
            </span>
          </div>
          <div>
            <span className={`${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-600'}`}>Mouvements débiteurs:</span>
            <span className={`ml-2 font-medium ${theme === 'dark' ? 'text-[#EEEEEE]' : 'text-gray-900'}`}>
              {movements.filter(m => m.solde < 0).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SummaryTable;