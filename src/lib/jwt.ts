import { SignJWT, jwtVerify } from 'jose';

// 🔐 Clave secreta
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clave_secreta_para_ipuc_neiva_2026'
);

// ✅ Payload compatible con jose
export interface AppJWTPayload {
  name: string;
  role: string;
  email?: string;
}

// ✅ Crear token (FIX TIPOS)
export async function signToken(payload: AppJWTPayload) {
  return await new SignJWT({ ...payload }) // 👈 importante
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

// ✅ Verificar token
export async function verifyToken(token: string): Promise<AppJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as AppJWTPayload;
  } catch (error) {
    return null;
  }
}