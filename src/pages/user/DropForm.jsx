import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../components/AuthContext';
import AlertModal from '../../components/AlertModal';


const DropForm = () => {
    const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [note, setNote] = useState('');
  const {user} = useAuth();
    const [alert, setAlert] = useState({
          show: false,
          message: '',
          type: 'info'
      })


  useEffect(() => {
    async function fetchProducts() {
      const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/produk`,{});
      setProducts(data);
      const init = {};
      data.forEach(p => { init[p._id] = p.stock; });
      setForm(init);
    }
    fetchProducts();
  }, []);

  const handleChange = (id, value) => {
    setForm(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleSubmit = async e => {
      e.preventDefault();
      const userId = user.id;
    try{
        const returns = Object.entries(form)
        .map(([productId, returnedQuantity]) => ({ productId, returnedQuantity }))
        .filter(item => item.returnedQuantity > 0);
        console.log(returns)

        await axios.post(import.meta.env.VITE_BACKEND_LINK +'/sale/kembali', { returns, note, userId });
        // reset to current stock
     
        setForm(prev => ({ ...prev }));
        setNote('');
        setAlert({
            show: true,
            message: 'Pengambilan produk berhasil',
            type: 'success'
        })
    }catch(err){    
      console.log(err)
        setAlert({
            show: true,
            message: err.response?.data?.message || 'Terjadi kesalahan saat mengembalikan produk',
            type: 'error'
        })
    }
  };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
      <h2 className="text-2xl font-semibold text-amber-800 mb-6">Pengembalian Stok</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {products.map(p => (
          <div key={p._id}>
            <label className="block text-sm font-medium text-amber-700 mb-1">{p.name} </label>
            <input
              type="number"
              // min="0"
              // max={p.stock}
              // value={form[p._id]}
              onChange={e => handleChange(p._id, e.target.value)}
              className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
            />
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-amber-700 mb-1">Catatan Pengembalian</label>
        <textarea
          rows="3"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
          placeholder="Alasan pengembalian..."
        />
      </div>
      <button type="submit" className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">Konfirmasi Pengembalian</button>
      {alert.show && (
                <AlertModal
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert(prev => ({ ...prev, show: false }))}
                />
            )}
    </form>
    )
}

export default DropForm