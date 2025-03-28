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
  ServiceUpdateRequest,
  SkinTherapistCreationRequest,
  SkinTherapistUpdateRequest,
  SkinTestAnswerSubmission,
  SkinTestAnswerRequest,
  BookingCreationRequest,
  BookingUpdateRequest,
  AccountUpdateRequest
} from '../types/api';
import { apiClient } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
  updateAccount: async (id: number, data: AccountUpdateRequest) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      console.log("Updating account with data:", data);
      
      // Gửi data trực tiếp không wrap trong request
      const response = await apiClient.put(`/api/accounts/${id}`, {
        fullName: data.fullName,
        avatar: data.avatar || null,
        phone: data.phone || null,
        address: data.address || null,
        dob: data.dob || null,
        otherInfo: data.otherInfo || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Raw API response:", response);
      return response.data;
    } catch (error) {
      console.error("Error updating account:", error);
      throw error;
    }
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
  validateToken: async (token: string) => {
    const response = await apiClient.get('/api/auth/validate-token', {
      params: { token }
    });
    return response.data;
  },
  
  // Logout
  logout: async () => {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        AsyncStorage.getItem("accessToken"),
        AsyncStorage.getItem("refreshToken")
      ]);

      if (!accessToken || !refreshToken) {
        throw new Error("Missing tokens");
      }

      const response = await apiClient.post('/api/auth/logout', {
        accessToken,
        refreshToken
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Logout response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  // Get user profile
  getProfile: async () => {
    const token = await AsyncStorage.getItem("accessToken");
    const response = await apiClient.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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

// SkinTherapist API endpoints
export const skinTherapistApi = {
  // Lấy danh sách các nhà trị liệu da
  getTherapists: async (pageNumber = 1, pageSize = 10) => {
    const response = await apiClient.get('/api/skintherapists', {
      params: { pageNumber, pageSize }
    });
    return response;
  },
  
  // Lấy thông tin nhà trị liệu da theo ID
  getTherapist: async (id: number) => {
    const response = await apiClient.get(`/api/skintherapists/${id}`);
    return response;
  },
  
  // Tạo nhà trị liệu da mới
  createTherapist: async (data: SkinTherapistCreationRequest) => {
    const response = await apiClient.post('/api/skintherapists', data);
    return response;
  },
  
  // Cập nhật thông tin nhà trị liệu da
  updateTherapist: async (id: number, data: SkinTherapistUpdateRequest) => {
    const response = await apiClient.put(`/api/skintherapists/${id}`, data);
    return response;
  },
  
  // Xóa nhà trị liệu da
  deleteTherapist: async (id: number) => {
    const response = await apiClient.delete(`/api/skintherapists/${id}`);
    return response;
  }
};

// Booking API endpoints
export const bookingApi = {
  // Tạo booking mới
  createBooking: async (data: BookingCreationRequest) => {
    try {
      console.log('Creating booking with data:', data);
      
      // Gửi trực tiếp data, không wrap trong object request nữa
      const response = await apiClient.post('/api/bookings', data);
      console.log('Booking creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  // Lấy danh sách bookings
  getBookings: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/api/bookings', {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Lấy lịch sử booking
  getBookingHistory: async (customerId: number, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/api/bookings/history', {
        params: { customerId, pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking history:', error);
      throw error;
    }
  },

  // Lấy lịch sử booking theo email
  getBookingHistoryByEmail: async (email: string) => {
    try {
      const response = await apiClient.get(`/api/bookings/history/email`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking history by email:', error);
      throw error;
    }
  },

  // Lấy chi tiết booking
  getBooking: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Cập nhật booking
  updateBooking: async (id: number, data: BookingUpdateRequest) => {
    try {
      const response = await apiClient.put(`/api/bookings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  // Hủy booking
  cancelBooking: async (id: number) => {
    try {
      const response = await apiClient.delete(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error canceling booking ${id}:`, error);
      throw error;
    }
  }
};

// Blog API endpoints
export const blogApi = {
  // Get all blogs with pagination
  getBlogs: async (page = 1, pageSize = 5) => {
    try {
      console.log(`Đang gọi GET /api/blogs với page=${page}, pageSize=${pageSize}`);
      const response = await apiClient.get('/api/blogs', {
        params: { page, pageSize }
      });
      
      // Log cấu trúc response để debug
      console.log(`Phản hồi từ API blogs:`, 
        JSON.stringify({
          statusCode: response.status,
          hasData: !!response.data,
          dataType: typeof response.data,
          itemsCount: response.data?.items?.length || 0
        })
      );
      
      // Đảm bảo mỗi item có một id duy nhất
      if (response.data && response.data.items && Array.isArray(response.data.items)) {
        response.data.items = response.data.items.map((item: Blog, index: number) => ({
          ...item,
          // Thêm timestamp vào blogId để đảm bảo tính duy nhất
          uniqueId: `${item.blogId}-${Date.now()}-${index}`
        }));
      }
      
      return response.data;
    } catch (error: any) {
      console.error("Error fetching blogs:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  // Get blog by id
  getBlog: async (id: string | number) => {
    try {
      console.log(`Đang gọi GET /api/blogs/${id}`);
      const response = await apiClient.get(`/api/blogs/${id}`);
      
      console.log(`Phản hồi từ API blog detail:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching blog ${id}:`, {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  // Create blog
  createBlog: async (data: BlogCreationRequest, token?: string) => {
    const response = await apiClient.post('/api/blogs', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
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
  getTreatments: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/api/treatments', {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error: any) {
      console.error("Error fetching treatments:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  // Get treatment by id
  getTreatment: async (id: number) => {
    try {
      // Đảm bảo id là số
      if (typeof id !== 'number') {
        throw new Error('Treatment ID must be a number');
      }
      
      const response = await apiClient.get(`/api/treatments/${id}`);
      return response;
    } catch (error: any) {
      console.error("Error in getTreatment:", {
        id,
        status: error.response?.status,
        message: error.response?.data?.message || error.message
      });
      throw error;
    }
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

  // Thêm method để lấy URL file
  getFileUrl: (fileName: string) => {
    return `${apiClient.defaults.baseURL}/api/upload/${fileName}`;
  }
};

// Skin Test API endpoints
export const skinTestApi = {
  // Lấy tất cả skin tests
  getSkinTests: async () => {
    const response = await apiClient.get('/api/skin-tests');
    return response.data;
  },

  // Lấy một skin test theo ID
  getSkinTest: async (id: number) => {
    const response = await apiClient.get(`/api/skin-tests/${id}`);
    return response.data;
  },

  // Lấy câu hỏi theo skin test ID
  getQuestionsBySkinTest: async (skinTestId: number) => {
    const response = await apiClient.get(`/api/skin-test-questions/by-skin-test/${skinTestId}`);
    return response.data;
  },

  // Lấy một câu hỏi cụ thể
  getQuestion: async (id: number) => {
    const response = await apiClient.get(`/api/skin-test-questions/${id}`);
    return response.data;
  },

  // Submit answers và trả về answerId
  submitAnswers: async (data: SkinTestAnswerRequest) => {
    try {
      console.log('Raw submit data:', data);
      
      const submitData = {
        skinTestId: data.skinTestId,
        customerId: data.customerId,
        email: data.email?.trim(),
        fullName: data.fullName?.trim(),
        phone: data.phone?.trim() || "0353066296",
        answers: data.answers.map(ans => ans.toUpperCase())
      };

      console.log('Formatted submit data:', submitData);

      const response = await apiClient.post('/api/skin-test-answers', submitData);
      console.log('Submit response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Submit error:', error);
      throw error;
    }
  },

  // Lấy kết quả theo answerId
  getResult: async (answerId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-results/${answerId}`);
      return response.data;
    } catch (error) {
      console.error('Get result error:', error);
      throw error;
    }
  },

  // Lấy kết quả
  getResults: async () => {
    const response = await apiClient.get('/api/skin-test-results');
    return response.data;
  },

  // Lấy lịch sử skin test answers theo customerId
  getAnswerHistory: async (customerId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-answers/history/${customerId}`);
      console.log('Answer history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting answer history:', error);
      throw error;
    }
  },

  // Lấy lịch sử skin test answers theo email
  getAnswerHistoryByEmail: async (email: string) => {
    try {
      const response = await apiClient.get('/api/skin-test-answers/history', {
        params: { email }
      });
      console.log('Answer history by email response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting answer history by email:', error);
      throw error;
    }
  },

  // Lấy chi tiết một câu trả lời cụ thể
  getAnswerDetail: async (answerId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-answers/${answerId}`);
      console.log('Answer detail response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting answer detail for ID ${answerId}:`, error);
      throw error;
    }
  },

  // Lấy tất cả kết quả skin test của một customer
  getCustomerResults: async (customerId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-results/customer/${customerId}`);
      console.log('Customer results response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting results for customer ${customerId}:`, error);
      throw error;
    }
  },

  // Lấy answer id theo customer id
  getCustomerAnswers: async (customerId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-answers/customer/${customerId}`);
      console.log('Customer answers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting customer answers:', error);
      throw error;
    }
  },

  // Lấy kết quả test theo answer id
  getTestResult: async (answerId: number) => {
    try {
      // Sửa đường dẫn API từ /api/skin-test-results/${answerId} thành /api/skin-test-results/answer/${answerId}
      const response = await apiClient.get(`/api/skin-test-results/answer/${answerId}`);
      console.log('Test result response:', response.data);
      
      // Kiểm tra và format response data
      if (response.data) {
        return {
          result: response.data.result || response.data.description || "Không có kết quả",
          resultId: response.data.resultId,
          skinTestAnswerId: response.data.skinTestAnswerId,
          // Thêm các trường khác nếu cần
        };
      }
      
      throw new Error("Invalid response format");
    } catch (error) {
      console.error('Error getting test result:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Trường hợp chưa có kết quả
        return {
          result: null,
          message: "Kết quả đang được xử lý"
        };
      }
      throw error;
    }
  },

  // Sửa lại hàm getLatestTestResult để xử lý tốt hơn
  getLatestTestResult: async () => {
    try {
      // Lấy customer id từ AsyncStorage
      const accountId = await AsyncStorage.getItem('accountId');
      if (!accountId) {
        throw new Error('No account ID found');
      }

      // Lấy danh sách answers của customer
      const answersResponse = await skinTestApi.getCustomerAnswers(Number(accountId));
      if (!answersResponse || !answersResponse.length) {
        throw new Error('No test answers found');
      }

      // Lấy answer id mới nhất (giả sử API trả về theo thứ tự mới nhất)
      const latestAnswerId = answersResponse[0].answerId;

      // Lấy kết quả test từ answer id
      const result = await skinTestApi.getTestResult(latestAnswerId);
      
      // Kiểm tra kết quả
      if (!result || !result.result) {
        return {
          status: "pending",
          message: "Kết quả đang được xử lý"
        };
      }

      return result;
    } catch (error) {
      console.error('Error getting latest test result:', error);
      throw error;
    }
  }
};

// Skin Test Question API endpoints
export const skinTestQuestionApi = {
  // Lấy tất cả câu hỏi
  getQuestions: async () => {
    try {
      const response = await apiClient.get('/api/skin-test-questions');
      console.log('Questions response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting questions:', error);
      throw error;
    }
  },

  // Lấy câu hỏi theo ID
  getQuestion: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-questions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting question ${id}:`, error);
      throw error;
    }
  },

  // Lấy câu hỏi theo skin test ID
  getQuestionsBySkinTest: async (skinTestId: number) => {
    try {
      const response = await apiClient.get(`/api/skin-test-questions/by-skin-test/${skinTestId}`);
      console.log('Questions by skin test:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error getting questions for skin test ${skinTestId}:`, error);
      throw error;
    }
  }
};

// Time Slots API endpoints
export const timeSlotsApi = {
  // Lấy tất cả time slots có sẵn
  getTimeSlots: async () => {
    try {
      console.log('Fetching available time slots...');
      const response = await apiClient.get('/api/timeslots');
      console.log('Time slots response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching time slots:', error);
      throw error;
    }
  },
  
  // Lấy chi tiết time slot
  getTimeSlot: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/timeslots/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching time slot ${id}:`, error);
      throw error;
    }
  },

  // Lấy time slots theo specialist và ngày
  getSpecialistTimeSlots: async (specialistId: number, date: string) => {
    try {
      const response = await apiClient.get('/api/skin-therapist-schedules', {
        params: { 
          specialistId,
          date
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching specialist time slots:', error);
      throw error;
    }
  },

  // Kiểm tra slot có available không
  checkSlotAvailability: async (specialistId: number, date: string, timeSlotIds: number[]) => {
    try {
      const response = await apiClient.post('/api/skin-therapist-schedules/check-availability', {
        specialistId,
        date,
        timeSlotIds
      });
      return response.data;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      throw error;
    }
  },

  // Lấy danh sách therapist rảnh theo time slot
  getFreeTherapists: async (date: string, timeSlotIds: number[], pageNumber = 1, pageSize = 10) => {
    try {
      // Chuyển mảng timeSlotIds thành chuỗi được phân tách bằng dấu phẩy
      const timeSlotIdsString = timeSlotIds.join(',');
      
      const response = await apiClient.get('/api/skintherapists/free', {
        params: {
          date,
          timeSlotIds: timeSlotIdsString, // Gửi dưới dạng string "1,2,3"
          pageNumber,
          pageSize
        }
      });
      
      console.log('API Request params:', {
        date,
        timeSlotIds: timeSlotIdsString,
        pageNumber,
        pageSize
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching free therapists:', error);
      throw error;
    }
  }
  
};

// Customer API endpoints
export const customerApi = {
  // Lấy tất cả customers
  getCustomers: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await apiClient.get('/api/customers', {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Lấy customer theo id
  getCustomer: async (id: number) => {
    try {
      const response = await apiClient.get(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  // Lấy customer theo accountId
  getCustomerByAccountId: async (accountId: number) => {
    try {
      const response = await apiClient.get(`/api/customers/by-account/${accountId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer by account ${accountId}:`, error);
      throw error;
    }
  },

  // Tạo customer mới
  createCustomer: async (data: any) => {
    try {
      const response = await apiClient.post('/api/customers', data);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Cập nhật customer
  updateCustomer: async (id: number, data: any) => {
    try {
      const response = await apiClient.put(`/api/customers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  // Xóa customer
  deleteCustomer: async (id: number) => {
    try {
      const response = await apiClient.delete(`/api/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }
};

// MoMo API endpoints
export const momoApi = {
  // Tạo yêu cầu thanh toán MoMo
  createPayment: async (data: {
    amount: string;
    orderId: string;
    orderInfo: string;
    paymentMethod?: string;
  }) => {
    try {
      const response = await apiClient.post('/api/momo/create-payment', {
        amount: data.amount,
        orderId: data.orderId,
        orderInfo: data.orderInfo,
        paymentMethod: data.paymentMethod || "momo"
      });
      return response.data;
    } catch (error) {
      console.error('Error creating MoMo payment:', error);
      throw error;
    }
  },

  // Xử lý callback từ MoMo
  handleCallback: async (query: any) => {
    try {
      const response = await apiClient.get('/api/momo/callback', { params: query });
      return response.data;
    } catch (error) {
      console.error('Error handling MoMo callback:', error);
      throw error;
    }
  }
};

// Thêm vào object api
export const feedbackApi = {
  getFeedbacks: async (pageNumber = 1, pageSize = 4) => {
    try {
      const response = await apiClient.get('/api/feedbacks', {
        params: { pageNumber, pageSize }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  }
};

// API chung để sử dụng trong ứng dụng
export const api = {
  accounts: accountApi,
  auth: authApi,
  services: services,
  specialists: skinTherapistApi,
  bookings: bookingApi,
  blogs: blogApi,
  treatments: treatmentApi,
  upload: uploadApi,
  skinTest: skinTestApi,
  skinTestQuestions: skinTestQuestionApi,
  timeSlots: timeSlotsApi,
  customers: customerApi,
  momo: momoApi,
  feedback: feedbackApi,
};