import { useState } from 'react'
import axios from 'axios'
import { LogIn } from 'lucide-react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            window.location.href = '/dashboard'
        } catch (err) {
            setError('Credenciales incorrectas')
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h1 className="text-3xl font-bold text-emerald-400 mb-1">FinTrack</h1>
                <p className="text-gray-400 mb-8">Controlá tus finanzas personales</p>

                {error && (
                    <div className="bg-red-900 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
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
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1 block">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition mt-2"
                    >
                        <LogIn size={18} /> Entrar
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login