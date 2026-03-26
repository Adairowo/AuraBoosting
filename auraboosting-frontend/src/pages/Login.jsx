import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import useAuthStore from '../store/authStore'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (payload) => login(payload),
    onSuccess: () => {
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    },
    onError: () => {
      setError('No pudimos iniciar sesión. Revisa tus credenciales.')
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    mutation.mutate(form)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm justify-center">
        <a className="btn btn-ghost text-xl">AuraBoosting Dashboard</a>
      </div>
      <div className="hero bg-base-200 min-h-screen">
      
        <div className="hero-content flex-col lg:flex-row-reverse gap-10">
          <div className="text-center lg:text-left max-w-xl">
            <p className="badge badge-outline mb-3">AuraBoosting</p>
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6 opacity-80">
              Accede al panel de administración para gestionar juegos, clases, pagos y reseñas.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl border border-base-300">
            <div className="card-body">
              <form className="space-y-3" onSubmit={handleSubmit}>
                <fieldset className="fieldset">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                  />
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="input input-bordered"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <div>
                    <span className="link link-hover text-sm">Forgot password?</span>
                  </div>
                  {error ? <p className="text-error text-sm">{error}</p> : null}
                  <button
                    type="submit"
                    className="btn btn-neutral mt-4"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Iniciando sesión...' : 'Login'}
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
