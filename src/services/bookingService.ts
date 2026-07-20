import api from '../lib/api/axios';
import { BookingFormData } from '../features/bookings/bookingSlice';

export interface BookingCreatePayload {
  patientId: string;
  doctorId?: string;
  testIds?: string[];
  preferredDate?: string;
  notes?: string;
  email?: string;
  phone?: string;
  paymentMode?: string;
  amount?: number;
}

const normalizePaymentMode = (payType?: string) => {
  const normalized = (payType || '').toLowerCase();

  switch (normalized) {
    case 'cash':
      return 'CASH';
    case 'card':
    case 'debit/credit card':
      return 'CARD';
    case 'upi':
      return 'UPI';
    case 'cheque':
      return 'CHEQUE';
    case 'online':
    case 'online transfer':
      return 'ONLINE';
    default:
      return (payType || '').toUpperCase();
  }
};

const normalizeGender = (sex?: string) => {
  const normalized = (sex || '').toLowerCase();
  if (normalized.includes('female')) return 'Female';
  if (normalized.includes('male')) return 'Male';
  return 'Other';
};

export const buildBookingCreatePayload = (bookingData: BookingFormData): BookingCreatePayload => ({
  patientId: '',
  testIds: bookingData.tests
    .map((test) => test.backendId || test.id)
    .filter(Boolean) as string[],
  preferredDate: bookingData.date || undefined,
  notes: bookingData.cancelRemark || undefined,
  email: bookingData.email || undefined,
  phone: bookingData.mobile || undefined,
  paymentMode: normalizePaymentMode(bookingData.payType),
  amount: Number(bookingData.net || bookingData.total || bookingData.amount || 0),
});

class BookingService {
  // Fetch dropdown data
  async getCentres() {
    try {
      const response = await api.get('/bookings/centres');
      return response.data;
    } catch (error) {
      console.error('Error fetching centres:', error);
      return [];
    }
  }

  async getDoctors() {
    try {
      const response = await api.get('/bookings/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  }

  async getTests() {
    try {
      const response = await api.get('/tests');
      const payload = response.data as unknown;
      const items = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { items?: unknown[] })?.items)
          ? (payload as { items: unknown[] }).items
          : [];

      return items.map((item: any) => ({
        value: item?.code || item?.name || item?.testName || item?.id,
        label: item?.name || item?.testName || item?.code || 'Unnamed Test',
        rate: Number(item?.rate ?? item?.price ?? 0),
        backendId: item?.id ?? item?.uuid ?? item?.testId,
        code: item?.code || item?.name || item?.testName || item?.id,
      }));
    } catch (error) {
      console.error('Error fetching tests:', error);
      return [];
    }
  }

  async getSampleTypes() {
    try {
      const response = await api.get('/bookings/sample-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching sample types:', error);
      return [];
    }
  }

  async getPanels() {
    try {
      const response = await api.get('/bookings/panels');
      return response.data;
    } catch (error) {
      console.error('Error fetching panels:', error);
      return [];
    }
  }

  async createPatient(bookingData: BookingFormData) {
    try {
      const response = await api.post('/patients', {
        name: bookingData.patientName?.trim() || 'Unknown Patient',
        phone: bookingData.mobile?.trim() || undefined,
        email: bookingData.email?.trim() || undefined,
        gender: normalizeGender(bookingData.sex),
        address: bookingData.area?.trim() || undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  async createBooking(bookingData: BookingFormData) {
    try {
      const patient = await this.createPatient(bookingData);
      const patientId = patient?.id || patient?.patientId || '';
      if (!patientId) {
        throw new Error('Unable to create or resolve a patient for this booking.');
      }

      const payload = {
        ...buildBookingCreatePayload(bookingData),
        patientId,
      };

      const response = await api.post('/bookings', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(bookingId: string, bookingData: Partial<BookingFormData>) {
    try {
      const response = await api.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async getBooking(bookingId: string) {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  async deleteBooking(bookingId: string) {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }

  async searchBookings(query: string) {
    try {
      const response = await api.get('/bookings/search', {
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
      const response = await api.get(`/bookings/${bookingId}/print`, {
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
      const response = await api.post('/bookings/report', bookingData, {
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
