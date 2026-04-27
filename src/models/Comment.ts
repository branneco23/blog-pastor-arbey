import mongoose, { Schema, model, models } from "mongoose";

// Definición del esquema para los comentarios
const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, "El contenido del comentario es obligatorio"],
      trim: true,
    },
    // Relación con el usuario que comenta
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Debe coincidir con el nombre del modelo User
      required: true,
    },
    // Relación con el blog donde se comenta
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", // Debe coincidir con el nombre del modelo Blog
      required: true,
    },
    // Campo opcional para moderación (si deseas ocultar comentarios inapropiados)
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Crea automáticamente 'createdAt' y 'updatedAt'
  }
);

// Validación para evitar errores al recargar en Next.js (Hot Reload)
const Comment = models.Comment || model("Comment", CommentSchema);

export default Comment;