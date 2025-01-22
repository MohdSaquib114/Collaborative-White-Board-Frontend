"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";



interface RoomContextType {
  host: string | null;
  roomId: string | null;
  setHost: (host: string) => void;
  setRoomId: (roomId: string) => void;
}



const RoomContext = createContext<RoomContextType | undefined>(undefined);



export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [host, setHost] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  return (
    <RoomContext.Provider value={{ host, roomId, setHost, setRoomId }}>
      {children}
    </RoomContext.Provider>
  );
};



export const useRoomContext = (): RoomContextType => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
};
