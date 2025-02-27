import { create } from 'zustand';
import { bookingApi, specialistApi } from '../api/endpoints';
import type { Booking, Specialist } from '../types/api';

interface BookingStore {
  // Booking State
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  
  // Selected booking data
  selectedSpecialist: Specialist | null;
  selectedDate: string | null;
  selectedTime: string | null;

  // Actions
  fetchBookings: (status?: string) => Promise<void>;
  createBooking: (data: {
    specialistId: string;
    serviceId: string;
    date: string;
    time: string;
    notes?: string;
  }) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  
  // Booking flow actions
  setSelectedSpecialist: (specialist: Specialist | null) => void;
  setSelectedDateTime: (date: string, time: string) => void;
  clearBookingData: () => void;
}

export const useBookingStore = create<BookingStore>((set, get) => ({
  // Initial state
  bookings: [],
  loading: false,
  error: null,
  selectedSpecialist: null,
  selectedDate: null,
  selectedTime: null,

  // Fetch bookings
  fetchBookings: async (status) => {
    try {
      set({ loading: true, error: null });
      const response = await bookingApi.getBookings({ status });
      set({ bookings: response.data, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        loading: false 
      });
    }
  },

  // Create booking
  createBooking: async (data) => {
    try {
      set({ loading: true, error: null });
      const response = await bookingApi.createBooking(data);
      // Add new booking to state
      set(state => ({
        bookings: [response.data, ...state.bookings],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        loading: false 
      });
      throw error;
    }
  },

  // Cancel booking
  cancelBooking: async (id) => {
    try {
      set({ loading: true, error: null });
      await bookingApi.cancelBooking(id);
      // Update booking status in state
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === id 
            ? { ...booking, status: 'cancelled' as const }
            : booking
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred', 
        loading: false 
      });
      throw error;
    }
  },

  // Booking flow actions
  setSelectedSpecialist: (specialist) => {
    set({ selectedSpecialist: specialist });
  },

  setSelectedDateTime: (date, time) => {
    set({ selectedDate: date, selectedTime: time });
  },

  clearBookingData: () => {
    set({
      selectedSpecialist: null,
      selectedDate: null,
      selectedTime: null
    });
  },
}));