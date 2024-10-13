import server from './src/app';
import './src/database'
import './src/libs/initialSetup'

const PORT = process.env.PORT || 4000;

server.listen(PORT);

console.log("Server Start");