import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";

import App from './App.jsx'
import { Home, Registrasi, Detail } from './pages/admin/index.js'
import { Home as UserHome, DropFrom, PickupForm, Absen, Riwayat, CorrectSalesPage, SalesPageReport } from './pages/user/index.js'
import {Produksi, BahanBaku} from './pages/produksi/index.js'

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
                <Route path="detail/:userId" element={<Detail />} />
              </Route>
            </Route>
            <Route element={<ProtecteRoute allowedRoles={['user']} />}>
              {/* User */}
              <Route path="user">
                <Route index element={<UserHome />} />
                <Route path="riwayat" element={<Riwayat />} />
                <Route path="report/:id" element={<SalesPageReport />} />
                <Route path="pengecekan" element={<CorrectSalesPage />} />
                <Route path="pengembalian" element={<DropFrom />} />
                <Route path="pengambilan" element={<PickupForm />} />
                <Route path="absen" element={<Absen />} />
              </Route>
            </Route>
            <Route element={<ProtecteRoute allowedRoles={['produksi']} />}>
              {/* User */}
              <Route path="produksi">
                <Route index element={<Produksi />} />
                <Route path="inventory" element={<BahanBaku />} />
              
              </Route>
            </Route>
          </Routes>
        </ClientLayout>
      </ClientProvider>
    </BrowserRouter>

  </StrictMode>,
)
