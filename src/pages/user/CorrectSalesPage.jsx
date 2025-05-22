import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AlertModal from '../../components/AlertModal';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router';


const CorrectSalesPage = () => {
  const { user } = useAuth();
  const [temps, setTemps] = useState([]);
  const [forms, setForms] = useState({});
  const [finalized, setFinalized] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const [expenses, setExpenses] = useState(0);
  const [notesMap, setNotesMap] = useState('');
  const navigate = useNavigate();


  const fetchTemps = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_LINK}/sale/temp/${user.id}`
      );
      // ensure an array

      const list = Array.isArray(data) ? data : [data];
      setTemps(list);

      // init form values and finalized flags
      const initForms = {};
      const initFinal = {};
      list.forEach(t => {
        initFinal[t._id] = false;
        initForms[t._id] = {};
        (t.items || []).forEach(item => {
          initForms[t._id][item.product._id] = item.quantity;
        });
      });
      setForms(initForms);
      setFinalized(initFinal);
    } catch (err) {
      console.log('Error fetching temps:', err);
      setAlert({ show: true, message: err.response?.data?.message || 'Terjadi kesalahan pada server', type: 'error' });
    }
  };

  useEffect(() => {
    fetchTemps();
  }, []);

  const handleChange = (tempId, prodId, value) => {
    setForms(prev => ({
      ...prev,
      [tempId]: { ...prev[tempId], [prodId]: Number(value) }
    }));
  };


  // save all corrections
  const handleSaveAll = async () => {
    try {
      await Promise.all(
        temps.map(t => {
          const items = Object.entries(forms[t._id] || {})
            .map(([productId, quantity]) => ({ productId, quantity }))
            .filter(i => i.quantity > 0);
          return axios.put(
            `${import.meta.env.VITE_BACKEND_LINK}/sale/temp/edit/${t._id}`,
            { userId: user.id, items }
          );
        })
      );
      setAlert({ show: true, message: 'Semua koreksi disimpan', type: 'success' });
      fetchTemps();
    } catch (err) {
      console.log('Error saving all corrections:', err);
      setAlert({ show: true, message: err.response?.data?.message || 'Terjadi kesalahan pada server', type: 'error' });
    }
  };

  // finalize all
  const handleCompleteAll = async () => {
    try {
      // Ambil semua ID penjualan sementara
      const tempIds = temps.map(t => t._id);
      // Panggil endpoint batch finalize
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/sale/simpan/final`,
        {
          userId: user.id, 
          tempIds,
          pengeluaran: Object.values(expenses).reduce((a, b) => a + b, 0),
          note: Object.values(notesMap).join(' | ')
        }
      );
      // data.final adalah dokumen PenjualanFinal hasil agregasi
      const finalId = data.final._id;

      setFinalized(true);
      setAlert({ show: true, message: 'Penjualan direkap menjadi satu final', type: 'success' });

      // Redirect ke halaman pengembalian, passing hanya finalId
      navigate('/user/pengembalian', { state: { penjualanFinalIds: [finalId] } });
    } catch (err) {
      console.log('Error completing all sales:', err);
      setAlert({ show: true, message: err.response?.data?.message || 'Terjadi kesalahan pada server', type: 'error' });
    }
  };

  const handleExpenseChange = ( value) => {
    setExpenses(prev => ({ ...prev, value }));
  };

  const handleNoteChange = ( value) => {
    setNotesMap(prev => ({ ...prev, value }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold text-amber-800">Koreksi & Finalisasi Penjualan</h1>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200">

        {temps.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data penjualan sementara.</p>
        ) : (
          temps.map(temp => (
            <div key={temp._id} className="mb-2">
              <h2 className="text-2xl font-semibold text-amber-800 mb-4">
                {new Date(temp.updatedAt).toLocaleTimeString()}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(temp.items || []).map(item => (
                  <div key={item.product._id} className="flex flex-col">
                    <label className="text-sm text-amber-700 mb-1 truncate">{item.product.name}</label>
                    <input
                      type="number"
                      min="0"
                      value={forms[temp._id]?.[item.product._id] ?? 0}
                      onChange={e => handleChange(temp._id, item.product._id, e.target.value)}
                      className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                ))}
              </div>
            </div>

          ))

        )}

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
                <div className="flex flex-col">
                  <label className="text-sm text-amber-700 mb-1 truncate">Pengeluaran</label>
                  <input
                    type="number"
                    min="0"
                    onChange={e => handleExpenseChange( e.target.value)}
                    className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-amber-700 mb-1 truncate">Catatan</label>
                  <input
                    type="text"
                    onChange={e => handleNoteChange( e.target.value)}
                    className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
      </div>

      {/* Single Save/Complete Buttons */}
      {temps.length > 0 && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSaveAll}
            className="py-3 px-6 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            Simpan Semua Koreksi
          </button>
          <button
            onClick={handleCompleteAll}
            className="py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            Selesaikan Semua Penjualan
          </button>
        </div>
      )}


      {alert.show && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default CorrectSalesPage;
