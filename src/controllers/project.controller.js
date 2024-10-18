import Project from '../models/project.model';
import { getUserId } from '../middlewares/authJWT';
import Task from '../models/task.model';
import WorkSpace from '../models/workSpace.model';
import Logs from '../models/logs.model';
import { sendNotifications } from '../libs/notifications';

export const getProjects = async (req,res) => {
    try{
        const data = await Project.find().populate();

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:"error interno del servidor"})
    }

}

export const insertProject = async (req,res) => {
    try {
        const token = req.headers["x-access-token"];
        const user = await getUserId(token);
        
    
        if(!user) return res.status(404).json({message:"no user found"})

        const {nameProject,workspaceid} = req.body;
        
        const newProject = new Project({
            nameProject,
            createBy:user._id,
            workspace:workspaceid
        })        
      
        const savedProject = await newProject.save();

        const projectUpdate = await WorkSpace.updateOne({_id : workspaceid}, {$push:{ projects : savedProject}});

        if(!projectUpdate) return res.status(400).json({message:"error"});

        const log = new Logs({
            action:"Creacion de Proyecto",
            ipClient:req.ip,
            date:new Date(),
            user:user._id
        })

        const logSaved = log.save();
        
        await sendNotifications(user._id,workspaceid,{
            title: 'Creacion de Proyecto', body: `${user.name} ha creado un nuevo proyecto`
        })

        return res.status(200).json({message:'ok'});
        
        //return res.status(200).json({message:'ok'});
    } catch (error) {
        return res.status(500).json({message:'error interno del servidor'})
    }


}

export const updateProject = async (req,res) => {

    try {

        const {id} = req.params
        const {...updateFields} = req.body;

        const token = req.headers["x-access-token"];
        const user = await getUserId(token);

        const project = await Project.findByIdAndUpdate(id,updateFields);

        if(!project) return res.status(400).json({message:"error"});

        await sendNotifications(user._id,project.workspace,{
            title: 'Actualizacion de Proyecto', body: `${user.name} ha actualizado un nuevo proyecto`
        })

        return res.status(200).json({message:"ok"});
        
    } catch (error) {
        return res.status(500).json({message:"error interno del servidor"})
    }

}

export const deleteProject = async (req,res) => {
    try{
        const idProject = req.params.id;

        const token = req.headers["x-access-token"];
        const user = await getUserId(token);
        
        const deletedProject = await Project.findByIdAndDelete(idProject);

        if(!deletedProject) return res.status(400).json({message:"error"});

        const workSpace = deletedProject.workspace;

        const projectsDeleted = await Task.deleteMany({projectRelation: {$in : idProject}});

        if(!projectsDeleted) return res.status(400).json({message:"error"});

        const projectUpdate = await WorkSpace.updateOne({_id : workSpace}, {$pull:{ projects : idProject}});

        if(!projectUpdate) return res.status(400).json({message:"error"});

        const log = new Logs({
            action:"Eliminacion de Proyecto",
            ipClient:req.ip,
            date:new Date(),
            user:deletedProject.createBy
        })

        const logSaved = log.save();

        await sendNotifications(user._id,workSpace._id,{
            title: 'Creacion de Proyecto', body: `${user.name} ha creado un nuevo proyecto`
        })

        return res.status(200).json({message:"ok"})

    }catch(err){
        return res.status(500).json({message:"error interno del servidor"})

    }

}

export const getProjectsWithTaskUsers = async (req,res) => {
    try{
        const token = req.headers["x-access-token"];
    
        const user = await getUserId(token);        
    
        if(!user) return res.status(404).json({message:"no user found"})

        /*const data = await Project.aggregate([
            {
                $match: { createBy: user._id }
            },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'projectRelation',
                    as: 'tasks'
                }
            }
        ]);

        select * from tareas where id = 1 inner 
        join id_tasksRelation = idTasks from tasks

        projectTasks

        select * projectTasks where id = 1 

        Call SpGetProjectWithTasks(1)

        */
        const data = await Project.find({createBy: user._id })

        res.status(200).json(data);

    }catch(err){
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const getProjectsById = async (req,res) =>{
    try{
        const projectId = req.params.id;

        const data = await Project.findById(projectId).populate(
            {
                path: 'tasks',
                model: 'Task'
            }
        );

        if(!data) return res.status(400).json({message:"Proyecto no encontrado"})

        res.status(200).json({message:"ok",data});

    }catch(err){
        res.status(500).json({message:"error interno del servidor"})
    }
}