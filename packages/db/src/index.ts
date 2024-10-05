import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export enum UserRoles {
    DOCTRO = "DOCTOR",
    PATIENT = "PATIENT",
    CLINIC_HEAD = "CLINIC_HEAD",
    EMPLOYEE = "EMPLOYEE",
    ADMIN = "ADMIN",
}

export default prisma;
