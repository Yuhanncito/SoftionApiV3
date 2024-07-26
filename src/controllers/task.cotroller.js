import Task from '../models/task.model';
import Project from '../models/project.model';
import Logs from '../models/logs.model';
import { getUserId } from '../middlewares/authJWT';
import WorkSpace from '../models/workSpace.model';


export const getTaskByWorkspaceId = async (req,res) =>{
    try {

        const {id} = req.params;

        if(!id) return res.status(400).json({message:"no workspace found"})

        const workSpace = await WorkSpace.findById(id)

        if(!workSpace) return res.status(400).json({message:"no workspace found"})

        const ProjectsId = workSpace.projects;

        if(!ProjectsId) return res.status(400).json({message:"no projects found"})

        const tasksGlobal = [];

        for (const id of ProjectsId) {
                const tarea = await Task.find({projectRelation:id})
                tasksGlobal.push(tarea);
        }

        const tasks = tasksGlobal.flat();

        return res.status(200).json(tasks)
    } catch (error) {
        return res.status(500).json({message:"error interno del servidor tareas WorkSpaces"})
    }
}

export const getTaskByProjectId = async (req,res) =>{
    try {

        const {projectRelation} = req.params;

        const tasks = [];
        const taskList = await Task.find({ projectRelation: projectRelation }).populate({
            path: 'userTasks',
            model: 'User',
            select: 'name'
        });
        for (const task of taskList) {
            tasks.push(task);
        }
        return res.status(200).json(tasks)

        
    } catch (error) {
        return res.status(500).json({message:"error interno del servidor"})
    }

}


export const insertTask = async(req,res)=>{
   try {

        const token = req.headers["x-access-token"];

        const user = await getUserId(token);


        const {projectRelation,nameTask,descriptionTask,userTasks,timeHoursTaks,status} = req.body;

        if(nameTask.length === 0 || projectRelation.length === 0) return res.status(400).json({message:"Nombre Requerido"})

        const newTask = new Task({
            projectRelation,
            nameTask,
            descriptionTask,
            userTasks,
            timeHoursTaks,
            status
        })

        const taskSaved = await newTask.save();

        const projectUpdate = await Project.updateOne({_id : projectRelation}, {$push:{ tasks : taskSaved}});

        if(!projectUpdate) return res.status(400).json({message:"error"})

        const log = new Logs({
            action:"Creacion de Tarea",
            ipClient:req.ip,
            date:new Date(),
            user:user._id
        })

        const logSaved = log.save();

        return res.status(200).json({message:"ok"})
   } catch (error) {
    return res.status(500).json({message:"error interno del servidor",error})
   }

}

export const udpateTask = async(req,res)=>{
    try{
        // Extrae el id de la tarea y los campos a actualizar del cuerpo de la solicitud
        const id = req.params.id

        const {...updateFields} = req.body;

        const token = req.headers["x-access-token"];

        const user = await getUserId(token);
        
        // Encuentra y actualiza la tarea por su id, con los campos a actualizar y devuelve la tarea actualizada
        const task = await Task.findByIdAndUpdate(id, updateFields, {new: true});
        // Si no se encuentra la tarea, devuelve un mensaje de tarea no válida
        if(!task) return res.status(400).json({message:"Tarea no válida"});

        const log = new Logs({
            action:"Actualizacion de Tarea",
            ipClient:req.ip,
            date:new Date(),
            user:user._id
        }) 

        const logSaved = log.save();
        
        res.status(200).json({message:'ok'})
    }
    catch(err){
        return res.status(500).json({message:"error interno del servidor"})
    }
}

export const deleteTask = async(req,res)=>{
    try {

        const token = req.headers["x-access-token"];

        const user = await getUserId(token);

        const idTask = req.params.id;
        
        const task = await Task.findByIdAndDelete(idTask);

        if(!task) return res.status(400).json({message:"Tarea no válida"})

        const taskUpdates = await Project.updateOne({_id:task.projectRelation},{$pull:{tasks:task._id}})

        if(!taskUpdates) return res.status(400).json({message:"error"})

        const log = new Logs({
            action:"Eliminacion de Tarea",
            ipClient:req.ip,
            date:new Date(),
            user:user._id
        })

        const logSaved = log.save();

        res.status(200).json({message:'ok'})
    } 
    catch(err){
        return res.status(500).json({message:"error interno del servidor"})
    }
}

export const getTasksPending = async(req,res)=>{
    try {
        const token = req.headers["x-access-token"];
        const user = await getUserId(token);

        if(!user) return res.status(400).json({message:"error"})

        const workSpace = await WorkSpace.findOne({propetaryUser:user._id});

        if(!workSpace) return res.status(400).json({message:"error"})

        const projects = await Project.find({workspace:workSpace._id})

        const tasks = await Task.find({$or:[{userTasks:user._id},{projectRelation:{$in:projects.map(p=>p._id)}}]}).populate({
            path: 'projectRelation',
            model: 'Project',
            select: 'name'
        })

        if(!tasks) return res.status(400).json({message:"error"})

        const tasksPending = tasks.filter(t=>t.status === "Pendiente");


        return res.status(200).json(tasksPending);
        
    } catch (error) {
        return res.status(500).json({message:"error interno del servidor"})
    }
}