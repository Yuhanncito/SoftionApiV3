import { getUserId } from "../middlewares/authJWT";
import User from "../models/User.model";
import Invitation from "../models/invitation.model";
import privilegesModel from "../models/privileges.model";
import WorkSpace from "../models/workSpace.model";

export const setInvitatio = async (req,res) => {
    try {
        const token = req.headers["x-access-token"];

        const {workSpace, email} = req.body;

        const id = await getUserId(token)

        const workSpaceExist = await WorkSpace.findById(workSpace);

        if(!workSpaceExist) return res.status(400).json({message:'Error en la petición: El espacio de trabajo no existe'});

        const userExist = await User.findOne({email});

        if(!userExist) return res.status(400).json({message:'Error en la petición: El usuario no existe'});

		const invitationExist = await Invitation.findOne({$and: [{idPropietary: id._id}, {idParticipate: userExist._id}]})
		if(invitationExist) return res.status(400).json({message:'Ya existe una invitación pendiente para este usuario en este espacio de trabajo',invitationExist})

		const participanteExistente = workSpaceExist.participates.some(participante => participante.user.toString() === userExist._id.toString());
		if(participanteExistente) return res.status(400).json({message: "El usuario ya forma parte de tu área de trabajo"});
		const newInvitation = new Invitation({
			idPropietary:id,
			idParticipate:userExist._id,
			idWorkSpace:workSpaceExist._id
		})
		
        const savedInvitation = await newInvitation.save();

        res.status(200).json({message:'Invitación enviada correctamente'})
        
    } catch (error) {
        res.status(500).json({message:'Error Interno del Servidor',error});
    }
}

export const getInvitationsByUserId = async(req,res) =>{
	try {
		const token = req.headers["x-access-token"];
		const user = await getUserId(token);

		const id = req.params.id;
		const idToken = user._id

		if(idToken != id) return res.status(400).json({message:"Ah ocurrido un error"})

		const invitations = await Invitation.find({idParticipate:user._id},{idParticipate:0})
            .populate({ 
                path: 'idPropietary',
                model: 'User',
                select: 'name _id' // Selecciona únicamente el nombre y el ID del propietario
            })
            .populate({ 
                path: 'idWorkSpace',
                model: 'WorkSpace',
                select: 'workSpaceName _id' // Selecciona únicamente el nombre y el ID del espacio de trabajo
            });

		if(!invitations) return res.status(400).json({message:"No hay Invitaciones"})

		res.status(200).json({message:'ok',invitations});

		

	} catch (error) {
		res.status(500).json({message:'Error Interno del Servidor'});
	}
}

export const denyInvitation = async (req,res)=>{
	try {
		const id = req.params.id;

		const invitationDeleted = await Invitation.findByIdAndDelete(id)

		if(!invitationDeleted) return res.status(400).json({message:'Ah ocurrido un error'})

		res.status(200).json({message:'ok'})

	} catch (error) {
		res.status(500).json({message:'Error Interno del Servidor'});
	}
}

export const acceptInvitation = async (req,res) =>{
	try{
		const idInvitation = req.params.id;

		const token = req.headers["x-access-token"];

		const user = await getUserId(token);

		const invitationExist = await Invitation.findById(idInvitation);

		if(!invitationExist) return res.status(400).json({message:"Ah ocurrido un error invitacion"})

		const idUser = user._id;
		const idParticipate = invitationExist.idParticipate;
		const workSpaceId = invitationExist.idWorkSpace;
		const privilegio = await privilegesModel.findOne({name:'lectura'})
		if(!idParticipate.equals(idUser)) return res.status(400).json({message:'Ah ocurrido un error usuarios',idParticipate,idUser})
		const workSpaceUpdate = await WorkSpace.updateOne({_id: workSpaceId}, {$push:{ participates : {user:idUser, privileges: privilegio._id}}});

		if(!workSpaceUpdate) return res.status(400).json({message:'Ah Ocurrido un error'})

		const invitacionDelete = await Invitation.findByIdAndDelete(idInvitation);

		if(!invitacionDelete) return res.status(400).json({message:'Ah Ocurrido un error'})

		res.status(200).json({message:'ok'});

	}
	catch(err){
		res.status(500).json({message:'Error Interno del Servidor',err});
	}
}
