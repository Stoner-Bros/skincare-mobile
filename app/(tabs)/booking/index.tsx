import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingTabs from "@/components/booking/BookingTabs";
import CanceledBookings from "@/components/booking/CanceledBookings";
import UpcomingBookings from "@/components/booking/UpcommingBookings";
import PastBookings from "@/components/booking/PastBooking";
type TabType = "upcoming" | "past" | "canceled";

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("upcoming");

  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader />
      <BookingTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "upcoming" && <UpcomingBookings />}
        {activeTab === "past" && <PastBookings />}
        {activeTab === "canceled" && <CanceledBookings />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
// import React, { useEffect } from 'react';
// import { View, Text } from 'react-native';
// import { useBookings } from '../../../lib/hooks/useBookings';
// import { BookingList } from '../../../components/booking/BookingList';
// import { LoadingSpinner } from '../../../components/common/LoadingSpinner';
// import { ErrorMessage } from '../../../components/common/ErrorMessage';

// export default function BookingsScreen() {
//   const {
//     bookings,
//     loading,
//     error,
//     activeTab,
//     setActiveTab,
//     fetchBookings
//   } = useBookings();

//   useEffect(() => {
//     fetchBookings();
//   }, [activeTab]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <ErrorMessage message={error} />;

//   return (
//     <View style={{ flex: 1 }}>
//       <BookingList
//         bookings={bookings}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//       />
//     </View>
//   );
// }
