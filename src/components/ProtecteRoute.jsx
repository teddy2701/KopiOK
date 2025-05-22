// src/ProtectedRoute.jsx
import React, {useState, useEffect} from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router'
import { useAuth } from './AuthContext'


const ProtecteRoute = ({ allowedRoles }) => {
  const { user  } = useAuth()
  const location = useLocation()

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