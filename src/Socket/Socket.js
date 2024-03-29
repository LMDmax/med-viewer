let socket;

export const connectWebSocket = () => {
  return new Promise((resolve, reject) => {
    if (!socket) {
      socket = new WebSocket("wss://development-morphometry-api.prr.ai/quantize/vahadane");

      socket.onopen = () => {
        resolve(socket);
      };

      socket.onerror = (error) => {
        reject(error);
      };
      socket.onmessage = (event) => {
        // Handle received message
        const messageData = event.data;
        console.log("Received message:", messageData);
      };
    } else if (socket.readyState === WebSocket.OPEN) {
      resolve(socket);
    }
  });
};

export const sendRequest = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    // console.log(data);
    socket.send(data);
  }
};