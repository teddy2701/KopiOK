import React,  { useState } from 'react'
import { NavLink } from "react-router";
import { useAuth } from './AuthContext';
/**
 * Props:
 * - role: 'admin' | 'user' | undefined
 */
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    // Define menu items based on role
    const { user, logout } = useAuth();
    const role = user?.role; // Ambil role dari user yang sudah login


    const menuItems = {
      admin: [
        { label: 'Home', href: '/admin' },
        { label: 'Data Pegawai', href: '/admin/pegawai' },
       
      ],
      user: [
        { label: 'Home', href: '/user' },
        { label: 'Absen', href: '/user/absen' },
        { label: 'Pengecekan', href: '/user/pengecekan' },
        { label: 'Riwayat', href: '/user/riwayat' },
        { label: 'Ambil Barang', href: '/user/pengambilan' },
        { label: 'Pengembalian Barang', href: '/user/pengembalian' },
      ],
      produksi: [
        { label: 'Home', href: '/produksi' },
        { label: 'Inventory', href: '/produksi/inventory' },
      ],
    
    };
    const items = menuItems[role];
    if (!items) return null;

    const handleLogout = () => {
    logout(); 

    }


  return (
    <nav className="bg-amber-700 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <NavLink to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">☕</span>
            Kopi OK
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {items.map((item) => (
            <NavLink 
              key={item.href} 
              to={item.href}
              className={({ isActive }) => 
                `px-3 py-2 rounded-md transition ${isActive ? 'bg-amber-600' : 'hover:bg-amber-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md hover:bg-amber-600"
            >
              Logout
            </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-amber-600 focus:outline-none"
          >
                 <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
          </button>
        </div>
      </div>
    </div>

    {/* Mobile Menu */}
    {isOpen && (
      <div className="md:hidden bg-amber-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${isActive ? 'bg-amber-600' : 'hover:bg-amber-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}

              {/* Logout mobile */}
              <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md hover:bg-amber-600"
            >
              Logout
            </button>
        </div>
      </div>
    )}
  </nav>
  )
}

export default Navbar