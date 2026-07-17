import { api } from "./api"
import Cookies from 'js-cookie';
import type { LoginFormValues, RegisterFormValues } from "../schemas/auth"

export const authService = {
  async login(data: LoginFormValues) {
    const response = await api.post('/login', data)
    
    if (response.data.access_token) {
      Cookies.set('auth_token', response.data.access_token, { expires: 7, secure: true, sameSite: 'strict' })
    }
    return {
      user: response.data.user,
      token: response.data.access_token
    }
  },

  async register(data: RegisterFormValues) {
    const response = await api.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      role: 'client' // Padrão
    })
    
    if (response.data.access_token) {
      Cookies.set('auth_token', response.data.access_token, { expires: 7, secure: true, sameSite: 'strict' })
    }
    return {
      user: response.data.user,
      token: response.data.access_token
    }
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch (e) {
      // Ignorar erros no logout (ex: token já expirado)
    }
    Cookies.remove('auth_token')
  },

  async getUser() {
    const response = await api.get('/me')
    return response.data
  }
}
