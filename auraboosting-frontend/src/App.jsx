import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ShellLayout from './components/ShellLayout.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import LoginPage from './pages/Login.jsx'
import GamesPage from './pages/Games.jsx'
import UsersPage from './pages/Users.jsx'
import ClassesPage from './pages/Classes.jsx'
import EnrollmentsPage from './pages/Enrollments.jsx'
import PlaceholderPage from './pages/Placeholder.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ShellLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="games" element={<GamesPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="enrollments" element={<EnrollmentsPage />} />
        <Route path="payments" element={<PlaceholderPage title="Pagos" />} />
        <Route path="reviews" element={<PlaceholderPage title="Reseñas" />} />
        <Route path="settings" element={<PlaceholderPage title="Configuración" />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
