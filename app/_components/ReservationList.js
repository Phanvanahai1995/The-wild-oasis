"use client";

import { deleteReservation } from "../_lib/action";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";

function ReservationList({ bookings }) {
  // useOptimistic Xử lý như bộ giảm tốc không phải đợi để cập nhật dữ liệu, cập nhật đc ngay
  // Dùng để thêm hoặc xóa
  // Nếu xảy ra lỗi sẽ khôi phục lại dữ liệu ban đầu

  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((book) => book.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
