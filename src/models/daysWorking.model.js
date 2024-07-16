import { Schema, model } from "mongoose";


const userSchema = new Schema({
    day: {
        type: String,
    },
    startWorking:{
        type: String,
    },
    endWorking:{
        type: String
    }
},{
    timestamps: true,
    versionKey: false
});


export default model('DaysWorking',userSchema);