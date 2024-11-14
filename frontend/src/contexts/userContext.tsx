import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { UserData } from '../interfaces';


// Create a context with initial data
const UserContext = createContext<{
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}>({
  user: null,
  setUser: () => null,
});

// Context provider component
export const UserProvider: React.FC<{children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}; 

// Custom hook to access the user context
export const useUser = () => {
  return useContext(UserContext);
};
