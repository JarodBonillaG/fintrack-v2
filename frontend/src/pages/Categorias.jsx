import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Plus, Tag, Trash2, Pencil  } from 'lucide-react'

const ICONOS = [
    { emoji: '🍔', label: 'Comida' },
    { emoji: '🏠', label: 'Hogar' },
    { emoji: '🚗', label: 'Transporte' },
    { emoji: '💊', label: 'Salud' },
    { emoji: '🎮', label: 'Entretenimiento' },
    { emoji: '👕', label: 'Ropa' },
    { emoji: '📚', label: 'Educación' },
    { emoji: '✈️', label: 'Viajes' },
    { emoji: '💰', label: 'Ingresos' },
    { emoji: '🎵', label: 'Música' },
    { emoji: '🐾', label: 'Mascotas' },
    { emoji: '⚽', label: 'Deporte' },
    { emoji: '🍺', label: 'Social' },
    { emoji: '💡', label: 'Servicios' },
    { emoji: '📱', label: 'Tecnología' },
    { emoji: '🛒', label: 'Supermercado' },
    { emoji: '💼', label: 'Trabajo' },
    { emoji: '🎁', label: 'Regalos' },
    { emoji: '🏋️', label: 'Gym' },
    { emoji: '🌿', label: 'Naturaleza' },
]

function Categorias() {
    const [categorias, setCategorias] = useState([])
    const [mostrarForm, setMostrarForm] = useState(false)
    const [form, setForm] = useState({ nombre: '', tipo: 'GASTO', icono: '🍔' })

    useEffect(() => {
        api.get('/api/categorias').then(res => setCategorias(res.data))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await api.post('/api/categorias', form)
        const res = await api.get('/api/categorias')
        setCategorias(res.data)
        setForm({ nombre: '', tipo: 'GASTO', icono: '🍔' })
        setMostrarForm(false)
    }

    const eliminar = async (id) => {
        await api.delete(`/api/categorias/${id}`)
        const res = await api.get('/api/categorias')
        setCategorias(res.data)
    }

    const inputClass = "w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    const labelClass = "text-sm text-gray-400 mb-1 block"

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Categorías</h1>
                        <p className="text-gray-400">Organizá tus gastos e ingresos</p>
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
                        <h2 className="text-lg font-semibold mb-4">Nueva categoría</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input type="text" className={inputClass} placeholder="Ej: Alimentación"
                                       value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select className={inputClass} value={form.tipo}
                                        onChange={e => setForm({...form, tipo: e.target.value})}>
                                    <option value="GASTO">Gasto</option>
                                    <option value="INGRESO">Ingreso</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className={labelClass}>Ícono</label>
                                <select className={inputClass} value={form.icono}
                                        onChange={e => setForm({...form, icono: e.target.value})}>
                                    {ICONOS.map(i => (
                                        <option key={i.emoji} value={i.emoji}>{i.emoji} {i.label}</option>
                                    ))}
                                </select>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categorias.length === 0 && <p className="text-gray-400">No hay categorías todavía.</p>}
                    {categorias.map(c => (
                        <div key={c.id} className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-800 rounded-lg p-3 text-2xl">{c.icono}</div>
                                <div>
                                    <p className="font-semibold">{c.nombre}</p>
                                    <p className="text-sm text-gray-400">{c.tipo}</p>
                                </div>
                            </div>
                            <button onClick={() => eliminar(c.id)}
                                    className="text-red-400 hover:text-red-300 transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Categorias