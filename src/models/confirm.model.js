import { Schema, model } from "mongoose";


const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingresa un correo electrónico válido'],
    },
    secretCode:{
        type: String,
        unique:true
    },
},{
    timestamps: true,
    versionKey: false
});


export default model('Confirm',userSchema);