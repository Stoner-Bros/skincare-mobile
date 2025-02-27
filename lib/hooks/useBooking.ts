import { useState, useCallback } from 'react';
import { useBookingStore } from '../store/booking';
import type { Booking } from '../types/api';

export function useBookings() {
  const store = useBookingStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  const fetchBookingsByStatus = useCallback(async () => {
    const status = activeTab === 'upcoming' ? 'confirmed' : activeTab;
    await store.fetchBookings(status);
  }, [activeTab, store.fetchBookings]);

  const getFilteredBookings = useCallback((): Booking[] => {
    if (activeTab === 'upcoming') {
      return store.bookings.filter(
        booking => ['pending', 'confirmed'].includes(booking.status)
      );
    }
    return store.bookings.filter(booking => booking.status === activeTab);
  }, [store.bookings, activeTab]);

  return {
    bookings: getFilteredBookings(),
    loading: store.loading,
    error: store.error,
    activeTab,
    setActiveTab,
    fetchBookings: fetchBookingsByStatus,
    cancelBooking: store.cancelBooking,
  };
}