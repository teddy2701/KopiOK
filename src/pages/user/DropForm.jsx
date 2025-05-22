import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';
import AlertModal from '../../components/AlertModal';
import { useNavigate } from 'react-router';

const DropForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [option, setOption] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  // Fetch available materials and products for return
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_LINK}/sale/get/final/${user.id}`
        );

        const first = (data.options || [])[0] || null;
        console.log(data.options)
        setOption(first);
      } catch (err) {
        console.log('Error fetching return options:', err);
        setAlert({ show: true, message: 'Gagal memuat data return', type: 'error' });
      }
    };
    fetchOptions();
  }, [user.id]);
  useEffect(() => {
    if (!option) return;
    const init = {};
    (option.materials || []).forEach(m => { init[m.materialId] = 0; });
    (option.products || []).forEach(p => { init[p.productId] = 0; });
    setForm(init);
  }, [option]);

  const handleChange = (id, value) => {
    setForm(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (!option) return;
      const mats = (option.materials || [])
        .map(m => ({ materialId: m.materialId, quantity: form[m.materialId] }))
        .filter(i => i.quantity > 0);
      const prods = (option.products || [])
        .map(p => ({ productId: p.productId, quantity: form[p.productId] }))
        .filter(i => i.quantity > 0);

      
      const saveDrop = await axios.post(
        `${import.meta.env.VITE_BACKEND_LINK}/sale/kembali`,
        {
          userId: user.id,
          pengambilanId: option.pengambilanId,
          penjualanFinalId: option.penjualanFinalID,
          note,
          materials: mats,
          products: prods
        }
      );
      setAlert({ show: true, message: 'Pengembalian berhasil', type: 'success' });


      // Redirect ke halaman pengembalian, passing hanya finalId
      navigate('/user/report/' + saveDrop.data.retur[0].penjualanFinalId);
    } catch (err) {
      console.log(err);
      setAlert({ show: true, message: 'Gagal memproses pengembalian', type: 'error' });
    }
  };

  if (!option) {
    return <p className="text-center py-10">Memuat data pengembalian...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
      <h2 className="text-2xl font-semibold text-amber-800 mb-4">Pengembalian Barang</h2>
      <p className="mb-4 text-amber-700">
        Transaksi: {option?.pengambilanId?.slice(-6)} | Uang Pecah: Rp{(option.uangPecah||0).toLocaleString('id-ID')}
      </p>

      {/* Materials */}
      {(option.materials || []).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-amber-700 mb-2">Materials</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {option.materials.map(m => (
              <div key={m.materialId} className="flex flex-col">
                <label className="text-sm text-amber-700 mb-1">{m.name} ({m.unit})</label>
                <input
                  type="number"
                  min="0"
                  max={m.quantity}
                  value={form[m.materialId] || 0}
                  onChange={e => handleChange(m.materialId, e.target.value)}
                  className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {(option.products || []).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-medium text-amber-700 mb-2">Products</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {option.products.map(p => (
              <div key={p.productId} className="flex flex-col">
                <label className="text-sm text-amber-700 mb-1">{p.name}</label>
                <input
                  type="number"
                  min="0"
                  max={p.quantity}
                  value={form[p.productId] || 0}
                  onChange={e => handleChange(p.productId, e.target.value)}
                  className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-amber-700 mb-1">Catatan</label>
        <textarea
          rows="2"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          placeholder="Alasan pengembalian..."
        />
      </div>

      <button type="submit" className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700">
        Konfirmasi Pengembalian
      </button>

      {alert.show && (
        <AlertModal message={alert.message} type={alert.type} onClose={() => setAlert(prev => ({ ...prev, show: false }))} />
      )}
    </form>
  );
};

export default DropForm;
