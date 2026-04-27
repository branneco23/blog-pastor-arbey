import mongoose, { Schema, model, models } from "mongoose";

const ReaccionSchema = new Schema({
  type: { type: String, enum: ['LIKE', 'DISLIKE'], required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true }
}, { timestamps: true });

// Evita que un usuario reaccione dos veces al mismo blog
ReaccionSchema.index({ userId: 1, blogId: 1 }, { unique: true });

export default models.Reaccion || model("Reaccion", ReaccionSchema);