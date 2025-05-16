// src/ProtectedRoute.jsx
import React, {useState, useEffect} from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthContext'


const ProtecteRoute = ({ allowedRoles }) => {
  const { user, checkAuth  } = useAuth()
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth()
      setIsChecking(false)
      
      if (!isAuthenticated) {
        // Trigger logout jika diperlukan
      }
    }
    
    verifyAuth()
  }, [checkAuth])

  // 1) Belum login
  if (!user) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    )
  }

 // 2) Cek role
 if (
  Array.isArray(allowedRoles) &&
  allowedRoles.length > 0 &&
  !allowedRoles.includes(user.role)
) {
  return <Navigate to="/unauthorized" replace />
}


  // 3) Lolos semua, render children melalui Outlet
  return <Outlet />
}

export default ProtecteRoute