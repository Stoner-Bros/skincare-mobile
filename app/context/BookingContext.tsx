import React, { createContext, useContext } from "react";
import { useBooking, BookingState } from "@/lib/hooks/useBooking";

const BookingContext = createContext<ReturnType<typeof useBooking> | undefined>(
  undefined
);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const bookingHook = useBooking();
  return (
    <BookingContext.Provider value={bookingHook}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingContext() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBookingContext must be used within BookingProvider");
  }
  return context;
}

export type { BookingState };
export default BookingProvider;
