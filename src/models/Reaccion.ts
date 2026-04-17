import mongoose, { Schema, model, models } from "mongoose";

// Definimos la interfaz para TypeScript
export interface IReaccion {
  userId: mongoose.Types.ObjectId;
  blogId: mongoose.Types.ObjectId;
  tipo: "like" | "love"; // Puedes añadir más como "insightful", etc.
  createdAt: Date;
}

const ReaccionSchema = new Schema<IReaccion>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo de Usuario
      required: [true, "El ID de usuario es obligatorio"],
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog", // Referencia al modelo de Blog/Enseñanza
      required: [true, "El ID del blog es obligatorio"],
    },
    tipo: {
      type: String,
      enum: ["like", "love"],
      default: "like",
    },
  },
  {
    timestamps: true, // Esto crea 'createdAt' y 'updatedAt' automáticamente
  }
);

// Índice único: Evita que un usuario reaccione varias veces al mismo blog
// Si intenta dar like otra vez, MongoDB lanzará un error o simplemente no lo creará
ReaccionSchema.index({ userId: 1, blogId: 1 }, { unique: true });

const Reaccion = models.Reaccion || model<IReaccion>("Reaccion", ReaccionSchema);

export default Reaccion;