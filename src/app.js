import  express  from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors';
import {generateDaysWorks,generatePrivilege,generateQuestions,} from  './libs/initialSetup';

dotenv.config();

import webpushSetUp from './libs/web-push.js';
import Notifications from "./models/notifications.model.js";

//routes
import products from "./routes/producs.routes"
import user from "./routes/user.routes"
import project from "./routes/project.routes"
import task from "./routes/task.routes"
import workspace from "./routes/workspace.routes"
import invitation from "./routes/invitate.routes"
import pair from "./routes/pair.routes"


const generateData = async () => {
    try {
        await generateDaysWorks();
        await generatePrivilege();
        await generateQuestions();
    } catch (error) {
        console.log(error);
    }
}

generateData();
const webpush = webpushSetUp();
const app = express();


app.use(morgan('dev'));
app.use(express.json());

const listWhite=[
    'http://localhost:4173',
    'http://localhost:5173',
    'https://softion-pro-dist.vercel.app'
]

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman)
        if (!origin) return callback(null, true);
        if (listWhite.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token','x-access-notification'],
};

app.use(cors( corsOptions ));

app.options('*', cors( corsOptions ));

app.get('/',(req,res)=>{
    res.json({
        msg:"Welcome to apiSoftionPro API 2.0"
    })
})


app.post('/api/test', async (req, res) => {
    var noti = false;
    if(noti) return res.status(200).json({});
    noti = true;
    try {
        const subscription = req.body;
        const Notification = await Notifications.findOne({registration:subscription});
        res.status(201).json({});
        const payload = JSON.stringify({ title: 'Push Notification', body: 'You have a new message!' });
        if(!Notification){
            const newNotification = new Notifications({
                registration:subscription
            })
            await newNotification.save();
        }
        webpush.sendNotification(subscription, payload).catch(error => {
            console.error(error);
        });
        console.log('notificacion enviada')
    } catch (error) {
        console.log(error)
    }
    finally{
        noti = false;
    }
  });
  

app.use('/api/products',products);
app.use('/api/auth',user);
app.use('/api/projects',project);
app.use('/api/task',task);
app.use('/api/workspace',workspace);
app.use('/api/invitation',invitation);
app.use('/api/pair',pair);

app.use((req, res, next) =>{
    res.status(404).json({message:"Routa incorrecta"});
  });


export default app;
