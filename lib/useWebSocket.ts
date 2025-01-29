import { useRoomContext } from "@/components/RoomContext"
import { useEffect } from "react"


export const useWebSocket = () => {
    const {socket,setSocket} = useRoomContext()

    useEffect(()=>{
        const ws = new WebSocket("ws://localhost:8080")
        setSocket(ws)

      
    },[setSocket])
    return socket
}