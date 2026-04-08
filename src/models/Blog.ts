import mongoose, { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  readingTime: { type: String, default: '5 min' },
  createdAt: { type: Date, default: Date.now },
});

// Esto evita errores de re-compilación en Next.js
const Blog = models.Blog || model('Blog', BlogSchema);
export default Blog;