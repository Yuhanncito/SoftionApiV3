import { Schema, model } from "mongoose";


const userSchema = new Schema({
    nameTask: {
        type: String,
        require: true
    },
    descriptionTask: {
        type: String,
    },
    userTasks: [{
        ref:'users',
        type:Schema.Types.ObjectId
    }],
    timeHoursTaks:{
        type: Number,
    },
    projectRelation:{
        type: Schema.Types.ObjectId,
        ref:'projects',
        require:true
    },
    status:{
        type:String,
        default:"Pendiente"
    },
    dayForStart:{
        type:Date,
    }
},{
    timestamps: true,
    versionKey: false
});

export default model('Task',userSchema);