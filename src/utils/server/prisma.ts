import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV !== 'production') {
  if (!(<any>global).prisma) {
    ;(<any>global).prisma = new PrismaClient()
  }
  prisma = (<any>global).prisma
} else {
  prisma = new PrismaClient()
}

export default prisma
