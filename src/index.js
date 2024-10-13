import server from "./app";
import './database'
import './libs/initialSetup'

const PORT = process.env.PORT || 4000;

server.listen(PORT);

console.log("Server Start");