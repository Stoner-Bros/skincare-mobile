import { useState } from 'react';
import { api } from '@/lib/api/endpoints';
import type { 
  Treatment, 
  SkinTherapist,
  TimeSlot,
  BookingCreationRequest 
} from '@/lib/types/api';

export interface BookingState {
  treatment?: Treatment;
  treatmentId?: number;
  specialist?: SkinTherapist;
  specialistId?: number;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
  timeSlotIds: number[];
  customerInfo?: {
    email: string;
    phone: string;
    fullName: string;
  };
  notes?: string;
}

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<BookingState>({
    timeSlotIds: []
  });

  const handleApiCall = async <T,>(
    apiCall: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      return await apiCall();
    } catch (err: any) {
      setError(err.message || errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchTreatments = async () => {
    return handleApiCall(
      async () => {
        const response = await api.treatments.getTreatments();
        return response.data.items;
      },
      'Failed to fetch treatments'
    );
  };

  const fetchSpecialists = async () => {
    return handleApiCall(
      async () => {
        const response = await api.specialists.getTherapists();
        return response.data.items;
      },
      'Failed to fetch specialists'
    );
  };

  const fetchTimeSlots = async (date: Date, specialistId?: number) => {
    return handleApiCall(
      async () => {
        const response = await api.timeSlots.getTimeSlots();
        return response.data;
      },
      'Failed to fetch time slots'
    );
  };

  const createBooking = async () => {
    if (!bookingState.treatmentId || !bookingState.timeSlotIds.length || !bookingState.customerInfo) {
      throw new Error('Missing required booking information');
    }

    return handleApiCall(
      async () => {
        const bookingData: BookingCreationRequest = {
          treatmentId: bookingState.treatmentId,
          timeSlotIds: bookingState.timeSlotIds,
          specialistId: bookingState.specialistId,
          ...bookingState.customerInfo,
          notes: bookingState.notes
        };
        return await api.bookings.createBooking(bookingData);
      },
      'Failed to create booking'
    );
  };

  const updateBookingState = (updates: Partial<BookingState>) => {
    setBookingState(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    loading,
    error,
    bookingState,
    updateBookingState,
    fetchTreatments,
    fetchSpecialists,
    fetchTimeSlots,
    createBooking
  };
};