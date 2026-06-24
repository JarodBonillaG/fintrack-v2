import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Plus, ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Trash2, Pencil } from 'lucide-react'

function Transacciones() {
    const [transacciones, setTransacciones] = useState([])
    const [cuentas, setCuentas] = useState([])
    const [categorias, setCategorias] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({
        cuentaId: '', categoriaId: '', monto: '',
        tipo: 'GASTO', fecha: '', descripcion: '', esRecurrente: false
    })
    const [editando, setEditando] = useState(null)
    const [formEdit, setFormEdit] = useState({
        cuentaId: '', categoriaId: '', monto: '',
        tipo: 'GASTO', fecha: '', descripcion: '', esRecurrente: false
    })

    const hoy = new Date()
    const [mes, setMes] = useState(hoy.getMonth() + 1)
    const [anio, setAnio] = useState(hoy.getFullYear())

    const fetchTransacciones = (m, a) => {
        const desde = `${a}-${String(m).padStart(2, '0')}-01`
        const lastDay = new Date(a, m, 0).getDate()
        const hasta = `${a}-${String(m).padStart(2, '0')}-${lastDay}`
        api.get(`/api/transacciones?desde=${desde}&hasta=${hasta}`)
            .then(res => setTransacciones(res.data))
    }

    useEffect(() => {
        fetchTransacciones(mes, anio)
        api.get('/api/cuentas').then(res => setCuentas(res.data))
        api.get('/api/categorias').then(res => setCategorias(res.data))
    }, [])

    const mesAnterior = () => {
        if (mes === 1) { setMes(12); setAnio(anio - 1); fetchTransacciones(12, anio - 1) }
        else { setMes(mes - 1); fetchTransacciones(mes - 1, anio) }
    }

    const mesSiguiente = () => {
        if (mes === 12) { setMes(1); setAnio(anio + 1); fetchTransacciones(1, anio + 1) }
        else { setMes(mes + 1); fetchTransacciones(mes + 1, anio) }
    }

    const handleMesChange = (e) => {
        const nuevoMes = parseInt(e.target.value)
        setMes(nuevoMes)
        fetchTransacciones(nuevoMes, anio)
    }

    const handleAnioChange = (e) => {
        const nuevoAnio = parseInt(e.target.value)
        setAnio(nuevoAnio)
        fetchTransacciones(mes, nuevoAnio)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post('/api/transacciones', { ...form, monto: parseFloat(form.monto) })
        fetchTransacciones(mes, anio)
        setForm({ cuentaId: '', categoriaId: '', monto: '', tipo: 'GASTO', fecha: '', descripcion: '', esRecurrente: false })
        setMostrarForm(false)
    }

    const eliminar = async (id) => {
        await api.delete(`/api/transacciones/${id}`)
        fetchTransacciones(mes, anio)
    }

    const abrirEditar = (t) => {
        setEditando(t.id)
        setFormEdit({
            cuentaId: t.cuentaId,
            categoriaId: t.categoriaId,
            monto: t.monto,
            tipo: t.tipo,
            fecha: t.fecha,
            descripcion: t.descripcion || '',
            esRecurrente: t.esRecurrente
        })
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        await api.put(`/api/transacciones/${editando}`, { ...formEdit, monto: parseFloat(formEdit.monto) })
        fetchTransacciones(mes, anio)
        setEditando(null)
    }

    const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

    const inputClass = "w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    const labelClass = "text-sm text-gray-400 mb-1 block"

    const totalGastos = transacciones.filter(t => t.tipo === 'GASTO').reduce((sum, t) => sum + parseFloat(t.monto), 0)
    const totalIngresos = transacciones.filter(t => t.tipo === 'INGRESO').reduce((sum, t) => sum + parseFloat(t.monto), 0)

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
                                    {categorias
                                        .filter(c => c.tipo === form.tipo)
                                        .map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
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

                {editando && (
                    <div className="bg-gray-900 rounded-2xl p-6 mb-8">
                        <h2 className="text-lg font-semibold mb-4">Editar transacción</h2>
                        <form onSubmit={handleEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Cuenta</label>
                                <select className={inputClass} value={formEdit.cuentaId}
                                        onChange={e => setFormEdit({...formEdit, cuentaId: e.target.value})} required>
                                    <option value="">Seleccioná cuenta</option>
                                    {categorias
                                        .filter(c => c.tipo === formEdit.tipo)
                                        .map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Categoría</label>
                                <select className={inputClass} value={formEdit.categoriaId}
                                        onChange={e => setFormEdit({...formEdit, categoriaId: e.target.value})} required>
                                    <option value="">Seleccioná categoría</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.icono} {c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Monto</label>
                                <input type="number" className={inputClass}
                                       value={formEdit.monto} onChange={e => setFormEdit({...formEdit, monto: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select className={inputClass} value={formEdit.tipo}
                                        onChange={e => setFormEdit({...formEdit, tipo: e.target.value})}>
                                    <option value="GASTO">Gasto</option>
                                    <option value="INGRESO">Ingreso</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Fecha</label>
                                <input type="date" className={inputClass}
                                       value={formEdit.fecha} onChange={e => setFormEdit({...formEdit, fecha: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <input type="text" className={inputClass} placeholder="Opcional"
                                       value={formEdit.descripcion} onChange={e => setFormEdit({...formEdit, descripcion: e.target.value})} />
                            </div>
                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit"
                                        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg transition font-semibold">
                                    Guardar
                                </button>
                                <button type="button" onClick={() => setEditando(null)}
                                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                    <button onClick={mesAnterior} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition">
                        <ChevronLeft size={20} />
                    </button>
                    <select className="bg-gray-800 text-white px-3 py-2 rounded-lg" value={mes} onChange={handleMesChange}>
                        {MESES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                    </select>
                    <select className="bg-gray-800 text-white px-3 py-2 rounded-lg" value={anio} onChange={handleAnioChange}>
                        {[2023, 2024, 2025, 2026, 2027].map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <button onClick={mesSiguiente} className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-900 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Ingresos</p>
                        <p className="text-xl font-bold text-emerald-400">+₡{totalIngresos.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-900 rounded-xl p-4">
                        <p className="text-sm text-gray-400">Gastos</p>
                        <p className="text-xl font-bold text-red-400">-₡{totalGastos.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    {transacciones.length === 0 && <p className="text-gray-400">No hay transacciones en este mes.</p>}
                    {transacciones.map(t => (
                        <div key={t.id} className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {t.tipo === 'GASTO'
                                    ? <ArrowDownCircle size={24} className="text-red-400" />
                                    : <ArrowUpCircle size={24} className="text-emerald-400" />}
                                <div>
                                    <p className="font-semibold">
                                        {categorias.find(c => c.id === t.categoriaId)?.icono} {categorias.find(c => c.id === t.categoriaId)?.nombre || 'Sin categoría'}
                                    </p>
                                    <p className="text-sm text-gray-400">{t.descripcion || 'Sin descripción'} · {t.fecha}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className={`text-lg font-bold ${t.tipo === 'GASTO' ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {t.tipo === 'GASTO' ? '-' : '+'} ₡{parseFloat(t.monto).toLocaleString()}
                                </p>
                                <button onClick={() => abrirEditar(t)}
                                        className="text-emerald-400 hover:text-emerald-300 transition">
                                    <Pencil size={16} />
                                </button>
                                <button onClick={() => eliminar(t.id)}
                                        className="text-red-400 hover:text-red-300 transition">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Transacciones