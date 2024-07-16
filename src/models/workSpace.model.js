import { Schema, model } from "mongoose";


const userSchema = new Schema({
    workSpaceName: {
        type: String,
        required: true,
    },
    propetaryUser:{
        type: String,
        required:true
    },
    projects:[{
        type: Schema.Types.ObjectId,
        ref:'projects'
    }],
    participates:[{
        user:{
            type: Schema.Types.ObjectId,
            ref:'users'
        },
        privileges:{
            type:Schema.Types.ObjectId,
            ref:'privilege'
        }
    },]
},{
    timestamps: true,
    versionKey: false
});


export default model('WorkSpace',userSchema);