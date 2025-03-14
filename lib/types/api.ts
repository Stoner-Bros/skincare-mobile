// Specialist Types
export interface Specialist {
    id: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    reviewCount: number;
    specialties: string[];
    availability: {
      [date: string]: string[]; // date -> available time slots
    };
  }
  
  // Booking Types
  export interface Booking {
    id: string;
    specialistId: string;
    specialist: Specialist;
    serviceId: string;
    serviceName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    price: number;
    notes?: string;
  }
  
  // Service Types
  export interface Service {
    id: string;
    name: string;
    image: string;
    duration: string;
    price: number;
    description: string;
    category: string;
  }
  
  // API Response Types
  export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
  }