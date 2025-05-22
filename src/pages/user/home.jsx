import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios';
import AlertModal from '../../components/AlertModal';
import { useAuth } from '../../components/AuthContext';

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });
  const { user } = useAuth();
  const [pengambilanId, setPengambilanId] = useState(null);

  const dataMenu = async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + '/produksi/forCashier');
      setMenu(data);

       // 1. Jika belum ada pengambilan, buat dulu
       if (!pengambilanId) {

        const response = await axios.get(
          import.meta.env.VITE_BACKEND_LINK + `/sale/get/pengambilan/${user.id}`
        );
        setPengambilanId(response.data[0]._id);
      }

     
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    dataMenu();
    
  }, []);

  const addToOrder = (item) => {
    setOrders(prev => {
      const existing = prev.find(o => o._id === item._id);
      if (existing) {
        return prev.map(o =>
          o._id === item._id ? { ...o, quantity: o.quantity + 1 } : o
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemove = (id) => {
    setOrders(prev => prev.filter(item => item._id !== id));
  };

  const updateQuantity = (id, amount) => {
    setOrders(prev =>
      prev.map(item =>
        item._id === id ?
          { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleProcessSale = async () => {
    try {
     
      const payloadTemp = {
        userId: user.id,
        pengambilan: pengambilanId,
        items: orders.map(item => ({ productId: item._id, quantity: item.quantity }))
      };
 
      await axios.post(import.meta.env.VITE_BACKEND_LINK + '/sale/simpan/temp', payloadTemp, {
        withCredentials: true
      });

      setAlert({ show: true, message: 'Success', type: 'success' });
      setOrders([]);
    } catch (err) {
      console.error(err);
      setAlert({ show: true,  message: err.response?.data?.message || 'Terjadi kesalahan pada server', type: 'error' });
    }
  };

  const totalAmount = orders.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

  return (
    <div className="min-h-screen bg-amber-50 p-4 md:p-6 lg:p-8">

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Menu Section */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-4">
              {menu.map(item => (
                <button
                  key={item._id}
                  onClick={() => addToOrder(item)}
                  className="flex flex-col items-center justify-center bg-white p-4 hover:shadow-lg transition-all rounded-2xl shadow-md border border-amber-200"
                >
                  <h3 className="font-medium text-amber-800 text-base">{item.name}</h3>
                  <p className="text-sm text-amber-700">
                    Rp {item.sellingPrice.toLocaleString('id-ID')}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Order Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 h-fit sticky top-6">
            <h2 className="text-lg font-bold mb-4">Current Order</h2>

            <div className="space-y-3 mb-6">
              {orders.map(item => (
                <div key={item._id} className="flex justify-between items-center group">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      Rp {(item.sellingPrice * item.quantity).toLocaleString('id-ID')}
                    </p>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="ml-2 text-red-500 transition-opacity"
                      title="Hapus item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No items selected</p>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-4 font-bold">
                <span>Total:</span>
                <span>Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <button
                onClick={handleProcessSale}
                disabled={orders.length === 0}
                className="w-full py-3 rounded-lg bg-amber-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                Simpan Penjualan
              </button>
            </div>
          </div>
        </div>
      </main>
      {alert.show && (
        <AlertModal
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
};

export default Home;
