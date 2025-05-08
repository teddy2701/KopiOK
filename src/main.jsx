import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";

import App from './App.jsx'
import { Home, Produksi, Registrasi } from './pages/admin/index.js'
import { Home as UserHome, DropFrom, PickupForm } from './pages/user/index.js'

import ClientLayout from './components/ClientLayout.jsx'
import ClientProvider from "./components/ClientProvider.jsx"
import ProtecteRoute from './components/ProtecteRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <BrowserRouter>
      <ClientProvider>
        <ClientLayout>
          <Routes>
            {/* Halaman publik (login) */}
            <Route index element={<App />} />

            {/* Route yang butuh authentication */}
            <Route element={<ProtecteRoute allowedRoles={['admin']} />}>
              {/* Admin */}
              <Route path="admin" >
                <Route index element={<Home />} />
                <Route path="pegawai" element={<Registrasi />} />
                <Route path="produksi" element={<Produksi />} />
              </Route>
            </Route>
            <Route element={<ProtecteRoute allowedRoles={['user']} />}>

              {/* User */}
              <Route path="user">
                <Route index element={<UserHome />} />
                <Route path="pengembalian" element={<DropFrom />} />
                <Route path="pengambilan" element={<PickupForm />} />
              </Route>
            </Route>
          </Routes>
        </ClientLayout>
      </ClientProvider>
    </BrowserRouter>

  </StrictMode>,
)
