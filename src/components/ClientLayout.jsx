import { useAuth } from './AuthContext';
import Layout from './Layout';
import { useLocation } from 'react-router';


export default function ClientLayout({ children }) {
    const { user } = useAuth();
    const role = user?.role; // Ambil role dari user yang sudah login
 
    const { pathname } = useLocation();
    // Tampilkan layout (Navbar + children) hanya jika URL sesuai role
    const showAdmin = role === 'admin' && pathname.startsWith('/admin');
    const showUser = role === 'user' && pathname.startsWith('/user');
    const showProduksi = role === 'produksi' && pathname.startsWith('/produksi');
    if (showAdmin || showUser || showProduksi) {
      return <Layout role={role}>{children}</Layout>;
    }
  
    // Default: render halaman publik (login, landing, dll.) tanpa navbar
    return <>{children}</>;
}
