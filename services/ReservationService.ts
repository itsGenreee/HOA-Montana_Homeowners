import { useAuth } from "@/contexts/AuthContext";
import api from "@/utils/api";
import dayjs from "dayjs";
import { useCallback } from "react";

export const useReservationService = () => {
  const { user } = useAuth();

  // Stable getUserReservations function
  const getUserReservations = useCallback(async () => {
    if (!user) throw new Error("User not logged in");

    const response = await api.get("/reservations");
    console.log(response.data);
    return response.data; // Array of reservations
  }, [user]);

  const create = async (reservation: {
    user_id: number;
    facility: string;
    date: Date;
    start_time: Date;
    end_time: Date;
    fee?: number | null;
  }) => {
    if (!user) throw new Error("User not logged in");

    const reservationData = {
      user_id: user.id, // Automatically bind current user
      facility: reservation.facility,
      date: dayjs(reservation.date).format("YYYY-MM-DD"),
      start_time: dayjs(reservation.start_time).format("HH:mm"),
      end_time: dayjs(reservation.end_time).format("HH:mm"),
      fee: reservation.fee ?? null,
    };

    const response = await api.post("/reservations/store", reservationData);

    if (__DEV__) console.log("Reservation created:", response.data);

    return response.data;
  };

  return { create, getUserReservations };
};
