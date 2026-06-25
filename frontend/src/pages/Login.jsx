import { useState } from 'react'
import api from '../api/api'
import { LogIn, Loader2  } from 'lucide-react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await api.post('/api/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            window.location.href = '/dashboard'
        } catch (err) {
            setError('Credenciales incorrectas')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h1 className="text-3xl font-bold text-emerald-400 mb-1">FinTrack</h1>
                <p className="text-gray-400 mb-8">Controlá tus finanzas personales</p>

                {error && (
                    <div className="bg-red-900 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin text-emerald-400" />
                        Conectando con el servidor, puede tardar unos segundos...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition mt-2"
                    >
                        {loading
                            ? <><Loader2 size={18} className="animate-spin" /> Entrando...</>
                            : <><LogIn size={18} /> Entrar</>
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login