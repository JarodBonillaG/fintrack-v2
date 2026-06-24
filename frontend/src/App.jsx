import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transacciones from './pages/Transacciones'
import Categorias from './pages/Categorias'
import Metas from './pages/Metas'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transacciones" element={<Transacciones />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/metas" element={<Metas />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App