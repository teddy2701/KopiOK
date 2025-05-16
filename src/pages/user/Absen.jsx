import React,{use, useState, useEffect} from 'react'
import axios from 'axios';
import { useAuth } from '../../components/AuthContext';

const Absen = () => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState({ hasIn: false, hasOut: false });
    const {user} = useAuth();

    const updateStatus = async () => {
        try {
            const res = await axios.post(import.meta.env.VITE_BACKEND_LINK + '/absen/status',{id: user.id}, { withCredentials: true });
            setStatus(res.data);
           
        } catch (e) {
            setMessage(e.response?.data?.message || 'Error');
        }
    };
    useEffect(() => {
        updateStatus()
    }, []);
    

    const attend = async (type) => {
        try {
          const endpoint = type == 'IN' ? '/absen/masuk' : '/absen/pulang';
          const res = await axios.post(import.meta.env.VITE_BACKEND_LINK + endpoint, {id: user.id}, {withCredentials:true}, );
          setMessage(res.data.message);

         updateStatus();
          
        } catch (e) {
          setMessage(e.response?.data?.message || 'Error');
        }
      };

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 w-full max-w-md border border-amber-200">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-amber-800 mb-2">📋 Absensi Karyawan</h2>
                    <div className="bg-amber-100 rounded-lg p-3 inline-block">
                        <p className="text-sm text-amber-700">
                            Status hari ini: 
                            <span className="ml-2">
                                <span className="inline-flex items-center bg-amber-200 rounded px-2 py-1 mr-2">
                                    Masuk {status.hasIn ? '✅' : '❌'}
                                </span>
                                <span className="inline-flex items-center bg-amber-200 rounded px-2 py-1">
                                    Pulang {status.hasOut ? '✅' : '❌'}
                                </span>
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => attend('IN')}
                        disabled={status.hasIn}
                        className={`py-3 px-6 cursor-pointer rounded-xl font-semibold transition-all ${
                            status.hasIn 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        } flex items-center justify-center gap-2`}
                    >
                        🚪 Masuk
                    </button>
                    
                    <button
                        onClick={() => attend('OUT')}
                        disabled={!status.hasIn || status.hasOut}
                        className={`py-3 px-6 cursor-pointer rounded-xl font-semibold transition-all ${
                            (!status.hasIn || status.hasOut)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-amber-600 text-white hover:bg-amber-700'
                        } flex items-center justify-center gap-2`}
                    >
                        🏠 Pulang
                    </button>
                </div>

                {message && (
                    <div className="mt-6 p-3 bg-amber-100 rounded-lg text-center text-sm text-amber-700">
                        ℹ️ {message}
                    </div>
                )}
            </div>
        </div>
  )
}

export default Absen