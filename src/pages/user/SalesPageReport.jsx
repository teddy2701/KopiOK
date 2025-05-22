import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { useParams } from 'react-router';
const SalesPageReport = () => {
    const [data, setData] = useState(null);
    const {id}  = useParams()

    const getData = async () => {
        try{
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + '/sale/get/laporan/' + id);
            setData(data);
            console.log(data)
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        getData();
    }, []);
  
    if (!data) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      );
    }
  
    // Hitung total keseluruhan
 
    const { produk, ringkasan } = data;
    const total = ringkasan.numericPendapatan - ringkasan.numericPengeluaran;
    return (
        <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-amber-800 mb-6">Laporan Harian</h1>
  
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-amber-200">
            <thead>
              <tr className="bg-amber-100">
                <th className="px-4 py-2 text-left">Nama Produk</th>
                <th className="px-4 py-2 text-right">Jumlah Laku</th>
                <th className="px-4 py-2 text-right">Harga Satuan</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {produk.map((p, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{p.nama}</td>
                  <td className="px-4 py-2 text-right">{p.jumlah}</td>
                  <td className="px-4 py-2 text-right">{p.displayHarga}</td>
                  <td className="px-4 py-2 text-right">{p.displayTotal}</td>
                </tr>
              ))}
  
              {/* Baris TOTAL di akhir */}
              <tr className="border-t font-bold bg-amber-50">
                <td className="px-4 py-2">TOTAL</td>
                <td className="px-4 py-2" />
                <td className="px-4 py-2" />
                <td className="px-4 py-2 text-right">{ringkasan.displayPendapatan}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        {/* Ringkasan di bawah */}
        <div className="mt-6 space-y-2">
          <p><strong>Pengeluaran:</strong> {ringkasan.displayPengeluaran}</p>
          <p><strong>Alasan:</strong>  {ringkasan.catatanPengeluaran[0].catatan}</p>
          <div className='text-center'><span className='font-bold text-3xl'> Total : Rp {total.toLocaleString('id-ID')}</span></div>
        </div>
      </div>
  )
}

export default SalesPageReport