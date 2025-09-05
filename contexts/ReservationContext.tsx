import React, { createContext, ReactNode, useContext, useState } from "react";

type ReservationContextType = {
  user_id: number | null;
  facility_id: number | null;
  date: Date | null;
  start_time: Date | null;
  end_time: Date | null;
  fee: number | null;  // nullable fee
  setFacilityId: React.Dispatch<React.SetStateAction<number | null>>;
  setDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setStartTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndTime: React.Dispatch<React.SetStateAction<Date | null>>;
  setFee: React.Dispatch<React.SetStateAction<number | null>>; // setter
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
  const [fee, setFee] = useState<number | null>(null); // nullable

  const resetReservation = () => {
    setUserId(null);
    setFacilityId(null);
    setDate(null);
    setStartTime(null);
    setEndTime(null);
    setFee(null); // reset fee too
  };

  return (
    <ReservationContext.Provider
      value={{
        user_id,
        facility_id,
        date,
        start_time,
        end_time,
        fee,
        setFacilityId,
        setDate,
        setStartTime,
        setEndTime,
        setFee,
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
