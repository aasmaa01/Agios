import React from 'react';
import { useTheme } from '../../../context/ThemeContext'; // Assuming you have a ThemeContext set up
import { useAccount } from '../../../context/AccountContext'; // Assuming you have an AccountContext
import { getQuarterDates } from '../../../utils/dates';
import  Button from '../ui/Button'; // Importing the Button component
import { Sun, Moon } from 'lucide-react'; // Replace 'lucide-react' with the actual library


export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { account, selectedQuarter } = useAccount();
  const quarterData = getQuarterDates(selectedQuarter);
  
  return (
    <header className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} shadow-lg border-b-4 border-[#5A827E]`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'}`}>
              ÉCHELLE DES INTÉRÊTS
            </h1>
            <span className={`ml-4 text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-600'}`}>
              AU {selectedQuarter === 'Q1' ? '31/03/2025' : 
                  selectedQuarter === 'Q2' ? '30/06/2025' : 
                  selectedQuarter === 'Q3' ? '30/09/2025' : '31/12/2025'} ({quarterData?.label})
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {account?.raisonSociale && (
              <div className={`text-sm ${theme === 'dark' ? 'text-[#B9D4AA]' : 'text-gray-600'}`}>
                {account.raisonSociale} ({account.numeroCompte})
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};