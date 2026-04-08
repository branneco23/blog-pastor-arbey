import mongoose, { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'Reflexión' },
  reactions: {
    amen: { type: Number, default: 0 },
    gracias: { type: Number, default: 0 }
  },
  comments: [CommentSchema], // Gestión de comentarios
  isLive: { type: Boolean, default: false }
}, { timestamps: true });

export const Post = models.Post || model('Post', PostSchema);