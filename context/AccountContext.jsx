import { createContext, useContext } from "react";

export const AccountContext = createContext();
export const useAccount =()=> useContext(AccountContext);