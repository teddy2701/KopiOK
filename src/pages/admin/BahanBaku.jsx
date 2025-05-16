import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BahanBaku = () => {
    const [materials, setMaterials] = useState([]);
    const [form, setForm] = useState({ name: '', unit: 'gram', stock: 0, price: 0 });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    async function fetchMaterials() {
        try {
            const res = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/`, {  });
            setMaterials(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    function handleChange(e) {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(
                    import.meta.env.VITE_BACKEND_LINK + `/produksi/${editingId}/tambahStock`,
                    { additionalStock: form.stock, price: form.price, note: form.note },
                    {  }
                );
            } else {
                await axios.post(
                    import.meta.env.VITE_BACKEND_LINK + '/produksi/buat',
                    form,
                    {  }
                );
            }

            setForm({ name: '', unit: 'gram', stock: 0, price: 0 });
            setEditingId(null);
            fetchMaterials();

        } catch (err) {
            console.error(err);
        }
    }

    function startEdit(material) {
        setEditingId(material._id);
        setForm({
            name: material.name,
            unit: material.unit,
            stock: 0,
            price: material.price
        });
    }

    function formatStock(value) {
        const str = Number(value).toFixed(3);
        return str.replace(/\.?0+$/, '');
    }

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-amber-50">
            {/* Header */}
            <header className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-amber-800 mb-4">
                    Manajemen Bahan Baku
                </h1>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-amber-700">Nama Bahan</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Contoh: Kopi Arabika"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-amber-700">Unit</label>
                        <select
                            name="unit"
                            value={form.unit}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                            <option value="kg">kg</option>
                            <option value="gram">gram</option>
                            <option value="liter">liter</option>
                            <option value="pcs">pcs</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-amber-700">
                            {editingId ? 'Tambah Stok' : 'Stok'} ({form.unit})
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-amber-700">Harga (Rp)</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                    {editingId && (
                        <button
                            type="button"
                            onClick={() => { setEditingId(null); setForm({ name: '', unit: 'gram', stock: 0, price: 0 }); }}
                            className="px-4 py-2 text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-6 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors shadow-sm"
                    >
                        {editingId ? 'Update Stok' : 'Tambah Bahan'}
                    </button>
                </div>
            </form>

            {/* List Materials */}
            <section className="space-y-6">
                <h2 className="text-xl font-semibold text-amber-800">Daftar Bahan Baku</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map(mat => (
                        <div key={mat._id} className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6 hover:border-amber-300 transition-colors">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-amber-800">{mat.name}</h3>
                                <div className="space-y-2 text-amber-700">
                                    <div className="flex justify-between">
                                        <span>Stok:</span>
                                        <span className="font-semibold">{formatStock(mat.stock)} {mat.unit}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Harga:</span>
                                        <span className="font-semibold">Rp{mat.price.toLocaleString('id-ID')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => startEdit(mat)}
                                    className="w-full px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-lg hover:bg-amber-200 transition-colors"
                                >
                                    Restock
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {materials.length === 0 && (
                    <div className="text-center text-amber-600 py-8 bg-amber-100 rounded-xl">
                        Tidak ada bahan baku tersedia
                    </div>
                )}
            </section>
        </div>
    )
}

export default BahanBaku