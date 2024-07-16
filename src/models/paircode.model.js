import { Schema, model } from "mongoose";


const userSchema = new Schema({
    code:{
        type: Number,
        require: true,
        unique: true,
        minLength: [6, 'el Código debe de ser mayor a 6 caracteres'],
        maxLength: [6, 'el Código debe de ser menor a 6 caracteres']

    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
    
},{
    timestamps: true,
    versionKey: false
});


export default model('PairCode',userSchema);