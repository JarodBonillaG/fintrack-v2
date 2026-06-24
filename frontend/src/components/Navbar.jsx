import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, Target, LogOut } from 'lucide-react'

function Navbar() {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
            <span className="text-xl font-bold text-emerald-400">FinTrack</span>
            <div className="flex gap-6 items-center">
                <Link to="/dashboard" className="flex items-center gap-1 hover:text-emerald-400 transition">
                    <LayoutDashboard size={16} /> Dashboard
                </Link>
                <Link to="/transacciones" className="flex items-center gap-1 hover:text-emerald-400 transition">
                    <ArrowLeftRight size={16} /> Transacciones
                </Link>
                <Link to="/categorias" className="flex items-center gap-1 hover:text-emerald-400 transition">
                    <Tag size={16} /> Categorías
                </Link>
                <Link to="/metas" className="flex items-center gap-1 hover:text-emerald-400 transition">
                    <Target size={16} /> Metas
                </Link>
                <button onClick={handleLogout}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition">
                    <LogOut size={16} /> Salir
                </button>
            </div>
        </nav>
    )
}

export default Navbar