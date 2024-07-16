import Secret from "../models/secretQuestion.model";
import Privilege from "../models/privileges.model";
import DaysWorking from "../models/daysWorking.model";


export const generateDaysWorks = async(req,res) =>{
    try{
        const countDays = await DaysWorking.estimatedDocumentCount();

        if(countDays > 0) return

        const values = await Promise.all([
            new DaysWorking({
                day:'Lunes',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Martes',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Miercoles',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Jueves',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Viernes',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Sabado',
                startWorking:'07:00',
                endWorking:'18:00'
            }).save(),
            new DaysWorking({
                day:'Domingo',
                startWorking:'07:00',
                endWorking:'12:00'
            }).save()
        ])
        console.log("registró")
    }catch(err){

    }
}

export const generatePrivilege = async(req,res) =>{
    try {
        const countPri = await Privilege.estimatedDocumentCount();

        if(countPri > 0) return;

        const values = await Promise.all([
            new Privilege({
                name:"lectura"
            }).save(),
            new Privilege({
                name:"lectura y escritura"
            }).save()
        ])


    
    } catch (error) {
        
    }
}
export const generateQuestions = async(req,res) =>{
    try {
        const count = await Secret.estimatedDocumentCount();

        if(count > 0) return;

        const values = await Promise.all([
            new Secret({
                key:"colorFavorito",
                question:"¿Cuál es tu color favorito?"
            }).save(),
            new Secret({
                key:"nombreMascota",
                question:"¿Cómo se llama tu primera mascota?"
            }).save(),
            new Secret({
                key:"ciudadNacimiento",
                question:"¿En qué ciudad naciste?"
            }).save(),
            new Secret({
                key:"comidaFavorita",
                question:"¿Cuál es tu comida favorita?"
            }).save()
        ])


    
    } catch (error) {
        
    }
}