import { useState, useEffect } from "react";

export function useQuantumSocket() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/quantum");

    socket.onmessage = (event) => {
      const packet = JSON.parse(event.data);
      setData(packet);
    };

    return () => socket.close();
  }, []);

  return data;
}