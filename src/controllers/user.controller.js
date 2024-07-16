import User from "../models/User.model";
import Confirm from "../models/confirm.model";
import  jwt  from "jsonwebtoken";
import config from "../config";
import {verifyEmail} from "../middlewares/authEmail"
import WorkSpace from "../models/workSpace.model";
import secretQuestionModel from "../models/secretQuestion.model";
import Logs from "../models/logs.model";
import paircodeModel from "../models/paircode.model";

// Función para registrar un nuevo usuario

export const confirmSingUp = async (req,res) =>{
    try{
        const {name,lastName,email,password,secretCode,secret,respuestaSecreta} = req.body;

        const response = await Confirm.findOne({secretCode})

        const question = await secretQuestionModel.findOne({key:secret})

        if(!question) return res.status(400).json({menssage:"Error de credenciales"})
    
    const newUser = new User({
        name,
        lastName,
        email,
        password: await User.ecryptPassword(password),
        questionKey:question._id,
        questionAnswer:respuestaSecreta
    });

    const deleteCode = await Confirm.findOneAndDelete({email,secretCode})
    // Guardar el usuario en la base de datos
    const userSaved = await newUser.save();

    // Crear un token para el usuario
    const token = jwt.sign({id: userSaved._id},config.SECRET,{
        expiresIn: 86400
    })


    

    const newWorkSpace = new WorkSpace({
        workSpaceName:"WorkSpace",
        propetaryUser:userSaved._id,
    })

    const workSpaceSaved = newWorkSpace.save();

    const logs = new Logs({
        action:"Creacion de Cuenta",
        ipClient:req.ip,
        date:new Date(),
        user:userSaved._id
    })

    const logsSaved = logs.save();

    res.status(200).json({token, message:'ok'});
    }
    catch(err){
        res.status(500).json({token:null,message:'error interno del servidor'});
    }
}

export const singUp = async (req,res)=>{
    try {

        const {name,lastName,email} = req.body;

        if(name.length < 3  || lastName.length < 3) return res.status(400).json({message:"Datos Incompletos"})
        // Verificar si el usuario ya existe
        const response = await User.findOne({email})

        if (response) return res.status(400).json({message:"El usuario ya existe"})

        
        let caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let codigoSecreto = '';
        for (let i = 0; i < 8; i++) {
            codigoSecreto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        await verifyEmail(email, codigoSecreto);

        return res.status(200).json({
            message:"ok"
        })

    } catch (error) {
        // Código de error 500 para errores internos del servidor
        // Se utiliza cuando no se puede determinar un código de estado más específico.
        res.status(500).json({message: "Error interno del servidor"});
    }
}
// Función para iniciar sesión
export const singIn = async (req,res)=>{
    try {
        const {email,password} = req.body;

        // Verificar si el usuario existe
        const response = await User.findOne({email})
        if (!response) return res.status(400).json({message:"Usuario no encontrado"})
        
        // Verificar si la contraseña es correcta
        const matchPassword = await User.comparePassword(password,response.password)

        

        if(!matchPassword) return res.status(400).json({message:"Contraseña inválida", token: null})

        let caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let codigoSecreto = '';
        for (let i = 0; i < 8; i++) {
            codigoSecreto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        const emailSend = await verifyEmail(email, codigoSecreto);


        if(!emailSend) return res.status(200).json({message:"Tienes un Código Activo"})
        
         res.status(200).json({message:'correcto'})
    } catch (error) {
        // Código de error 500 para errores internos del servidor
        // Se utiliza cuando no se puede determinar un código de estado más específico.
         res.status(500).json({message: "Error interno del servidor"});
    }
}


export const confirmSingIn = async (req,res) =>{
    try{
        const {email,secretCode} = req.body;

        const response = await Confirm.findOne({secretCode})
        if (!response) return res.status(400).json({message:"No se encontro el codigo"})

        const user = await User.findOne({email});

        if(!user) return res.status(400).json({message:"usuario no encontrado"})
    
        // Crear un token para el usuario
        const token = jwt.sign({id: user._id},config.SECRET,{
            expiresIn: 86400
        })

        const log = new Logs({
            action:"Inicio de Sesion",
            ipClient:req.ip,
            date:new Date(),
            user:user._id
        })

        const logSaved = log.save();

        const deleteCode = await Confirm.findOneAndDelete({email,secretCode})   

        res.status(200).json({token,message:"ok"});

    }catch(err){
        res.status(500).json({token:null,message:"Error interno del servidor"});
    }
    
    
}


// Función para obtener todos los usuarios
export const getAll = async (req,res)=>{
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers);
    } catch (error) {
        // Código de error 500 para errores internos del servidor
        // Se utiliza cuando no se puede determinar un código de estado más específico.
        res.status(500).json({message: "Error interno del servidor"});
    }
}

export const forgotPassword = async (req,res) =>{
    try {
        const {email} = req.body;

        // Verificar si el usuario existe
        const response = await User.findOne({email})
        if (!response) return res.status(400).json({message:"Usuario no encontrado"})

        let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let codigoSecreto = '';
        for (let i = 0; i < 8; i++) {
            codigoSecreto += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }

        await verifyEmail(email, codigoSecreto);

        res.status(200).json({message:'correcto'})

    } catch (error) {
        // Código de error 500 para errores internos del servidor
        // Se utiliza cuando no se puede determinar un código de estado más específico.
        res.status(500).json({message: "Error interno del servidor"});
    }   
}

export const forgotPasswordVerify = async (req,res) =>{
    try{
        const {email,secretCode} = req.body;

        const response = await Confirm.findOne({secretCode})
        if (!response) return res.status(400).json({message:"No se encontro el codigo"})

        const userData = await User.findOne({email});
        if(!userData) return res.status(400).json({message:'usuario no encontrado'})

        // Crear un token para el usuario
        const token = jwt.sign({id: userData._id},config.SECRET,{
            expiresIn: 300
        })

        const deleteCode = await Confirm.findOneAndDelete({email,secretCode})

        res.status(200).json({token,message:"ok"});


    }catch(err){
        res.status(500).json({token:null,message:"Error interno del servidor",err});
    }
    
}
export const updatePassword = async (req,res) =>{
    try{
        const {email,password} = req.body;

        const encrypt = await User.ecryptPassword(password)

        const response = await User.findOneAndUpdate({email},{password:encrypt})
        
        const token = jwt.sign({id: response._id},config.SECRET,{
            expiresIn: 86400
        })

        const log = new Logs({
            action:"Cambio de Contraseña",
            ipClient:req.ip,
            date:new Date(),
            user:response._id
        })

        const logSaved = log.save();

        res.status(200).json({message:'ok', token})
        

    }catch(err){
        res.status(500).json({token:null,message:"Error interno del servidor"});
    }
}

export const getUser = async (req,res) =>{
   
    try {
        const token = req.headers["x-access-token"];
        
        if(!token) return res.status(403).json({message:"No token provider"})
        
        const decode = jwt.verify(token,config.SECRET)
    
        const user = await User.findById(decode.id, {password:0,questionAnswer:0})
    
        if(!user) return res.status(404).json({message:"no user found"})
    
        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}


export const getUserByEmail = async(req, res) =>{
    try {

        const email = req.params.email

        const data = await User.aggregate([
            {
                $match:{email}
            },
            {
                $lookup:{
                    from:'secrets',
                    localField:'questionKey',
                    foreignField:'_id',
                    as:'questionKey'
                }
            },
            {
                $project:{password:0}
            }
    ])

        console.log("datos: ",data)
        if(!data || data.length === 0) return res.status(400).json({message:"usuario no encontrado"})

        res.status(200).json({message:'ok',data})

    } catch (err) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const forgotPasswordBySecretQuestion = async(req,res) =>{
    try {
        const {email, secret, respuestaSecreta} = req.body;

        const question = await secretQuestionModel.findOne({key:secret})

        if(!question) return res.status(400).json({message:"Información Incorrecta 1"})

        const resp = await User.findOne({$and:[{email:email}, {questionKey:question._id},{questionAnswer:respuestaSecreta}]})

        console.log(resp)

        if(!resp) return res.status(400).json({message:"Informacion Incorrecta"})

        res.status(200).json({message:"ok"})

    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const getQuestbyId = async(req,res) => {
    try {
        const question = req.params.id;

        const dataQuestion = await secretQuestionModel.findById(question);

        if(!dataQuestion) return res.status(400).json({messaje:'No Info'})

        res.status(200).json({
            message:'ok', dataQuestion
        })

    } catch (error) {
        res.status(500).json({message: "error interno del servidor"})
    }
}

export const singUp2 = async(req,res) =>{
    try {
        const {email, password} = req.body;
        const encrypt = await User.ecryptPassword(password);
        const newUser = new User({
            email,
            password:encrypt
        })


        const userSaved = await newUser.save();
        
        res.status(200).json({message:'ok',userSaved})

    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const pairCode = async(req,res) =>{
    try {
        const token = req.headers["x-access-token"];
        
        console.log(token)
        
        if(!token) return res.status(403).json({message:"No token provider"})

        const decode = jwt.verify(token,config.SECRET)

        const user = await User.findById(decode.id, {password:0,questionAnswer:0})

        if(!user) return res.status(404).json({message:"no user found"})

        const code = Math.floor(Math.random() * 1000000) + 100000;

        const verifyCode = await paircodeModel.findOne({user:user._id});

        if(verifyCode) return res.status(200).json({message:"El Código ya existe", code:verifyCode.code})

        const newCode = new paircodeModel({
            user:user._id,
            code:code
        })

        const codeSaved = await newCode.save();

        console.log(codeSaved)

        res.status(200).json({message:'ok',code:codeSaved.code})

    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}

export const loginPairCode = async(req,res) =>{
    try {
        const {code} = req.body; 

        const verifyCode = await paircodeModel.findOne({code:code});    

        if(!verifyCode) return res.status(404).json({message:"El Código no existe"})

        const user = await User.findById(verifyCode.user, {password:0,questionAnswer:0})

        if(!user) return res.status(404).json({message:"no user found"})

        const token = jwt.sign({id:user._id},config.SECRET,{    
            expiresIn:86400 //24 horas  
        })

        res.status(200).json({message:'ok',user,token})

    } catch (error) {
        res.status(500).json({message:"error interno del servidor"})
    }
}
