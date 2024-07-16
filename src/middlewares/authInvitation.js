import User from "../models/User.model";
import { getUserId } from "./authJWT";

export const authInvitation = async (req,res,next) => {
    try{

        const {email} = req.body;
        const token = req.headers["x-access-token"];

        const id = await getUserId(token)

        const userId = await User.findOne({email:email})

        if(!userId) return res.status(404).json({message: 'Usuario no encontrado'})

        const idUser = userId._id;

        if(id._id.equals(idUser)) return res.status(401).json({message: 'No puedes enviarte a ti mismo la invitación'})

        next();

    }catch{
        return res.status(401).json({message: 'Error en validar la invitación'})
    }

}