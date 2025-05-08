import React, {useState} from 'react'
import { useNavigate } from "react-router";
import { useAuth } from './components/AuthContext';

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const { setRole } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = {username:'teddy', role: 'admin'} // dummy data
    navigate("/admin", { replace: true });
    setRole(data.role);
  }

  const handleMaster = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = {username:'teddy', role: 'admin'} // dummy data
    navigate("/admin", { replace: true });
    setRole(data.role);
  }

  const handleUser = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const data = {username:'teddy', role: 'user'} // dummy data
    navigate("/user", { replace: true });
    setRole(data.role);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
    <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-amber-200">
        <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-amber-800">☕ Kopi OK</h1>
            <p className="text-amber-600 mt-2">Masuk ke akun Anda</p>
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-amber-700 mb-2">Username</label>
                <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Masukkan username"
                />
            </div>
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-amber-700 mb-2">Password</label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="••••••••"
                />
            </div>
            
            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
                {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <p className="text-amber-600 mt-2 text-center">Tombol dibawah ini hanya untuk demo</p>

            <div className="flex flex-col sm:flex-row gap-3">
                <button 
                    onClick={handleMaster} 
                    className="w-full py-2 border-2 border-amber-500 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition-colors"
                >
                    Akses Master
                </button>
                <button 
                    onClick={handleUser} 
                    className="w-full py-2 border-2 border-amber-500 text-amber-600 font-medium rounded-lg hover:bg-amber-100 transition-colors"
                >
                    Akses User
                </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </form>
    </div>
</div>
  )
}

export default App
