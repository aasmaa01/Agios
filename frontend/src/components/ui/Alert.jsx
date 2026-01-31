import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from "../../context/ThemeContext";

const Alert = ({ children, type = 'info', onClose }) => {
  const { theme } = useTheme();

  const types = {
    info: theme === 'dark' ? 'bg-blue-900 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800',
    warning: theme === 'dark' ? 'bg-yellow-900 border-yellow-700 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: theme === 'dark' ? 'bg-red-900 border-red-700 text-red-300' : 'bg-red-50 border-red-200 text-red-800',
    success: theme === 'dark' ? 'bg-green-900 border-green-700 text-green-300' : 'bg-green-50 border-green-200 text-green-800'
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${types[type]} mb-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <div>{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4 text-current hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
