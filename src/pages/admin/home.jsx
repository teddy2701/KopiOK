import React, { useState, useMemo, useEffect } from 'react';
import { Link } from "react-router";
import axios from 'axios';

const home = () => {
  const [userData, setUserData] = useState([]);

  useEffect(()=>{
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + '/sale/history/', { withCredentials: true });
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [])


// State filter nama user
const [filterName, setFilterName] = useState('');
const filteredUsers = useMemo(() => {
  const term = filterName.toLowerCase().trim();
  if (!term) return userData;
  return userData.filter(u => u.name.toLowerCase().includes(term));
}, [filterName, userData]);


  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-amber-50">
    {/* Header dan filter */}
    <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <h1 className="text-2xl md:text-3xl font-semibold text-amber-800">Dashboard Admin Kopi OK</h1>
      <input
        type="text"
        placeholder="Cari nama karyawan..."
        className="px-4 py-2 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        value={filterName}
        onChange={e => setFilterName(e.target.value)}
      />
    </header>

    {/* List user */}
    <section className="space-y-6">
      {filteredUsers.map(user => (
        <div key={user.id} className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-amber-800">{user.name}</h2>
            <Link 
              to={`/admin/detail/${user.id}`} 
              className="text-amber-700 hover:text-amber-900 font-medium"
            >
              Lihat Detail →
            </Link>
          </div>

          {/* Kartu penjualan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.sales.slice(0,7).map((entry, idx) => {
              const totalRevenue = entry.products.reduce((sum, p) => sum + p.revenue, 0);
              const totalReturns = entry.products.reduce((sum, p) => sum + (p.ambil - p.kembali), 0);
              
              return (
                <div key={idx} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800">
                    {new Date(entry.date).toLocaleDateString('id-ID', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </h3>
                  <div className="mt-2 text-amber-700 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>⏰ Absensi:</span>
                      <span className="font-medium">{entry.absenMasuk}</span>
                    </div>
                    <div className="border-t border-amber-200 pt-2">
                      <div className="flex justify-between text-sm">
                        <span>🍵 Terjual:</span>
                        <span className="font-medium">{totalReturns} pcs</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>💰 Pendapatan:</span>
                        <span className="font-medium">Rp{totalRevenue.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredUsers.length === 0 && (
        <div className="text-center text-amber-600 py-8 bg-amber-100 rounded-xl">
          Tidak menemukan karyawan
        </div>
      )}
    </section>
  </div>
  )
}

export default home