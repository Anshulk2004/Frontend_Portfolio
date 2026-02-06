import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useQuantumSocket() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // UPDATED: Using your active ngrok forwarding URL
    const socket = io("https://stephania-claval-nonimputatively.ngrok-free.dev", {
      transports: ["websocket", "polling"],
      reconnection: true,
      // Adding extra headers to bypass the ngrok browser warning page
      extraHeaders: {
        "ngrok-skip-browser-warning": "true"
      }
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