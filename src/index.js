import app from "./app";
import './database'
import './libs/initialSetup'

const PORT = process.env.PORT || 4000;

app.listen(PORT);

console.log("Server Start");