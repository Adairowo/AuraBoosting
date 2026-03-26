import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const navItems = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/games', label: 'Juegos' },
  { to: '/classes', label: 'Clases' },
  { to: '/users', label: 'Usuarios' },
  { to: '/enrollments', label: 'Inscripciones' },
  { to: '/payments', label: 'Pagos' },
  { to: '/reviews', label: 'Reseñas' },
  { to: '/settings', label: 'Configuración' },
]

function ShellLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="grid lg:grid-cols-[260px_1fr] min-h-screen">
        <aside className="bg-base-300/40 border-r border-base-300 p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div>
              <p className="font-bold">AuraBoosting</p>
              <p className="text-xs opacity-70">Panel Admin</p>
            </div>
          </div>
          <nav className="menu rounded-box">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                className={({ isActive }) =>
                  isActive ? 'active font-semibold' : 'font-medium opacity-80'
                }
              >
                <span className="px-3 py-2 block rounded-btn hover:bg-base-200">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex flex-col min-h-screen">
          <header className="navbar bg-base-100 border-b border-base-300 px-6">
            <div className="flex-1">
              <p className="text-sm opacity-70">Sesión iniciada como: </p>

              <p className="font-semibold">{user?.name || 'Admin'}</p>
            </div>
            <div className="flex-none">
              <button className="btn btn-sm btn-outline btn-secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </header>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default ShellLayout
