import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import axios from 'axios'

const Detail = () => {

    const {userId}  = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const getDataUser = async () => {
      try {
        setLoading(true)

        const response = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/user/getUser/${userId}`,{withCredentials: true})
        setUser(response.data)
        console.log(response.data)
      } catch (err) {
        setError(err)
        console.log(err)  
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => {
      getDataUser()  
    }, [userId])
  
    if (loading) return <p className="p-6">Loading…</p>
    if (error)   return <p className="p-6 text-red-500">Error loading data.</p>
    if (!user)  return <p className="p-6">User tidak ditemukan.</p>
    
  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Kembali</span>
      </button>

      <h2 className="text-3xl font-bold text-gray-800">Detail {user.nama}</h2>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Foto Wajah</h3>
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={user.fotoWajah.url} 
              alt="Foto Wajah" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-md">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Foto KTP</h3>
          <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={user.fotoKTP.url} 
              alt="Foto KTP" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nama Lengkap</label>
            <p className="mt-1 text-lg text-gray-900">{user.nama}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Nomor Telepon</label>
            <p className="mt-1 text-lg text-gray-900">{user.noTelp}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1 text-lg text-gray-900 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  </div>  
  )
}

export default Detail