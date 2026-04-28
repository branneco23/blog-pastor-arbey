import mongoose, { Schema, model, models } from "mongoose";

// Importante: Asegúrate de que los modelos User y Blog existan para las referencias
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true, // Limpia espacios en blanco innecesarios
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El ID de usuario es obligatorio"],
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: [true, "El ID del blog es obligatorio"],
    },
    estado: {
      type: String,
      enum: ["activo", "bloqueado"],
      default: "activo",
    },
  },
  { timestamps: true },
);

export default models.Comment || model("Comment", CommentSchema);
