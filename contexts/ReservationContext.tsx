import React, { createContext, ReactNode, useContext, useState } from "react";

type ReservationContextType = {
  user_id: number | null;
  facility_id: number | null;
  date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  facility_fee: number | null;  
  discounted_fee: number | null;

  // amenities
  event_type: string | null;
  guest_count: number | null;
  chair_quantity: number | null;
  chair_price: number | null;
  table_quantity: number | null;
  table_price: number | null;
  videoke: number | null;
  videoke_price: number | null;
  projector: number | null;
  projector_price: number | null;
  brides_room: number | null;
  brides_room_price: number | null;
  island_garden: number | null;
  island_garden_price: number | null;


  // setters
  setFacilityId: React.Dispatch<React.SetStateAction<number | null>>;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setFacilityFee: React.Dispatch<React.SetStateAction<number | null>>;
  setDiscountedFee: React.Dispatch<React.SetStateAction<number | null>>;

  setEventType: React.Dispatch<React.SetStateAction<string | null>>;
  setGuestCount: React.Dispatch<React.SetStateAction<number | null>>;
  setChairQuantity: React.Dispatch<React.SetStateAction<number | null>>;
  setChairPrice: React.Dispatch<React.SetStateAction<number | null>>;
  setTableQuantity: React.Dispatch<React.SetStateAction<number | null>>;
  setTablePrice: React.Dispatch<React.SetStateAction<number | null>>;
  setVideoke: React.Dispatch<React.SetStateAction<number | null>>;
  setVideokePrice: React.Dispatch<React.SetStateAction<number | null>>;
  setProjector: React.Dispatch<React.SetStateAction<number | null>>;
  setProjectorPrice: React.Dispatch<React.SetStateAction<number | null>>;
  setBridesRoom: React.Dispatch<React.SetStateAction<number | null>>;
  setBridesRoomPrice: React.Dispatch<React.SetStateAction<number | null>>;
  setIslandGarden: React.Dispatch<React.SetStateAction<number | null>>;
  setIslandGardenPrice: React.Dispatch<React.SetStateAction<number | null>>;
  resetReservation: () => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [user_id, setUserId] = useState<number | null>(null);
  const [facility_id, setFacilityId] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [start_time, setStartTime] = useState<Date | null>(null);
  const [end_time, setEndTime] = useState<Date | null>(null);
  const [facility_fee, setFacilityFee] = useState<number | null>(null);
  const [discounted_fee, setDiscountedFee] = useState<number | null>(null);


  // amenities states
  const [event_type, setEventType] = useState<string | null>(null);
  const [guest_count, setGuestCount] = useState<number | null>(null);
  const [chair_quantity, setChairQuantity] = useState<number | null>(null);
  const [chair_price, setChairPrice] = useState<number | null>(null);
  const [table_quantity, setTableQuantity] = useState<number | null>(null);
  const [table_price, setTablePrice] = useState<number | null>(null);
  const [videoke, setVideoke] = useState<number | null>(null);
  const [videoke_price, setVideokePrice] = useState<number | null>(null);
  const [projector, setProjector] = useState<number | null>(null);
  const [projector_price, setProjectorPrice] = useState<number | null>(null);
  const [brides_room, setBridesRoom] = useState<number | null>(null);
  const [brides_room_price, setBridesRoomPrice] = useState<number | null>(null);
  const [island_garden, setIslandGarden] = useState<number | null>(null);
  const [island_garden_price, setIslandGardenPrice] = useState<number | null>(null);

  const resetReservation = () => {
    setUserId(null);
    setFacilityId(null);
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setFacilityFee(null);
    setDiscountedFee(null);

    // reset amenities
    setEventType(null);
    setGuestCount(null);
    setChairQuantity(null);
    setChairPrice(null);
    setTableQuantity(null);
    setTablePrice(null);
    setVideoke(null);
    setVideokePrice(null);
    setProjector(null);
    setProjectorPrice(null);
    setBridesRoom(null);
    setBridesRoomPrice(null);
    setIslandGarden(null);
    setIslandGardenPrice(null);
  };

  return (
    <ReservationContext.Provider
      value={{
        user_id,
        facility_id,
        date,
        start_time,
        end_time,
        facility_fee,
        discounted_fee,
        event_type,
        guest_count,
        chair_quantity,
        chair_price,
        table_quantity,
        table_price,
        videoke,
        videoke_price,
        projector,
        projector_price,
        brides_room,
        brides_room_price,
        island_garden,
        island_garden_price,
        setFacilityId,
        setDate,
        setStartTime,
        setEndTime,
        setFacilityFee,
        setDiscountedFee,
        setEventType,
        setGuestCount,
        setChairQuantity,
        setChairPrice,
        setTableQuantity,
        setTablePrice,
        setVideoke,
        setVideokePrice,
        setProjector,
        setProjectorPrice,
        setBridesRoom,
        setBridesRoomPrice,
        setIslandGarden,
        setIslandGardenPrice,
        resetReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within ReservationProvider");
  }
  return context;
};
