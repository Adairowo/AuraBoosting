import api from './client'

export async function login(credentials) {
  const response = await api.post('/login', credentials)
  return response.data.data
}

export async function logout() {
  await api.post('/logout')
}

export async function fetchCurrentUser() {
  const response = await api.get('/me')
  return response.data.data
}
