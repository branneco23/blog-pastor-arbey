import mongoose, { Schema, model, models } from 'mongoose';

// 1. ESQUEMA DE USUARIOS
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // 'select: false' oculta el hash por seguridad
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  // AGREGAMOS: Campo de estado para poder suspender
  status: { 
    type: String, 
    enum: ['active', 'suspended'], 
    default: 'active' 
  },
}, { timestamps: true });

// 2. ESQUEMA DE COMENTARIOS (Sub-documento)
const CommentSchema = new Schema({
  userName: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Recomendado para rastrear quién comentó
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. ESQUEMA DE BLOGS (POSTS)
const PostSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true }, // AGREGAMOS: Para el resumen de las tarjetas
  content: { type: String, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    default: 'Reflexión',
    enum: ["Fundamentos de Fe", "Salvación", "Bautismo", "Santidad", "Dones Espirituales", "Escatología", "Reflexión"]
  },
  readingTime: { type: String, default: '5 min' }, // AGREGAMOS: Para mostrar en la tarjeta
  reactions: {
    amen: { type: Number, default: 0 },
    gracias: { type: Number, default: 0 }
  },
  comments: [CommentSchema],
  isLive: { type: Boolean, default: false },
  youtubeId: { type: String, default: '' },
  isGlobalConfig: { type: Boolean, default: false } 
}, { timestamps: true });

// EXPORTACIÓN DE MODELOS
export const User = models.User || model('User', UserSchema);
export const Post = models.Post || model('Post', PostSchema);