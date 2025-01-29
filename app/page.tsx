"use client"


import { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {  useEffect, useRef, useState } from "react"
import toast from 'react-hot-toast';
import gsap from "gsap";
import { useRoomContext } from "@/components/RoomContext";
import { useWebSocket } from "@/lib/useWebSocket";



type FormType = {
    username:string;
    roomId?:string;

}


export default function Home() {
  const [formData,setFormData] = useState<FormType>({username:"",roomId:""})

    const [loading,setLoading] = useState(false)
    const router = useRouter()
    const canRef = useRef<HTMLCanvasElement>(null)
    const headingRef = useRef(null)
    const introRef = useRef(null)
    const formRef = useRef(null)
    const {setRoomId,setUsername,setIsHost} = useRoomContext()
   const socket = useWebSocket()
   

  
  //  setUsername, setRoomId,

    useEffect(()=>{
      if(!socket) return 
      socket.onmessage = (e) => {
        const response = JSON.parse(e.data)
        console.log(response)
        if(response.success){
         
           
          
          setUsername(response?.payload.username)
          setRoomId(response?.payload.roomId)
            gsap.to(headingRef.current, {
              opacity:0,
              y:-20,
              duration:1
            })
            gsap.to(introRef.current, {
              opacity:0,
              x:-20,
              duration:1
            })
            gsap.to(formRef.current, {
              opacity:0,
              x:20,
              duration:1
            })
            const start = Date.now();

            while (Date.now() - start < 1000) {
                // Busy-wait for 5 seconds (not recommended in production)
            }
            router.push("/room")
            setLoading(false)
            gsap.from(headingRef.current, {
              opacity:0,
              y:-20,
              duration:0
            })
            gsap.from(introRef.current, {
              opacity:0,
              x:-20,
              duration:0
            })
            gsap.from(formRef.current, {
              opacity:0,
              x:20,
              duration:0
            })
        }else{
          toast(response?.message)
        }
        
      }
     
    },[router,setRoomId,setUsername,socket])

    useEffect(() => {
      const canvas = canRef.current;
      if (!canvas) return;
    
      const context = canvas.getContext("2d");
      if (!context) return;
    
      // Set the drawing context
      context.strokeStyle = "black";
      context.lineWidth = 1;
      context.lineCap = "round";
    
      
    
      
      const draw = (e: MouseEvent) => {
   
      
    const rect = canvas.getBoundingClientRect();
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top)
        context.stroke()
      
        context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop)
      };
    
      
    
   
      canvas.addEventListener("mousemove", draw);
      
    
  
      return () => {
   
        canvas.removeEventListener("mousemove", draw);
      
      };
    }, []);
    

    const createRoom = (e: React.MouseEvent<HTMLButtonElement>)=>{
           try {

            e.preventDefault()
            if(!socket) return
              if(formData.username){
                socket?.send(JSON.stringify({
                    type:"createRoom",
                    payload:{
                        username:formData.username
                    }
                }))
                if(!formData.roomId){
                  console.log("Room id hai bhai")
                  setIsHost(true)
                }
                setLoading(true)
               return 
              }
            toast("Username field is empty")
           } catch (error) {
               alert(error)
               console.log(error)
           }
    }
    const joinRoom = (e: React.MouseEvent<HTMLButtonElement>)=>{
           try {
            console.log("clicked")
            e.preventDefault()
            if(!socket) return
              if(formData.username && formData.roomId){
                socket?.send(JSON.stringify({
                    type:"addUser",
                    roomId:formData.roomId,
                    payload:{
                        username:formData.username,
                        
                    }
                }))
                setLoading(true)
               return 
              }
            toast("Username or room Id field is empty")
           } catch (error) {
               alert(error)
               console.log(error)
           }
    }
  return (
    <div className="h-screen flex relative  bg-white   bg-grid-black/[0.2] 
     
      items-center justify-center">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]"></div>
     <canvas
     ref={canRef}
     className="absolute h-full w-full   "
     width={800}
     height={600}
     />
    <div className=" flex flex-col gap-20  " >
      <h1 ref={headingRef} className="text-7xl font-extrabold text-center select-none animate-fadeDown ">Collaborative White Board</h1>


    
   <div className="grid sm:grid-cols-3 mx-20  p-10 select-none">

      <div ref={introRef} className="space-y-5 col-span-2 px-10 self-center animate-fadeLeft ">
        <h2 className="text-3xl font-bold">Unleash Your Creativity with Our Online Whiteboard</h2>
        <p className="text-xl text-slate-700 font-semibold ">Welcome to your ultimate collaborative space where ideas flow freely, and creativity knows no bounds. Whether you are brainstorming, teaching, designing, or managing tasks, our whiteboard has you covered.</p>
      </div>
     
        <form ref={formRef} className="flex flex-col animate-fadeRight   space-y-6 p-10  z-50 border rounded-md shadow-2xl bg-white/75  saturate-100 backdrop-blur-sm backdrop-opacity-55">
            <h3 className="text-center text-lg font-medium" >Join or Create A Room</h3>
                <input className=" text-sm text-slate-500 font-medium focus:outline-none border-2 px-2 py-3 rounded-md " onChange={(e)=>setFormData({...formData,username:e.target.value})} value={formData.username}  title="username" type="text" placeholder="Username" />
                <input className=" text-sm text-slate-500 font-medium focus:outline-none border-2 px-2 py-3 rounded-md " onChange={(e)=>setFormData({...formData,roomId:e.target.value})} value={formData.roomId} title="room-id" type="text" placeholder="Room ID (required for joining)" />
                <div className="text-slate-100 font-medium flex gap-4 justify-center">
                    <button className="rounded-md bg-green-500 p-1  px-4 " disabled={loading} onClick={joinRoom}>Join Room</button>
                    <button className="rounded-md bg-blue-500 p-1 px-4" disabled={loading} onClick={createRoom}>Create Room</button>
                </div>
        </form>
   
   </div>
   
      
    </div>
   <Toaster/>
    </div>
  );
}
