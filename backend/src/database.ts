import { PrismaClient, User } from '@prisma/client'
const prisma = new PrismaClient()

export { prisma as database }
export type { User }