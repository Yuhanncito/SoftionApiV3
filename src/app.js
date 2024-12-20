import  express  from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from 'cors';
import {generateDaysWorks,generatePrivilege,generateQuestions,} from  './libs/initialSetup';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node'

dotenv.config();

Sentry.init({
    dsn: "https://2bc93e973e57cee925df0ac55e5a6580@o4508366582448128.ingest.us.sentry.io/4508372011909120",
    integrations: [
      nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
  });

Sentry.profiler.startProfiler();

Sentry.startSpan({
    name: "My First Transaction",
  }, () => {
    // the code executing inside the transaction will be wrapped in a span and profiled
  });

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
import apps from "./routes/app.routes"
const listWhite=[
    'http://localhost:4173',
    'http://localhost:5173',
    'https://softion-pro-dist.vercel.app',
    'https://softion-pro-dev.vercel.app',
    'https://softion-pro.vercel.app'
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
app.use(express.json({ limit: '10mb' }));
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
  
app.use('/api/apps',apps);
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

Sentry.setupExpressErrorHandler(app);


export default app;
