"use client"

import { useRoomContext } from "@/components/RoomContext"
import { useEffect, useRef, useState } from "react"
import {Copy,Pencil,Minus,Circle,Square ,SendHorizontal} from "lucide-react"
import { useWebSocket } from "@/lib/useWebSocket"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation";

type Position = {
    x:number,
    y:number
}

type Message = {
    message:string,
    username:string
}

export default function Page() {
   
    const { roomId, username, isHost } = useRoomContext()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [currentTool, setTool] = useState("PENCIL")
    const socket = useWebSocket()
    const [shapes, setShapes] = useState({ lines: [], rects: [], arcs: [], pencils: [] });
    const [users, setUsers] = useState<string[]>([])
    const [messages, setMessages] = useState<Message[]>([{username:"unknown", message:"Welcome"},]);

    const [message, setMessage] = useState('')
    const router = useRouter()
  
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const colors = ["red", "green", "yellow", "green", "red", "slate", "fuchsia", "blue", "sky", "cyan", "teal", "gray"]

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!socket) return;
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    type: 'room',
                    roomId: roomId,
                    payload: {
                        isHost: isHost,
                        username: username
                    }
                }))
            }

            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                console.log(data)
                switch (data.type) {
                    case "addUser":
                        if (!data.success) {
                            toast(data.payload.message)
                            return
                        }

                        setUsers(prev=>[...prev,data.payload.username])
                        toast(data.payload.message)
                        break;

                    case "room":
                        if (!data.success) {
                            toast(data.message)
                            router.push("/")
                        }

                        setUsers(data.payload.users)
                        setMessages(data.payload.messages)
                        break;

                    case "message":
                        if (!data.success) {
                            toast(data.message)
                            return
                        }

                        setMessages(prev => [...prev, data.payload]);

                        break;
                    case "remove":
                        if (!data.success) {
                            toast(data.message)
                            return
                        }
                        console.log(data)
                        toast(`${data.payload.username} left the room`)
                        break;

                    case "canvasUpdate":
                        if(!data.success){
                            toast(data.payload.message)
                            return
                        }
                        
                        const {type,shape} = data.payload.canvasData
                         setShapes((prevShapes) => ({
                ...prevShapes,
                [type === "line"
                    ? "lines"
                    : type === "rect"
                        ? "rects"
                        : type === "arc"
                            ? "arcs"
                            : "pencils"]: [
                    ...(type === "line"
                        ? prevShapes.lines
                        : type === "rect"
                            ? prevShapes.rects
                            : type === "arc"
                                ? prevShapes.arcs
                                : prevShapes.pencils),
                    shape,
                ],
            }));

                       
                        break;
                }
            }
        }
    }, [roomId, socket, router, username, isHost, messages])


    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";

        let currentPencilPath: Position[] = [];
        let isDraw = false;
        let startingPos: Position = { x: 0, y: 0 };

        const getPos = (e: MouseEvent): Position => {
            const x = e.clientX - canvas.offsetLeft;
            const y = e.clientY - canvas.offsetTop;
            return { x, y };
        };

        const drawPencil = (e: MouseEvent) => {
            const endPos = getPos(e);
            currentPencilPath.push(endPos);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
        };

        const drawRect = (e: MouseEvent) => {
            const endPos = getPos(e);
            const width = endPos.x - startingPos.x;
            const height = endPos.y - startingPos.y;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            redrawShapes(); // Redraw saved shapes
            ctx.strokeRect(startingPos.x, startingPos.y, width, height);
        };

        const drawArc = (e: MouseEvent) => {
            const endPos = getPos(e);
            const radius = Math.abs(endPos.x - startingPos.x);
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear for redraw
            redrawShapes(); // Redraw saved shapes
            ctx.beginPath();
            ctx.arc(startingPos.x, startingPos.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        };

        const drawLine = (e: MouseEvent) => {
            const endPos = getPos(e);
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear for redraw
            redrawShapes(); // Redraw saved shapes
            ctx.beginPath();
            ctx.moveTo(startingPos.x, startingPos.y);
            ctx.lineTo(endPos.x, endPos.y);
            ctx.stroke();
        };

        const drawObject = (e: MouseEvent) => {
            if (!ctx || !isDraw) return;
            if (currentTool === "PENCIL") {
                drawPencil(e);
            } else if (currentTool === "RECT") {
                drawRect(e);
            } else if (currentTool === "ARC") {
                drawArc(e);
            } else if (currentTool === "LINE") {
                drawLine(e);
            }
        };

        const addShape = (type: "line" | "rect" | "arc" | "pencil", shape: (Position[] | { x: number, y: number, radius: number, startAngle: number, endAngle: number } | { x: number, y: number, width: number, height: number } | { start: Position, end: Position })) => {
            setShapes((prevShapes) => ({
                ...prevShapes,
                [type === "line"
                    ? "lines"
                    : type === "rect"
                        ? "rects"
                        : type === "arc"
                            ? "arcs"
                            : "pencils"]: [
                    ...(type === "line"
                        ? prevShapes.lines
                        : type === "rect"
                            ? prevShapes.rects
                            : type === "arc"
                                ? prevShapes.arcs
                                : prevShapes.pencils),
                    shape,
                ],
            }));

           
            if (socket) {
                
                socket.send(JSON.stringify({
                    type: "canvasUpdate",
                    roomId: roomId,
                    payload: { type, shape }
                }));
            }
        };

        const redrawShapes = () => {
            if (!ctx || !canvas) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            shapes.lines.forEach(({ start, end }: { start: Position, end: Position }) => {
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                ctx.closePath();
            });

            shapes.rects.forEach(({ x, y, width, height }) => {
                ctx.beginPath();
                ctx.strokeRect(x, y, width, height);
                ctx.closePath();
            });

            shapes.arcs.forEach(({ x, y, radius, startAngle, endAngle }) => {
                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle, endAngle);
                ctx.stroke();
                ctx.closePath();
            });

            shapes.pencils.forEach((path: [Position]) => {
                if (path.length < 2) return;
                ctx.beginPath();
                ctx.moveTo(path[0].x, path[0].y);
                path.forEach(({ x, y }) => {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                });
            });
        };

        const mouseDownHandler = (e: MouseEvent) => {
            isDraw = true;
            startingPos = getPos(e);
            if (currentTool === "PENCIL") {
                ctx.beginPath();
                ctx.moveTo(startingPos.x, startingPos.y);
            }
        };

        const mouseMoveHandler = (e: MouseEvent) => {
            drawObject(e);
        };

        const mouseUpHandler = (e: MouseEvent) => {
            isDraw = false;
            if (currentTool === "PENCIL" && currentPencilPath.length > 1) {
                addShape("pencil", currentPencilPath);
                currentPencilPath = []
            } else if (currentTool === "LINE") {
                const endPos = getPos(e);
                const newLine = { start: startingPos, end: endPos };
                addShape("line", newLine);
            } else if (currentTool === "RECT") {
                const endPos = getPos(e);
                const width = endPos.x - startingPos.x;
                const height = endPos.y - startingPos.y;
                const newRect = { x: startingPos.x, y: startingPos.y, width, height };
                addShape("rect", newRect);
            } else if (currentTool === "ARC") {
                const endPos = getPos(e);
                const radius = Math.abs(endPos.x - startingPos.x);
                const newArc = { x: startingPos.x, y: startingPos.y, radius, startAngle: 0, endAngle: 2 * Math.PI };
                addShape("arc", newArc);
            }
        };

        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", mouseUpHandler);

        return () => {
            canvas.removeEventListener("mousedown", mouseDownHandler);
            canvas.removeEventListener("mousemove", mouseMoveHandler);
            canvas.removeEventListener("mouseup", mouseUpHandler);
        };
    }, [currentTool, shapes,roomId,socket]);

    const copyToClipBoard = () => {
        if (roomId) {
            navigator.clipboard.writeText(roomId)
        }
    }

    const handleLeave = () => {
        if (!socket) return

        socket.send(
            JSON.stringify({
                type: "removeUser",
                roomId: roomId,
                payload: {
                    username: username
                }
            })
        )

        setTimeout(() => {
            socket.close();
            router.push("/");
        }, 100);
    }

    const handleMessage = () => {
        if (!socket || message === "") return
        socket?.send(JSON.stringify({ type: "message", roomId: roomId, payload: { username: username, message: message } }))
        setMessage("")
    }

    return (
        <div className=" h-screen space-y-5 ">
            <div className="flex justify-evenly ">
                <div className="flex justify-center pt-5 ">
                    <ul className=" flex gap-2 max-w-fit px-5 py-2 rounded-lg shadow-xl bg-purple-100/50 border-2 border-purple-200 backdrop-blur-3xl z-50">
                        {   users &&
                            users.map((username: string, id: number) =>
                                <li key={id}>
                                    <div className={`rounded-full text-white bg-purple-800/50 w-8 h-8 flex items-center justify-center`}>{username[0].toUpperCase()}</div>
                                    <p>{username}</p>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
            <div className="flex">
                <div className="flex flex-col gap-5 px-1 py-5 rounded-xl border-2 border-black absolute left-4 top-1/3 bg-white/60">
                    <div onClick={() => setTool("PENCIL")} className=" p-1 rounded-full hover:bg-purple-200/80">
                        <Pencil />
                    </div>
                    <div onClick={() => setTool("LINE")} className="p-1 rounded-full hover:bg-purple-200/80">
                        <Minus />
                    </div>
                    <div onClick={() => setTool("RECT")} className="p-1 rounded-full hover:bg-purple-200/80">
                        <Square />
                    </div>
                    <div onClick={() => setTool("ARC")} className="p-1 rounded-full hover:bg-purple-200/80">
                        <Circle />
                    </div>
                </div>
                <canvas ref={canvasRef} className="" width={1200} height={620} />

                <div className="flex flex-col justify-evenly ">
                    <button type="button" className="bg-red-500 px-4 py-2 rounded-lg text-white self-end shadow-xl"
                        onClick={handleLeave}
                    >Leave</button>

                    {isHost &&
                        <div className="bg-purple-100/50 shadow-xl border-2 border-purple-200 rounded-lg space-y-2 backdrop-blur-3xl p-3">
                            <p>Room-ID</p>
                            <div className="text-sm bg-purple-800/50 p-1 rounded-lg text-white flex gap-2">{roomId}
                                <button title="copy-button" onClick={copyToClipBoard}>
                                    <Copy />
                                </button>
                            </div>
                        </div>
                    }
                    <div className="flex">
                        <button className="border-2 h-10 -rotate-90 p-2 bg-purple-800/50 text-white mt-5 relative left-3">CHAT</button>
                        <div className="bg-purple-100/50 shadow-xl rounded-md border-2 border-purple-200 space-y-2 backdrop-blur-3xl p-3 ">
                            <div className="border-2 h-[300px] rounded-lg border-purple-200 overflow-y-scroll pl-3 py-1" style={{ scrollbarWidth: "none" }}>
                                {messages && messages?.map((messageObj, index) =>
                                    <div className="flex gap-2" key={messageObj.username + index}>
                                        <span className="text-sm self-center text-slate-600">{messageObj.username}</span>
                                        <p>{messageObj.message}</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="border-2 border-purple-200 rounded-lg p-1 flex">
                                <input className="focus:outline-none flex-1" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type Message" />
                                <button title="send" type="button" className="bg-purple-800/50 text-white rounded-full p-1" onClick={handleMessage}><SendHorizontal /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}
