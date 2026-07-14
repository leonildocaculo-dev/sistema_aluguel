import { api } from "./api"

export const propertyService = {
  async getFeaturedProperties() {
    // Para MVP, usando o endpoint de pesquisa genérico ou um futuro endpoint /featured
    const response = await api.get('/properties', {
      params: { per_page: 4 } // Limitando para recomendações
    })
    return response.data.data // Assumindo estrutura paginada do Laravel
  },

  async searchProperties(params: any) {
    const response = await api.get('/properties', { params })
    return response.data
  },
  
  async getProperty(id: string | number) {
    const response = await api.get(`/properties/${id}`)
    return response.data.data
  }
}
