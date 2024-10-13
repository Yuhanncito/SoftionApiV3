import socketIo from "socket.io";

class Socket {
  static #server;
  static #sockets;
  /**
   * Constructor for the Socket class
   * @param {http.Server} AppServer - The express app server
   */
  constructor(AppServer) {
    const allowedOrigins = ['http://localhost:4173', 'http://localhost:5173','https://softion-pro-dist.vercel.app'];
    Socket.#server = socketIo(AppServer, {
      cors: {
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.indexOf(origin) !== -1) {
              callback(null, true);
            } else {
              callback(new Error('No permitido por CORS'));
            }
          },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
    });
  }
  getServer() {
    return Socket.#server;
  }
  getSocket() {
    return Socket.#sockets;
  }
  setSocket(socket) {
    Socket.#sockets = socket;
  }
}

export default Socket;
