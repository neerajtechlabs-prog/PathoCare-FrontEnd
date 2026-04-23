import axios, { AxiosInstance } from 'axios';
import { BookingFormData } from '../features/bookings/bookingSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class BookingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests if available
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Fetch dropdown data
  async getCentres() {
    try {
      const response = await this.api.get('/bookings/centres');
      return response.data;
    } catch (error) {
      console.error('Error fetching centres:', error);
      return [];
    }
  }

  async getDoctors() {
    try {
      const response = await this.api.get('/bookings/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }

  async getTests() {
    try {
      const response = await this.api.get('/bookings/tests');
      return response.data;
    } catch (error) {
      console.error('Error fetching tests:', error);
      return [];
    }
  }

  async getSampleTypes() {
    try {
      const response = await this.api.get('/bookings/sample-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching sample types:', error);
      return [];
    }
  }

  async getPanels() {
    try {
      const response = await this.api.get('/bookings/panels');
      return response.data;
    } catch (error) {
      console.error('Error fetching panels:', error);
      return [];
    }
  }

  // Booking operations
  async createBooking(bookingData: BookingFormData) {
    try {
      const response = await this.api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(bookingId: string, bookingData: Partial<BookingFormData>) {
    try {
      const response = await this.api.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async getBooking(bookingId: string) {
    try {
      const response = await this.api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async deleteBooking(bookingId: string) {
    try {
      const response = await this.api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  async searchBookings(query: string) {
    try {
      const response = await this.api.get('/bookings/search', {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching bookings:', error);
      throw error;
    }
  }

  async printBooking(bookingId: string) {
    try {
      const response = await this.api.get(`/bookings/${bookingId}/print`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error printing booking:', error);
      throw error;
    }
  }

  async generateBookingReport(bookingData: BookingFormData) {
    try {
      const response = await this.api.post('/bookings/report', bookingData, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }
}

export const bookingService = new BookingService();
export default bookingService;
