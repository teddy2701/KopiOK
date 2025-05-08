import React, { useState } from 'react'

const DropForm = () => {
    const [form, setForm] = useState({
        kopi1: 0,
        kopi2: 0,
        kopi3: 0,
        keterangan: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name.startsWith('kopi') ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setForm({ kopi1: 0, kopi2: 0, kopi3: 0, keterangan: '' });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-semibold text-amber-800 mb-6">Pengembalian Stok Kopi</h2>

            <div className="space-y-5">
                {[1, 2, 3].map((num) => (
                    <div key={num}>
                        <label className="block text-sm font-medium text-amber-700 mb-2">
                            Kopi {num}
                        </label>
                        <input
                            type="number"
                            name={`kopi${num}`}
                            min="0"
                            value={form[`kopi${num}`]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                        />
                    </div>
                ))}

                <div>
                    <label className="block text-sm font-medium text-amber-700 mb-2">
                        Catatan Pengembalian
                    </label>
                    <textarea
                        name="keterangan"
                        rows="3"
                        value={form.keterangan}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border-2 border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                        placeholder="Contoh: Sisa stok dari event..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
                >
                    Konfirmasi Pengembalian
                </button>
            </div>
        </form>
    )
}

export default DropForm