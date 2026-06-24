import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Target, Plus, TrendingUp, Calendar, DollarSign, AlertCircle, Trash } from 'lucide-react'

function Metas() {
    const [metas, setMetas] = useState([])
    const [form, setForm] = useState({ nombre: '', montoObjetivo: '', fechaLimite: '' })
    const [aporte, setAporte] = useState({ id: '', monto: '', cuentaId: '' })
    const [showNuevaMeta, setShowNuevaMeta] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [cuentas, setCuentas] = useState([])

    useEffect(() => {
        cargarMetas()
        api.get('/api/cuentas').then(res => setCuentas(res.data))
    }, [])

    const cargarMetas = async () => {
        try {
            const res = await api.get('/api/metas')
            setMetas(res.data)
        } catch {
            localStorage.removeItem('token')
            window.location.href = '/'
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post('/api/metas', {
            ...form,
            montoObjetivo: parseFloat(form.montoObjetivo)
        })
        await cargarMetas()
        setForm({ nombre: '', montoObjetivo: '', fechaLimite: '' })
        setShowNuevaMeta(false)
    }

    const handleAporte = async (e) => {
        e.preventDefault()
        await api.put(`/api/metas/${aporte.id}/aporte?monto=${aporte.monto}&cuentaId=${aporte.cuentaId}`)
        await cargarMetas()
        setAporte({ id: '', monto: '', cuentaId: '' })
    }

    const handleDelete = async (id) => {
        await api.delete(`/api/metas/${id}`)
        await cargarMetas()
    }

    const calcularProgreso = (actual, objetivo) => {
        const porcentaje = (actual / objetivo) * 100
        return Math.min(porcentaje, 100)
    }

    const totalAhorrado = metas.reduce((sum, m) => sum + parseFloat(m.montoActual || 0), 0)
    const totalObjetivo = metas.reduce((sum, m) => sum + parseFloat(m.montoObjetivo || 0), 0)

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold">Metas de Ahorro</h1>
                    <button
                        onClick={() => setShowNuevaMeta(!showNuevaMeta)}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition"
                    >
                        <Plus size={20} />
                        Nueva Meta
                    </button>
                </div>
                <p className="text-gray-400 mb-8">Seguí el progreso de tus objetivos financieros</p>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 text-sm">Total ahorrado</p>
                        <p className="text-2xl font-bold text-emerald-400">
                            ₡ {totalAhorrado.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 text-sm">Objetivo total</p>
                        <p className="text-2xl font-bold text-white">
                            ₡ {totalObjetivo.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-5">
                        <p className="text-gray-400 text-sm">Progreso general</p>
                        <p className="text-2xl font-bold text-blue-400">
                            {totalObjetivo > 0 ? Math.round((totalAhorrado / totalObjetivo) * 100) : 0}%
                        </p>
                    </div>
                </div>

                {showNuevaMeta && (
                    <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Target size={22} className="text-emerald-400" />
                            Nueva Meta
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Viaje a Europa"
                                    value={form.nombre}
                                    onChange={e => setForm({...form, nombre: e.target.value})}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Monto objetivo</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={form.montoObjetivo}
                                        onChange={e => setForm({...form, montoObjetivo: e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Fecha límite</label>
                                    <input
                                        type="date"
                                        value={form.fechaLimite}
                                        onChange={e => setForm({...form, fechaLimite: e.target.value})}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-lg transition"
                                >
                                    Crear meta
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowNuevaMeta(false)}
                                    className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {deleteId && (
                    <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400 mb-8 border border-gray-700">
                        <AlertCircle size={48} className="mx-auto mb-3 opacity-50" />
                        <p>¿Estás seguro que querés eliminar esta meta?</p>
                        <div className="flex justify-center gap-3 mt-4">
                            <button
                                onClick={() => {
                                    handleDelete(deleteId)
                                    setDeleteId(null)
                                }}
                                className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg transition"
                            >
                                Eliminar
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-4">Mis Metas</h2>
                <div className="grid grid-cols-1 gap-4">
                    {metas.length === 0 && (
                        <div className="bg-gray-800 rounded-xl p-8 text-center text-gray-400">
                            <Target size={48} className="mx-auto mb-3 opacity-50" />
                            <p>No tenés metas de ahorro todavía.</p>
                            <p className="text-sm">Creá una para empezar a ahorrar</p>
                        </div>
                    )}

                    {metas.map(m => {
                        const progreso = calcularProgreso(parseFloat(m.montoActual), parseFloat(m.montoObjetivo))
                        const estaCompleta = progreso >= 100

                        return (
                            <div key={m.id} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className={`p-2 rounded-lg ${estaCompleta ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                                <Target size={18} />
                                            </div>
                                            <h3 className="font-semibold text-lg">{m.nombre}</h3>
                                            {estaCompleta && (
                                                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">
                                                    ✅ Completada
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setDeleteId(m.id)}
                                                className="ml-auto text-red-400 hover:text-red-300 transition"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <DollarSign size={14} />
                                                ₡ {parseFloat(m.montoActual).toLocaleString()} / ₡ {parseFloat(m.montoObjetivo).toLocaleString()}
                                            </span>
                                            {m.fechaLimite && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(m.fechaLimite).toLocaleDateString()}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1 text-emerald-400">
                                                <TrendingUp size={14} />
                                                {Math.round(progreso)}%
                                            </span>
                                        </div>

                                        <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ${
                                                    estaCompleta ? 'bg-emerald-500' : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${Math.min(progreso, 100)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <select
                                            value={aporte.id === m.id ? aporte.cuentaId : ''}
                                            onChange={e => setAporte({ ...aporte, id: m.id, cuentaId: e.target.value })}
                                            className="w-40 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        >
                                            <option value="">Cuenta</option>
                                            {cuentas.map(c => (
                                                <option key={c.id} value={c.id}>{c.nombre}</option>
                                            ))}
                                        </select>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Monto"
                                                value={aporte.id === m.id ? aporte.monto : ''}
                                                onChange={e => {
                                                    setAporte({ ...aporte, id: m.id, monto: e.target.value })
                                                }}
                                                className="w-28 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                                            />
                                            <button
                                                onClick={handleAporte}
                                                disabled={!aporte.monto || !aporte.cuentaId || aporte.id !== m.id}
                                                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg text-sm transition"
                                            >
                                                Aportar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Metas