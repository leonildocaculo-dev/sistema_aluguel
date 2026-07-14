import { api } from "./api"
import type { LoginFormValues, RegisterFormValues } from "../schemas/auth"

export const authService = {
  async login(data: LoginFormValues) {
    // Para Sanctum SPA authentication, primeiro chamamos o CSRF cookie endpoint
    await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
    const response = await api.post('/login', data)
    
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    return {
      user: response.data.user,
      token: response.data.access_token
    }
  },

  async register(data: RegisterFormValues) {
    await api.get('/sanctum/csrf-cookie', { baseURL: 'http://localhost:8000' })
    const response = await api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      role: 'client' // Padrão
    })
    
    if (response.data.access_token) {
      localStorage.setItem('auth_token', response.data.access_token)
    }
    return {
      user: response.data.user,
      token: response.data.access_token
    }
  },

  async logout() {
    await api.post('/logout')
    localStorage.removeItem('auth_token')
  },

  async getUser() {
    const response = await api.get('/user')
    return response.data
  }
}
