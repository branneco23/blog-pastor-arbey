// src/models/User.ts
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false }, // Nota: 'select: false' ocultará el password en las consultas
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["active", "suspended"],
    default: "active",
  },
});

// Cambia la última línea por estas dos:
const User = models.User || model('User', UserSchema);
export default User;