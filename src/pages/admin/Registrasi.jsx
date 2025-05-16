import React, { useEffect, useState } from 'react'
import AlertModal from '../../components/AlertModal'
import axios from 'axios'
import { Link } from 'react-router'

const Registrasi = () => {
    const [form, setForm] = useState({
        username: '',
        nama: '',
        password: '',
        noTelp: '',
        fotoWajah: null,
        fotoKTP: null,
      })
      const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'info'
      })
    
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({});
    
    const [employees, setEmployees] = useState([
        { 
            id: 1, 
            username: 'teddy_barista', 
            nama: 'Teddy Pratama', 
            email: 'teddy@kopiKita.com', 
            noTelp: '081234567890', 
            role: 'Barista Utama' 
        },
        { 
            id: 2, 
            username: 'siti_manajer', 
            nama: 'Siti Aisyah', 
            email: 'siti@kopiKita.com', 
            noTelp: '082345678901', 
            role: 'Manajer Toko' 
        }
    ]);

    const dataUser = async () => {
        try {
          const response = await axios.get(import.meta.env.VITE_BACKEND_LINK + '/user/getUser', {})
          setEmployees(response.data)
        } catch (error) {
          console.log(error)
        }
    }

    useEffect(() => {
        dataUser()
    }, [])
    

    // Filter karyawan berdasarkan nama atau username
    const filteredEmployees = employees.filter(emp => {
        const searchLower = searchTerm.toLowerCase();
        return (
            emp.nama.toLowerCase().includes(searchLower) ||
            emp.username.toLowerCase().includes(searchLower)
        );
    });

    const handleChange = e => {
        const { name, value, files, type } = e.target
        setForm(prev => ({
          ...prev,
          [name]: type === 'file' ? files[0] : value
        }))
      }
    
      const validate = () => {
        const errs = {}
        if (!form.username.trim()) errs.username = 'Username diperlukan'
        if (!form.nama.trim()) errs.nama = 'Nama lengkap diperlukan'
        if (!/^[0-9]{10,15}$/.test(form.noTelp)) errs.noTelp = 'Nomor telepon tidak valid'
        // file inputs optional, tapi contoh validasi:
        if (!form.fotoWajah) errs.fotoWajah = 'Foto wajah diperlukan'
        if (!form.fotoKTP) errs.fotoKTP = 'Foto KTP diperlukan'
        return errs
      }

      const handleSubmit = async e => {
        e.preventDefault()
        const errs = validate()
        if (Object.keys(errs).length) {
          setErrors(errs)
        } else {
          setErrors({})
          // kirim form ke API, misal dengan FormData
          const payload = new FormData()
          payload.append('username', form.username)
          payload.append('nama', form.nama)
          payload.append('password', form.password)
          payload.append('noTelp', form.noTelp)
          payload.append('fotoWajah', form.fotoWajah)
          payload.append('fotoKTP', form.fotoKTP)

          try{

           await axios.post(import.meta.env.VITE_BACKEND_LINK + '/user/createUser', payload, {})
  
          setAlert({
            show: true,
            message: 'Registrasi berhasil',
            type: 'success'
          })
            setForm({
              username: '',
              nama: '',
              email: '',
              noTelp: '',
              fotoWajah: null,
              fotoKTP: null,
            })
    
        }catch (error) {
            console.error('Error:', error)
            setAlert({
              show: true,
              message: error.response.data.message,
              type: 'error'
            })
          }
      }

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/* Form Registrasi */}
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-lg mb-8 border border-amber-200"
        >
         <h2 className="text-2xl font-semibold mb-6 text-amber-800">
            Form Registrasi Karyawan Kopi
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {/* Username */}
            <div>
              <label className="block text-amber-800">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-amber-800">Nama Lengkap</label>
              <input
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
              />
              {errors.nama && (
                <p className="text-red-500 text-sm mt-1">{errors.nama}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-amber-800">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-amber-800">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* No. Telepon */}
            <div>
              <label className="block text-amber-800">No. Telepon</label>
              <input
                type="tel"
                name="noTelp"
                value={form.noTelp}
                onChange={handleChange}
                className="mt-1 block w-full border border-amber-300 rounded-lg p-2 focus:ring focus:ring-amber-200"
              />
              {errors.noTelp && (
                <p className="text-red-500 text-sm mt-1">{errors.noTelp}</p>
              )}
            </div>

  
            {/* Foto Wajah */}
            <div>
              <label htmlFor="fotoWajah" className="block text-amber-800">Foto Wajah</label>
              <input
                type="file"
                name="fotoWajah"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm border border-amber-300 "
              />
              {form.fotoWajah && (
                <p className="text-sm mt-1 text-amber-600">
                  File: {form.fotoWajah.name}
                </p>
              )}
              {errors.fotoWajah && (
                <p className="text-red-500 text-sm mt-1">{errors.fotoWajah}</p>
              )}
            </div>
  
            {/* Foto KTP */}
            <div>
              <label className="block text-amber-800">Foto KTP</label>
              <input
                type="file"
                name="fotoKTP"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 block w-full text-sm border border-amber-300"
              />
              {form.fotoKTP && (
                <p className="text-sm mt-1 text-amber-600">
                  File: {form.fotoKTP.name}
                </p>
              )}
              {errors.fotoKTP && (
                <p className="text-red-500 text-sm mt-1">{errors.fotoKTP}</p>
              )}
            </div>
          </div>
  
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 cursor-pointer py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring focus:ring-amber-200"
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
                onChange={e => setSearchTerm(e.target.value)}
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
                <div
                  key={emp.id}
                  className="bg-amber-50 rounded-lg p-4 shadow-md border border-amber-200"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-amber-800">{emp.nama}</h3>
                    <p className="text-sm text-amber-600">@{emp.username}</p>
                    <p className="text-sm text-amber-600 capitalize">Role: {emp.role}</p>
                  </div>
                  <div className="text-sm text-amber-800 space-y-1">
                    <p>📞 {emp.noTelp}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to={`/admin/detail/${emp._id}`} className="text-amber-700 hover:text-amber-900 text-sm underline">
                      Detail
                    </Link>
                   
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

export default Registrasi