import WorkSpace from "../models/workSpace.model";
import { getUserId } from "../middlewares/authJWT";
import privilegesModel from "../models/privileges.model";

export const getWorkspacesWithUser = async (req, res) =>{
    try {
        const token = req.headers["x-access-token"];

        
    
        const user = await getUserId(token);

      

        // Se documenta que el error en $or con participates.user se debe a que participates es un arreglo y se necesita especificar la comparación dentro de los objetos de este arreglo.
        // Para realizar la comparación dentro del campo user de cada objeto en el arreglo participates, se utiliza el operador $elemMatch para especificar la condición de búsqueda dentro de los elementos del arreglo.
        const workSpaces = await WorkSpace.find({
            $or: [
                {propetaryUser: user._id}, 
                {"participates.user": user._id}
            ]
        }).populate({
            path: 'projects',
            model: 'Project',
            populate:{
                path:'tasks',
                model:'Task',
                select: 'nameTask status'
            },
            populate:{
                path:'createBy',
                model:'User',
                select: 'name'
            }
        }).populate({
            path: 'participates.user',
            model: 'User',
            select: 'name lastName _id email'
        }).populate({
            path: 'participates.privileges',
            model: 'Privilege'
        }).populate({
            path: 'propetaryUser',
            model: 'User',
            select: 'name email lastName _id'
        });
        if(workSpaces.length === 0) return res.status(400).json({message:"No se encontró registros"}) 


        res.status(200).json(workSpaces);
    } catch (error) {
        console.log (error);
        res.status(500).json({message:"error interno del servidor"})
    }
}


export const getWorkspacesWithId = async(req, res) => {

    try{
        const id = req.params.id;

        const workSpaces = await WorkSpace.findById(id).populate({
            path: 'projects',
            model: 'Project',
        }).populate({
            path: 'participates.user',
            model: 'User',
            select: 'name lastName _id email'
        }).populate({
            path: 'participates.privileges',
            model: 'Privilege'
        }).populate({
            path: 'propetaryUser',
            model: 'User',
            select: 'name email lastName _id'
        });

        if(!workSpaces) return res.status(400).json({message:"No se encontró registros"}) 

        res.status(200).json(workSpaces);
    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const newWorkspace = async( req, res) =>{
    try {
        const {idUser, workSpaceName} = req.body;

        const newWorkSpace = new WorkSpace({
            workSpaceName,
            propetaryUser:idUser
        })

        const workSpaceSaved = await newWorkSpace.save();
        
        return res.status(200).json({message:'ok'});
    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const updateParticipatesRole = async (req,res)=>{
    try {
        const {privilegio, workspaceid, userId} = req.body;
        const privilegioId = await privilegesModel.findOne({name: privilegio});
        if (!privilegioId) return res.status(400).json({message: "Privilegio no encontrado"});

        const workSpace = await WorkSpace.findById(workspaceid);
        if (!workSpace) return res.status(400).json({message: "Workspace no encontrado"});

        // Se actualiza la forma de buscar al participante para asegurar que se reconozca correctamente utilizando $elemMatch.
        const participant = workSpace.participates.find(participant => participant.user.toString() === userId);

        if (!participant) return res.status(400).json({message: "Usuario no encontrado en el workspace"});

        participant.privileges = privilegioId._id;

        await workSpace.save();

        res.status(200).json({message: "Privilegio actualizado correctamente"});
        
    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})   
    }
}