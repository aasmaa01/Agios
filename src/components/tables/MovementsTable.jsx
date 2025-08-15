import React, { useEffect } from 'react';
import { Plus, Trash2, Upload, Download } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../../utils/format';
import { getQuarterDates, isDateInQuarter } from '../../../utils/dates';
import calculateInterest from '../../../utils/calc';
import Button from '../ui/Button'; // Importing the Button component
 

const MovementsTable = ({ movements, setMovements, taux, selectedQuarter, alert, setAlert, soldeDepart, setSoldeDepart }) => {
  const { theme } = useTheme();
  
  const addMovement = () => {
    const newMovement = {
      id: Date.now(),
      dateSaisie: new Date().toISOString().split('T')[0],
      mouvement: 0,
      solde: 0,
      dateValeur: '',
      ecart: 0,
      tauxApplique: taux,
      interet: 0
    };
    setMovements([...movements, newMovement]);
  };
  
  const deleteMovement = (id) => {
    setMovements(movements.filter(m => m.id !== id));
  };
  
  const updateMovement = (id, field, value) => {
    setMovements(movements.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        
        // Alert for taux modification
        if (field === 'tauxApplique' && value !== taux) {
          setAlert({
            type: 'warning',
            message: 'Vous modifiez le taux d\'intérêt pour ce mouvement spécifique.'
          });
        }
        
        // Validate date
        if (field === 'dateValeur' && updated.dateValeur) {
          if (!isDateInQuarter(updated.dateValeur, selectedQuarter)) {
            setAlert({
              type: 'warning',
              message: `La date ${formatDate(updated.dateValeur)} n'est pas dans le trimestre sélectionné.`
            });
          }
        }
        
        return updated;
      }
      return m;
    }));
  };
  
  // Recalculate all dependent values when movements change
  useEffect(() => {
    if (movements.length === 0) return;
    
    // Sort movements by date value
    const sortedMovements = [...movements].sort((a, b) => {
      if (!a.dateValeur) return 1;
      if (!b.dateValeur) return -1;
      return new Date(a.dateValeur) - new Date(b.dateValeur);
    });
    
    let runningBalance = soldeDepart;
    const updatedMovements = sortedMovements.map((movement, index) => {
      runningBalance += parseFloat(movement.mouvement || 0);
      
      // Calculate ecart (days to next movement)
      let ecart = 0;
      if (index < sortedMovements.length - 1 && movement.dateValeur && sortedMovements[index + 1].dateValeur) {
        ecart = calculateDaysDifference(movement.dateValeur, sortedMovements[index + 1].dateValeur);
      } else if (movement.dateValeur) {
        // For last movement, calculate to end of quarter
        const quarterData = getQuarterDates(selectedQuarter);
        ecart = calculateDaysDifference(movement.dateValeur, quarterData.end);
      }
      
      // Calculate interest
      const interet = calculateInterest(runningBalance, movement.tauxApplique || taux, ecart);
      
      return {
        ...movement,
        solde: runningBalance,
        ecart,
        interet
      };
    });
    
    // Only update if there are actual changes
    const hasChanges = JSON.stringify(updatedMovements) !== JSON.stringify(sortedMovements);
    if (hasChanges) {
      setMovements(updatedMovements);
    }
  }, [movements.length, movements.map(m => `${m.mouvement}-${m.dateValeur}-${m.tauxApplique}`).join(','), taux, selectedQuarter, soldeDepart]);
  

const handleFileImport = async (event) => {
  
  
  const file = event.target.files[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (jsonData.length < 2) {
      setAlert({
        type: 'error',
        message: "Le fichier doit contenir au moins une ligne de données en plus de l'en-tête."
      });
      return;
    }

    const quarterData = getQuarterDates(selectedQuarter);
    const importedMovements = [];

    const parseExcelDate = (cell) => {
      if (!cell) return '';
      let parsedDate = null;
      if (typeof cell === 'number') {
        parsedDate = new Date((cell - 25569) * 86400 * 1000);
      } else if (typeof cell === 'string') {
        parsedDate = new Date(cell);
        if (isNaN(parsedDate.getTime())) {
          const parts = cell.split('/');
          if (parts.length === 3) {
            parsedDate = new Date(parts[2], parts[1] - 1, parts[0]);
          }
        }
      }
      return parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toISOString().split('T')[0]
        : '';
    };

for (let i = 1; i < jsonData.length; i++) {
  const row = jsonData[i];
  if (!row || row.length < 2) continue;

  const dateSaisieStr = parseExcelDate(row[0]);
  const mouvement = parseFloat(
    String(row[1]).replace(/[^\d,-]/g, '').replace(',', '.')
  ) || 0;

  let dateValeurStr = parseExcelDate(row[2]);
  if (!dateValeurStr && row[3]) {
    dateValeurStr = parseExcelDate(row[3]);
  }

  const dateValeurObj = new Date(dateValeurStr);
  if (isNaN(dateValeurObj)) continue; // skip invalid date

  // filter in range
  if (
    mouvement !== 0 &&
    dateValeurObj >= quarterData.start &&
    dateValeurObj <= quarterData.end &&
    (!dateSaisieStr || new Date(dateSaisieStr) <= quarterData.end)

  ) {
    importedMovements.push({
      id: Date.now() + i,
      dateSaisie: dateSaisieStr,
      dateValeur: dateValeurStr,
      mouvement,
      solde: 0,
      ecart: 0,
      tauxApplique: taux,
      interet: 0
    });
  }
}



    if (importedMovements.length === 0) {
      setAlert({
        type: 'error',
        message: `Aucun mouvement trouvé dans le trimestre sélectionné (${quarterData.label}).`
      });
      return;
    }

    // الترتيب حسب Date saisie (لأن الفلترة عليها)
    importedMovements.sort((a, b) => new Date(a.dateSaisie) - new Date(b.dateSaisie));

    setMovements(importedMovements);

    setAlert({
      type: 'success',
      message: `Import réussi: ${importedMovements.length} mouvements importés du trimestre ${selectedQuarter}.`
    });
  } // <-- move this brace here

  catch (error) {
    console.error('Import error:', error);
    setAlert({
      type: 'error',
      message: 'Erreur lors de la lecture du fichier. Vérifiez le format du fichier.'
    });
  }

  event.target.value = '';
};






  const formatNumber = (value) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const exportToExcel = () => {
  const exportData = [
    ['Solde de Départ', formatNumber(soldeDepart), '', '', '', '', ''],
    ['Date Saisie', 'Mouvement (DZD)', 'Solde (DZD)', 'Date Valeur', 'Écart (jours)', 'Taux (%)', 'Intérêt (DZD)'],
    ...movements.map(m => [
      formatDate(m.dateSaisie),
      formatNumber(m.mouvement),
      formatNumber(m.solde),
      formatDate(m.dateValeur),
      m.ecart,
      m.tauxApplique,
      formatNumber(m.interet)
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Échelle Intérêts');
  XLSX.writeFile(wb, `echelle-interets-${selectedQuarter}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

  
  return (
    <div className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
          Mouvements Bancaires
        </h3>
        <div className="flex space-x-2">
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx,.xls,.csv" 
            onChange={handleFileImport} 
            id="file-input"
          />
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => document.getElementById('file-input').click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Importer Excel
          </Button>
          <Button onClick={addMovement} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <Button 
            variant="secondary" 
            size="sm"
            onClick={exportToExcel}
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter Excel
          </Button>
        </div>
      </div>
      
      {/* Solde de départ */}
      <div className="mb-4">
        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
          Solde de Départ (DZD)
        </label>
        <input
          type="number"
          step="0.01"
          value={soldeDepart}
          onChange={(e) => setSoldeDepart(parseFloat(e.target.value) || 0)}
          className={`w-48 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A827E] ${
            theme === 'dark' 
              ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          placeholder="Solde initial"
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-[#5A827E]' : 'bg-[#5A827E]'} text-white`}>
              <th className="px-3 py-2 text-sm font-medium text-left">Date Saisie</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Mouvement (DZD)</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Solde (DZD)</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Date Valeur</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Écart (jours)</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Taux (%)</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Intérêt (DZD)</th>
              <th className="px-3 py-2 text-sm font-medium text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement, index) => (
              <tr 
                key={movement.id} 
                className={`border-b ${
                  theme === 'dark' 
                    ? 'border-gray-700 hover:bg-gray-800' 
                    : 'border-gray-200 hover:bg-gray-50'
                } ${movement.solde < 0 ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
              >
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={movement.dateSaisie}
                    onChange={(e) => updateMovement(movement.id, 'dateSaisie', e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#5A827E] ${
                      theme === 'dark' 
                        ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={movement.mouvement}
                    onChange={(e) => updateMovement(movement.id, 'mouvement', parseFloat(e.target.value) || 0)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#5A827E] ${
                      theme === 'dark' 
                        ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </td>
                <td className={`px-3 py-2 text-sm font-medium ${movement.solde < 0 ? 'text-red-600' : theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-900'}`}>
                  {formatCurrency(movement.solde)}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="date"
                    value={movement.dateValeur}
                    onChange={(e) => updateMovement(movement.id, 'dateValeur', e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#5A827E] ${
                      theme === 'dark' 
                        ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      movement.dateValeur && !isDateInQuarter(movement.dateValeur, selectedQuarter) 
                        ? 'border-yellow-500' 
                        : ''
                    }`}
                  />
                </td>
                <td className={`px-3 py-2 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-700'}`}>
                  {movement.ecart}
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={movement.tauxApplique}
                    onChange={(e) => updateMovement(movement.id, 'tauxApplique', parseFloat(e.target.value) || 0)}
                    className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[#5A827E] ${
                      theme === 'dark' 
                        ? 'bg-[#2C2C2C] border-gray-600 text-[#EEEEEE]' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } ${
                      movement.tauxApplique !== taux ? 'border-yellow-500' : ''
                    }`}
                  />
                </td>
                <td className={`px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-900'}`}>
                  {formatCurrency(movement.interet)}
                </td>
                <td className="px-3 py-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteMovement(movement.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {movements.length === 0 && (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-500'}`}>
          Aucun mouvement ajouté. Cliquez sur "Ajouter" ou importez un fichier Excel.
        </div>
      )}
    </div>
  );
};

export default MovementsTable;