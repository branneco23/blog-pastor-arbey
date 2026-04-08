import { SignJWT, jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'clave_secreta_para_ipuc_neiva_2026'
);

export async function createToken(payload: { id: string; role: string; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    // Agregamos un cast compatible con jose para evitar errores de tipo
    return payload as unknown as { id: string; role: string; email: string };
  } catch (error) {
    return null;
  }
}