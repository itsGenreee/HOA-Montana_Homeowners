import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import api from "@/utils/api";
import dayjs from "dayjs";
import { useCallback } from "react";

export const useReservationService = () => {
  const { user } = useAuth();
  const {
    chair_quantity,
    table_quantity,
    videoke,
    projector,
    brides_room,
    island_garden,
  } = useReservation();

  // Map ReservationContext → amenities payload
  const buildAmenitiesPayload = () => {
    const amenities: { amenity_id: number; quantity: number }[] = [];

    if (chair_quantity && chair_quantity > 0) {
      amenities.push({ amenity_id: 1, quantity: chair_quantity });
    }
    if (table_quantity && table_quantity > 0) {
      amenities.push({ amenity_id: 2, quantity: table_quantity });
    }
    if (videoke && videoke > 0) {
      amenities.push({ amenity_id: 3, quantity: videoke });
    }
    if (projector && projector > 0) {
      amenities.push({ amenity_id: 4, quantity: projector });
    }
    if (brides_room && brides_room > 0) {
      amenities.push({ amenity_id: 5, quantity: brides_room });
    }
    if (island_garden && island_garden > 0) {
      amenities.push({ amenity_id: 6, quantity: island_garden });
    }

    return amenities;
  };

  // Get reservations for the logged-in user
  const getUserReservations = useCallback(async () => {
    if (!user) throw new Error("User not logged in");

    const response = await api.get("/reservations");
    if (__DEV__) console.log("Reservations:", response.data);
    return response.data;
  }, [user]);

  // Fetch amenities (latest from server)
  const getAmenities = useCallback(async () => {
    if (!user) throw new Error("User not logged in");

    const response = await api.get("/amenities");
    if (__DEV__) console.log("Amenities:", response.data);
    return response.data;
  }, [user]);

  // Create a reservation
  const create = async (reservation: {
    facility_id: number;
    date: Date;
    start_time: Date;
    end_time: Date;
    guest_count?: number | null;
    event_type?: string | null;
  }) => {
    if (!user) throw new Error("User not logged in");

    const reservationData = {
      facility_id: reservation.facility_id,
      date: dayjs(reservation.date).format("YYYY-MM-DD"),
      start_time: dayjs(reservation.start_time).format("HH:mm"),
      end_time: dayjs(reservation.end_time).format("HH:mm"),
      guest_count: reservation.guest_count ?? null,
      event_type: reservation.event_type ?? null,
      amenities: buildAmenitiesPayload(), // ✅ include amenities from context
    };

    const response = await api.post("/reservations/store", reservationData);

    if (__DEV__) console.log("Reservation created:", response.data);

    return response.data;
  };

  return { create, getUserReservations, getAmenities };
};
