import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useQuantumSocket() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
  // Adding a timestamp query forces the browser to ignore previous failed attempts
  const socket = io("http://127.0.0.1:8000", {
    transports: ["websocket", "polling"],
    query: { t: Date.now() }, 
    reconnection: true,
  });

  socket.on("connect", () => {
    console.log("✅ ENGINE_CONNECTED_SUCCESSFULLY");
  });

  socket.on("quantum_update", (payload) => {
    console.log("📡 SIGNAL_RECEIVED:", payload);
    setData(payload);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ ATTEMPTING_RECONNECT:", err.message);
  });

  return () => {
    socket.disconnect();
  };
}, []);

  return data;
}