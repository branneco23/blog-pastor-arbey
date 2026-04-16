import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true, // Evita doctrinas duplicadas
    trim: true,
  }
}, { timestamps: true });

// Importante: models.Category evita que Next.js intente recrear el modelo en cada recarga
const Category = models.Category || model('Category', CategorySchema);

export default Category;