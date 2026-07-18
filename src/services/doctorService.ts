import api from '../lib/api/axios';

export interface DoctorPayload {
  id?: string;
  name: string;
  registrationNumber?: string;
  specialization?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  rateCard?: string;
  notes?: string;
}

const base = '/doctors';

export const doctorService = {
  async list(q?: string) {
    const resp = await api.get(base, { params: q ? { q } : {} });
    return resp as any;
  },

  async create(payload: DoctorPayload) {
    const resp = await api.post(base, payload);
    return resp as any;
  },

  async update(id: string, payload: DoctorPayload) {
    const resp = await api.put(`${base}/${id}`, payload);
    return resp as any;
  },

  async remove(id: string) {
    const resp = await api.delete(`${base}/${id}`);
    return resp as any;
  },
};

export default doctorService;
