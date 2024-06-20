"use client";

import { createContext, useContext, useState } from "react";

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

function ReserverProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const resetRange = () => {
    setRange(initialState);
  };

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (!context) throw new Error("Context not use outside Provider");

  return context;
}

export { ReserverProvider, useReservation };
