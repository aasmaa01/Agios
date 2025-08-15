import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Download, Plus, Trash2, AlertCircle, Moon, Sun, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';
import useStateStorage  from '../hooks/useStateStorage.js'; // Custom hook for state storage
import {AccountContext} from '../context/AccountContext'; // Assuming you have an AccountContext set up
import HandleFileImport from "./components/forms/HandleFileImport";
import Button from './components/ui/Button'; // Importing the Button component
import Alert from './components/ui/Alert'; // Importing the Alert component
import { calculateDaysDifference, getQuarterDates, isDateInQuarter } from '../utils/dates.js'; // Importing utility functions
import {calculateInterest} from '../utils/calc.js'; // Importing the calculateInterest function
import {formatCurrency, formatDate, parseDate} from '../utils/format.js'; // Importing formatting utilities
import {Header} from './components/layout/Header.jsx'; // Importing the Header component
import QuarterForm  from '/src/components/forms/QuarterForm.jsx'; // Importing the QuarterForm component
import AccountForm from '/src/components/forms/AccountForm.jsx';
import ThemeContext from '../context/ThemeContext'; 
import ConfigurationTable from  './components/tables/ConfigurationTable.jsx'; // Importing the ConfigurationTable component
import MovementsTable from './components/tables/MovementsTable.jsx'; // Importing the
import SummaryTable from './components/tables/SummaryTable.jsx'; // Importing the SummaryTable component

// Main App Component
const App = () => {
  const [theme, setTheme] = useState('light');
  const [step, setStep] = useState('quarter'); // 'quarter', 'account', 'dashboard'
  const [selectedQuarter, setSelectedQuarter] = useState('Q1');
  const [account, setAccount] = useState(null);
  const [alert, setAlert] = useState(null);
  
  // Configuration data
  const [taux, setTaux] = useStateStorage(`taux_${selectedQuarter}`, 8.50);
  const [frais, setFrais] = useStateStorage(`frais_${selectedQuarter}`, 1500.0);
  const [tvaRate, setTvaRate] = useStateStorage('tva_rate', 19.0);
  
  // Movements data
  const [movements, setMovements] = useStateStorage(`movements_${selectedQuarter}`, []);
  const [soldeDepart, setSoldeDepart] = useStateStorage(`solde_depart_${selectedQuarter}`, 0);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleQuarterSubmit = (quarter) => {
    setSelectedQuarter(quarter);
    setStep('account');
  };
  
  const handleAccountSubmit = (accountData) => {
    setAccount(accountData);
    setStep('dashboard');
  };
  
  // Auto-dismiss alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);
  
  const themeValue = {
    theme,
    toggleTheme
  };
  
  const accountValue = {
    account,
    selectedQuarter
  };
  
  return (
    <ThemeContext.Provider value={themeValue}>
      <AccountContext.Provider value={accountValue}>
        <div className={`min-h-screen transition-colors duration-200 ${
          theme === 'dark' ? 'bg-[#1C1C1C] text-[#EEEEEE]' : 'bg-[#FAFFCA] text-gray-900'
        }`}>
          
          {step !== 'quarter' && <Header />}
          
          <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {alert && (
              <Alert type={alert.type} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            )}
            
            {step === 'quarter' && (
              <div className="flex items-center justify-center min-h-screen">
                <QuarterForm onQuarterSubmit={handleQuarterSubmit} />
              </div>
            )}
            
            {step === 'account' && (
              <div className="flex items-center justify-center min-h-screen">
                <AccountForm onAccountSubmit={handleAccountSubmit} />
              </div>
            )}
            
            {step === 'dashboard' && (
              <div className="space-y-6">
                <ConfigurationTable 
                  taux={taux} 
                  setTaux={setTaux}
                  frais={frais}
                  setFrais={setFrais}
                  tvaRate={tvaRate}
                  setTvaRate={setTvaRate}
                  selectedQuarter={selectedQuarter}
                  alert={alert}
                  setAlert={setAlert}
                />
                
                <MovementsTable 
                  movements={movements}
                  setMovements={setMovements}
                  taux={taux}
                  selectedQuarter={selectedQuarter}
                  alert={alert}
                  setAlert={setAlert}
                  soldeDepart={soldeDepart}
                  setSoldeDepart={setSoldeDepart}
                />
                
                <SummaryTable 
                  movements={movements}
                  frais={frais}
                  tvaRate={tvaRate}
                />
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setStep('quarter');
                      setAccount(null);
                    }}
                  >
                    Changer de Trimestre
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => {
                      setStep('account');
                      setAccount(null);
                    }}
                  >
                    Changer de Compte
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </AccountContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;