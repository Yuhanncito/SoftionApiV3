import socketIo from "socket.io";

class Socket {
  static #server;
  static #sockets;
  /**
   * Constructor for the Socket class
   * @param {http.Server} AppServer - The express app server
   */
  constructor(AppServer) {
    Socket.#server = socketIo(AppServer);
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
