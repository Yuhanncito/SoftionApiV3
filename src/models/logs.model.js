import { Schema, model } from "mongoose";


const userSchema = new Schema({
    action: {
        type: String,
        require: true
    },
    ipClient: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    user: {
        type: String,
        require: true
    }
},{
    timestamps: true,
    versionKey: false
});


export default model('Logs',userSchema);