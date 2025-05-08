import React, { useState, useMemo } from 'react';
import { Link } from "react-router";

const home = () => {
 // Dummy data baru: setiap user memiliki array sales
 const userData = [
  {
    id: 'u1',
    name: 'Teddy Pratama',
    sales: [
      { date: '2025-04-07', attendance: '08:15', products: [ { name: 'kopi 1', ambil: 28, kembali: 6, revenue: 140000 }, { name: 'kopi 2', ambil: 26, kembali: 5, revenue: 130000 }, { name: 'kopi 3', ambil: 18, kembali: 4, revenue: 90000 }, ] },
      { date: '2025-04-06', attendance: '08:10', products: [ { name: 'kopi 1', ambil: 22, kembali: 4, revenue: 110000 }, { name: 'kopi 2', ambil: 24, kembali: 6, revenue: 120000 }, { name: 'kopi 3', ambil: 16, kembali: 3, revenue: 80000 }, ] },
      { date: '2025-04-05', attendance: '08:05', products: [ { name: 'kopi 1', ambil: 30, kembali: 8, revenue: 150000 }, { name: 'kopi 2', ambil: 25, kembali: 5, revenue: 125000 }, { name: 'kopi 3', ambil: 20, kembali: 2, revenue: 100000 }, ] },
      { date: '2025-04-04', attendance: '08:20', products: [ { name: 'kopi 1', ambil: 18, kembali: 2, revenue: 90000 }, { name: 'kopi 2', ambil: 20, kembali: 0, revenue: 100000 }, { name: 'kopi 3', ambil: 14, kembali: 7, revenue: 70000 }, ] },
      { date: '2025-04-03', attendance: '08:00', products: [ { name: 'kopi 1', ambil: 25, kembali: 5, revenue: 125000 }, { name: 'kopi 2', ambil: 22, kembali: 6, revenue: 110000 }, { name: 'kopi 3', ambil: 12, kembali: 3, revenue: 60000 }, ] },
      { date: '2025-04-02', attendance: '08:12', products: [ { name: 'kopi 1', ambil: 15, kembali: 2, revenue: 75000 }, { name: 'kopi 2', ambil: 18, kembali: 4, revenue: 90000 }, { name: 'kopi 3', ambil: 10, kembali: 1, revenue: 50000 }, ] },
      { date: '2025-04-01', attendance: '08:30', products: [ { name: 'kopi 1', ambil: 20, kembali: 10, revenue: 100000 }, { name: 'kopi 2', ambil: 20, kembali: 5, revenue: 50000 }, { name: 'kopi 3', ambil: 20, kembali: 8, revenue: 80000 }, ] },
    ],
  },
  {
    id: 'u2',
    name: 'Siti Aisyah',
    sales: [
      { date: '2025-04-07', attendance: '08:25', products: [ { name: 'kopi 1', ambil: 18, kembali: 3, revenue: 90000 }, { name: 'kopi 2', ambil: 20, kembali: 2, revenue: 100000 }, { name: 'kopi 3', ambil: 14, kembali: 6, revenue: 70000 }, ] },
      { date: '2025-04-06', attendance: '08:18', products: [ { name: 'kopi 1', ambil: 22, kembali: 5, revenue: 110000 }, { name: 'kopi 2', ambil: 24, kembali: 4, revenue: 120000 }, { name: 'kopi 3', ambil: 16, kembali: 2, revenue: 80000 }, ] },
      { date: '2025-04-05', attendance: '08:22', products: [ { name: 'kopi 1', ambil: 30, kembali: 12, revenue: 150000 }, { name: 'kopi 2', ambil: 25, kembali: 10, revenue: 125000 }, { name: 'kopi 3', ambil: 20, kembali: 5, revenue: 100000 }, ] },
      { date: '2025-04-04', attendance: '08:05', products: [ { name: 'kopi 1', ambil: 18, kembali: 1, revenue: 90000 }, { name: 'kopi 2', ambil: 20, kembali: 3, revenue: 100000 }, { name: 'kopi 3', ambil: 14, kembali: 4, revenue: 70000 }, ] },
      { date: '2025-04-03', attendance: '08:30', products: [ { name: 'kopi 1', ambil: 25, kembali: 7, revenue: 125000 }, { name: 'kopi 2', ambil: 22, kembali: 6, revenue: 110000 }, { name: 'kopi 3', ambil: 12, kembali: 4, revenue: 60000 }, ] },
      { date: '2025-04-02', attendance: '08:02', products: [ { name: 'kopi 1', ambil: 15, kembali: 3, revenue: 75000 }, { name: 'kopi 2', ambil: 18, kembali: 5, revenue: 90000 }, { name: 'kopi 3', ambil: 10, kembali: 2, revenue: 50000 }, ] },
      { date: '2025-04-01', attendance: '08:20', products: [ { name: 'kopi 1', ambil: 20, kembali: 8, revenue: 100000 }, { name: 'kopi 2', ambil: 20, kembali: 4, revenue: 50000 }, { name: 'kopi 3', ambil: 20, kembali: 7, revenue: 80000 }, ] },
    ],
  },
];

// State filter nama user
const [filterName, setFilterName] = useState('');
const filteredUsers = useMemo(() => {
  const term = filterName.toLowerCase().trim();
  if (!term) return userData;
  return userData.filter(u => u.name.toLowerCase().includes(term));
}, [filterName]);


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
              to={`/admin/user/${user.id}`} 
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
                      <span className="font-medium">{entry.attendance}</span>
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