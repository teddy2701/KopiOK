import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AlertModal from '../../components/AlertModal';
import { useAuth } from '../../components/AuthContext';

const PickupForm = () => {
    const [materials, setMaterials] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({});
    const [note, setNote] = useState('');
    const [uangPecah, setUangPecah] = useState('');
    const { user } = useAuth();
    const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

    const fetchData = async () => {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/pengambilan`);
            // data.materials, data.products
            setMaterials(data.materials);
            setProducts(data.products);
           
            // init form hanya untuk produk (pickup qty)
            const init = {};
            data.products.forEach(p => { init[p._id] = 0; });
            setForm(init);
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (id, value) => {
        setForm(prev => ({ ...prev, [id]: Number(value) }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const userId = user.id;
    
            // Pisahkan form berdasarkan ID yang ada di daftar materials dan products
            const materialIds = materials.map(m => m._id);
            const productIds = products.map(p => p._id);
    
            const materialsPayload = materialIds
                .map(id => ({
                    materialId: id,
                    quantity: form[id] || 0
                }))
                .filter(item => item.quantity > 0);
    
            const productsPayload = productIds
                .map(id => ({
                    productId: id,
                    quantity: form[id] || 0
                }))
                .filter(item => item.quantity > 0);
    
            const payload = {
                userId,
                note,
                uangPecah,
                materials: materialsPayload,
                products: productsPayload
            };
          
            await axios.post(
                import.meta.env.VITE_BACKEND_LINK + '/sale/ambil',
                payload,
                { withCredentials: true }
            );
    
            setAlert({ show: true, message: 'Pengambilan berhasil', type: 'success' });
    
            // Reset form
            const reset = {};
            [...materialIds, ...productIds].forEach(id => reset[id] = 0);
            setForm(reset);
            setNote('');
            setUangPecah('');
        } catch (err) {
            console.error(err);
            setAlert({ show: true, message: err.response?.data?.message || "Terjadi Kesalahan Pada Server", type: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6">Pengambilan Stok</h2>

            {/* MATERIALS INFO */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-amber-700 mb-2">Materials</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {materials.map(m => (
                        <div key={m._id} className="flex flex-col">
                            <label htmlFor={`mat-${m._id}`} className="text-sm text-amber-700 mb-1 truncate">
                                {m.name} ({m.unit})
                            </label>
                            <input
                                id={`mat-${m._id}`}
                                type="number"
                                min="0"
                                max={m.stock}
                                value={form[m._id] || 0}
                                onChange={e => handleChange(m._id, e.target.value)}
                                className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* PRODUCTS PICKUP */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-amber-700 mb-2">Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {products.map(p => (
                        <div key={p._id} className="flex flex-col">
                            <label htmlFor={p._id} className="text-sm text-amber-700 mb-1 truncate">{p.name} </label>
                            <input
                                id={p._id}
                                type="number"
                                min="0"
                                max={p.stock}
                                value={form[p._id] || 0}
                                onChange={e => handleChange(p._id, e.target.value)}
                                className="text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* UANG PECAH & CATATAN */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-amber-700 mb-2">Products</h3>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-amber-700 mb-1">Uang Pecah</label>
                        <input
                            type="number"
                            value={uangPecah}
                            onChange={e => setUangPecah(e.target.value)}
                            className="w-full text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="block text-sm font-medium text-amber-700 mb-1">Catatan</label>
                        <textarea
                            rows="2"
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="w-full text-sm px-2 py-1 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Alasan pengambilan..."
                        />
                    </div>

                </div>
            </div>



            <button
                type="submit"
                className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
                Konfirmasi Pengambilan
            </button>

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
