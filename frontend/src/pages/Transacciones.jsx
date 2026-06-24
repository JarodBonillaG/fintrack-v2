import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react'

function Transacciones() {
    const [transacciones, setTransacciones] = useState([])
    const [cuentas, setCuentas] = useState([])
    const [categorias, setCategorias] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({
        cuentaId: '', categoriaId: '', monto: '',
        tipo: 'GASTO', fecha: '', descripcion: '', esRecurrente: false
    })

    useEffect(() => {
        api.get('/api/transacciones').then(res => setTransacciones(res.data))
        api.get('/api/cuentas').then(res => setCuentas(res.data))
        api.get('/api/categorias').then(res => setCategorias(res.data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post('/api/transacciones', { ...form, monto: parseFloat(form.monto) })
        const res = await api.get('/api/transacciones')
        setTransacciones(res.data)
        setForm({ cuentaId: '', categoriaId: '', monto: '', tipo: 'GASTO', fecha: '', descripcion: '', esRecurrente: false })
        setMostrarForm(false)
    }

    const inputClass = "w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    const labelClass = "text-sm text-gray-400 mb-1 block"

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Transacciones</h1>
                        <p className="text-gray-400">Historial de movimientos</p>
                    </div>
                    <button
                        onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={18} /> Nueva
                    </button>
                </div>

                {mostrarForm && (
                    <div className="bg-gray-900 rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-semibold mb-4">Nueva transacción</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Cuenta</label>
                                <select className={inputClass} value={form.cuentaId}
                                        onChange={e => setForm({...form, cuentaId: e.target.value})} required>
                                    <option value="">Seleccioná cuenta</option>
                                    {cuentas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Categoría</label>
                                <select className={inputClass} value={form.categoriaId}
                                        onChange={e => setForm({...form, categoriaId: e.target.value})} required>
                                    <option value="">Seleccioná categoría</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Monto</label>
                                <input type="number" className={inputClass} placeholder="0"
                                       value={form.monto} onChange={e => setForm({...form, monto: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select className={inputClass} value={form.tipo}
                                        onChange={e => setForm({...form, tipo: e.target.value})}>
                                    <option value="GASTO">Gasto</option>
                                    <option value="INGRESO">Ingreso</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Fecha</label>
                                <input type="date" className={inputClass}
                                       value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <input type="text" className={inputClass} placeholder="Opcional"
                                       value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg transition font-semibold">
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {transacciones.length === 0 && <p className="text-gray-400">No hay transacciones todavía.</p>}
                    {transacciones.map(t => (
                        <div key={t.id} className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {t.tipo === 'GASTO'
                                    ? <ArrowDownCircle size={24} className="text-red-400" />
                                    : <ArrowUpCircle size={24} className="text-emerald-400" />}
                                <div>
                                    <p className="font-semibold">{t.descripcion || 'Sin descripción'}</p>
                                    <p className="text-sm text-gray-400">{t.fecha}</p>
                                </div>
                            </div>
                            <p className={`text-lg font-bold ${t.tipo === 'GASTO' ? 'text-red-400' : 'text-emerald-400'}`}>
                                {t.tipo === 'GASTO' ? '-' : '+'} ₡{parseFloat(t.monto).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Transacciones