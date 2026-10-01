import { useEffect, useRef, useState } from 'react'
import api from '../api/api'
import { waitForServer } from '../api/waitForServer'
import { LogIn, Loader2  } from 'lucide-react'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [serverStatus, setServerStatus] = useState('starting')
    const [attempt, setAttempt] = useState(0)
    const readiness = useRef(null)
    const submitted = useRef(false)
    const loginController = useRef(null)

    useEffect(() => {
        const controller = new AbortController()
        setServerStatus('starting')
        readiness.current = waitForServer(
            options => api.get('/api/health', { ...options, skipAuth: true }),
            controller.signal,
        ).then(ready => {
            if (!controller.signal.aborted) setServerStatus(ready ? 'ready' : 'unavailable')
            return ready
        })
        return () => {
            controller.abort()
            loginController.current?.abort()
        }
    }, [attempt])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitted.current) return
        submitted.current = true
        const controller = new AbortController()
        loginController.current = controller
        setLoading(true)
        setError('')
        try {
            const ready = await readiness.current
            if (controller.signal.aborted) return
            if (!ready) {
                setError('El servidor aún no está disponible. Pulsá Reintentar para volver a conectarlo.')
                return
            }
            const res = await api.post('/api/auth/login', { email, password }, {
                skipAuth: true,
                timeout: 15000,
                signal: controller.signal,
            })
            localStorage.setItem('token', res.data.token)
            window.location.href = '/dashboard'
        } catch (err) {
            if (!controller.signal.aborted) {
                setError(err.response?.status === 401
                    ? 'Correo o contraseña incorrectos'
                    : 'No pudimos iniciar sesión por un problema de conexión o del servidor. Intentá nuevamente.')
            }
        } finally {
            submitted.current = false
            if (!controller.signal.aborted) setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h1 className="text-3xl font-bold text-emerald-400 mb-1">FinTrack</h1>
                <p className="text-gray-400 mb-8">Controlá tus finanzas personales</p>

                {serverStatus === 'starting' && (
                    <div role="status" className="bg-gray-800 text-gray-300 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin text-emerald-400 shrink-0" />
                        <span>Iniciando servidor. La primera conexión puede tardar alrededor de un minuto. Podés escribir tus datos mientras esperás.</span>
                    </div>
                )}

                {serverStatus === 'unavailable' && (
                    <div role="status" className="bg-gray-800 text-gray-300 px-4 py-3 rounded-lg mb-4 text-sm">
                        <p>El servidor está tardando más de lo esperado.</p>
                        <button type="button" disabled={loading} onClick={() => {
                            setError('')
                            setServerStatus('starting')
                            setAttempt(value => value + 1)
                        }} className="text-emerald-400 underline mt-2 disabled:opacity-50">Reintentar conexión</button>
                    </div>
                )}

                {error && (
                    <div role="alert" className="bg-red-900 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {loading && serverStatus === 'ready' && (
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
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || serverStatus === 'unavailable'}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition mt-2"
                    >
                        {loading
                            ? <><Loader2 size={18} className="animate-spin" /> {serverStatus === 'starting' ? 'Esperando servidor...' : 'Entrando...'}</>
                            : <><LogIn size={18} /> Entrar</>
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
