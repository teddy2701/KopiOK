import React, { useState } from 'react'

const Registrasi = () => {
    const [form, setForm] = useState({
        username: '',
        namaLengkap: '',
        email: '',
        telp: '',
        posisi: ''
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    
    const [employees] = useState([
        { 
            id: 1, 
            username: 'teddy_barista', 
            namaLengkap: 'Teddy Pratama', 
            email: 'teddy@kopiKita.com', 
            telp: '081234567890', 
            posisi: 'Barista Utama' 
        },
        { 
            id: 2, 
            username: 'siti_manajer', 
            namaLengkap: 'Siti Aisyah', 
            email: 'siti@kopiKita.com', 
            telp: '082345678901', 
            posisi: 'Manajer Toko' 
        }
    ]);

    // Filter karyawan berdasarkan nama atau username
    const filteredEmployees = employees.filter(emp => {
        const searchLower = searchTerm.toLowerCase();
        return (
            emp.namaLengkap.toLowerCase().includes(searchLower) ||
            emp.username.toLowerCase().includes(searchLower)
        );
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errs = {};
        if (!form.username.trim()) errs.username = 'Username diperlukan';
        if (!form.namaLengkap.trim()) errs.namaLengkap = 'Nama lengkap diperlukan';
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) errs.email = 'Email tidak valid';
        if (!/^[0-9]{10,15}$/.test(form.telp)) errs.telp = 'Nomor telepon tidak valid';
        if (!form.posisi.trim()) errs.posisi = 'Posisi diperlukan';
        return errs;
    };

    const handleSubmit = e => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
        } else {
            setErrors({});
            console.log('Submitted:', form);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  p-4">
            {/* Form Registrasi */}
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg mb-8 border border-amber-200">
                <h2 className="text-2xl font-semibold mb-6 text-amber-800">Form Registrasi Karyawan Kopi</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-amber-800">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>
                    
                    <div>
                        <label className="block text-amber-800">Nama Lengkap</label>
                        <input
                            type="text"
                            name="namaLengkap"
                            value={form.namaLengkap}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
                        />
                        {errors.namaLengkap && <p className="text-red-500 text-sm mt-1">{errors.namaLengkap}</p>}
                    </div>

                    <div>
                        <label className="block text-amber-800">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-amber-800">No. Telepon</label>
                        <input
                            type="tel"
                            name="telp"
                            value={form.telp}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
                        />
                        {errors.telp && <p className="text-red-500 text-sm mt-1">{errors.telp}</p>}
                    </div>

                    <div>
                        <label className="block text-amber-800">Posisi</label>
                        <select
                            name="posisi"
                            value={form.posisi}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
                        >
                            <option value="">-- Pilih Posisi --</option>
                            <option value="Barista">Barista</option>
                            <option value="Manajer Toko">Manajer Toko</option>
                            <option value="Kasir">Kasir</option>
                            <option value="Staff Dapur">Staff Dapur</option>
                        </select>
                        {errors.posisi && <p className="text-red-500 text-sm mt-1">{errors.posisi}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring focus:ring-amber-200"
                    >
                        Daftarkan
                    </button>
                </div>
            </form>

            {/* Daftar Karyawan dengan Fitur Pencarian */}
            <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-lg border border-amber-200">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-semibold text-amber-800">Daftar Karyawan</h2>
                    <div className="w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Cari berdasarkan nama atau username..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200 text-sm"
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEmployees.length === 0 ? (
                        <div className="col-span-full text-center py-6 text-amber-600">
                            Tidak ada karyawan yang ditemukan
                        </div>
                    ) : (
                        filteredEmployees.map(emp => (
                            <div key={emp.id} className="bg-amber-50 rounded-lg p-4 shadow-md border border-amber-200">
                                <div className="mb-3">
                                    <h3 className="text-lg font-semibold text-amber-800">{emp.namaLengkap}</h3>
                                    <p className="text-sm text-amber-600">@{emp.username}</p>
                                    <p className="text-sm mt-1 text-amber-700">{emp.posisi}</p>
                                </div>
                                <div className="text-sm text-amber-800 space-y-1">
                                    <p>📧 {emp.email}</p>
                                    <p>📞 {emp.telp}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <a 
                                        href={`#detail-${emp.id}`} 
                                        className="text-amber-700 hover:text-amber-900 text-sm underline"
                                    >
                                        Detail
                                    </a>
                                    <div className="space-x-2">
                                        <button className="px-3 py-1 bg-amber-500 text-white rounded-md hover:bg-amber-600 text-sm">
                                            Edit
                                        </button>
                                        <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Registrasi