import { Schema, model } from "mongoose";


const userSchema = new Schema({
    key:{
        type:String,
        require:true
    },
    question:{
        type:String,
        require:true
    }
},{
    timestamps: true,
    versionKey: false
});


export default model('Secret',userSchema);