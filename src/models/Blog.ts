import { Schema, model, models } from 'mongoose';

const BlogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  content: { type: String, required: true },
  readingTime: { type: String, default: '5 min' },
  videoUrl: { type: String, default: '' },
  slug: { type: String },
}, { 
  timestamps: true 
});

// ELIMINAMOS EL MIDDLEWARE PRE-SAVE QUE DA EL ERROR "next is not a function"

export default models.Blog || model('Blog', BlogSchema);