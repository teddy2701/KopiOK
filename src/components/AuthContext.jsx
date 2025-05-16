import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    accessToken: null,
    loading: true
  });
  
  const navigate = useNavigate();
  const location = useLocation();

  const refreshToken = async () => {
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

      // Auto redirect setelah refresh token
      if (['/', '/login'].includes(location.pathname)) {
        navigate(decoded.role === "admin" ? "/admin" : "/user", { replace: true });
      }

      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  const login = (token, userData) => {
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

    navigate(userData.role === "admin" ? "/admin" : "/user", { replace: true });
  };

  const logout = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_LINK + '/auth/logout', 
        {}, 
        {  }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setAuthState({
      accessToken: null,
      user: null,
      loading: false
    });
    
    navigate('/', { replace: true });
  };

  const checkAuth = async () => {
    try {
      // Jika sudah ada access token yang valid
      if (authState.accessToken) {
        const decoded = jwtDecode(authState.accessToken);
        if (decoded.exp * 1000 > Date.now()) return true;
      }
      
      // Jika tidak ada token atau expired, refresh
      return await refreshToken();
    } catch (error) {
      console.error("Check auth error:", error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuth();
    };
    
    // Jalankan pengecekan auth saat path berubah
    initializeAuth();
  }, [location.pathname]);

  // Axios response interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          const success = await refreshToken();
          if (success) {
            originalRequest.headers.Authorization = `Bearer ${authState.accessToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [authState.accessToken]);

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