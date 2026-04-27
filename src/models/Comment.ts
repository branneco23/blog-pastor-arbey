import mongoose, { Schema, model, models } from "mongoose";

const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true }, // Enlace al blog específico
    estado: { type: String, enum: ["activo", "bloqueado"], default: "activo" }, // Para moderación
  },
  { timestamps: true },
);

export default models.Comment || model("Comment", CommentSchema);
