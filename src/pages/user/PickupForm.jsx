import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AlertModal from '../../components/AlertModal';
import { useAuth } from '../../components/AuthContext';

const PickupForm = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({});
    const [note, setNote] = useState('');
     const {user} = useAuth();
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'info'
    })

    const fectchProducts = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/produk/tersedia`, {  });
            setProducts(data);
            const init = {};
            data.forEach(p => { init[p._id] = 0; });
            setForm(init);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fectchProducts();
    }, []);

    const handleChange = (id, value) => {
        setForm(prev => ({ ...prev, [id]: Number(value) }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
       
        try {
            const pickups = Object.entries(form)
                .map(([productId, qty]) => ({ productId, quantity: qty }))
                .filter(item => item.quantity > 0);

            const userId = user.id;
            await axios.post(import.meta.env.VITE_BACKEND_LINK + '/sale/ambil', { pickups, note, userId, }, {
                withCredentials: true, 
            });
            // reset
            setAlert({
                show: true,
                message: 'Pengambilan produk berhasil',
                type: 'success'
            })
            const reset = {};
            products.forEach(p => reset[p._id] = 0);
            setForm(reset);
            setNote('');
        } catch (err) {
            console.log(err)
            setAlert({
                show: true,
                message: "terjadi kesalahan, silahkan coba lagi",
                type: 'error'
            })
        }

    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6">Pengambilan Stok</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {products.map(p => (
                    <div key={p._id} className="">
                        <label className="block text-sm font-medium text-amber-700 mb-1">{p.name} (stok: {p.stock})</label>
                        <input
                            type="number"
                            min="0"
                            max={p.stock}
                            value={form[p._id]}
                            onChange={e => handleChange(p._id, e.target.value)}
                            className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                        />
                    </div>
                ))}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-amber-700 mb-1">Catatan</label>
                <textarea
                    rows="3"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="Alasan pengambilan..."
                />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors">Konfirmasi Pengambilan</button>
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

export default PickupForm