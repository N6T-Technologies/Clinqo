import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import { Roles } from "@prisma/client";
import { Genders } from "@prisma/client";

const prismaClientSingleton = () => {
    return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type UserType = User;
export type UserRole = Roles;
export type Gender = Genders;
