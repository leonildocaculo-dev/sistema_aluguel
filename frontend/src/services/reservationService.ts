import { api } from "./api";

export const reservationService = {
  async getUserReservations() {
    const response = await api.get('/reservations/me');
    // Assuming backend returns { data: [...] } or just an array
    return response.data.data || response.data;
  },

  async getReservationDetails(id: string | number) {
    const response = await api.get(`/reservations/${id}`);
    return response.data.data || response.data;
  },

  async cancelReservation(id: string | number) {
    const response = await api.post(`/reservations/${id}/cancel`);
    return response.data;
  }
};
