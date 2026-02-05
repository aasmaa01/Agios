import { PrismaClient } from "../generated/prisma/client";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"]
})

export const connectDB= async()=>{
  try{
    await prisma.$connect();
    console.log("Connected database via Prisma!")

  } catch(error){
    console.error(`Database Connection error! ${error.message}`)

  }
}

export const disconnectDB= async()=>{
  await prisma.$disconnect();
}

