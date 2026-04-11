import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // En Prisma 7, si tienes prisma.config.ts, no necesitas pasar nada aquí
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;