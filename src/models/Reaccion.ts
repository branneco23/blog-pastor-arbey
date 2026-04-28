import mongoose from 'mongoose';

const ReaccionSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  userId: { type: String, required: true }, // ID del usuario (de localStorage o Auth)
  type: { type: String, enum: ['LIKE', 'DISLIKE'], required: true },
}, { timestamps: true });

// Evita que un usuario reaccione varias veces al mismo blog (índice único)
ReaccionSchema.index({ blogId: 1, userId: 1 }, { unique: true });

export default mongoose.models.Reaccion || mongoose.model('Reaccion', ReaccionSchema);