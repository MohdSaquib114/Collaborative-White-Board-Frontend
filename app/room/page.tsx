"use client"

import { useRoomContext } from "@/components/RoomContext"
import { useEffect, useRef, useState } from "react"
import {Copy,Pencil,Minus,Circle,Square,ALargeSmall } from "lucide-react"

export default function Page() {
    const [, setWebSocket] = useState<WebSocket | null>(null)
    const { roomId } = useRoomContext()
    const canvasRef = useRef<HTMLCanvasElement>(null)
   
    // const [isDrawing, setIsDrawing] = useState(false)
   
    
const colors = ["red","green","yellow","green","red","slate","fuchsia","blue","sky","cyan","teal","gray"]


    useEffect(() => {
      
            if (typeof window !== 'undefined') {
                const ws = new WebSocket("ws://localhost:8080")
                setWebSocket(ws)
                ws.onopen = () =>{
               console.log("inside open fn",roomId)
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

 

   
   


    // useEffect(() => {
    //     if (!canvasRef.current) {
    //       return;
    //     }
      
    //     let isDraw = false;
    //     const startingPos = { x: 0, y: 0 };
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext("2d");
    //     const lines: { start: { x: number; y: number }; end: { x: number; y: number } }[] = [];
      
    //     const startDrawing = (e: MouseEvent) => {
    //       const x = e.clientX - canvas.offsetLeft;
    //       const y = e.clientY - canvas.offsetTop;
    //       startingPos.x = x;
    //       startingPos.y = y;
    //       isDraw = true;
    //     };
      
    //     const drawingLine = (e: MouseEvent) => {
    //       if (!isDraw || !context) return;
      
    //       const x = e.clientX - canvas.offsetLeft;
    //       const y = e.clientY - canvas.offsetTop;
      
    //       // Clear the canvas and redraw all saved lines
    //       redrawLines();
      
    //       // Draw the temporary line
    //       drawLine(startingPos, { x, y });
    //     };
      
    //     const stopDrawing = (e: MouseEvent) => {
    //       if (!isDraw) return;
    //       isDraw = false;
      
    //       const x = e.clientX - canvas.offsetLeft;
    //       const y = e.clientY - canvas.offsetTop;
      
    //       // Save the finalized line
    //       lines.push({ start: { ...startingPos }, end: { x, y } });
    //       // Redraw everything to include the new line
    //       redrawLines();
    //     };
        
    //     const drawLine = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    //         if (!context) return;
      
    //         context.beginPath(); // Start a new path
    //         context.moveTo(start.x, start.y);
    //         context.lineTo(end.x, end.y);
    //         context.strokeStyle = "black";
    //         context.lineWidth = 5
    //         context.stroke();
    //         context.closePath(); // Optional, ensures path closure
    //     };
        
    //     const redrawLines = () => {
    //         if (!context) return;
            
    //         context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //         lines.forEach(({ start, end }) => drawLine(start, end)); // Redraw all saved lines
    //     };
        
    //     // Event listeners
    //     canvas.addEventListener("mousedown", startDrawing);
    //     canvas.addEventListener("mousemove", drawingLine);
    //     canvas.addEventListener("mouseup", stopDrawing);
        
    //     return () => {
    //         canvas.removeEventListener("mousedown", startDrawing);
    //         canvas.removeEventListener("mousemove", drawingLine);
    //         canvas.removeEventListener("mouseup", stopDrawing);
    //     };
    //   }, []);
      
      
      //Circles///////////////////////////////////////////////////////////
    // useEffect(() => {
    //     if (!canvasRef.current) {
        //       return;
    //     }
      
    //     let isDraw = false;
    //     const startingPos = { x: 0, y: 0 };
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext("2d");
    //     const circles = []; // Store all finalized rectangles
    
    //     const startDrawing = (e: MouseEvent) => {
        //       const x = e.clientX - canvas.offsetLeft;
        //       const y = e.clientY - canvas.offsetTop;
        //       startingPos.x = x;
        //       startingPos.y = y;
        //       isDraw = true;
        //     };
        
        //     const drawingCircle = (e: MouseEvent) => {
            //       if (!isDraw || !context) return;
            
            //       const x = e.clientX - canvas.offsetLeft;
            //       const y = e.clientY - canvas.offsetTop;
            
            //       // Clear the canvas and redraw all finalized rectangles
            //     //   redrawAllRectangles();
            //   redrawCircles()
    //       // Draw the temporary rectangle
    //       drawCircle(startingPos, { x, y });
    //     };
      
    //     const stopDrawing = (e: MouseEvent) => {
    //         if (!isDraw) return;
    //               isDraw = false;
              
    //               const x = e.clientX - canvas.offsetLeft;
    //               const y = e.clientY - canvas.offsetTop;
              
    //               // Add the finalized rectangle to the array
    //               circles.push({ start: { ...startingPos }, end: { x, y } });
              
    //               // Redraw everything to include the new rectangle
    //               redrawCircles();
    //     };
      
    //     const drawCircle = (start: { x: number; y: number }, end: { x: number; y: number }) => {
        //       if (!context) return;
      
        
        //       context.strokeStyle = "black";
        //       let radius = end.x-start.x
        
        //       if(radius < 0 ){
           
        //         radius = radius * -1
        //       } 
        
        //       context.beginPath(); // Start a new path
        //       context.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        //       context.strokeStyle = "black";
        //       context.stroke();
    //       context.closePath();
       
    //     };
    //     const redrawCircles = () => {
        //               if (!context) return;
        
        //               context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //               circles.forEach(({ start, end }) => drawCircle(start, end)); // Redraw all saved rectangles
    //             };
      
    //     // const redrawAllRectangles = () => {
        //     //   if (!context) return;
        
        //     //   context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //     //   rectangles.forEach(({ start, end }) => drawRect(start, end)); // Redraw all saved rectangles
    //     // };
      
    //     // Event listeners
    //     canvas.addEventListener("mousedown", startDrawing);
    //     canvas.addEventListener("mousemove", drawingCircle);
    //     canvas.addEventListener("mouseup", stopDrawing);
    
    //     return () => {
        //         canvas.addEventListener("mousedown", startDrawing);
        //         canvas.addEventListener("mousemove", drawingCircle);
        //         canvas.addEventListener("mouseup", stopDrawing);
        //     };
        //   }, []);
        
        //rectangle///////////////////////////////////////////////////////////////
        // useEffect(() => {
            //     if (!canvasRef.current) {
                //       return;
                //     }
                
                //     let isDraw = false;
                //     const startingPos = { x: 0, y: 0 };
    //     const canvas = canvasRef.current;
    //     const context = canvas.getContext("2d");
    //     const rectangles = []; // Store all finalized rectangles
    
    //     const startRect = (e: MouseEvent) => {
        //       const x = e.clientX - canvas.offsetLeft;
    //       const y = e.clientY - canvas.offsetTop;
    //       startingPos.x = x;
    //       startingPos.y = y;
    //       isDraw = true;
    //     };
      
    //     const createRect = (e: MouseEvent) => {
        //       if (!isDraw) return;
        
        //       const x = e.clientX - canvas.offsetLeft;
        //       const y = e.clientY - canvas.offsetTop;
        
    //       // Clear the canvas and redraw all finalized rectangles
    //       redrawAllRectangles();
    
    //       // Draw the temporary rectangle
    //       drawRect(startingPos, { x, y });
    //     };
      
    //     const stopRect = (e: MouseEvent) => {
    //       if (!isDraw) return;
    //       isDraw = false;
    
    //       const x = e.clientX - canvas.offsetLeft;
    //       const y = e.clientY - canvas.offsetTop;
      
    //       // Add the finalized rectangle to the array
    //       rectangles.push({ start: { ...startingPos }, end: { x, y } });
    
    //       // Redraw everything to include the new rectangle
    //       redrawAllRectangles();
    //     };
    
    //     const drawRect = (start: { x: number; y: number }, end: { x: number; y: number }) => {
        //       if (!context) return;
        
        //       const width = end.x - start.x;
        //       const height = end.y - start.y;
      
        //       context.strokeStyle = "black";
    //       context.strokeRect(start.x, start.y, width, height);
    //     };
      
    //     const redrawAllRectangles = () => {
        //       if (!context) return;
      
    //       context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //       rectangles.forEach(({ start, end }) => drawRect(start, end)); // Redraw all saved rectangles
    //     };
    
    //     // Event listeners
    //     canvas.addEventListener("mousedown", startRect);
    //     canvas.addEventListener("mousemove", createRect);
    //     canvas.addEventListener("mouseup", stopRect);
      
    //     return () => {
    //       canvas.removeEventListener("mousedown", startRect);
    //       canvas.removeEventListener("mousemove", createRect);
    //       canvas.removeEventListener("mouseup", stopRect);
    //     };
    //   }, []);
      
    
    //line///////////////////////////////////////
    // useEffect(()=>{
        //     if(!canvasRef.current){
            //       return
    //     }
    //     const rectangles = []
    //     let isDraw = false
    //     const startingPos = {x:0,y:0}
    //     const currentPos = {x:0,y:0}
    //     const canvas = canvasRef.current
    //     const context = canvas.getContext("2d")
    //     const startRect = (e:MouseEvent) =>{
    //           const x = e.clientX - canvas.offsetLeft
    //           const y = e.clientY - canvas.offsetTop
    //           // setStartPoint({x,y})
    //           startingPos.x = x
    //           startingPos.y = y
    //           isDraw = true
    //           // setIsDrawing(true)
    //     }
    //     const createRect = (e:MouseEvent) => {
    //            if(!isDraw) return
              
    //            const x = e.clientX - canvas.offsetLeft
    //           const y = e.clientY - canvas.offsetTop
    //           //  setCurrentPoint({x,y})
    //           currentPos.x = x
    //           currentPos.y = y
    //         //   redrawAllRectangles();
    //            drawRect(startingPos,{x,y})
    //     }
    //     const drawRect = (start:{x:number,y:number},end:{x:number,y:number}) => {
    //       if(!context ) return
         
    //     //   context.clearRect(0, 0, canvas.width, canvas.height);
    //       const width = end.x - start.x;
    //       const height = end.y - start.y;
    //       context.strokeStyle = "black";
    //       context.strokeRect(start.x, start.y, width, height);
        
         
    //     }
    //     const stopRect = (e:MouseEvent) =>{
    //         if (!isDraw) return;
    //         isDraw = false;
        
    //         const x = e.clientX - canvas.offsetLeft;
    //         const y = e.clientY - canvas.offsetTop;
        
    //         // Save the completed rectangle to the array
    //         rectangles.push({ start: { ...startingPos }, end: { x, y } });
    //         redrawAllRectangles(); // Redraw everything
        
        
    //     }
    
    //     const redrawAllRectangles = () => {
    
    //         if (!context) return;
        
    //         // context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    //         rectangles?.forEach(({ start, end }) => drawRect(start, end)); // Redraw all rectangles
    //       };
    //   //   const startDraw = (e:MouseEvent) => {
    //   //      setIsDrawing(true)
    //   //      context?.beginPath()
    //   //      draw(e)
    //   //   }
    //   //   const draw = (e:MouseEvent)=> {
    //   //     if(!isDrawing) return
    //   //     const rect = canvas.getBoundingClientRect(); 
    //   //     const x = e.clientX - rect.left;
    //   //     const y = e.clientY - rect.top;  
    //   //     // context?.clearRect(x,y,x+e.clientX,y+e.clientY )
          
    //   //     context?.lineTo(x, y);
    //   //     context?.stroke();
    //   //     context?.beginPath();
    //   //     context?.moveTo(x, y);
    //   //   }
  
    //   //   const stopdraw = () => {
    //   //     setIsDrawing(false)
    //   //     context?.beginPath()
    //   //   }
        
    //     canvas.addEventListener("mousedown",startRect)
    //     canvas.addEventListener("mousemove",createRect)
    //     canvas.addEventListener("mouseup",stopRect)
    //   //   canvas.addEventListener("mouseout",stopRect)
  
    //     return () => {
    //       canvas.addEventListener("mousedown",startRect)
    //     canvas.addEventListener("mousemove",createRect)
    //     canvas.addEventListener("mouseup",stopRect)
    //   //   canvas.addEventListener("mouseout",stopRect)
    //     }
    //   },[])

    const copyToClipBoard = () => {
        if(roomId){
           
            navigator.clipboard.writeText(roomId)
           

           

        }
    }

    return (
        <div className=" h-screen space-y-5 ">
            <div className="flex justify-center pt-5">
                <ul className="  flex gap-2  max-w-fit px-5 py-2 rounded-xl   shadow-xl bg-purple-100/50  border  backdrop-blur-3xl  z-50">
                {["msm1","msm3","msm3","mes","saq,","saquib","msm1","msm3","msm3","mes","saq,","saquib","msm1","msm3","msm3","mes","saq,","saquib"].map((username:string,id:number)=>
                {  const bgColor = "bg-"+colors[id%colors.length] + "-500"
                
                    return  <li key={id}>
                        <div className={`rounded-full text-white ${bgColor}   w-8 h-8 flex items-center justify-center`}>{username[0].toUpperCase()}</div>
                        <p>{username}</p>
                    </li>}
                )}
            
                </ul>
            </div>
            <div className="flex">
           <div className="flex flex-col gap-5 px-1 py-5 rounded-xl border-2 border-black absolute left-4 top-1/3">
              <div className=" p-1 rounded-full hover:bg-purple-200/80">
              <Pencil />
              </div>
              <div className="p-1 rounded-full hover:bg-purple-200/80">
              <Minus />
              </div>
              <div className="p-1 rounded-full hover:bg-purple-200/80">
              <Square />
              </div>
              <div className="p-1 rounded-full hover:bg-purple-200/80">
              <Circle />
              </div>
              
             
           </div>
          <canvas
            ref={canvasRef}
            className=""
            width={1200}
            height={620}
            />
     
            <div className="">
                {
                    roomId &&
                
            <div className=" bg-purple-100/50  border rounded-md   space-y-2  backdrop-blur-3xl p-3">
                <p>Room-ID</p>
                <div className=" text-sm bg-purple-800/50  p-1 rounded-lg text-white flex gap-2" >{roomId}
                <div onClick={copyToClipBoard}>
                    <Copy/>
                
                </div>
                </div>
            </div>
            }
            <div>
                chat box
            </div>
            </div>
            </div>
           
        </div>
    )
}

