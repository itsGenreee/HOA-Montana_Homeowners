import React, { createContext, useContext, useState, ReactNode } from "react";

type ReservationContextType = {
  facility: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  setFacility: React.Dispatch<React.SetStateAction<string | null>>;
  setDate: React.Dispatch<React.SetStateAction<string | null>>;
  setStartTime: React.Dispatch<React.SetStateAction<string | null>>;
  setEndTime: React.Dispatch<React.SetStateAction<string | null>>;
  resetReservation: () => void;
};

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

export const ReservationProvider = ({ children }: { children: ReactNode }) => {
  const [facility, setFacility] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [start_time, setStartTime] = useState<string | null>(null);
  const [end_time, setEndTime] = useState<string | null>(null);

  const resetReservation = () => {
    setFacility(null);
    setDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  return (
    <ReservationContext.Provider
      value={{
        facility,
        date,
        start_time,
        end_time,
        setFacility,
        setDate,
        setStartTime,
        setEndTime,
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
