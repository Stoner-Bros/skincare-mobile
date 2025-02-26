import React, { createContext, useContext, useState } from "react";

// Định nghĩa kiểu dữ liệu đặt lịch
interface BookingData {
  service?: { name: string; id: string };
  specialist?: {
    id: number;
    name: string;
    role: string;
    experience: string;
    rating: number;
    reviews: number;
    image: string;
    availability: string[];
    specialties: string[];
  };
  dateTime?: string;
  paymentMethod?: string;
  confirmData?: any;
}

// Định nghĩa type cho Booking Context
interface BookContextType {
  bookingData: BookingData;
  setBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

// Tạo Context
const BookContext = createContext<BookContextType | undefined>(undefined);

// Provider bọc toàn bộ app
const BookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bookingData, setBookingDataState] = useState<BookingData>({});

  // Hàm cập nhật dữ liệu đặt lịch
  const setBookingData = (newData: Partial<BookingData>) => {
    setBookingDataState((prev) => ({ ...prev, ...newData }));
  };

  // Hàm reset toàn bộ dữ liệu đặt lịch
  const resetBooking = () => {
    setBookingDataState({});
  };

  return (
    <BookContext.Provider value={{ bookingData, setBookingData, resetBooking }}>
      {children}
    </BookContext.Provider>
  );
};

// Custom Hook để sử dụng context dễ dàng
export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("⚠️ useBook phải được sử dụng trong BookProvider");
  }
  return context;
};

// ✅ **Default Export**
export default BookProvider;
