import { api } from "./api"
import { LoginFormValues, RegisterFormValues } from "../schemas/auth"

export const authService = {
  async login(data: LoginFormValues) {
    // Para Sanctum SPA authentication, primeiro chamamos o CSRF cookie endpoint
    await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
    const response = await api.post('/api/login', data)
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    return response.data
  },

  async register(data: RegisterFormValues) {
    await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
    const response = await api.post('/api/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      role: 'client' // Padrão
    })
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    return response.data
  },

  async logout() {
    await api.post('/api/logout')
    localStorage.removeItem('auth_token')
  },

  async getUser() {
    const response = await api.get('/api/user')
    return response.data
  }
}
