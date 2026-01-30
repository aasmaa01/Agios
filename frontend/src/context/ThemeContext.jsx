import { createContext, useContext, useState } from 'react';


export const ThemeContext = createContext();
   // const [ThemeContext, setTheme]= useState('light')

export const useTheme = () => useContext(ThemeContext);


export default ThemeContext;
