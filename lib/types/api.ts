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
  id: string | number;
  name: string;
  description: string;
  image: string;
  duration: number;
  price: number;
  category?: string;
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
  // Các trường response từ API
  id: string | number;
  name: string;
  description: string;
  image: string;
  duration: number;
  price: number;
  category?: string;
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