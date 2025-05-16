import React, {useState, useEffect} from 'react'
import axios from 'axios';

const Produksi = () => {
    const [materialsList, setMaterialsList] = useState([]);
    const [products, setProducts] = useState([]);
    const [productions, setProductions] = useState([]);
    const [productForm, setProductForm] = useState({ name: '', sellingPrice: '', recipe: [{ material: '', amountPerUnit: '' }] });
    const [prodForm, setProdForm] = useState({ productId: '', quantity: '' });

    useEffect(() => {
        fetchMaterials();
        fetchProducts();
        fetchProductions();
    }, []);

    async function fetchMaterials() {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/`);
            setMaterialsList(data);
        } catch (err) {
            console.error(err);
        }
    }
    
    async function fetchProducts() {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/produk`,{});
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function fetchProductions() {
        try {
            const { data } = await axios.get(import.meta.env.VITE_BACKEND_LINK + `/produksi/getData`,{})
            setProductions(data);
        } catch (err) {
            console.error(err);
        }
    }

    const handleProductChange = (e, idx) => {
        const { name, value } = e.target;
        if (name === 'name' || name === 'sellingPrice') {
            setProductForm(prev => ({ ...prev, [name]: value }));
        } else {
            const list = [...productForm.recipe];
            list[idx][name] = value;
            setProductForm(prev => ({ ...prev, recipe: list }));
        }
    };

    const addRecipeField = () => {
        setProductForm(prev => ({
            ...prev,
            recipe: [...prev.recipe, { material: '', amountPerUnit: '' }]
        }));
    };

    async function submitProduct(e) {
        e.preventDefault();
        await axios.post(import.meta.env.VITE_BACKEND_LINK + `/produksi/produk/buat`, {
            ...productForm,
            sellingPrice: Number(productForm.sellingPrice),
            recipe: productForm.recipe.map(r => ({
                material: r.material,
                amountPerUnit: Number(r.amountPerUnit)
            }))
        });
        setProductForm({ name: '', sellingPrice: '', recipe: [{ material: '', amountPerUnit: '' }] });
        fetchProducts();
    }

    function handleProdChange(e) {
        const { name, value } = e.target;
        setProdForm(prev => ({ ...prev, [name]: value }));
    }

    async function submitProduction(e) {
        e.preventDefault();
        await axios.post(import.meta.env.VITE_BACKEND_LINK + `/produksi/buatProduksi`, {
            productId: prodForm.productId,
            quantity: Number(prodForm.quantity)
        });
        setProdForm({ productId: '', quantity: '' });
        fetchProductions();
        fetchProducts();
    }

    const selectedProduct = products.find(p => p._id === prodForm.productId);
    const formatAmount = (unit) => unit === 'kg' ? 'gram' : unit === 'liter' ? 'ml' : unit;

    return (
        <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-amber-50">
            <header className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-amber-800">Dashboard Produksi & Produk</h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Product Form */}
                <section className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-amber-800 mb-4">Tambah Produk</h2>
                    <form onSubmit={submitProduct} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-amber-700">Nama Produk</label>
                                <input
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleProductChange}
                                    className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-amber-700">Harga Jual (Rp)</label>
                                <input
                                    name="sellingPrice"
                                    type="number"
                                    value={productForm.sellingPrice}
                                    onChange={handleProductChange}
                                    className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium text-amber-700">Resep Produk</label>
                            {productForm.recipe.map((field, idx) => (
                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                        <select
                                            name="material"
                                            value={field.material}
                                            onChange={e => handleProductChange(e, idx)}
                                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                        >
                                            <option value="">Pilih Bahan</option>
                                            {materialsList.map(mat => (
                                                <option key={mat._id} value={mat._id}>{mat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <input
                                            name="amountPerUnit"
                                            type="number"
                                            value={field.amountPerUnit}
                                            onChange={e => handleProductChange(e, idx)}
                                            placeholder="Jumlah"
                                            className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addRecipeField}
                                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                            >
                                + Tambah Bahan
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            Simpan Produk
                        </button>
                    </form>
                </section>

                {/* Production Form */}
                <section className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6">
                    <h2 className="text-xl font-semibold text-amber-800 mb-4">Buat Produksi</h2>
                    <form onSubmit={submitProduction} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-amber-700">Pilih Produk</label>
                                <select
                                    name="productId"
                                    value={prodForm.productId}
                                    onChange={handleProdChange}
                                    className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    required
                                >
                                    <option value="">Pilih Produk</option>
                                    {products.map(p => (
                                        <option key={p._id} value={p._id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-amber-700">Jumlah Produksi</label>
                                <input
                                    name="quantity"
                                    type="number"
                                    value={prodForm.quantity}
                                    onChange={handleProdChange}
                                    className="w-full px-4 py-2 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                    required
                                />
                            </div>
                        </div>

                        {selectedProduct && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <h3 className="font-medium text-amber-800 mb-2">Resep {selectedProduct.name}</h3>
                                <ul className="space-y-2">
                                    {selectedProduct.recipe.map((r, i) => (
                                        <li key={i} className="text-sm text-amber-700 flex justify-between">
                                            <span>{r.material.name}</span>
                                            <span>{r.amountPerUnit} {formatAmount(r.material.unit)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Proses Produksi
                        </button>
                    </form>
                </section>
            </div>

            {/* Product List */}
            <section className="bg-white rounded-xl shadow-lg border border-amber-200 p-4 md:p-6">
                <h2 className="text-xl font-semibold text-amber-800 mb-4">Data Produk & Stok</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(prod => (
                        <div key={prod._id} className="bg-amber-50 rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors">
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-amber-800 truncate">{prod.name}</h3>
                                <div className="flex justify-between text-sm text-amber-700">
                                    <span>Stok Tersedia:</span>
                                    <span className="font-semibold">{prod.stock}</span>
                                </div>
                                <div className="flex justify-between text-sm text-amber-700">
                                    <span>Harga Jual:</span>
                                    <span className="font-semibold">Rp{prod.sellingPrice?.toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Produksi