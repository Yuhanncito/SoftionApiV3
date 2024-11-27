import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    url: {
      type: String,
      require: true,
    },
    nombre:{
        type: String,
        require: true,
      },
    icono: {
        type: String,
        require: true,
      },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Apps", userSchema);
