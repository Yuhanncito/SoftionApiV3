import { Schema, model } from "mongoose";


const userSchema = new Schema({
    registration: {
        type: Object,
        required: true,
  },
    tocken:{
        type: String,
        required:false
    },
},{
    timestamps: true,
    versionKey: false
});


export default model('Notifications',userSchema);