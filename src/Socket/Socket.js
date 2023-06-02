import io from 'socket.io-client';

let socket;

export const connectSocketIO = () => {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      socket = io("https://development-morphometry-api.prr.ai/quantize/vahadane");

      socket.on('connect', () => {
        resolve(socket);
      });

      socket.on('connect_error', (error) => {
        reject(error);
        // console.log("error", error);
      });
    } else {
      resolve(socket);
    }
  });
};


export const sendRequest = (data) => {
  if (socket && socket.connected) {
    // console.log(data);
    socket.send(data);
  }
};
