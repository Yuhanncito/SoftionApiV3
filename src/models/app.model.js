import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    url: String,
    nombre: String,
    icono: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Apps", userSchema);
