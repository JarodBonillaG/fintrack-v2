import { useEffect, useState } from 'react'
import api from '../api/api'
import Navbar from '../components/Navbar'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'

function Dashboard() {
    const [cuentas, setCuentas] = useState([])

    useEffect(() => {
        api.get('/api/cuentas')
            .then(res => setCuentas(res.data))
            .catch(() => {
                localStorage.removeItem('token')
                window.location.href = '/'
            })
    }, [])

    const totalBalance = cuentas.reduce((sum, c) => sum + parseFloat(c.balance || 0), 0)

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-gray-400 mb-8">Resumen de tus finanzas</p>

                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 mb-8">
                    <p className="text-emerald-100 text-sm mb-1">Balance total</p>
                    <p className="text-4xl font-bold">₡ {totalBalance.toLocaleString()}</p>
                </div>

                <h2 className="text-xl font-semibold mb-4">Mis Cuentas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cuentas.length === 0 && (
                        <p className="text-gray-400">No tenés cuentas todavía.</p>
                    )}
                    {cuentas.map(c => (
                        <div key={c.id} className="bg-gray-800 rounded-xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2 rounded-lg">
                                    <Wallet size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">{c.nombre}</p>
                                    <p className="text-sm text-gray-400">{c.tipo} · {c.moneda}</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold text-emerald-400">
                                {parseFloat(c.balance).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard