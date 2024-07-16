import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: String
},{
    timestamps:true,
    versionKey:false
});

export default model('Privilege',productSchema);