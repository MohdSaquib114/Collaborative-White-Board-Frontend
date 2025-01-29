"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface RoomContextType {
  username: string | null;
  roomId: string | null;
  isHost: boolean | null;
  setUsername: (host: string) => void;
  setIsHost: (isHost: boolean) => void;
  setRoomId: (roomId: string) => void;
  socket: WebSocket | null;
  setSocket: (socket: WebSocket) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Safe JSON parsing function
const safeJsonParse = (value: string | null) => {
  if (!value || value === "undefined") return null; // Fix for parsing issue
  try {
   
    return JSON.parse(value);
  } catch (error) {
    console.error("Error parsing JSON from localStorage:", value, error);
    return null;
  }
};

export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return safeJsonParse(localStorage.getItem("username"));
  });

  const [roomId, setRoomId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return safeJsonParse(localStorage.getItem("roomId"));
  });

  const [isHost,setIsHost] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const value = localStorage.getItem("isHost")
    if (!value || value === "undefined") return false; // Fix for parsing issue
    try {
     
      return JSON.parse(value);
    } catch (error) {
      console.error("Error parsing JSON from localStorage:", value, error);
      return false;
    }  });


  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (username !== null) {
      localStorage.setItem("username", JSON.stringify(username));
    } else {
      localStorage.removeItem("username");
    }

    if (roomId !== null) {
      localStorage.setItem("roomId", JSON.stringify(roomId));
    } else {
      localStorage.removeItem("roomId");
    }
 
    if (isHost !== false) {
      localStorage.setItem("isHost", JSON.stringify(isHost));
    } else {
      localStorage.removeItem("isHost");
    }
 
  }, [username, roomId, isHost]);

  return (
    <RoomContext.Provider value={{ username, roomId, setUsername, setRoomId, socket, setSocket,isHost ,setIsHost }}>
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
