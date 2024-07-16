import { Schema, model } from "mongoose";


const userSchema = new Schema({
    idParticipate: {
        type:Schema.Types.ObjectId,
        ref:'users',
    },
    idPropietary:{
        type:Schema.Types.ObjectId,
        ref:'users',
    },
    idWorkSpace:{
        type:Schema.Types.ObjectId,
        ref:'workspaces',
    }
},{
    timestamps: true,
    versionKey: false
});


export default model('Invitation',userSchema);