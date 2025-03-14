import { apiClient } from './config';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Booking, 
  Specialist,
  Service 
} from '../types/api';

// Booking Endpoints
export const bookingApi = {
  // Get all bookings
  getBookings: async (params?: { 
    status?: string; 
    page?: number; 
    limit?: number;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Booking>>('/bookings', { params });
    return response.data;
  },

  // Get single booking
  getBooking: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return response.data;
  },

  // Create booking
  createBooking: async (data: {
    specialistId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    const response = await apiClient.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await apiClient.post<ApiResponse<Booking>>(`/bookings/${id}/cancel`);
    return response.data;
  },
};

// Specialist API endpoints
export const specialistApi = {
  // Get all specialists
  getSpecialists: async () => {
    const response = await apiClient.get<Array<{specialists: Specialist[]}>>('/specialists');
    return response.data[0]?.specialists || [];
  },

  // Get single specialist
  getSpecialist: async (id: string) => {
    const response = await apiClient.get<Array<{specialists: Specialist[]}>>('/specialists');
    const specialists = response.data[0]?.specialists || [];
    const specialist = specialists.find(s => s.id === id);
    if (!specialist) {
      throw new Error('Specialist not found');
    }
    return specialist;
  },

  // Get specialist availability
  getAvailability: async (id: string, date: string) => {
    const response = await apiClient.get<ApiResponse<string[]>>(
      `/specialists/${id}/availability`,
      { params: { date } }
    );
    return response.data;
  },
};

// Service Endpoints
export const serviceApi = {
  // Get all services
  getServices: async () => {
    const response = await apiClient.get<ApiResponse<Service[]>>('/services');
    return response.data;
  },
  getService: async (id: string) => {
    const response = await apiClient.get<Array<{treatments: Service[]}>>('/services');
    const treatments = response.data[0]?.treatments || [];
    const treatment = treatments.find(t => t.id === id);
    if (!treatment) {
      throw new Error('Treatment not found');
    }
    return treatment;
  },
};