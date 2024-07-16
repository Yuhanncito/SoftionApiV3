import  express  from "express";
import morgan from "morgan";
import cors from 'cors';
import {generateDaysWorks,generatePrivilege,generateQuestions} from  './libs/initialSetup';
//routes
import products from "./routes/producs.routes"
import user from "./routes/user.routes"
import project from "./routes/project.routes"
import task from "./routes/task.routes"
import workspace from "./routes/workspace.routes"
import invitation from "./routes/invitate.routes"
import pair from "./routes/pair.routes"

try{
    await generateDaysWorks();
    await generatePrivilege();
    await generateQuestions();
}catch(err){
    console.log(err);
}

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(cors());

app.get('/',(req,res)=>{
    res.json({
        msg:"Welcome to apiSoftionPro API 2.0"
    })
})

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