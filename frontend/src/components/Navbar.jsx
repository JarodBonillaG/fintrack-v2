import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Tag, Target, LogOut, Menu, X } from 'lucide-react'

function Navbar() {
    const navigate = useNavigate()
    const [menuAbierto, setMenuAbierto] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/')
    }

    const cerrarMenu = () => setMenuAbierto(false)

    return (
        <nav className="bg-gray-900 text-white px-6 py-4">
            <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-400">FinTrack</span>

                {/* Links desktop */}
                <div className="hidden md:flex gap-6 items-center">
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

                <button onClick={() => setMenuAbierto(!menuAbierto)} className="md:hidden">
                    {menuAbierto ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {menuAbierto && (
                <div className="md:hidden flex flex-col gap-4 mt-4 pb-2">
                    <Link to="/dashboard" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-emerald-400 transition">
                        <LayoutDashboard size={18} /> Dashboard
                    </Link>
                    <Link to="/transacciones" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-emerald-400 transition">
                        <ArrowLeftRight size={18} /> Transacciones
                    </Link>
                    <Link to="/categorias" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-emerald-400 transition">
                        <Tag size={18} /> Categorías
                    </Link>
                    <Link to="/metas" onClick={cerrarMenu} className="flex items-center gap-2 hover:text-emerald-400 transition">
                        <Target size={18} /> Metas
                    </Link>
                    <button onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition w-fit">
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar