import React, {useState, useMemo, useEffect} from 'react'
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import AlertModal from '../../components/AlertModal';

const Home = () => {
    const {user} = useAuth();
    const [historyData, setHistoryData] = useState([]);
     const [alert, setAlert] = useState({
            show: false,
            message: '',
            type: 'info'
        })
  
   useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/sale/history/${user.id}`, {
                    withCredentials: true,
                });
                setHistoryData(data);
                console.log(data)
            } catch (error) {
                console.error('Error fetching history data:', error);
                setAlert({
                    show: true,
                    message: error.response?.data?.message || 'Terjadi kesalahan saat mengembalikan produk',
                    type: 'error'
                })
            }
        };
        fetchHistory();
    }, []);
 
   // Filter state: 'all', '7', '30'
   const [period, setPeriod] = useState('all');
 
   // Calculate filtered data by period
   const filteredData = useMemo(() => {
     if (period === 'all') return historyData;
     const days = period === '7' ? 7 : 30;
     const cutoff = new Date();
     cutoff.setDate(cutoff.getDate() - days + 1); // include today as day 1
    //  console.log("dari filter:",historyData.filter(day => new Date(day.date) >= cutoff))
     return historyData.filter(day => new Date(day.date) >= cutoff);
   }, [period, historyData]);
 
   // Overall total revenue
   const totalRevenue = filteredData
     .flatMap(day => day.products)
     .reduce((sum, prod) => sum + prod.revenue, 0);
 
  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 lg:p-8">
    <header className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-amber-800">
                Selamat Bekerja, {user.nama}! ☕
            </h1>
            
            <div className="flex gap-2">
                {['all', '7', '30'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            period === p 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-white text-amber-800 hover:bg-amber-100'
                        } border border-amber-200`}
                    >
                        {p === 'all' ? 'Semua' : p === '7' ? '7 Hari' : '30 Hari'}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-6 bg-white rounded-xl p-4 shadow-md border border-amber-200 inline-block">
            <p className="text-lg font-semibold text-amber-800">
                Total Pendapatan: {' '}
                <span className="text-amber-600">
                    Rp{totalRevenue.toLocaleString('id-ID')}
                </span>
            </p>
        </div>
    </header>

    <section className="space-y-6">
        {filteredData.length > 0 ? (
            filteredData.map((day, idx) => {
                const dayTotal = day.products.reduce((sum, p) => sum + p.revenue, 0);
                return (
                    <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-amber-200">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                            <h2 className="text-xl font-semibold text-amber-800">
                                {new Date(day.date).toLocaleDateString('id-ID', {
                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </h2>
                            <span className="text-lg font-medium text-amber-600">
                                Rp{dayTotal.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {day.products.map((prod, pIdx) => (
                                <div key={pIdx} className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-amber-800">{prod.name}</h3>
                                        <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                            Terjual: {prod.ambil - prod.kembali}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-amber-700">
                                        <div className="flex justify-between">
                                            <span>Ambil:</span>
                                            <span className="font-medium">{prod.ambil}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Kembali:</span>
                                            <span className="font-medium">{prod.kembali}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-amber-200 pt-2">
                                            <span>Pendapatan:</span>
                                            <span className="font-semibold">
                                                Rp{prod.revenue.toLocaleString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })
        ) : (
            <div className="text-center py-8 bg-white rounded-xl border border-amber-200">
                <p className="text-amber-600">Tidak ada data untuk periode ini</p>
            </div>
        )}
    </section>
    {alert.show && (
                <AlertModal
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}
</div>
)
}

export default Home