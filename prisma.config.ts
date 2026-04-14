//@ts-expect-error - Prisma CLI types are not available during build
import { defineConfig } from 'prisma'

export default defineConfig({
  datasource: {
    // tu configuración aquí...
      url: process.env.DATABASE_URL,
  }
})