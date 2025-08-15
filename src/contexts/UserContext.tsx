import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  setUserId: (userId: string) => void;
  clearUserId: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserIdState] = useState<string | null>(() => {
    // 从localStorage获取userId，如果没有则返回null
    return localStorage.getItem('userId');
  });

  const setUserId = (newUserId: string) => {
    setUserIdState(newUserId);
    localStorage.setItem('userId', newUserId);
  };

  const clearUserId = () => {
    setUserIdState(null);
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, clearUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
