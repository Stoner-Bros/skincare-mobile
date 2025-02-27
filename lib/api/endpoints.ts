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

// Specialist Endpoints
export const specialistApi = {
  // Get all specialists
  getSpecialists: async (params?: {
    service?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<PaginatedResponse<Specialist>>('/specialists', { 
      params 
    });
    return response.data;
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
};