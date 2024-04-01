import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

// Initialize Prisma client
const client = globalThis.prisma || new PrismaClient()

// Assign Prisma client to global object only in non-production environment
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = client
}

export default client;
