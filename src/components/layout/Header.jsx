import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useAccount } from '../../../context/AccountContext';
import { getQuarterDates } from '../../../utils/dates';
import Button from '../ui/Button';
import { Sun, Moon, CalendarDays, UserCircle } from 'lucide-react';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { account, selectedQuarter } = useAccount();
  const quarterData = getQuarterDates(selectedQuarter);

  return (
    <header className={`${theme === 'dark' ? 'bg-[#2C2C2C]' : 'bg-white'} shadow-lg border-b-4 border-[#5A827E] transition-all duration-300`}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6">
            <h1 className={`text-2xl font-extrabold ${theme === 'dark' ? 'text-[#FAFFCA]' : 'text-[#5A827E]'} tracking-wide uppercase`}>
              ÉCHELLE DES INTÉRÊTS
            </h1>
            {selectedQuarter && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-[#84AE92] bg-[#4B6B68] text-[#B9D4AA] hover:bg-[#84AE92] hover:text-[#FAFFCA]' : 'border-[#5A827E] bg-[#84AE92] text-[#2C2C2C] hover:bg-[#5A827E] hover:text-[#EEEEEE]'} cursor-pointer transition-all duration-200`}>
                <CalendarDays className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {selectedQuarter === 'Q1' ? '31/03/2025' : 
                    selectedQuarter === 'Q2' ? '30/06/2025' : 
                    selectedQuarter === 'Q3' ? '30/09/2025' : '31/12/2025'} -{quarterData?.label}-
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {account?.raisonSociale && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-[#84AE92] bg-[#4B6B68] text-[#EEEEEE] hover:bg-[#84AE92] hover:text-[#FAFFCA]' : 'border-[#5A827E] bg-[#84AE92] text-[#2C2C2C] hover:bg-[#5A827E] hover:text-[#EEEEEE]'} cursor-pointer transition-all duration-200`}>
                <UserCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">
                  {account.raisonSociale} -{account.numeroCompte}-
                </span>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-[#84AE92] hover:text-[#FAFFCA] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-[#FAFFCA]" /> : <Moon className="w-5 h-5 text-[#5A827E]" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};