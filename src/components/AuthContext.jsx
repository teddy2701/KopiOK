import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from "react-router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    loading: true
  });
  const roleRoutes = {
    admin: '/admin',
    user: '/user',
    produksi: '/produksi',
  };
  const authStateRef = useRef(authState);


  const navigate = useNavigate();
  // const location = useLocation();
  
  const logout = useCallback(async () => {
    try {
      await axios.get(
        import.meta.env.VITE_BACKEND_LINK + '/auth/logout',
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    setAuthState({
      accessToken: null,
      user: null,
      loading: false
    });
  }, [navigate]);


  const refreshToken = useCallback(async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_LINK + '/auth/me',
        { withCredentials: true }
      );
      if (!response.data?.accessToken) throw new Error('Token refresh failed');

      const decoded = jwtDecode(response.data.accessToken);

      setAuthState({
        accessToken: response.data.accessToken,
        user: {
          id: decoded.id,
          username: decoded.username,
          role: decoded.role,
          nama: decoded.nama
        },
        loading: false
      });

      return true;
    } catch (error) {
      logout();
 
      return false;
    }
  }, [logout]);

  const login = useCallback((token, userData) => {
    const decoded = jwtDecode(token);
    setAuthState({
      accessToken: token,
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        nama: decoded.nama
      },
      loading: false
    });
    const target = roleRoutes[userData.role] || '/login';
    navigate(target, { replace: true });
  }, [navigate]);



  const checkAuth = useCallback(async () => {
    try {
      if (authStateRef.current.accessToken) {
        const decoded = jwtDecode(authStateRef.current.accessToken);
        if (decoded.exp * 1000 > Date.now()) return true;
      }
      const token = await refreshToken();
      return token;
    } catch (error) {
      console.error("Check auth error:", error);
      return false;
    }
  }, [refreshToken]);

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();
  }, [checkAuth]);

  // Axios response interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        // Hentikan loop jika request ke endpoint logout
        if (originalRequest.url.includes('/auth/logout')) {
          return Promise.reject(error);
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const success = await refreshToken();
          if (success) {
            originalRequest.headers.Authorization = `Bearer ${authStateRef.current.accessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        checkAuth
      }}
    >
      {authState.loading ? (
        <div className="flex justify-center items-center h-screen">

        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}