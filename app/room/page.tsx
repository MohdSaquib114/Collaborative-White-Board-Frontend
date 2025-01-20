"use client"

import { useRoomContext } from "@/components/RoomContext"
import { useEffect, useRef, useState } from "react"

const colors = ["red","green","yellow","green","red","slate","fuchsia","blue","sky","cyan","teal","gray"]

export default function Page() {
    const [socket, setWebSocket] = useState<WebSocket | null>(null)
    const { roomId } = useRoomContext()
    const canvasRef = useRef<HTMLCanvasElement>(null)
console.log("roomID",roomId)
    useEffect(() => {
      
            if (typeof window !== 'undefined') {
                const ws = new WebSocket("ws://localhost:8080")
                setWebSocket(ws)
                ws.onopen = () =>{

                    ws.send(JSON.stringify({
                        type: 'room',
                        roomId: roomId
                    }))
                }    
    
                ws.onmessage = (e) => {
                    const data = JSON.parse(e.data)
                    console.log(data)
                }
       
                
        

            return () => {
                ws.close() // Clean up WebSocket connection on unmount
            }
        }
    }, [roomId])

    return (
        <div className="relative h-screen  ">
          <canvas
     ref={canvasRef}
     className="absolute h-full w-full  "
     width={800}
     height={600}
     />
     <div>
        <ul className="absolute top-5 left-1/2 transform -translate-x-1/2 flex gap-2  max-w-fit px-5 py-2 rounded-xl   shadow-xl bg-purple-100/50  border  backdrop-blur-3xl  z-50">
        {["msm1","msm3","msm3","mes","saq,","saquib","msm1","msm3","msm3","mes","saq,","saquib","msm1","msm3","msm3","mes","saq,","saquib"].map((username:string,id:number)=>
        {  const bgColor = "bg-"+colors[id%colors.length] + "-500"
          
            return  <li key={id}>
                <div className={`rounded-full text-white ${bgColor}   w-8 h-8 flex items-center justify-center`}>{username[0].toUpperCase()}</div>
                <p>{username}</p>
            </li>}
           )}
    
        </ul>
     </div>
     <div className="absolute z-50 border-4 border-black top-0 left-0">
       <div>
         <div>{roomId}</div>
      </div>
     </div>
           
        </div>
    )
}
