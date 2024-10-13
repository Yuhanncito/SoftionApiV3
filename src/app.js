import  express  from "express";
import morgan from "morgan";
import cors from 'cors';
import {generateDaysWorks,generatePrivilege,generateQuestions,} from  './libs/initialSetup';
import { KEYS } from './config.js'
import webpush from 'web-push';

//routes
import products from "./routes/producs.routes"
import user from "./routes/user.routes"
import project from "./routes/project.routes"
import task from "./routes/task.routes"
import workspace from "./routes/workspace.routes"
import invitation from "./routes/invitate.routes"
import pair from "./routes/pair.routes"

webpush.setVapidDetails('mailto:uchijaisuka02@gmail.com', KEYS.KEYPUBLIC, KEYS.KEYPRIVATE);

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

const app = express();


app.use(morgan('dev'));
app.use(express.json());

app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        msg:"Welcome to apiSoftionPro API 2.0"
    })
})

app.post('/api/test', (req, res) => {
    const subscription = req.body;
  
    res.status(201).json({});
    
    const payload = JSON.stringify({ title: 'Push Notification', body: 'You have a new message!' });
  
    webpush.sendNotification(subscription, payload).catch(error => console.error(error));
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
