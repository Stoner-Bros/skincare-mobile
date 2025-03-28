// Account Types
export interface Account {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dob?: string;
  otherInfo?: string;
  role?: 'admin' | 'user' | 'specialist';
  createdAt?: string;
  updatedAt?: string;
}

// Auth Types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
  status: number;
}

export interface AccountCreationRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface AccountInfo {
  accountId: string;
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
}
export interface AccountUpdateRequest {
  fullName: string;
  avatar: string;
  phone: string;
  address: string;
  dob: string;
  otherInfo: string;
}
// Specialist Types
export interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  experience: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  availability: {
    [date: string]: string[]; // date -> available time slots
  };
  bio: string;
  languages: string[];
  certifications: string[];
}

// Service Types
export interface Service {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  price: number;
  categoryId?: number;
}

// Service Category Types
export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  treatments?: Service[];
}

// Location Types
export interface Location {
  id: number;
  name: string;
  address: string;
  rating: number;
  reviews: number;
  image: string;
}

// Booking Types
export interface Booking {
  id: string;
  specialistId: string;
  serviceId: string;
  locationId: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  specialist?: {
    id: string;
    name: string;
    role: string;
    image: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  location?: {
    id: number;
    name: string;
    address: string;
  };
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  qrCodeValue?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// Blog Types
export interface BlogCreationRequest {
  title: string;
  content: string;
  thumbnailUrl?: string;
  tags?: string;
}

export interface BlogUpdateRequest {
  title?: string;
  content?: string;
  thumbnailUrl?: string;
  tags?: string;
}

export interface BlogResponse {
  blogId: number;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  publishAt?: string;
  thumbnailUrl?: string;
  viewCount: number;
  tags?: string;
  isDeleted: boolean;
}

export interface BlogResponsePaginationModel {
  items: BlogResponse[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// Kiểu Blog tùy chỉnh cho UI
export interface Blog extends BlogResponse {
  id: string | number; // Để tương thích với mã hiện có
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  image: string;
  rating: number;
  likes: number;
  comments: number;
}

// Thêm vào phần khai báo PaginatedResponse hiện có
export interface PaginatedBlogResponse {
  data: {
    items: Blog[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
  status: number;
}

// Treatment Types
export interface Treatment {
  treatmentId: number;
  serviceId: number;
  treatmentName: string;
  treatmentThumbnailUrl: string;
  description: string;
  duration: number;
  price: number;
  isAvailable: boolean;
}

export interface TreatmentCreationRequest {
  name: string;
  description: string;
  image?: string;
  duration: number;
  price: number;
  category?: string;
}

export interface TreatmentUpdateRequest {
  name?: string;
  description?: string;
  image?: string;
  duration?: number;
  price?: number;
  category?: string;
}

export interface TreatmentResponse {
  status: number;
  message: string;
  data: {
    items: Treatment[];
  };
}

// Service types
export interface ServiceCreationRequest {
  serviceName: string;
  serviceDescription?: string;
  serviceThumbnailUrl?: string;
}

export interface ServiceUpdateRequest {
  serviceName?: string;
  serviceDescription?: string;
  serviceThumbnailUrl?: string;
  isAvailable?: boolean;
}

export interface ServiceResponse {
  serviceId: number;
  serviceName: string;
  serviceDescription?: string;
  serviceThumbnailUrl?: string;
  isAvailable: boolean;
}

export interface ServiceResponsePaginationModel {
  items: ServiceResponse[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// SkinTherapist Types
export interface SkinTherapistCreationRequest {
  email: string;
  password: string;
  fullName: string;
  specialization: string;
  experience?: string;
  introduction?: string;
  bio?: string;
}

export interface SkinTherapistUpdateRequest {
  fullName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  dob?: string;
  otherInfo?: string;
  specialization?: string;
  experience?: string;
  introduction?: string;
  bio?: string;
  isAvailable?: boolean;
}

export interface SkinTherapistResponse {
  accountId: number;
  specialization: string;
  experience?: string;
  introduction?: string;
  bio?: string;
  rating: number;
  isAvailable: boolean;
  account: {
    accountId: number;
    email: string;
    createdAt: string;
    updateAt: string;
    role: string;
    isDeleted: boolean;
    accountInfo: {
      accountId: number;
      fullName: string;
      avatar?: string;
      phone?: string;
      address?: string;
      dob?: string;
      otherInfo?: string;
    }
  }
}

export interface SkinTherapistResponsePaginationModel {
  items: SkinTherapistResponse[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// Định nghĩa kiểu đơn giản hơn cho UI
export interface SpecialistUI {
  id: number;
  fullName: string;
  specialization: string;
  avatar?: string;
  experience?: string;
  bio?: string;
  rating: number;
  isAvailable: boolean;
  introduction?: string;
  email: string;
  phone?: string;
  address?: string;
}

// Cập nhật các interface cho Skin Test
export interface SkinTestQuestion {
  skinTestQuestionId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

export interface SkinTest {
  skinTestId: number;
  testName: string;
  description: string;
  createdAt: string;
  skinTestQuestions: SkinTestQuestion[];
}

export interface SkinTestAnswerRequest {
  skinTestId: number;
  customerId?: number;
  email: string;
  fullName: string;
  phone: string;
  answers: string[]; // ["A", "B", "C", "D"]
}

export interface SkinTestResult {
  resultId: number;
  customerId?: number;
  guestId?: number;
  skinTestAnswerId: number;
  result: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkinCareProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  skinTypes: string[];
  ingredients: string[];
  benefits: string[];
  howToUse: string;
}

export interface SkinTestAnswerSubmission {
  userId: string;
  answers: {
    questionId: number;
    optionId: number;
  }[];
}

export interface SkinTestAnswerResponse {
  skinTestAnswerId: number;
  message?: string;
  status?: number;
}

export interface SkinTestResultResponse {
  resultId: number;
  result: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  timeSlotId: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  notes?: string;
}

export interface TimeSlotsResponse {
  status: number;
  message: string;
  data: TimeSlot[];
}

// Thêm các interface mới cho booking flow
export interface BookingCreationRequest {
  email: string;
  phone?: string;
  fullName: string;
  treatmentId: number;
  skinTherapistId?: number | null;
  notes?: string;
  date: string;
  timeSlotIds: number[];
  paymentMethod: string;
}

export interface BookingUpdateRequest {
  skinTherapistId?: number;
  staffId?: number;
  status?: string;
  checkinAt?: string;
  checkoutAt?: string;
}

export interface BookingResponse {
  bookingId: number;
  email: string;
  phone: string;
  fullName: string;
  treatmentId: number;
  skinTherapistId?: number;
  status: string;
  notes?: string;
  timeSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingHistoryResponse {
  items: BookingResponse[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

// Thêm các interface cho Feedback
export interface FeedbackReply {
  feedbackReplyId: number;
  staffName: string;
  feedbackId: number;
  reply: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  feedbackId: number;
  bookingId: number;
  feedbackBy: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  feedbackReplies: FeedbackReply[];
}

export interface FeedbackResponse {
  items: Feedback[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}