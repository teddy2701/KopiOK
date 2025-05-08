// src/ProtectedRoute.jsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './AuthContext'


const ProtecteRoute = ({ allowedRoles }) => {
  const { role } = useAuth()
  const location = useLocation()

  // 1) Belum login
  if (!role) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    )
  }

  // 2) Sudah login tapi role tidak terdaftar di allowedRoles
  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role)
  ) {
    // bisa juga diarahkan ke /not-authorized atau semacamnya
    return <Navigate to="/" replace />
  }

  // 3) Lolos semua, render children melalui Outlet
  return <Outlet />
}

export default ProtecteRoute