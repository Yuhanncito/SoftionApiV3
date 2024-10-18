import jwt from "jsonwebtoken"
import UserModel from "../models/User.model";

export const verifyToken = async (req,res,next) =>{
 try {
    const token = req.headers["x-access-token"];
    
    if(!token) return res.status(403).json({message:"No token provider"})
    
    const decode = jwt.verify(token,process.env.SECRET)

    const user = await UserModel.findById(decode.id, {password:0})

    if(!user) return res.status(404).json({message:"no user found"})

    next();
 } catch (error) {
    return res.status(401).json({message: 'Unauthorized'})
 }
}

export const getUserId = async (token) =>{
   try {
      
      if(!token) return "no token"
      
      const decode = jwt.verify(token,process.env.SECRET)
  
      const user = await UserModel.findById(decode.id, {password:0})
  
      if(!user) return "no user found"

      return user

   } catch (error) {
      return null
   }
}

export const isModerator = async (req,res,next) => {
  
}