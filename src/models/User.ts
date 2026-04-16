import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user' },
  isBlocked: { type: Boolean, default: false },
  // Permisos granulares
  permissions: {
    canEditBlogs: { type: Boolean, default: false },
    canEditCategories: { type: Boolean, default: false },
    canEditTestimonies: { type: Boolean, default: false },
  }
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;