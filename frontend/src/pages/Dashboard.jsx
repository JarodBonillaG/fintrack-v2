import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Wallet, Plus, X, Trash2  } from 'lucide-react'

function Dashboard() {
    const [cuentas, setCuentas] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({ nombre: '', tipo: 'BANCO', moneda: 'CRC', balance: '' })
    const claseIconoBalance = (balance) => {
        if (balance < 0) return 'bg-red-600'
        if (balance === 0) return 'bg-gray-600'
        return 'bg-emerald-500'
    }
    // const [editando, setEditando] = useState(null)
    // const [formEdit, setFormEdit] = useState({ nombre: '', tipo: 'BANCO', moneda: 'CRC', balance: '' })

    useEffect(() => {
        api.get('/api/cuentas')
            .then(res => setCuentas(res.data))
            .catch((err) => {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token')
                    window.location.href = '/'
                }
            })
    }, [])

    const totalBalance = cuentas.reduce((sum, c) => sum + parseFloat(c.balance || 0), 0)

    const claseFondoBalance = (balance) => {
        if (balance < 0) return 'from-red-600 to-red-800'
        if (balance === 0) return 'from-gray-700 to-gray-800'
        return 'from-emerald-600 to-emerald-800'
    }

    const claseTextoBalance = (balance) => {
        if (balance < 0) return 'text-red-400'
        if (balance === 0) return 'text-gray-400'
        return 'text-emerald-400'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post('/api/cuentas', { ...form, balance: parseFloat(form.balance || 0) })
        const res = await api.get('/api/cuentas')
        setCuentas(res.data)
        setForm({ nombre: '', tipo: 'BANCO', moneda: 'CRC', balance: '' })
        setMostrarForm(false)
    }

    const eliminar = async (id) => {
        await api.delete(`/api/cuentas/${id}`)
        const res = await api.get('/api/cuentas')
        setCuentas(res.data)
    }

    // const abrirEditar = (c) => {
    //     setEditando(c.id)
    //     setFormEdit({ nombre: c.nombre, tipo: c.tipo, moneda: c.moneda, balance: c.balance })
    // }
    //
    // const handleEdit = async (e) => {
    //     e.preventDefault()
    //     await api.put(`/api/cuentas/${editando}`, { ...formEdit, balance: parseFloat(formEdit.balance) })
    //     const res = await api.get('/api/cuentas')
    //     setCuentas(res.data)
    //     setEditando(null)
    // }

    const inputClass = "w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    const labelClass = "text-sm text-gray-400 mb-1 block"

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-400 mb-8">Resumen de tus finanzas</p>

                <div className={`bg-gradient-to-r ${claseFondoBalance(totalBalance)} rounded-2xl p-6 mb-8`}>
                    <p className="text-emerald-100 text-sm mb-1">Balance total</p>
                    <p className="text-3xl sm:text-4xl font-bold">₡ {totalBalance.toLocaleString()}</p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold">Mis Cuentas</h2>
                    <button
                        onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        {mostrarForm ? <X size={18} /> : <Plus size={18} />}
                        {mostrarForm ? 'Cancelar' : 'Nueva cuenta'}
                    </button>
                </div>

                {mostrarForm && (
                    <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Nueva cuenta</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input type="text" className={inputClass} placeholder="Ej: Cuenta BAC"
                                       value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select className={inputClass} value={form.tipo}
                                        onChange={e => setForm({...form, tipo: e.target.value})}>
                                    <option value="BANCO">Banco</option>
                                    <option value="EFECTIVO">Efectivo</option>
                                    <option value="TARJETA_CREDITO">Tarjeta de crédito</option>
                                    <option value="AHORRO">Ahorro</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Moneda</label>
                                <select className={inputClass} value={form.moneda}
                                        onChange={e => setForm({...form, moneda: e.target.value})}>
                                    <option value="CRC">CRC (Colones)</option>
                                    <option value="USD">USD (Dólares)</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Balance inicial</label>
                                <input type="number" className={inputClass} placeholder="0"
                                       value={form.balance} onChange={e => setForm({...form, balance: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg transition font-semibold">
                                    Crear cuenta
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/*{editando && (*/}
                {/*    <div className="bg-gray-900 rounded-2xl p-6 mb-6">*/}
                {/*        <h3 className="text-lg font-semibold mb-4">Editar cuenta</h3>*/}
                {/*        <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">*/}
                {/*            <div>*/}
                {/*                <label className={labelClass}>Nombre</label>*/}
                {/*                <input type="text" className={inputClass}*/}
                {/*                       value={formEdit.nombre} onChange={e => setFormEdit({...formEdit, nombre: e.target.value})} required />*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <label className={labelClass}>Tipo</label>*/}
                {/*                <select className={inputClass} value={formEdit.tipo}*/}
                {/*                        onChange={e => setFormEdit({...formEdit, tipo: e.target.value})}>*/}
                {/*                    <option value="BANCO">Banco</option>*/}
                {/*                    <option value="EFECTIVO">Efectivo</option>*/}
                {/*                    <option value="TARJETA_CREDITO">Tarjeta de crédito</option>*/}
                {/*                    <option value="AHORRO">Ahorro</option>*/}
                {/*                </select>*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <label className={labelClass}>Moneda</label>*/}
                {/*                <select className={inputClass} value={formEdit.moneda}*/}
                {/*                        onChange={e => setFormEdit({...formEdit, moneda: e.target.value})}>*/}
                {/*                    <option value="CRC">CRC (Colones)</option>*/}
                {/*                    <option value="USD">USD (Dólares)</option>*/}
                {/*                </select>*/}
                {/*            </div>*/}
                {/*            <div>*/}
                {/*                <label className={labelClass}>Balance</label>*/}
                {/*                <input type="number" className={inputClass}*/}
                {/*                       value={formEdit.balance} onChange={e => setFormEdit({...formEdit, balance: e.target.value})} />*/}
                {/*            </div>*/}
                {/*            <div className="md:col-span-2 flex gap-3">*/}
                {/*                <button type="submit"*/}
                {/*                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg transition font-semibold">*/}
                {/*                    Guardar*/}
                {/*                </button>*/}
                {/*                <button type="button" onClick={() => setEditando(null)}*/}
                {/*                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition">*/}
                {/*                    Cancelar*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </form>*/}
                {/*    </div>*/}
                {/*)}*/}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cuentas.length === 0 && <p className="text-gray-400">No tenés cuentas todavía.</p>}
                    {cuentas.map(c => (
                        <div key={c.id} className="bg-gray-900 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className={`${claseIconoBalance(parseFloat(c.balance))} p-2 rounded-lg`}>
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">{c.nombre}</p>
                                    <p className="text-sm text-gray-400">{c.tipo} · {c.moneda}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className={`text-lg font-bold ${claseTextoBalance(parseFloat(c.balance))}`}>
                                    {parseFloat(c.balance).toLocaleString()}
                                </p>
                                {/*<button onClick={() => abrirEditar(c)}*/}
                                {/*        className="text-emerald-400 hover:text-emerald-300 transition">*/}
                                {/*    <Pencil size={18} />*/}
                                {/*</button>*/}
                                <button onClick={() => eliminar(c.id)}
                                        className="text-red-400 hover:text-red-300 transition">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard