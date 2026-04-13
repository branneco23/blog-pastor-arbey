// src/models/Blog.ts
import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  
  // ANTES: imageUrl: String
  // AHORA: Debe ser un array de strings para soportar la galería
  imageUrl: { type: [String], required: true }, 
  
  videoUrl: { type: String },
  readingTime: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);