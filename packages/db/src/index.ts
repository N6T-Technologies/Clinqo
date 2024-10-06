import { Clinic, PrismaClient, User } from "@prisma/client";

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
    DOCTOR = "DOCTOR",
    PATIENT = "PATIENT",
    CLINIC_HEAD = "CLINIC_HEAD",
    EMPLOYEE = "EMPLOYEE",
    ADMIN = "ADMIN",
}

export enum EmployeeDesignation {
    FRONT_DESK_MANAGER = "FRONT_DESK_MANAGER",
    CLINIC_HEAD = "CLINIC_HEAD",
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export enum Genders {
    MALE = " MALE",
    FEMALE = " FEMALE",
    OTHER = " OTHER",
}

export type UserType = User;
export type ClinicType = Clinic;

export default prisma;
