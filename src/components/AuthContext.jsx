import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext({ role: null, setRole: () => {} });

export function AuthProvider({ children }) {
  const [role, setRoleState] = useState(() => localStorage.getItem('role'))    // 'admin' | 'user' | undefined

  // useEffect(() => {
  //   const savedRole = localStorage.getItem('role');
  //   setRoleState(savedRole || null);
  // }, []);

  const setRole = (newRole) => {
    if (newRole) {
      localStorage.setItem('role', newRole);
    } else {
      localStorage.removeItem('role');
    }
    setRoleState(newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
