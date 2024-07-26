import app from './src/app';
import './src/database'
import './src/libs/initialSetup'

const PORT = process.env.PORT || 4000;

app.listen(PORT);

console.log("Server Start");