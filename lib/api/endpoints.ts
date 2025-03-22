import type { 
  AuthResponse,
  AccountCreationRequest,
  AuthRequest,
  Blog,
  BlogCreationRequest,
  BlogUpdateRequest,
  TreatmentCreationRequest,
  TreatmentUpdateRequest,
  ServiceCreationRequest,
  ServiceUpdateRequest
} from '../types/api';
import { apiClient } from './config';

// Account API endpoints
export const accountApi = {
  // Get all accounts
  getAccounts: async () => {
    const response = await apiClient.get('/api/accounts');
    return response.data;
  },
  
  // Get account by id
  getAccount: async (id: string) => {
    const response = await apiClient.get(`/api/accounts/${id}`);
    return response.data;
  },
  
  // Create account
  createAccount: async (data: AccountCreationRequest) => {
    const response = await apiClient.post('/api/accounts', data);
    return response.data;
  },
  
  // Update account
  updateAccount: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/accounts/${id}`, data);
    return response.data;
  },
  
  // Delete account
  deleteAccount: async (id: string) => {
    const response = await apiClient.delete(`/api/accounts/${id}`);
    return response.data;
  }
};

// Auth API endpoints
export const authApi = {
  // Login
  login: async (credentials: AuthRequest) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data; // Trả về toàn bộ response để xử lý ở component
  },
  
  // Register
  register: async (userData: AccountCreationRequest) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
  
  // Refresh token
  refreshToken: async (token: string) => {
    const response = await apiClient.post('/api/auth/refresh-token', { token });
    return response.data;
  },
  
  // Validate token
  validateToken: async () => {
    const response = await apiClient.get('/api/auth/validate-token');
    return response.data;
  },
  
  // Logout
  logout: async () => {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },
  
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  }
};

// Service API endpoints
export const services = {
  getServices: async (pageNumber = 1, pageSize = 10) => {
    const response = await apiClient.get('/api/services', {
      params: { pageNumber, pageSize }
    });
    return response;
  },
  
  getService: async (id: string | number) => {
    const response = await apiClient.get(`/api/services/${id}`);
    return response;
  },
  
  createService: async (data: ServiceCreationRequest) => {
    const response = await apiClient.post('/api/services', data);
    return response;
  },
  
  updateService: async (id: string | number, data: ServiceUpdateRequest) => {
    const response = await apiClient.put(`/api/services/${id}`, data);
    return response;
  },
  
  deleteService: async (id: string | number) => {
    const response = await apiClient.delete(`/api/services/${id}`);
    return response;
  }
};

// Specialist API endpoints tương thích với Swagger API
export const specialistApi = {
  // Get all specialists
  getSpecialists: async (serviceId?: string) => {
    const params = serviceId ? { serviceId } : undefined;
    const response = await apiClient.get('/api/specialists', { params });
    return response.data;
  },

  // Get single specialist
  getSpecialist: async (id: string) => {
    const response = await apiClient.get(`/api/specialists/${id}`);
    return response.data;
  },

  // Get specialist availability
  getAvailability: async (id: string, date: string) => {
    const response = await apiClient.get(`/api/specialists/${id}/availability`, { 
      params: { date } 
    });
    return response.data;
  },
};

// Booking API endpoints
export const bookingApi = {
  // Create booking
  createBooking: async (data: any) => {
    const response = await apiClient.post('/api/bookings', data);
    return response.data;
  },
  
  // Get booking details
  getBooking: async (id: string) => {
    const response = await apiClient.get(`/api/bookings/${id}`);
    return response.data;
  },
  
  // Cancel booking
  cancelBooking: async (id: string) => {
    const response = await apiClient.delete(`/api/bookings/${id}`);
    return response.data;
  },
  
  // Update booking
  updateBooking: async (id: string, data: any) => {
    const response = await apiClient.put(`/api/bookings/${id}`, data);
    return response.data;
  }
};


// Blog API endpoints
export const blogApi = {
  // Get all blogs with pagination
  getBlogs: async (page = 1, pageSize = 5) => {
    const response = await apiClient.get('/api/blogs', {
      params: { page, pageSize }
    });
    return response.data;
  },
  
  // Get blog by id
  getBlog: async (id: string | number) => {
    const response = await apiClient.get(`/api/blogs/${id}`);
    return response.data;
  },
  
  // Create blog
  createBlog: async (data: BlogCreationRequest) => {
    const response = await apiClient.post('/api/blogs', data);
    return response.data;
  },
  
  // Update blog
  updateBlog: async (id: string | number, data: BlogUpdateRequest) => {
    const response = await apiClient.put(`/api/blogs/${id}`, data);
    return response.data;
  },
  
  // Delete blog
  deleteBlog: async (id: string | number) => {
    const response = await apiClient.delete(`/api/blogs/${id}`);
    return response.data;
  },

  // Publish blog
  publishBlog: async (id: string | number) => {
    const response = await apiClient.patch(`/api/blogs/publish/${id}`);
    return response.data;
  }
};

// Treatment API endpoints
export const treatmentApi = {
  // Get all treatments
  getTreatments: async () => {
    const response = await apiClient.get('/api/treatments');
    return response.data;
  },
  
  // Get treatment by id
  getTreatment: async (id: string | number) => {
    const response = await apiClient.get(`/api/treatments/${id}`);
    return response.data;
  },
  
  // Create treatment
  createTreatment: async (data: TreatmentCreationRequest) => {
    const response = await apiClient.post('/api/treatments', data);
    return response.data;
  },
  
  // Update treatment
  updateTreatment: async (id: string | number, data: TreatmentUpdateRequest) => {
    const response = await apiClient.put(`/api/treatments/${id}`, data);
    return response.data;
  },
  
  // Delete treatment
  deleteTreatment: async (id: string | number) => {
    const response = await apiClient.delete(`/api/treatments/${id}`);
    return response.data;
  }
};

// Upload API
export const uploadApi = {
  // Upload file
  uploadFile: async (formData: FormData) => {
    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  // Lấy file
  getFile: async (fileName: string) => {
    const response = await apiClient.get(`/api/upload/${fileName}`);
    return response.data;
  },
};

// API chung để sử dụng trong ứng dụng
export const api = {
  accounts: accountApi,
  auth: authApi,
  services: services,
  specialists: specialistApi,
  bookings: bookingApi,
  blogs: blogApi,
  treatments: treatmentApi,
  upload: uploadApi
};