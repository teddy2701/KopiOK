import { useAuth } from './AuthContext';
import Layout from './Layout';
import { useLocation } from 'react-router';


export default function ClientLayout({ children }) {
    const { role } = useAuth();
    const { pathname } = useLocation();
    // Tampilkan layout (Navbar + children) hanya jika URL sesuai role
    const showAdmin = role === 'admin' && pathname.startsWith('/admin');
    const showUser = role === 'user' && pathname.startsWith('/user');
    if (showAdmin || showUser) {
      return <Layout role={role}>{children}</Layout>;
    }
  
    // Default: render halaman publik (login, landing, dll.) tanpa navbar
    return <>{children}</>;
}
